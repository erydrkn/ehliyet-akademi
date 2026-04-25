import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { type Href, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamFooter } from '@/components/exam/ExamFooter';
import { ExamHeader } from '@/components/exam/ExamHeader';
import { ExitExamSheet } from '@/components/exam/ExitExamSheet';
import { QuestionGridSheet } from '@/components/exam/QuestionGridSheet';
import { AnswerOption } from '@/components/quiz/AnswerOption';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { useExam } from '@/hooks/useExam';
import { useTimer } from '@/hooks/useTimer';
import type { AnswerLetter } from '@/types/database';

const TOTAL_DURATION_SEC = 45 * 60;
const LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D'];

export default function ExamScreen() {
  const router = useRouter();
  const exam = useExam();

  const gridRef = useRef<BottomSheetModal>(null);
  const exitRef = useRef<BottomSheetModal>(null);
  const examFinished = useRef(false);
  const startedRef = useRef(false);

  const handleFinish = async (timeoutTriggered: boolean) => {
    if (examFinished.current) return;
    examFinished.current = true;
    gridRef.current?.dismiss();
    const result = await exam.finishExam(timeoutTriggered);
    const statsParam = encodeURIComponent(
      JSON.stringify(result.categoryStats),
    );
    const sessionParam = result.sessionId !== null ? String(result.sessionId) : '';
    router.replace(
      `/exam/result?sessionId=${sessionParam}&correct=${result.correctCount}&total=${result.totalQuestions}&duration=${result.durationSeconds}&timeout=${timeoutTriggered ? 1 : 0}&stats=${statsParam}` as Href,
    );
  };

  const timer = useTimer(TOTAL_DURATION_SEC, () => handleFinish(true));

  useEffect(() => {
    if (
      !startedRef.current &&
      exam.questions.length > 0 &&
      !exam.questionsQuery.isLoading
    ) {
      startedRef.current = true;
      void exam.startExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam.questions.length, exam.questionsQuery.isLoading]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      exitRef.current?.present();
      return true;
    });
    return () => sub.remove();
  }, []);

  const handleCancelExam = () => {
    examFinished.current = true;
    exitRef.current?.dismiss();
    router.replace('/(tabs)' as Href);
  };

  if (exam.questionsQuery.isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4">
          <Spinner size="lg" />
          <Typography color="muted">Sınav hazırlanıyor...</Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (exam.questionsQuery.isError) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Sınav başlatılamadı
          </Typography>
          <Typography color="muted" align="center">
            İnternet bağlantını kontrol et ve tekrar dene.
          </Typography>
          <View className="w-full gap-3">
            <Button onPress={() => exam.questionsQuery.refetch()} fullWidth>
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

  if (!exam.currentQuestion || exam.questions.length === 0) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Sınav için yeterli soru bulunamadı
          </Typography>
          <Button
            onPress={() => router.replace('/(tabs)' as Href)}
            fullWidth
          >
            Ana Sayfaya Dön
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const q = exam.currentQuestion;
  const optionTexts: Record<AnswerLetter, string> = {
    A: q.option_a,
    B: q.option_b,
    C: q.option_c,
    D: q.option_d,
  };
  const selectedForCurrent = exam.answers.get(q.id) ?? null;
  const progressPct =
    exam.totalQuestions > 0
      ? Math.round((exam.currentIndex / exam.totalQuestions) * 100)
      : 0;

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <ExamHeader
        currentIndex={exam.currentIndex}
        total={exam.totalQuestions}
        formattedTime={timer.formattedTime}
        isLowTime={timer.isLowTime}
        isCriticalTime={timer.isCriticalTime}
        onClose={() => exitRef.current?.present()}
      />

      <View className="px-4 pb-2">
        <ProgressBar value={progressPct} />
      </View>

      <ScrollView
        contentContainerClassName="p-4 gap-4 flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <Typography variant="caption" color="muted">
          Soru {exam.currentIndex + 1}/{exam.totalQuestions}
        </Typography>
        <Typography variant="body" weight="semibold">
          {q.question_text}
        </Typography>

        <View className="gap-3">
          {LETTERS.map((letter) => (
            <AnswerOption
              key={letter}
              letter={letter}
              text={optionTexts[letter]}
              selected={selectedForCurrent === letter}
              isAnswered={false}
              isCorrect={false}
              onPress={() => exam.handleSelectAnswer(q.id, letter)}
            />
          ))}
        </View>
      </ScrollView>

      <ExamFooter
        currentIndex={exam.currentIndex}
        total={exam.totalQuestions}
        answeredCount={exam.answeredCount}
        onPrev={exam.goPrev}
        onNext={exam.goNext}
        onOpenGrid={() => gridRef.current?.present()}
      />

      <QuestionGridSheet
        ref={gridRef}
        questions={exam.questions}
        answers={exam.answers}
        currentIndex={exam.currentIndex}
        onSelectQuestion={(i) => {
          exam.goToQuestion(i);
          gridRef.current?.dismiss();
        }}
        onFinish={() => handleFinish(false)}
      />

      <ExitExamSheet
        ref={exitRef}
        onCancel={() => exitRef.current?.dismiss()}
        onConfirm={handleCancelExam}
      />
    </SafeAreaView>
  );
}
