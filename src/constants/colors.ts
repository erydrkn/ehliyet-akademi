// Tasarım sistemi renk token'ları — light/dark tema. Programatik erişim için (NativeWind class'ları dışında).

export const colors = {
  light: {
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryDark: '#1D4ED8',

    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',

    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    border: '#E5E7EB',

    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
  },
  dark: {
    primary: '#3B82F6',
    primaryLight: '#1E3A8A',
    primaryDark: '#60A5FA',

    success: '#10B981',
    successLight: '#064E3B',
    danger: '#EF4444',
    dangerLight: '#7F1D1D',
    warning: '#F59E0B',
    warningLight: '#78350F',
    info: '#3B82F6',

    background: '#111827',
    surface: '#1F2937',
    card: '#1F2937',
    border: '#374151',

    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    textInverse: '#111827',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorToken = keyof typeof colors.light;
export type ColorPalette = (typeof colors)[ColorScheme];
