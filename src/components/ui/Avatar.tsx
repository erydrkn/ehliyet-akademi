// Profil avatarı — image URI verilirse expo-image, yoksa veya hata olursa isim baş harfleri.

import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { fontFamily } from '@/constants/fonts';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  name?: string;
  source?: string;
  size?: Size;
};

const sizeClass: Record<Size, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const textSizeClass: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-xl',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({ name, source, size = 'md' }: Props) {
  const [imageError, setImageError] = useState(false);

  const showImage = source && !imageError;
  const initials = getInitials(name);

  return (
    <View
      className={`${sizeClass[size]} items-center justify-center overflow-hidden rounded-full bg-blue-600 dark:bg-blue-500`}
      accessibilityRole="image"
      accessibilityLabel={name ?? 'Avatar'}
    >
      {showImage ? (
        <Image
          source={{ uri: source }}
          onError={() => setImageError(true)}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <Text
          className={`text-white ${textSizeClass[size]}`}
          style={{ fontFamily: fontFamily.semibold }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
