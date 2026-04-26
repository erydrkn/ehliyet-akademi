import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/ads/AdBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ExamCTACard } from '@/components/home/ExamCTACard';
import { StreakCard } from '@/components/home/StreakCard';
import { TodayProgressCard } from '@/components/home/TodayProgressCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { useUserStats } from '@/hooks/useUserStats';
import type { QuestionCategory } from '@/types/database';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, isGuest, exitGuest } = useAuth();

  const userId = isGuest ? undefined : user?.id;
  const statsQuery = useUserStats(userId);
  const profileQuery = useProfile(user?.id, { enabled: !isGuest && !!user });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const rawName = (user?.user_metadata?.full_name as string | undefined) ?? null;
  const metadataFirstName = rawName?.split(' ')[0] ?? null;
  const profileFirstName =
    profileQuery.data?.full_name?.split(' ')[0] ?? null;
  const firstName = metadataFirstName ?? profileFirstName;

  const greetingName = isGuest
    ? 'Misafir Kullanıcı'
    : (firstName ?? 'Hoş geldin');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (isGuest || !user) {
      setTimeout(() => setIsRefreshing(false), 200);
      return;
    }
    try {
      await Promise.all([statsQuery.refetch(), profileQuery.refetch()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateAccount = async () => {
    await exitGuest();
    router.replace('/register' as Href);
  };

  const handleCategoryPress = (category: QuestionCategory) => {
    router.push(`/quiz/${category}` as Href);
  };

  const handleExamPress = () => {
    router.push('/exam' as Href);
  };

  const stats = statsQuery.data;

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top']}
    >
      <ScrollView
        contentContainerClassName="flex-grow p-6 gap-6"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Typography variant="h2">Merhaba, {greetingName}!</Typography>
          </View>
          {!isGuest && stats && (
            <StreakCard streakDays={stats.streak_days} />
          )}
        </View>

        {isGuest && (
          <Card padding="md">
            <View className="gap-3">
              <Typography weight="semibold">Misafir modundasın</Typography>
              <Typography variant="caption" color="secondary">
                İlerlemen kaydedilmiyor. Hesap açarak istatistiklerini koru.
              </Typography>
              <Button onPress={handleCreateAccount} size="sm" fullWidth>
                Hesap Aç
              </Button>
            </View>
          </Card>
        )}

        {!isGuest && user && (
          <TodayProgressCard
            questionsToday={stats?.questions_today ?? 0}
            correctToday={stats?.correct_today ?? 0}
            isLoading={statsQuery.isLoading}
          />
        )}

        <View className="gap-3">
          <Typography variant="h3">Kategoriler</Typography>
          <CategoryGrid
            categoryBreakdown={stats?.category_breakdown}
            onPressCategory={handleCategoryPress}
          />
        </View>

        <ExamCTACard onPress={handleExamPress} />

        <AdBanner />
      </ScrollView>
    </SafeAreaView>
  );
}
