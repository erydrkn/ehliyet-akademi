import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/lib/supabase';

export type TopicStat = {
  topic: string;
  total: number;
  correct: number;
};

type AnswerRow = {
  is_correct: boolean | null;
  questions: { topic: string | null } | null;
};

export function useTopicStats(
  userId: string | undefined,
): UseQueryResult<TopicStat[], Error> {
  return useQuery({
    queryKey: userId
      ? queryKeys.userAnswers.byUserTopicStats(userId)
      : queryKeys.userAnswers.all,
    queryFn: async (): Promise<TopicStat[]> => {
      const { data, error } = await supabase
        .from('user_answers')
        .select('is_correct, questions(topic)')
        .eq('user_id', userId as string);

      if (error) {
        throw new Error(`Konu istatistikleri yüklenemedi: ${error.message}`);
      }

      const rows = (data ?? []) as unknown as AnswerRow[];
      const map = new Map<string, { total: number; correct: number }>();
      for (const row of rows) {
        const topic = row.questions?.topic;
        if (!topic) continue;
        const stat = map.get(topic) ?? { total: 0, correct: 0 };
        stat.total += 1;
        if (row.is_correct) stat.correct += 1;
        map.set(topic, stat);
      }

      return Array.from(map.entries()).map(([topic, s]) => ({
        topic,
        total: s.total,
        correct: s.correct,
      }));
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}
