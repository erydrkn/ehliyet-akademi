import { Pressable } from 'react-native';

import { Typography } from '@/components/ui/Typography';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: Props) {
  const containerClass = active
    ? 'bg-blue-600'
    : 'bg-gray-100 dark:bg-gray-800';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      className={`rounded-full px-4 py-2 ${containerClass} active:opacity-80`}
    >
      <Typography
        variant="caption"
        weight="semibold"
        color={active ? 'inverse' : 'default'}
      >
        {label}
      </Typography>
    </Pressable>
  );
}
