# Mimari — Perde Dünyası

## Stack

| Katman           | Teknoloji           | Versiyon | Sebep                                                  |
|------------------|---------------------|----------|--------------------------------------------------------|
| Frontend         | Next.js             | 14+      | SSR/SSG ile SEO, App Router, tek repo yeterli          |
| Stil             | Tailwind CSS        | 3.4+     | Hız, dark mode, responsive kolaylığı                   |
| Animasyon        | Framer Motion       | 11+      | Smooth geçişler, scroll animasyonları                  |
| Veritabanı       | Supabase (Postgres) | —        | Managed DB + Storage + Auth tek pakette, kolay kurulum |
| Dosya Depolama   | Supabase Storage    | —        | Görsel upload, URL üretimi, bucket yönetimi            |
| Auth (Admin)     | Supabase Auth       | —        | Email+şifre, token yönetimi hazır                      |
| Deployment       | Vercel              | —        | Next.js native, ücretsiz başlangıç, CI/CD otomatik     |
| Paket Yöneticisi | pnpm                | 9+       | Hız ve disk verimliliği                                |

---

## Neden Ayrı Backend Yok?

Bu proje için bağımsız bir backend (NestJS, Express vb.) gereksizdir. Sebepler:
- İş mantığı basit: CRUD + WhatsApp link üretimi.
- Next.js API Routes tüm ihtiyacı karşılar.
- Supabase SDK doğrudan client veya server-side kullanılabilir.
- Deployment tek repo, tek servis: operasyonel yük minimum.

Eğer gelecekte gerçek e-ticaret, stok entegrasyonu veya karmaşık iş mantığı eklenirse backend ayrılır. Bu karar `DECISIONS.md`'de kayıtlıdır.

---

## Mimari Diyagramı

```
Browser
   │
   ▼
Next.js (Vercel)
   ├── /app (public pages — SSG/SSR)
   │     ├── page.tsx          → Ana sayfa
   │     ├── /urunler          → Ürün kataloğu
   │     ├── /urunler/[slug]   → Ürün detay
   │     ├── /kampanyalar      → Kampanyalar
   │     ├── /duyurular        → Duyurular
   │     ├── /hakkimizda       → Hakkımızda
   │     └── /iletisim         → İletişim
   │
   ├── /app/admin (protected — admin panel)
   │     ├── login             → Giriş
   │     ├── dashboard         → Özet ekran
   │     ├── urunler           → Ürün yönetimi
   │     ├── kategoriler       → Kategori yönetimi
   │     ├── kampanyalar       → Kampanya yönetimi
   │     ├── duyurular         → Duyuru yönetimi
   │     └── ayarlar           → Site ayarları
   │
   └── /api (Next.js API Routes — server side only)
         ├── /products         → Ürün endpoint'leri
         ├── /categories       → Kategori endpoint'leri
         ├── /campaigns        → Kampanya endpoint'leri
         ├── /announcements    → Duyuru endpoint'leri
         ├── /settings         → Site ayarları
         ├── /upload           → Görsel yükleme (admin)
         └── /auth             → Giriş/çıkış
              │
              ▼
         Supabase
           ├── PostgreSQL DB
           └── Storage (görseller)
```

---

## Klasör Mimarisi

`src/app` bazlı Next.js App Router (monorepo, tek repo):

```
perde-dunyasi/
├── src/
│   ├── app/                    ← Next.js App Router
│   │   ├── (public)/           ← Public route group
│   │   ├── (admin)/            ← Admin route group (korumalı)
│   │   └── api/                ← API routes
│   ├── components/
│   │   ├── ui/                 ← Temel UI bileşenleri (Button, Card, vb.)
│   │   ├── layout/             ← Header, Footer, Navbar
│   │   ├── product/            ← Ürünle ilgili bileşenler
│   │   ├── campaign/           ← Kampanya bileşenleri
│   │   └── admin/              ← Admin panel bileşenleri
│   ├── lib/
│   │   ├── supabase/           ← Supabase client/server kurulumu
│   │   ├── utils/              ← Yardımcı fonksiyonlar
│   │   └── validators/         ← Zod şemaları
│   ├── hooks/                  ← Custom React hooks
│   ├── types/                  ← TypeScript tip tanımları
│   └── styles/                 ← Global CSS
├── public/                     ← Statik dosyalar (logo, favicon)
├── project_docs/               ← Bu dokümantasyon
├── .clinerules
├── .env.local
└── package.json
```

---

## Veri Akışı

### Ziyaretçi Ürün Sayfası (SSR)
1. Browser → Next.js Server (SSR)
2. Next.js → Supabase DB (ürün verisi + görsel URL)
3. Next.js → Browser (HTML + JSON)
4. Browser → WhatsApp (kullanıcı butona tıklarsa)

### Admin Ürün Kaydetme
1. Admin Browser → Next.js API `/api/admin/products`
2. API → Supabase Storage (görsel yükleme)
3. API → Supabase DB (ürün kaydı)
4. API → Admin Browser (başarı/hata)

---

## Önemli Kısıtlamalar

- Supabase ücretsiz plan: 500MB DB, 1GB Storage. Yüzlerce ürün için yeterli; binleri aşarsa yükseltme gerekir.
- Vercel ücretsiz plan: Serverless function timeout 10s. API işlemleri bu sürede bitirilmeli.
- Görsel upload limiti: Ürün başına max 10 görsel, görsel başına max 5MB (Supabase Storage politikası).
- WhatsApp link sadece `wa.me` formatı kullanır; API entegrasyonu yoktur.
- Admin tek kullanıcı: çoklu admin hesabı V1'de kapsam dışı.