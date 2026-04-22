// İçerik kutusu — rounded-2xl + opsiyonel padding/border, onPress verilirse basılabilir.

import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type Padding = 'none' | 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  padding?: Padding;
  bordered?: boolean;
  className?: string;
  onPress?: () => void;
};

const paddingClass: Record<Padding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  padding = 'md',
  bordered = false,
  className,
  onPress,
}: Props) {
  const base = `bg-white dark:bg-gray-800 rounded-2xl ${paddingClass[padding]} ${
    bordered ? 'border border-gray-200 dark:border-gray-700' : ''
  } ${className ?? ''}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className={`${base} active:opacity-80`}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={base}>{children}</View>;
}
