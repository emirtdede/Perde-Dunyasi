# Değişiklik Geçmişi

## 2026-06-10
- Supabase PostgreSQL veritabanı şeması ve seed verileri (`supabase/schema.sql`) oluşturuldu.
- Supabase ve local in-memory fallback destekleyen çift modlu merkezi veri servis katmanı (`src/lib/supabase/db.ts`) yazıldı.
- Tüm public sayfa rotaları ve public API rotaları veritabanına bağlandı.
- Kategori, ürün, kampanya, duyuru ve site ayarları için tüm admin CRUD API rotaları (`api/admin/...`) yazıldı.
- Admin panelindeki ürün, kategori, kampanya ve duyuru yönetim formları fetch API istekleri ve `router.refresh()` ile dinamik hale getirildi.
- Yeni "Site Ayarları" yönetim paneli ve formu (`admin-settings-manager.tsx`) oluşturularak `/admin/ayarlar` sayfasına bağlandı.

## 2026-06-09
- Next.js vitrin iskeleti genişletildi
- Temel layout, tema sistemi, header ve footer eklendi
- Public sayfa rotaları oluşturuldu
- Public API iskeleti ve mock veri katmanı eklendi
- WhatsApp yönlendirmesi ürün slug'ına bağlanmaya başlandı
- Ürün katalog kartları ve detay sayfası eklendi
- Admin dashboard, layout, sidebar ve oturum koruması eklendi
- Admin ürün yönetimi iskeleti eklendi
- Admin kategori yönetimi iskeleti eklendi
- Admin kampanya yönetimi iskeleti eklendi
- Admin duyuru yönetimi iskeleti eklendi

## 2025-06-09
- Proje dokümantasyonu oluşturuldu
