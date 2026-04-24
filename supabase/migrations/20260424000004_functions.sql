-- ============================================================================
-- Migration: Business Logic Functions
-- Created:   2026-04-24
-- Purpose:   İş mantığı fonksiyonları: günlük reset, kullanıcı istatistik,
--            zayıf kategoriler, streak güncelleme.
--
-- Tüm fonksiyonlar SECURITY DEFINER çünkü RLS'i bypass ederek DB-tarafında
-- güvenli hesaplama yaparlar. Çağrıyı yapan kullanıcı kimliği p_user_id
-- parametresi ile açıkça iletilir.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- A) reset_daily_counters
--    Her gün 00:00'da çağrılması beklenir (şimdilik manual tetiklenir).
--    Geçmiş günden reset edilmemiş kullanıcıların günlük sayaçlarını sıfırlar.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reset_daily_counters()
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles
  SET daily_question_count = 0,
      daily_ai_count = 0,
      last_daily_reset = CURRENT_DATE
  WHERE last_daily_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- B) calculate_user_stats
--    Kullanıcının tam istatistiğini tek JSON olarak döndürür.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_total_questions   INT;
  v_total_correct     INT;
  v_accuracy          NUMERIC;
  v_questions_today   INT;
  v_correct_today     INT;
  v_streak_days       INT;
  v_longest_streak    INT;
  v_category_breakdown JSON;
BEGIN
  -- Genel toplam
  SELECT
    COUNT(*)::INT,
    COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)::INT,
    ROUND(
      (COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)::NUMERIC
        / NULLIF(COUNT(*), 0)) * 100,
      2
    )
  INTO v_total_questions, v_total_correct, v_accuracy
  FROM public.user_answers
  WHERE user_id = p_user_id;

  -- Bugün
  SELECT
    COUNT(*)::INT,
    COALESCE(SUM(CASE WHEN is_correct THEN 1 ELSE 0 END), 0)::INT
  INTO v_questions_today, v_correct_today
  FROM public.user_answers
  WHERE user_id = p_user_id
    AND answered_at::DATE = CURRENT_DATE;

  -- Streak (user_profiles'tan)
  SELECT streak_days, longest_streak
  INTO v_streak_days, v_longest_streak
  FROM public.user_profiles
  WHERE id = p_user_id;

  -- Kategori kırılımı
  SELECT COALESCE(
    json_object_agg(
      cat_stats.category,
      json_build_object(
        'solved', cat_stats.solved,
        'correct', cat_stats.correct
      )
    ),
    '{}'::json
  )
  INTO v_category_breakdown
  FROM (
    SELECT
      q.category,
      COUNT(*)::INT AS solved,
      COALESCE(SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END), 0)::INT AS correct
    FROM public.user_answers ua
    JOIN public.questions q ON q.id = ua.question_id
    WHERE ua.user_id = p_user_id
    GROUP BY q.category
  ) AS cat_stats;

  RETURN json_build_object(
    'total_questions', v_total_questions,
    'total_correct',   v_total_correct,
    'accuracy_rate',   COALESCE(v_accuracy, 0),
    'questions_today', v_questions_today,
    'correct_today',   v_correct_today,
    'streak_days',     COALESCE(v_streak_days, 0),
    'longest_streak',  COALESCE(v_longest_streak, 0),
    'category_breakdown', v_category_breakdown
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- C) get_weak_categories
--    En düşük accuracy_rate'e sahip kategorileri döndürür. En az 5 soru
--    çözülmüş kategoriler dikkate alınır.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_weak_categories(
  p_user_id UUID,
  p_limit   INT DEFAULT 3
)
RETURNS TABLE(
  category        TEXT,
  total_answered  BIGINT,
  correct_count   BIGINT,
  accuracy_rate   NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.category,
    COUNT(*) AS total_answered,
    COALESCE(SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END), 0) AS correct_count,
    ROUND(
      (COALESCE(SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END), 0)::NUMERIC
        / NULLIF(COUNT(*), 0)) * 100,
      2
    ) AS accuracy_rate
  FROM public.user_answers ua
  JOIN public.questions q ON q.id = ua.question_id
  WHERE ua.user_id = p_user_id
  GROUP BY q.category
  HAVING COUNT(*) >= 5
  ORDER BY accuracy_rate ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- D) update_streak
--    Kullanıcının streak'ini günceller, yeni streak_days'i döner.
--
--    Dallar:
--      last_active_date NULL              → streak=1
--      last_active_date = CURRENT_DATE    → değişiklik yok
--      last_active_date = CURRENT_DATE-1  → streak += 1
--      diğer (aradan gün geçmiş)          → streak=1 (yeniden başlar)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  v_last_date     DATE;
  v_current_streak INT;
  v_longest       INT;
  v_new_streak    INT;
BEGIN
  SELECT last_active_date, streak_days, longest_streak
  INTO v_last_date, v_current_streak, v_longest
  FROM public.user_profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  IF v_last_date IS NULL THEN
    v_new_streak := 1;
    UPDATE public.user_profiles
    SET streak_days = v_new_streak,
        longest_streak = GREATEST(COALESCE(v_longest, 0), v_new_streak),
        last_active_date = CURRENT_DATE
    WHERE id = p_user_id;

  ELSIF v_last_date = CURRENT_DATE THEN
    -- Bugün zaten aktif, streak değişmiyor.
    v_new_streak := v_current_streak;

  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_new_streak := COALESCE(v_current_streak, 0) + 1;
    UPDATE public.user_profiles
    SET streak_days = v_new_streak,
        longest_streak = GREATEST(COALESCE(v_longest, 0), v_new_streak),
        last_active_date = CURRENT_DATE
    WHERE id = p_user_id;

  ELSE
    -- Arada gün atlanmış, streak yeniden başlar.
    v_new_streak := 1;
    UPDATE public.user_profiles
    SET streak_days = v_new_streak,
        last_active_date = CURRENT_DATE
    WHERE id = p_user_id;
  END IF;

  RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
