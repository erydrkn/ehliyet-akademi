import { Heart, TrafficCone, Users, Wrench } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { CATEGORIES, type CategoryMeta } from '@/constants/categories';
import type { QuestionCategory } from '@/types/database';

type CategoryStats = { solved: number; correct: number };

type Props = {
  categoryBreakdown?: Record<string, CategoryStats>;
  onPressCategory: (category: QuestionCategory) => void;
};

type IconProps = { size?: number; color?: string };

const iconMap: Record<QuestionCategory, ComponentType<IconProps>> = {
  ilk_yardim: Heart,
  trafik: TrafficCone,
  motor: Wrench,
  trafik_adabi: Users,
};

export function CategoryGrid({ categoryBreakdown, onPressCategory }: Props) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {CATEGORIES.map((meta) => (
        <CategoryCard
          key={meta.category}
          meta={meta}
          stats={categoryBreakdown?.[meta.category]}
          onPress={() => onPressCategory(meta.category)}
        />
      ))}
    </View>
  );
}

type CardProps = {
  meta: CategoryMeta;
  stats?: CategoryStats;
  onPress: () => void;
};

function CategoryCard({ meta, stats, onPress }: CardProps) {
  const Icon = iconMap[meta.category];
  const hasProgress = stats && stats.solved > 0;
  const accuracy = hasProgress
    ? Math.round((stats.correct / stats.solved) * 100)
    : null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${meta.label} kategorisi`}
      className={`w-[48%] gap-2 rounded-2xl p-4 ${meta.bgClass} active:opacity-80`}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${meta.iconBgClass}`}
      >
        <Icon size={20} color={meta.iconColor} />
      </View>
      <Typography variant="body" weight="semibold">
        {meta.label}
      </Typography>
      <Typography variant="caption" color="muted">
        {meta.questionCount} soru
      </Typography>
      {accuracy !== null && (
        <Typography variant="caption" color="primary" weight="semibold">
          %{accuracy} doğruluk
        </Typography>
      )}
    </Pressable>
  );
}
