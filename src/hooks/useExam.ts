import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  createExamSession,
  fetchExamQuestions,
  submitExamSession,
  type SubmitExamInput,
} from '@/api/exam';
import { updateStreak } from '@/api/stats';
import { queryKeys } from '@/constants/query-keys';
import { useAuth } from '@/hooks/useAuth';
import type { AnswerLetter, Question, QuestionCategory } from '@/types/database';

const TOTAL_DURATION_SEC = 45 * 60;

export type ExamUserAnswer = {
  questionId: number;
  selected: AnswerLetter | null;
  isCorrect: boolean;
};

export type CategoryStat = { correct: number; total: number };
export type CategoryStatsMap = Record<QuestionCategory, CategoryStat>;

export type ExamFinishResult = {
  sessionId: number | null;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  totalQuestions: number;
  durationSeconds: number;
  categoryStats: CategoryStatsMap;
  timeoutTriggered: boolean;
};

function emptyCategoryStats(): CategoryStatsMap {
  return {
    ilk_yardim: { correct: 0, total: 0 },
    trafik: { correct: 0, total: 0 },
    motor: { correct: 0, total: 0 },
    trafik_adabi: { correct: 0, total: 0 },
  };
}

function computeCategoryStats(
  questions: Question[],
  answers: ExamUserAnswer[],
): CategoryStatsMap {
  const stats = emptyCategoryStats();
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));
  for (const q of questions) {
    const cat = q.category;
    const answer = answerMap.get(q.id);
    stats[cat].total += 1;
    if (answer?.isCorrect) {
      stats[cat].correct += 1;
    }
  }
  return stats;
}

export function useExam() {
  const { user, isGuest } = useAuth();
  const queryClient = useQueryClient();

  const questionsQuery = useQuery({
    queryKey: queryKeys.exam.questions(),
    queryFn: fetchExamQuestions,
    staleTime: 0,
    gcTime: 0,
  });

  const sessionMutation = useMutation({
    mutationFn: ({ userId, ids }: { userId: string; ids: number[] }) =>
      createExamSession(userId, ids),
  });

  const submitMutation = useMutation({
    mutationFn: (input: SubmitExamInput) => submitExamSession(input),
  });

  const streakMutation = useMutation({
    mutationFn: () => updateStreak(user!.id),
  });

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerLetter>>(new Map());
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const questions = questionsQuery.data ?? [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;
  const answeredCount = answers.size;
  const isAllAnswered =
    totalQuestions > 0 && answeredCount === totalQuestions;

  const startExam = async () => {
    if (startedAt) return;
    setStartedAt(new Date());
    if (!isGuest && user && questions.length > 0) {
      try {
        const ids = questions.map((q) => q.id);
        const id = await sessionMutation.mutateAsync({
          userId: user.id,
          ids,
        });
        setSessionId(id);
      } catch (err) {
        console.warn('Sınav oturumu açılamadı:', err);
      }
    }
  };

  const handleSelectAnswer = (questionId: number, letter: AnswerLetter) => {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionId, letter);
      return next;
    });
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  };

  const goNext = () => goToQuestion(currentIndex + 1);
  const goPrev = () => goToQuestion(currentIndex - 1);

  const finishExam = async (
    timeoutTriggered = false,
  ): Promise<ExamFinishResult> => {
    const endedAt = new Date();
    const durationSeconds = startedAt
      ? Math.min(
          TOTAL_DURATION_SEC,
          Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
        )
      : TOTAL_DURATION_SEC;

    const answersList: ExamUserAnswer[] = questions.map((q) => {
      const selected = answers.get(q.id) ?? null;
      return {
        questionId: q.id,
        selected,
        isCorrect: selected !== null && selected === q.correct_answer,
      };
    });

    const correctCount = answersList.filter((a) => a.isCorrect).length;
    const blankCount = answersList.filter((a) => a.selected === null).length;
    const wrongCount = answersList.length - correctCount - blankCount;
    const categoryStats = computeCategoryStats(questions, answersList);
    const isPassed =
      totalQuestions > 0 && correctCount / totalQuestions >= 0.7;

    if (!isGuest && user && sessionId) {
      try {
        await submitMutation.mutateAsync({
          sessionId,
          userId: user.id,
          answers: answersList,
          totalQuestions,
          correctCount,
          wrongCount,
          blankCount,
          durationSeconds,
          isPassed,
        });
        streakMutation.mutate();
        queryClient.invalidateQueries({
          queryKey: queryKeys.stats.byUser(user.id),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.byUser(user.id),
        });
      } catch (err) {
        console.warn('Sınav kaydedilemedi:', err);
      }
    }

    return {
      sessionId,
      correctCount,
      wrongCount,
      blankCount,
      totalQuestions,
      durationSeconds,
      categoryStats,
      timeoutTriggered,
    };
  };

  return {
    questionsQuery,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    answeredCount,
    isAllAnswered,
    sessionId,
    startedAt,
    startExam,
    handleSelectAnswer,
    goToQuestion,
    goNext,
    goPrev,
    finishExam,
  };
}
