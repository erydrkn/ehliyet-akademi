# 🤖 KATMAN 7: AI Entegrasyonu (Claude API)

> **Amaç:** Uygulamayı farkyaratan özelliklerle donatmak: AI destekli soru açıklama, zayıf konu analizi, kişiselleştirilmiş program.
>
> **Süre:** 6-10 saat (2-3 oturum)
> **Zorluk:** ⭐⭐⭐⭐ (Backend + AI prompt mühendisliği)

---

## 📋 Önkoşullar

- [ ] Katman 1-6 tamamlandı
- [ ] Anthropic API key alındı ve kredi var
- [ ] Supabase Edge Functions etkin
- [ ] Supabase CLI kurulu (opsiyonel ama önerilir)

---

## 🎯 Bu Katmanın Hedefi

### AI Özellikleri
1. Soru açıklama (yanlış cevap verince AI neden yanlış olduğunu anlatır)
2. Kişisel zayıf konu analizi (AI hangi konularda zayıf olduğunu özetler)
3. Sınav tarihi modu (AI kişisel çalışma programı oluşturur)
4. Kavram açıklama (bilmediğin bir terimi sor, AI anlatır)
5. Özet raporlar (haftalık AI raporu)

### Teknik Altyapı
1. Supabase Edge Function (Claude API proxy)
2. Cache sistemi (aynı soru için AI tekrar çağrılmaz)
3. Rate limiting (kullanıcı başına)
4. Ücret kontrolü (AI maliyetini izle)

---

## 🚨 Güvenlik Kritik

**Anthropic API key'i ASLA client uygulamada kullanma.** Bunu yaparsan:
- Key sızar, kötü niyetli kişiler kullanır
- Faturanı patlatabilirler
- Hesabın kapanabilir

**Her zaman Edge Function aracılığıyla:**
```
Uygulama → Supabase Edge Function → Claude API
```

---

## 🚀 Claude Code'a Verilecek Prompt (Bölüm 1: Edge Function + Temel AI)

```
Selam! Katman 7: AI Entegrasyonu - Önce Backend.

Önkoşullar:
- Katman 6 bitti, premium sistem çalışıyor
- Anthropic API key var (note: ASLA client'ta KULLANILMAYACAK)
- Supabase projesine CLI ile bağlanabiliyorsun (veya Dashboard'dan)

CLAUDE.md'yi oku.

⚠️ KRİTİK: 
- ANTHROPIC_API_KEY sadece Supabase Edge Function'da kullanılacak
- Client'tan direkt çağrı YASAK
- .env'de sadece EXPO_PUBLIC_ olanlar client'a gider, diğerleri server-side

BU OTURUM KAPSAMI:

1. Supabase Edge Function kurulumu
2. Claude API proxy Edge Function
3. Cache mekanizması (ai_explanations tablosu)
4. Rate limiting
5. Frontend AI hook'ları
6. UI entegrasyonu (quiz sonuç)

YAPILACAKLAR:

A. Supabase Edge Function
1. supabase/functions/explain-question/index.ts
   - CORS headers
   - Auth kontrolü (kullanıcı giriş yapmış mı)
   - Input: questionId, userAnswer, correctAnswer
   - Cache kontrol: ai_explanations tablosunda var mı?
   - Yoksa: Claude API'ye istek at
   - Cache'e kaydet
   - Response dön

2. supabase/functions/_shared/cors.ts
   - CORS helper

3. supabase/functions/_shared/claude.ts
   - callClaude(messages) helper
   - Model: claude-haiku-4-5-20251001 (ucuz ve hızlı)
   - Max tokens: 500
   - System prompt: aşağıda (detay)

4. supabase/functions/_shared/rate-limit.ts
   - Kullanıcı başına: ücretsiz 3/gün, premium 100/gün
   - Supabase'den daily_ai_count çek, kontrol et

B. Environment Variables (Supabase Dashboard)
   Dashboard → Edge Functions → Settings:
   - ANTHROPIC_API_KEY
   - Supabase URL ve service role otomatik gelir

C. Deploy
5. Supabase CLI ile:
   supabase functions deploy explain-question

D. Frontend Entegrasyonu
6. src/lib/ai.ts
   - explainQuestion(questionId, userAnswer, correctAnswer)
   - Edge Function'a POST
   - Error handling (rate limit, network)
   - Response type

7. src/hooks/useAIExplanation.ts
   - useMutation (TanStack Query)
   - onSuccess: toast göster
   - onError: Türkçe hata mesajı
   - Cache key'i invalidate et (daily_ai_count için)

8. src/hooks/useAILimit.ts
   - Kalan AI açıklama hakkı
   - Premium durumuna göre limit
   - resetIfNewDay

E. UI Entegrasyonu
9. src/components/quiz/ExplanationPanel.tsx güncellemesi
   - Statik açıklama en üstte (her zaman)
   - "AI ile daha detaylı açıkla" butonu:
     * Ücretsiz: "3 kalan" badge
     * Premium: sınırsız (badge yok)
   - Tıklayınca loading spinner + AI çağır
   - Response gelince:
     * AI açıklama metni (Markdown destekli göster)
     * "Beğendim / Beğenmedim" geri bildirim butonları
     * Bu feedback analytics'e gönder
   - Limit hit edilince paywall göster

10. src/components/ai/AIExplanationCard.tsx
    - AI açıklama gösterimi
    - Typing animation (streaming gibi görünüm)
    - Kod bloğu veya liste varsa formatla
    - Soru imageürişi + şıklar rengi vurgulanmış

SYSTEM PROMPT (Claude'a gönderilen, Türkçe):
"""
Sen Türk ehliyet sınavına hazırlanan öğrencilere yardım eden uzman bir eğitimcisin.
MEB MTSK müfredatına tamamen hakimsin.

Öğrenci bir soru çözdü, şu an yanlış cevap verdi (veya doğru ama anlayamadı).

Görevin:
1. DOĞRU cevabın neden doğru olduğunu 2-3 cümlede net anlat
2. YANLIŞ cevap verdiyse, neden yanlış olduğunu hassasiyetle belirt
3. İlgili trafik kuralını, ilk yardım bilgisini veya motor mekaniğini basit dille özetle
4. Mümkünse bir hatırlama ipucu ver (mnemotechnik)

Dil: Sade Türkçe. Teknik terimleri parantez içinde aç.
Format: Kısa, öz. 150 kelimeyi aşma.
Ton: Destekleyici, teşvik edici. "Üzülme, bu çok yapılan bir hata" gibi.
Asla: Tıbbi teşhis veya yasal tavsiye yapma. Kuralı öğret, kural tartışma.
"""

CACHE STRATEJİSİ:
- Aynı questionId + userAnswer kombinasyonu için aynı açıklama
- İlk istekte Claude'a git, sonucu ai_explanations'a kaydet
- Sonraki isteklerde direk tablodan oku (Claude'a gitme)
- Maliyet tasarrufu: aynı soru 100 kişi yanlış yaparsa 1 API çağrısı

HATA DURUMLARI:
- Rate limit hit: "Bugünlük AI açıklama hakkın bitti, yarın tekrar dene veya premium al"
- API down: "AI servisi şu anda yanıt veremiyor, birazdan tekrar dene"
- Auth hatası: "Oturumun sonlanmış, lütfen tekrar giriş yap"

PLAN MODUNDA BAŞLA.
```

---

## 🚀 Claude Code'a Verilecek Prompt (Bölüm 2: Kişisel Analiz ve Program)

Yeni oturum:

```
Selam! Katman 7 devam: Kişisel AI Analiz ve Program.

Önkoşullar:
- Bölüm 1 tamam (Edge Function + açıklama)
- ai_explanations tablosu dolmaya başladı
- AI açıklama UI'da çalışıyor

CLAUDE.md'yi oku.

BU OTURUM KAPSAMI:

1. Zayıf konu analizi (AI özeti)
2. Sınav tarihi modu
3. Haftalık AI rapor
4. Kişisel çalışma programı

YAPILACAKLAR:

A. Zayıf Konu Analizi
1. supabase/functions/analyze-weakness/index.ts
   - Input: userId
   - Supabase'den son 30 günün user_answers'ını çek
   - Kategori bazlı başarı oranı hesapla
   - Claude'a analiz için gönder
   - Cevabı parse et ve dön

SYSTEM PROMPT:
"Kullanıcının son 30 günün sınav pratik verilerini analiz et.
En zayıf 2 kategoriyi belirle. Neden zayıf olduğuna dair 
3-4 spesifik konu tespiti yap (örn: 'İlk yardımda özellikle 
kalp masajı sorularında zorlanıyorsun'). Her biri için 
somut çalışma önerisi ver. Dil: Motivasyonel, net, max 200 kelime."

2. src/hooks/useWeaknessAnalysis.ts
3. app/(tabs)/stats.tsx ekle:
   - "AI ile kişisel analiz" kartı (en üstte)
   - Tıklayınca modal açılır, AI analiz yükler
   - Sonuç gösterimi (bullet pointler halinde)
   - "Bu konulardan soru gelsin" butonu → zayıf mod quiz başlat

B. Sınav Tarihi Modu
4. app/profile/exam-date.tsx
   - Kullanıcı sınav tarihini girer
   - Bugün ile arasındaki gün sayısı hesaplan
   - "Sana özel program oluştur" butonu
   - AI çağrısı yap

5. supabase/functions/create-study-plan/index.ts
   - Input: userId, examDate
   - Kalan gün sayısına göre program üret
   - Her gün için: hangi kategoriden kaç soru, ne zaman deneme sınavı
   - JSON schema ile yapılandırılmış response iste

SYSTEM PROMPT:
"Kullanıcı X gün sonra ehliyet sınavına girecek.
Mevcut bilgi seviyesi: [kategori yüzdeleri]
Günlük çalışma kapasitesi: 30-60 dk

Günlük bir program üret. Format:
[
  { 'day': 1, 'date': '2026-04-22', 'focus': 'İlk Yardım', 
    'questions': 20, 'mock_exam': false, 'tip': '...' },
  ...
]

Kurallar:
- İlk günler zayıf kategorilere ağırlık ver
- Son 3 gün: deneme sınavlarına odaklan
- Sınav günü: dinlenme, hafif tekrar"

6. src/hooks/useStudyPlan.ts
7. app/(tabs)/home güncelleme:
   - Sınav tarihi yakınsa:
     * "Sınavına 14 gün kaldı!" sayaç
     * Bugünkü plan kartı
     * İlerleme yüzdesi

C. Haftalık Rapor
8. supabase/functions/weekly-report/index.ts
   - Pazar geceleri tetikleniyor (Supabase cron ile)
   - Her kullanıcı için hafta özeti
   - Push notification olarak gönder (expo-notifications)

9. AI rapor içeriği:
   - Geçen hafta toplam çözülen soru
   - Başarı oranı trend (arttı/azaldı)
   - En iyi kategori, en zayıf kategori
   - Motivasyon mesajı
   - Gelecek hafta önerisi

D. Kavram Sözlüğü
10. app/ask-ai.tsx
    - Sohbet benzeri arayüz
    - "Bir trafik terimi sor" placeholder
    - Örnek: "Viraj başı mesafesi ne demek?"
    - AI cevabı streaming ile gelsin
    - Sadece ehliyet sınavı konularında cevap versin
    - Guard rails: diğer konularda "Sadece ehliyet sınavı konularında yardımcı olabilirim"

11. supabase/functions/ask-concept/index.ts
    - Rate limit: ücretsiz 3/gün, premium sınırsız

PAKET:
- npm install react-native-markdown-display (AI cevabı markdown render)

KURALLAR:
- AI cevapları her zaman Türkçe
- Kullanıcıya kimliksiz yanıtlar (yanıltıcı bilgi olmayacak şekilde)
- Cache olabilecek şeyler cache'te (analiz haftada 1 kez yenilenir)
- Premium özellikler: kavram sözlüğü sınırsız, zayıf analiz her gün

PLAN MODUNDA BAŞLA.
```

---

## 💰 AI Maliyet Yönetimi

### Tahmini Aylık Maliyet

**Varsayım:** 10.000 aktif kullanıcı, ortalama 3 AI açıklama/gün

**Hesaplama:**
- 10.000 kullanıcı × 3 açıklama = 30.000 API çağrısı/gün
- Cache hit oranı: %70 (aynı soru, aynı hatalar sık)
- Gerçek API çağrısı: 9.000/gün = 270.000/ay
- Her çağrı ortalama: 500 input + 300 output token
- Claude Haiku fiyatı: input $0.80/M, output $4/M (2025)
- Günlük: 9000 × (500×$0.80/1M + 300×$4/1M) = 9000 × ($0.0004 + $0.0012) = ~$14/gün
- **Aylık: ~$420**

### Kontrol Mekanizmaları

1. **Cache agresif kullan:** Aynı soru-cevap kombinasyonu için asla tekrar çağrı
2. **Daily limit:** Ücretsiz 3, premium 100
3. **Model seçimi:** Haiku (en ucuz) yeterli, Sonnet'e gerek yok
4. **Token limiti:** max_tokens=500 yeterli
5. **Anthropic Dashboard:** Günlük harcama alarmı kur ($50 geçince email)
6. **Acil durum kill switch:** Supabase'de feature flag, AI'ı kapatma opsiyonu

---

## 🎨 AI UX Örnekleri

### Açıklama Gösterimi

```
╔════════════════════════════════╗
║  📖 Soru Açıklaması            ║
╠════════════════════════════════╣
║                                ║
║  Doğru cevap: C                ║
║                                ║
║  Kalp masajında erişkinde      ║
║  dakikada 100-120 bası yapılır.║
║  Daha az olursa kalp yeterince ║
║  pompalanmaz, daha fazla olursa║
║  kalp boşalma fırsatı bulamaz. ║
║                                ║
║  💡 İpucu: "Staying Alive"     ║
║  şarkısının ritminde (100 BPM) ║
║  yaparsan doğru tempoda        ║
║  olursun!                      ║
║                                ║
║  [ 👍 Faydalı   👎 Yetersiz ]  ║
╚════════════════════════════════╝
```

### Zayıf Konu Analizi

```
╔════════════════════════════════╗
║  🎯 Kişisel Analiz             ║
╠════════════════════════════════╣
║                                ║
║  Güçlü: Trafik kuralları (%85) ║
║  Zayıf: İlk yardım (%62)       ║
║                                ║
║  Spesifik zorluk alanları:     ║
║  • Kalp masajı soruları        ║
║  • Şok durumu tedavisi         ║
║  • Kanama kontrolü             ║
║                                ║
║  Önerim: Bir hafta ilk yardıma ║
║  odaklan, günde 15 soru çöz.   ║
║  İlk yardım özel modunu aç.    ║
║                                ║
║  [Zayıf Konulardan Soru Çöz]   ║
╚════════════════════════════════╝
```

---

## ✅ Oturum Sonu Kontrol Listesi

### Backend
- [ ] Edge Function deploy edildi
- [ ] ANTHROPIC_API_KEY Supabase secret'larında
- [ ] Cache mekanizması çalışıyor (aynı soru 2 kez sorulunca DB'den geliyor)
- [ ] Rate limiting çalışıyor
- [ ] Logs görünüyor (Dashboard → Edge Functions → Logs)

### Frontend
- [ ] AI açıklama butonu quiz'de çalışıyor
- [ ] Zayıf konu analizi istatistik sayfasında
- [ ] Kavram sözlüğü soru-cevap çalışıyor
- [ ] Sınav tarihi modu programı üretiyor
- [ ] Haftalık rapor push bildirimi geliyor

### AI Kalitesi
- [ ] Açıklamalar Türkçe, dilbilgisel doğru
- [ ] MEB müfredatıyla uyumlu
- [ ] Hassas konularda güvenli (yasal/tıbbi tavsiye yok)
- [ ] 150 kelime limitini aşmıyor
- [ ] Ton: destekleyici, teşvik edici

### Maliyet
- [ ] Anthropic Dashboard'da harcama izleniyor
- [ ] Spend alarm kuruldu ($50 limit)
- [ ] Cache hit rate > %50 hedefi
- [ ] Kullanıcı başına maliyet hesaplanabiliyor

### UX
- [ ] Loading state AI cevabı beklerken
- [ ] Typing animation (streaming gibi görünüm)
- [ ] Feedback butonu (beğendim/beğenmedim)
- [ ] Hata durumunda anlaşılır mesaj

---

## 🐛 Sık Sorunlar

### "Edge Function 500 hata veriyor"
- Logları oku (Dashboard → Edge Functions → Logs)
- ANTHROPIC_API_KEY set edildi mi
- CORS sorun olabilir, origin kontrol et

### "AI cevabı saçmalıyor"
- System prompt tekrar değerlendir
- Token limitini artır (500 → 800)
- Daha güçlü model kullan (Sonnet)
- Örnek ekle (few-shot prompting)

### "Cache hit etmiyor"
- ai_explanations tablosunda UNIQUE constraint var mı
- question_id + user_answer kombinasyonu doğru sorgulanıyor mu

### "Rate limit çok sıkı"
- Ücretsiz limit: 3 → 5'e çıkar deneme için
- Premium limit artır

### "API maliyeti yüksek"
- Cache hit rate'i ölç (logla)
- Aynı soruda tekrar API çağrıldığı durumu bul
- Max tokens düşür

---

## 🎯 Sıradaki Katman

AI aktif. Son adım: Uygulamayı dünyaya göster.

1. Git commit + push
2. **`KATMAN_8_YAYIN.md`** — Play Store yayını

---

## 💡 İpuçları

**AI prompt iteratif:** İlk versiyondan mükemmel olmaz. 20 farklı soru için AI açıklama ürettir, manuel oku, beğenmediklerin olursa prompt'u iyileştir.

**Kullanıcı geri bildirimi kritik:** Beğendim/beğenmedim butonu sonradan değil, ilk günden koy. Bu data ile prompt'u geliştirirsin.

**Guardrails:** AI bazen yoldan çıkar. Test et:
- "Bana bir fıkra anlat" → "Sadece ehliyet konularında yardım edebilirim"
- "Doktor lazım mı?" → Tıbbi yönlendirme YAPMA, kurala çevir
- Offensive girişler → Zarif reddetme

**Maliyet kontrolü:** İlk 100 premium kullanıcıya kadar AI maliyeti > gelir olabilir. Normal. Ölçeklenince denge kurulur.

---

*AI entegrasyonu uygulamanı SANA AİT yapan özellik. Bu olmadan "başka bir ehliyet uygulaması" olur. Bununla "zeki bir asistan" olur.*
