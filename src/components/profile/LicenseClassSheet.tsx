import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import { useCallback, type Ref } from 'react';
import { Pressable, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { LICENSE_CLASSES } from '@/constants/license-classes';
import { useTheme } from '@/hooks/useTheme';
import type { LicenseClass } from '@/types/database';

type Props = {
  ref?: Ref<BottomSheetModal>;
  selectedValue: LicenseClass;
  onSelect: (value: LicenseClass) => void;
};

export function LicenseClassSheet({ ref, selectedValue, onSelect }: Props) {
  const { colors, scheme } = useTheme();

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
      snapPoints={['70%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: scheme === 'dark' ? '#4B5563' : '#D1D5DB',
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      >
        <Typography variant="h3" className="px-2 py-3">
          Ehliyet Sınıfı Seç
        </Typography>

        <View className="gap-1">
          {LICENSE_CLASSES.map((item) => {
            const isSelected = item.value === selectedValue;
            return (
              <Pressable
                key={item.value}
                onPress={() => onSelect(item.value)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isSelected }}
                className={`flex-row items-center justify-between rounded-xl p-4 active:opacity-80 ${
                  isSelected ? 'bg-blue-50 dark:bg-blue-950' : ''
                }`}
              >
                <Typography variant="body">{item.label}</Typography>
                {isSelected && <Check size={20} color={colors.primary} />}
              </Pressable>
            );
          })}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
