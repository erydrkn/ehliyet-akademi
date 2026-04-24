/**
 * assets/data/q-*.json batch dosyalarını tek bir questions.json'a birleştirir.
 * - Kategori normalizasyonu yapar
 * - Her soruyu validate eder
 * - Her soruya unique external_id atar: q_<kategori>_<3 haneli sıra>
 * - Hatalı soruları konsola raporlar, geçerli olanları dahil etmeye devam eder
 *
 * Çalıştırma: npx tsx scripts/merge-batches.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

type Category = 'ilk_yardim' | 'trafik' | 'motor' | 'trafik_adabi';

type ValidQuestion = {
  external_id: string;
  category: Category;
  difficulty: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  tags: string[];
};

const CATEGORY_ALIASES: Record<string, Category> = {
  ilkyardim: 'ilk_yardim',
  ilk_yardim: 'ilk_yardim',
  trafik: 'trafik',
  motor: 'motor',
  trafikadabi: 'trafik_adabi',
  trafik_adabi: 'trafik_adabi',
};

const CATEGORY_LABELS: Record<Category, string> = {
  ilk_yardim: 'İlk Yardım',
  trafik: 'Trafik',
  motor: 'Motor',
  trafik_adabi: 'Trafik Adabı',
};

const CATEGORY_ORDER: Category[] = ['ilk_yardim', 'trafik', 'motor', 'trafik_adabi'];

const DATA_DIR = resolve(__dirname, '../assets/data');
const OUTPUT_PATH = join(DATA_DIR, 'questions.json');
const BATCH_FILE_REGEX = /^q-.+-\d+\.json$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === 'string');
}

function validateAndNormalize(raw: unknown, file: string, index: number): ValidQuestion | string {
  if (typeof raw !== 'object' || raw === null) {
    return `soru obje değil`;
  }
  const q = raw as Record<string, unknown>;

  const rawCategory = q.category;
  if (typeof rawCategory !== 'string') {
    return `category eksik veya string değil`;
  }
  const category = CATEGORY_ALIASES[rawCategory];
  if (!category) {
    return `tanınmayan category: "${rawCategory}"`;
  }

  if (typeof q.difficulty !== 'number' || !Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 5) {
    return `difficulty 1-5 arası integer olmalı (alınan: ${String(q.difficulty)})`;
  }

  if (!isNonEmptyString(q.question_text)) return `question_text boş`;
  if (!isNonEmptyString(q.option_a)) return `option_a boş`;
  if (!isNonEmptyString(q.option_b)) return `option_b boş`;
  if (!isNonEmptyString(q.option_c)) return `option_c boş`;
  if (!isNonEmptyString(q.option_d)) return `option_d boş`;
  if (!isNonEmptyString(q.explanation)) return `explanation boş`;

  if (q.correct_answer !== 'A' && q.correct_answer !== 'B' && q.correct_answer !== 'C' && q.correct_answer !== 'D') {
    return `correct_answer A/B/C/D olmalı (alınan: ${String(q.correct_answer)})`;
  }

  if (!isStringArray(q.tags)) {
    return `tags en az 1 elemanlı string dizisi olmalı`;
  }

  return {
    external_id: '', // sonradan atanacak
    category,
    difficulty: q.difficulty,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    tags: q.tags,
  };
}

function pad3(n: number): string {
  return n.toString().padStart(3, '0');
}

function main(): void {
  const files = readdirSync(DATA_DIR)
    .filter((f) => BATCH_FILE_REGEX.test(f))
    .sort();

  if (files.length === 0) {
    console.error(`❌ ${DATA_DIR} içinde q-*.json dosyası bulunamadı.`);
    process.exit(1);
  }

  const questions: ValidQuestion[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const fullPath = join(DATA_DIR, file);
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(fullPath, 'utf-8'));
    } catch (err) {
      errors.push(`❌ ${file}: JSON parse hatası — ${(err as Error).message}`);
      continue;
    }
    if (!Array.isArray(parsed)) {
      errors.push(`❌ ${file}: kök eleman array değil`);
      continue;
    }

    parsed.forEach((raw, idx) => {
      const result = validateAndNormalize(raw, file, idx);
      if (typeof result === 'string') {
        errors.push(`❌ ${file}[${idx}]: ${result}`);
        return;
      }
      questions.push(result);
    });
  }

  // Kategori bazlı sıralama (CATEGORY_ORDER sırasıyla, içinde oluş sırası korunur)
  const byCategory: Record<Category, ValidQuestion[]> = {
    ilk_yardim: [],
    trafik: [],
    motor: [],
    trafik_adabi: [],
  };
  for (const q of questions) {
    byCategory[q.category].push(q);
  }

  // external_id atama
  for (const cat of CATEGORY_ORDER) {
    byCategory[cat].forEach((q, i) => {
      q.external_id = `q_${cat}_${pad3(i + 1)}`;
    });
  }

  const merged: ValidQuestion[] = CATEGORY_ORDER.flatMap((cat) => byCategory[cat]);

  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8');

  // Raporlama
  const maxLabelLen = Math.max(...CATEGORY_ORDER.map((c) => CATEGORY_LABELS[c].length));
  console.log('');
  for (const cat of CATEGORY_ORDER) {
    const label = CATEGORY_LABELS[cat].padEnd(maxLabelLen, ' ');
    const count = byCategory[cat].length.toString().padStart(4, ' ');
    console.log(`✅ ${label}: ${count} soru`);
  }
  console.log('─────────────────────────');
  const totalStr = merged.length.toString().padStart(4, ' ');
  console.log(`📊 TOPLAM     : ${totalStr} soru`);
  console.log('');
  console.log(`📁 Çıktı: ${OUTPUT_PATH}`);

  if (errors.length > 0) {
    console.log('');
    console.log(`⚠️  ${errors.length} hata bulundu:`);
    for (const e of errors) console.log(`   ${e}`);
    process.exit(1);
  }
}

main();
