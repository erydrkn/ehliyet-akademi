import { type Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { markOnboardingSeen } from '@/utils/onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Slide = {
  emoji: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    emoji: '🚗',
    title: 'Ehliyet sınavına hazırlanmanın en akıllı yolu',
    subtitle: '2026 MEB müfredatı, binlerce soru, anlık geri bildirim.',
  },
  {
    emoji: '🤖',
    title: 'AI ile yanlışlarını anla',
    subtitle:
      'Her yanlış cevabının nedenini Claude AI ile öğren, bir daha tekrar etme.',
  },
  {
    emoji: '📊',
    title: 'Kişisel program seninle',
    subtitle: 'Zayıf konularını tespit eder, sana özel pratik sunarız.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { startGuest } = useAuth();

  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (i !== activeIndex) setActiveIndex(i);
  };

  const goNext = () => {
    if (isLastSlide) return;
    scrollRef.current?.scrollTo({
      x: (activeIndex + 1) * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleRegister = async () => {
    await markOnboardingSeen();
    router.replace('/register' as Href);
  };

  const handleGuest = async () => {
    await markOnboardingSeen();
    await startGuest();
    // Root layout isGuest değişimini algılayıp /(tabs)'a yönlendirir.
  };

  const handleSkip = async () => {
    await markOnboardingSeen();
    router.replace('/login' as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-row justify-end px-6 py-3">
        {!isLastSlide && (
          <Button onPress={handleSkip} variant="ghost" size="sm">
            Atla
          </Button>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {slides.map((slide, idx) => (
          <View
            key={idx}
            style={{ width: SCREEN_WIDTH }}
            className="items-center justify-center gap-6 px-8"
          >
            <View className="h-32 w-32 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Typography style={{ fontSize: 72 }}>{slide.emoji}</Typography>
            </View>
            <Typography variant="h2" align="center">
              {slide.title}
            </Typography>
            <Typography color="secondary" align="center">
              {slide.subtitle}
            </Typography>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-center gap-2 py-4">
        {slides.map((_, idx) => (
          <View
            key={idx}
            className={`h-2 rounded-full ${
              idx === activeIndex
                ? 'w-6 bg-blue-600'
                : 'w-2 bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </View>

      <View className="gap-3 p-6">
        {isLastSlide ? (
          <>
            <Button onPress={handleRegister} fullWidth>
              Kayıt Ol
            </Button>
            <Button onPress={handleGuest} variant="secondary" fullWidth>
              Misafir Olarak Devam Et
            </Button>
          </>
        ) : (
          <Button onPress={goNext} fullWidth>
            Devam
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
