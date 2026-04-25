import { supabase } from '@/lib/supabase';
import type {
  AnswerLetter,
  ExamSession,
  Question,
  QuestionCategory,
} from '@/types/database';

const DISTRIBUTION: Record<QuestionCategory, number> = {
  trafik: 23,
  ilk_yardim: 12,
  motor: 9,
  trafik_adabi: 6,
};

export async function fetchExamQuestions(): Promise<Question[]> {
  const entries = Object.entries(DISTRIBUTION) as [QuestionCategory, number][];

  const lists = await Promise.all(
    entries.map(async ([cat, count]) => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', cat)
        .eq('is_active', true)
        .limit(count * 3);

      if (error) {
        throw new Error(`${cat} soruları yüklenemedi: ${error.message}`);
      }
      const shuffled = [...(data ?? [])].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(count, shuffled.length));
    }),
  );

  const merged = lists.flat();
  return merged.sort(() => Math.random() - 0.5);
}

export async function createExamSession(
  userId: string,
  questionIds: number[],
): Promise<number> {
  const { data, error } = await supabase
    .from('exam_sessions')
    .insert({
      user_id: userId,
      total_questions: questionIds.length,
      question_ids: questionIds,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Sınav oturumu açılamadı: ${error.message}`);
  }
  if (!data) {
    throw new Error('Sınav oturumu açılamadı');
  }
  return data.id;
}

export type SubmitExamAnswer = {
  questionId: number;
  selected: AnswerLetter | null;
  isCorrect: boolean;
};

export type SubmitExamInput = {
  sessionId: number;
  userId: string;
  answers: SubmitExamAnswer[];
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  durationSeconds: number;
  isPassed: boolean;
};

export async function submitExamSession(input: SubmitExamInput): Promise<void> {
  const rows = input.answers.map((a) => ({
    user_id: input.userId,
    question_id: a.questionId,
    user_answer: a.selected,
    is_correct: a.selected === null ? null : a.isCorrect,
    session_type: 'exam' as const,
    session_id: input.sessionId,
  }));

  const { error: insertErr } = await supabase
    .from('user_answers')
    .insert(rows);
  if (insertErr) {
    throw new Error(`Cevaplar kaydedilemedi: ${insertErr.message}`);
  }

  const finalScore = Math.round(
    (input.correctCount / Math.max(1, input.totalQuestions)) * 100,
  );

  const { error: updateErr } = await supabase
    .from('exam_sessions')
    .update({
      completed_at: new Date().toISOString(),
      duration_seconds: input.durationSeconds,
      correct_count: input.correctCount,
      wrong_count: input.wrongCount,
      blank_count: input.blankCount,
      final_score: finalScore,
      is_passed: input.isPassed,
    })
    .eq('id', input.sessionId)
    .eq('user_id', input.userId);

  if (updateErr) {
    throw new Error(`Sınav kapatılamadı: ${updateErr.message}`);
  }
}

export type ExamReviewItem = {
  question: Question;
  userAnswer: AnswerLetter | null;
  isCorrect: boolean;
};

export type ExamReviewResult = {
  session: ExamSession;
  items: ExamReviewItem[];
};

export async function fetchExamReview(
  sessionId: number,
): Promise<ExamReviewResult> {
  const sessionRes = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionRes.error) {
    throw new Error(`Sınav bulunamadı: ${sessionRes.error.message}`);
  }
  const session = sessionRes.data;

  const answersRes = await supabase
    .from('user_answers')
    .select('user_answer, is_correct, question_id, questions(*)')
    .eq('session_id', sessionId)
    .eq('user_id', session.user_id);

  if (answersRes.error) {
    throw new Error(`Cevaplar yüklenemedi: ${answersRes.error.message}`);
  }

  const items: ExamReviewItem[] = (answersRes.data ?? []).map((row) => ({
    question: row.questions as unknown as Question,
    userAnswer: row.user_answer as AnswerLetter | null,
    isCorrect: row.is_correct ?? false,
  }));

  return { session, items };
}
