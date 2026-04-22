import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView contentContainerClassName="gap-4 p-6">
        <Typography variant="h1" color="primary">
          Ehliyet Akademi
        </Typography>

        <View className="gap-1">
          <Typography weight="regular">Inter Regular (400)</Typography>
          <Typography weight="medium">Inter Medium (500)</Typography>
          <Typography weight="semibold">Inter SemiBold (600)</Typography>
          <Typography weight="bold">Inter Bold (700)</Typography>
        </View>

        <View className="gap-2">
          <Button onPress={() => {}}>Primary</Button>
          <Button variant="secondary" onPress={() => {}}>
            Secondary
          </Button>
          <Button variant="danger" size="sm" onPress={() => {}}>
            Danger Small
          </Button>
          <Button loading onPress={() => {}}>
            Loading
          </Button>
        </View>

        <Card>
          <Typography variant="h3">Card başlığı</Typography>
          <Typography color="secondary">
            rounded-2xl + p-4 default. Dark mode'da gri arka plan.
          </Typography>
        </Card>

        <Card bordered padding="sm" onPress={() => {}}>
          <Typography weight="medium">Bordered + Pressable Card</Typography>
        </Card>

        <View className="flex-row flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Başarılı</Badge>
          <Badge variant="danger">Hata</Badge>
          <Badge variant="warning">Uyarı</Badge>
          <Badge variant="info" size="md">
            Bilgi
          </Badge>
        </View>

        <View className="gap-2">
          <Typography variant="caption" color="muted">
            ProgressBar — 25 / 60 / 90
          </Typography>
          <ProgressBar value={25} />
          <ProgressBar value={60} variant="success" />
          <ProgressBar value={90} variant="warning" />
        </View>

        <View className="items-center">
          <Spinner size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
