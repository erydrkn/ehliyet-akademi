// İkonlu basılabilir buton — variant × size, accessibilityLabel zorunlu (44x44 min dokunma alanı).

import { type ReactNode } from 'react';
import { Pressable } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
};

const variantClass: Record<Variant, string> = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:active:bg-gray-600',
  ghost: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
  danger: 'bg-red-500 active:bg-red-600',
};

const sizeClass: Record<Size, string> = {
  sm: 'w-11 h-11',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      className={`${variantClass[variant]} ${sizeClass[size]} items-center justify-center rounded-xl ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {icon}
    </Pressable>
  );
}
