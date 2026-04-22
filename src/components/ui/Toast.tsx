// Geçici bildirim — slide-in animasyonu, tap veya yukarı swipe ile erken kapanır, 4 tip.

import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react-native';
import { type ComponentType } from 'react';
import { Pressable, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { fontFamily } from '@/constants/fonts';
import { useTheme } from '@/hooks/useTheme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

type Props = {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
};

const containerClass: Record<ToastType, string> = {
  success: 'bg-green-100 dark:bg-green-900',
  error: 'bg-red-100 dark:bg-red-900',
  warning: 'bg-amber-100 dark:bg-amber-900',
  info: 'bg-blue-100 dark:bg-blue-900',
};

const textClass: Record<ToastType, string> = {
  success: 'text-green-700 dark:text-green-300',
  error: 'text-red-700 dark:text-red-300',
  warning: 'text-amber-700 dark:text-amber-300',
  info: 'text-blue-700 dark:text-blue-300',
};

const iconColorLight: Record<ToastType, string> = {
  success: '#15803D',
  error: '#B91C1C',
  warning: '#B45309',
  info: '#1D4ED8',
};

const iconColorDark: Record<ToastType, string> = {
  success: '#86EFAC',
  error: '#FCA5A5',
  warning: '#FCD34D',
  info: '#93C5FD',
};

const IconMap: Record<ToastType, ComponentType<{ size?: number; color?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Toast({ message, type = 'info', onDismiss }: Props) {
  const { scheme } = useTheme();
  const translateY = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const swipe = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onUpdate((e) => {
      if (e.translationY < 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY < -40) {
        translateY.value = withTiming(-200, { duration: 200 });
        runOnJS(onDismiss)();
      } else {
        translateY.value = withTiming(0);
      }
    });

  const Icon = IconMap[type];
  const iconColor = scheme === 'dark' ? iconColorDark[type] : iconColorLight[type];

  return (
    <GestureDetector gesture={swipe}>
      <Animated.View
        entering={SlideInUp.duration(280)}
        exiting={SlideOutUp.duration(200)}
        style={animStyle}
      >
        <Pressable
          onPress={onDismiss}
          accessibilityRole="alert"
          accessibilityLabel={message}
          className={`flex-row items-center gap-3 rounded-xl px-4 py-3 ${containerClass[type]}`}
        >
          <Icon size={20} color={iconColor} />
          <Text
            className={`flex-1 text-sm ${textClass[type]}`}
            style={{ fontFamily: fontFamily.medium }}
          >
            {message}
          </Text>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
