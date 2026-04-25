import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { CircleAlert } from 'lucide-react-native';
import { useCallback, type Ref } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  ref?: Ref<BottomSheetModal>;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ExitExamSheet({ ref, onCancel, onConfirm }: Props) {
  const { scheme } = useTheme();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['42%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: scheme === 'dark' ? '#4B5563' : '#D1D5DB',
      }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 16,
          alignItems: 'center',
        }}
      >
        <CircleAlert size={48} color="#EF4444" />
        <Typography variant="h3" align="center">
          Sınavı iptal etmek mi istiyorsun?
        </Typography>
        <Typography color="muted" align="center">
          Tüm cevapların silinecek ve sınav kaydedilmeyecek.
        </Typography>
        <View className="mt-2 w-full gap-3">
          <Button onPress={onCancel} fullWidth>
            Devam Et
          </Button>
          <Button variant="danger" onPress={onConfirm} fullWidth>
            İptal Et
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
