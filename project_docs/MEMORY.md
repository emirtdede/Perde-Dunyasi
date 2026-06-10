# Proje Hafızası — Perde Dünyası

Son güncelleme: 2026-06-10

## Proje Özeti
Perde Dünyası, Adıyaman'daki bir perde mağazası için geliştirilen vitrin web sitesidir.
Ziyaretçiler ürünleri inceler, kampanya ve duyuruları görür, ürün detayından WhatsApp teklifine yönlenir.
Mağaza sahibi içerikleri admin panelinden yönetir.

## Teknik Özet
- Frontend: Next.js 16, App Router, TypeScript
- Stil: Tailwind CSS 4
- Veritabanı: Supabase (PostgreSQL 15)
- Auth (Admin): Supabase Auth hedefli, yerel cookie tabanlı koruma ile entegre
- Dosya: Supabase Storage hedefli (product-images bucket)
- Geliştirme Modu: Çift modlu (Supabase bağlantısı yoksa in-memory mock veritabanına otomatik fallback)
- Deployment: Vercel

## Şu Anki Durum
- Tamamlanan: Proje iskeleti, tema sistemi, public sayfa rotaları, tüm API rotaları (public + admin CRUD), admin dashboard, kategori/ürün/kampanya/duyuru/site ayarları yönetim ekranları, gerçek veri katmanı (db.ts) ve PostgreSQL şeması (schema.sql)
- Devam eden: Görsel yükleme süreçlerinin Supabase Storage entegrasyonu
- Sıradaki: Canlı Supabase ortamında uçtan uca testler ve Vercel deployment

## Son Yapılan İş
- Supabase ve local in-memory fallback destekleyen çift modlu merkezi veri servis katmanı (`src/lib/supabase/db.ts`) yazıldı.
- Kategori, ürün, kampanya, duyuru ve site ayarları için tüm admin CRUD API rotaları (`api/admin/...`) ve public API rotaları veritabanına bağlandı.
- Admin paneli yönetim ekranlarındaki (ürün, kategori, kampanya, duyuru) formlar API rotalarına fetch istekleriyle bağlandı, başarı/hata durumları ve `router.refresh()` entegre edildi.
- Yeni "Site Ayarları" yönetim paneli (`admin-settings-manager.tsx`) oluşturularak `/admin/ayarlar` sayfasına bağlandı.
- Supabase SQL editöründe çalıştırılmak üzere `supabase/schema.sql` veritabanı şeması ve başlangıç seed verileri oluşturuldu.

## Dikkat Edilmesi Gerekenler
- Satın alma sistemi OLMAYACAK, WhatsApp yönlendirmesi esas akış.
- Admin tek kullanıcı.
- WhatsApp linkleri daima `wa.me` formatında olmalı.
- `service_role` browser tarafına çıkmamalı.

## Açık Sorunlar
- Gerçek Supabase ortam değişkenleri henüz tanımlanmadı (bu durumda sistem mock veri tabanını kullanarak hatasız çalışır).
