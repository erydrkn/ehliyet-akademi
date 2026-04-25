import { Clock, X } from 'lucide-react-native';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  currentIndex: number;
  total: number;
  formattedTime: string;
  isLowTime: boolean;
  isCriticalTime: boolean;
  onClose: () => void;
};

export function ExamHeader({
  currentIndex,
  total,
  formattedTime,
  isLowTime,
  isCriticalTime,
  onClose,
}: Props) {
  const { colors } = useTheme();

  const pillBg = isCriticalTime
    ? 'bg-red-100 dark:bg-red-900'
    : isLowTime
      ? 'bg-amber-100 dark:bg-amber-900'
      : 'bg-gray-100 dark:bg-gray-800';

  const pillTextClass = isCriticalTime
    ? 'text-red-700 dark:text-red-200'
    : isLowTime
      ? 'text-amber-700 dark:text-amber-200'
      : 'text-gray-700 dark:text-gray-200';

  const iconColor = isCriticalTime
    ? '#EF4444'
    : isLowTime
      ? '#F59E0B'
      : colors.textSecondary;

  return (
    <View className="h-14 flex-row items-center justify-between bg-white px-3 dark:bg-gray-900">
      <IconButton
        icon={<X size={22} color={colors.text} />}
        onPress={onClose}
        accessibilityLabel="Sınavdan çık"
        variant="ghost"
        size="sm"
      />
      <Typography variant="body" weight="semibold">
        Sınav • {currentIndex + 1}/{total}
      </Typography>
      <View
        className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${pillBg}`}
      >
        <Clock size={14} color={iconColor} />
        <Typography
          variant="caption"
          weight="semibold"
          className={pillTextClass}
        >
          {formattedTime}
        </Typography>
      </View>
    </View>
  );
}
