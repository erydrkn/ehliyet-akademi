import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';
import { useQuestions } from '@/hooks/useQuestions';
import type { Question, QuestionCategory } from '@/types/database';

type CategoryFilter = QuestionCategory | 'all';

const CATEGORY_TABS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'ilk_yardim', label: 'İlk Yardım' },
  { key: 'trafik', label: 'Trafik' },
  { key: 'motor', label: 'Motor' },
  { key: 'trafik_adabi', label: 'Trafik Adabı' },
];

const CATEGORY_LABEL: Record<QuestionCategory, string> = {
  ilk_yardim: 'İlk Yardım',
  trafik: 'Trafik',
  motor: 'Motor',
  trafik_adabi: 'Trafik Adabı',
};

const CATEGORY_BADGE_VARIANT: Record<QuestionCategory, 'danger' | 'info' | 'warning' | 'success'> = {
  ilk_yardim: 'danger',
  trafik: 'info',
  motor: 'warning',
  trafik_adabi: 'success',
};

export default function TestDataScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filters = useMemo(
    () => ({
      category: activeCategory === 'all' ? undefined : activeCategory,
      limit: 500,
    }),
    [activeCategory],
  );

  const { data, isLoading, isError, error, isRefetching, refetch } = useQuestions(filters);

  const questions = data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      <View className="h-14 flex-row items-center gap-2 px-3 border-b border-gray-100 dark:border-gray-800">
        <IconButton
          icon={<ChevronLeft size={22} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel="Geri"
          variant="ghost"
          size="sm"
        />
        <Typography variant="h3">Test Data</Typography>
        <View className="flex-1 items-end">
          <Typography variant="caption" color="secondary">
            {questions.length} soru
          </Typography>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4 py-3"
      >
        {CATEGORY_TABS.map((tab) => {
          const isActive = tab.key === activeCategory;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveCategory(tab.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              className={`px-4 py-2 rounded-full min-h-[40px] items-center justify-center ${
                isActive
                  ? 'bg-blue-600'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Typography
                variant="caption"
                weight="semibold"
                className={isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}
              >
                {tab.label}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
          <Typography variant="caption" color="secondary" className="mt-3">
            Sorular yükleniyor...
          </Typography>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Typography variant="h3" color="danger" align="center">
            Sorular yüklenemedi
          </Typography>
          <Typography color="secondary" align="center">
            {error.message}
          </Typography>
          <Button onPress={() => refetch()} variant="secondary">
            Tekrar Dene
          </Button>
        </View>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <QuestionListItem question={item} />}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerClassName="py-2 pb-8"
          ListEmptyComponent={
            <View className="items-center justify-center py-16">
              <Typography color="secondary">Soru bulunamadı</Typography>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function QuestionListItem({ question }: { question: Question }) {
  return (
    <View className="mx-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl gap-2">
      <View className="flex-row gap-2">
        <Badge variant="default" size="sm">
          {question.external_id}
        </Badge>
        <Badge variant={CATEGORY_BADGE_VARIANT[question.category]} size="sm">
          {CATEGORY_LABEL[question.category]}
        </Badge>
      </View>
      <Typography numberOfLines={2}>{question.question_text}</Typography>
      <Typography variant="caption" color="secondary">
        {'⭐'.repeat(question.difficulty)}
      </Typography>
    </View>
  );
}
