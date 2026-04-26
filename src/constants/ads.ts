import { Platform } from 'react-native';

const isDev = __DEV__;

const TEST_BANNER_ANDROID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_INTERSTITIAL_ANDROID = 'ca-app-pub-3940256099942544/1033173712';

const PROD_BANNER_ANDROID = process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID;
const PROD_INTERSTITIAL_ANDROID =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID;

function resolveBanner(): string {
  if (isDev) return TEST_BANNER_ANDROID;
  if (Platform.OS === 'android' && PROD_BANNER_ANDROID) {
    return PROD_BANNER_ANDROID;
  }
  return TEST_BANNER_ANDROID;
}

function resolveInterstitial(): string {
  if (isDev) return TEST_INTERSTITIAL_ANDROID;
  if (Platform.OS === 'android' && PROD_INTERSTITIAL_ANDROID) {
    return PROD_INTERSTITIAL_ANDROID;
  }
  return TEST_INTERSTITIAL_ANDROID;
}

export const AD_UNIT_IDS = {
  banner: resolveBanner(),
  interstitial: resolveInterstitial(),
} as const;

export const INTERSTITIAL_RULES = {
  EXAM_END_PROBABILITY: 1.0,
  QUIZ_END_PROBABILITY: 0.3,
  MIN_INTERVAL_MS: 5 * 60 * 1000,
  FIRST_AD_DELAY_MS: 60 * 1000,
} as const;
