import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const { user, isGuest } = useAuth();

  const rawName = (user?.user_metadata?.full_name as string | undefined) ?? null;
  const displayName = rawName?.split(' ')[0] ?? null;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      <View className="flex-1 gap-6 p-6">
        <View className="gap-2">
          <Typography variant="h1">
            {isGuest
              ? 'Hoş geldin!'
              : displayName
                ? `Merhaba, ${displayName}`
                : 'Hoş geldin!'}
          </Typography>
          <Typography color="secondary">
            {isGuest
              ? 'Misafir modundasın — istediğin zaman kayıt olabilirsin.'
              : 'Ehliyet sınavına hazırlanmaya devam et.'}
          </Typography>
        </View>

        <View className="flex-1 items-center justify-center">
          <Typography variant="caption" color="muted" align="center">
            Bu ekran Katman 5 (Quiz Engine) ile dolacak.
          </Typography>
        </View>
      </View>
    </SafeAreaView>
  );
}
