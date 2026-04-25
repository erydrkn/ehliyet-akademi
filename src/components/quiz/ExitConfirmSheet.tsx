import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { AlertTriangle } from 'lucide-react-native';
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

export function ExitConfirmSheet({ ref, onCancel, onConfirm }: Props) {
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
      snapPoints={['38%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: scheme === 'dark' ? '#4B5563' : '#D1D5DB',
      }}
    >
      <BottomSheetView style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, gap: 16, alignItems: 'center' }}>
        <AlertTriangle size={48} color="#F59E0B" />
        <Typography variant="h3" align="center">
          Quizden çıkmak istiyor musun?
        </Typography>
        <Typography color="muted" align="center">
          Mevcut ilerlemen kaydedilmeyecek.
        </Typography>
        <View className="mt-2 w-full flex-row gap-3">
          <View className="flex-1">
            <Button variant="secondary" fullWidth onPress={onCancel}>
              Vazgeç
            </Button>
          </View>
          <View className="flex-1">
            <Button variant="danger" fullWidth onPress={onConfirm}>
              Çık
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
