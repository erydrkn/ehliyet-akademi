// Birincil etkileşim butonu — primary/secondary/ghost/danger × sm/md/lg, loading/icon/fullWidth destekli.

import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { fontFamily, type FontFamily } from '@/constants/fonts';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const variantBg: Record<Variant, string> = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:active:bg-gray-600',
  ghost: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
  danger: 'bg-red-500 active:bg-red-600',
};

const variantText: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-900 dark:text-gray-100',
  ghost: 'text-blue-600 dark:text-blue-400',
  danger: 'text-white',
};

const sizePadding: Record<Size, string> = {
  sm: 'px-3 py-2 min-h-[44px]',
  md: 'px-4 py-3 min-h-[48px]',
  lg: 'px-6 py-4 min-h-[56px]',
};

const sizeText: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const sizeFontWeight: Record<Size, FontFamily> = {
  sm: 'medium',
  md: 'semibold',
  lg: 'semibold',
};

const spinnerColor: Record<Variant, string> = {
  primary: '#FFFFFF',
  secondary: '#2563EB',
  ghost: '#2563EB',
  danger: '#FFFFFF',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`
        ${variantBg[variant]}
        ${sizePadding[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        rounded-xl items-center justify-center flex-row
      `}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor[variant]} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text
            className={`${variantText[variant]} ${sizeText[size]}`}
            style={{ fontFamily: fontFamily[sizeFontWeight[size]] }}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
