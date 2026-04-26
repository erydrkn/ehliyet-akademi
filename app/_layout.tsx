import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { type Href, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { getSession, onAuthStateChange } from '@/api/auth';
import { Spinner } from '@/components/ui/Spinner';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { initializeAds, preloadInterstitial } from '@/lib/ads';
import { useAuthStore } from '@/stores/authStore';
import { getGuestMode, hasSeenOnboarding } from '@/utils/onboarding';

import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    initializeAds().then(() => {
      setTimeout(() => {
        preloadInterstitial();
      }, 5000);
    });
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <ToastProvider>
              <StatusBar style="auto" />
              <AuthBootstrap>
                <Stack screenOptions={{ headerShown: false }} />
              </AuthBootstrap>
            </ToastProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ---------------------------------------------------------------------------
// Auth bootstrap + protected route yönlendirmesi
// ---------------------------------------------------------------------------

function AuthBootstrap({ children }: { children: ReactNode }) {
  const { setSession, setGuest, setInitialized, isInitialized } = useAuthStore(
    useShallow((s) => ({
      setSession: s.setSession,
      setGuest: s.setGuest,
      setInitialized: s.setInitialized,
      isInitialized: s.isInitialized,
    })),
  );
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const [session, guestMode, seen] = await Promise.all([
          getSession(),
          getGuestMode(),
          hasSeenOnboarding(),
        ]);
        if (!mounted) return;
        setSession(session);
        setGuest(guestMode);
        setOnboardingSeen(seen);
      } catch {
        // Bootstrap hatası — yine de initialize et ki uygulama kilitlenmesin.
        if (mounted) setOnboardingSeen(false);
      } finally {
        if (mounted) setInitialized(true);
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = onAuthStateChange((session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setGuest, setInitialized]);

  useProtectedRoute(onboardingSeen);

  if (!isInitialized || onboardingSeen === null) {
    return <SplashView />;
  }

  return <>{children}</>;
}

function useProtectedRoute(onboardingSeen: boolean | null) {
  const segments = useSegments();
  const router = useRouter();
  const { session, isGuest, isInitialized } = useAuthStore(
    useShallow((s) => ({
      session: s.session,
      isGuest: s.isGuest,
      isInitialized: s.isInitialized,
    })),
  );

  useEffect(() => {
    if (!isInitialized || onboardingSeen === null) return;

    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === '(auth)';
    const inTabsGroup = firstSegment === '(tabs)';
    const onOnboarding = firstSegment === 'onboarding';
    const isAuthenticated = !!session || isGuest;

    if (!onboardingSeen && !onOnboarding) {
      router.replace('/onboarding' as Href);
      return;
    }

    if (onboardingSeen && !isAuthenticated && !inAuthGroup && !onOnboarding) {
      router.replace('/login' as Href);
      return;
    }

    if (isAuthenticated && (inAuthGroup || onOnboarding)) {
      router.replace('/' as Href);
      return;
    }

    // Kullanıcı showcase/test-data gibi dev rotalara erişebilir — dokunma.
    void inTabsGroup;
  }, [segments, session, isGuest, isInitialized, onboardingSeen, router]);
}

function SplashView() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Spinner size="lg" />
    </View>
  );
}
