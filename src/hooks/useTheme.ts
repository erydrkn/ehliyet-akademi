// Aktif temayı NativeWind ile senkronize eder ve renk paletini sağlar.

import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';

import { colors, type ColorPalette, type ColorScheme } from '@/constants/colors';
import { useThemeStore, type Theme } from '@/stores/themeStore';

type UseThemeResult = {
  theme: Theme;
  scheme: ColorScheme;
  colors: ColorPalette;
  setTheme: (theme: Theme) => void;
};

export function useTheme(): UseThemeResult {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

  return {
    theme,
    scheme,
    colors: colors[scheme],
    setTheme,
  };
}
