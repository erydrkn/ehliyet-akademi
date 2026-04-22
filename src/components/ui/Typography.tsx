// Tipografi primitifi — Inter font, h1/h2/h3/body/caption variant'ları, weight/renk/hizalama override.

import { Text, type TextProps } from 'react-native';

import { fontFamily, type FontFamily } from '@/constants/fonts';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';
type Color =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning';
type Align = 'left' | 'center' | 'right';

type Props = TextProps & {
  variant?: Variant;
  weight?: FontFamily;
  color?: Color;
  align?: Align;
};

const variantSize: Record<Variant, string> = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  body: 'text-base',
  caption: 'text-xs',
};

const variantWeight: Record<Variant, FontFamily> = {
  h1: 'bold',
  h2: 'bold',
  h3: 'semibold',
  body: 'regular',
  caption: 'regular',
};

const colorClass: Record<Color, string> = {
  default: 'text-gray-900 dark:text-gray-50',
  secondary: 'text-gray-600 dark:text-gray-300',
  muted: 'text-gray-400 dark:text-gray-500',
  inverse: 'text-white dark:text-gray-900',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-500',
  danger: 'text-red-500',
  warning: 'text-amber-500',
};

const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Typography({
  variant = 'body',
  weight,
  color = 'default',
  align = 'left',
  className,
  style,
  children,
  ...rest
}: Props) {
  const resolvedWeight = weight ?? variantWeight[variant];

  return (
    <Text
      {...rest}
      className={`${variantSize[variant]} ${colorClass[color]} ${alignClass[align]} ${className ?? ''}`}
      style={[{ fontFamily: fontFamily[resolvedWeight] }, style]}
    >
      {children}
    </Text>
  );
}
