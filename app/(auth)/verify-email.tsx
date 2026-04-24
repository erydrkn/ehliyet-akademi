import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { resendVerificationEmail } = useAuth();
  const { colors } = useTheme();

  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    if (!email) return;
    resendVerificationEmail.mutate(email, {
      onSuccess: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS),
    });
  };

  const canResend = secondsLeft <= 0 && !resendVerificationEmail.isPending;

  return (
    <View className="flex-1 justify-center p-6">
      <View className="gap-6">
        <View className="items-center gap-4">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <MailCheck size={40} color={colors.primary} />
          </View>
          <Typography variant="h1" align="center">
            Email Adresini Doğrula
          </Typography>
        </View>

        <View className="gap-2">
          <Typography color="secondary" align="center">
            {email ? (
              <>
                <Typography weight="semibold">{email}</Typography>
                {' '}adresine doğrulama bağlantısı gönderdik.
              </>
            ) : (
              'Email adresine doğrulama bağlantısı gönderdik.'
            )}
          </Typography>
          <Typography color="secondary" align="center">
            Bağlantıya tıkladıktan sonra giriş yapabilirsin.
          </Typography>
        </View>

        <View className="gap-2 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/30">
          <Typography variant="caption" color="warning" weight="semibold">
            💡 Email gelmediyse
          </Typography>
          <Typography variant="caption" color="secondary">
            Spam klasörünü kontrol et. Bazen doğrulama emailleri oraya düşer.
          </Typography>
        </View>

        <View className="gap-3">
          <Button
            onPress={handleResend}
            variant="secondary"
            disabled={!canResend || !email}
            loading={resendVerificationEmail.isPending}
            fullWidth
          >
            {secondsLeft > 0
              ? `Tekrar gönder (${secondsLeft}s)`
              : 'Doğrulama Emailini Tekrar Gönder'}
          </Button>

          <Pressable
            onPress={() => router.replace('/login' as Href)}
            hitSlop={8}
            className="self-center"
          >
            <Typography color="primary" weight="medium">
              Giriş Ekranına Dön
            </Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
