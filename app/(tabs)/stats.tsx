import { BarChart3 } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useUserStats } from '@/hooks/useUserStats';

export default function StatsScreen() {
  const { colors } = useTheme();
  const { user, isGuest } = useAuth();
  const statsQuery = useUserStats(isGuest ? undefined : user?.id);

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top']}
    >
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <BarChart3 size={64} color={colors.primary} />
        <Typography variant="h2" align="center">
          İstatistik
        </Typography>
        <Typography variant="body" color="muted" align="center">
          Detaylı istatistikler yakında!
        </Typography>

        {!isGuest && user && (
          <View className="mt-2 items-center gap-1">
            {statsQuery.isLoading ? (
              <Spinner size="sm" />
            ) : statsQuery.data ? (
              <Typography variant="body" color="secondary" align="center">
                Toplam çözülen: {statsQuery.data.total_questions}
              </Typography>
            ) : null}
          </View>
        )}

        <Typography variant="caption" color="muted" align="center">
          PARÇA 5.D
        </Typography>
      </View>
    </SafeAreaView>
  );
}
