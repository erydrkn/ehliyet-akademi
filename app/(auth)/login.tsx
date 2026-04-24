import { zodResolver } from '@hookform/resolvers/zod';
import { type Href, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
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
import { loginSchema, type LoginFormValues } from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    signIn.mutate(values);
  });

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
          <View className="gap-2">
            <Typography variant="h1">Giriş Yap</Typography>
            <Typography color="secondary">
              Ehliyet sınavına hazırlanmaya devam et.
            </Typography>
          </View>

          <View className="gap-4">
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

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifre"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />

            <Pressable
              onPress={() => router.push('/forgot-password' as Href)}
              hitSlop={8}
              className="self-end"
            >
              <Typography color="primary" weight="medium">
                Şifremi unuttum
              </Typography>
            </Pressable>
          </View>

          <Button onPress={onSubmit} loading={signIn.isPending} fullWidth>
            Giriş Yap
          </Button>

          <View className="flex-row items-center justify-center gap-2">
            <Typography color="secondary">Hesabın yok mu?</Typography>
            <Pressable onPress={() => router.push('/register' as Href)} hitSlop={8}>
              <Typography color="primary" weight="semibold">
                Kayıt Ol
              </Typography>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
