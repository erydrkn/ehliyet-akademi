import { supabase } from '@/lib/supabase';
import type { QuestionFilters } from '@/constants/query-keys';
import type { TopicId } from '@/constants/topics';
import type { Question } from '@/types/database';

export async function fetchQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
  let query = supabase.from('questions').select('*').eq('is_active', true);

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Sorular yüklenemedi: ${error.message}`);
  }
  return data ?? [];
}

export async function fetchQuestionById(id: number): Promise<Question> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Soru bulunamadı: ${error.message}`);
  }
  if (!data) {
    throw new Error('Soru mevcut değil');
  }
  return data;
}

export async function fetchQuestionsByCategory(
  category: QuestionFilters['category'],
  limit?: number,
): Promise<Question[]> {
  return fetchQuestions({ category, limit });
}

export async function fetchRandomQuestions(
  count: number = 10,
  filters: Omit<QuestionFilters, 'limit'> = {},
): Promise<Question[]> {
  let query = supabase.from('questions').select('*').eq('is_active', true);

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  const { data, error } = await query.limit(count * 3);
  if (error) {
    throw new Error(`Rastgele sorular yüklenemedi: ${error.message}`);
  }
  if (!data) {
    return [];
  }

  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function fetchTopicQuestions(
  topicId: TopicId,
  count: number = 10,
): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic', topicId)
    .eq('is_active', true)
    .limit(count * 3);

  if (error) {
    throw new Error(`${topicId} soruları yüklenemedi: ${error.message}`);
  }
  if (!data) return [];

  // Fisher-Yates shuffle
  const shuffled = [...data];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
