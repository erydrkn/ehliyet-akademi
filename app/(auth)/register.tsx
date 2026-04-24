import { zodResolver } from '@hookform/resolvers/zod';
import { type Href, useRouter } from 'expo-router';
import { Mail, User } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Linking,
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
import { registerSchema, type RegisterFormValues } from '@/utils/validation';

// Katman 8'de gerçek KVKK URL ile değiştirilecek.
const KVKK_URL = 'https://ehliyet-akademi.example.com/kvkk';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await signUp.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      if (result.needsEmailVerification) {
        const emailParam = encodeURIComponent(values.email);
        router.replace(`/verify-email?email=${emailParam}` as Href);
      }
      // Session dolu döndüyse root layout /(tabs)'a yönlendirir.
    } catch {
      // Hata zaten Toast ile gösterildi.
    }
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
            <Typography variant="h1">Hesap Oluştur</Typography>
            <Typography color="secondary">
              Birkaç saniye sürer, sonra hemen başlarsın.
            </Typography>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Ad Soyad"
                  placeholder="Adınız Soyadınız"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  leftIcon={<User size={20} color={colors.textSecondary} />}
                  error={errors.fullName?.message}
                />
              )}
            />

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
                  autoComplete="new-password"
                  textContentType="newPassword"
                  secureTextEntry
                  helperText="En az 8 karakter, 1 harf ve 1 rakam içermeli"
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Şifre Tekrar"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  secureTextEntry
                  error={errors.passwordConfirm?.message}
                />
              )}
            />
          </View>

          <Button onPress={onSubmit} loading={signUp.isPending} fullWidth>
            Kayıt Ol
          </Button>

          <View className="flex-row flex-wrap items-center justify-center gap-x-1">
            <Typography variant="caption" color="secondary">
              Kayıt olarak
            </Typography>
            <Pressable onPress={() => Linking.openURL(KVKK_URL)} hitSlop={4}>
              <Typography variant="caption" color="primary" weight="medium">
                KVKK Aydınlatma Metni
              </Typography>
            </Pressable>
            <Typography variant="caption" color="secondary">
              ni kabul etmiş olursunuz.
            </Typography>
          </View>

          <View className="flex-row items-center justify-center gap-2">
            <Typography color="secondary">Zaten hesabın var mı?</Typography>
            <Pressable onPress={() => router.replace('/login' as Href)} hitSlop={8}>
              <Typography color="primary" weight="semibold">
                Giriş Yap
              </Typography>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
