import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { submitAnswer } from '@/api/answers';
import { updateStreak } from '@/api/stats';
import { queryKeys } from '@/constants/query-keys';
import { useAuth } from '@/hooks/useAuth';
import { useRandomQuestions } from '@/hooks/useQuestions';
import type { AnswerLetter, QuestionCategory } from '@/types/database';

const QUIZ_TOTAL = 10;

export type QuizUserAnswer = {
  questionId: number;
  selected: AnswerLetter;
  isCorrect: boolean;
};

export function useQuiz(category: QuestionCategory) {
  const { user, isGuest } = useAuth();
  const queryClient = useQueryClient();

  const questionsQuery = useRandomQuestions(QUIZ_TOTAL, { category });
  const questions = questionsQuery.data ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerLetter | null>(
    null,
  );
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<QuizUserAnswer[]>([]);

  const submitMutation = useMutation({
    mutationFn: submitAnswer,
    onError: (err) => {
      console.warn('Cevap kaydedilemedi:', err);
    },
  });

  const streakMutation = useMutation({
    mutationFn: () => updateStreak(user!.id),
    onSuccess: () => {
      if (!user) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.byUser(user.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.byUser(user.id),
      });
    },
    onError: (err) => {
      console.warn('Streak güncellenemedi:', err);
    },
  });

  const totalQuestions = questions.length || QUIZ_TOTAL;
  const currentQuestion = questions[currentIndex] ?? null;
  const isLastQuestion = currentIndex >= totalQuestions - 1;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  const handleSelectAnswer = (letter: AnswerLetter) => {
    if (isAnswered) return;
    setSelectedAnswer(letter);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedAnswer,
        isCorrect,
      },
    ]);
    setIsAnswered(true);

    if (!isGuest && user) {
      submitMutation.mutate({
        user_id: user.id,
        question_id: currentQuestion.id,
        user_answer: selectedAnswer,
        is_correct: isCorrect,
        session_type: 'study',
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) return;
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleQuizComplete = (): number => {
    if (!isGuest && user) {
      streakMutation.mutate();
    }
    return correctCount;
  };

  return {
    questionsQuery,
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    isAnswered,
    isLastQuestion,
    correctCount,
    userAnswers,
    handleSelectAnswer,
    handleSubmitAnswer,
    handleNext,
    handleQuizComplete,
  };
}
