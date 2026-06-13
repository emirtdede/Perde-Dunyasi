<div align="center">

# 🪟 Perde Dünyası - Modern Curtain Store Web Application

[![](https://img.shields.io/badge/Language-English-blue?style=for-the-badge&logo=google-translate)](#english-version)
&nbsp;&nbsp;&nbsp;&nbsp;
[![](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red?style=for-the-badge&logo=google-translate)](#turkish-version)

---

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

<a id="english-version"></a>
# English Version

A modern, highly-responsive, and full-stack web application designed for a curtain and window blinds retail store ("Perde Dünyası"). It features a premium user interface to showcase products, catalogs, announcements, and active campaigns, backed by a secure admin panel for content management.

## 🚀 Key Features

*   **🛍️ Product Showcase & Catalog**: Dynamic browsing of curtains and blinds categories with modern image optimization powered by `sharp`.
*   **📢 Campaigns & Announcements**: Interactive modules displaying current seasonal discounts, store news, and special deals.
*   **🔐 Admin Control Dashboard**: A secure portal allowing store owners to edit catalog listings, manage products, and update contact information.
*   **🔌 Supabase Integration**: Reliable cloud database integration using `@supabase/supabase-js` for real-time data sync.
*   **🎨 Next-Gen Styling**: Built with Tailwind CSS v4 and vanilla PostCSS layouts for smooth animations and high-fidelity visuals.
*   **🛡️ Type Safe & Robust**: Written in TypeScript with strict type checking and ESLint rules.

---

## 📁 Project Structure

The project follows a standard Next.js App Router structure:

```text
perde-dunyasi/
├── app/                       # App Router routes and pages
│   ├── admin/                 # Admin panel view and configurations
│   ├── api/                   # Serverless API endpoints
│   ├── duyurular/             # Announcements page
│   ├── hakkimizda/            # About Us page
│   ├── iletisim/              # Contact page
│   ├── kampanyalar/           # Campaigns and promotions
│   ├── katalog/               # Digital catalog page
│   └── urunler/               # Product category listings
├── public/                    # Static assets (favicons, icons, store images)
├── src/                       # Shared components, hooks, and utilities
├── supabase/                  # Database migration files and client config
├── next.config.ts             # Next.js configurations
└── package.json               # Dependencies and scripts
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/emirtdede/Perde-Dunyasi.git
cd Perde-Dunyasi/perde-dunyasi
```

### 2. Install Dependencies
Make sure you have Node.js 18+ installed. You can use `npm` or `pnpm`:
```bash
npm install
```

### 3. Run Locally
Start the local development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## ⚖️ License
This project is licensed under the [MIT License](LICENSE).

---

<a id="turkish-version"></a>
# Türkçe Versiyon

Bir perde ve jaluzi perakende mağazası ("Perde Dünyası") için tasarlanmış, modern, duyarlı (responsive) ve tam donanımlı (full-stack) bir web uygulamasıdır. Ürünlerin, dijital katalogların, duyuruların ve aktif kampanyaların sergilendiği şık bir kullanıcı arayüzü ile içerik yönetimini kolaylaştıran güvenli bir admin panelini içerir.

## 🚀 Öne Çıkan Özellikler

*   **🛍️ Ürün Vitrini & Katalog**: `sharp` kütüphanesiyle optimize edilmiş yüksek kaliteli görseller eşliğinde perde ve jaluzi kategorilerinin dinamik olarak sergilenmesi.
*   **📢 Kampanyalar & Duyurular**: Sezonluk indirimlerin, mağaza haberlerinin ve özel fırsatların gösterildiği etkileşimli modüller.
*   **🔐 Admin Yönetim Paneli**: Mağaza yöneticilerinin katalog listelerini düzenlemesine, yeni ürün eklemesine ve iletişim bilgilerini güncellemesine olanak tanıyan güvenli panel.
*   **🔌 Supabase Entegrasyonu**: Gerçek zamanlı veri senkronizasyonu sağlayan `@supabase/supabase-js` tabanlı bulut veritabanı entegrasyonu.
*   **🎨 Yeni Nesil Tasarım**: Gelişmiş geçiş efektleri ve modern görünüm için Tailwind CSS v4 ve PostCSS altyapısı.
*   **🛡️ Güvenli Kodlama**: TypeScript ile yazılmış tip güvenli bileşenler ve ESLint standartları.

---

## 📁 Proje Yapısı

Proje, standart Next.js App Router yapısını takip etmektedir:

```text
perde-dunyasi/
├── app/                       # Uygulama yönlendiricisi (App Router) sayfaları
│   ├── admin/                 # Yönetim paneli görünümleri ve ayarları
│   ├── api/                   # Sunucusuz API uç noktaları
│   ├── duyurular/             # Mağaza duyuruları sayfası
│   ├── hakkimizda/            # Hakkımızda sayfası
│   ├── iletisim/              # İletişim sayfası
│   ├── kampanyalar/           # Kampanyalar ve promosyonlar sayfası
│   ├── katalog/               # Dijital kataloglar sayfası
│   └── urunler/               # Ürün kategorileri ve listelemeleri
├── public/                    # Statik dosyalar (logolar, ikonlar, resimler)
├── src/                       # Ortak bileşenler, kancalar (hooks) ve yardımcı araçlar
├── supabase/                  # Veritabanı yapılandırmaları ve Supabase istemcisi
├── next.config.ts             # Next.js yapılandırmaları
└── package.json               # Bağımlılıklar ve çalıştırma komutları
```

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/emirtdede/Perde-Dunyasi.git
cd Perde-Dunyasi/perde-dunyasi
```

### 2. Bağımlılıkları Yükleyin
Bilgisayarınızda Node.js 18+ kurulu olduğundan emin olun:
```bash
npm install
```

### 3. Geliştirme Ortamında Çalıştırın
Yerel geliştirme sunucusunu başlatmak için:
```bash
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresini ziyaret edin.

---

## ⚖️ Lisans
Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
