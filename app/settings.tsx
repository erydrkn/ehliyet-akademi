import { type Href, useRouter } from 'expo-router';
import {
  Check,
  ChevronRight,
  Heart,
  Info,
  LogOut,
  Moon,
  Pencil,
  Smartphone,
  X,
} from 'lucide-react-native';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/stores/themeStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, isGuest, signOut } = useAuth();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <View className="h-14 flex-row items-center gap-2 bg-white px-3 dark:bg-gray-900">
        <IconButton
          icon={<X size={22} color={colors.text} />}
          onPress={() => router.back()}
          accessibilityLabel="Kapat"
          variant="ghost"
          size="sm"
        />
        <Typography variant="body" weight="semibold">
          Ayarlar
        </Typography>
      </View>

      <ScrollView contentContainerClassName="flex-grow p-4 gap-4">
        <View className="gap-2">
          <Typography variant="h3">Görünüm</Typography>
          <Card padding="none">
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <Moon size={20} color={colors.text} />
                <Typography variant="body">Karanlık Mod</Typography>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
                accessibilityLabel="Karanlık modu aç/kapa"
              />
            </View>
            <View className="h-px bg-gray-200 dark:bg-gray-800" />
            <Pressable
              onPress={() => setTheme('system')}
              accessibilityRole="button"
              accessibilityLabel="Sistem temasını kullan"
              className="flex-row items-center justify-between p-4 active:opacity-80"
            >
              <View className="flex-row items-center gap-3">
                <Smartphone size={20} color={colors.text} />
                <Typography variant="body">Sistem Teması</Typography>
              </View>
              {theme === 'system' && (
                <Check size={20} color={colors.primary} />
              )}
            </Pressable>
          </Card>
        </View>

        {!isGuest && user && (
          <View className="gap-2">
            <Typography variant="h3">Hesap</Typography>
            <Card
              padding="none"
              onPress={() => router.push('/profile/edit' as Href)}
            >
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  <Pencil size={20} color={colors.text} />
                  <Typography variant="body">Profili Düzenle</Typography>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>
            </Card>
          </View>
        )}

        <View className="gap-2">
          <Typography variant="h3">Hakkında</Typography>
          <Card padding="none">
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <Info size={20} color={colors.text} />
                <Typography variant="body">Sürüm</Typography>
              </View>
              <Typography variant="body" color="muted">
                1.0.0
              </Typography>
            </View>
            <View className="h-px bg-gray-200 dark:bg-gray-800" />
            <View className="flex-row items-center gap-3 p-4">
              <Heart size={20} color="#EF4444" />
              <View className="flex-1">
                <Typography variant="body">Ehliyet Akademi</Typography>
                <Typography variant="caption" color="muted">
                  © 2026 Eray Erdoğan
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        <Card
          padding="none"
          onPress={() => signOut.mutate()}
          className="bg-red-50 dark:bg-red-950/40"
        >
          <View className="flex-row items-center gap-3 p-4">
            <LogOut size={20} color="#EF4444" />
            <Typography variant="body" weight="semibold" color="danger">
              {isGuest ? 'Misafir Modundan Çık' : 'Çıkış Yap'}
            </Typography>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
