# Geliştirme Yol Haritası — Perde Dünyası

---

## V1 — Temel Vitrin (Mevcut Hedef)

Bu versiyon siteyi canlıya alacak minimum ürün.

### Altyapı
- [ ] Next.js 14 + Tailwind CSS proje kurulumu
- [ ] Supabase proje ve veritabanı kurulumu
- [ ] TypeScript konfigürasyonu
- [ ] ESLint + Prettier kurulumu
- [ ] Vercel deployment bağlantısı

### Veritabanı
- [ ] `categories`, `products`, `product_images`, `campaigns`, `announcements`, `site_settings` tablolarını oluştur
- [ ] RLS politikalarını tanımla
- [ ] `update_updated_at` trigger'larını ekle
- [ ] Başlangıç kategori verilerini (seed) yükle
- [ ] Başlangıç site ayarlarını (seed) yükle

### Public Sayfalar
- [ ] Global layout: Header, Footer, tema değiştirici
- [ ] Ana sayfa: Hero, Kategoriler, Öne Çıkan Ürünler, Kampanyalar, Duyurular, İletişim CTA
- [ ] Ürün kataloğu: liste, kategori filtresi, arama, sayfalama
- [ ] Ürün detay sayfası: galeri, açıklama, WhatsApp butonu
- [ ] Kampanyalar sayfası
- [ ] Duyurular sayfası
- [ ] Hakkımızda sayfası
- [ ] İletişim sayfası
- [ ] 404 sayfası

### Admin Paneli
- [ ] Admin giriş sayfası (`/admin/login`)
- [ ] Admin layout + sidebar navigasyonu
- [ ] Dashboard (özet istatistikler: ürün sayısı, kategori sayısı vb.)
- [ ] Ürün listesi (tablo — arama, sıralama, aktif/pasif toggle)
- [ ] Ürün ekle / düzenle formu (görsel upload dahil)
- [ ] Ürün silme (onay modalı)
- [ ] Kategori yönetimi (CRUD)
- [ ] Kampanya yönetimi (CRUD + görsel upload)
- [ ] Duyuru yönetimi (CRUD + yayınla/taslak)
- [ ] Site ayarları (WhatsApp numarası, iletişim bilgileri, sosyal medya)

### API Katmanı
- [ ] Auth API: login, logout, me
- [ ] Products API: public + admin CRUD
- [ ] Product Images API: upload, reorder, set primary, delete
- [ ] Categories API: public + admin CRUD
- [ ] Campaigns API: public + admin CRUD
- [ ] Announcements API: public + admin CRUD
- [ ] Settings API: public read + admin write
- [ ] WhatsApp redirect API

### Tema & Tasarım
- [ ] Açık/koyu tema sistemi (localStorage kalıcılığı dahil)
- [ ] Framer Motion temel animasyonlar (scroll reveal, hover)
- [ ] Mobil responsive kontrolü (tüm sayfalar)
- [ ] WhatsApp butonu görsel tasarımı (turuncu, belirgin)

---

## V2 — Gelişmiş Özellikler

V1 canlıya çıktıktan sonra kullanıcı geri bildirimine göre sıralama değişebilir.

- [ ] Ürün arama geliştirmesi: Türkçe karakter desteği, bulanık arama
- [ ] Kategori sayfaları için SEO optimizasyonu (JSON-LD, meta tag)
- [ ] Görsel optimizasyonu: Next.js Image + WEBP dönüşümü
- [ ] Admin: görsel yükleme sürükle-bırak (drag & drop) desteği
- [ ] Ana sayfa hero alanı: birden fazla slide (karusel)
- [ ] "Yeni Ürün" / "Kampanya" rozeti sistemi (ürün kartlarında)
- [ ] Admin: toplu ürün aktif/pasif yapma
- [ ] Lighthouse 95+ hedefine ulaşmak için performans iyileştirmeleri
- [ ] Google Analytics 4 entegrasyonu (opsiyonel, mağaza sahibi tercihi)

---

## V3 — SEO & Performans

- [ ] Tüm sayfalar için `sitemap.xml` otomatik üretimi
- [ ] `robots.txt` yapılandırması
- [ ] Open Graph ve Twitter Card meta tag'leri (her ürün ve sayfa için)
- [ ] Structured Data (JSON-LD): `Product`, `Organization`, `BreadcrumbList`
- [ ] Core Web Vitals iyileştirme: LCP, CLS, FID hedefleri
- [ ] Resim CDN cache politikası (Supabase Storage cache headers)
- [ ] ISR (Incremental Static Regeneration) ürün sayfaları için

---

## V4 — Gelecek (Değerlendirme Aşamasında)

Bu özellikler proje kapsamının genişlemesi durumunda eklenebilir. Henüz onaylanmamış.

- [ ] Çoklu dil desteği (Türkçe / İngilizce)
- [ ] Ürün yorumları / puanlama sistemi
- [ ] Hizmet alanı harita gösterimi
- [ ] Ziyaretçi istatistikleri (admin dashboard'da)
- [ ] Birden fazla admin hesabı
- [ ] Renk / boyut varyant sistemi (ürün başına alternatif seçenekler)

---

## İptal Edilen / Ertelenen

| Özellik             | Sebep                                        | Tarih      |
|---------------------|----------------------------------------------|------------|
| E-ticaret / sepet   | Kapsam dışı — mağaza tercihi WhatsApp satış  | 2025-06-09 |
| Müşteri hesabı      | Gerek yok — ziyaretçiler kayıt olmayacak     | 2025-06-09 |
| Canlı sohbet widget | WhatsApp butonu yeterli, ekstra yük oluşturur| 2025-06-09 |