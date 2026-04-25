import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, type Ref } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';
import type { AnswerLetter, Question } from '@/types/database';

type Props = {
  ref?: Ref<BottomSheetModal>;
  questions: Question[];
  answers: Map<number, AnswerLetter>;
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  onFinish: () => void;
};

export function QuestionGridSheet({
  ref,
  questions,
  answers,
  currentIndex,
  onSelectQuestion,
  onFinish,
}: Props) {
  const { scheme } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const total = questions.length;
  const answeredCount = answers.size;
  const blankCount = total - answeredCount;
  const progressPct = total > 0 ? (answeredCount / total) * 100 : 0;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['85%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: scheme === 'dark' ? '#4B5563' : '#D1D5DB',
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
      >
        <Typography variant="h3">
          Sorular ({answeredCount}/{total})
        </Typography>
        <Typography variant="caption" color="muted">
          Cevaplandı: {answeredCount} • Boş: {blankCount}
        </Typography>
        <ProgressBar value={progressPct} />

        <View className="mt-2 flex-row flex-wrap gap-2">
          {questions.map((q, i) => {
            const isCurrent = i === currentIndex;
            const isAnswered = answers.has(q.id);
            const containerClass = isCurrent
              ? 'bg-blue-600 border-blue-700'
              : isAnswered
                ? 'bg-green-100 dark:bg-green-900 border-green-500'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
            const textColor = isCurrent
              ? 'inverse'
              : isAnswered
                ? 'default'
                : 'secondary';

            return (
              <Pressable
                key={q.id}
                onPress={() => onSelectQuestion(i)}
                accessibilityRole="button"
                accessibilityLabel={`Soru ${i + 1}${isAnswered ? ' cevaplandı' : ' boş'}`}
                className={`aspect-square w-[18%] items-center justify-center rounded-xl border-2 ${containerClass} active:opacity-80`}
              >
                <Typography
                  variant="body"
                  weight={isCurrent ? 'bold' : 'semibold'}
                  color={textColor}
                >
                  {i + 1}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {blankCount > 0 && (
          <Typography variant="caption" color="warning" align="center">
            {blankCount} soru cevapsız
          </Typography>
        )}

        <Button onPress={onFinish} fullWidth>
          Sınavı Bitir
        </Button>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
