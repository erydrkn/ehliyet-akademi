import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

type Props = {
  currentIndex: number;
  total: number;
  answeredCount: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenGrid: () => void;
};

export function ExamFooter({
  currentIndex,
  total,
  answeredCount,
  onPrev,
  onNext,
  onOpenGrid,
}: Props) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <View className="flex-row items-center gap-2 border-t border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <Button
        variant="secondary"
        size="sm"
        disabled={isFirst}
        onPress={onPrev}
      >
        ← Önceki
      </Button>

      <Pressable
        onPress={onOpenGrid}
        accessibilityRole="button"
        accessibilityLabel="Soru ızgarasını aç"
        className="flex-1 items-center justify-center rounded-xl bg-gray-100 py-2 active:opacity-80 dark:bg-gray-800"
      >
        <Typography variant="caption" color="muted">
          Sorular
        </Typography>
        <Typography variant="body" weight="semibold">
          {answeredCount}/{total}
        </Typography>
      </Pressable>

      <Button variant="secondary" size="sm" disabled={isLast} onPress={onNext}>
        Sonraki →
      </Button>
    </View>
  );
}
