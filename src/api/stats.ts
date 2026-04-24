import { supabase } from '@/lib/supabase';
import type { UserStatsResult, WeakCategoryResult } from '@/types/database';

export async function getUserStats(userId: string): Promise<UserStatsResult> {
  const { data, error } = await supabase.rpc('calculate_user_stats', {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(`İstatistikler yüklenemedi: ${error.message}`);
  }
  if (!data) {
    throw new Error('İstatistik verisi alınamadı');
  }
  return data;
}

export async function getWeakCategories(
  userId: string,
  limit: number = 3,
): Promise<WeakCategoryResult[]> {
  const { data, error } = await supabase.rpc('get_weak_categories', {
    p_user_id: userId,
    p_limit: limit,
  });

  if (error) {
    throw new Error(`Zayıf kategoriler yüklenemedi: ${error.message}`);
  }
  return data ?? [];
}

export async function updateStreak(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('update_streak', {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(`Streak güncellenemedi: ${error.message}`);
  }
  return data ?? 0;
}
