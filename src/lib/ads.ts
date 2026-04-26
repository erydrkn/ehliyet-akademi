import mobileAds, {
  AdEventType,
  InterstitialAd,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';

import { AD_UNIT_IDS, INTERSTITIAL_RULES } from '@/constants/ads';

let initialized = false;
let lastInterstitialTimestamp = 0;
const appStartTimestamp = Date.now();

let cachedInterstitial: InterstitialAd | null = null;

export async function initializeAds(): Promise<void> {
  if (initialized) return;

  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });

    const adapterStatuses = await mobileAds().initialize();
    initialized = true;

    if (__DEV__) {
      console.log('✅ AdMob başlatıldı:', adapterStatuses);
    }
  } catch (err) {
    console.warn('⚠️ AdMob başlatma başarısız:', err);
  }
}

function getInterstitial(): InterstitialAd {
  if (!cachedInterstitial) {
    cachedInterstitial = InterstitialAd.createForAdRequest(
      AD_UNIT_IDS.interstitial,
    );
  }
  return cachedInterstitial;
}

export function preloadInterstitial(): void {
  try {
    const ad = getInterstitial();
    if (!ad.loaded) {
      ad.load();
    }
  } catch (err) {
    console.warn('⚠️ Interstitial preload başarısız:', err);
  }
}

export async function showInterstitial(probability = 1.0): Promise<boolean> {
  const timeSinceStart = Date.now() - appStartTimestamp;
  if (timeSinceStart < INTERSTITIAL_RULES.FIRST_AD_DELAY_MS) {
    if (__DEV__) {
      console.log('⏭️ Interstitial atlandı: app açılışından çok az süre geçti');
    }
    return false;
  }

  const timeSinceLast = Date.now() - lastInterstitialTimestamp;
  if (
    lastInterstitialTimestamp > 0 &&
    timeSinceLast < INTERSTITIAL_RULES.MIN_INTERVAL_MS
  ) {
    if (__DEV__) {
      console.log('⏭️ Interstitial atlandı: minimum süre dolmadı');
    }
    return false;
  }

  if (Math.random() > probability) {
    if (__DEV__) {
      console.log('⏭️ Interstitial atlandı: probability check');
    }
    return false;
  }

  try {
    const ad = getInterstitial();

    if (!ad.loaded) {
      ad.load();
      if (__DEV__) {
        console.log('⏭️ Interstitial yüklü değil, sonraki için yükleniyor');
      }
      return false;
    }

    return await new Promise<boolean>((resolve) => {
      let settled = false;
      const settle = (value: boolean) => {
        if (settled) return;
        settled = true;
        closeListener();
        errorListener();
        clearTimeout(cleanupTimer);
        resolve(value);
      };

      const closeListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
        lastInterstitialTimestamp = Date.now();
        cachedInterstitial = null;
        preloadInterstitial();
        settle(true);
      });

      const errorListener = ad.addAdEventListener(AdEventType.ERROR, (err) => {
        console.warn('⚠️ Interstitial hatası:', err);
        cachedInterstitial = null;
        settle(false);
      });

      const cleanupTimer = setTimeout(() => {
        settle(false);
      }, 10000);

      ad.show();
    });
  } catch (err) {
    console.warn('⚠️ Interstitial gösterimi başarısız:', err);
    return false;
  }
}
