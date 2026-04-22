# 💰 KATMAN 6: Monetizasyon (Reklam + Premium)

> **Amaç:** Reklam gösterimi ve premium üyelik sistemi kurmak. Uygulamadan gelir elde edilebilir hale getirmek.
>
> **Süre:** 6-10 saat (2-3 oturum)
> **Zorluk:** ⭐⭐⭐⭐ (Üçüncü taraf SDK entegrasyonu + test süreci)

---

## 📋 Önkoşullar

- [ ] Katman 1-5 tamamlandı
- [ ] Uygulama telefonda çalışıyor, quiz motoru test edildi
- [ ] AdMob hesabı açık
- [ ] RevenueCat hesabı açık
- [ ] **Önemli:** Google Play Console hesabı onaylandı

---

## 🎯 Bu Katmanın Hedefi

### Reklam Sistemi
1. AdMob SDK entegrasyonu
2. Banner reklam (ana ekranın altında)
3. Geçiş reklamı (quiz sonu, sınav sonu)
4. Ödüllü reklam (ekstra AI açıklama / ekstra soru)
5. Kullanıcı rızası (GDPR/KVKK)

### Premium Üyelik
1. RevenueCat SDK entegrasyonu
2. Üyelik planları (aylık, 3 aylık, yıllık)
3. Paywall ekranı (tasarım + ikna)
4. Ücretsiz/premium feature ayrımı
5. Restore purchases
6. Abonelik yönetimi

---

## 📦 Yüklenecek Paketler

```bash
# AdMob (expo-ads-admob DEPRECATED!)
npx expo install react-native-google-mobile-ads

# RevenueCat
npm install react-native-purchases

# EAS Build gerekli (native kod var, Expo Go'da çalışmaz)
```

**⚠️ Kritik:** Bu katmandan itibaren **Expo Go'da çalışmayacak.** EAS Development Build kullanman gerekecek:

```bash
eas build --profile development --platform android
```

---

## 🚀 Claude Code'a Verilecek Prompt (Bölüm 1: Reklamlar)

```
Selam! Katman 6: Monetizasyon - Önce Reklam Sistemi.

Önkoşullar:
- Katman 5 tamam (quiz motoru çalışıyor)
- AdMob hesabı açık
- EAS Development Build kuruldu (Expo Go'da olmaz)

CLAUDE.md'yi oku.

⚠️ KRİTİK UYARI: 
- Geliştirme boyunca SADECE TEST reklam ID'leri kullanılacak
- Gerçek reklam ID'leri sadece production build'te
- Test ID: "ca-app-pub-3940256099942544/XXXXX" (Google'ın test ID'leri)

BU OTURUM KAPSAMI:

1. AdMob SDK kurulumu
2. app.json konfigürasyonu
3. Consent flow (GDPR/KVKK)
4. Banner reklam component
5. Interstitial (geçiş) reklam helper
6. Rewarded (ödüllü) reklam helper
7. Entegrasyon noktaları

YAPILACAKLAR:

A. Yapılandırma
1. app.json eklentisi:
   "plugins": [
     [
       "react-native-google-mobile-ads",
       {
         "androidAppId": "ca-app-pub-3940256099942544~3347511713",
         "userTrackingUsageDescription": "..."
       }
     ]
   ]

2. src/constants/admob.ts
   - Test ID'ler (development için)
   - Production ID'ler (EAS secrets'ta olacak, sonra)
   - Unit ID'ler: banner, interstitial, rewarded

B. Consent (İzin)
3. src/lib/ads-consent.ts
   - AdMob UMP (User Messaging Platform)
   - requestConsent()
   - canShowAds()
   - İlk açılışta iste

4. app/onboarding.tsx güncelleme:
   - Son slayt öncesi consent iste
   - İzin vermezse de uygulama çalışsın (reklamsız)

C. Component'ler
5. src/components/ads/AdBanner.tsx
   - BannerAd component wrapper
   - Premium ise gösterme
   - Error handling
   - Boyut: ADAPTIVE_BANNER (cihaza uyumlu)

6. src/lib/ads-interstitial.ts
   - InterstitialAd singleton
   - preloadInterstitial()
   - showInterstitialIfReady()
   - Quiz sonu, sınav sonu gibi doğal duraklar

7. src/lib/ads-rewarded.ts
   - RewardedAd singleton
   - showRewardedAd() → Promise<boolean>
   - Ödül: ekstra soru hakkı, ekstra AI açıklama
   - Callback: reklam izlenirse ödül ver

D. Entegrasyonlar
8. app/(tabs)/index.tsx — alt kısma AdBanner
9. app/quiz/result.tsx — soru sonu interstitial
10. app/quiz/exam/result.tsx — sınav sonu interstitial
11. src/components/modals/DailyLimitModal.tsx güncelleme:
    - "Reklam izleyerek +5 soru kazan" butonu
    - Rewarded ad tetikle, başarılıysa limit artır

E. Premium Kontrol
12. src/hooks/usePremium.ts
    - isPremium: boolean (şimdilik hep false, sonra RevenueCat'ten)
    - Reklam göster kararını bu hook'tan kontrol

KURALLAR:
- Premium kullanıcıya REKLAM GÖSTERME
- Rewarded ad vermezse kullanıcıyı cezalandırma (skip opsiyonu)
- Interstitial ağırlığı: 3 quiz oturumunda 1 kez max
- Banner ekran alanı çalmasın (scroll'un dışında tut)
- Reklam yüklenmemesi durumunda crash olmasın

TEST:
- Geliştirme sırasında test reklamı görünmeli
- Banner otomatik yüklensin
- Interstitial yüklenmeden göstermeye çalışılmasın

PLAN MODUNDA BAŞLA.
```

---

## 🚀 Claude Code'a Verilecek Prompt (Bölüm 2: Premium Üyelik)

Yeni oturum:

```
Selam! Katman 6 devamı: Premium Üyelik (RevenueCat).

Önkoşullar:
- Katman 6/Bölüm 1 tamam (reklamlar çalışıyor)
- RevenueCat hesabı açık, Android app eklendi
- Play Console'da in-app product oluşturulması gerekecek (manuel)

CLAUDE.md'yi oku.

⚠️ ÖNEMLİ: Play Console product'ları onaylanana kadar test modda çalışacağız.
RevenueCat sandbox kullanıcıları ile test edeceğiz.

BU OTURUM KAPSAMI:

1. RevenueCat SDK kurulumu
2. Ürün yapılandırması
3. Paywall ekranı
4. Satın alma flow'u
5. Feature flag (premium vs free)
6. Restore purchases

YAPILACAKLAR:

A. Yapılandırma
1. src/lib/revenuecat.ts
   - Purchases.configure({ apiKey })
   - setLogLevel VERBOSE (dev için)
   - Login/logout user events

2. Ürün tanımları (src/constants/products.ts)
   Türkiye:
   - monthly: 'ehliyet_monthly_49' → 49 TL/ay
   - quarterly: 'ehliyet_quarterly_119' → 119 TL/3 ay
   - yearly: 'ehliyet_yearly_299' → 299 TL/yıl
   Global:
   - monthly_usd: $3.99
   - yearly_usd: $24.99

B. Store Hook'ları
3. src/stores/premiumStore.ts (Zustand)
   - isPremium: boolean
   - expirationDate: Date | null
   - activeProduct: string | null
   - setCustomerInfo(info)

4. src/hooks/usePremium.ts (güncelleme)
   - RevenueCat'ten gerçek veriye bağla
   - checkPremiumStatus() - her app açılışta
   - getOfferings() - sunulan planları getir

C. Paywall Ekranı
5. app/paywall.tsx
   - Arka plan: gradient (blue)
   - Büyük başlık: "Premium'a Geç, Sınavı Zamanında Geçir 🎯"
   - Özellik listesi (✓ check ikonları):
     * "Sınırsız soru çözümü"
     * "Sınırsız AI açıklama"
     * "Reklam yok"
     * "Sınırsız deneme sınavı"
     * "Özel sınav tarihi programı"
     * "Detaylı istatistik raporları"
   - 3 paket kartı:
     * Yıllık (en çok tercih edilen) - büyük, vurgu rengi
     * 3 aylık (orta)
     * Aylık (küçük)
   - Her kart: fiyat, taksit bilgisi, "günlük maliyet" hesabı
   - Aylık = 1.63 TL/gün gibi
   - "Satın Al" butonu
   - "Restore Purchases" (küçük link)
   - "İptal istediğin an" güvence cümlesi
   - Terms + Privacy linkler

6. src/components/paywall/PlanCard.tsx
   - 3 plan için reusable
   - Popüler badge (yıllık için)
   - Discount badge (% tasarruf göster)

7. src/components/paywall/FeatureList.tsx
   - Her satır: ikon + metin
   - Animasyon (sıra sıra gir)

D. Satın Alma Flow
8. src/lib/purchase.ts
   - purchasePackage(pkg)
   - restorePurchases()
   - Error handling: user cancelled, payment failed
   - Başarıda: premium store güncellle, toast göster

E. Feature Gating
9. src/lib/feature-gate.ts
   - canAccessFeature(feature: string)
   - free features ne, premium features ne liste
   - Örnek:
     * 'ai_explanation': free=3/day, premium=unlimited
     * 'mock_exam': free=1/day, premium=unlimited
     * 'question_limit': free=20/day, premium=unlimited

10. Uygulamanın çeşitli yerlerinde:
    - Günlük limite yaklaşınca: "Sınırsız için Premium" hint
    - AI açıklama free hakkı bitince: paywall modal
    - 2. deneme sınavı denenince: paywall modal

F. RevenueCat Dashboard Setup (manual adımlar)
11. CLAUDE_INSTRUCTIONS.md:
    Kullanıcının manuel yapacakları:
    - Play Console → In-app products oluştur
    - RevenueCat → Products ekle
    - Entitlements tanımla: "premium"
    - Offerings oluştur: "default" offering
    - Package'ları offer'a bağla

PAYWALL TASARIM PRENSİPLERİ:
- İlk 3 saniyede "bu ne?" anlaşılmalı
- Faydalar (özellikler değil) vurgulanmalı
- Fiyat sıkıştırılmamalı (günlük maliyet mantıklı)
- "Şimdi al" acele ettirme DEĞIL, net sun
- İptal güvencesi belirt (güven)
- 2-3 farklı fiyat (kapı açık kalsın)

KURALLAR:
- Test purchases ile flow'u doğrula
- Sandbox user oluştur, deneme satın al
- Restore purchases her ekranda erişilebilir (profil ayarlarında)
- Offline durumda premium hâlâ aktif görünmeli (cache)

PLAN MODUNDA BAŞLA.
```

---

## 💰 Monetizasyon Stratejisi (Referans)

### Ücretsiz Plan
- Günlük 20 soru
- Günlük 3 AI açıklama
- Haftalık 1 deneme sınavı
- Banner reklam gösterilir
- Quiz/sınav sonu geçiş reklamı
- Temel istatistik

### Premium Plan
- **Aylık:** 49 TL (~$1.50)
- **3 aylık:** 119 TL (~$3.60) — 119/3 = 39.6 TL/ay, %19 tasarruf
- **Yıllık:** 299 TL (~$9.00) — 299/12 = 24.9 TL/ay, %49 tasarruf
- Sınırsız soru + AI açıklama
- Sınırsız deneme sınavı
- Reklamsız
- Detaylı istatistik + rapor
- Sınav tarihi programı (Katman 7'de)
- Öncelikli destek

### Beklenen Dönüşüm
- Sektör ortalaması: %2-5 free → premium
- İyi bir uygulama: %5-10
- Hedef (gerçekçi): %3 (ilk ay)
- Ömür boyu değer (LTV): ortalama 3-6 ay kullanım = 150-300 TL

---

## 🎨 Paywall Mockup (Referans Yapı)

```
╔═══════════════════════════════╗
║  ← [kapat]                    ║
║                               ║
║         🎯                    ║
║   Premium'a Geç               ║
║   Sınavı Geçir                ║
║                               ║
║   ✓ Sınırsız soru             ║
║   ✓ Sınırsız AI açıklama      ║
║   ✓ Reklamsız deneyim         ║
║   ✓ Detaylı raporlar          ║
║   ✓ Sınav programı            ║
║                               ║
║  ┌──────────────────────────┐ ║
║  │   🔥 EN POPÜLER          │ ║
║  │   Yıllık                 │ ║
║  │   299 TL/yıl             │ ║
║  │   ≈ 24.9 TL/ay (%49 ↓)   │ ║
║  └──────────────────────────┘ ║
║                               ║
║  ┌──────────────────────────┐ ║
║  │   3 Aylık                │ ║
║  │   119 TL                 │ ║
║  │   ≈ 39.6 TL/ay           │ ║
║  └──────────────────────────┘ ║
║                               ║
║  ┌──────────────────────────┐ ║
║  │   Aylık      49 TL/ay    │ ║
║  └──────────────────────────┘ ║
║                               ║
║   [    Satın Al    ]          ║
║                               ║
║   İstediğin an iptal          ║
║   Satın alımı geri yükle      ║
║                               ║
║   [Kullanım Şartları] [KVKK]  ║
╚═══════════════════════════════╝
```

---

## 🧪 Test Reklam ID'leri (Google Standart)

Bunlar geliştirme boyunca kullanılacak, production'da değişecek:

```typescript
export const TEST_AD_IDS = {
  android: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
};
```

---

## ✅ Oturum Sonu Kontrol Listesi

### Reklam
- [ ] Banner ana sayfada görünüyor (test reklamı)
- [ ] Quiz sonunda interstitial 3 kezden birinde açılıyor
- [ ] Rewarded ad izlenince soru limiti +5 artıyor
- [ ] Consent flow çalışıyor (ilk açılış)
- [ ] Premium kullanıcıya reklam gösterilmiyor
- [ ] Reklam yüklenemezse crash olmuyor

### Premium
- [ ] RevenueCat SDK initialize oluyor
- [ ] Paywall ekranı açılıyor (3 plan görünüyor)
- [ ] Sandbox user ile test satın alma başarılı
- [ ] Satın alım sonrası premium aktifleşiyor
- [ ] Restore purchases çalışıyor
- [ ] Premium kullanıcının limitleri kaldırılmış
- [ ] Abonelik expire olunca otomatik free'ye düşüyor

### UX
- [ ] Paywall tasarımı çekici
- [ ] Plan kartları net (fiyat, tasarruf)
- [ ] Feature gating doğal yerlerde (limit hit'inde)
- [ ] "Hemen premium!" dayatması yok
- [ ] İptal süreci kolay (profilden)

### Güvenlik
- [ ] Premium durumu client-side bypass edilemiyor
- [ ] RevenueCat webhook aktif
- [ ] Test ID'ler production'a gitmeyecek (env'e ayrıldı)

---

## 🐛 Sık Sorunlar

### "Reklamlar görünmüyor"
- Test cihazı AdMob'da kayıtlı mı?
- Google Play Services telefonda güncel mi?
- Wait 30 sec — reklamlar yüklenme süresi olur

### "RevenueCat configure error"
- API key doğru mu (platform spesifik: Android/iOS)
- Package name app.json ile RevenueCat'te eşleşiyor mu
- Play Console'da internal test track aktif mi

### "Purchase failed — no product found"
- Play Console'da product oluşturuldu mu
- Product ID'ler eşleşiyor mu
- Tester hesabı eklenmiş mi
- App imzalanmış APK ile mi test ediyorsun

### "EAS Build hatası"
- `eas.json` doğru mu
- Credentials var mı (keystore)
- Expo versiyonu güncel mi

### "Rewarded ad ödülü düşmüyor"
- `onUserEarnedReward` callback kuruldu mu
- Reklam tam izlendi mi (kapatmadan)
- State güncellemesi async mi (await kullan)

---

## 🎯 Sıradaki Katman

Para akışı kuruldu! Şimdi farkyaratan özellik: AI.

1. Git commit + push
2. **`KATMAN_7_AI.md`** — Claude API entegrasyonu

---

## 💡 İpuçları

**Reklam dengesi önemli:**
- Çok az: para gelmez
- Çok çok: kullanıcı sinirlenir, 1 yıldız verir
- Orta yol: doğal duraklara koy (quiz sonu, sınav sonu)

**Paywall A/B testi:** İlk versiyon en basiti olsun. Sonra farklı fiyatlar, farklı mesajlarla deney yap.

**İlk 100 premium kullanıcı:** Onlarla iletişimde kal. Email, in-app survey. "Neden aldın?" "Neyi daha iyi yapabiliriz?" Altın değerinde feedback.

**İptal oranı düşük tutmak için:**
- Onboarding'i iyi yap
- İlk hafta değer gör
- Email serisi (haftalık ipucu)
- Dar ama sürekli iyileştirme

---

*Monetizasyon ilk ayda beklentinin altında gelebilir. Normal. Kullanıcı tabanı arttıkça, conversion rate optimize oldukça, gelir üstel büyür.*
