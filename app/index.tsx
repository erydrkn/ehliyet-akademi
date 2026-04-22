import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <Typography variant="h1" color="primary" align="center">
          Ehliyet Akademi
        </Typography>
        <Typography color="secondary" align="center">
          Katman 2 tamam — UI kütüphanesi hazır.
        </Typography>
        <Button onPress={() => router.push('/showcase')}>Component Showcase</Button>
      </View>
    </SafeAreaView>
  );
}
