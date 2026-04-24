-- ============================================================================
-- Migration: Indexes
-- Created:   2026-04-24
-- Purpose:   Performans için gerekli index'leri oluşturur.
--
-- Not: ai_explanations.UNIQUE(question_id, user_answer) ilk migration'da zaten
-- tanımlandı, buraya tekrar yazılmıyor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- questions
-- ----------------------------------------------------------------------------
CREATE INDEX idx_questions_category
  ON public.questions (category);

CREATE INDEX idx_questions_difficulty
  ON public.questions (difficulty);

CREATE INDEX idx_questions_category_difficulty
  ON public.questions (category, difficulty);

CREATE INDEX idx_questions_is_active
  ON public.questions (is_active)
  WHERE is_active = true;

CREATE INDEX idx_questions_tags
  ON public.questions USING GIN (tags);

-- ----------------------------------------------------------------------------
-- user_answers
-- ----------------------------------------------------------------------------
CREATE INDEX idx_user_answers_user_id
  ON public.user_answers (user_id);

CREATE INDEX idx_user_answers_question_id
  ON public.user_answers (question_id);

CREATE INDEX idx_user_answers_user_session
  ON public.user_answers (user_id, session_id);

CREATE INDEX idx_user_answers_answered_at
  ON public.user_answers (answered_at DESC);

CREATE INDEX idx_user_answers_is_correct
  ON public.user_answers (user_id, is_correct);

-- ----------------------------------------------------------------------------
-- exam_sessions
-- ----------------------------------------------------------------------------
CREATE INDEX idx_exam_sessions_user_id
  ON public.exam_sessions (user_id);

CREATE INDEX idx_exam_sessions_started_at
  ON public.exam_sessions (started_at DESC);

-- ----------------------------------------------------------------------------
-- user_stats_daily
-- ----------------------------------------------------------------------------
CREATE INDEX idx_user_stats_daily_date
  ON public.user_stats_daily (date DESC);
