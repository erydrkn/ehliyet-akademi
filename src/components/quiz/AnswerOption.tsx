import { Check, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import type { AnswerLetter } from '@/types/database';

type Props = {
  letter: AnswerLetter;
  text: string;
  selected: boolean;
  isAnswered: boolean;
  isCorrect: boolean;
  onPress: () => void;
};

export function AnswerOption({
  letter,
  text,
  selected,
  isAnswered,
  isCorrect,
  onPress,
}: Props) {
  const containerClass = getContainerClass({ selected, isAnswered, isCorrect });
  const showCheck = isAnswered && isCorrect;
  const showX = isAnswered && selected && !isCorrect;

  return (
    <Pressable
      onPress={onPress}
      disabled={isAnswered}
      accessibilityRole="button"
      accessibilityLabel={`Seçenek ${letter}: ${text}`}
      accessibilityState={{ selected, disabled: isAnswered }}
      className={`flex-row items-center gap-3 rounded-xl border-2 p-4 ${containerClass}`}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900">
        <Typography variant="body" weight="bold">
          {letter}
        </Typography>
      </View>
      <View className="flex-1">
        <Typography variant="body">{text}</Typography>
      </View>
      {showCheck && <Check size={22} color="#10B981" />}
      {showX && <X size={22} color="#EF4444" />}
    </Pressable>
  );
}

function getContainerClass({
  selected,
  isAnswered,
  isCorrect,
}: {
  selected: boolean;
  isAnswered: boolean;
  isCorrect: boolean;
}): string {
  if (!isAnswered) {
    if (selected) {
      return 'bg-blue-50 dark:bg-blue-950 border-blue-500';
    }
    return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
  if (isCorrect) {
    return 'bg-green-50 dark:bg-green-950 border-green-500';
  }
  if (selected) {
    return 'bg-red-50 dark:bg-red-950 border-red-500';
  }
  return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60';
}
