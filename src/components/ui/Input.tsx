// Form input — RHF uyumlu (ref-as-prop), label/error/icon/password toggle destekli.

import { Eye, EyeOff } from 'lucide-react-native';
import { useState, type ReactNode, type Ref } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { fontFamily } from '@/constants/fonts';
import { useTheme } from '@/hooks/useTheme';

type Props = TextInputProps & {
  ref?: Ref<TextInput>;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
};

export function Input({
  ref,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry,
  editable = true,
  onFocus,
  onBlur,
  containerClassName,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);

  const isPassword = secureTextEntry === true;
  const finalSecure = isPassword ? passwordHidden : secureTextEntry;

  const borderClass = error
    ? 'border-red-500'
    : focused
      ? 'border-blue-600'
      : 'border-gray-300 dark:border-gray-700';

  const passwordToggle = isPassword ? (
    <Pressable
      onPress={() => setPasswordHidden((v) => !v)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={passwordHidden ? 'Şifreyi göster' : 'Şifreyi gizle'}
    >
      {passwordHidden ? (
        <EyeOff size={20} color={colors.textSecondary} />
      ) : (
        <Eye size={20} color={colors.textSecondary} />
      )}
    </Pressable>
  ) : null;

  const trailingIcon = passwordToggle ?? rightIcon;

  return (
    <View className={`gap-1 ${containerClassName ?? ''}`}>
      {label ? (
        <Text
          className="text-sm text-gray-700 dark:text-gray-300"
          style={{ fontFamily: fontFamily.medium }}
        >
          {label}
        </Text>
      ) : null}

      <View
        className={`flex-row items-center gap-2 rounded-xl border bg-white px-3 dark:bg-gray-800 ${borderClass} ${
          editable ? '' : 'opacity-50'
        }`}
      >
        {leftIcon}
        <TextInput
          ref={ref}
          {...rest}
          editable={editable}
          secureTextEntry={finalSecure}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={colors.textMuted}
          className="flex-1 py-3 text-base text-gray-900 dark:text-gray-100"
          style={{ fontFamily: fontFamily.regular }}
        />
        {trailingIcon}
      </View>

      {error ? (
        <Text
          className="text-xs text-red-500"
          style={{ fontFamily: fontFamily.regular }}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          className="text-xs text-gray-500 dark:text-gray-400"
          style={{ fontFamily: fontFamily.regular }}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
