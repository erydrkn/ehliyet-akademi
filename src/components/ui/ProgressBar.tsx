// İlerleme çubuğu — 0-100 arası value, 4 renk varyantı.

import { View } from 'react-native';

type Variant = 'primary' | 'success' | 'danger' | 'warning';

type Props = {
  value: number;
  variant?: Variant;
};

const fillClass: Record<Variant, string> = {
  primary: 'bg-blue-600 dark:bg-blue-500',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
};

export function ProgressBar({ value, variant = 'primary' }: Props) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View
      className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View className={`h-full ${fillClass[variant]}`} style={{ width: `${clamped}%` }} />
    </View>
  );
}
