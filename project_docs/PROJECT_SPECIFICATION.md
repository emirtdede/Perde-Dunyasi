# Perde Dünyası — Proje Spesifikasyonu

## Proje Amacı

Perde Dünyası'nın ürünlerini sergilediği, ziyaretçilerin WhatsApp üzerinden fiyat teklifi alabileceği ve mağaza sahibinin yazılımcıya ihtiyaç duymadan yönetebileceği modern bir vitrin web sitesi.

---

## Hedef Kullanıcılar

- **Ziyaretçi (Müşteri Adayı):** Perde, tül, stor, jaluzi gibi ürünleri inceleyen ve WhatsApp üzerinden fiyat teklifi almak isteyen kişiler.
- **Mağaza Sahibi (Admin):** Ürün, kategori, kampanya ve duyuru yönetimi yapan, siteyi güncel tutmakla sorumlu kişi.

---

## Temel Özellikler

### Ziyaretçi Tarafı
- Ana sayfa: hero banner, öne çıkan ürünler, aktif kampanyalar, son duyurular
- Ürün kataloğu: kategoriye göre filtreleme, ürün arama
- Ürün detay sayfası: fotoğraf galerisi, açıklama, WhatsApp fiyat teklifi butonu
- Kampanyalar sayfası: aktif indirim ve tekliflerin listesi
- Duyurular sayfası: mağaza haberleri, yeni koleksiyonlar
- Hakkımızda sayfası: mağaza bilgisi, konum, iletişim
- Açık / Koyu tema desteği (sistem tercihine göre otomatik, kullanıcı elle değiştirebilir)
- Mobil öncelikli, tamamen responsive tasarım

### WhatsApp Teklif Sistemi
- Her ürün sayfasında "Fiyat Teklifi Al" butonu
- Tıklandığında WhatsApp uygulamasını açar
- Mesaj otomatik doldurul: ürün adı, kategorisi ve kısa açıklaması ön yazı olarak gelir
- WhatsApp numarası admin panelinden değiştirilebilir

### Admin Paneli
- Tek kullanıcı: mağaza sahibi (email + şifre ile giriş)
- Ürün yönetimi: ekleme, düzenleme, silme, aktif/pasif yapma, öne çıkarma
- Fotoğraf yükleme: ürün başına birden fazla görsel desteklenir
- Kategori yönetimi: ekleme, düzenleme, sıralama, aktif/pasif
- Kampanya yönetimi: başlık, açıklama, görsel, indirim metni, tarih aralığı
- Duyuru yönetimi: başlık, içerik, yayınla/taslak
- Site ayarları: WhatsApp numarası, adres, telefon, sosyal medya linkleri, hakkımızda metni

---

## İş Kuralları

- Sitede alışveriş sepeti veya ödeme sistemi **kesinlikle olmayacak**.
- Fiyatlar ürün kartlarında gösterilebilir (admin isteğe bağlı fiyat girebilir), ancak ödeme web üzerinden yapılmaz.
- Admin paneli `/admin` yolu altında bulunur ve giriş yapmadan erişilemez.
- Kampanya bitiş tarihi geçen kampanyalar otomatik olarak "pasif" duruma geçer.
- Her ürün en az bir kategoriye ait olmalıdır.
- Görseller Supabase Storage'da tutulur; ürün silindiğinde görseller de silinir.
- WhatsApp numarası tanımlanmamışsa "Fiyat Teklifi Al" butonu gösterilmez; admin uyarılır.
- Duyurular tarihten bağımsız olarak admin "Yayınla" butonuna basana kadar aktif olmaz.

---

## Yetki Sistemi

| Yetki          | Ziyaretçi | Admin |
|----------------|-----------|-------|
| Ürünleri görme | ✓         | ✓     |
| WhatsApp teklif| ✓         | ✓     |
| Kampanya görme | ✓         | ✓     |
| Duyuru görme   | ✓         | ✓     |
| Ürün CRUD      | ✗         | ✓     |
| Kategori CRUD  | ✗         | ✓     |
| Kampanya CRUD  | ✗         | ✓     |
| Duyuru CRUD    | ✗         | ✓     |
| Site ayarları  | ✗         | ✓     |
| Görsel yükleme | ✗         | ✓     |

---

## Monetizasyon

Yok. Proje tamamen tanıtım ve müşteri yönlendirme amaçlıdır. Gelir doğrudan WhatsApp üzerinden mağaza iletişimiyle sağlanır.

---

## Teknik Gereksinimler

- Node.js sürümü: 20+
- Tarayıcı desteği: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Mobil uyumluluk: Zorunlu — tüm sayfalar 320px genişliğe kadar sorunsuz çalışmalı
- SEO: Ürün ve kategori sayfaları meta tag, Open Graph ve yapısal veri (JSON-LD) ile desteklenecek
- Performans hedefi: Lighthouse skoru 90+ (mobil), 95+ (masaüstü)
- Erişilebilirlik: WCAG 2.1 AA standardı

---

## Kapsam Dışı (Şu An)

- Ödeme / sepet / e-ticaret
- Kullanıcı kaydı / giriş (müşteri tarafı)
- Ürün karşılaştırma
- Stok takibi
- Fatura / sipariş yönetimi
- Çok dilli destek