import { zodResolver } from '@hookform/resolvers/zod';
import { type Href, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => {
    resetPassword.mutate(values.email);
  });

  const isSent = resetPassword.isSuccess;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="self-start"
            accessibilityLabel="Geri dön"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>

          <View className="gap-2">
            <Typography variant="h1">Şifremi Unuttum</Typography>
            <Typography color="secondary">
              Email adresini gir, şifre sıfırlama bağlantısını gönderelim.
            </Typography>
          </View>

          {isSent ? (
            <View className="gap-4 rounded-2xl bg-green-50 p-4 dark:bg-green-900/30">
              <View className="flex-row items-center gap-2">
                <CheckCircle2 size={20} color={colors.success} />
                <Typography weight="semibold" color="success">
                  Email gönderildi
                </Typography>
              </View>
              <Typography color="secondary">
                Email adresini kontrol et ve gelen bağlantıya tıkla. Email
                gelmediyse spam klasörünü kontrol etmeyi unutma.
              </Typography>
              <Button
                onPress={() => router.replace('/login' as Href)}
                variant="primary"
                fullWidth
              >
                Giriş Ekranına Dön
              </Button>
            </View>
          ) : (
            <>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="ornek@email.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    leftIcon={<Mail size={20} color={colors.textSecondary} />}
                    error={errors.email?.message}
                  />
                )}
              />

              <Button
                onPress={onSubmit}
                loading={resetPassword.isPending}
                fullWidth
              >
                Sıfırlama Bağlantısı Gönder
              </Button>

              <Pressable
                onPress={() => router.back()}
                hitSlop={8}
                className="self-center"
              >
                <Typography color="primary" weight="medium">
                  Giriş Ekranına Dön
                </Typography>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
