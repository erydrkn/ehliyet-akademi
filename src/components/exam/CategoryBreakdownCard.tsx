import type { ComponentType } from 'react';
import { Heart, TrafficCone, Users, Wrench } from 'lucide-react-native';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Typography } from '@/components/ui/Typography';
import { CATEGORIES } from '@/constants/categories';
import type { QuestionCategory } from '@/types/database';

type Props = {
  category: QuestionCategory;
  correct: number;
  total: number;
};

type IconProps = { size?: number; color?: string };

const iconMap: Record<QuestionCategory, ComponentType<IconProps>> = {
  ilk_yardim: Heart,
  trafik: TrafficCone,
  motor: Wrench,
  trafik_adabi: Users,
};

function getEmojiAndVariant(pct: number): {
  emoji: string;
  variant: 'success' | 'warning' | 'danger';
} {
  if (pct >= 70) return { emoji: '✅', variant: 'success' };
  if (pct >= 50) return { emoji: '⚠️', variant: 'warning' };
  return { emoji: '❌', variant: 'danger' };
}

export function CategoryBreakdownCard({ category, correct, total }: Props) {
  const meta = CATEGORIES.find((c) => c.category === category);
  const label = meta?.label ?? category;
  const Icon = iconMap[category];
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const { emoji, variant } = getEmojiAndVariant(pct);

  return (
    <Card padding="md">
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View
              className={`h-8 w-8 items-center justify-center rounded-full ${meta?.iconBgClass ?? 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Icon size={16} color={meta?.iconColor ?? '#6B7280'} />
            </View>
            <Typography variant="body" weight="semibold">
              {label}
            </Typography>
          </View>
          <Typography variant="body" weight="semibold">
            {emoji} {correct}/{total} (%{pct})
          </Typography>
        </View>
        <ProgressBar value={pct} variant={variant} />
      </View>
    </Card>
  );
}
