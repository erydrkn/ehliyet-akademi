import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center gap-3 p-6">
        <Typography variant="h1" color="primary">
          Ehliyet Akademi
        </Typography>
        <Typography variant="h3">Inter font testi</Typography>
        <Typography variant="body" color="secondary">
          400 / 500 / 600 / 700 ağırlıkları yüklendiyse her satır farklı kalınlıkta görünmeli.
        </Typography>
        <Typography weight="regular">Inter Regular (400)</Typography>
        <Typography weight="medium">Inter Medium (500)</Typography>
        <Typography weight="semibold">Inter SemiBold (600)</Typography>
        <Typography weight="bold">Inter Bold (700)</Typography>

        <View className="mt-4 w-full gap-2">
          <Button onPress={() => {}}>Primary Button</Button>
          <Button variant="secondary" onPress={() => {}}>
            Secondary
          </Button>
          <Button variant="ghost" onPress={() => {}}>
            Ghost
          </Button>
          <Button variant="danger" size="sm" onPress={() => {}}>
            Danger Small
          </Button>
          <Button loading onPress={() => {}}>
            Loading
          </Button>
        </View>

        <Spinner size="lg" />
      </View>
    </SafeAreaView>
  );
}
