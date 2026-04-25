// Konu (topic) meta verisi — Plan A: etiketleme; Plan B: UI'da kullanılacak.
// scripts/auto-tag-questions.ts ile manuel sync (TopicId union iki yerde).

import type { QuestionCategory } from '@/types/database';

export type TopicId =
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

export type TopicMeta = {
  id: TopicId;
  label: string;
  description: string;
  emoji: string;
  category: QuestionCategory | 'diger';
};

export const TOPICS: TopicMeta[] = [
  // İlk Yardım
  { id: 'kalp_masaji', label: 'Kalp Masajı (CPR)', description: 'Yetişkinde kalp masajı uygulama', emoji: '🫀', category: 'ilk_yardim' },
  { id: 'bilinc_kontrolu', label: 'Bilinç Kontrolü', description: 'Yaralının bilincini değerlendirme', emoji: '👁️', category: 'ilk_yardim' },
  { id: 'suni_solunum', label: 'Suni Solunum', description: 'Ağız ağıza kurtarıcı solunum', emoji: '🫁', category: 'ilk_yardim' },
  { id: 'kanama_kontrolu', label: 'Kanama Kontrolü', description: 'Dış ve iç kanama müdahalesi', emoji: '🩸', category: 'ilk_yardim' },
  { id: 'kirik_cikik_burkulma', label: 'Kırık ve Çıkık', description: 'Kemik yaralanmaları', emoji: '🦴', category: 'ilk_yardim' },
  { id: 'yanik_tedavisi', label: 'Yanık Tedavisi', description: 'Yanık tipleri ve müdahale', emoji: '🔥', category: 'ilk_yardim' },
  { id: 'sok_belirtileri', label: 'Şok ve Belirtileri', description: 'Şok durumu ve müdahale', emoji: '⚡', category: 'ilk_yardim' },
  { id: 'zehirlenme', label: 'Zehirlenme', description: 'Gıda, gaz, kimyasal zehirlenme', emoji: '☠️', category: 'ilk_yardim' },
  { id: 'kalp_krizi_belirtileri', label: 'Kalp Krizi', description: 'Belirtiler ve müdahale', emoji: '💔', category: 'ilk_yardim' },
  { id: 'acil_arama_112', label: '112 Acil Arama', description: 'Acil servis ile iletişim', emoji: '🚨', category: 'ilk_yardim' },
  { id: 'omurga_yaralanmasi', label: 'Omurga Yaralanması', description: 'Boyun ve omurga koruma', emoji: '🧠', category: 'ilk_yardim' },

  // Trafik
  { id: 'trafik_isaretleri', label: 'Trafik İşaretleri', description: 'Tabela ve levha anlamları', emoji: '🚸', category: 'trafik' },
  { id: 'trafik_isiklari', label: 'Trafik Işıkları', description: 'Kırmızı, sarı, yeşil ışık', emoji: '🚦', category: 'trafik' },
  { id: 'hiz_limitleri', label: 'Hız Limitleri', description: 'Yerleşim, otoyol, şehirlerarası', emoji: '⚡', category: 'trafik' },
  { id: 'gecit_ustunlugu', label: 'Geçiş Üstünlüğü', description: 'Sağdan gelen ve öncelik', emoji: '↩️', category: 'trafik' },
  { id: 'serit_kurallari', label: 'Şerit Kuralları', description: 'Şerit kullanımı ve değiştirme', emoji: '🛣️', category: 'trafik' },
  { id: 'sollama_kurallari', label: 'Sollama Kuralları', description: 'Sol şeritten geçiş', emoji: '⬅️', category: 'trafik' },
  { id: 'park_yasaklari', label: 'Park Yasakları', description: 'Park edilemeyecek yerler', emoji: '🅿️', category: 'trafik' },
  { id: 'duraklama_kurallari', label: 'Duraklama Kuralları', description: 'Geçici durma kuralları', emoji: '🛑', category: 'trafik' },
  { id: 'kavsak_kurallari', label: 'Kavşak Kuralları', description: 'Kavşaklarda öncelik', emoji: '✚', category: 'trafik' },
  { id: 'egimli_yol', label: 'Eğimli Yol', description: 'Yokuş ve iniş kuralları', emoji: '⛰️', category: 'trafik' },
  { id: 'yaya_gecidi', label: 'Yaya Geçidi', description: 'Yaya öncellik kuralları', emoji: '🚶', category: 'trafik' },
  { id: 'acil_araclar', label: 'Acil Araçlar', description: 'Ambulans, polis, itfaiye', emoji: '🚑', category: 'trafik' },
  { id: 'tasit_yolu_kurallari', label: 'Otoyol Kuralları', description: 'Bölünmüş yol ve otoyol', emoji: '🛣️', category: 'trafik' },
  { id: 'takip_mesafesi', label: 'Takip Mesafesi', description: 'Güvenli takip mesafesi', emoji: '📏', category: 'trafik' },
  { id: 'kor_nokta_dikiz', label: 'Kör Nokta', description: 'Aynalar ve kör nokta', emoji: '🪞', category: 'trafik' },
  { id: 'surucu_belgesi', label: 'Sürücü Belgesi', description: 'Ehliyet türleri ve geçerlilik', emoji: '🪪', category: 'trafik' },
  { id: 'trafik_kazasi_durumu', label: 'Trafik Kazası', description: 'Kaza sonrası yapılacaklar', emoji: '💥', category: 'trafik' },
  { id: 'tunel_kurallari', label: 'Tünel Kuralları', description: 'Tünelde sürüş kuralları', emoji: '🌉', category: 'trafik' },
  { id: 'ehliyet_sinif_yetki', label: 'Ehliyet Sınıfları', description: 'B, A2 ve diğer yetkiler', emoji: '🎖️', category: 'trafik' },

  // Motor
  { id: 'lastik_bakimi', label: 'Lastik Bakımı', description: 'Basınç ve lastik kontrolü', emoji: '🛞', category: 'motor' },
  { id: 'motor_yagi', label: 'Motor Yağı', description: 'Yağ kontrolü ve değişimi', emoji: '🛢️', category: 'motor' },
  { id: 'aku_bakimi', label: 'Akü Bakımı', description: 'Akü ve elektrik sistemi', emoji: '🔋', category: 'motor' },
  { id: 'fren_sistemi', label: 'Fren Sistemi', description: 'Frenler ve kontrol', emoji: '🛑', category: 'motor' },
  { id: 'egzoz_arizalari', label: 'Egzoz Sistemi', description: 'Duman renkleri ve arızalar', emoji: '💨', category: 'motor' },
  { id: 'sogutma_sistemi', label: 'Soğutma Sistemi', description: 'Antifriz ve radyatör', emoji: '🌡️', category: 'motor' },
  { id: 'aydinlatma_sistemi', label: 'Aydınlatma', description: 'Farlar ve sinyal lambaları', emoji: '💡', category: 'motor' },
  { id: 'yakit_sistemi', label: 'Yakıt Sistemi', description: 'Benzin, dizel, LPG', emoji: '⛽', category: 'motor' },
  { id: 'ariza_belirtileri', label: 'Arıza Belirtileri', description: 'Uyarı ışıkları', emoji: '⚠️', category: 'motor' },
  { id: 'periyodik_bakim', label: 'Periyodik Bakım', description: 'Düzenli bakım gerekleri', emoji: '🔧', category: 'motor' },
  { id: 'arac_donanimi', label: 'Araç Donanımı', description: 'Zorunlu ekipmanlar', emoji: '🧰', category: 'motor' },

  // Trafik Adabı
  { id: 'surucu_davranisi', label: 'Sürücü Davranışı', description: 'Saygılı ve sabırlı sürüş', emoji: '😊', category: 'trafik_adabi' },
  { id: 'yaya_iliskisi', label: 'Yaya İlişkisi', description: 'Yayalara saygı', emoji: '🚶', category: 'trafik_adabi' },
  { id: 'korna_kullanimi', label: 'Korna Kullanımı', description: 'Doğru korna etiketi', emoji: '📢', category: 'trafik_adabi' },
  { id: 'yardimsever_surucu', label: 'Yardımsever Sürüş', description: 'Yaşlı, engelli, acil araç', emoji: '🤝', category: 'trafik_adabi' },
  { id: 'yol_verme_kibarligi', label: 'Yol Verme', description: 'Teşekkür ve selamlaşma', emoji: '🙏', category: 'trafik_adabi' },
  { id: 'far_kullanim_etigi', label: 'Far Kullanımı', description: 'Uzun far ve körleştirme', emoji: '💡', category: 'trafik_adabi' },
  { id: 'agresif_surucu', label: 'Agresif Sürüş', description: 'Tehlikeli davranışlar', emoji: '😤', category: 'trafik_adabi' },

  // Diğer
  { id: 'diger', label: 'Diğer', description: 'Etiketlenemeyen sorular', emoji: '📝', category: 'diger' },
];
