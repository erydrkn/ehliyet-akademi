import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getUserStats, getWeakCategories } from '@/api/stats';
import { queryKeys } from '@/constants/query-keys';
import type { UserStatsResult, WeakCategoryResult } from '@/types/database';

export function useUserStats(
  userId: string | undefined,
): UseQueryResult<UserStatsResult, Error> {
  return useQuery({
    queryKey: userId ? queryKeys.stats.byUser(userId) : queryKeys.stats.all,
    queryFn: () => getUserStats(userId as string),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useWeakCategories(
  userId: string | undefined,
  limit: number = 3,
): UseQueryResult<WeakCategoryResult[], Error> {
  return useQuery({
    queryKey: userId
      ? queryKeys.stats.weakCategories(userId)
      : queryKeys.stats.all,
    queryFn: () => getWeakCategories(userId as string, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
