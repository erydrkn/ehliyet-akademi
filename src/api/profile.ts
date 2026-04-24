import { supabase } from '@/lib/supabase';
import type { UserProfile, UserProfileUpdate } from '@/types/database';

export async function getProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(`Profil yüklenemedi: ${error.message}`);
  }
  if (!data) {
    throw new Error('Profil bulunamadı');
  }
  return data;
}

export async function updateProfile(
  userId: string,
  updates: UserProfileUpdate,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Profil güncellenemedi: ${error.message}`);
  }
  if (!data) {
    throw new Error('Profil güncellenemedi');
  }
  return data;
}
