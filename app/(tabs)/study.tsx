import { type Href, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryGrid } from '@/components/home/CategoryGrid';
import { WeakCategoriesCard } from '@/components/stats/WeakCategoriesCard';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useUserStats, useWeakCategories } from '@/hooks/useUserStats';

export default function StudyScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();

  const userId = isGuest ? undefined : user?.id;
  const statsQuery = useUserStats(userId);
  const weakQuery = useWeakCategories(userId);

  const weak = weakQuery.data ?? [];

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top']}
    >
      <ScrollView contentContainerClassName="flex-grow p-4 gap-4">
        <View className="gap-2">
          <Typography variant="h2">Çalış</Typography>
          <Typography color="muted">
            Kategori seçerek soru pratiği yap.
          </Typography>
        </View>

        <CategoryGrid
          categoryBreakdown={statsQuery.data?.category_breakdown}
          onPressCategory={(cat) => router.push(`/quiz/${cat}` as Href)}
        />

        {!isGuest && weak.length > 0 && (
          <WeakCategoriesCard
            weakCategories={weak}
            onPressStudy={(cat) => router.push(`/quiz/${cat}` as Href)}
          />
        )}

        {isGuest && (
          <Card padding="md">
            <Typography variant="caption" color="muted" align="center">
              💡 Misafir modunda quiz çözebilirsin ama ilerlemen kaydedilmez.
            </Typography>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
