import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LicenseClassSheet } from '@/components/profile/LicenseClassSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/ToastProvider';
import { Typography } from '@/components/ui/Typography';
import { LICENSE_CLASSES } from '@/constants/license-classes';
import { queryKeys } from '@/constants/query-keys';
import { updateProfile } from '@/api/profile';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { formatDateTr } from '@/utils/format';
import {
  profileEditSchema,
  type ProfileEditFormValues,
} from '@/utils/validation';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const profileQuery = useProfile(user?.id);

  const sheetRef = useRef<BottomSheetModal>(null);
  const [showPicker, setShowPicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      full_name: '',
      license_class: 'B',
      exam_date: null,
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      reset({
        full_name: profileQuery.data.full_name ?? '',
        license_class: profileQuery.data.license_class ?? 'B',
        exam_date: profileQuery.data.exam_date,
      });
    }
  }, [profileQuery.data, reset]);

  const watchedLicense = watch('license_class');
  const watchedDate = watch('exam_date');

  const updateMutation = useMutation({
    mutationFn: (values: ProfileEditFormValues) =>
      updateProfile(user!.id, {
        full_name: values.full_name,
        license_class: values.license_class,
        exam_date: values.exam_date,
      }),
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.byUser(user.id),
        });
      }
      showToast('Profil güncellendi', 'success');
      router.back();
    },
    onError: (err: Error) => {
      showToast(err.message || 'Güncelleme başarısız', 'error');
    },
  });

  const handleDatePickerChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'dismissed') return;
    if (date) {
      setValue('exam_date', date.toISOString().slice(0, 10), {
        shouldDirty: true,
      });
    }
  };

  if (!user) return null;

  if (profileQuery.isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Typography variant="h3" align="center">
            Profil yüklenemedi
          </Typography>
          <View className="w-full gap-3">
            <Button onPress={() => profileQuery.refetch()} fullWidth>
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
      </SafeAreaView>
    );
  }

  const profile = profileQuery.data;
  const licenseLabel =
    LICENSE_CLASSES.find((c) => c.value === watchedLicense)?.label ??
    watchedLicense;

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
          Profili Düzenle
        </Typography>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerClassName="flex-grow p-4 gap-4"
          keyboardShouldPersistTaps="handled"
        >
          <Card padding="md">
            <View className="gap-1">
              <Typography variant="caption" color="muted">
                Email
              </Typography>
              <Typography variant="body">{profile.email}</Typography>
            </View>
          </Card>

          <Controller
            control={control}
            name="full_name"
            render={({ field }) => (
              <Input
                label="Ad Soyad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.full_name?.message}
                autoCapitalize="words"
              />
            )}
          />

          <View className="gap-1">
            <Typography variant="caption" color="muted">
              Ehliyet Sınıfı
            </Typography>
            <Pressable
              onPress={() => sheetRef.current?.present()}
              accessibilityRole="button"
              accessibilityLabel="Ehliyet sınıfı seç"
              className="flex-row items-center justify-between rounded-xl border border-gray-300 bg-white p-4 active:opacity-80 dark:border-gray-700 dark:bg-gray-900"
            >
              <Typography variant="body">{licenseLabel}</Typography>
              <ChevronRight size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <View className="gap-1">
            <Typography variant="caption" color="muted">
              Sınav Tarihi (Opsiyonel)
            </Typography>
            <Pressable
              onPress={() => setShowPicker(true)}
              accessibilityRole="button"
              accessibilityLabel="Sınav tarihi seç"
              className="flex-row items-center justify-between rounded-xl border border-gray-300 bg-white p-4 active:opacity-80 dark:border-gray-700 dark:bg-gray-900"
            >
              <Typography
                variant="body"
                color={watchedDate ? 'default' : 'muted'}
              >
                {watchedDate ? formatDateTr(watchedDate) : 'Tarih seçin'}
              </Typography>
              <Calendar size={20} color={colors.textMuted} />
            </Pressable>
            {watchedDate && (
              <Pressable
                onPress={() =>
                  setValue('exam_date', null, { shouldDirty: true })
                }
                className="self-start py-1"
              >
                <Typography variant="caption" color="danger">
                  Tarihi sil
                </Typography>
              </Pressable>
            )}
          </View>

          {showPicker && (
            <DateTimePicker
              value={watchedDate ? new Date(watchedDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={handleDatePickerChange}
            />
          )}

          <View className="flex-1" />

          <Button
            onPress={handleSubmit((v) => updateMutation.mutate(v))}
            loading={updateMutation.isPending}
            disabled={!isDirty || updateMutation.isPending}
            fullWidth
          >
            Kaydet
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <LicenseClassSheet
        ref={sheetRef}
        selectedValue={watchedLicense}
        onSelect={(value) => {
          setValue('license_class', value, { shouldDirty: true });
          sheetRef.current?.dismiss();
        }}
      />
    </SafeAreaView>
  );
}
