// Yükleme göstergesi — sm/md/lg boyut, tema-aware varsayılan renk.

import { ActivityIndicator } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  size?: Size;
  color?: string;
};

const sizeMap: Record<Size, number> = {
  sm: 16,
  md: 24,
  lg: 36,
};

export function Spinner({ size = 'md', color }: Props) {
  const { colors } = useTheme();
  return <ActivityIndicator size={sizeMap[size]} color={color ?? colors.primary} />;
}
