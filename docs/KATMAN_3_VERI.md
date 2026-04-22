# 🗄️ KATMAN 3: Veri Katmanı (Supabase + Soru Bankası)

> **Amaç:** Supabase veritabanı şemasını kurmak, soru bankasını doldurmak ve uygulama ile veri alışverişini sağlamak.
>
> **Süre:** 8-12 saat (2-3 oturum)
> **Zorluk:** ⭐⭐⭐⭐ (SQL + içerik hazırlama + data flow)

---

## 📋 Önkoşullar

- [ ] Katman 1 ve 2 tamamlandı
- [ ] Supabase hesabı açık, proje oluşturuldu
- [ ] Supabase URL ve anon key not edildi
- [ ] En az 100 ilk yardım sorusu JSON formatında hazır (SETUP_ONCE.md'deki yöntemle)

---

## 🎯 Bu Katmanın Hedefi

### Backend Tarafı
1. SQL migration dosyalarıyla 6 tablo oluşturulmuş
2. Row Level Security (RLS) policy'leri aktif
3. Index'ler kurulmuş (performans için)
4. Supabase fonksiyonları yazılmış (streak, istatistik vb.)
5. İlk 500 soru veritabanına yüklenmiş

### Frontend Tarafı
1. Supabase client kurulmuş (`src/lib/supabase.ts`)
2. TypeScript tipleri auto-generated
3. API fonksiyonları yazılmış (`src/api/`)
4. TanStack Query hook'ları hazır (`src/hooks/`)
5. Uygulama gerçek soru listesi gösteriyor (placeholder değil)

---

## 📦 Yüklenecek Paketler

```bash
npm install @supabase/supabase-js
```

İsteğe bağlı (CLI kullanmak istersen):
```bash
npm install -g supabase
```

---

## 🚀 Claude Code'a Verilecek Prompt

```
Selam! Katman 3: Veri Katmanı'nı kuruyoruz.

Önkoşullar:
- Katman 1-2 tamamlandı
- Supabase projesi hazır (URL ve anon key env'de)
- İlk 100-500 soru JSON dosyasında hazır (assets/data/questions.json)

Proje kökündeki CLAUDE.md'yi oku, kurallara uy.

BU KATMANIN KAPSAMI:
1. Supabase SQL şeması (6 tablo, RLS, index'ler)
2. Database fonksiyonları (streak, weak topics, daily reset)
3. Soru bankası import script'i
4. Supabase client ve API layer
5. TanStack Query hook'ları
6. İlk gerçek veri entegrasyonu

YAPILACAKLAR:

A. SQL Migration Dosyaları (supabase/migrations/):
   1. 20260421000001_initial_schema.sql
      - user_profiles
      - questions
      - user_answers
      - exam_sessions
      - ai_explanations
      - user_stats_daily
      (Tam şema aşağıda)
   
   2. 20260421000002_rls_policies.sql
      - Her tablo için RLS aktif
      - Her policy spesifik ve güvenli
   
   3. 20260421000003_indexes.sql
      - Performans için gerekli indexler
   
   4. 20260421000004_functions.sql
      - reset_daily_counters()
      - calculate_user_stats(user_id)
      - get_weak_categories(user_id)
      - update_streak(user_id)

B. Soru Import:
   5. scripts/import-questions.ts
      - assets/data/questions.json okur
      - Supabase'e batch insert
      - Duplicate kontrolü
   
C. Client Tarafı:
   6. src/lib/supabase.ts (client setup)
   7. src/types/database.ts (Supabase generated types)
   8. src/constants/query-keys.ts (TanStack Query keys)
   9. src/api/questions.ts (fetchQuestions, fetchQuestionById)
   10. src/api/answers.ts (submitAnswer, getUserAnswers)
   11. src/api/profile.ts (getProfile, updateProfile)
   12. src/api/stats.ts (getUserStats, getWeakCategories)
   
D. Hooks:
   13. src/hooks/useQuestions.ts
   14. src/hooks/useUserStats.ts
   
E. Test:
   15. app/test-data.tsx — gerçek soru listesini gösteren test ekranı

KURALLAR:
- Env variables'ı expo-constants üzerinden oku
- Service role key ASLA client'ta kullanma (sadece SQL migrations için)
- Tüm API fonksiyonları TypeScript return type ile
- Tüm query/mutation'lar TanStack Query ile
- Error handling: kullanıcıya Türkçe mesaj göster
- Offline cache stratejisi düşün (TanStack Query staleTime)

PLAN MODUNDA BAŞLA:

Plan:
1. Önce Supabase dashboard'ta SQL'leri çalıştırma sırasını öneri
2. Dosya oluşturma sırası
3. Nereden nereye veri akışı (client → API → Supabase)
4. Test senaryoları

Sonra TEK TEK dosyalar. Her bölüm sonunda dur, test edelim.

Kritik: SQL'lerde tablo adları snake_case, TypeScript tarafında camelCase. 
Supabase client otomatik dönüşüm yapmalı (veya manuel mapping).

Başla.
```

---

## 💾 SQL Şema Referansı

### Migration 1: Initial Schema

**Dosya:** `supabase/migrations/20260421000001_initial_schema.sql`

```sql
-- Kullanıcı profilleri (auth.users'ı extend ediyoruz)
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

-- Sorular
CREATE TABLE public.questions (
  id BIGSERIAL PRIMARY KEY,
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

-- Kullanıcı cevapları
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

-- Deneme sınavı oturumları
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

-- AI açıklama cache'i
CREATE TABLE public.ai_explanations (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_answer CHAR(1) NOT NULL CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  model_used TEXT DEFAULT 'claude-haiku-4-5',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, user_answer)
);

-- Günlük istatistik
CREATE TABLE public.user_stats_daily (
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  questions_solved INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  categories JSONB DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, date)
);

-- Trigger: updated_at otomatik güncelleme
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

-- Trigger: yeni kullanıcı kaydolunca profil oluştur
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
```

### Migration 2: RLS Policies

**Dosya:** `supabase/migrations/20260421000002_rls_policies.sql`

```sql
-- RLS aktif et
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_daily ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- questions policies (herkes okuyabilir, sadece servis rolü yazabilir)
CREATE POLICY "Anyone can read active questions"
  ON public.questions FOR SELECT
  USING (is_active = true);

-- user_answers policies
CREATE POLICY "Users can view own answers"
  ON public.user_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON public.user_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- exam_sessions policies
CREATE POLICY "Users can view own exam sessions"
  ON public.exam_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exam sessions"
  ON public.exam_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exam sessions"
  ON public.exam_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ai_explanations (herkes okuyabilir, cache amaçlı)
CREATE POLICY "Anyone can read ai explanations"
  ON public.ai_explanations FOR SELECT
  USING (true);

-- user_stats_daily policies
CREATE POLICY "Users can view own stats"
  ON public.user_stats_daily FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own stats"
  ON public.user_stats_daily FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Migration 3: Index'ler

**Dosya:** `supabase/migrations/20260421000003_indexes.sql`

```sql
-- questions
CREATE INDEX idx_questions_category ON public.questions(category) WHERE is_active = true;
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_tags ON public.questions USING gin(tags);

-- user_answers
CREATE INDEX idx_user_answers_user_date ON public.user_answers(user_id, answered_at DESC);
CREATE INDEX idx_user_answers_question ON public.user_answers(question_id);
CREATE INDEX idx_user_answers_session ON public.user_answers(session_id);

-- exam_sessions
CREATE INDEX idx_exam_sessions_user_date ON public.exam_sessions(user_id, started_at DESC);

-- user_stats_daily
CREATE INDEX idx_stats_user_date ON public.user_stats_daily(user_id, date DESC);

-- ai_explanations
CREATE INDEX idx_ai_explanations_lookup ON public.ai_explanations(question_id, user_answer);
```

### Migration 4: Database Fonksiyonları

**Dosya:** `supabase/migrations/20260421000004_functions.sql`

```sql
-- Zayıf kategorileri getir
CREATE OR REPLACE FUNCTION public.get_weak_categories(p_user_id UUID, p_limit INT DEFAULT 2)
RETURNS TABLE(category TEXT, success_rate NUMERIC, total_answered INT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.category,
    ROUND(
      (SUM(CASE WHEN ua.is_correct THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100,
      2
    ) AS success_rate,
    COUNT(*)::INT AS total_answered
  FROM public.user_answers ua
  JOIN public.questions q ON q.id = ua.question_id
  WHERE ua.user_id = p_user_id
    AND ua.answered_at > NOW() - INTERVAL '30 days'
  GROUP BY q.category
  HAVING COUNT(*) >= 10
  ORDER BY success_rate ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcı istatistik özeti
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_questions', COUNT(*),
    'correct_count', SUM(CASE WHEN is_correct THEN 1 ELSE 0 END),
    'accuracy_rate', ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2),
    'categories', json_object_agg(
      q.category,
      json_build_object(
        'total', COUNT(*),
        'correct', SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)
      )
    )
  )
  INTO result
  FROM public.user_answers ua
  JOIN public.questions q ON q.id = ua.question_id
  WHERE ua.user_id = p_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Streak güncelleme (her soru çözümünde trigger edilir)
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_date DATE;
  current_streak INT;
BEGIN
  SELECT last_active_date, streak_days
  INTO last_date, current_streak
  FROM public.user_profiles
  WHERE id = p_user_id;
  
  IF last_date IS NULL OR last_date < CURRENT_DATE - 1 THEN
    -- Streak kırıldı, sıfırla
    UPDATE public.user_profiles
    SET streak_days = 1,
        last_active_date = CURRENT_DATE
    WHERE id = p_user_id;
  ELSIF last_date = CURRENT_DATE - 1 THEN
    -- Dün aktifti, streak devam
    UPDATE public.user_profiles
    SET streak_days = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_active_date = CURRENT_DATE
    WHERE id = p_user_id;
  ELSIF last_date = CURRENT_DATE THEN
    -- Bugün zaten aktif, streak değişmedi
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Günlük sayaç reset (cron job ile çağrılır)
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
```

---

## 🧱 Frontend Kod Referansları

### `src/lib/supabase.ts`

```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from '@/types/database';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials missing');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### `src/api/questions.ts`

```typescript
import { supabase } from '@/lib/supabase';

export type QuestionCategory = 'ilk_yardim' | 'trafik' | 'motor' | 'trafik_adabi';

export async function fetchQuestionsByCategory(
  category: QuestionCategory,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function fetchRandomQuestions(count: number = 50) {
  const { data, error } = await supabase
    .rpc('get_random_questions', { p_count: count });
  
  if (error) throw error;
  return data;
}
```

### `src/hooks/useQuestions.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchQuestionsByCategory, type QuestionCategory } from '@/api/questions';
import { queryKeys } from '@/constants/query-keys';

export function useQuestions(category: QuestionCategory, limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.questions.byCategory(category, limit),
    queryFn: () => fetchQuestionsByCategory(category, limit),
    staleTime: 1000 * 60 * 30, // 30 dakika
  });
}
```

---

## 📥 Soru Import Stratejisi

### JSON Format (assets/data/questions.json)

```json
[
  {
    "category": "ilk_yardim",
    "difficulty": 2,
    "question_text": "Kalp masajı uygulanırken dakikada kaç bası yapılmalıdır?",
    "option_a": "50-60",
    "option_b": "80-90",
    "option_c": "100-120",
    "option_d": "140-160",
    "correct_answer": "C",
    "explanation": "Erişkin kalp masajında dakikada 100-120 bası yapılır.",
    "tags": ["kalp_masaji", "yetiskin", "temel_yasam_destegi"]
  }
]
```

### Import Script

`scripts/import-questions.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // SERVICE KEY kullan import için

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function importQuestions() {
  const filePath = path.join(__dirname, '../assets/data/questions.json');
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const BATCH_SIZE = 100;
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('questions').insert(batch);
    
    if (error) {
      console.error(`Batch ${i} failed:`, error);
      process.exit(1);
    }
    console.log(`Imported ${i + batch.length}/${questions.length}`);
  }
  
  console.log('✅ Import complete');
}

importQuestions();
```

**Çalıştırma:** `npx ts-node scripts/import-questions.ts`

---

## ✅ Oturum Sonu Kontrol Listesi

### Backend
- [ ] Tüm 4 migration Supabase'de çalıştırıldı
- [ ] 6 tablo oluşturuldu (Supabase Dashboard'dan gör)
- [ ] RLS tüm tablolarda aktif
- [ ] Index'ler oluşturuldu
- [ ] En az 200 soru import edildi (ideal: 500)
- [ ] 4 kategori de dengeli dağılmış

### Frontend
- [ ] `supabase` client çalışıyor
- [ ] TypeScript tipleri üretildi
- [ ] Query hook'ları hatasız
- [ ] Test ekranında gerçek soru listesi görünüyor
- [ ] Kategori filtreleme çalışıyor
- [ ] Loading ve error state'leri düzgün

### Güvenlik
- [ ] Service role key client'ta kullanılmıyor
- [ ] Anon key .env'de, .gitignore'da
- [ ] RLS policy'leri test edildi (yetkisiz kullanıcı veri göremiyor)

---

## 🧪 Test Senaryoları

### RLS Test
```sql
-- Supabase SQL Editor'de:
-- Kullanıcı A olarak giriş yapmış gibi davran
SELECT * FROM user_profiles; -- Sadece kendi profilini görmeli
SELECT * FROM user_answers; -- Sadece kendi cevaplarını
SELECT * FROM questions; -- Hepsini görebilmeli
```

### API Test
Test ekranında (`app/test-data.tsx`):
1. İlk yardım kategorisi butonu → 10 soru listelenmeli
2. Trafik kategorisi butonu → 10 soru
3. Soru ID'si ile tek soru çekme
4. Network kesilirse error state görünmeli

---

## 🐛 Sık Sorunlar

### "Migration error: relation already exists"
Tablolar zaten varsa migrations atlanmış olabilir. Dashboard → Database → Tables'tan kontrol et.

### "RLS blocks all queries"
Anon key ile çağrı yapıyorsun ama policy auth.uid() bekliyor. Önce login, sonra query.

### "Cannot find module '@supabase/supabase-js'"
`npm install @supabase/supabase-js` yapıldı mı kontrol et. Metro cache temizle.

### "Type 'Database' not found"
Types generate etmen lazım:
```bash
npx supabase gen types typescript --project-id YOUR_ID > src/types/database.ts
```

---

## 🎯 Sıradaki Katman

Veri katmanı çalışıyor. Şimdi kullanıcı auth ekliyoruz.

1. Git commit + push
2. Oturumu kapat
3. **`KATMAN_4_AUTH.md`** dosyasını aç

---

*Bu katman tamamlandığında uygulama "arkada gerçek bir veritabanı var" diyebilir. Bir sonraki katmanda kullanıcıları tanıyacağız.*
