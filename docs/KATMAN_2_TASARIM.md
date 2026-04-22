# 🎨 KATMAN 2: Tasarım Sistemi

> **Amaç:** Projenin tüm UI temel taşlarını oluşturmak. Tekrar kullanılabilir, tutarlı, erişilebilir component'ler.
>
> **Süre:** 4-6 saat (1-2 oturum)
> **Zorluk:** ⭐⭐⭐ (Component'ler + tema sistemi)

---

## 📋 Önkoşullar

- [ ] Katman 1 tamamlandı
- [ ] `npx expo start` çalışıyor
- [ ] NativeWind Tailwind sınıfları çalışıyor
- [ ] Git repo temiz (commit'ler güncel)

---

## 🎯 Bu Katmanın Hedefi

Katman 2 sonunda şunlar hazır olmalı:

### Zorunlu Component'ler
1. `Button` — Farklı varyantlar ve boyutlar
2. `Card` — İçerik kutusu
3. `Input` — Form input (label, error, icon)
4. `Badge` — Küçük etiket
5. `ProgressBar` — İlerleme çubuğu
6. `Avatar` — Profil resmi
7. `Modal` / `BottomSheet` — Açılır paneller
8. `Toast` — Geçici bildirim mesajları
9. `Spinner` / `Loading` — Yükleme göstergesi
10. `IconButton` — İkon butonu

### Sistem Parçaları
11. Tema sistemi (karanlık/aydınlık mod)
12. Typography sistemi (font boyutları, ağırlıkları)
13. Icon kütüphanesi entegrasyonu (Lucide)
14. Font yükleme (Inter)
15. Showcase ekranı (tüm component'leri test için)

---

## 📦 Yüklenecek Paketler

- `lucide-react-native` — İkon kütüphanesi
- `react-native-svg` — Lucide için gerekli (Expo ile otomatik gelir)
- `@expo-google-fonts/inter` — Inter font ailesi
- `expo-font` — Font yükleme
- `react-native-reanimated` — Animasyonlar (Katman 1'de yüklenmiş olabilir)
- `react-native-gesture-handler` — Gesture desteği (modal, sheet için)

---

## 🚀 Claude Code'a Verilecek Prompt

Yeni bir Claude Code oturumu aç ve aşağıdaki metni yapıştır:

```
Merhaba! Ehliyet Akademi projesinin Katman 2: Tasarım Sistemi'ni kuruyoruz.

Önkoşul: Katman 1 tamamlandı. Proje iskeleti hazır, NativeWind çalışıyor.

Proje kökündeki CLAUDE.md'yi oku, kurallara uy.

BU KATMANIN KAPSAMI:
Tekrar kullanılabilir UI component'leri ve tema sistemi oluşturmak.

YAPILACAKLAR:
1. Gerekli paketleri yükle (lucide-react-native, Inter font, gesture-handler)
2. Font sistemi kur (Inter font, 4 ağırlık: 400, 500, 600, 700)
3. Renk sistemi (src/constants/colors.ts)
4. Tema store (src/stores/themeStore.ts) - Zustand ile dark/light mode
5. Temel UI component'leri (src/components/ui/):
   - Button.tsx (variant: primary/secondary/ghost/danger, size: sm/md/lg, loading, icon destekli)
   - Card.tsx
   - Input.tsx (label, error, icon)
   - Badge.tsx (variant: default/success/danger/warning)
   - ProgressBar.tsx
   - Avatar.tsx (initials fallback)
   - Spinner.tsx
   - IconButton.tsx
   - Modal.tsx (fullscreen)
   - BottomSheet.tsx (alt panel)
   - Toast.tsx + ToastProvider
6. Typography helper component (Text wrapper)
7. Showcase ekranı (app/showcase.tsx) - tüm component'leri görüntüleyip test edebileceğimiz bir ekran

KURALLAR:
- Sadece NativeWind (className) kullan, StyleSheet YAPMA
- Her component props type ile tanımlı olmalı
- Her component default export ile DEĞİL named export olmalı
- Her component dosyasının başında ne olduğunu anlatan 2-3 satır comment olsun
- Component'ler Türkçe olmayan, İngilizce isimlerle (Button, Card, vs.)
- Ama içindeki metinler/props Türkçe olabilir

PLAN MODUNDA BAŞLA (shift+tab):

Önce şu planı sun:
1. Paket kurulumu (hangi komutlar)
2. Font yükleme (nereye, nasıl)
3. Renk ve tema sistemi (dosya yapısı)
4. Component oluşturma sırası (hangisi öncelikli)
5. Showcase ekranı yapısı

Sonra dosyaları TEK TEK oluştur. Her 2-3 dosyada bir dur, ben test edeyim, sonra devam edelim.

Bir seferde 10 dosya yaratma. Kademeli ilerle.

Başlayalım.
```

---

## 📁 Beklenen Dosya Yapısı

Katman 2 sonunda şu yapı oluşmalı:

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── ProgressBar.tsx
│       ├── Avatar.tsx
│       ├── Spinner.tsx
│       ├── IconButton.tsx
│       ├── Modal.tsx
│       ├── BottomSheet.tsx
│       ├── Toast.tsx
│       ├── ToastProvider.tsx
│       └── Typography.tsx
├── constants/
│   ├── colors.ts
│   ├── fonts.ts
│   └── spacing.ts
├── stores/
│   └── themeStore.ts
└── hooks/
    └── useTheme.ts

app/
├── _layout.tsx          (güncellenecek - font + theme provider)
└── showcase.tsx         (yeni - component showcase)
```

---

## 🎨 Renk Paleti (Referans)

`src/constants/colors.ts` içeriği beklenen:

```typescript
export const colors = {
  light: {
    // Brand
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryDark: '#1D4ED8',
    
    // Semantic
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    
    // Neutral
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    border: '#E5E7EB',
    
    // Text
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
  },
  dark: {
    primary: '#3B82F6',
    primaryLight: '#1E3A8A',
    primaryDark: '#60A5FA',
    
    success: '#10B981',
    successLight: '#064E3B',
    danger: '#EF4444',
    dangerLight: '#7F1D1D',
    warning: '#F59E0B',
    warningLight: '#78350F',
    info: '#3B82F6',
    
    background: '#111827',
    surface: '#1F2937',
    card: '#1F2937',
    border: '#374151',
    
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textMuted: '#9CA3AF',
    textInverse: '#111827',
  },
} as const;

export type ColorTheme = keyof typeof colors;
export type ColorToken = keyof typeof colors.light;
```

---

## 🔤 Typography Sistemi

`src/constants/fonts.ts`:

```typescript
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
```

---

## 🌙 Tema Store (Referans)

`src/stores/themeStore.ts`:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## 🧩 Button Component (Referans Örnek)

```typescript
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:active:bg-gray-600',
  ghost: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
  danger: 'bg-red-500 active:bg-red-600',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
};

const textVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-900 dark:text-gray-100',
  ghost: 'text-blue-600 dark:text-blue-400',
  danger: 'text-white',
};

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm font-medium',
  md: 'text-base font-semibold',
  lg: 'text-lg font-semibold',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        rounded-xl items-center justify-center flex-row
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#2563EB' : '#FFFFFF'} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={`${textVariantClasses[variant]} ${textSizeClasses[size]}`}>
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
```

---

## 📱 Showcase Ekranı (Referans)

`app/showcase.tsx` — tüm component'leri test ettiğin ekran:

```typescript
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
// ... diğer importlar

export default function Showcase() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">UI Showcase</Text>
        
        {/* Buttons */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3">Buttons</Text>
          <View className="gap-3">
            <Button onPress={() => {}}>Primary Button</Button>
            <Button variant="secondary" onPress={() => {}}>Secondary</Button>
            <Button variant="ghost" onPress={() => {}}>Ghost</Button>
            <Button variant="danger" onPress={() => {}}>Danger</Button>
            <Button loading onPress={() => {}}>Loading</Button>
            <Button disabled onPress={() => {}}>Disabled</Button>
          </View>
        </View>
        
        {/* Diğer component showcase'leri... */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## ✅ Oturum Sonu Kontrol Listesi

- [ ] Tüm UI component'leri oluşturuldu (13 tane)
- [ ] Tema sistemi çalışıyor (dark/light mode toggle)
- [ ] Inter fontu yüklendi
- [ ] Lucide ikonları kullanılabiliyor
- [ ] Showcase ekranı açılıyor (`app/showcase.tsx`)
- [ ] Tüm component'ler showcase'de görüntüleniyor
- [ ] Her component karanlık modda düzgün görünüyor
- [ ] TypeScript hatası yok (`npx tsc --noEmit`)
- [ ] Telefonda test edildi, dokunma alanları yeterli (min 44x44)
- [ ] Git commit atıldı
- [ ] GitHub'a push edildi

---

## 🧪 Test Senaryoları

Her component için en az bunu test et:

### Button
- [ ] 4 varyant (primary, secondary, ghost, danger) görsel doğru
- [ ] 3 boyut (sm, md, lg) fark edilebilir
- [ ] Loading durumu spinner gösteriyor
- [ ] Disabled durumu soluk ve dokunulamaz
- [ ] İkon props'u çalışıyor
- [ ] fullWidth props'u çalışıyor

### Input
- [ ] Label görünüyor
- [ ] Placeholder doğru
- [ ] Focus durumu border rengi değişiyor
- [ ] Error durumu kırmızı border ve mesaj
- [ ] Icon props çalışıyor
- [ ] Secure input (password) maskeleniyor

### Modal & BottomSheet
- [ ] Açılış animasyonu akıcı
- [ ] Backdrop'a dokununca kapanıyor
- [ ] Klavye açıkken içerik kaymıyor
- [ ] Scroll çalışıyor (uzun içerikte)

### Toast
- [ ] Mesaj doğru konumda beliriyor
- [ ] 3 saniye sonra otomatik kayboluyor
- [ ] 4 tip (success, error, warning, info) doğru renk

### Dark Mode
- [ ] Sistem ayarıyla otomatik değişiyor
- [ ] Manuel toggle çalışıyor
- [ ] Tüm metinler okunaklı
- [ ] Border'lar görünür

---

## 🐛 Sık Karşılaşılan Sorunlar

### Sorun: "Font yüklenmedi, düz font görünüyor"
**Çözüm:** `_layout.tsx`'te `useFonts` hook'u kullanılmış mı kontrol et. `SplashScreen` font yüklenene kadar bekletilmeli.

### Sorun: "Lucide ikonları görünmüyor"
**Çözüm:** `react-native-svg` yüklü mü kontrol et. Expo ile otomatik gelmediyse: `npx expo install react-native-svg`.

### Sorun: "Dark mode otomatik değişmiyor"
**Çözüm:** NativeWind'in `dark:` prefix'i için `useColorScheme` hook ile senkron olmalı. Tailwind config'te `darkMode: 'class'` değil `darkMode: 'media'` olmalı.

### Sorun: "Animasyonlar takılıyor"
**Çözüm:** Reanimated kurulumu eksik olabilir. `babel.config.js`'te `react-native-reanimated/plugin` en SONDA olmalı.

### Sorun: "BottomSheet alt navigasyon barını kapatıyor"
**Çözüm:** `react-native-safe-area-context` ile güvenli alan hesaplaması yap.

---

## 🎯 Sıradaki Katman

Katman 2 tamamlanınca:

1. Git commit + push
2. Terminali kapat, yeniden aç
3. Claude Code oturumunu sıfırla (`/clear` veya yeni pencere)
4. **`KATMAN_3_VERI.md`** dosyasını aç
5. İçindeki prompt'u kopyala, yeni oturuma yapıştır

---

## 💡 İpuçları

**Component yazarken:** Önce en basit halini yaz (sadece string alan Button), test et, çalışıyorsa üzerine özellik ekle (variant, size, loading). Baştan tüm özellikleri eklemeye çalışma.

**Tasarım kararları:** Pinterest'te "mobile UI design" ara. İlham al ama kopyalama. Duolingo, Headspace, Notion mobile app UI'larını incele.

**Figma kullanıyorsan:** Component'leri önce orada çiz, sonra kodla. Çok daha hızlı.

**Renk sistemi değişikliği:** `colors.ts`'te bir renk değiştirirsen, tüm component'ler otomatik adapte olmalı. Eğer olmuyorsa, bir yerde hard-coded hex var demektir. Bul.

---

*Bu katman tamamlandığında, projenin görsel dili oluştu. Sonraki katmanlardan itibaren bu component'leri kullanacağız.*
