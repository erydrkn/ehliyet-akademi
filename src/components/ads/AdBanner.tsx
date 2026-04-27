import { AD_UNIT_IDS } from '@/constants/ads';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// ⚠️ SCREENSHOT MODU - Play Store screenshot'ları için banner gizli
// Production'a göndermeden ÖNCE bu flag'i true yap!
const SHOW_ADS = true;

type Props = {
  size?: BannerAdSize;
};
export function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: Props) {
  if (!SHOW_ADS) return null;

  return (
    <View className="items-center" accessibilityLabel="Reklam">
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={(err) => {
          if (__DEV__) {
            console.warn('Banner yüklenemedi:', err);
          }
        }}
      />
    </View>
  );
}
