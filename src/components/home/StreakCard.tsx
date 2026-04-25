import { Flame } from 'lucide-react-native';
import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';

type Props = {
  streakDays: number;
};

export function StreakCard({ streakDays }: Props) {
  const label = streakDays > 0 ? `${streakDays} gün` : 'Hadi başla!';

  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 dark:bg-amber-900">
      <Flame size={16} color="#F59E0B" />
      <Typography
        variant="caption"
        weight="semibold"
        className="text-amber-700 dark:text-amber-200"
      >
        {label}
      </Typography>
    </View>
  );
}
