# 🚀 KATMAN 8: Play Store'a Yayın

> **Amaç:** Uygulamayı Google Play Store'da yayınlamak. İlk gerçek kullanıcılar için erişilebilir kılmak.
>
> **Süre:** 8-12 saat (yayın sonrası onay bekleme: 1-3 gün)
> **Zorluk:** ⭐⭐⭐⭐ (Teknik değil ama bürokratik, sabır gerektirir)

---

## 📋 Önkoşullar

- [ ] Katman 1-7 tamamlandı
- [ ] Uygulama telefonda tam test edildi
- [ ] Google Play Console hesabı onaylı
- [ ] App icon hazır (1024x1024 PNG)
- [ ] Privacy Policy URL'si canlıda (GitHub Pages vb.)
- [ ] Sentry error tracking aktif
- [ ] Production env variable'ları hazır

---

## 🎯 Bu Katmanın Hedefi

### Teknik Hazırlık
1. EAS Build production config
2. Uygulama imzalama (keystore)
3. Production env değişkenleri
4. Bundle size optimizasyonu
5. AAB (Android App Bundle) üretimi

### Play Console Hazırlık
1. Uygulama bilgileri (başlık, açıklama, kategori)
2. Store listing (screenshot, video, grafik)
3. İçerik derecelendirmesi
4. Gizlilik politikası
5. Veri güvenliği formu
6. Fiyatlandırma ve ülkeler
7. In-app products (premium abonelik)

### Yayın Stratejisi
1. Internal testing track (kendi)
2. Closed testing track (10-100 beta kullanıcı)
3. Open testing (daha geniş kitle, opsiyonel)
4. Production release (tam yayın)

---

## 🚀 Claude Code'a Verilecek Prompt

```
Selam! Katman 8: Play Store Yayını.

Önkoşullar:
- Katman 1-7 tamam
- EAS CLI kurulu (npm install -g eas-cli)
- Expo hesabıyla eas login yapılmış
- Play Console hesabı onaylı

CLAUDE.md'yi oku.

BU OTURUM KAPSAMI:
Uygulamayı production build'e hazırlama + Play Console setup.

YAPILACAKLAR:

A. EAS Build Konfigürasyonu
1. eas.json oluştur:
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "android": { "buildType": "apk" }
       },
       "production": {
         "android": { "buildType": "app-bundle" }
       }
     },
     "submit": {
       "production": { ... }
     }
   }

2. app.json güncellemesi:
   - name: "Ehliyet Akademi"
   - slug: "ehliyet-akademi"
   - version: "1.0.0"
   - android:
     * package: "com.seninadin.ehliyetakademi"
     * versionCode: 1
     * permissions: [INTERNET, ACCESS_NETWORK_STATE]
     * adaptiveIcon: foreground + background
   - plugins: react-native-google-mobile-ads config

3. App icon ve splash screen:
   - assets/icon.png (1024x1024)
   - assets/adaptive-icon.png (1024x1024)
   - assets/splash.png (1284x2778)
   - expo-splash-screen config

B. Production Environment
4. Production reklam ID'leri (AdMob'dan al):
   - Banner: ca-app-pub-XXXXX/XXXXX
   - Interstitial: ca-app-pub-XXXXX/XXXXX
   - Rewarded: ca-app-pub-XXXXX/XXXXX

5. EAS Secrets (Dashboard'dan):
   - EXPO_PUBLIC_SUPABASE_URL
   - EXPO_PUBLIC_SUPABASE_ANON_KEY
   - EXPO_PUBLIC_ADMOB_APP_ID
   - EXPO_PUBLIC_ADMOB_BANNER_ID
   - EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID
   - EXPO_PUBLIC_ADMOB_REWARDED_ID
   - EXPO_PUBLIC_REVENUECAT_KEY_ANDROID
   - EXPO_PUBLIC_POSTHOG_API_KEY
   - EXPO_PUBLIC_SENTRY_DSN

C. Test Build (Internal)
6. İlk build:
   eas build --profile preview --platform android
   
   Bu APK'yı telefonuna indir, final test yap.

7. Production build:
   eas build --profile production --platform android
   
   .aab (App Bundle) üretir.

D. Bundle Optimizasyonu
8. Hermes engine aktif mi kontrol et (performans için)
9. Bundle analyzer ile büyüklük kontrolü:
   npx expo-doctor
   
10. Gereksiz paketleri kaldır
11. Images/fonts optimize
12. Hedef: APK < 30MB, AAB < 50MB

E. Play Console Kurulum
13. CLAUDE_PLAY_CONSOLE_CHECKLIST.md oluştur:
    Kullanıcının manuel yapacakları (ben direkt console'a giremem):
    
    1. App Oluşturma
       - Play Console → All apps → Create app
       - Name: Ehliyet Akademi
       - Default language: Turkish (tr)
       - App or game: App
       - Free or paid: Free
       - Declarations: hepsini işaretle (true)
    
    2. Store Listing
       - Short description (80 char): "Yapay zeka destekli ehliyet sınavı hazırlık uygulaması"
       - Full description (4000 char): detaylı metin aşağıda
       - App icon: 512x512 PNG
       - Feature graphic: 1024x500 PNG
       - Screenshots: minimum 2 (en az 320px, en fazla 3840px)
         * Önerilen: 4-6 screenshot
         * Telefon + tablet için ayrı
       - Video (opsiyonel ama önerilir): YouTube link
    
    3. Main Store Listing
       - App category: Education
       - Tags: eğitim, ehliyet, sınav, trafik
       - Contact email
       - Website URL
       - Privacy policy URL (GitHub Pages)
    
    4. Content Rating
       - Questionnaire doldur
       - Eğitim uygulaması, içerik temiz → PEGI 3 veya 7
    
    5. Target Audience
       - Age: 13-17, 18+ (ehliyet başlangıç yaşı)
    
    6. Data Safety
       - Toplanan veriler: Email, kullanım istatistikleri
       - Paylaşılan veriler: Yok (3rd party SDK'lar kendi bildirimlerini yapar)
       - Şifreleme: Evet (in-transit + at-rest)
       - Veri silme yöntemi: App içinden
    
    7. News App declaration: Hayır
    8. COVID-19 contact tracing: Hayır
    9. Government app declaration: Hayır
    
    10. In-app products (RevenueCat ile birlikte çalışacak)
        Products kısmından oluştur:
        - ehliyet_monthly_49
        - ehliyet_quarterly_119
        - ehliyet_yearly_299
        Her biri için açıklama, fiyat, ülke seçimi
    
    11. Pricing & Distribution
        - Countries: Türkiye + globaller
        - Contains ads: Evet
        - Content rating: (yukarıda aldık)
    
    12. App Content
        - Privacy policy
        - Access: instructions (Supabase giriş nasıl)
        - Ads: Evet (AdMob)
        - News: Hayır
        - COVID-19: Hayır

F. İlk Release
14. Testing tracks:
    - Internal testing: 10 kişilik (aile, arkadaş, muhasebeci)
    - Closed testing: 50-100 kişi (ön kayıt + beta davet)
    - Production: genel yayın
    
15. Release planı:
    - Gün 1: Internal build, kendim test et
    - Gün 3: Internal testing, 3 kişiye göster
    - Gün 5-7: Closed testing, beta grubuna aç
    - Gün 10-14: Production release
    
16. Release notes ("What's new"):
    Versiyon 1.0.0 için:
    "İlk sürüm! 🎉
    - 500+ MEB onaylı soru
    - 4 kategoride detaylı pratik
    - Gerçek sınav formatında deneme
    - AI destekli açıklama
    - Kişisel ilerleme takibi
    
    Geri bildirim için: destek@senindomain.com"

G. Submission Script (opsiyonel)
17. eas submit konfigürasyonu
    - serviceAccountKeyPath: Play Console API key JSON
    - track: "internal" (ilk seferinde)

KULLANICININ MANUEL YAPACAKLARI:
Ben (Claude Code) Play Console'a giremem. Bu yüzden:
- Sana talimatlarla liste vereceğim
- Sen manuel yapacaksın
- Her adımda screenshot al, bana göster (problem varsa)

PLAN MODUNDA BAŞLA:
- Önce EAS config
- Sonra assets hazırlama
- Sonra build (10-15 dk sürer)
- Sonra Play Console adımları (manuel, detaylı rehber)
```

---

## 📝 Store Listing İçerikleri

### Kısa Açıklama (80 karakter)

```
AI destekli ehliyet sınavı hazırlık — sınırsız pratik, kişisel program.
```

### Tam Açıklama (4000 karakter limit, 2500 önerilir)

```
🚗 Ehliyet Akademi — En Akıllı Sınav Hazırlık Uygulaması

MEB MTSK ehliyet sınavına mı hazırlanıyorsun? Ehliyet Akademi sana en kısa 
sürede ehliyet almanın yolunu açıyor.

✨ NEDEN EHLİYET AKADEMİ?

📚 1000+ Güncel Soru
2026 MEB müfredatına %100 uygun, uzmanlar tarafından hazırlanmış sorular.
• İlk Yardım
• Trafik Kuralları  
• Motor Bilgisi
• Trafik Adabı

🤖 Yapay Zeka Destekli Açıklama
Yanlış yaptığın her soruyu yapay zeka sana özel açıklar. Sadece doğruyu 
değil, neden yanlış olduğunu da öğren.

🎯 Gerçek Sınav Formatı
50 soru, 45 dakika, tıpkı MEB sınavı gibi. Deneme sınavlarıyla gerçek 
sınava alış.

📊 Kişisel İstatistik
• Hangi konularda zayıfsın?
• Hangi günler en iyi performans gösterdin?
• Sınav tarihinle birlikte günlük program

🏆 Günlük Hedef Sistemi
Streak (seri) tut, günlük soru hedefini yakalat, motivasyonu koruyarak ilerle.

🎓 Kime Uygun?
• Ehliyete yeni başlayanlar
• Yeniden denemek isteyenler  
• Sürücü kursu öğrencileri
• Tüm ehliyet sınıfları (B, A, D...)

💎 ÜCRETSIZ + PREMIUM

Ücretsiz olarak:
• Günlük 20 soru
• 3 AI açıklama
• 1 deneme sınavı
• Temel istatistik

Premium ile:
• Sınırsız soru
• Sınırsız AI açıklama
• Sınırsız sınav
• Reklamsız deneyim
• Detaylı raporlar
• Kişisel çalışma programı

Premium fiyatları:
• Aylık: 49 TL
• 3 aylık: 119 TL (avantajlı)
• Yıllık: 299 TL (%49 tasarruf)

🔒 Güvenli
Verilerin şifreli saklanır, asla paylaşılmaz. KVKK uyumlu.

📞 İletişim
Sorun? Öneri? destek@ehliyetakademi.com

İyi çalışmalar, dikkatli sürüşler! 🚗💨
```

### Tags (Kategori içi keyword'ler)

```
ehliyet, sınav, trafik, mtsk, sürücü kursu, B ehliyeti, A ehliyeti,
ilk yardım, motor, eğitim, test, soru çözme, yapay zeka, AI
```

---

## 🎨 Ekran Görüntüsü Stratejisi

### Gerekli Screenshot'lar (min 2, max 8)

**1. Ana Sayfa** — "Kişisel Hoş Geldin"
- Streak, ilerleme, kategoriler görünür
- Genel cazip görünüm

**2. Soru Çözme** — "Akıllı Pratik"
- Bir soru + şıklar
- Doğru cevap tıklanmış, yeşil
- "Açıklama" butonu vurgulu

**3. AI Açıklama** — "Yapay Zeka Açıklıyor"
- Bottom sheet açık
- AI cevabı görünüyor
- "Yapay zeka ile detaylı anla" başlığı

**4. Deneme Sınavı** — "Gerçek Sınav Formatında"
- Timer + 15/50 soru sayacı
- Profesyonel görünüm

**5. Sonuç** — "Başarı Anı"
- Büyük "GEÇTİN! 🎉"
- Puan, kategori breakdown
- Confetti efekti

**6. İstatistik** — "İlerlemen Görselleştirilmiş"
- Chart'lar, yüzdeler
- AI analiz kartı

**7. Paywall** — "Premium Değeri"
- Özellik listesi
- 3 plan kartı
- Çekici CTA

**8. Karanlık Mod** — Aynı ekranların karanlık versiyonu

### Screenshot Araçları

- **Samsung/Pixel cihazdan:** Power + Volume Down tuşu ile
- **Figma ile mockup:** https://mockuphone.com
- **PreviewedApp:** https://previewed.app

### Özellikler
- 1080x1920 minimum (Full HD portrait)
- Cihaz çerçevesi koymak opsiyonel ama şık
- Her screenshot'a kısa caption ekle (görsel üstünde)

---

## 🎬 Feature Graphic (1024x500)

Play Store'da uygulama sayfasının üstünde görünen büyük banner.

**Tasarım İpuçları:**
- App logo sol tarafta
- Ana mesaj: "Sınavı Geçmenin En Akıllı Yolu"
- Renk: Ana brand rengi (mavi gradient)
- Screenshot parçası arka planda (hafif)
- Canva template: "Google Play Feature Graphic"

---

## 🎥 Promo Video (Opsiyonel, önerilir)

- 30-60 saniye
- YouTube'a yükle (public)
- Play Console'a YouTube link koy
- İçerik:
  - 0-5s: App logo + slogan
  - 5-15s: Ana özellikleri göster (soru çözme, AI)
  - 15-25s: Sınav ve sonuç
  - 25-30s: "Hemen İndir" CTA

**Araçlar:**
- Canva Video (kolay)
- CapCut (mobil)
- Rotato (app preview)

---

## 📋 Play Console Adım Adım Checklist

### Aşama 1: Uygulama Oluşturma (10 dk)

1. [ ] Play Console'a gir
2. [ ] "Create app" tıkla
3. [ ] Name: "Ehliyet Akademi"
4. [ ] Default language: Türkçe
5. [ ] App (not game)
6. [ ] Free
7. [ ] Declarations (hepsini onayla)
8. [ ] Create

### Aşama 2: Store Listing (30 dk)

1. [ ] App details
2. [ ] Graphics assets (icon, feature graphic, screenshots)
3. [ ] Categorization (Education)
4. [ ] Contact details
5. [ ] Privacy policy URL

### Aşama 3: App Content (20 dk)

1. [ ] Privacy policy
2. [ ] App access (test credentials gerekebilir)
3. [ ] Ads (Yes, contains ads)
4. [ ] Content rating (questionnaire)
5. [ ] Target audience (13-17, 18+)
6. [ ] News app (No)
7. [ ] COVID-19 tracking (No)
8. [ ] Data safety (detaylı form)
9. [ ] Government app (No)
10. [ ] Financial features (No)
11. [ ] Health (No)
12. [ ] Actors (No)

### Aşama 4: In-app Products (15 dk)

1. [ ] Monetize → Products → In-app products
2. [ ] Create product: ehliyet_monthly_49
3. [ ] Create product: ehliyet_quarterly_119
4. [ ] Create product: ehliyet_yearly_299
5. [ ] Each: pricing, description, status=active

### Aşama 5: Testing (ilk yayın)

1. [ ] Testing → Internal testing
2. [ ] Create new release
3. [ ] Upload AAB (EAS'tan geldi)
4. [ ] Release notes (ne yeni?)
5. [ ] Add testers (email listesi)
6. [ ] Review + roll out

### Aşama 6: Production Release

Internal test 1 hafta geçtikten sonra:

1. [ ] Production → Create release
2. [ ] Upload production AAB
3. [ ] Release notes (kullanıcıya görünür)
4. [ ] Countries: Turkey (başta, sonra genişlet)
5. [ ] Review → Rollout 20% (gradual)
6. [ ] 1 hafta sonra: 50%, 100%

---

## 📱 RevenueCat + Play Console Senkronu

**Önemli sıralama:**

1. Play Console'da product oluştur
2. Product "Active" duruma gel (inceleme 2-24 saat)
3. RevenueCat dashboard → Products → Import from Google Play
4. RevenueCat'te entitlement tanımla: "premium"
5. Products'ı entitlement'a bağla
6. Offerings oluştur: "default"
7. Package'lar oluştur:
   - Monthly → ehliyet_monthly_49
   - Quarterly → ehliyet_quarterly_119
   - Annual → ehliyet_yearly_299

---

## ✅ Yayın Öncesi Final Checklist

### Teknik
- [ ] Production build hatasız başarılı
- [ ] Bundle size kabul edilebilir (< 50MB)
- [ ] Sentry hata takibi aktif
- [ ] Analytics kurulu
- [ ] Tüm env variable'lar production değerler
- [ ] Test ad ID'leri production ID'lerle değiştirildi
- [ ] Test keystore değil production keystore kullanıldı

### İçerik
- [ ] App icon cihazda güzel görünüyor
- [ ] Splash screen düzgün
- [ ] Store screenshot'lar çekildi (6-8 adet)
- [ ] Feature graphic hazır
- [ ] Store description yazıldı
- [ ] Release notes hazır

### Yasal
- [ ] Privacy policy yayında, link çalışıyor
- [ ] Terms of service yayında
- [ ] KVKK aydınlatma metni hazır
- [ ] Veri silme yöntemi uygulamada mevcut (profil ayarlar)

### Test
- [ ] 3-5 farklı telefonda test (farklı Android sürümleri)
- [ ] Slow network'te test (3G simulation)
- [ ] Offline modu test
- [ ] Satın alma test (sandbox)
- [ ] Reklam yüklenme test
- [ ] AI cevap test

### İş
- [ ] Destek email kurulu (destek@...)
- [ ] Social media hesapları (opsiyonel)
- [ ] Landing page (opsiyonel ama önerilir)
- [ ] Launch announcement planı

---

## 🐛 Red/Rejection Sebepleri (Önlem)

### 1. Metadata
- Başlıkta "best" "#1" gibi superlative iddialar → YAPMA
- Rakip isimlerini kullanmak → YASAK
- Yanıltıcı screenshot → YASAK

### 2. Content
- Kullanıcı verilerini düzgün deklare etmemek → Data Safety dikkat
- Privacy policy eksik → Olmazsa olmaz
- Teste uygun test kullanıcı vermemek → App access'ten ekle

### 3. Functionality
- Crash eden uygulama → Pre-launch report incele
- Yavaş açılan → Optimize et
- Permissions abuse → Sadece gerekli izinleri iste

### 4. In-app purchases
- RevenueCat integrated yanlışsa satın alma crash eder → Önce test et
- Fiyat yazılımı vs Play Console farklı → Tek source (Play Console) olsun

---

## 🎯 Yayın Sonrası İlk Hafta

### Gün 1 (Launch günü)
- [ ] Uygulama canlı, arkadaşlarına haber ver
- [ ] Sosyal medya paylaşım (varsa)
- [ ] İlk 10 kullanıcı için support yanıt süresi < 24 saat

### Gün 2-7
- [ ] Crash report takibi (Sentry + Play Console)
- [ ] Kullanıcı feedback'lerini oku
- [ ] Hızlı fix'ler için patch (1.0.1) hazırla
- [ ] Review'ları yanıtla (özellikle negatif olanlar)

### Hafta 2-4
- [ ] ASO (App Store Optimization) — keyword'leri izle
- [ ] İlk analytics raporu çıkar
- [ ] Conversion rate (install to signup to premium)
- [ ] Sonraki versiyon (1.1) için plan

---

## 💡 İpuçları

**İlk review çok önemli:** İlk 50 review uygulamanın uzun vadeli kaderini belirler. Bu yüzden:
- Arkadaş/aile yerine beta kullanıcılardan organik review iste
- Sorun çözüldüğünde "review güncelleyebilir misin" de
- 1-2 yıldızlı review'lara PROFESYONEL yanıt ver (tartışma)

**Sabır gerekli:** Play Store onayı bazen 1 hafta sürer. İlk versiyonda daha da. İkinci versiyonda genelde otomatik.

**Crash rate kritik:** Play Console "Android vitals" bölümünde crash rate %0.5 altında tutman lazım. Üstüne çıkarsa Play Store görünürlüğü düşer.

**ASO araçları:**
- App Annie / data.ai
- Sensor Tower (ücretli)
- AppTweak
- Google Play Console'un kendi analytics'i

**Launch marketing:**
- Reddit (r/istanbul, r/turkiye kendini tanıt)
- Twitter/X paylaşım
- Sürücü kursları ile temas (bayrakdar)
- Ehliyet forumlarında belirt (spam olmadan)

---

## 🎉 Tebrikler!

Buraya geldiysen, uygulamanı geliştirip yayınladın demektir. **Bu büyük bir başarı.**

**Bu sadece başlangıç.** Gerçek iş yayından sonra başlar:
- Kullanıcıları dinlemek
- Sürekli iyileştirmek
- Yeni özellikler eklemek
- Pazarlama yapmak
- Topluluk inşa etmek

**İlk ayda beklenti:**
- 100-500 indirme (organik)
- 10-20 premium kullanıcı (%2-5 conversion)
- Birkaç negatif review (normal)
- Birkaç bug raporu (düzelt)

**3-6 ay sonra:**
- Aylık 500-2000 TL arası gelir (iyi optimizasyon ile)
- Kararlı user base
- Feature request listesi uzun
- V2.0 planı netleşmiş

---

## 📚 Sonraki Adımlar

Bu doküman seti burada biter. Ama uygulama hayat döngüsü devam eder:

1. **V1.x güncellemeleri** (bug fix, polish)
2. **V2.0 planı:**
   - iOS versiyonu
   - Yeni modlar (sürücü kursu soruları, haftalık turnuva)
   - Sosyal özellikler (arkadaşlarla yarış)
3. **İçerik genişletme:**
   - KPSS, YKS, ALES gibi diğer sınavlar
   - Aynı mimariyle farklı uygulamalar
4. **Marketing otomasyon:**
   - Email kampanyaları
   - Push notification stratejisi
   - İçerik pazarlama (blog, YouTube)

---

*Bu katman tamamlandığında, hayal ettiğin uygulama gerçek oldu. İnsanlar onu kullanıyor, belki bazıları bu uygulama sayesinde ehliyetini alıyor. Bu çok değerli bir şey. Kutla!* 🎉
