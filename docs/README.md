# 🚗 Ehliyet Akademi — Geliştirme Kılavuzu

Bu klasör, **Ehliyet Akademi** mobil uygulamasını Claude Code ile geliştirmek için hazırlanmış tam bir kılavuzdur. Her dosyanın belirli bir amacı var, sırasıyla kullanman önemli.

---

## 📚 Bu Klasördeki Dosyalar

| Dosya | Ne İşe Yarar | Ne Zaman Kullanılır |
|---|---|---|
| `README.md` | Bu dosya - genel yol haritası | İlk okunacak |
| `CLAUDE.md` | Projenin kökü için Claude talimatları | Proje klasörüne kopyalanır, Claude her oturumda okur |
| `SETUP_ONCE.md` | Başlamadan önce tek seferlik kurulum | İlk gün, Claude Code açmadan önce |
| `KATMAN_1_TEMEL.md` | Proje iskeleti kurulumu | Gün 1-2 |
| `KATMAN_2_TASARIM.md` | UI component sistemi | Gün 3-4 |
| `KATMAN_3_VERI.md` | Supabase + soru bankası | Gün 5-7 |
| `KATMAN_4_AUTH.md` | Kullanıcı giriş/kayıt | Gün 8-9 |
| `KATMAN_5_QUIZ.md` | Quiz motoru (uygulamanın kalbi) | Gün 10-14 |
| `KATMAN_6_PARA.md` | Reklam + Premium üyelik | Gün 15-16 |
| `KATMAN_7_AI.md` | Claude API entegrasyonu | Gün 17-19 |
| `KATMAN_8_YAYIN.md` | Play Store'a yayın | Gün 20-21 |

---

## 🎯 Nasıl Kullanılır? (Adım Adım)

### Gün 0: Hazırlık

1. **Bu klasörü indir.** Proje geliştirme klasörünle aynı yere koy.
2. **`SETUP_ONCE.md` dosyasını aç, baştan sona oku, her maddeyi yap.** 
   Bu dosya Claude Code değil, senin yapacağın işleri listeler (hesap açmalar, kurulumlar).
3. Bu işler bitmeden Claude Code'a bile girme.

### Gün 1: Projeye Başla

1. Proje klasörünü oluştur: `mkdir ehliyet-akademi && cd ehliyet-akademi`
2. İçine `git init` yap.
3. `docs/` klasörü oluştur, bu dosyaları oraya kopyala.
4. `CLAUDE.md` dosyasını proje kökünde (docs içinde değil) bırak.
5. VS Code'u aç, terminal başlat, Claude Code'u çalıştır.
6. `KATMAN_1_TEMEL.md` dosyasını aç, içindeki **hazır prompt'u kopyala**, Claude Code'a yapıştır.
7. Gerisi dosyada yazıyor.

### Her Yeni Katman İçin

1. **Önceki katman tam bitti mi?** Dosyadaki "Oturum Sonu Kontrol Listesi"ne bak.
2. Git commit at.
3. **Yeni Claude Code oturumu aç** (önceki sohbeti `/clear` veya yeni pencere).
4. İlgili KATMAN_X dosyasını aç, oradaki prompt'u kopyala.
5. Claude plan çıkarsın, sen onayla, adım adım ilerle.

---

## ⚠️ Kritik Kurallar (Mutlaka Uy)

### 1. Her Katman = Yeni Oturum
Bir Claude Code sohbetinde birden fazla katman yapma. Context kirlenir, kalite düşer.

### 2. Plan Modu Kullan
Her oturumun başında `Shift+Tab` ile plan moduna geç. Önce plan, sonra uygulama.

### 3. Her Adımdan Sonra Test Et
Claude "tamamlandı" derse **inanma.** Kendin test et:
- Uygulamayı telefonda aç
- Gerçekten çalışıyor mu?
- Hata var mı?

### 4. Her Çalışan Özellikte Commit At
```bash
git add .
git commit -m "feat: katman X tamamlandı - özellik Y"
```
Bir şey bozulursa `git reset --hard HEAD~1` ile geri dön.

### 5. Kod Oku, Kör Güvenme
Claude'un yazdığı her dosyayı kabaca oku. Anlamadığın yer olursa:
> "Bu fonksiyonu bana satır satır açıkla"

### 6. Yüzeysel Onay Verme
Claude "bunu da yapayım mı?" derse cevap düşünüp ver. Doküman dışına çıkmasına izin verme.

---

## 📊 İlerleme Takibi

Her katman bittiğinde bu listede ilgili kutuyu işaretle:

- [ ] Setup tamamlandı (hesaplar açıldı, araçlar kuruldu)
- [ ] Katman 1: Temel iskele kuruldu
- [ ] Katman 2: UI component'leri hazır
- [ ] Katman 3: Veri katmanı çalışıyor
- [ ] Katman 4: Auth sistemi çalışıyor
- [ ] Katman 5: Quiz motoru çalışıyor
- [ ] Katman 6: Monetizasyon entegre
- [ ] Katman 7: AI özellikleri aktif
- [ ] Katman 8: Play Store'a gönderildi

---

## 🆘 Sorun Yaşarsan

### Claude Code saçmalıyor:
- Oturumu kapat, yenisini aç
- Önceki commit'e dön: `git reset --hard HEAD`
- KATMAN dosyasını yeniden ver, daha dar kapsam belirt

### Paket/kurulum hatası:
- Terminal çıktısının tamamını Claude'a yapıştır
- "Bu hatayı çöz" de, önce analiz etsin
- Çözüm yerine "neden olmuş olabilir" diye sor önce

### Kod çalışmıyor ama Claude "çalışıyor" diyor:
- Console log'a bak
- Network isteği var mı kontrol et
- Claude'a şunu söyle: "Uygulama X ekranında Y yapınca Z hatası veriyor. Konsoldaki hata: ..."

### Kayboldun, nereden devam edeceğini bilmiyorsun:
- README.md'ye dön (bu dosya)
- İlerleme listesinde son işaretli maddeye bak
- Bir sonraki KATMAN dosyasını aç

---

## 💡 Genel İpuçları

**İlk hafta moral düşüşü normaldir.** Kurulum + tasarım = heyecan verici değil ama temel. Quiz motoru (Katman 5) geldiğinde işler güzelleşecek.

**Mükemmel olması gerekmez.** İlk versiyon çalışsın yeter. İyileştirme sonra gelir. "Ship, don't polish."

**3 hafta hedefi esnek.** Bazı günler 30 dakika çalışırsın, bazıları 5 saat. Önemli olan her gün bir şey ilerletmek.

**Hata yapman normal.** Bu dokümanda bile hatalar olacak. Gördüğünde not al, düzeltebiliriz.

---

## 🚀 Hazır mısın?

Şimdi `SETUP_ONCE.md` dosyasını aç ve başla. Bol şans!
