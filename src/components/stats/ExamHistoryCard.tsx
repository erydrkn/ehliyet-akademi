import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';
import type { ExamSession } from '@/types/database';
import {
  formatDateTr,
  formatDurationMmSs,
  formatTimeTr,
} from '@/utils/format';

type Props = {
  session: ExamSession;
  onPress: () => void;
};

export function ExamHistoryCard({ session, onPress }: Props) {
  const { colors } = useTheme();
  const passed = session.is_passed === true;
  const score = session.final_score ?? 0;
  const correct = session.correct_count ?? 0;

  return (
    <Card padding="md" onPress={onPress}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-1">
          <Typography variant="caption" color="muted">
            {formatDateTr(session.completed_at)} •{' '}
            {formatTimeTr(session.completed_at)}
          </Typography>
          <View className="flex-row items-center gap-2 flex-wrap">
            <Typography
              variant="body"
              weight="semibold"
              color={passed ? 'success' : 'danger'}
            >
              {passed ? '✅ GEÇTİ' : '❌ KALDI'}
            </Typography>
            <Typography variant="body" color="secondary">
              • {correct}/{session.total_questions} (%{score})
            </Typography>
          </View>
          <Typography variant="caption" color="muted">
            Süre: {formatDurationMmSs(session.duration_seconds)}
          </Typography>
        </View>
        <ChevronRight size={20} color={colors.textMuted} />
      </View>
    </Card>
  );
}
