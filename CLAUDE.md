# Ehliyet Akademi — Claude Code Proje Talimatları

> Bu dosya projenin **kök dizininde** durmalı. Claude Code her oturumun başında bu dosyayı otomatik okur ve kurallara uyar.

---

## 📌 Proje Özeti

**Ehliyet Akademi**, MEB MTSK ehliyet sınavına hazırlanan Türk kullanıcılar için AI destekli bir mobil uygulamadır. Türkçe arayüz, Android öncelikli (sonra iOS), freemium iş modeli.

**Tek cümle:** 2026 MEB müfredatına uygun soruları, AI açıklamalarla öğreten, kişiselleştirilmiş program sunan bir sınav hazırlık uygulaması.

---

## 🛠️ Teknoloji Stack'i

- **Framework:** React Native 0.81 + Expo SDK 54
- **Dil:** TypeScript (strict mode)
- **Routing:** Expo Router v6 (file-based)
- **Styling:** NativeWind v4 (Tailwind for React Native)
- **State Management:** Zustand
- **Server State:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Reklam:** react-native-google-mobile-ads (NOT expo-ads-admob — deprecated)
- **Abonelik:** RevenueCat
- **AI:** Anthropic Claude API (Haiku model) — client'tan değil, Supabase Edge Function üzerinden
- **Analytics:** PostHog
- **Error Tracking:** Sentry
- **Build:** EAS Build
- **Animation:** React Native Reanimated 3

---

## 📁 Klasör Yapısı (Zorunlu)

```
ehliyet-akademi/
├── app/                      # Expo Router sayfaları
│   ├── (auth)/               # Giriş yapmamış kullanıcı grubu
│   ├── (tabs)/               # Ana tab navigasyon
│   ├── quiz/                 # Quiz ekranları
│   └── _layout.tsx
├── src/
│   ├── components/
│   │   ├── ui/               # Button, Card, Input, Modal vb.
│   │   ├── quiz/             # QuestionCard, OptionButton vb.
│   │   └── stats/
│   ├── hooks/                # useAuth, useQuestions, usePremium vb.
│   ├── stores/               # Zustand store'ları
│   ├── lib/                  # supabase, admob, revenuecat, ai
│   ├── api/                  # API çağrıları
│   ├── types/                # TypeScript tipleri
│   ├── constants/            # colors, config, categories
│   └── utils/                # format, validation, storage
├── assets/                   # images, icons, fonts
├── supabase/                 # migrations, functions
└── docs/                     # Katman dokümanları
```

**Kural:** Yeni dosyalar bu yapıya uygun oluşturulmalı. Yapıyı bozan yerleştirmeler yapma.

---

## ✏️ Kod Standartları

### Genel
- **Sadece TypeScript.** `.js` / `.jsx` dosya oluşturma.
- **Fonksiyonel component'ler.** Class component YOK.
- **Hook'lar.** State için `useState`, `useReducer`, custom hooks.
- **Null vs undefined.** API'den gelen eksik veri için `null`, tanımsız için `undefined`.

### Dosya İsimlendirme
- Component dosyaları: **PascalCase** → `QuestionCard.tsx`
- Hook dosyaları: **camelCase** → `useAuth.ts`
- Utility dosyaları: **kebab-case** → `format-date.ts`
- Route dosyaları (Expo Router): **kebab-case** → `forgot-password.tsx`

### Import Sıralaması (zorunlu)
```typescript
// 1. React ve React Native
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// 2. External paketler (alphabetical)
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

// 3. Internal (src/) — alias kullan
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

// 4. Relative (sadece aynı klasördeki dosyalar için)
import { QuestionCard } from './QuestionCard';
```

### Stil Kuralları
- **StyleSheet KULLANMA.** NativeWind `className` kullan.
- Inline style sadece dinamik değerler için.
- Renk ve spacing için Tailwind class'ları, hex kod YOK.
```tsx
// ❌ Yanlış
<View style={{ backgroundColor: '#2563EB', padding: 16 }} />

// ✅ Doğru
<View className="bg-blue-600 p-4" />
```

### Component Yapısı
```typescript
// Her component dosyası şu yapıda:
import { ... } from 'react';
// ... diğer importlar

type Props = {
  title: string;
  onPress: () => void;
  // ...
};

export function ComponentName({ title, onPress }: Props) {
  // hooks
  // derived state
  // handlers
  // effects
  
  return (
    // JSX
  );
}
```

### Renkler (Tailwind Class Olarak)
- **Birincil:** `bg-blue-600`, `text-blue-600` → #2563EB
- **Doğru/başarılı:** `bg-green-500`, `text-green-500` → #10B981
- **Yanlış/hata:** `bg-red-500`, `text-red-500` → #EF4444
- **Uyarı:** `bg-yellow-500`
- **Nötr:** `bg-gray-50/100/200/.../900`

### Border Radius
- Varsayılan: `rounded-xl` (12px)
- Kart: `rounded-2xl` (16px)
- Buton: `rounded-xl`
- Küçük badge: `rounded-md`

### Spacing
- Ekran padding: `p-4` (16px) veya `p-6` (24px)
- Component arası: `gap-3` veya `gap-4`
- Liste item arası: `gap-2`

---

## 🚫 YAPMA LİSTESİ

### Kritik Yasaklar
- **Anthropic API key'i client kodda KULLANMA.** Supabase Edge Function üzerinden proxy yap.
- **AdMob gerçek ID'lerini geliştirme sırasında KULLANMA.** Sadece test ID'leri. Production build'te değişir.
- **localStorage/sessionStorage KULLANMA.** React Native'de yok. AsyncStorage veya SecureStore kullan.
- **Raw SQL query'si client'tan ATMA.** Supabase client fonksiyonlarını kullan.
- **Soru içeriğini başka uygulamalardan KOPYALAMA.** Telif ihlali. Orijinal veya lisanslı içerik.

### Kod Kalite Yasakları
- Console.log bırakma (production'a). Geliştirme için OK ama son commit öncesi temizle.
- `any` type kullanma. Bilinmiyorsa `unknown` + type guard.
- Magic number'lar. Sabitleri `constants/` altına koy.
- 200 satırdan uzun component. Parçala.
- Anonymous default export YAPMA. Named export tercih et.
- `useEffect` içinde async fonksiyonu direkt yazma:
```tsx
// ❌ Yanlış
useEffect(async () => { ... }, []);

// ✅ Doğru
useEffect(() => {
  const load = async () => { ... };
  load();
}, []);
```

### UX Yasakları
- Loading state olmadan API çağrısı yapma.
- Error state göstermeden hata yutma.
- Kullanıcıya İngilizce hata mesajı gösterme. **Türkçe, anlaşılır, aksiyon önerili.**
- Sonsuz loading. Timeout koy (10 saniye yeterli).

---

## ✅ YAP LİSTESİ

### Her Yeni Özellik İçin
1. TypeScript tipini önce tanımla (types/)
2. API fonksiyonu yaz (api/)
3. TanStack Query hook'u oluştur (hooks/)
4. Zustand store gerekli mi kontrol et (stores/)
5. UI component yaz (components/)
6. Ekran bağla (app/)
7. Loading + Error + Empty state düşün
8. Test et (gerçek cihazda)

### API Çağrıları
- Her zaman TanStack Query kullan (`useQuery`, `useMutation`).
- Raw `fetch` veya `axios` yazma.
- Cache key'lerini `src/constants/query-keys.ts`'te topla.
- Mutation sonrası ilgili query'yi `invalidateQueries` ile yenile.

### Formlar
- React Hook Form + Zod schema.
- `@hookform/resolvers/zod` kullan.
- Her form için schema ayrı dosyada (`schemas/`).

### Güvenlik
- Kullanıcı girdisi her zaman validate edilir (Zod).
- Supabase RLS policies olmadan tablo oluşturma.
- Token'ları `expo-secure-store`'da sakla, AsyncStorage'da DEĞİL.

---

## 🎨 Tasarım Prensipleri

1. **Sadelik:** Her ekran tek bir iş yapsın. Dağınıklık yok.
2. **Türkçe:** Tüm metinler Türkçe. Gelecek versiyonda çeviri (i18n) eklenecek.
3. **Erişilebilirlik:** Minimum 44x44px dokunma alanı, accessibility labels.
4. **Karanlık mod:** Her ekran dark/light destekli.
5. **Hızlı geri bildirim:** Kullanıcı bir şey yapınca hemen görsel/haptic geri bildirim.

---

## 🗣️ Dil ve İletişim

- Tüm kullanıcı görülebilir metinler **Türkçe**.
- Kod yorumları **Türkçe veya İngilizce** (karışık olmasın, tutarlı ol).
- Commit mesajları **İngilizce** (Conventional Commits formatında):
  - `feat: add quiz engine`
  - `fix: streak calculation bug`
  - `refactor: extract Button variants`
  - `chore: update dependencies`
- PR başlıkları İngilizce.
- Konuşma dili **Türkçe** (Claude Code'un kullanıcıyla).

---

## ⚡ Claude Code'a Özel Talimatlar

### Her Oturumun Başında
1. `CLAUDE.md` dosyasını oku (bu dosya). Kurallara uy.
2. Kullanıcının dediğini anla ve **plan çıkar.** Direkt kod yazma.
3. Plan'i kullanıcıya sun, onay bekle.

### Plan Modu
- Kullanıcı "plan çıkar" demeden bile, büyük değişikliklerde önce plan ver.
- Plan'de şunlar olsun: dosyalar, paketler, değişiklikler, test adımları.

### Kod Yazarken
- **Bir seferde çok dosya yaratma.** 3-5 dosya maksimum.
- Her dosyadan sonra kullanıcıya "test et, devam edelim mi?" diye sor.
- TypeScript hatalarını ignore etme. `@ts-ignore` yazma.

### Paket Yüklerken
- **MUTLAKA güncel sürümü kullan.** `npm view PAKET version` ile kontrol et.
- Expo paketleri için: `npx expo install PAKET` (sürüm uyumluluğu için).
- Diğer paketler için: `npm install PAKET`.

### Hata Durumunda
- Hatanın tam metnini iste.
- Önce neden olduğunu analiz et, sonra çöz.
- "Şunu da yapalım" ile scope genişletme, sadece hatayı çöz.

### Bilmiyorsan
- **Uydurma.** "Bunu doğrulamam gerekiyor, şu dosyaya bakabilir miyim?" de.
- Web search gerekliyse kullanıcıya söyle, o dokümantasyon getirir.
- Hafızandan API adları, paket isimleri, syntax yazma — doğrula.

---

## 📚 Referans Dosyalar

Proje ile ilgili ek bilgi gerekirse `docs/` klasörüne bak:
- `docs/KATMAN_X_*.md` — Katman bazlı görev listeleri
- Kullanıcı belirli bir katmana odaklandığında, sadece o katmanın dosyasını oku. Diğerlerini açma.

---

## 🎯 Öncelik Sırası

Çatışma durumunda şu sıraya uy:
1. **Güvenlik** (API key, kullanıcı verisi)
2. **Çalışan kod** (test edilmiş, hatasız)
3. **Kod kalitesi** (standartlara uyum)
4. **Tasarım güzelliği** (polish)
5. **Optimizasyon** (performance, bundle size)

Yani: Mükemmel kod değil, güvenli ve çalışan kod. Optimizasyon sonraki iterasyonda.

---

*Son güncelleme: Proje başlangıcı*
