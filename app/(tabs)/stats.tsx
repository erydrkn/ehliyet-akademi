import { type Href, useRouter } from 'expo-router';
import { BarChart3, Flame } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryStatsCard } from '@/components/stats/CategoryStatsCard';
import { ExamHistoryCard } from '@/components/stats/ExamHistoryCard';
import { OverallStatsCard } from '@/components/stats/OverallStatsCard';
import { WeakCategoriesCard } from '@/components/stats/WeakCategoriesCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useExamHistory } from '@/hooks/useExamHistory';
import { useTheme } from '@/hooks/useTheme';
import { useUserStats, useWeakCategories } from '@/hooks/useUserStats';
import type { QuestionCategory } from '@/types/database';

const CATEGORY_ORDER: QuestionCategory[] = [
  'trafik',
  'ilk_yardim',
  'motor',
  'trafik_adabi',
];

function streakMessage(days: number): string {
  if (days === 0) return 'Hadi başla!';
  if (days < 3) return 'İyi gidiyorsun!';
  if (days < 7) return 'Tebrikler! Devam et 💪';
  return '🔥 Harikasın!';
}

export default function StatsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, isGuest, exitGuest } = useAuth();

  const userId = isGuest ? undefined : user?.id;
  const statsQuery = useUserStats(userId);
  const weakQuery = useWeakCategories(userId);
  const historyQuery = useExamHistory(userId, 5);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        statsQuery.refetch(),
        weakQuery.refetch(),
        historyQuery.refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateAccount = async () => {
    await exitGuest();
    router.replace('/register' as Href);
  };

  if (isGuest) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <BarChart3 size={64} color={colors.textMuted} />
          <Typography variant="h2" align="center">
            İstatistiklerin burada görünecek
          </Typography>
          <Typography color="muted" align="center">
            Quiz ve sınavlarda gösterdiğin performansı buradan takip
            edebilirsin.
          </Typography>
          <Card padding="md" className="w-full">
            <View className="gap-3">
              <Typography weight="semibold">⚠️ Misafir modundasın</Typography>
              <Typography variant="caption" color="secondary">
                İlerlemen kaydedilmiyor.
              </Typography>
              <Button onPress={handleCreateAccount} fullWidth>
                Hesap Aç (Ücretsiz)
              </Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (statsQuery.isLoading && !statsQuery.data) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top']}
      >
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (statsQuery.isError && !statsQuery.data) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            İstatistikler yüklenemedi
          </Typography>
          <Typography color="muted" align="center">
            İnternet bağlantını kontrol et ve tekrar dene.
          </Typography>
          <Button onPress={() => statsQuery.refetch()} fullWidth>
            Tekrar Dene
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const stats = statsQuery.data;

  if (!stats || stats.total_questions === 0) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <BarChart3 size={64} color={colors.textMuted} />
          <Typography variant="h2" align="center">
            Henüz hiç soru çözmedin
          </Typography>
          <Typography color="muted" align="center">
            Çalış sekmesinden başla ve istatistiklerini burada gör.
          </Typography>
          <Button
            onPress={() => router.push('/(tabs)/study' as Href)}
            fullWidth
          >
            Çalış&apos;a Git
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const breakdown = stats.category_breakdown;
  const history = historyQuery.data ?? [];
  const weak = weakQuery.data ?? [];

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top']}
    >
      <ScrollView
        contentContainerClassName="flex-grow p-4 gap-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Card padding="lg" className="bg-amber-50 dark:bg-amber-950/40">
          <View className="items-center gap-2">
            <Flame size={48} color="#F59E0B" />
            <Typography variant="h1" align="center">
              {stats.streak_days} gün
            </Typography>
            <Typography color="muted" align="center">
              {streakMessage(stats.streak_days)}
            </Typography>
          </View>
        </Card>

        <OverallStatsCard stats={stats} />

        <View className="gap-3">
          <Typography variant="h3">Kategori Performansı</Typography>
          {CATEGORY_ORDER.map((cat) => {
            const data = breakdown?.[cat];
            return (
              <CategoryStatsCard
                key={cat}
                category={cat}
                solved={data?.solved ?? 0}
                correct={data?.correct ?? 0}
              />
            );
          })}
        </View>

        {weak.length > 0 && (
          <WeakCategoriesCard
            weakCategories={weak}
            onPressStudy={(cat) =>
              router.push(`/quiz/${cat}` as Href)
            }
          />
        )}

        {history.length > 0 ? (
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Typography variant="h3">🎓 Geçmiş Sınavlar</Typography>
              <Pressable
                onPress={() => router.push('/exam/history' as Href)}
                accessibilityRole="button"
                accessibilityLabel="Tüm sınavları gör"
              >
                <Typography
                  variant="body"
                  weight="semibold"
                  color="primary"
                >
                  Tümünü Gör →
                </Typography>
              </Pressable>
            </View>
            {history.map((session) => (
              <ExamHistoryCard
                key={session.id}
                session={session}
                onPress={() =>
                  router.push(`/exam/review/${session.id}` as Href)
                }
              />
            ))}
          </View>
        ) : (
          <Card padding="md">
            <View className="gap-3">
              <Typography variant="body" align="center">
                Henüz hiç sınav yapmadın
              </Typography>
              <Typography variant="caption" color="muted" align="center">
                Deneme sınavı ile gerçek MTSK simülasyonunu dene.
              </Typography>
              <Button
                onPress={() => router.push('/exam' as Href)}
                fullWidth
              >
                Deneme Sınavı Yap
              </Button>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
