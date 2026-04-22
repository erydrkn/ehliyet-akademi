// Tam ekran modal — backdrop'a dokununca kapanır, klavye-uyumlu, opsiyonel başlık + X butonu.

import { X } from 'lucide-react-native';
import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  View,
} from 'react-native';

import { IconButton } from '@/components/ui/IconButton';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ visible, onClose, title, children }: Props) {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center bg-black/50 p-6">
          <Pressable
            className="absolute inset-0"
            onPress={onClose}
            accessibilityLabel="Modalı kapat"
          />
          <View className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
            <View className="flex-row items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <View className="flex-1">
                {title ? <Typography variant="h3">{title}</Typography> : null}
              </View>
              <IconButton
                variant="ghost"
                size="sm"
                icon={<X size={20} color={colors.textSecondary} />}
                onPress={onClose}
                accessibilityLabel="Kapat"
              />
            </View>
            <View className="p-4">{children}</View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
