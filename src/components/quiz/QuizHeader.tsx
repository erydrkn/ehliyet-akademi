import { X } from 'lucide-react-native';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  categoryLabel: string;
  currentIndex: number;
  total: number;
  onClose: () => void;
};

export function QuizHeader({
  categoryLabel,
  currentIndex,
  total,
  onClose,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="h-14 flex-row items-center justify-between bg-white px-3 dark:bg-gray-900">
      <IconButton
        icon={<X size={22} color={colors.text} />}
        onPress={onClose}
        accessibilityLabel="Quizden çık"
        variant="ghost"
        size="sm"
      />
      <Typography variant="body" weight="semibold">
        {categoryLabel} • {currentIndex + 1}/{total}
      </Typography>
      <View className="w-11" />
    </View>
  );
}
