import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';

const DAILY_GOAL = 20;

type Props = {
  questionsToday: number;
  correctToday: number;
  isLoading?: boolean;
};

export function TodayProgressCard({
  questionsToday,
  correctToday,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <Card padding="md">
        <View className="items-center py-3">
          <Spinner size="sm" />
        </View>
      </Card>
    );
  }

  const isEmpty = questionsToday === 0;
  const progressValue = Math.round(
    Math.min(100, (questionsToday / DAILY_GOAL) * 100),
  );

  return (
    <Card padding="md">
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Typography variant="h3">Bugün</Typography>
          <Typography variant="caption" color="muted">
            {questionsToday}/{DAILY_GOAL}
          </Typography>
        </View>

        {isEmpty ? (
          <Typography variant="body" color="muted">
            Bugün hadi başlayalım! 🚀
          </Typography>
        ) : (
          <View className="gap-3">
            <Typography variant="body" color="secondary">
              {questionsToday} soru çözdün, {correctToday} doğru
            </Typography>
            <ProgressBar value={progressValue} />
          </View>
        )}
      </View>
    </Card>
  );
}
