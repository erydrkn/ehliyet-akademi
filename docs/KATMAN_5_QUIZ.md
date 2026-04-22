# 🎯 KATMAN 5: Quiz Motoru (Uygulamanın Kalbi)

> **Amaç:** Kullanıcıların soru çözebildiği, deneme sınavı yapabildiği, ilerlemesini takip edebildiği tam işlevsel quiz sistemi kurmak.
>
> **Süre:** 12-18 saat (3-5 oturum — katmanı parçalara ayıracağız)
> **Zorluk:** ⭐⭐⭐⭐⭐ (En kompleks katman, projenin kalbi)

---

## 📋 Önkoşullar

- [ ] Katman 1-4 tamamlandı
- [ ] Supabase'de en az 200 soru var
- [ ] Auth çalışıyor, kullanıcı giriş yapabiliyor
- [ ] UI component'leri hazır

---

## 🎯 Bu Katmanın Hedefi

### Temel Özellikler
1. Kategori seçim ekranı (4 ana kategori)
2. Soru çözme ekranı (tek tek sorular)
3. Doğru/yanlış geri bildirim
4. Açıklama gösterimi (statik metin)
5. Deneme sınavı modu (50 soru, 45 dk)
6. Sınav sonuç ekranı
7. Yanlış sorular tekrar modu
8. Ana ekran (dashboard)
9. İstatistik ekranı (basit)
10. Günlük limit sistemi
11. Streak (seri) sistemi

### Bu Katmanda YAPILMAYACAKLAR
- AI açıklama (Katman 7)
- Reklamlar (Katman 6)
- Paywall (Katman 6)
- Sınav tarihi modu (Katman 7)

---

## 🎨 Bu Katmanı Nasıl Parçalayacağız?

Bu katman çok büyük. **3 alt-katmana bölüyoruz:**

### 5.1 — Tab Navigation + Ana Ekran (1 oturum, ~3 saat)
Temel navigasyon iskelesi.

### 5.2 — Çalışma Modu + Soru UI (1-2 oturum, ~5 saat)
Soru gösterim, cevaplama, geri bildirim.

### 5.3 — Deneme Sınavı + Sonuç (1 oturum, ~4 saat)
50 soru, timer, sonuç hesaplama.

### 5.4 — İstatistik + Streak + Limit (1 oturum, ~3 saat)
Arka plan mantığı.

Her alt katman için ayrı Claude Code oturumu açacaksın.

---

## 🚀 Alt Katman 5.1 — Tab Navigation + Ana Ekran

### Claude Code Prompt:

```
Selam! Katman 5'in ilk bölümünü yapıyoruz: Tab Navigation + Ana Ekran.

Önkoşullar: Katman 1-4 bitti. Auth çalışıyor.
CLAUDE.md'yi oku.

BU OTURUM KAPSAMI:
1. (tabs) layout ve 5 tab
2. Ana ekran içeriği
3. Soru sayacı, streak kartı, hızlı çalışma CTA

YAPILACAKLAR:

1. app/(tabs)/_layout.tsx
   - 5 tab: Ana Sayfa, Çalış, Sınav, İstatistik, Profil
   - Tab bar özelleştirmeleri (ikonlar, renkler)
   - Lucide ikonlar: Home, BookOpen, Target, BarChart3, User
   - Aktif tab mavi, pasif gri
   - Badge gösterimi (streak sayısı için)

2. app/(tabs)/index.tsx (Ana Sayfa)
   - "Merhaba, [isim]!" selamlaması
   - Streak kartı ("X gündür çalışıyorsun 🔥")
   - Günlük ilerleme kartı ("Bugün: 15/20 soru")
   - Hızlı başlat butonları (her kategoriden):
     * İlk Yardım (+ ilerleme bar)
     * Trafik (+ ilerleme bar)
     * Motor
     * Trafik Adabı
   - "Deneme Sınavı Yap" büyük CTA butonu
   - Son çözülen sorulara kısa özet

3. app/(tabs)/study.tsx (Çalışma placeholder)
   - Şimdilik "Çalışma modu yakında" yazan placeholder
   - Kategori kartları listesi

4. app/(tabs)/exam.tsx (Sınav placeholder)
   - "Deneme sınavı başlat" butonu
   - Önceki sınavlar listesi (boş placeholder)

5. app/(tabs)/stats.tsx (İstatistik placeholder)
6. app/(tabs)/profile.tsx (Profil - Katman 4'te başlamış)
   - Kullanıcı bilgileri
   - Ayarlar linki
   - Çıkış yap

7. src/components/home/StreakCard.tsx
8. src/components/home/ProgressCard.tsx
9. src/components/home/CategoryQuickStart.tsx
10. src/api/stats.ts güncellemesi (ana sayfa için veri)

KURALLAR:
- Her kart tıklanabilir, doğru yere yönlensin
- Loading state her component'te
- Ücretsiz kullanıcı için günlük limit göster ("5/20 soru kaldı")
- Empty state (veri yoksa) düzgün görünsün

PLAN MODUNDA BAŞLA. 
Önce tab layout, sonra ana ekran, sonra placeholder'lar.
```

---

## 🚀 Alt Katman 5.2 — Çalışma Modu + Soru UI

### Claude Code Prompt (Yeni oturum):

```
Selam! Katman 5.2: Çalışma Modu + Soru UI.

Önkoşullar:
- 5.1 tamam (tab navigation + ana ekran)
- Supabase'de sorular mevcut
- useQuestions hook çalışıyor

CLAUDE.md'yi oku.

BU OTURUM KAPSAMI:
Kullanıcı bir kategoriye tıklayıp soruları çözebilecek.
Her soruda doğru/yanlış geri bildirim, açıklama göster/gizle.

YAPILACAKLAR:

1. src/stores/quizStore.ts (Zustand)
   State:
   - mode: 'study' | 'exam' | 'review' | 'weak'
   - questions: Question[]
   - currentIndex: number
   - userAnswers: Map<questionId, UserAnswer>
   - showExplanation: boolean
   - isFinished: boolean
   - startTime: Date
   
   Actions:
   - startSession(mode, questions)
   - answerCurrent(answer: 'A'|'B'|'C'|'D')
   - toggleExplanation()
   - goNext()
   - goPrevious()
   - finishSession()
   - resetSession()

2. app/(tabs)/study.tsx
   - 4 kategori kartı (büyük, ikonlu, ilerleme bar ile)
   - Her kart tıklanınca → app/quiz/study/[category]
   - Her kategori için:
     * Kategori adı
     * Toplam soru sayısı
     * Çözülmüş sayısı
     * Başarı oranı

3. app/quiz/study/[category].tsx
   - 10 soruluk oturum
   - Kategori parametresinden quiz başlat
   - QuizEngine component'i render et
   - Bitince sonuç sayfası

4. src/components/quiz/QuizEngine.tsx
   - Quiz store'u kullanarak soruları render
   - QuestionCard'ı göster
   - Navigasyon butonları (sonraki/önceki)
   - İlerleme göstergesi (5/10)
   - Çıkış butonu (onay dialog'u ile)

5. src/components/quiz/QuestionCard.tsx
   - Soru metni (büyük, okunaklı)
   - (Varsa) görsel
   - 4 şık (A, B, C, D)
   - Her şık: Pressable, class mantığı:
     * Seçilmedi: neutral (gri border)
     * Seçildi + doğru: yeşil arka plan + ikon
     * Seçildi + yanlış: kırmızı + ikon
     * Doğru cevap göster: yeşil (yanlış seçildiyse)
   - Seçim sonrası:
     * "Açıklamayı göster" butonu görünür
     * "Sonraki soru" butonu görünür

6. src/components/quiz/OptionButton.tsx
   - A, B, C, D butonları için reusable
   - Props: label, letter, state, onPress
   - Animasyon: basılınca hafif scale

7. src/components/quiz/ExplanationPanel.tsx
   - BottomSheet olarak açılır
   - Statik açıklamayı göster (questions.explanation)
   - "AI ile açıkla" butonu (henüz işlevsiz - Katman 7'de)
   - "Kapat" butonu

8. src/components/quiz/QuizProgress.tsx
   - Üstte ilerleme çubuğu
   - Doğru/yanlış sayacı
   - Şu anki soru numarası

9. src/api/answers.ts — submitAnswer fonksiyonu
   - user_answers tablosuna insert
   - user_profiles.total_questions_solved artır
   - user_profiles.daily_question_count artır

10. Quiz bitince:
    - app/quiz/result.tsx
    - Toplam doğru/yanlış
    - "Yanlışları tekrar et" butonu
    - "Ana sayfaya dön" butonu

ANIMASYONLAR (Reanimated):
- Soru geçişi: sağdan soldan slide (200ms)
- Doğru cevapta: yeşil pulse
- Yanlış cevapta: kırmızı shake (hafif)
- Score count up animasyonu (sonuç sayfasında)

KURALLAR:
- Cevap verilmeden "sonraki" butonu disabled
- Açıklama öncesi cevap verilmeli
- Back button gesture'ı yakala (onay sor)
- Offline durumda çalışılsın (cached questions)

PLAN MODUNDA BAŞLA:
- State management önce
- UI component'leri sonra
- En son entegrasyon

Her 2-3 dosyada bir dur, test et.
```

---

## 🚀 Alt Katman 5.3 — Deneme Sınavı + Sonuç

### Claude Code Prompt (Yeni oturum):

```
Selam! Katman 5.3: Deneme Sınavı Modu.

Önkoşullar:
- 5.1 ve 5.2 tamam
- Quiz motoru çalışıyor (çalışma modunda)

CLAUDE.md'yi oku.

BU OTURUM KAPSAMI:
Gerçek sınav formatında 50 soruluk simülasyon.

MEB SINAV YAPISI:
- 50 soru toplam
- 12 İlk Yardım, 23 Trafik, 9 Motor, 6 Trafik Adabı
- 45 dakika süre
- Minimum 35 doğru (70 puan) ile geçilir
- Her soru 2 puan (yanlış 0, doğru +2)

YAPILACAKLAR:

1. app/(tabs)/exam.tsx güncellemesi
   - "Deneme Sınavı Başlat" büyük butonu
   - Son 5 sınav sonucu listesi (varsa)
   - Her sonuç: tarih, puan, geçti/kaldı rozeti
   - Genel ortalama kartı

2. app/quiz/exam/index.tsx (Sınav başlangıç)
   - "Gerçek sınav koşullarında 50 soru, 45 dakika"
   - "Başlamaya hazır mısın?"
   - Başlatınca → app/quiz/exam/session.tsx

3. app/quiz/exam/session.tsx
   - 50 soru çek (dağılım: 12-23-9-6)
   - Timer başlat (45 dakika countdown)
   - QuizEngine'i "exam" modunda kullan:
     * Cevap sonrası ANINDA geri bildirim YOK (sınav gibi)
     * Tüm sorular cevaplanmadan önce "bitir" edilebilir
     * Tüm soruları gezebilir, değiştirebilir
   - Üstte: kalan süre + soru sayısı (15/50)
   - "İşaretli sorular" modu (soru bayrağı)
   - Son soruda "Sınavı Bitir" butonu
   - Süre dolunca otomatik bitir

4. src/components/exam/ExamTimer.tsx
   - Countdown timer
   - Son 5 dakikada kırmızı
   - Ses uyarısı? (opsiyonel)

5. src/components/exam/QuestionGrid.tsx
   - 50 kareli grid (bottom sheet'te)
   - Her kare: boş / cevaplandı / işaretli
   - Karenin tıklanması → o soruya atla
   - "Hangi sorulara döneceksin" overview

6. app/quiz/exam/result.tsx (Sınav sonuç)
   - Büyük başlık: "GEÇTİN! 🎉" veya "KALDIN 😔"
   - Puan (100 üzerinden)
   - Doğru/yanlış/boş sayıları
   - Kategori bazlı başarı pie chart
   - "Yanlışları gözden geçir" butonu
   - "Açıklamalarla incele" butonu
   - "Sınav Sonuçları Geçmişine Kaydet" (otomatik)
   - Paylaş butonu (sosyal medya için)

7. src/api/exam.ts
   - startExamSession() - exam_sessions tablosuna insert
   - finishExamSession(sessionId, answers) - complete ve stats hesapla
   - getExamHistory(userId) - geçmiş sınavlar

8. src/lib/exam-logic.ts
   - generateBalancedExam() - 12+23+9+6 dağılımında rastgele
   - calculateScore(answers) - puanı hesapla
   - categorizeResults(answers) - kategori bazlı breakdown

9. Reanimated animasyonlar:
   - Sonuç sayfasında confetti (geçtiyse)
   - Puan sayaç animasyonu (0'dan hedefe)
   - Pie chart animasyonu

KRİTİK:
- Timer uygulamadan çıkılınca da devam etmeli (background'da)
- expo-background-task veya basit: startTime - now ile hesapla
- Sınav yarıda bırakılırsa: "Devam etmek ister misin?" modal

PLAN MODUNDA BAŞLA.
```

---

## 🚀 Alt Katman 5.4 — Streak, Limit, İstatistik

### Claude Code Prompt (Yeni oturum):

```
Selam! Katman 5'in son bölümü: Streak, Günlük Limit, İstatistik.

Önkoşullar: Tüm 5.1-5.3 bitti. Soru çözme ve sınav çalışıyor.
CLAUDE.md'yi oku.

BU OTURUM KAPSAMI:
Arka plan mantığı + kullanıcı görünümü.

YAPILACAKLAR:

A. Streak Sistemi
1. src/api/streak.ts
   - updateStreak(userId) — Supabase RPC çağır
   - checkStreakStatus(userId)
2. Entegrasyon: her soru çözüldüğünde updateStreak çağrısı

B. Günlük Limit Sistemi
3. src/hooks/useDailyLimit.ts
   - Kalan soru hakkı
   - Kalan AI açıklama hakkı (Katman 7'de aktif olacak)
   - Premium kontrolü (şimdilik hep false)
   - resetIfNewDay() - yeni gün başladıysa sıfırla

4. Günlük limit hit edildiğinde:
   - src/components/modals/DailyLimitModal.tsx
   - "Bugünlük sorularını bitirdin!"
   - "Yarın tekrar gel veya Premium al" (Katman 6'da bağlanacak)
   - Şimdilik sadece "Yarın tekrar gel" mesajı

C. İstatistik Ekranı
5. app/(tabs)/stats.tsx
   - Genel başarı oranı (büyük sayı)
   - Kategori bazlı başarı (progress bar'lar)
   - Son 30 gün aktivite grafiği (line chart)
   - Streak bilgisi
   - Toplam istatistik kartları:
     * Toplam çözülen soru
     * Toplam doğru
     * Ortalama süre
     * En uzun streak
   - Haftalık hedef ilerlemesi

6. src/components/stats/CategoryBar.tsx
   - Kategori adı + yüzde + bar
   - Renk: success (iyi), warning (orta), danger (zayıf)

7. src/components/stats/ActivityChart.tsx
   - Victory Native veya react-native-gifted-charts kullan
   - Son 30 günün günlük çözüm sayısı

8. src/hooks/useStats.ts
   - useOverallStats()
   - useCategoryStats()
   - useActivityHistory(days)

D. Bildirimler (Basit)
9. src/lib/notifications.ts
   - expo-notifications kurulumu
   - Günlük hatırlatma (akşam 19:00)
   - Streak uyarısı (hiç soru çözmemişse)
   - İzin iste

10. src/hooks/useNotifications.ts
    - permission check
    - schedule daily reminder
    - cancelAll on logout

PAKETLER:
- npm install victory-native (veya react-native-gifted-charts - daha kolay)
- npx expo install expo-notifications

KURALLAR:
- Grafikler için açık/koyu mod destekli olmalı
- Empty state (veri yok) düzgün
- Yavaş yükleme için skeleton göster

PLAN MODUNDA BAŞLA.
```

---

## ✅ Oturum Sonu Kontrol Listesi (Tüm Katman 5)

### İşlevsellik
- [ ] 5 tab görünür ve çalışır
- [ ] Ana sayfada kişiselleştirilmiş içerik
- [ ] Kategori seçilip soru çözülebiliyor
- [ ] Her soruda doğru/yanlış geri bildirim
- [ ] Açıklama göster/gizle çalışıyor
- [ ] 10 soruluk oturum sonunda sonuç
- [ ] Deneme sınavı: 50 soru, 45 dk, kategori dağılımı doğru
- [ ] Sınav timer düzgün çalışıyor
- [ ] Sınav sonucu puan doğru hesaplanıyor (70/100 geçme sınırı)
- [ ] Geçmiş sınavlar listesi
- [ ] Streak sayısı artıyor
- [ ] Günlük limit (20 soru) hit edince modal
- [ ] İstatistik ekranında veriler gerçekçi

### UX
- [ ] Animasyonlar akıcı (60fps hedef)
- [ ] Loading state'leri var
- [ ] Empty state'leri var (hiç soru yok, hiç sınav yok)
- [ ] Error handling (network yok vb.)
- [ ] Keyboard açılınca buton görünür kalıyor
- [ ] Geri tuşu (Android) düzgün davranıyor
- [ ] Uygulamayı kapatıp açınca sınav yarıda bırakılmışsa geri dönme sorusu

### Veri
- [ ] user_answers tablosuna kayıt düşüyor
- [ ] exam_sessions tablosuna kayıt düşüyor
- [ ] total_questions_solved güncelleniyor
- [ ] streak_days güncelleniyor
- [ ] daily_question_count güncelleniyor
- [ ] RLS sorun çıkarmıyor

### Performans
- [ ] 50 soru yüklemesi < 2 saniye
- [ ] Soru geçişi anında (lag yok)
- [ ] İstatistik ekranı < 1 saniye

---

## 🐛 Sık Sorunlar

### Timer uygulama kapatılınca resetleniyor
**Çözüm:** `useEffect` içinde timer başlatma, bağımsız state kullanma. `startTime` database'e kaydet, `now - startTime` ile hesapla.

### Quiz state kayboluyor ekran değişimlerinde
**Çözüm:** Zustand store `persist` middleware kullan (sadece in-progress quiz için).

### Grafik çizim hatası
**Çözüm:** Data formatını logla, chart library'nin beklediği format doğru mu kontrol et.

### İstatistik query yavaş
**Çözüm:** Database fonksiyonu (RPC) kullan, client'ta hesaplama yapma. Index'ler kurulu mu kontrol et.

### Back button behavior yanlış
**Çözüm:** Expo Router'da `useNavigation` ile `beforeRemove` listener kullan.

---

## 🎯 Sıradaki Katman

En zor kısım bitti! Şimdi para kazanma zamanı.

1. Git commit + push (büyük milestone commit'i)
2. **`KATMAN_6_PARA.md`** — AdMob + RevenueCat

---

## 💡 Genel İpuçları

**Test sıklığı önemli:** Her 30-45 dakikada bir telefonunda test et. Bir şey yanlış gidiyorsa erken fark et.

**Gerçek kullanıcı gibi dene:**
- Soruları gerçekten çöz, rastgele tıklama
- Uygulamayı kapat-aç
- Offline yap, geri dön
- Farklı hızlarda dokun

**Hata senaryoları:**
- İnternet yokken ne oluyor?
- Session expire olursa?
- Database zamanaşımına girerse?

**Bu katman tamamlandığında uygulamanın %70'i hazır sayılır.** Gerisi (monetizasyon, AI, yayın) daha hızlı gidecek.

---

*Bu katmanda çok zaman harcaman normal. Acele etme. Kalitesi iyi olmalı çünkü kullanıcı ile asıl burada temas ediyorsun.*
