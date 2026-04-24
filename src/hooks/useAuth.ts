import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import * as authApi from '@/api/auth';
import { AuthOperationError } from '@/api/auth';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuthStore } from '@/stores/authStore';
import { setGuestMode } from '@/utils/onboarding';

function getErrorMessage(error: unknown): string {
  if (error instanceof AuthOperationError) return error.userMessage;
  if (error instanceof Error) return error.message;
  return 'Bir hata oluştu, lütfen tekrar deneyin';
}

type SignInVariables = { email: string; password: string };
type SignUpVariables = { email: string; password: string; fullName: string };

export function useAuth() {
  const { showToast } = useToast();

  const {
    session,
    user,
    isGuest,
    isInitialized,
    isLoading,
    setSession,
    setGuest,
    clear,
  } = useAuthStore(
    useShallow((s) => ({
      session: s.session,
      user: s.user,
      isGuest: s.isGuest,
      isInitialized: s.isInitialized,
      isLoading: s.isLoading,
      setSession: s.setSession,
      setGuest: s.setGuest,
      clear: s.clear,
    })),
  );

  const signIn = useMutation({
    mutationFn: ({ email, password }: SignInVariables) =>
      authApi.signIn(email, password),
    onSuccess: async (newSession) => {
      setSession(newSession);
      await setGuestMode(false);
      setGuest(false);
      showToast('Giriş başarılı', 'success');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const signUp = useMutation({
    mutationFn: ({ email, password, fullName }: SignUpVariables) =>
      authApi.signUp(email, password, fullName),
    onSuccess: async (result) => {
      await setGuestMode(false);
      setGuest(false);
      // Session dolu dönerse (confirm email kapalı) direkt oturum aç.
      if (result.session) {
        setSession(result.session);
        showToast('Kayıt başarılı', 'success');
      } else {
        showToast('Kayıt oluşturuldu, email doğrulaması gerekiyor', 'info');
      }
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const signOut = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: async () => {
      clear();
      await setGuestMode(false);
      showToast('Çıkış yapıldı', 'info');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const resetPassword = useMutation({
    mutationFn: (email: string) => authApi.resetPassword(email),
    onSuccess: () => {
      showToast('Şifre sıfırlama bağlantısı gönderildi', 'success');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const resendVerificationEmail = useMutation({
    mutationFn: (email: string) => authApi.resendVerificationEmail(email),
    onSuccess: () => {
      showToast('Doğrulama emaili tekrar gönderildi', 'success');
    },
    onError: (err) => showToast(getErrorMessage(err), 'error'),
  });

  const startGuest = async () => {
    await setGuestMode(true);
    setGuest(true);
  };

  const exitGuest = async () => {
    await setGuestMode(false);
    setGuest(false);
  };

  return {
    // Canlı state
    session,
    user,
    isAuthenticated: !!session,
    isGuest,
    isInitialized,
    isLoading,

    // Mutations (her birinin .mutate / .isPending / .error erişimi var)
    signIn,
    signUp,
    signOut,
    resetPassword,
    resendVerificationEmail,

    // Guest mode
    startGuest,
    exitGuest,
  };
}
