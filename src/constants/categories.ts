// Kategori meta verisi — label, soru sayısı, renk sınıfları, ikon rengi.
// Home/Stats/Study ekranlarında ortak referans.

import type { QuestionCategory } from '@/types/database';

export type CategoryMeta = {
  category: QuestionCategory;
  label: string;
  questionCount: number;
  bgClass: string;
  iconBgClass: string;
  iconColor: string;
};

export const CATEGORIES: CategoryMeta[] = [
  {
    category: 'ilk_yardim',
    label: 'İlk Yardım',
    questionCount: 121,
    bgClass: 'bg-red-50 dark:bg-red-950',
    iconBgClass: 'bg-red-100 dark:bg-red-900',
    iconColor: '#EF4444',
  },
  {
    category: 'trafik',
    label: 'Trafik',
    questionCount: 227,
    bgClass: 'bg-blue-50 dark:bg-blue-950',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900',
    iconColor: '#3B82F6',
  },
  {
    category: 'motor',
    label: 'Motor',
    questionCount: 101,
    bgClass: 'bg-orange-50 dark:bg-orange-950',
    iconBgClass: 'bg-orange-100 dark:bg-orange-900',
    iconColor: '#F59E0B',
  },
  {
    category: 'trafik_adabi',
    label: 'Trafik Adabı',
    questionCount: 50,
    bgClass: 'bg-green-50 dark:bg-green-950',
    iconBgClass: 'bg-green-100 dark:bg-green-900',
    iconColor: '#10B981',
  },
];
