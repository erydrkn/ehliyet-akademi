-- Soruları konu bazında etiketlemek için topic kolonu.
-- Plan A (Mini Plan A): keyword-only auto-tagging script.
-- 'diger' default değil — script atayacak. Kolon önce nullable olarak eklenir.
-- CHECK constraint yok: topic listesi UI'da yaşıyor, esnek kalsın.

ALTER TABLE public.questions ADD COLUMN topic TEXT;

CREATE INDEX idx_questions_topic ON public.questions(topic);
CREATE INDEX idx_questions_category_topic ON public.questions(category, topic);
