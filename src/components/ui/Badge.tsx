// Küçük durum etiketi — default/success/danger/warning/info, sm veya md boyut.

import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { fontFamily } from '@/constants/fonts';

type Variant = 'default' | 'success' | 'danger' | 'warning' | 'info';
type Size = 'sm' | 'md';

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  default: 'bg-gray-200 dark:bg-gray-700',
  success: 'bg-green-100 dark:bg-green-900',
  danger: 'bg-red-100 dark:bg-red-900',
  warning: 'bg-amber-100 dark:bg-amber-900',
  info: 'bg-blue-100 dark:bg-blue-900',
};

const variantTextClass: Record<Variant, string> = {
  default: 'text-gray-900 dark:text-gray-100',
  success: 'text-green-700 dark:text-green-300',
  danger: 'text-red-700 dark:text-red-300',
  warning: 'text-amber-700 dark:text-amber-300',
  info: 'text-blue-700 dark:text-blue-300',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
};

const sizeTextClass: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm' }: Props) {
  return (
    <View
      className={`self-start rounded-md ${variantClass[variant]} ${sizeClass[size]}`}
    >
      <Text
        className={`${variantTextClass[variant]} ${sizeTextClass[size]}`}
        style={{ fontFamily: fontFamily.medium }}
      >
        {children}
      </Text>
    </View>
  );
}
