import { ChevronRight, GraduationCap } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { fontFamily } from '@/constants/fonts';

type Props = {
  onPress: () => void;
};

export function ExamCTACard({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Deneme sınavı başlat"
      className="flex-row items-center gap-4 rounded-2xl bg-blue-600 p-5 active:bg-blue-700"
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-500/40">
        <GraduationCap size={28} color="#FFFFFF" />
      </View>
      <View className="flex-1 gap-1">
        <Text
          className="text-2xl text-white"
          style={{ fontFamily: fontFamily.semibold }}
        >
          🎓 Deneme Sınavı
        </Text>
        <Text
          className="text-xs text-white opacity-90"
          style={{ fontFamily: fontFamily.regular }}
        >
          50 soru • 45 dakika
        </Text>
      </View>
      <ChevronRight size={24} color="#FFFFFF" />
    </Pressable>
  );
}
