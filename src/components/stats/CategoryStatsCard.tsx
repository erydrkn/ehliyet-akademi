import { Heart, TrafficCone, Users, Wrench } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { View } from 'react-native';

import { CategoryBreakdownCard } from '@/components/exam/CategoryBreakdownCard';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { CATEGORIES } from '@/constants/categories';
import type { QuestionCategory } from '@/types/database';

type Props = {
  category: QuestionCategory;
  solved: number;
  correct: number;
};

type IconProps = { size?: number; color?: string };

const iconMap: Record<QuestionCategory, ComponentType<IconProps>> = {
  ilk_yardim: Heart,
  trafik: TrafficCone,
  motor: Wrench,
  trafik_adabi: Users,
};

export function CategoryStatsCard({ category, solved, correct }: Props) {
  if (solved > 0) {
    return (
      <CategoryBreakdownCard
        category={category}
        correct={correct}
        total={solved}
      />
    );
  }

  const meta = CATEGORIES.find((c) => c.category === category);
  const Icon = iconMap[category];

  return (
    <Card padding="md">
      <View className="flex-row items-center gap-3">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${meta?.iconBgClass ?? 'bg-gray-100 dark:bg-gray-800'}`}
        >
          <Icon size={18} color={meta?.iconColor ?? '#6B7280'} />
        </View>
        <View className="flex-1">
          <Typography variant="body" weight="semibold">
            {meta?.label ?? category}
          </Typography>
          <Typography variant="caption" color="muted">
            Henüz çözmedin
          </Typography>
        </View>
      </View>
    </Card>
  );
}
