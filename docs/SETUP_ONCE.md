# 🎬 SETUP — Başlamadan Önce Tek Seferlik Kurulum

> **Bu dosyayı Claude Code ile yapmayacaksın.** Kendi başına, tarayıcı ve terminalde yapacaksın. Proje kodlamasına başlamadan önce bu checklist'i tamamlamalısın.
>
> **Tahmini süre:** 2-4 saat (hesap onayları bekleme dahil olabilir)

---

## ✅ Bölüm 1: Geliştirici Araçları Kurulumu

### 1.1 Node.js (zorunlu)

**Kontrol:** Terminalde `node --version` yaz. 20.x veya 22.x olmalı.

**Yoksa kur:**
- https://nodejs.org adresinden LTS sürümünü indir
- Kurduktan sonra terminali kapat, yeniden aç, `node --version` kontrol et

### 1.2 Git

**Kontrol:** `git --version`

**Yoksa:**
- https://git-scm.com/downloads
- Global kullanıcı ayarla:
```bash
git config --global user.name "Adın Soyadın"
git config --global user.email "email@adresin.com"
```

### 1.3 VS Code

**Kontrol:** Zaten kullanıyorsun sanırım.

**Gerekli eklentiler:**
- Claude Code (Anthropic)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar) veya TypeScript React Native snippets

### 1.4 Claude Code

**Kontrol:** VS Code'da Claude Code eklentisi kurulu mu?

**Aktif abonelik:** Claude Pro ($20/ay) minimum, karmaşık projeler için Max ($100-200/ay) önerilir.

### 1.5 Expo Go (Telefonunda)

**Android:** Play Store'dan "Expo Go" indir  
**iOS:** App Store'dan "Expo Go" indir

Bu uygulama ile geliştirme sırasında QR kod okutup test edeceksin.

### 1.6 Telefon Hazırlığı

- Android 8+ (Oreo) telefon gerekli, minimum
- **USB Debugging** aç (Geliştirici Seçenekleri → USB Hata Ayıklama)
- Geliştirici seçenekleri açmak için: Ayarlar → Telefon hakkında → Build numarası'na 7 kez tıkla

### 1.7 (Opsiyonel ama önerilir) Android Studio

Emulator için kurulum yapmak istersen:
- https://developer.android.com/studio
- Uzun kurulum süreci (~1 saat). Başlangıçta Expo Go yeterli, sonra kurabilirsin.

---

## 💼 Bölüm 2: Hizmet Hesapları

Aşağıdaki hesapları sırayla açacaksın. Her birinin **API key'ini veya config bilgilerini bir yerde not tut** (şifre yöneticisi idealde). Bunları Katman dosyalarında kullanacağız.

### 2.1 GitHub (zorunlu, ücretsiz)

**Amaç:** Kod versiyon kontrolü, yedek

**Adımlar:**
1. https://github.com adresine git, hesap aç (zaten varsa atla)
2. 2FA aktif et (güvenlik için zorunlu)
3. Yeni private repo oluştur: `ehliyet-akademi`
4. README ekleme, .gitignore ekleme, license ekleme — **hepsini işaretsiz bırak.** Lokalden push edeceğiz.

**Not et:**
- Repo URL: `https://github.com/KULLANICI/ehliyet-akademi.git`

### 2.2 Google Play Console (zorunlu, ücretli)

**Amaç:** Android uygulamayı yayınlamak

**Adımlar:**
1. https://play.google.com/console adresine git
2. Google hesabınla giriş yap
3. **25 USD tek seferlik ödeme** yap (kredi kartı gerekli)
4. Kimlik doğrulama (pasaport veya kimlik fotoğrafı yükle)
5. **Onay süresi: 1-3 gün** bekle

**Şahıs hesabı mı, tüzel kişi mi?**
- Başlangıçta **Bireysel (Individual)** seç. Sonra değiştirilebilir.
- Ticari kar etmeye başladığında (muhasebeci ile konuş) şirket kurup değiştirirsin.

**Not et:**
- Developer account name (uygulamaların yayıncı adı olarak görünecek)

### 2.3 Expo Hesabı (zorunlu, ücretsiz)

**Amaç:** EAS Build, OTA güncellemeler

**Adımlar:**
1. https://expo.dev adresine git
2. Sign up → email ile kayıt
3. Email doğrula
4. Terminalde oturum aç (sonradan yapacağız): `eas login`

**Not et:**
- Kullanıcı adı: `expo_username`

### 2.4 Supabase Hesabı (zorunlu, ücretsiz tier)

**Amaç:** Backend, veritabanı, auth

**Adımlar:**
1. https://supabase.com adresine git
2. GitHub ile giriş yap (en kolay)
3. **Yeni proje oluştur:**
   - Name: `ehliyet-akademi`
   - Database password: Güçlü bir şifre oluştur, **mutlaka not et**
   - Region: **Frankfurt (eu-central-1)** — Türkiye'ye en yakın
   - Pricing: Free tier
4. Proje hazır olana kadar 2-3 dakika bekle

**Ayarlardan al:**
- Settings → API → `Project URL` → kopyala
- Settings → API → `anon public` key → kopyala
- Settings → API → `service_role` key → **SADECE backend'de kullanılacak, asla client'ta değil**

**Not et:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (çok gizli)
- `DATABASE_PASSWORD`

### 2.5 Anthropic API Hesabı (zorunlu, ilk kullanımda ücretsiz kredi)

**Amaç:** Claude API ile AI açıklama özelliği

**Adımlar:**
1. https://console.anthropic.com adresine git
2. Hesap aç (email + Google)
3. Settings → API Keys → "Create Key"
4. Key adı: `ehliyet-akademi-prod`
5. Oluşan key'i **hemen kopyala** (bir daha göremezsin)

**İlk krediler:**
- Yeni hesaplara genellikle $5 ücretsiz kredi veriliyor
- Kredi bitince kredi kartı ile dolum gerekiyor
- Aylık limit belirle: Settings → Limits → "Monthly spend limit" → $50 başlangıç için uygun

**Not et:**
- `ANTHROPIC_API_KEY` (çok gizli)

### 2.6 RevenueCat Hesabı (zorunlu, ücretsiz)

**Amaç:** Abonelik yönetimi (Premium üyelik satışı)

**Adımlar:**
1. https://www.revenuecat.com adresine git
2. Sign up (GitHub veya email)
3. **Yeni proje oluştur:**
   - Project name: `Ehliyet Akademi`
4. **Android app ekle:**
   - App name: `Ehliyet Akademi (Android)`
   - Package name: `com.seninadin.ehliyetakademi` (tam adı daha sonra belirleyeceğiz)

**Not:** Play Console setup tamamlanmadan ürünleri oluşturamayız. Şimdilik sadece hesap aç, sonra döneceğiz.

**Not et:**
- `REVENUECAT_API_KEY_ANDROID` (sonra alacağız)

### 2.7 AdMob Hesabı (zorunlu, ücretsiz)

**Amaç:** Reklam gelirleri

**Adımlar:**
1. https://admob.google.com adresine git
2. Google hesabınla giriş yap
3. Payment information gir (para gelince ödeme için)
4. **Sonra** (uygulama Play Store'da aktif olunca) uygulama ekleyeceğiz

**Şimdilik yapmayacaklarımız:**
- Reklam birimi oluşturmak (Katman 6'da yapacağız)
- Gerçek reklam ID'si almak

### 2.8 PostHog Hesabı (önerilir, ücretsiz)

**Amaç:** Kullanıcı analitiği, funnel takibi

**Adımlar:**
1. https://posthog.com adresine git
2. Sign up
3. **EU Cloud** seç (GDPR uyumluluğu için)
4. Project oluştur: `Ehliyet Akademi`

**Not et:**
- `POSTHOG_API_KEY`
- `POSTHOG_HOST` (EU için: `https://eu.posthog.com`)

### 2.9 Sentry Hesabı (önerilir, ücretsiz)

**Amaç:** Hata takibi

**Adımlar:**
1. https://sentry.io adresine git
2. Sign up
3. Create Project → Platform: **React Native**
4. Project adı: `ehliyet-akademi`

**Not et:**
- `SENTRY_DSN`

---

## 🔐 Bölüm 3: Environment Variables Hazırlığı

Yukarıda not ettiğin tüm key'leri düzenli bir yerde tut. Proje başladığında `.env` dosyasına koyacaksın.

**Kopyalayıp doldur (not defterinde):**

```
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
DATABASE_PASSWORD=***

# Anthropic (SADECE Edge Function'da kullanılacak)
ANTHROPIC_API_KEY=sk-ant-xxxxx...

# RevenueCat (sonra alacağız)
REVENUECAT_API_KEY_ANDROID=

# PostHog
POSTHOG_API_KEY=phc_xxxxx...
POSTHOG_HOST=https://eu.posthog.com

# Sentry
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# AdMob (sonra alacağız)
ADMOB_ANDROID_APP_ID=
ADMOB_BANNER_ID=
ADMOB_INTERSTITIAL_ID=
```

**⚠️ Kritik güvenlik:**
- Bu key'leri **asla GitHub'a push ETME.**
- `.env` dosyası her zaman `.gitignore`'da olmalı.
- Ekran görüntüsü paylaşırken key'leri blur'la.
- Public repo açarsan bu key'ler sızar, hepsini yeniden üretmen gerekir.

---

## 📐 Bölüm 4: Tasarım Hazırlığı (Opsiyonel ama Önerilir)

### 4.1 App Icon

**Araçlar:**
- https://www.canva.com — ücretsiz, hızlı
- https://www.figma.com — profesyonel, ücretsiz
- https://icon.kitchen — app icon generator

**Gereksinimler:**
- 1024x1024 PNG, şeffaf arka plan VEYA tek renk
- Basit, tanınabilir, küçük boyutta net
- Dini veya siyasi simgeler kullanma (Play Store kısıtlaması)
- Fikirler: Araç direksiyonu, trafik işareti çerçevesi, ehliyet kartı stilize

### 4.2 Renk Paleti

Yapılan seçim (CLAUDE.md'de sabit):
- Birincil: Mavi `#2563EB`
- Doğru: Yeşil `#10B981`
- Yanlış: Kırmızı `#EF4444`
- Nötr: Gri tonlar

Değiştirmek istersen **şimdi** değiştir, sonradan tüm component'leri elden geçirmek zor.

### 4.3 Font Seçimi

**Önerilen:** Inter (Google Fonts)
- Türkçe karakterler tam destekli
- Okunaklı, modern
- Ücretsiz

Alternatif: Poppins (biraz daha yuvarlak), Manrope (daha geometrik)

---

## 📋 Bölüm 5: İçerik Hazırlığı (ÖNEMLİ)

### 5.1 Soru Bankası Kaynağı

Uygulamanın bel kemiği. Yasal olarak güvende kalmak kritik.

**Strateji (önerilen):**

**Yöntem A: AI ile orijinal soru üretimi (en güvenli)**
1. Claude/GPT'ye MEB müfredatına göre soru ürettir
2. Her soruyu bir uzman (sürücü kursu öğretmeni, ehliyet rehberi) kontrol ettir
3. **İlk parti hedef:** 500 soru (4 kategoriden ~125'er)

**Yöntem B: Kamu domain sorular (orta güven)**
1. MEB'in kendi e-sınav deneme soruları (kamuya açık)
2. Değiştirerek kullan — kelime sıralaması, sayı değerleri
3. Risk: Yine de bariz kopya olmamalı

**Yöntem C: Lisanslı içerik satın alma (en profesyonel)**
1. Bir sürücü kursu zinciri veya yayıncı ile anlaş
2. Aylık veya tek seferlik lisans
3. Maliyet: Pazarlık, genelde 3.000-10.000 TL

**⛔ Yapma:** Başka uygulamalardan veya sitelerden doğrudan kopyalama. DMCA takedown alırsın, hesabın banlanabilir.

### 5.2 Trafik İşareti Görselleri

**Kaynaklar:**
- Wikipedia Commons (CC BY-SA lisanslı, ticari kullanım OK)
- Karayolları Genel Müdürlüğü standart dosyaları (kamu bilgisi)
- Kendin SVG çizdirebilirsin (Claude'a çizdir)

**Önemli:** PTT, KGM gibi logolar içeren grafikler kullanma.

### 5.3 İlk 500 Soru Nasıl Üretilir?

**Adım 1:** Claude'a şu prompt'u ver (API veya Claude.ai'de):

```
MEB MTSK 2026 müfredatına uygun 25 adet orijinal ehliyet sınavı sorusu üret.
Kategori: [İLK YARDIM / TRAFİK / MOTOR / TRAFİK ADABI]

Her soru için:
- Soru metni (Türkçe, net, tek anlamlı)
- 4 şık (A, B, C, D)
- Doğru cevap (sadece bir şık)
- Açıklama (neden doğru olduğunu 2-3 cümleyle anlat)

Format: JSON
Zorluk dağılımı: 10 kolay, 10 orta, 5 zor.
Gerçek sınavdaki tarzı yansıt.
Belirsiz veya yoruma açık sorular YAPMA.
```

**Adım 2:** JSON çıktısını kaydet.

**Adım 3:** 20 kez tekrarla (her kategoriden 125 soru için).

**Adım 4:** Bir uzmana (sürücü kursu öğretmeni) kontrol ettir — içerik doğruluğu kritik.

**Süre:** 1-2 gün emek. Kitap halinde hazırla, Katman 3'te import edeceğiz.

---

## 📑 Bölüm 6: Yasal Hazırlık

### 6.1 Gizlilik Sözleşmesi

**Play Store için ZORUNLU.** Yayınlayacağın bir URL'de barınıyor olmalı.

**Kolay yol:**
1. https://www.termly.io veya https://app-privacy-policy-generator.firebaseapp.com
2. Ücretsiz generator'lardan Türkçe template al
3. İçerik şunları içermeli:
   - Hangi veriler toplanıyor (email, kullanım istatistikleri, cihaz bilgisi)
   - Neden (hizmet sağlama, analiz, reklam)
   - Kimlerle paylaşılıyor (Google AdMob, Supabase, Anthropic, RevenueCat)
   - Kullanıcı hakları (silme, erişim, düzeltme)
   - KVKK referansı (Türkiye için)
   - İletişim bilgisi
4. GitHub Pages'te yayınla (ücretsiz):
   - `kullanici.github.io/ehliyet-akademi-legal/privacy.html`

### 6.2 Kullanım Şartları (Terms of Service)

Benzer şekilde hazırla. Play Store zorunlu tutmuyor ama premium üyelik satışı için mantıklı.

### 6.3 KVKK Aydınlatma Metni

Türkiye için ek olarak gerekli. Gizlilik sözleşmesinden daha spesifik bir dokümandır.

Template: https://www.kvkk.gov.tr/SharedFolderServer/CMSFiles/8b9f7070-69aa-4f36-8b2a-0d8c2a5d0c62.pdf

### 6.4 Muhasebeci ile İlk Görüşme

Bugün ihtiyacın yok ama **Play Store'dan ilk para gelmeden önce** bir muhasebeciyle tanış:
- Şahıs şirketi mi kuracaksın?
- Vergi yükümlülükleri
- Yurt dışı ödemeler (Google Play ödemeleri nasıl vergilendirilir)

---

## ✅ Final Checklist

Tamam sayılmak için hepsi işaretli olmalı:

### Araçlar
- [ ] Node.js 20+ yüklü ve çalışıyor
- [ ] Git yüklü ve yapılandırılmış
- [ ] VS Code + Claude Code eklentisi hazır
- [ ] Telefonunda Expo Go uygulaması kurulu
- [ ] Android telefon USB ile bağlanabiliyor (debugging on)

### Hesaplar (hepsi açık ve key'leri not edildi)
- [ ] GitHub — private repo oluşturuldu
- [ ] Google Play Console — 25 USD ödendi, onay bekleniyor/onaylı
- [ ] Expo — hesap açık
- [ ] Supabase — proje oluşturuldu, key'ler alındı
- [ ] Anthropic — API key alındı, ~$5 kredi var
- [ ] RevenueCat — hesap açık (setup sonra)
- [ ] AdMob — hesap açık (setup sonra)
- [ ] PostHog — hesap + proje açık
- [ ] Sentry — proje açık

### Hazırlık
- [ ] Env key'ler not defterinde düzenli duruyor
- [ ] App icon fikri var (veya çizildi)
- [ ] En azından 100 ilk yardım sorusu hazır (AI ile üretildi)
- [ ] Gizlilik sözleşmesi URL'si hazır (veya hazırlanacak)

### Zihinsel Hazırlık
- [ ] README.md tamamen okundu
- [ ] CLAUDE.md tamamen okundu
- [ ] 3 haftalık takvim gerçekçi geldi
- [ ] İlk hafta kurulum odaklı olacağı kabul edildi

---

## 🚀 Hazırsan

Tüm kutular işaretliyse:

1. Proje klasörünü oluştur:
   ```bash
   mkdir ehliyet-akademi
   cd ehliyet-akademi
   git init
   ```

2. Bu `docs/` klasörünü proje içine kopyala.

3. `CLAUDE.md` dosyasını proje kökünde bırak (`docs/` değil, en dışta).

4. VS Code'u aç:
   ```bash
   code .
   ```

5. Terminalde Claude Code başlat (VS Code içindeki terminalden).

6. **`KATMAN_1_TEMEL.md`** dosyasını aç, başlamaya hazırsın.

---

*Kurulumda takılırsan, hangi adımda takıldığını, hata mesajını not al. Claude ile debug edebiliriz.*
