# Görev Listesi — Perde Dünyası

---

## Aktif Görev

- [ ] Supabase veri katmanı ve admin CRUD akışlarını tamamla

---

## Sıradaki (V1 Öncelik Sırası)

### 1. Altyapı Kurulumu
- [x] `pnpm create next-app perde-dunyasi` — Next.js, TypeScript, Tailwind, App Router
- [x] Supabase projesi oluştur (Supabase dashboard)
- [x] `.env.local` dosyası oluştur (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [x] `src/lib/supabase/client.ts` ve `server.ts` dosyalarını oluştur
- [ ] Vercel projesi oluştur, GitHub repo bağlantısı kur
- [ ] ESLint + Prettier konfigürasyonu

### 2. Veritabanı
- [x] Supabase SQL editöründe tabloları oluştur
- [x] RLS politikalarını ekle
- [x] `update_updated_at` trigger'larını ekle
- [x] Başlangıç kategorilerini (seed) ekle
- [x] Başlangıç site ayarlarını (seed) ekle
- [x] Supabase Storage: `product-images` bucket oluştur (public)

### 3. Tip Tanımları
- [x] `src/types/index.ts` — Category, Product, ProductImage, Campaign, Announcement, SiteSettings

### 4. API Katmanı
- [x] Auth API (login, logout, me)
- [x] Categories API (public + admin CRUD iskeleti)
- [x] Products API (public: list, single, featured iskeleti)
- [x] Products Admin API (CRUD iskeleti)
- [x] Product Images API (upload, reorder, set primary, delete iskeleti)
- [x] Campaigns API (public + admin CRUD iskeleti)
- [x] Announcements API (public + admin CRUD iskeleti)
- [x] Settings API (public read + admin write iskeleti)
- [x] WhatsApp redirect API
- [x] Slugify API

### 5. Global Layout
- [x] Header bileşeni (logo, nav, tema değiştirici, mobil hamburger)
- [x] Footer bileşeni
- [x] Tema sistemi (localStorage + dark class)
- [x] Root layout

### 6. Public Sayfalar
- [x] Ana sayfa
- [x] Ürün kataloğu sayfası
- [x] Ürün detay sayfası
- [x] Kampanyalar sayfası
- [x] Duyurular sayfası
- [x] Hakkımızda sayfası
- [x] İletişim sayfası
- [x] 404 sayfası

### 7. Admin Paneli
- [x] `/admin/login` sayfası
- [x] Admin middleware (oturum koruması)
- [x] Admin layout + sidebar
- [x] Dashboard
- [x] Ürün yönetimi (liste + form)
- [x] Kategori yönetimi
- [x] Kampanya yönetimi
- [x] Duyuru yönetimi
- [ ] Site ayarları

### 8. Test & Yayın
- [ ] Mobil responsive testleri (tüm sayfalar)
- [ ] WhatsApp link testi (gerçek cihazda)
- [ ] Admin akışı uçtan uca test (ürün ekle, düzenle, sil)
- [ ] Lighthouse performans testi
- [ ] Vercel production deployment

---

## Tamamlanan

- [x] Proje dokümantasyonu (project_docs) oluşturuldu — 2025-06-09
- [x] Next.js uygulama iskeleti kuruldu
- [x] Temel layout, tema sistemi ve public sayfa rotaları eklendi
- [x] Public API iskeleti oluşturuldu
- [x] Ürün katalog ve detay akışı eklendi
- [x] Admin dashboard, layout ve oturum koruması eklendi
- [x] Admin ürün yönetimi iskeleti eklendi
- [x] Admin kategori yönetimi iskeleti eklendi
- [x] Admin kampanya yönetimi iskeleti eklendi
- [x] Admin duyuru yönetimi iskeleti eklendi

---

## Engellenen

_Henüz engellenen görev yok._
