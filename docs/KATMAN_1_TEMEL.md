# 🏗️ KATMAN 1: Temel İskele

> **Amaç:** Boş bir Expo projesinden, telefonda "Hello World" gösterebilen, klasör yapısı hazır, Tailwind çalışan bir başlangıç noktası oluşturmak.
>
> **Süre:** 3-6 saat (1-2 oturum)
> **Zorluk:** ⭐⭐ (Kurulum, karmaşık değil)

---

## 📋 Önkoşullar

Başlamadan önce şunlar tamam olmalı:
- [ ] `SETUP_ONCE.md` tamamlandı
- [ ] Node.js 20+ çalışıyor (`node --version` ile doğrula)
- [ ] Git hazır
- [ ] Telefonunda Expo Go kurulu
- [ ] Proje klasörü oluşturuldu: `mkdir ehliyet-akademi && cd ehliyet-akademi`
- [ ] `git init` yapıldı
- [ ] `docs/` klasörü içine bu dokümanlar kopyalandı
- [ ] `CLAUDE.md` proje kökünde duruyor

---

## 🎯 Bu Katmanın Hedefi

Katman 1 sonunda şunlar çalışıyor olmalı:
1. `npx expo start` komutu hatasız çalışıyor
2. Telefonunda Expo Go'dan QR kod okutup uygulama açılıyor
3. Ekranda karşılama metni görünüyor
4. Klasör yapısı hazır (src/, assets/ vb.)
5. NativeWind (Tailwind) sınıfları çalışıyor
6. İlk commit atıldı
7. GitHub'a push edildi

---

## 📦 Yüklenecek Paketler

Referans amaçlı liste (Claude zaten yükleyecek):

**Core:**
- expo@~55.0.0
- expo-router@~4.0.0
- expo-linking
- expo-constants
- expo-status-bar
- expo-splash-screen
- react-native-safe-area-context
- react-native-screens

**State & Data:**
- zustand
- @tanstack/react-query

**Styling:**
- nativewind@^4.0.0
- tailwindcss@^3.4.0
- react-native-reanimated

**Forms & Validation:**
- react-hook-form
- zod
- @hookform/resolvers

**Storage:**
- expo-secure-store
- @react-native-async-storage/async-storage

**Dev dependencies:**
- typescript
- @types/react
- @types/react-native
- eslint
- prettier

---

## 🚀 Claude Code'a Verilecek Prompt

Aşağıdaki metni **olduğu gibi kopyala**, VS Code terminalinde Claude Code oturumuna yapıştır:

```
Selam! Ehliyet Akademi projesinin Katman 1: Temel İskele kurulumuna başlıyoruz.

Proje özeti:
- React Native + Expo SDK 55 (en güncel)
- TypeScript (strict mode)
- Expo Router v4 (file-based routing)
- NativeWind v4 (Tailwind CSS)
- Zustand + TanStack Query (state management)
- Android öncelikli, sonra iOS

Proje kökündeki CLAUDE.md dosyasını mutlaka oku, oradaki kurallara uy.

ŞU ANLIK KAPSAM: Sadece temel iskeleti kurmak. Component yazmayacağız, sadece:
1. Expo projesini başlatma
2. TypeScript + Tailwind yapılandırma
3. Klasör yapısını oluşturma
4. Boş placeholder dosyalar
5. Telefonda "Hello World" ekranı açılıyor
6. Git init + ilk commit

ÖNCE PLAN MODU (shift+tab):

Bana şu adımları plan halinde sun:

ADIM 1: Expo projesi oluşturma komutu (hangi komut, hangi seçenekler)
ADIM 2: Yüklenecek paketlerin tam listesi (hangi komutla)
ADIM 3: NativeWind kurulumu (tailwind.config.js, babel.config.js, global.css, nativewind-env.d.ts)
ADIM 4: TypeScript yapılandırma (tsconfig.json - path alias @/ için)
ADIM 5: Klasör yapısı (hangi klasörler, hangi .gitkeep dosyaları)
ADIM 6: Temel app/_layout.tsx
ADIM 7: Temel app/index.tsx (Hello World + Tailwind test)
ADIM 8: .gitignore + .env.example
ADIM 9: İlk commit

Her adım için hangi dosyaları oluşturacağını/değiştireceğini listele.

Kod YAZMA. Sadece plan ver. Ben onaylayınca adım adım uygulayacağız.

Güncel paket sürümlerinden emin değilsen: `npm view PAKET version` komutunu çalıştırıp doğrula. 
Expo paketleri için `npx expo install PAKET` kullan (sürüm uyumluluğu için).

Başla.
```

---

## 🗂️ Oluşturulacak Klasör Yapısı

Claude'un oluşturması gereken yapı (referans):

```
ehliyet-akademi/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── .gitkeep
│   ├── hooks/
│   │   └── .gitkeep
│   ├── stores/
│   │   └── .gitkeep
│   ├── lib/
│   │   └── .gitkeep
│   ├── api/
│   │   └── .gitkeep
│   ├── types/
│   │   └── .gitkeep
│   ├── constants/
│   │   └── .gitkeep
│   └── utils/
│       └── .gitkeep
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/                          # Zaten var (bizim koyduğumuz)
├── .env.example
├── .gitignore
├── CLAUDE.md                      # Zaten var
├── app.json
├── babel.config.js
├── global.css
├── metro.config.js
├── nativewind-env.d.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md                      # Proje kendi README'si (docs/ dışında)
```

---

## 🛠️ Adım Adım Süreç (Claude'un Yapacakları)

### Adım 1: Expo Projesi Oluşturma

Claude şu komutu öneri olarak verecek:

```bash
npx create-expo-app@latest . --template default
```

**Dikkat:** Nokta (`.`) mevcut klasöre kurmak için. Boş klasörde olmalı (docs/ ve CLAUDE.md hariç).

**Alternatif sorun:** Klasör boş değilse `--force` ekle veya önce dosyaları taşı.

### Adım 2: Paket Yükleme

```bash
# NativeWind
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

# State
npm install zustand @tanstack/react-query

# Forms
npm install react-hook-form zod @hookform/resolvers

# Storage
npx expo install expo-secure-store @react-native-async-storage/async-storage
```

### Adım 3: NativeWind Kurulumu

**tailwind.config.js** oluşturulacak:
```javascript
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
    },
  },
  plugins: [],
};
```

**babel.config.js** güncellemesi:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

**global.css** (kök dizinde):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**metro.config.js:**
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

**nativewind-env.d.ts:**
```typescript
/// <reference types="nativewind/types" />
```

### Adım 4: TypeScript Path Alias

**tsconfig.json** güncellemesi:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
}
```

### Adım 5: app/_layout.tsx

```typescript
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 dakika
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </QueryClientProvider>
  );
}
```

### Adım 6: app/index.tsx

```typescript
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-3xl font-bold text-primary mb-2">
          Ehliyet Akademi 🚗
        </Text>
        <Text className="text-base text-gray-600">
          Kurulum başarılı!
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

### Adım 7: .gitignore

```
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Environment
.env
.env.local

# EAS
.easignore

# IDE
.vscode/settings.json
.idea/
```

### Adım 8: .env.example

```
# Supabase (sonra doldurulacak)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Analytics
EXPO_PUBLIC_POSTHOG_API_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Sentry
EXPO_PUBLIC_SENTRY_DSN=
```

### Adım 9: İlk Çalıştırma

```bash
npx expo start
```

Terminaldeki QR kodu Expo Go ile okut. "Ehliyet Akademi 🚗" ekranı açılmalı.

### Adım 10: Git Commit

```bash
git add .
git commit -m "feat: initial project setup with Expo + NativeWind + TypeScript"

# GitHub'a push (repo daha önce oluşturulduysa)
git remote add origin https://github.com/KULLANICI/ehliyet-akademi.git
git branch -M main
git push -u origin main
```

---

## ✅ Oturum Sonu Kontrol Listesi

Bu katmanı tamamlanmış sayabilmek için:

- [ ] `npx expo start` hatasız çalışıyor
- [ ] Telefonda Expo Go ile uygulama açılıyor
- [ ] "Ehliyet Akademi 🚗" metni görünüyor
- [ ] Metin mavi renkli (Tailwind `text-primary` çalışıyor)
- [ ] Karanlık/aydınlık mod otomatik değişiyor (status bar renk)
- [ ] Tüm klasörler oluşturuldu (`src/components`, `src/hooks` vs.)
- [ ] TypeScript hataları yok (`npx tsc --noEmit` temiz)
- [ ] `.env` dosyası .gitignore'da
- [ ] İlk commit atıldı
- [ ] GitHub'a push edildi
- [ ] Proje README.md dosyası oluşturuldu (basit bir tanıtım)

---

## 🐛 Sık Karşılaşılan Sorunlar

### Sorun 1: "Unable to resolve module nativewind"
**Çözüm:** `npx expo install nativewind` ile yeniden yükle. `metro.config.js`'i kontrol et.

### Sorun 2: "Metro bundler hatası, className çalışmıyor"
**Çözüm:** `babel.config.js`'te `"nativewind/babel"` preset'i eklendi mi kontrol et. Metro cache temizle: `npx expo start --clear`

### Sorun 3: "Expo Go telefonda açıldı ama 'Network response timed out'"
**Çözüm:** 
- Telefon ve bilgisayar aynı Wi-Fi'de olmalı
- Firewall engellemiş olabilir, kapat
- Tünel modu dene: `npx expo start --tunnel`

### Sorun 4: "Cannot find module '@/...' "
**Çözüm:** `tsconfig.json`'da path alias doğru yazıldı mı kontrol et. VS Code yeniden başlat.

### Sorun 5: "TypeScript sürümü uyumsuz"
**Çözüm:** `npx expo install typescript @types/react` ile Expo uyumlu sürüme yükselt.

---

## 🎯 Sıradaki Katman

Bu katman tamamlanınca:

1. **Git commit at**, GitHub'a push et
2. **Terminali kapat, yeniden aç** (fresh start için)
3. **`/clear`** ile Claude Code oturumunu sıfırla veya yeni pencere aç
4. **`KATMAN_2_TASARIM.md`** dosyasını aç
5. Oradaki prompt'u kopyala, yeni oturuma yapıştır

---

## 💡 İpuçları

**İlk kurulum zor geliyor olabilir.** Kod yazmıyoruz, dosya düzeni yapıyoruz — bu normal. Katman 2'den itibaren daha eğlenceli olacak.

**Hata alırsan panikleme.** Önce hatayı oku, mesajı kopyala, Claude'a "Bu hatayı aldım: ..." de. Çözüm önerecek.

**VS Code TypeScript hataları kırmızı çizili gösteriyorsa:** `Ctrl+Shift+P` → "TypeScript: Restart TS Server" yap. Editör yeniden tarasın.

**Expo Go ile test ederken:** Telefon 4G/5G değil Wi-Fi'de olmalı (veya tunnel modu kullan).

---

*Bu katman tamamlandığında Proje kuruldu, iskele hazır. Artık üstüne bina çıkarmaya başlayabiliriz.*
