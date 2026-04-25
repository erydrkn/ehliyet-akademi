import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetchTopicQuestions } from '@/api/questions';
import { queryKeys } from '@/constants/query-keys';
import type { TopicId } from '@/constants/topics';
import type { Question } from '@/types/database';

const QUIZ_TOTAL = 10;

export function useTopicQuestions(
  topicId: TopicId | undefined,
  count: number = QUIZ_TOTAL,
): UseQueryResult<Question[], Error> {
  return useQuery({
    queryKey: topicId
      ? queryKeys.questions.topic(topicId)
      : queryKeys.questions.all,
    queryFn: () => fetchTopicQuestions(topicId as TopicId, count),
    enabled: !!topicId,
    staleTime: 0,
  });
}
