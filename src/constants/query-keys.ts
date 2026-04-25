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
    topic: (topicId: string) => [...root, 'questions', 'topic', topicId] as const,
    topicCounts: () => [...root, 'questions', 'topic-counts'] as const,
  },

  userAnswers: {
    all: [...root, 'userAnswers'] as const,
    byUser: (userId: string) => [...root, 'userAnswers', userId] as const,
    byUserTopicStats: (userId: string) =>
      [...root, 'userAnswers', userId, 'topic-stats'] as const,
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

  exam: {
    all: [...root, 'exam'] as const,
    questions: () => [...root, 'exam', 'questions'] as const,
    session: (id: number) => [...root, 'exam', 'session', id] as const,
    review: (id: number) => [...root, 'exam', 'review', id] as const,
    userSessions: (userId: string) =>
      [...root, 'exam', 'userSessions', userId] as const,
  },
} as const;
