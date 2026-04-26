import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { AD_UNIT_IDS } from '@/constants/ads';

type Props = {
  size?: BannerAdSize;
};

export function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: Props) {
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
