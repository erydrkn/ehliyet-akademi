import { type Href, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest, signOut, exitGuest } = useAuth();
  const profileQuery = useProfile(user?.id, { enabled: !isGuest });

  const handleSignOut = () => {
    signOut.mutate();
  };

  const handleGuestToRegister = async () => {
    await exitGuest();
    router.replace('/register' as Href);
  };

  if (isGuest) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 gap-6 p-6">
          <View className="gap-3">
            <Typography variant="h1">Profil</Typography>
            <View className="self-start">
              <Badge variant="info">Misafir Modu</Badge>
            </View>
          </View>

          <Card padding="md">
            <View className="gap-3">
              <Typography weight="semibold">İlerlemen kaydedilmiyor</Typography>
              <Typography color="secondary">
                Misafir modunda çözdüğün sorular ve istatistiklerin saklanmıyor.
                Kalıcı hesap oluşturarak ilerlemeni kaydedebilirsin.
              </Typography>
            </View>
          </Card>

          <Button onPress={handleGuestToRegister} fullWidth>
            Kayıt Ol
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (profileQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography color="danger" align="center">
            Profil yüklenemedi
          </Typography>
          <Button onPress={() => profileQuery.refetch()} variant="secondary">
            Tekrar Dene
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const profile = profileQuery.data;
  const createdDate = new Date(profile.created_at).toLocaleDateString('tr-TR');

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      <ScrollView contentContainerClassName="flex-grow p-6 gap-4">
        <Typography variant="h1">Profil</Typography>

        <Card padding="md">
          <View className="gap-1">
            <Typography variant="caption" color="muted">
              Email
            </Typography>
            <Typography>{profile.email}</Typography>
          </View>
        </Card>

        <Card padding="md">
          <View className="gap-1">
            <Typography variant="caption" color="muted">
              Ad Soyad
            </Typography>
            <Typography>{profile.full_name ?? '—'}</Typography>
          </View>
        </Card>

        <Card padding="md">
          <View className="flex-row items-center justify-between">
            <Typography color="secondary">Streak</Typography>
            <Typography weight="semibold">{profile.streak_days} gün</Typography>
          </View>
        </Card>

        <Card padding="md">
          <View className="flex-row items-center justify-between">
            <Typography color="secondary">Kayıt Tarihi</Typography>
            <Typography weight="medium">{createdDate}</Typography>
          </View>
        </Card>

        <View className="flex-1" />

        <Button
          onPress={handleSignOut}
          variant="danger"
          loading={signOut.isPending}
          fullWidth
        >
          Çıkış Yap
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
