import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { supabase } from '@/lib/supabase';

export type TopicCountsMap = Record<string, number>;

export function useTopicCounts(): UseQueryResult<TopicCountsMap, Error> {
  return useQuery({
    queryKey: queryKeys.questions.topicCounts(),
    queryFn: async (): Promise<TopicCountsMap> => {
      const { data, error } = await supabase
        .from('questions')
        .select('topic')
        .eq('is_active', true);

      if (error) {
        throw new Error(`Konu sayıları yüklenemedi: ${error.message}`);
      }

      const counts: TopicCountsMap = {};
      for (const row of data ?? []) {
        const topic = row.topic;
        if (topic) counts[topic] = (counts[topic] ?? 0) + 1;
      }
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });
}
