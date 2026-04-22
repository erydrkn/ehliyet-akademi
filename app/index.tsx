import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-3xl font-bold text-primary mb-2">
          Ehliyet Akademi 🚗
        </Text>
        <Text className="text-base text-gray-600">
          Kurulum başarılı!
        </Text>
      </View>
    </SafeAreaView>
  );
}
