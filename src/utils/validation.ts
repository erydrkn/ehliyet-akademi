import { z } from 'zod';

import { LICENSE_CLASS_VALUES } from '@/constants/license-classes';

// Kullanıcı girdilerinin Zod ile doğrulanması.
// Hata mesajları Türkçe ve aksiyon önerili olmalı.

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email adresi zorunludur')
  .email('Geçerli bir email adresi girin')
  .transform((value) => value.toLowerCase());

const passwordBaseSchema = z.string().min(8, 'Şifre en az 8 karakter olmalı');

const strongPasswordSchema = passwordBaseSchema
  .regex(/[A-Za-z]/, 'Şifre en az bir harf içermeli')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermeli');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordBaseSchema,
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Ad soyadınızı girin')
      .max(50, 'Ad soyad en fazla 50 karakter olabilir'),
    email: emailSchema,
    password: strongPasswordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['passwordConfirm'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const profileEditSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Ad soyad en az 2 karakter olmalı')
    .max(50, 'Ad soyad en fazla 50 karakter olabilir'),
  license_class: z.enum(LICENSE_CLASS_VALUES),
  exam_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Geçerli bir tarih girin')
    .nullable(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;
