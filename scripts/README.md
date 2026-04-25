# Scripts

## Auto-tag Questions (Mini Plan A)

499 soruyu kategori bazlı keyword matching ile topic'lere etiketler. UI değişikliği yok — sadece DB tarafı.

### Önkoşullar

- `.env` dosyasında dolu olmalı:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (RLS bypass için)
- Migration uygulanmış olmalı: `supabase/migrations/20260424000005_add_topic_to_questions.sql`

### 1) Migration Uygula

**Yöntem A — Supabase CLI** (yerel kurulum varsa):
```bash
supabase db push
```

**Yöntem B — Supabase Dashboard** (CLI yoksa):
1. Dashboard → SQL Editor
2. `supabase/migrations/20260424000005_add_topic_to_questions.sql` içeriğini yapıştır
3. Run

**Doğrulama** (SQL Editor):
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'questions' AND column_name = 'topic';
```

### 2) Etiketleme Script'ini Çalıştır

```bash
npx tsx scripts/auto-tag-questions.ts
```

Beklenen çıktı:
```
🔍 Sorular yükleniyor...
📋 499 soru bulundu, etiketleniyor...

📊 Dağılım:
  trafik_isaretleri: 35
  ...
⚠️  Etiketsiz (diger): 12 / 499

💾 Veritabanı güncelleniyor...
  ✅ trafik_isaretleri (35)
  ...

🎉 Tamamlandı: 499/499 soru güncellendi.
```

### 3) DB Doğrulama

Supabase Dashboard → SQL Editor:
```sql
SELECT topic, COUNT(*) AS toplam
FROM questions
GROUP BY topic
ORDER BY toplam DESC;
```

İdeal: `diger` toplamın %5'inden az olmalı. Daha yüksekse keyword'ler iyileştirilebilir.

### İyileştirme Döngüsü

1. `scripts/auto-tag-questions.ts` içindeki `KEYWORD_MAP`'e yeni keyword ekle
2. Script tekrar çalıştır (idempotent — eski etiketler güncellenir)
3. `diger` sayısı azalana kadar tekrarla

### Notlar

- Script `@/` alias kullanmaz; tüm tipler ve KEYWORD_MAP inline.
- TopicId union iki yerde duplicate: `src/constants/topics.ts` (UI) + `scripts/auto-tag-questions.ts` (script). Manuel sync.
- Yeni topic eklendiğinde her iki dosya da güncellenmeli.

---

## Diğer Scriptler

- `import-questions.ts` — `assets/data/questions.json`'daki soruları Supabase'e yükler.
- `merge-batches.ts` — Soru batch'lerini birleştirir.
- `reset-project.js` — Expo proje sıfırlama (Expo CLI default).
