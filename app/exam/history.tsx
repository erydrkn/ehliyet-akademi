import { type Href, useRouter } from 'expo-router';
import { GraduationCap, X } from 'lucide-react-native';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExamHistoryCard } from '@/components/stats/ExamHistoryCard';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useExamHistory } from '@/hooks/useExamHistory';
import { useTheme } from '@/hooks/useTheme';

export default function ExamHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();

  const historyQuery = useExamHistory(user?.id, 100);
  const sessions = historyQuery.data ?? [];

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
          Tüm Sınavlarım
          {historyQuery.data ? ` (${historyQuery.data.length})` : ''}
        </Typography>
      </View>

      {historyQuery.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      ) : historyQuery.isError ? (
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Sınavlar yüklenemedi
          </Typography>
          <View className="w-full gap-3">
            <Button onPress={() => historyQuery.refetch()} fullWidth>
              Tekrar Dene
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.back()}
              fullWidth
            >
              Geri Dön
            </Button>
          </View>
        </View>
      ) : sessions.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <GraduationCap size={64} color={colors.textMuted} />
          <Typography variant="h2" align="center">
            Henüz sınav yapmadın
          </Typography>
          <Typography color="muted" align="center">
            Deneme sınavı ile gerçek MTSK simülasyonunu dene.
          </Typography>
          <Button onPress={() => router.replace('/exam' as Href)} fullWidth>
            Sınav Yap
          </Button>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="p-4 gap-3"
          renderItem={({ item }) => (
            <ExamHistoryCard
              session={item}
              onPress={() =>
                router.push(`/exam/review/${item.id}` as Href)
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
