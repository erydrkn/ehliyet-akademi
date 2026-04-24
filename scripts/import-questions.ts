import 'dotenv/config';

/**
 * assets/data/questions.json'daki soruları Supabase'e yükler.
 *
 * - SERVICE_ROLE_KEY kullanır (RLS bypass).
 * - Idempotent: ON CONFLICT (external_id) DO NOTHING semantiği.
 * - 100'lük batch'ler halinde upsert yapar.
 *
 * Çalıştırma: npx tsx scripts/import-questions.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

type QuestionInsert = {
  external_id: string;
  category: string;
  difficulty: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  tags: string[];
};

const REQUIRED_FIELDS: readonly (keyof QuestionInsert)[] = [
  'external_id',
  'category',
  'difficulty',
  'question_text',
  'option_a',
  'option_b',
  'option_c',
  'option_d',
  'correct_answer',
  'explanation',
  'tags',
];

const BATCH_SIZE = 100;
const QUESTIONS_PATH = resolve(__dirname, '../assets/data/questions.json');

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function validateQuestion(raw: unknown, index: number): QuestionInsert {
  if (!isRecord(raw)) {
    throw new Error(`Soru #${index}: obje değil`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in raw)) {
      throw new Error(`Soru #${index}: "${field}" alanı eksik`);
    }
  }

  const {
    external_id,
    category,
    difficulty,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
    tags,
  } = raw;

  if (typeof external_id !== 'string' || external_id.length === 0) {
    throw new Error(`Soru #${index}: external_id string olmalı`);
  }
  if (typeof category !== 'string') {
    throw new Error(`Soru #${index} (${external_id}): category string olmalı`);
  }
  if (typeof difficulty !== 'number' || !Number.isInteger(difficulty)) {
    throw new Error(`Soru #${index} (${external_id}): difficulty integer olmalı`);
  }
  if (typeof question_text !== 'string' || question_text.length === 0) {
    throw new Error(`Soru #${index} (${external_id}): question_text boş olamaz`);
  }
  if (
    typeof option_a !== 'string' ||
    typeof option_b !== 'string' ||
    typeof option_c !== 'string' ||
    typeof option_d !== 'string'
  ) {
    throw new Error(`Soru #${index} (${external_id}): option_a/b/c/d string olmalı`);
  }
  if (typeof correct_answer !== 'string' || correct_answer.length === 0) {
    throw new Error(`Soru #${index} (${external_id}): correct_answer boş olamaz`);
  }
  if (typeof explanation !== 'string') {
    throw new Error(`Soru #${index} (${external_id}): explanation string olmalı`);
  }
  if (!isStringArray(tags)) {
    throw new Error(`Soru #${index} (${external_id}): tags string array olmalı`);
  }

  return {
    external_id,
    category,
    difficulty,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
    tags,
  };
}

function loadQuestions(): QuestionInsert[] {
  const fileContents = readFileSync(QUESTIONS_PATH, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileContents);
  } catch (err) {
    throw new Error(`questions.json parse hatası: ${(err as Error).message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`questions.json kök eleman array değil`);
  }

  if (parsed.length === 0) {
    throw new Error(`questions.json boş — yüklenecek soru yok`);
  }

  return parsed.map((raw, i) => validateQuestion(raw, i));
}

async function main(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL veya EXPO_PUBLIC_SUPABASE_URL .env dosyasında bulunamadı.');
    process.exit(1);
  }
  if (!serviceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY .env dosyasında bulunamadı.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const questions = loadQuestions();
  console.log(`📖 ${questions.length} soru okundu, yükleme başlıyor...`);
  console.log('');

  const totalBatches = Math.ceil(questions.length / BATCH_SIZE);
  let totalInserted = 0;
  let totalDuplicates = 0;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    const { data, error } = await supabase
      .from('questions')
      .upsert(batch, {
        onConflict: 'external_id',
        ignoreDuplicates: true,
      })
      .select('external_id');

    if (error) {
      console.error(`❌ Batch ${batchNum}/${totalBatches} hata: ${error.message}`);
      process.exit(1);
    }

    const inserted = data?.length ?? 0;
    const duplicates = batch.length - inserted;
    console.log(`📦 Batch ${batchNum}/${totalBatches}: ${inserted} yeni, ${duplicates} duplicate`);

    totalInserted += inserted;
    totalDuplicates += duplicates;
  }

  console.log('');
  console.log('─────────────────────────');
  console.log(`✅ Toplam:    ${questions.length} soru işlendi`);
  console.log(`➕ Yeni:      ${totalInserted} soru`);
  console.log(`⏭️  Duplicate: ${totalDuplicates} soru`);
  console.log('─────────────────────────');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`❌ Beklenmeyen hata: ${message}`);
  process.exit(1);
});
