// Ehliyet sınıfı seçenekleri — DB CHECK constraint ile birebir uyumlu.
// Kaynak: supabase/migrations/20260424000001_initial_schema.sql:21

import type { LicenseClass } from '@/types/database';

export type LicenseClassOption = {
  value: LicenseClass;
  label: string;
};

export const LICENSE_CLASSES: LicenseClassOption[] = [
  { value: 'B', label: 'B (Otomobil)' },
  { value: 'B1', label: 'B1 (Quad/Yan sepetli)' },
  { value: 'BE', label: 'BE (B + römork)' },
  { value: 'A', label: 'A (Motosiklet sınırsız)' },
  { value: 'A1', label: 'A1 (Motosiklet 125cc altı)' },
  { value: 'A2', label: 'A2 (Motosiklet orta)' },
  { value: 'C', label: 'C (Kamyon)' },
  { value: 'C1', label: 'C1 (Hafif kamyon)' },
  { value: 'CE', label: 'CE (Çekici)' },
  { value: 'D', label: 'D (Otobüs)' },
  { value: 'D1', label: 'D1 (Minibüs)' },
  { value: 'DE', label: 'DE (D + römork)' },
  { value: 'F', label: 'F (Traktör)' },
];

export const LICENSE_CLASS_VALUES = LICENSE_CLASSES.map((c) => c.value) as [
  LicenseClass,
  ...LicenseClass[],
];
