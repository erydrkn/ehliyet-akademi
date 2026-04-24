import { AuthError, type Session, type User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Türkçe hata eşleştirmesi
// ---------------------------------------------------------------------------

export class AuthOperationError extends Error {
  readonly userMessage: string;
  readonly originalError?: unknown;

  constructor(userMessage: string, originalError?: unknown) {
    super(userMessage);
    this.name = 'AuthOperationError';
    this.userMessage = userMessage;
    this.originalError = originalError;
  }
}

function mapAuthError(error: AuthError): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Email veya şifre hatalı';
  }
  if (message.includes('email not confirmed')) {
    return 'Email adresinizi doğrulamanız gerekiyor';
  }
  if (message.includes('user already registered')) {
    return 'Bu email adresi zaten kayıtlı';
  }
  if (message.includes('password should be at least')) {
    return 'Şifre en az 8 karakter olmalı';
  }
  if (message.includes('unable to validate email address')) {
    return 'Geçerli bir email adresi girin';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Çok fazla deneme yaptınız, lütfen biraz bekleyin';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'İnternet bağlantınızı kontrol edin';
  }
  if (message.includes('user not found')) {
    return 'Bu email adresi kayıtlı değil';
  }
  return 'Bir hata oluştu, lütfen tekrar deneyin';
}

function fail(error: unknown): never {
  if (error instanceof AuthError) {
    throw new AuthOperationError(mapAuthError(error), error);
  }
  throw new AuthOperationError('Bir hata oluştu, lütfen tekrar deneyin', error);
}

// ---------------------------------------------------------------------------
// Auth işlemleri
// ---------------------------------------------------------------------------

export type SignUpResult = {
  user: User | null;
  session: Session | null;
  needsEmailVerification: boolean;
};

export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) fail(error);

  return {
    user: data.user,
    session: data.session,
    needsEmailVerification: data.session === null,
  };
}

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) fail(error);
  if (!data.session) {
    throw new AuthOperationError('Oturum oluşturulamadı, lütfen tekrar deneyin');
  }
  return data.session;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) fail(error);
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) fail(error);
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) fail(error);
  return data.session;
}

export async function resendVerificationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) fail(error);
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
