import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import type { UserStatsResult } from '@/types/database';

type Props = {
  stats: UserStatsResult;
};

type Color = 'default' | 'success' | 'danger';

function StatRow({
  label,
  value,
  valueColor = 'default',
}: {
  label: string;
  value: string;
  valueColor?: Color;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Typography variant="body" color="secondary">
        {label}
      </Typography>
      <Typography variant="body" weight="semibold" color={valueColor}>
        {value}
      </Typography>
    </View>
  );
}

export function OverallStatsCard({ stats }: Props) {
  const wrong = Math.max(0, stats.total_questions - stats.total_correct);

  return (
    <Card padding="md">
      <View className="gap-3">
        <Typography variant="h3">📊 Genel İstatistik</Typography>

        <StatRow
          label="Toplam Çözülen"
          value={String(stats.total_questions)}
        />
        <StatRow
          label="Doğru"
          value={String(stats.total_correct)}
          valueColor="success"
        />
        <StatRow label="Yanlış" value={String(wrong)} valueColor="danger" />

        <View className="my-1 h-px bg-gray-200 dark:bg-gray-800" />

        <StatRow label="Bugün" value={String(stats.questions_today)} />
        <StatRow
          label="Doğruluk"
          value={`%${Math.round(stats.accuracy_rate)}`}
        />
        <StatRow
          label="En Uzun Streak"
          value={`${stats.longest_streak} gün`}
        />
      </View>
    </Card>
  );
}
