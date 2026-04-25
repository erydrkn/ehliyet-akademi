import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerOption } from '@/components/quiz/AnswerOption';
import { ExplanationCard } from '@/components/quiz/ExplanationCard';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { CATEGORIES } from '@/constants/categories';
import { queryKeys } from '@/constants/query-keys';
import { fetchExamReview, type ExamReviewItem } from '@/api/exam';
import { useTheme } from '@/hooks/useTheme';
import type { AnswerLetter } from '@/types/database';

type Filter = 'all' | 'wrong' | 'empty';
const LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D'];

const NOOP = () => undefined;

function applyFilter(items: ExamReviewItem[], filter: Filter): ExamReviewItem[] {
  if (filter === 'all') return items;
  if (filter === 'wrong') return items.filter((i) => i.userAnswer !== null && !i.isCorrect);
  return items.filter((i) => i.userAnswer === null);
}

export default function ExamReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ sessionId: string }>();
  const sessionId = Number(params.sessionId);
  const isValidSession =
    Number.isFinite(sessionId) && sessionId > 0;

  const reviewQuery = useQuery({
    queryKey: queryKeys.exam.review(sessionId),
    queryFn: () => fetchExamReview(sessionId),
    enabled: isValidSession,
    staleTime: 5 * 60 * 1000,
  });

  const [filter, setFilter] = useState<Filter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = useMemo<ExamReviewItem[]>(
    () => reviewQuery.data?.items ?? [],
    [reviewQuery.data],
  );
  const totalCount = items.length;
  const wrongCount = useMemo(
    () => items.filter((i) => i.userAnswer !== null && !i.isCorrect).length,
    [items],
  );
  const emptyCount = useMemo(
    () => items.filter((i) => i.userAnswer === null).length,
    [items],
  );
  const filteredItems = useMemo(
    () => applyFilter(items, filter),
    [items, filter],
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  if (!isValidSession) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Geçersiz oturum
          </Typography>
          <Button onPress={() => router.back()} fullWidth>
            Geri Dön
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (reviewQuery.isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (reviewQuery.isError) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            İnceleme yüklenemedi
          </Typography>
          <View className="w-full gap-3">
            <Button onPress={() => reviewQuery.refetch()} fullWidth>
              Tekrar Dene
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.back()}
              fullWidth
            >
              Geri Dön
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = filteredItems[currentIndex];

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <View className="h-14 flex-row items-center gap-2 bg-white px-3 dark:bg-gray-900">
        <IconButton
          icon={<X size={22} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel="Kapat"
          variant="ghost"
          size="sm"
        />
        <Typography variant="body" weight="semibold" className="flex-1">
          Soruları İncele
          {filteredItems.length > 0
            ? ` • ${currentIndex + 1}/${filteredItems.length}`
            : ''}
        </Typography>
      </View>

      <View className="flex-row gap-2 border-b border-gray-200 px-3 pb-3 dark:border-gray-800">
        <FilterChip
          label={`Tümü (${totalCount})`}
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterChip
          label={`Yanlış (${wrongCount})`}
          active={filter === 'wrong'}
          onPress={() => setFilter('wrong')}
        />
        <FilterChip
          label={`Boş (${emptyCount})`}
          active={filter === 'empty'}
          onPress={() => setFilter('empty')}
        />
      </View>

      {!currentItem ? (
        <View className="flex-1 items-center justify-center gap-3 p-6">
          <Typography variant="h3" align="center">
            Bu filtreye uyan soru yok
          </Typography>
          <Typography color="muted" align="center">
            Başka bir filtre seç.
          </Typography>
        </View>
      ) : (
        <ReviewBody item={currentItem} />
      )}

      {currentItem && (
        <View className="flex-row gap-2 border-t border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
          <View className="flex-1">
            <Button
              variant="secondary"
              fullWidth
              disabled={currentIndex === 0}
              onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            >
              ← Önceki
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="secondary"
              fullWidth
              disabled={currentIndex >= filteredItems.length - 1}
              onPress={() =>
                setCurrentIndex((i) =>
                  Math.min(filteredItems.length - 1, i + 1),
                )
              }
            >
              Sonraki →
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const containerClass = active
    ? 'bg-blue-600'
    : 'bg-gray-100 dark:bg-gray-800';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`rounded-full px-4 py-2 ${containerClass} active:opacity-80`}
    >
      <Typography
        variant="caption"
        weight="semibold"
        color={active ? 'inverse' : 'default'}
      >
        {label}
      </Typography>
    </Pressable>
  );
}

function ReviewBody({ item }: { item: ExamReviewItem }) {
  const { question, userAnswer } = item;
  const meta = CATEGORIES.find((c) => c.category === question.category);
  const optionTexts: Record<AnswerLetter, string> = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  return (
    <ScrollView contentContainerClassName="p-4 gap-4">
      <Typography variant="caption" color="muted">
        Kategori: {meta?.label ?? question.category}
      </Typography>
      <Typography variant="body" weight="semibold">
        {question.question_text}
      </Typography>

      <View className="gap-3">
        {LETTERS.map((letter) => (
          <AnswerOption
            key={letter}
            letter={letter}
            text={optionTexts[letter]}
            selected={userAnswer === letter}
            isAnswered
            isCorrect={question.correct_answer === letter}
            onPress={NOOP}
          />
        ))}
      </View>

      {userAnswer === null && (
        <Typography color="warning" align="center">
          ⚠️ Bu soru boş bırakıldı
        </Typography>
      )}

      {question.explanation && (
        <ExplanationCard explanation={question.explanation} />
      )}
    </ScrollView>
  );
}
