import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import {
  fetchQuestionById,
  fetchQuestions,
  fetchRandomQuestions,
} from '@/api/questions';
import { queryKeys, type QuestionFilters } from '@/constants/query-keys';
import type { Question } from '@/types/database';

export function useQuestions(
  filters: QuestionFilters = {},
): UseQueryResult<Question[], Error> {
  return useQuery({
    queryKey: queryKeys.questions.list(filters),
    queryFn: () => fetchQuestions(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useQuestion(id: number): UseQueryResult<Question, Error> {
  return useQuery({
    queryKey: queryKeys.questions.detail(id),
    queryFn: () => fetchQuestionById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRandomQuestions(
  count: number = 10,
  filters: Omit<QuestionFilters, 'limit'> = {},
): UseQueryResult<Question[], Error> {
  return useQuery({
    queryKey: [...queryKeys.questions.all, 'random', count, filters] as const,
    queryFn: () => fetchRandomQuestions(count, filters),
    staleTime: 0,
  });
}
