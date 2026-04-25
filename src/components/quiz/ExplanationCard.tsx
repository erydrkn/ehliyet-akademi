import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';

type Props = {
  explanation: string;
};

export function ExplanationCard({ explanation }: Props) {
  return (
    <Card padding="md" className="bg-amber-50 dark:bg-amber-950/40">
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <Typography variant="h3">💡</Typography>
          <Typography variant="h3">Açıklama</Typography>
        </View>
        <Typography variant="body" color="secondary">
          {explanation}
        </Typography>
      </View>
    </Card>
  );
}
