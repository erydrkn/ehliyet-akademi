import { AlertTriangle, ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { CATEGORIES } from '@/constants/categories';
import { useTheme } from '@/hooks/useTheme';
import type { QuestionCategory, WeakCategoryResult } from '@/types/database';

type Props = {
  weakCategories: WeakCategoryResult[];
  onPressStudy?: (category: QuestionCategory) => void;
};

export function WeakCategoriesCard({ weakCategories, onPressStudy }: Props) {
  const { colors } = useTheme();

  if (weakCategories.length === 0) return null;

  return (
    <Card padding="md" className="bg-amber-50 dark:bg-amber-950/40">
      <View className="gap-3">
        <View className="flex-row items-center gap-2">
          <AlertTriangle size={20} color="#F59E0B" />
          <Typography variant="h3">Zayıf Konular</Typography>
        </View>
        <Typography variant="body" color="secondary">
          Bu kategorilere odaklan, başarını artır:
        </Typography>

        <View className="gap-2">
          {weakCategories.map((wc) => {
            const cat = wc.category as QuestionCategory;
            const meta = CATEGORIES.find((c) => c.category === cat);
            const label = meta?.label ?? wc.category;

            return (
              <Pressable
                key={wc.category}
                onPress={() => onPressStudy?.(cat)}
                accessibilityRole="button"
                accessibilityLabel={`${label} kategorisinde çalış`}
                className="flex-row items-center justify-between rounded-xl bg-white p-3 active:opacity-80 dark:bg-gray-800"
              >
                <View className="flex-1">
                  <Typography variant="body" weight="semibold">
                    {label}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    %{Math.round(wc.accuracy_rate)} başarı •{' '}
                    {wc.total_answered} soru
                  </Typography>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Card>
  );
}
