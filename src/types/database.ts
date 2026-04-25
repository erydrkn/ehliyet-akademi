/**
 * Supabase veri tabanı şemasının TypeScript yansıması.
 *
 * Bu dosya şimdilik elle yazılıyor. İlerde `supabase gen types typescript`
 * ile otomatik üretime geçilebilir (şimdilik manuel tutmak küçük projede
 * daha kontrollü).
 */

// ---------------------------------------------------------------------------
// Literal union tipler (paylaşılan)
// ---------------------------------------------------------------------------

export type QuestionCategory = 'ilk_yardim' | 'trafik' | 'motor' | 'trafik_adabi';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type AnswerLetter = 'A' | 'B' | 'C' | 'D';
export type SessionType = 'study' | 'exam' | 'review' | 'weak_topics';
export type LicenseClass =
  | 'A'
  | 'A1'
  | 'A2'
  | 'B'
  | 'B1'
  | 'BE'
  | 'C'
  | 'C1'
  | 'CE'
  | 'D'
  | 'D1'
  | 'DE'
  | 'F';

// ---------------------------------------------------------------------------
// Tablo: user_profiles
// ---------------------------------------------------------------------------

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  license_class: LicenseClass;
  exam_date: string | null;
  is_premium: boolean;
  premium_until: string | null;
  streak_days: number;
  longest_streak: number;
  last_active_date: string | null;
  total_questions_solved: number;
  total_correct_answers: number;
  daily_question_count: number;
  daily_ai_count: number;
  last_daily_reset: string;
  created_at: string;
  updated_at: string;
};

export type UserProfileInsert = {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  license_class?: LicenseClass;
  exam_date?: string | null;
  is_premium?: boolean;
  premium_until?: string | null;
};

export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;

// ---------------------------------------------------------------------------
// Tablo: questions
// ---------------------------------------------------------------------------

export type Question = {
  id: number;
  external_id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  question_text: string;
  image_url: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: AnswerLetter;
  explanation: string | null;
  topic: string | null;
  source: string | null;
  year: number | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type QuestionInsert = Omit<Question, 'id' | 'created_at' | 'updated_at' | 'difficulty' | 'is_active'> & {
  difficulty?: Difficulty;
  is_active?: boolean;
};

export type QuestionUpdate = Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>;

// ---------------------------------------------------------------------------
// Tablo: user_answers
// ---------------------------------------------------------------------------

export type UserAnswer = {
  id: number;
  user_id: string;
  question_id: number;
  user_answer: AnswerLetter | null;
  is_correct: boolean | null;
  time_spent_seconds: number | null;
  session_type: SessionType | null;
  session_id: number | null;
  answered_at: string;
};

export type UserAnswerInsert = {
  user_id: string;
  question_id: number;
  user_answer?: AnswerLetter | null;
  is_correct?: boolean | null;
  time_spent_seconds?: number | null;
  session_type?: SessionType | null;
  session_id?: number | null;
};

export type UserAnswerUpdate = Partial<Omit<UserAnswer, 'id' | 'answered_at'>>;

// ---------------------------------------------------------------------------
// Tablo: exam_sessions
// ---------------------------------------------------------------------------

export type ExamSession = {
  id: number;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  total_questions: number;
  correct_count: number | null;
  wrong_count: number | null;
  blank_count: number | null;
  final_score: number | null;
  is_passed: boolean | null;
  question_ids: number[] | null;
};

export type ExamSessionInsert = {
  user_id: string;
  total_questions?: number;
  question_ids?: number[] | null;
};

export type ExamSessionUpdate = Partial<Omit<ExamSession, 'id' | 'user_id' | 'started_at'>>;

// ---------------------------------------------------------------------------
// Tablo: ai_explanations
// ---------------------------------------------------------------------------

export type AiExplanation = {
  id: number;
  question_id: number;
  user_answer: AnswerLetter;
  explanation: string;
  model_used: string;
  created_at: string;
};

export type AiExplanationInsert = {
  question_id: number;
  user_answer: AnswerLetter;
  explanation: string;
  model_used?: string;
};

export type AiExplanationUpdate = Partial<Omit<AiExplanation, 'id' | 'created_at'>>;

// ---------------------------------------------------------------------------
// Tablo: user_stats_daily
// ---------------------------------------------------------------------------

export type CategoryDailyBreakdown = Record<string, { solved: number; correct: number }>;

export type UserStatsDaily = {
  user_id: string;
  date: string;
  questions_solved: number;
  correct_count: number;
  time_spent_seconds: number;
  categories: CategoryDailyBreakdown;
};

export type UserStatsDailyInsert = {
  user_id: string;
  date: string;
  questions_solved?: number;
  correct_count?: number;
  time_spent_seconds?: number;
  categories?: CategoryDailyBreakdown;
};

export type UserStatsDailyUpdate = Partial<Omit<UserStatsDaily, 'user_id' | 'date'>>;

// ---------------------------------------------------------------------------
// RPC function sonuç tipleri
// ---------------------------------------------------------------------------

export type UserStatsResult = {
  total_questions: number;
  total_correct: number;
  accuracy_rate: number;
  questions_today: number;
  correct_today: number;
  streak_days: number;
  longest_streak: number;
  category_breakdown: Record<string, { solved: number; correct: number }>;
};

export type WeakCategoryResult = {
  category: string;
  total_answered: number;
  correct_count: number;
  accuracy_rate: number;
};

// ---------------------------------------------------------------------------
// Database root — supabase-js'in beklediği şekil
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: UserProfileInsert;
        Update: UserProfileUpdate;
        Relationships: [];
      };
      questions: {
        Row: Question;
        Insert: QuestionInsert;
        Update: QuestionUpdate;
        Relationships: [];
      };
      user_answers: {
        Row: UserAnswer;
        Insert: UserAnswerInsert;
        Update: UserAnswerUpdate;
        Relationships: [];
      };
      exam_sessions: {
        Row: ExamSession;
        Insert: ExamSessionInsert;
        Update: ExamSessionUpdate;
        Relationships: [];
      };
      ai_explanations: {
        Row: AiExplanation;
        Insert: AiExplanationInsert;
        Update: AiExplanationUpdate;
        Relationships: [];
      };
      user_stats_daily: {
        Row: UserStatsDaily;
        Insert: UserStatsDailyInsert;
        Update: UserStatsDailyUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      calculate_user_stats: {
        Args: { p_user_id: string };
        Returns: UserStatsResult;
      };
      get_weak_categories: {
        Args: { p_user_id: string; p_limit?: number };
        Returns: WeakCategoryResult[];
      };
      update_streak: {
        Args: { p_user_id: string };
        Returns: number;
      };
      reset_daily_counters: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
