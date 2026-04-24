import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Session ve user Supabase client tarafında AsyncStorage'e persist ediliyor.
// Bu store sadece canlı bellek state'i — persist middleware YOK (duplicate storage olmasın).

type AuthState = {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  isInitialized: boolean;
  isLoading: boolean;
};

type AuthActions = {
  setSession: (session: Session | null) => void;
  setGuest: (isGuest: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (value: boolean) => void;
  clear: () => void;
};

const initialState: AuthState = {
  session: null,
  user: null,
  isGuest: false,
  isInitialized: false,
  isLoading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      ...initialState,
      setSession: (session) =>
        set(
          { session, user: session?.user ?? null },
          false,
          'auth/setSession',
        ),
      setGuest: (isGuest) => set({ isGuest }, false, 'auth/setGuest'),
      setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),
      setInitialized: (value) =>
        set({ isInitialized: value }, false, 'auth/setInitialized'),
      clear: () =>
        set(
          { ...initialState, isInitialized: true },
          false,
          'auth/clear',
        ),
    }),
    { name: 'authStore', enabled: __DEV__ },
  ),
);
