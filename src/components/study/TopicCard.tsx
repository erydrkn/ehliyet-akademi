import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Typography } from '@/components/ui/Typography';
import type { TopicMeta } from '@/constants/topics';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  topic: TopicMeta;
  questionCount: number;
  categoryLabel: string;
  userStat?: { total: number; correct: number };
  onPress: () => void;
};

function progressVariant(pct: number): 'success' | 'warning' | 'danger' {
  if (pct >= 70) return 'success';
  if (pct >= 50) return 'warning';
  return 'danger';
}

export function TopicCard({
  topic,
  questionCount,
  categoryLabel,
  userStat,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const hasStat = userStat && userStat.total > 0;
  const pct = hasStat
    ? Math.round((userStat.correct / userStat.total) * 100)
    : 0;

  return (
    <Card padding="md" onPress={onPress}>
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
          <Typography variant="h2">{topic.emoji}</Typography>
        </View>

        <View className="flex-1 gap-1">
          <Typography variant="body" weight="semibold">
            {topic.label}
          </Typography>
          <Typography variant="caption" color="muted">
            {questionCount} soru • {categoryLabel}
          </Typography>

          {hasStat && (
            <View className="mt-2 gap-1">
              <ProgressBar value={pct} variant={progressVariant(pct)} />
              <Typography variant="caption" color="muted">
                {userStat.correct}/{userStat.total} doğru (%{pct})
              </Typography>
            </View>
          )}
        </View>

        <ChevronRight size={20} color={colors.textMuted} />
      </View>
    </Card>
  );
}
