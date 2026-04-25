import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExitConfirmSheet } from '@/components/quiz/ExitConfirmSheet';
import { ExplanationCard } from '@/components/quiz/ExplanationCard';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { CATEGORIES } from '@/constants/categories';
import { useQuiz } from '@/hooks/useQuiz';
import type { QuestionCategory } from '@/types/database';

function isValidCategory(value: string | undefined): value is QuestionCategory {
  return (
    !!value && CATEGORIES.some((c) => c.category === value)
  );
}

export default function QuizScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const sheetRef = useRef<BottomSheetModal>(null);

  if (!isValidCategory(category)) {
    return <InvalidCategoryView onBack={() => router.replace('/(tabs)' as Href)} />;
  }

  return <QuizContent category={category} sheetRef={sheetRef} router={router} />;
}

type ContentProps = {
  category: QuestionCategory;
  sheetRef: React.RefObject<BottomSheetModal | null>;
  router: ReturnType<typeof useRouter>;
};

function QuizContent({ category, sheetRef, router }: ContentProps) {
  const quiz = useQuiz(category);
  const categoryMeta = CATEGORIES.find((c) => c.category === category);
  const categoryLabel = categoryMeta?.label ?? 'Quiz';

  const openExitSheet = () => {
    sheetRef.current?.present();
  };

  const closeExitSheet = () => {
    sheetRef.current?.dismiss();
  };

  const handleExitConfirm = () => {
    sheetRef.current?.dismiss();
    router.replace('/(tabs)' as Href);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      openExitSheet();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    quiz.handleSubmitAnswer();
  };

  const handleNext = () => {
    if (quiz.isLastQuestion) {
      const correct = quiz.handleQuizComplete();
      router.replace(
        `/quiz/result?correct=${correct}&total=${quiz.totalQuestions}&category=${category}` as Href,
      );
      return;
    }
    quiz.handleNext();
  };

  if (quiz.questionsQuery.isLoading) {
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

  if (quiz.questionsQuery.isError) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Sorular yüklenemedi
          </Typography>
          <Typography color="muted" align="center">
            İnternet bağlantını kontrol et ve tekrar dene.
          </Typography>
          <View className="w-full gap-3">
            <Button onPress={() => quiz.questionsQuery.refetch()} fullWidth>
              Tekrar Dene
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.replace('/(tabs)' as Href)}
              fullWidth
            >
              Ana Sayfaya Dön
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!quiz.currentQuestion || quiz.questions.length === 0) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Bu kategoride soru bulunamadı
          </Typography>
          <Button
            variant="secondary"
            onPress={() => router.replace('/(tabs)' as Href)}
            fullWidth
          >
            Ana Sayfaya Dön
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const progressPct = (quiz.currentIndex / quiz.totalQuestions) * 100;

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <QuizHeader
        categoryLabel={categoryLabel}
        currentIndex={quiz.currentIndex}
        total={quiz.totalQuestions}
        onClose={openExitSheet}
      />

      <View className="px-4 pb-2">
        <ProgressBar value={progressPct} />
      </View>

      <ScrollView
        contentContainerClassName="p-4 gap-4 flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <QuestionCard
          question={quiz.currentQuestion}
          questionNumber={quiz.currentIndex + 1}
          selectedAnswer={quiz.selectedAnswer}
          isAnswered={quiz.isAnswered}
          onSelectAnswer={quiz.handleSelectAnswer}
        />

        {quiz.isAnswered && quiz.currentQuestion.explanation && (
          <ExplanationCard explanation={quiz.currentQuestion.explanation} />
        )}
      </ScrollView>

      <View className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        {quiz.isAnswered ? (
          <Button onPress={handleNext} fullWidth>
            {quiz.isLastQuestion ? 'Sonucu Gör' : 'Sonraki Soru →'}
          </Button>
        ) : (
          <Button
            onPress={handleSubmit}
            disabled={!quiz.selectedAnswer}
            fullWidth
          >
            Cevabı Onayla
          </Button>
        )}
      </View>

      <ExitConfirmSheet
        ref={sheetRef}
        onCancel={closeExitSheet}
        onConfirm={handleExitConfirm}
      />
    </SafeAreaView>
  );
}

function InvalidCategoryView({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <Typography variant="h3" align="center">
          Geçersiz kategori
        </Typography>
        <Button onPress={onBack} fullWidth>
          Ana Sayfaya Dön
        </Button>
      </View>
    </SafeAreaView>
  );
}
