import { BookOpen } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

export default function StudyScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-gray-900"
      edges={['top']}
    >
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <BookOpen size={64} color={colors.primary} />
        <Typography variant="h2" align="center">
          Çalış
        </Typography>
        <Typography variant="body" color="muted" align="center">
          Soru çözme deneyimi yakında geliyor!
        </Typography>
        <Typography variant="caption" color="muted" align="center">
          PARÇA 5.B
        </Typography>
      </View>
    </SafeAreaView>
  );
}
