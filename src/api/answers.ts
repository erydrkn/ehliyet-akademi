import { supabase } from '@/lib/supabase';
import type { UserAnswer, UserAnswerInsert } from '@/types/database';

export async function submitAnswer(input: UserAnswerInsert): Promise<UserAnswer> {
  const { data, error } = await supabase
    .from('user_answers')
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(`Cevap kaydedilemedi: ${error.message}`);
  }
  if (!data) {
    throw new Error('Cevap kaydedilemedi');
  }
  return data;
}

export async function getUserAnswers(userId: string): Promise<UserAnswer[]> {
  const { data, error } = await supabase
    .from('user_answers')
    .select('*')
    .eq('user_id', userId)
    .order('answered_at', { ascending: false });

  if (error) {
    throw new Error(`Cevaplar yüklenemedi: ${error.message}`);
  }
  return data ?? [];
}

export async function getUserAnswerForQuestion(
  userId: string,
  questionId: number,
): Promise<UserAnswer | null> {
  const { data, error } = await supabase
    .from('user_answers')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Cevap durumu kontrol edilemedi: ${error.message}`);
  }
  return data;
}
