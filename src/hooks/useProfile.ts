import { useQuery } from '@tanstack/react-query';

import { getProfile } from '@/api/profile';
import { queryKeys } from '@/constants/query-keys';

type UseProfileOptions = {
  enabled?: boolean;
};

export function useProfile(
  userId: string | null | undefined,
  options?: UseProfileOptions,
) {
  return useQuery({
    queryKey: queryKeys.profile.byUser(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('userId zorunludur');
      }
      return getProfile(userId);
    },
    enabled: !!userId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}
