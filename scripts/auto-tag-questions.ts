import 'dotenv/config';

/**
 * Soruları kategori bazlı keyword matching ile topic'lere etiketler.
 *
 * - SERVICE_ROLE_KEY kullanır (RLS bypass).
 * - Idempotent: tekrar çalıştırılabilir, eski topic değerleri yenilenir.
 * - Topic başına gruplanmış UPDATE (.in('id', batch)) — verimli.
 *
 * Çalıştırma: npx tsx scripts/auto-tag-questions.ts
 *
 * NOT: src/constants/topics.ts ile TopicId union'ı SYNC tutulmalı.
 * `@/` alias kullanılmıyor (tsx + tsconfig paths güvenliği için).
 */

import { createClient } from '@supabase/supabase-js';

type QuestionCategory = 'ilk_yardim' | 'trafik' | 'motor' | 'trafik_adabi';

type TopicId =
  // İlk Yardım (11)
  | 'kalp_masaji'
  | 'bilinc_kontrolu'
  | 'suni_solunum'
  | 'kanama_kontrolu'
  | 'kirik_cikik_burkulma'
  | 'yanik_tedavisi'
  | 'sok_belirtileri'
  | 'zehirlenme'
  | 'kalp_krizi_belirtileri'
  | 'acil_arama_112'
  | 'omurga_yaralanmasi'
  // Trafik (19)
  | 'trafik_isaretleri'
  | 'trafik_isiklari'
  | 'hiz_limitleri'
  | 'gecit_ustunlugu'
  | 'serit_kurallari'
  | 'sollama_kurallari'
  | 'park_yasaklari'
  | 'duraklama_kurallari'
  | 'kavsak_kurallari'
  | 'egimli_yol'
  | 'yaya_gecidi'
  | 'acil_araclar'
  | 'tasit_yolu_kurallari'
  | 'takip_mesafesi'
  | 'kor_nokta_dikiz'
  | 'surucu_belgesi'
  | 'trafik_kazasi_durumu'
  | 'tunel_kurallari'
  | 'ehliyet_sinif_yetki'
  // Motor (11)
  | 'lastik_bakimi'
  | 'motor_yagi'
  | 'aku_bakimi'
  | 'fren_sistemi'
  | 'egzoz_arizalari'
  | 'sogutma_sistemi'
  | 'aydinlatma_sistemi'
  | 'yakit_sistemi'
  | 'ariza_belirtileri'
  | 'periyodik_bakim'
  | 'arac_donanimi'
  // Trafik Adabı (7)
  | 'surucu_davranisi'
  | 'yaya_iliskisi'
  | 'korna_kullanimi'
  | 'yardimsever_surucu'
  | 'yol_verme_kibarligi'
  | 'far_kullanim_etigi'
  | 'agresif_surucu'
  // Defansif fallback
  | 'diger';

type QuestionRow = {
  id: number;
  category: QuestionCategory;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation: string | null;
};

const KEYWORD_MAP: Record<QuestionCategory, Array<{ keywords: string[]; topic: TopicId }>> = {
  ilk_yardim: [
    // YENİ TOPIC'LER (önce eklenmeli, öncelik kazansın)
    { keywords: ['heimlich', 'hava yolu tıkan', 'soluk borusu', 'tıkanma', 'yabancı cisim kaç'], topic: 'suni_solunum' },
    { keywords: ['göze', 'göz küre', 'göze yabancı cisim', 'göze kimyasal', 'göze cam', 'göz yaralan'], topic: 'kanama_kontrolu' },
    { keywords: ['bebek', 'çocuk', '1 yaşın altı', 'yenidoğan', '1-8 yaş'], topic: 'kalp_masaji' },
    { keywords: ['suda boğul', 'boğulma tehlike', 'elektrik çarp'], topic: 'sok_belirtileri' },
    { keywords: ['sıcak çarp', 'donma', 'hipoterm', 'vücut ısı'], topic: 'sok_belirtileri' },
    { keywords: ['bayıl', 'sara', 'epileps', 'nöbet'], topic: 'bilinc_kontrolu' },
    { keywords: ['açık karın', 'bağırsak', 'göğüste delici', 'akciğer delin', 'pnömotoraks'], topic: 'kanama_kontrolu' },
    { keywords: ['ısırık', 'köpek ısır', 'hayvan ısır', 'böcek'], topic: 'kanama_kontrolu' },
    { keywords: ['ilk yardım çantası', 'ilk yardımın amaç', 'aydınlatılmış onam', 'kazaya müdahale', 'kaza yerine'], topic: 'acil_arama_112' },
    { keywords: ['solunum sayı', 'kalp atış', 'nabız sayı', 'nabız değer', 'dakikada'], topic: 'bilinc_kontrolu' },
    { keywords: ['kopan parmak', 'kopan parça', 'amputas'], topic: 'kanama_kontrolu' },
    { keywords: ['hamile yaralı', 'hamile kazaze'], topic: 'omurga_yaralanmasi' },
    
    // MEVCUT KEYWORD'LER (orjinal sıraya göre devam)
    { keywords: ['kalp masaj', 'göğüs basın', 'kompresyon', 'cpr'], topic: 'kalp_masaji' },
    { keywords: ['bilinç', 'şuur', 'uyandır', 'tepki'], topic: 'bilinc_kontrolu' },
    { keywords: ['suni solunum', 'ağız ağ', 'soluk verme', 'kurtarıcı solunum'], topic: 'suni_solunum' },
    { keywords: ['kanama', 'kanayan', 'kan kaybı', 'turnike'], topic: 'kanama_kontrolu' },
    { keywords: ['kırık', 'çıkık', 'burkulm', 'atel'], topic: 'kirik_cikik_burkulma' },
    { keywords: ['yanık', 'yanmış', 'haşlanm'], topic: 'yanik_tedavisi' },
    { keywords: ['şok', 'soluk benizli', 'soğuk terle'], topic: 'sok_belirtileri' },
    { keywords: ['zehirlenm', 'zehir', 'gıda zehir'], topic: 'zehirlenme' },
    { keywords: ['kalp kriz', 'göğüs ağrı', 'sol kol'], topic: 'kalp_krizi_belirtileri' },
    { keywords: ['112', 'ambulans', 'acil servis çağ'], topic: 'acil_arama_112' },
    { keywords: ['omurga', 'boyun yaralan', 'omur'], topic: 'omurga_yaralanmasi' },
  ],
  
  trafik: [
    // YENİ KEYWORD'LER (öncelik için önce)
    { keywords: ['gece', 'sis', 'sisli', 'far', 'uzun far', 'kısa far', 'uzun huzme', 'kısa huzme'], topic: 'aydinlatma_sistemi' },
    { keywords: ['cep telefon', 'dikkat dağı'], topic: 'agresif_surucu' },
    { keywords: ['çocuk koltuğu', 'çocuk güvenlik', 'çocuk emniyet', 'yenidoğan', 'çocuk taşın', '10 yaş', 'bebek otomobil'], topic: 'arac_donanimi' },
    { keywords: ['karlı', 'buzlu', 'kayma', 'aquaplaning', 'su üzerinde kay', 'köprü buzlanma'], topic: 'lastik_bakimi' },
    { keywords: ['çöp', 'sigara izmar', 'cam dışar', 'çevreyi'], topic: 'korna_kullanimi' },
    { keywords: ['kaldırım', 'yaya yolu', 'bisiklet'], topic: 'yaya_iliskisi' },
    { keywords: ['egzoz susturucu', 'egzoz gaz', 'emisyon', 'rölanti'], topic: 'egzoz_arizalari' },
    { keywords: ['yük taşı', 'yükle', 'azami yük', 'azami ağırlık', 'yükün dağı'], topic: 'arac_donanimi' },
    { keywords: ['okul servisi', 'taksi', 'taksimet', 'ticari ar'], topic: 'arac_donanimi' },
    { keywords: ['yol çalışma', 'inşaat alan'], topic: 'trafik_isaretleri' },
    { keywords: ['lastik', 'kış lastiği', 'diş derinliği', 'patla'], topic: 'lastik_bakimi' },
    { keywords: ['mola', 'yorgun', 'uyku', 'dinlen'], topic: 'agresif_surucu' },
    { keywords: ['öfkeli', 'sinirli', 'agresif', 'alay etme', 'yarış', 'stres'], topic: 'agresif_surucu' },
    { keywords: ['yakıt tasarruf', 'çevreci sürüş', 'ekonomik sürüş'], topic: 'yakit_sistemi' },
    { keywords: ['fren pedal', 'frenleme', 'abs', 'kilitlenme'], topic: 'fren_sistemi' },
    { keywords: ['durma mesafe', 'tepki mesafe', 'algılama mesafe'], topic: 'takip_mesafesi' },
    { keywords: ['ilaç', 'antihistaminik', 'uyuşturucu', 'alkol'], topic: 'agresif_surucu' },
    { keywords: ['sigorta', 'kasko', 'mali sorumluluk', 'uluslararası sigorta'], topic: 'surucu_belgesi' },
    { keywords: ['yangın söndürücü', 'reflektör', 'üçgen reflektör', 'yangın söndürme'], topic: 'arac_donanimi' },
    { keywords: ['engelli park', 'engelli yer'], topic: 'park_yasaklari' },
    { keywords: ['viraj', 'merkezkaç', 'santrifüj'], topic: 'serit_kurallari' },
    { keywords: ['hemzemin geçit', 'bariyer'], topic: 'trafik_isaretleri' },
    { keywords: ['periyodik muayen', 'araç muayen', 'yıllık muayen'], topic: 'periyodik_bakim' },
    { keywords: ['hamile sürücü', 'hamile kemer'], topic: 'arac_donanimi' },
    { keywords: ['elektrikli araç', 'özel plaka'], topic: 'surucu_belgesi' },
    { keywords: ['trafik ceza', 'cezai itiraz'], topic: 'surucu_belgesi' },
    { keywords: ['trafik sıkış', 'sıkışıklık'], topic: 'serit_kurallari' },
    { keywords: ['trafik kanun', 'trafik yönetmel', 'karayolları kanun'], topic: 'surucu_belgesi' },
    { keywords: ['check engine', 'motor uyarı', 'gösterge panel', 'arıza ışığ', 'uyarı ışığ', 'hararet', 'aşırı ısın', 'abs lamba'], topic: 'ariza_belirtileri' },
    { keywords: ['antifriz', 'soğutma sıvı', 'soğutma görev'], topic: 'sogutma_sistemi' },
    { keywords: ['akü', 'akümülatör', 'akü bitm'], topic: 'aku_bakimi' },
    { keywords: ['yanlış yakıt', 'dizel benzin', 'benzin dizel'], topic: 'yakit_sistemi' },
    { keywords: ['yolda duran araç', 'arıza nedeniy', 'kazaya müdah'], topic: 'trafik_kazasi_durumu' },
    { keywords: ['trafik polisi', 'kollar iki yana'], topic: 'trafik_isaretleri' },
    { keywords: ['silecek', 'cam siliceği', 'ön cam'], topic: 'periyodik_bakim' },
    { keywords: ['direksiyon boşluk', 'direksiyon titre', 'tek tarafa çek'], topic: 'ariza_belirtileri' },
    { keywords: ['far ayar', 'farların doğru'], topic: 'aydinlatma_sistemi' },
    
    // MEVCUT KEYWORD'LER
    { keywords: ['tabela', 'levha', 'işaret', 'dur tabela', 'yol ver'], topic: 'trafik_isaretleri' },
    { keywords: ['kırmızı ışık', 'sarı ışık', 'yeşil ışık', 'trafik ışığ', 'trafik lamb'], topic: 'trafik_isiklari' },
    { keywords: ['hız limit', 'azami hız', '50 km', '90 km', '110 km', '120 km'], topic: 'hiz_limitleri' },
    { keywords: ['geçiş üstünlüğ', 'önc', 'sağdan gelen'], topic: 'gecit_ustunlugu' },
    { keywords: ['şerit', 'şerit değişt'], topic: 'serit_kurallari' },
    { keywords: ['sollama', 'sollay'], topic: 'sollama_kurallari' },
    { keywords: ['park ed', 'park yasa'], topic: 'park_yasaklari' },
    { keywords: ['duraklam', 'duraklayam'], topic: 'duraklama_kurallari' },
    { keywords: ['kavşak'], topic: 'kavsak_kurallari' },
    { keywords: ['eğim', 'yokuş', 'iniş', 'rampa'], topic: 'egimli_yol' },
    { keywords: ['yaya geçidi', 'yaya geç'], topic: 'yaya_gecidi' },
    { keywords: ['ambulans', 'polis arac', 'itfaiye'], topic: 'acil_araclar' },
    { keywords: ['otoyol', 'otoban', 'bölünmüş yol'], topic: 'tasit_yolu_kurallari' },
    { keywords: ['takip mesafe', 'iki saniye'], topic: 'takip_mesafesi' },
    { keywords: ['kör nokta', 'dikiz ayna'], topic: 'kor_nokta_dikiz' },
    { keywords: ['sürücü belge', 'ehliyet'], topic: 'surucu_belgesi' },
    { keywords: ['trafik kaza', 'kazaya'], topic: 'trafik_kazasi_durumu' },
    { keywords: ['tünel'], topic: 'tunel_kurallari' },
    { keywords: ['b sınıf', 'a2 sınıf', 'ehliyet sınıf'], topic: 'ehliyet_sinif_yetki' },
  ],
  
  motor: [
    // Mevcut keyword'ler (1 'diger' var, neredeyse mükemmel)
    { keywords: ['ağır vasıta', 'kamyon dingil', 'otobüs dingil', 'yay'], topic: 'arac_donanimi' },
    
    { keywords: ['lastik', 'tekerlek basınc'], topic: 'lastik_bakimi' },
    { keywords: ['motor yağ', 'yağ değiş', 'yağ seviyesi'], topic: 'motor_yagi' },
    { keywords: ['akü', 'akümülatör'], topic: 'aku_bakimi' },
    { keywords: ['fren', 'frenleme', 'fren sistemi'], topic: 'fren_sistemi' },
    { keywords: ['egzoz', 'duman'], topic: 'egzoz_arizalari' },
    { keywords: ['antifriz', 'soğutma sıvı', 'radyatör'], topic: 'sogutma_sistemi' },
    { keywords: ['far', 'lamba', 'sinyal'], topic: 'aydinlatma_sistemi' },
    { keywords: ['yakıt', 'benzin', 'dizel', 'lpg'], topic: 'yakit_sistemi' },
    { keywords: ['uyarı ışığ', 'arıza ışığ', 'arıza lambası'], topic: 'ariza_belirtileri' },
    { keywords: ['periyodik bakım', 'bakım'], topic: 'periyodik_bakim' },
    { keywords: ['yangın söndürücü', 'reflektör', 'ilk yardım çantası', 'üçgen'], topic: 'arac_donanimi' },
  ],
  
  trafik_adabi: [
    // YENİ KEYWORD'LER
    { keywords: ['yorgun', 'uykusuz', 'uzun iş günü'], topic: 'agresif_surucu' },
    { keywords: ['cep telefon'], topic: 'agresif_surucu' },
    { keywords: ['kazaya ilk ulaş', 'kaza yapan', 'kazaya müdah', 'park çarpı'], topic: 'yardimsever_surucu' },
    { keywords: ['çöp', 'sigara izmar', 'cam dışar'], topic: 'surucu_davranisi' },
    { keywords: ['sinirli', 'öfkeli', 'agresif'], topic: 'agresif_surucu' },
    { keywords: ['geç kald', 'randevu'], topic: 'agresif_surucu' },
    { keywords: ['dikkat dağı', 'arkadaş etki', 'video gös'], topic: 'agresif_surucu' },
    { keywords: ['hata kabul', 'olgun davran', 'olgun tutum'], topic: 'surucu_davranisi' },
    { keywords: ['bana bir şey olmaz', 'yıllardır böyle'], topic: 'agresif_surucu' },
    { keywords: ['şerit değiş', 'birkaç araç öne'], topic: 'agresif_surucu' },
    { keywords: ['kural koyma', 'kurallara uy', 'trafik kural'], topic: 'surucu_davranisi' },
    { keywords: ['herkes kural ihlal', 'ben yaparsam'], topic: 'surucu_davranisi' },
    { keywords: ['tünel'], topic: 'far_kullanim_etigi' },
    { keywords: ['sollama sonra'], topic: 'sollama_kurallari' },
    { keywords: ['saçaklı süs', 'yastık', 'oyuncak', 'arka cam', 'iç çamaşır', 'komik yaz'], topic: 'surucu_davranisi' },
    { keywords: ['lastik patla'], topic: 'lastik_bakimi' },
    { keywords: ['daha çabuk gid', 'hız bencil'], topic: 'agresif_surucu' },
    { keywords: ['birkaç bardak', 'alkol', 'içki'], topic: 'agresif_surucu' },
    
    // MEVCUT KEYWORD'LER
    { keywords: ['saygı', 'sabır', 'kızgın'], topic: 'surucu_davranisi' },
    { keywords: ['yaya'], topic: 'yaya_iliskisi' },
    { keywords: ['korna'], topic: 'korna_kullanimi' },
    { keywords: ['yaşlı', 'engelli', 'hamile'], topic: 'yardimsever_surucu' },
    { keywords: ['teşekkür', 'selam', 'yol ver'], topic: 'yol_verme_kibarligi' },
    { keywords: ['uzun far', 'kısa far', 'körleşt'], topic: 'far_kullanim_etigi' },
    { keywords: ['agresif', 'tehlikeli sür', 'aşırı hız'], topic: 'agresif_surucu' },
  ],
};

const UPDATE_BATCH_SIZE = 100;

function tagQuestion(q: QuestionRow): TopicId {
  const text = `${q.question_text} ${q.option_a} ${q.option_b} ${q.option_c} ${q.option_d} ${q.explanation ?? ''}`.toLowerCase();
  const list = KEYWORD_MAP[q.category] ?? [];

  for (const { keywords, topic } of list) {
    if (
      keywords.some((kw) => {
        const lowKw = kw.toLowerCase();
        // Kısa tek-kelime keyword'leri (≤5 karakter) için word boundary regex.
        // Aksi halde 'far' → 'fark', 'tarafından'; 'sis' → 'sistem' gibi yanlış eşleşmeler olur.
        if (lowKw.length <= 5 && !lowKw.includes(' ')) {
          const escaped = lowKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          return regex.test(text);
        }
        // Çok kelimeli veya uzun keyword'ler için includes yeterli (zaten spesifik).
        return text.includes(lowKw);
      })
    ) {
      return topic;
    }
  }

  return 'diger';
}

async function main(): Promise<void> {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Env eksik: EXPO_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY .env dosyasında dolu olmalı.',
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('🔍 Sorular yükleniyor...');
  const { data, error } = await supabase
    .from('questions')
    .select(
      'id, category, question_text, option_a, option_b, option_c, option_d, explanation',
    );

  if (error) {
    throw new Error(`Sorular alınamadı: ${error.message}`);
  }
  if (!data) {
    throw new Error('Soru bulunamadı.');
  }

  const questions = data as QuestionRow[];
  console.log(`📋 ${questions.length} soru bulundu, etiketleniyor...`);

  // Topic başına grupla
  const groups = new Map<TopicId, number[]>();
  for (const q of questions) {
    const topic = tagQuestion(q);
    if (!groups.has(topic)) groups.set(topic, []);
    groups.get(topic)!.push(q.id);
  }

  // Dağılımı yazdır (en çok eşleşenden aza)
  console.log('\n📊 Dağılım:');
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [topic, ids] of sorted) {
    console.log(`  ${topic}: ${ids.length}`);
  }
  const orphans = groups.get('diger')?.length ?? 0;
  console.log(`\n⚠️  Etiketsiz (diger): ${orphans} / ${questions.length}`);

  // Batch update — her topic için, 100'lük slice'lar
  console.log('\n💾 Veritabanı güncelleniyor...');
  let totalUpdated = 0;
  for (const [topic, ids] of groups.entries()) {
    let updatedForTopic = 0;
    for (let i = 0; i < ids.length; i += UPDATE_BATCH_SIZE) {
      const slice = ids.slice(i, i + UPDATE_BATCH_SIZE);
      const { error: updErr } = await supabase
        .from('questions')
        .update({ topic })
        .in('id', slice);
      if (updErr) {
        console.error(
          `❌ ${topic} (batch ${i}-${i + slice.length}) güncellenemedi: ${updErr.message}`,
        );
        continue;
      }
      totalUpdated += slice.length;
      updatedForTopic += slice.length;
    }
    console.log(`  ✅ ${topic} (${updatedForTopic})`);
  }

  console.log(
    `\n🎉 Tamamlandı: ${totalUpdated}/${questions.length} soru güncellendi.`,
  );
}

main().catch((err) => {
  console.error('💥 Hata:', err);
  process.exit(1);
});
