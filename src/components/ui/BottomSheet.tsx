// @gorhom/bottom-sheet v5 sarmalayıcı — present/dismiss ref ile, snap point'ler ve klavye uyumu.

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, type ReactNode, type Ref } from 'react';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  ref?: Ref<BottomSheetModal>;
  children: ReactNode;
  title?: string;
  snapPoints?: Array<string | number>;
  onDismiss?: () => void;
};

export function BottomSheet({ ref, children, title, snapPoints, onDismiss }: Props) {
  const { scheme } = useTheme();
  const points = useMemo(
    () => snapPoints ?? ['25%', '50%', '90%'],
    [snapPoints]
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={points}
      enablePanDownToClose
      onDismiss={onDismiss}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{
        backgroundColor: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: scheme === 'dark' ? '#4B5563' : '#D1D5DB',
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 16, gap: 12 }}>
        {title ? <Typography variant="h3">{title}</Typography> : null}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export type { BottomSheetModal as BottomSheetRef };
