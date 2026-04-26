import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryBreakdownCard } from '@/components/exam/CategoryBreakdownCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { INTERSTITIAL_RULES } from '@/constants/ads';
import { CATEGORIES } from '@/constants/categories';
import { useAuth } from '@/hooks/useAuth';
import { preloadInterstitial, showInterstitial } from '@/lib/ads';
import type { QuestionCategory } from '@/types/database';

type CategoryStat = { correct: number; total: number };
type CategoryStatsMap = Record<QuestionCategory, CategoryStat>;

const EMPTY_STATS: CategoryStatsMap = {
  ilk_yardim: { correct: 0, total: 0 },
  trafik: { correct: 0, total: 0 },
  motor: { correct: 0, total: 0 },
  trafik_adabi: { correct: 0, total: 0 },
};

const ORDER: QuestionCategory[] = ['trafik', 'ilk_yardim', 'motor', 'trafik_adabi'];

function parseStats(raw: string | undefined): CategoryStatsMap {
  if (!raw) return EMPTY_STATS;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<CategoryStatsMap>;
    return { ...EMPTY_STATS, ...parsed };
  } catch {
    return EMPTY_STATS;
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}sn`;
  return `${mins}dk ${secs}sn`;
}

function findWeakest(
  stats: CategoryStatsMap,
): { category: QuestionCategory; pct: number } | null {
  let weakest: { category: QuestionCategory; pct: number } | null = null;
  for (const cat of ORDER) {
    const s = stats[cat];
    if (s.total === 0) continue;
    const pct = Math.round((s.correct / s.total) * 100);
    if (pct < 70 && (!weakest || pct < weakest.pct)) {
      weakest = { category: cat, pct };
    }
  }
  return weakest;
}

export default function ExamResultScreen() {
  const router = useRouter();
  const { isGuest, exitGuest } = useAuth();
  const params = useLocalSearchParams<{
    sessionId?: string;
    correct?: string;
    total?: string;
    duration?: string;
    timeout?: string;
    stats?: string;
  }>();

  const correct = Math.max(0, Number(params.correct ?? 0));
  const total = Math.max(1, Number(params.total ?? 50));
  const durationSeconds = Math.max(0, Number(params.duration ?? 0));
  const timeoutTriggered = params.timeout === '1';
  const sessionIdNum = params.sessionId ? Number(params.sessionId) : null;
  const hasSession =
    sessionIdNum !== null && Number.isFinite(sessionIdNum) && sessionIdNum > 0;
  const stats = parseStats(params.stats);

  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 70;
  const weakest = findWeakest(stats);
  const weakestLabel = weakest
    ? (CATEGORIES.find((c) => c.category === weakest.category)?.label ??
      weakest.category)
    : null;

  const handleCreateAccount = async () => {
    await exitGuest();
    router.replace('/register' as Href);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void showInterstitial(INTERSTITIAL_RULES.EXAM_END_PROBABILITY);
    }, 1500);

    preloadInterstitial();

    return () => clearTimeout(timer);
  }, []);

  const scoreCardClass = passed
    ? 'bg-green-50 dark:bg-green-950'
    : 'bg-red-50 dark:bg-red-950';

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <ScrollView contentContainerClassName="p-4 gap-4 flex-grow">
        <Card padding="lg" className={scoreCardClass}>
          <View className="items-center gap-2">
            <Typography variant="h1" align="center">
              {passed ? '✅ GEÇTİN!' : '❌ KALDIN'}
            </Typography>
            <Typography variant="h1" align="center">
              {correct} / {total}
            </Typography>
            <Typography variant="h2" color="muted" align="center">
              %{pct}
            </Typography>
            <Typography variant="caption" color="muted" align="center">
              Geçer not: %70 (35/50)
            </Typography>
            <Typography variant="caption" color="muted" align="center">
              Süre: {formatDuration(durationSeconds)}
            </Typography>
            {timeoutTriggered && (
              <Typography color="warning" align="center">
                ⏰ Süre doldu
              </Typography>
            )}
          </View>
        </Card>

        <Typography variant="h3">Kategori Analizi</Typography>
        {ORDER.map((cat) => (
          <CategoryBreakdownCard
            key={cat}
            category={cat}
            correct={stats[cat].correct}
            total={stats[cat].total}
          />
        ))}

        {weakest && weakestLabel && (
          <Card padding="md" className="bg-amber-50 dark:bg-amber-950/40">
            <View className="gap-2">
              <Typography variant="body" weight="semibold">
                💡 Önerimiz
              </Typography>
              <Typography variant="body" color="secondary">
                {weakestLabel} kategorisinde çalış, %{weakest.pct}&apos;den
                %70+&apos;a çıkar.
              </Typography>
            </View>
          </Card>
        )}

        {isGuest && (
          <Card padding="md">
            <View className="gap-3">
              <Typography weight="semibold">
                ⚠️ İlerlemen kaydedilmedi
              </Typography>
              <Typography variant="caption" color="secondary">
                Misafir modunda çözdüğün sınav saklanmaz. 💎 Kayıt ol ve tüm
                ilerlemeyi takip et!
              </Typography>
              <Button onPress={handleCreateAccount} fullWidth>
                Hesap Aç (Ücretsiz)
              </Button>
            </View>
          </Card>
        )}

        <View className="gap-3 pt-2">
          {hasSession && !isGuest && (
            <Button
              fullWidth
              onPress={() =>
                router.push(`/exam/review/${sessionIdNum}` as Href)
              }
            >
              Soruları İncele ({total} soru)
            </Button>
          )}
          <Button
            variant="secondary"
            fullWidth
            onPress={() => router.replace('/exam' as Href)}
          >
            Yeni Sınav Yap
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onPress={() => router.replace('/(tabs)' as Href)}
          >
            Ana Sayfa
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
