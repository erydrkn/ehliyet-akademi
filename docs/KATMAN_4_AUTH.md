# 🔐 KATMAN 4: Kimlik Doğrulama (Auth)

> **Amaç:** Kullanıcıların kayıt olabileceği, giriş yapabileceği, oturumlarının kalıcı tutulduğu bir auth sistemi kurmak.
>
> **Süre:** 4-6 saat (1-2 oturum)
> **Zorluk:** ⭐⭐⭐ (Flow'lar karmaşık ama Supabase çoğunu çözüyor)

---

## 📋 Önkoşullar

- [ ] Katman 1-3 tamamlandı
- [ ] Supabase Auth ayarları açık (dashboard → Auth → Providers)
- [ ] Email provider aktif
- [ ] Google OAuth için client ID alındı (opsiyonel ama önerilir)

---

## 🎯 Bu Katmanın Hedefi

### Auth Ekranları
1. Onboarding (ilk açılış - 3 slide)
2. Login (email + şifre)
3. Register (email + şifre + isim)
4. Forgot Password (email ile reset)
5. Verify Email (doğrulama bekleme)
6. Google Sign-In (opsiyonel)

### Auth State Yönetimi
1. Zustand auth store
2. Session persistence (SecureStore)
3. Protected routes (oturumsuz ana sayfaya gidemez)
4. Misafir modu (kayıtsız kullanım)

### Onboarding Flow
1. Hoş geldin slayt'ları
2. Ehliyet sınıfı seçimi
3. Sınav tarihi (opsiyonel)
4. Kayıt veya Misafir başlama

---

## 📦 Yüklenecek Paketler

```bash
# Secure token storage (token'ları güvenli saklamak için)
npx expo install expo-secure-store

# Google Sign-In (opsiyonel)
npx expo install @react-native-google-signin/google-signin expo-auth-session expo-web-browser expo-crypto
```

---

## 🚀 Claude Code'a Verilecek Prompt

Yeni bir oturumda:

```
Selam! Katman 4: Kimlik Doğrulama'yı kuruyoruz.

Önkoşullar:
- Katman 1-3 tamamlandı
- Supabase auth yapılandırıldı (email provider aktif)
- src/lib/supabase.ts çalışıyor

Proje kökündeki CLAUDE.md'yi oku, kurallara uy.

BU KATMANIN KAPSAMI:
Eksiksiz bir auth sistemi: onboarding, login, register, forgot password, 
protected routes, session persistence, misafir modu.

YAPILACAKLAR:

A. Auth Store ve Hook'lar:
   1. src/stores/authStore.ts (Zustand + persist)
      - user: User | null
      - session: Session | null
      - isGuest: boolean
      - isLoading: boolean
      - signIn, signUp, signOut, startGuest actions
   
   2. src/hooks/useAuth.ts
      - useAuth() hook wrapper
      - Supabase auth state listener
      - Session refresh logic
   
   3. src/lib/auth.ts
      - signInWithEmail(email, password)
      - signUpWithEmail(email, password, fullName)
      - signInWithGoogle()
      - signOut()
      - resetPassword(email)
      - verifyEmail()

B. Auth Ekranları (app/(auth)/):
   4. app/(auth)/_layout.tsx
      - Auth grubu layout (header yok)
   
   5. app/(auth)/login.tsx
      - Email + şifre formu (React Hook Form + Zod)
      - "Şifremi unuttum" linki
      - "Kayıt ol" linki
      - Google Sign-In butonu (opsiyonel)
      - Validation + error mesajları (Türkçe)
   
   6. app/(auth)/register.tsx
      - Email + şifre + isim + şifre tekrar
      - "Kayıt ol" butonu
      - Başarılı olunca verify-email'e yönlendir
      - KVKK aydınlatma linki
   
   7. app/(auth)/forgot-password.tsx
      - Email girişi
      - "Şifre sıfırlama linki gönder"
      - Başarı mesajı
   
   8. app/(auth)/verify-email.tsx
      - "Emailinize doğrulama linki gönderdik"
      - Resend butonu
      - Otomatik yönlendirme (doğrulanınca)

C. Onboarding:
   9. app/onboarding.tsx
      - 3 slayt carousel (sağa kaydır)
      - Slayt 1: "Ehliyet sınavına hazırlanmanın en akıllı yolu"
      - Slayt 2: "AI ile yanlışlarını anla"
      - Slayt 3: "Kişisel program seninle"
      - Son slaytta: "Kayıt Ol" ve "Misafir Olarak Devam Et" butonları

D. Protected Routes:
   10. app/_layout.tsx güncellemesi
       - Session kontrolü
       - İlk açılış → onboarding (AsyncStorage'da "seen" flag)
       - Session varsa → (tabs)
       - Session yoksa → (auth)

E. Test:
   11. app/(tabs)/profile.tsx
       - Kullanıcı bilgileri göster
       - Çıkış yap butonu
       - (tabs) layout test amaçlı

KURALLAR:
- Tüm form validasyonu Zod ile
- Hata mesajları Türkçe ve aksiyon önerili
  ("Email geçersiz" değil "Geçerli bir email adresi girin")
- Loading state'ler visible olmalı (button içinde spinner)
- Keyboard handling: klavye açıkken içerik kaymamalı (KeyboardAvoidingView)
- Password input: göster/gizle toggle
- Email input: autoCapitalize="none", keyboardType="email-address"

GÜVENLİK:
- Şifre minimum 8 karakter, bir rakam, bir harf
- Session token'ları SecureStore'da (AsyncStorage değil)
- Auto-logout: token expire olunca

PLAN MODUNDA BAŞLA:

Plan:
1. Dosya oluşturma sırası
2. Form validation schema'ları
3. Auth flow diagramı (hangi ekrandan hangisine geçiliyor)
4. Session persistence stratejisi

Sonra dosyaları grup grup oluştur:
- Önce lib ve store (temel)
- Sonra auth ekranları
- Sonra onboarding
- En son protected route logic

Her gruptan sonra test et, devam edelim.

Başla.
```

---

## 🔄 Auth Flow Diagramı

```
Uygulama Açılır
      ↓
AsyncStorage'da "onboarding_seen" var mı?
  │
  ├── HAYIR → Onboarding Göster
  │            ↓
  │            3. Slide'da seçim:
  │            ├─ "Kayıt Ol" → (auth)/register
  │            └─ "Misafir" → (tabs)/index (isGuest=true)
  │
  └── EVET → Supabase session var mı?
             ├── VAR → (tabs)/index
             └── YOK → (auth)/login

(auth)/login
  ├─ "Giriş yap" başarılı → (tabs)/index
  ├─ "Kayıt ol" linki → (auth)/register
  └─ "Şifremi unuttum" → (auth)/forgot-password

(auth)/register
  ├─ Başarılı → (auth)/verify-email
  └─ Email doğrulanınca → (tabs)/index

(tabs)/profile
  └─ "Çıkış yap" → sign out → (auth)/login
```

---

## 📝 Form Validation Şemaları

`src/lib/schemas/auth.ts`:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email adresi gerekli')
    .email('Geçerli bir email adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli'),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalı')
    .max(50, 'İsim çok uzun'),
  email: z
    .string()
    .min(1, 'Email adresi gerekli')
    .email('Geçerli bir email adresi girin'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[A-Za-z]/, 'Şifre en az bir harf içermeli')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermeli'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Kullanım şartlarını kabul etmelisiniz',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email adresi gerekli')
    .email('Geçerli bir email adresi girin'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
```

---

## 💾 Auth Store (Referans)

`src/stores/authStore.ts`:

```typescript
import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  session: Session | null;
  isGuest: boolean;
  isLoading: boolean;
  isInitialized: boolean;
};

type AuthActions = {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setGuestMode: (isGuest: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  reset: () => void;
};

const initialState: AuthState = {
  user: null,
  session: null,
  isGuest: false,
  isLoading: false,
  isInitialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setUser: (user) => set({ user }),
  setGuestMode: (isGuest) => set({ isGuest }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  reset: () => set(initialState),
}));
```

---

## 🪝 useAuth Hook (Referans)

`src/hooks/useAuth.ts`:

```typescript
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export function useAuthListener() {
  const { setSession, setInitialized } = useAuthStore();
  
  useEffect(() => {
    // İlk session kontrolü
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });
    
    // Session değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
}

export function useAuth() {
  const { user, session, isGuest, isLoading } = useAuthStore();
  
  return {
    user,
    session,
    isAuthenticated: !!user,
    isGuest,
    isLoading,
  };
}
```

---

## 🔒 Protected Route Logic

`app/_layout.tsx` güncelleme:

```typescript
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthListener, useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ... diğer importlar

function useProtectedRoute() {
  const { isAuthenticated, isGuest } = useAuth();
  const { isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (!isInitialized) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isOnboarding = segments[0] === 'onboarding';
    
    const isAllowedUnauth = inAuthGroup || isOnboarding;
    
    if (!isAuthenticated && !isGuest && !isAllowedUnauth) {
      // Giriş yapmamış ve auth/onboarding değilse → onboarding kontrol
      AsyncStorage.getItem('onboarding_seen').then(seen => {
        if (seen === 'true') {
          router.replace('/(auth)/login');
        } else {
          router.replace('/onboarding');
        }
      });
    } else if ((isAuthenticated || isGuest) && inAuthGroup) {
      // Giriş yapmış ama auth ekranındaysa → ana sayfaya
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, isInitialized, segments]);
}

export default function RootLayout() {
  useAuthListener();
  useProtectedRoute();
  
  return (
    // ... Stack navigation
  );
}
```

---

## 📱 Onboarding Slide Örneği

```typescript
const slides = [
  {
    title: 'Ehliyet sınavına en akıllı hazırlık',
    description: '2026 MEB müfredatına uygun binlerce soru ve kişisel programla başarıya hazırlan.',
    emoji: '🚗',
  },
  {
    title: 'AI ile yanlışlarını anla',
    description: 'Her yanlış cevabı yapay zeka sana özel açıklar. Aynı hatayı bir daha yapmazsın.',
    emoji: '🤖',
  },
  {
    title: 'Kişisel programın seninle',
    description: 'Sınav tarihini gir, sana özel yoğun hazırlık programı oluşturulsun.',
    emoji: '🎯',
  },
];
```

---

## ✅ Oturum Sonu Kontrol Listesi

### İşlevsellik
- [ ] Yeni kullanıcı kayıt olabiliyor
- [ ] Email doğrulama maili geliyor
- [ ] Doğrulama sonrası giriş yapabiliyor
- [ ] Yanlış şifre Türkçe hata gösteriyor
- [ ] Şifre sıfırlama maili geliyor
- [ ] Google ile giriş çalışıyor (opsiyonel)
- [ ] Misafir modunda kullanılabiliyor
- [ ] Çıkış yapınca login ekranına gidiyor
- [ ] Uygulama kapatılıp açılınca oturum kalıyor (persistence)
- [ ] Token expire olunca otomatik logout

### UX
- [ ] Onboarding ilk açılışta görünüyor, sonra görünmüyor
- [ ] Tüm form hataları anlaşılır
- [ ] Loading state'leri visible
- [ ] Klavye açıkken layout bozulmuyor
- [ ] Şifre göster/gizle butonu çalışıyor
- [ ] Email alanı otomatik büyük harf yapmıyor

### Güvenlik
- [ ] Token'lar SecureStore'da (AsyncStorage DEĞİL)
- [ ] Şifre minimum kuralları uygulanıyor
- [ ] Supabase user_profiles trigger'ı çalışıyor (yeni profil otomatik)
- [ ] RLS kullanıcı sadece kendi profiline erişiyor

### Navigasyon
- [ ] Giriş yapınca (tabs)/index'e geçiyor
- [ ] Çıkış yapınca (auth)/login'e geçiyor
- [ ] Deep link (auth/reset-password) çalışıyor

---

## 🐛 Sık Sorunlar

### "Email doğrulama maili gelmiyor"
- Supabase Dashboard → Auth → Email Templates → "Confirm signup" aktif mi?
- Spam klasörünü kontrol et
- SMTP ayarları default (Supabase'in) kullanılıyor mu?

### "Google Sign-In çalışmıyor"
- Google Cloud Console'da Android SHA1 fingerprint doğru mu?
- Supabase Dashboard → Auth → Google → Client ID / Secret girili mi?
- `scheme` app.json'da tanımlı mı?

### "Session kayboluyor uygulamayı kapatınca"
- SecureStore gerçekten kullanılıyor mu (AsyncStorage değil)?
- `autoRefreshToken: true` Supabase client config'te?
- iOS için Info.plist ayarları

### "Infinite redirect loop"
Protected route logic'te kontrol:
- `isInitialized` bekleniyor mu?
- Dependency array doğru mu?

### "RLS hata veriyor yeni kayıt sonrası"
`on_auth_user_created` trigger'ı çalışmıyor olabilir. Dashboard → Database → Triggers'ta kontrol et.

---

## 🎯 Sıradaki Katman

Auth sistemi hazır. Şimdi uygulamanın kalbi: quiz motoru.

1. Git commit + push
2. **`KATMAN_5_QUIZ.md`** — en uzun ve en önemli katman

---

*Bu katman tamamlandığında gerçek kullanıcılar kayıt olup içeri girebilir. Şimdi onlara gerçek değer sunma zamanı.*
