-- ============================================================================
-- Migration: RLS Policies
-- Created:   2026-04-24
-- Purpose:   6 tablo için Row Level Security'yi açar ve minimum policy set'ini
--            tanımlar.
--
-- Notlar:
--   * service_role RLS'i otomatik bypass eder, ayrı policy gerektirmez.
--   * user_profiles INSERT için policy yok — handle_new_user() trigger'ı
--     SECURITY DEFINER olduğu için RLS'i bypass ederek kaydı oluşturur.
--   * user_answers UPDATE/DELETE yok (cevap geçmişi immutable).
--   * user_stats_daily ve ai_explanations yazma işlemleri SECURITY DEFINER
--     fonksiyonlar veya service_role üzerinden yapılacak.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- RLS aktif et
-- ----------------------------------------------------------------------------
ALTER TABLE public.user_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_explanations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_daily  ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- user_profiles
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- questions (public, herkes aktif soruları okuyabilir)
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can read active questions"
  ON public.questions
  FOR SELECT
  USING (is_active = true);

-- ----------------------------------------------------------------------------
-- user_answers
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own answers"
  ON public.user_answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON public.user_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- exam_sessions
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own exam sessions"
  ON public.exam_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exam sessions"
  ON public.exam_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exam sessions"
  ON public.exam_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- ai_explanations (authenticated user'lar ortak cache'i okuyabilir)
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated users can read ai explanations"
  ON public.ai_explanations
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- user_stats_daily
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view own daily stats"
  ON public.user_stats_daily
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
