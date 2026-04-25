import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryGrid } from '@/components/home/CategoryGrid';
import { WeakCategoriesCard } from '@/components/stats/WeakCategoriesCard';
import { FilterChip } from '@/components/study/FilterChip';
import { TopicCard } from '@/components/study/TopicCard';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { TOPICS, type TopicMeta } from '@/constants/topics';
import { useAuth } from '@/hooks/useAuth';
import { useTopicCounts } from '@/hooks/useTopicCounts';
import { useTopicStats } from '@/hooks/useTopicStats';
import { useUserStats, useWeakCategories } from '@/hooks/useUserStats';
import type { QuestionCategory } from '@/types/database';

type TopicFilter = 'all' | QuestionCategory;

const CATEGORY_ORDER: QuestionCategory[] = [
  'ilk_yardim',
  'trafik',
  'motor',
  'trafik_adabi',
];

const CATEGORY_LABELS: Record<QuestionCategory | 'diger', string> = {
  ilk_yardim: 'İlk Yardım',
  trafik: 'Trafik',
  motor: 'Motor',
  trafik_adabi: 'Trafik Adabı',
  diger: 'Diğer',
};

function sortTopics(topics: TopicMeta[]): TopicMeta[] {
  return [...topics].sort((a, b) => {
    if (a.category === 'diger' && b.category !== 'diger') return 1;
    if (b.category === 'diger' && a.category !== 'diger') return -1;
    if (a.category !== b.category) {
      const ai = CATEGORY_ORDER.indexOf(a.category as QuestionCategory);
      const bi = CATEGORY_ORDER.indexOf(b.category as QuestionCategory);
      return ai - bi;
    }
    return a.label.localeCompare(b.label, 'tr');
  });
}

export default function StudyScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();

  const userId = isGuest ? undefined : user?.id;
  const statsQuery = useUserStats(userId);
  const weakQuery = useWeakCategories(userId);
  const countsQuery = useTopicCounts();
  const topicStatsQuery = useTopicStats(userId);

  const [filter, setFilter] = useState<TopicFilter>('all');

  const counts = useMemo(
    () => countsQuery.data ?? {},
    [countsQuery.data],
  );
  const topicStats = topicStatsQuery.data ?? [];
  const weak = weakQuery.data ?? [];

  const visibleTopics = useMemo(() => {
    const filtered =
      filter === 'all'
        ? TOPICS
        : TOPICS.filter((t) => t.category === filter);
    const withQuestions = filtered.filter(
      (t) => (counts[t.id] ?? 0) > 0,
    );
    return sortTopics(withQuestions);
  }, [filter, counts]);

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

        <View className="mt-2 gap-3">
          <View className="gap-1">
            <Typography variant="h3">📚 Konu Konu Çalış</Typography>
            <Typography variant="caption" color="muted">
              İstediğin konuya tıkla, 10 rastgele soru çöz.
            </Typography>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            <FilterChip
              label="Tümü"
              active={filter === 'all'}
              onPress={() => setFilter('all')}
            />
            <FilterChip
              label="🩺 İlk Yardım"
              active={filter === 'ilk_yardim'}
              onPress={() => setFilter('ilk_yardim')}
            />
            <FilterChip
              label="🚦 Trafik"
              active={filter === 'trafik'}
              onPress={() => setFilter('trafik')}
            />
            <FilterChip
              label="🔧 Motor"
              active={filter === 'motor'}
              onPress={() => setFilter('motor')}
            />
            <FilterChip
              label="🤝 Trafik Adabı"
              active={filter === 'trafik_adabi'}
              onPress={() => setFilter('trafik_adabi')}
            />
          </ScrollView>

          {countsQuery.isLoading ? (
            <View className="items-center py-6">
              <Spinner />
            </View>
          ) : countsQuery.isError ? (
            <Card padding="md">
              <Typography color="muted" align="center">
                Konular yüklenemedi.
              </Typography>
            </Card>
          ) : visibleTopics.length === 0 ? (
            <Card padding="md">
              <Typography color="muted" align="center">
                Bu kategoride soru bulunamadı.
              </Typography>
            </Card>
          ) : (
            <View className="gap-2">
              {visibleTopics.map((topic) => {
                const stat = topicStats.find((s) => s.topic === topic.id);
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    questionCount={counts[topic.id] ?? 0}
                    categoryLabel={CATEGORY_LABELS[topic.category]}
                    userStat={
                      stat
                        ? { total: stat.total, correct: stat.correct }
                        : undefined
                    }
                    onPress={() =>
                      router.push(`/quiz/topic/${topic.id}` as Href)
                    }
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
