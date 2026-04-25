import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { CATEGORIES } from '@/constants/categories';
import { useAuth } from '@/hooks/useAuth';
import type { QuestionCategory } from '@/types/database';

type Feedback = {
  emoji: string;
  message: string;
};

function getFeedback(pct: number): Feedback {
  if (pct >= 80) return { emoji: '🌟', message: 'Harika!' };
  if (pct >= 60) return { emoji: '👍', message: 'İyi gidiyorsun!' };
  if (pct >= 40) return { emoji: '💪', message: 'Daha çok pratik gerek' };
  return { emoji: '📚', message: 'Tekrar başlayalım' };
}

function isValidCategory(value: string | undefined): value is QuestionCategory {
  return !!value && CATEGORIES.some((c) => c.category === value);
}

export default function QuizResultScreen() {
  const router = useRouter();
  const { isGuest, exitGuest } = useAuth();
  const params = useLocalSearchParams<{
    correct?: string;
    total?: string;
    category?: string;
  }>();

  const correct = Math.max(0, Number(params.correct ?? 0));
  const total = Math.max(1, Number(params.total ?? 10));
  const pct = Math.round((correct / total) * 100);
  const feedback = getFeedback(pct);
  const validCategory = isValidCategory(params.category) ? params.category : null;

  const handleRetry = () => {
    if (validCategory) {
      router.replace(`/quiz/${validCategory}` as Href);
    } else {
      router.replace('/(tabs)' as Href);
    }
  };

  const handleHome = () => {
    router.replace('/(tabs)' as Href);
  };

  const handleCreateAccount = async () => {
    await exitGuest();
    router.replace('/register' as Href);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerClassName="flex-grow p-6 gap-6">
        <View className="items-center gap-2 pt-6">
          <Typography className="text-6xl" align="center">
            🎯
          </Typography>
          <Typography variant="h2" align="center">
            Quiz Tamamlandı!
          </Typography>
        </View>

        <Card padding="lg">
          <View className="items-center gap-3">
            <Typography variant="h1" align="center">
              {correct} / {total}
            </Typography>
            <Typography variant="h3" color="muted" align="center">
              %{pct} başarı
            </Typography>
            <View className="flex-row items-center gap-2 pt-2">
              <Typography variant="h3">{feedback.emoji}</Typography>
              <Typography variant="body" weight="semibold">
                {feedback.message}
              </Typography>
            </View>
          </View>
        </Card>

        {isGuest && (
          <Card padding="md">
            <View className="gap-3">
              <Typography weight="semibold">
                ⚠️ İlerlemen kaydedilmedi
              </Typography>
              <Typography variant="caption" color="secondary">
                Misafir modunda çözdüğün sorular saklanmaz. 💎 Kayıt ol ve
                tüm ilerlemeyi takip et!
              </Typography>
              <Button onPress={handleCreateAccount} fullWidth>
                Hesap Aç (Ücretsiz)
              </Button>
            </View>
          </Card>
        )}

        <View className="gap-3">
          <Button onPress={handleRetry} fullWidth>
            Tekrar Çöz
          </Button>
          <Button variant="secondary" onPress={handleHome} fullWidth>
            Ana Sayfa
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
