import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetchUserExamSessions } from '@/api/exam';
import { queryKeys } from '@/constants/query-keys';
import type { ExamSession } from '@/types/database';

export function useExamHistory(
  userId: string | undefined,
  limit: number = 10,
): UseQueryResult<ExamSession[], Error> {
  return useQuery({
    queryKey: userId
      ? queryKeys.exam.userSessions(userId)
      : queryKeys.exam.all,
    queryFn: () => fetchUserExamSessions(userId as string, limit),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}
