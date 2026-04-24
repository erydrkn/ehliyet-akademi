import type { Difficulty, QuestionCategory } from '@/types/database';

export type QuestionFilters = {
  category?: QuestionCategory;
  difficulty?: Difficulty;
  limit?: number;
};

const root = ['ehliyet-akademi'] as const;

export const queryKeys = {
  all: root,

  questions: {
    all: [...root, 'questions'] as const,
    lists: () => [...root, 'questions', 'list'] as const,
    list: (filters: QuestionFilters) => [...root, 'questions', 'list', filters] as const,
    details: () => [...root, 'questions', 'detail'] as const,
    detail: (id: number) => [...root, 'questions', 'detail', id] as const,
  },

  userAnswers: {
    all: [...root, 'userAnswers'] as const,
    byUser: (userId: string) => [...root, 'userAnswers', userId] as const,
  },

  profile: {
    all: [...root, 'profile'] as const,
    byUser: (userId: string) => [...root, 'profile', userId] as const,
  },

  stats: {
    all: [...root, 'stats'] as const,
    byUser: (userId: string) => [...root, 'stats', userId] as const,
    weakCategories: (userId: string) =>
      [...root, 'stats', userId, 'weakCategories'] as const,
  },
} as const;
