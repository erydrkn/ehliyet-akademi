-- ============================================================================
-- Migration: Initial Schema
-- Created:   2026-04-24
-- Purpose:   Ehliyet Akademi veri tabanı — 6 temel tablo + updated_at trigger'ı
--            + yeni kullanıcı için user_profiles otomatik oluşturma trigger'ı.
--
-- Kapsam dışı (sonraki migration'larda):
--   - RLS policy'leri
--   - Index'ler
--   - Business fonksiyonları (streak, stats, weak categories, daily reset)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) user_profiles — auth.users extension
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  license_class TEXT DEFAULT 'B' CHECK (license_class IN ('A', 'A1', 'A2', 'B', 'B1', 'BE', 'C', 'C1', 'CE', 'D', 'D1', 'DE', 'F')),
  exam_date DATE,
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,
  streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  total_questions_solved INT DEFAULT 0,
  total_correct_answers INT DEFAULT 0,
  daily_question_count INT DEFAULT 0,
  daily_ai_count INT DEFAULT 0,
  last_daily_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2) questions — soru bankası
-- ----------------------------------------------------------------------------
CREATE TABLE public.questions (
  id BIGSERIAL PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ilk_yardim', 'trafik', 'motor', 'trafik_adabi')),
  difficulty INT DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  question_text TEXT NOT NULL,
  image_url TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  source TEXT,
  year INT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3) user_answers — kullanıcı cevap geçmişi
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_answers (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  question_id BIGINT REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_answer CHAR(1) CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  time_spent_seconds INT,
  session_type TEXT CHECK (session_type IN ('study', 'exam', 'review', 'weak_topics')),
  session_id BIGINT,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4) exam_sessions — deneme sınavı oturumları
-- ----------------------------------------------------------------------------
CREATE TABLE public.exam_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INT,
  total_questions INT DEFAULT 50,
  correct_count INT,
  wrong_count INT,
  blank_count INT,
  final_score INT,
  is_passed BOOLEAN,
  question_ids BIGINT[]
);

-- ----------------------------------------------------------------------------
-- 5) ai_explanations — AI açıklama cache
-- ----------------------------------------------------------------------------
CREATE TABLE public.ai_explanations (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_answer CHAR(1) NOT NULL CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  model_used TEXT DEFAULT 'claude-haiku-4-5',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (question_id, user_answer)
);

-- ----------------------------------------------------------------------------
-- 6) user_stats_daily — günlük istatistik
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_stats_daily (
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  questions_solved INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  categories JSONB DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, date)
);

-- ============================================================================
-- Trigger: updated_at otomatik güncelleme
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Trigger: yeni kullanıcı kaydolunca otomatik user_profiles kaydı oluştur
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
