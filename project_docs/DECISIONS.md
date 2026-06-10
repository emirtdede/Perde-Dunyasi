# Mimari Kararlar — Perde Dünyası

---

## ADR-001 — Supabase Seçimi (Ayrı Backend Yok)
Tarih: 2025-06-09
Durum: Aktif

**Karar:** Ayrı backend servisi (NestJS, Express vb.) yerine Next.js API Routes + Supabase kullanılacak.

**Sebep:**
Projenin kapsamı CRUD işlemleri ve WhatsApp link üretiminden ibaret. Bu iş mantığı için
ayrı bir backend servisi gereksiz karmaşıklık ve operasyonel yük oluşturur.
Supabase; veritabanı, dosya depolama ve auth'u tek pakette sağlar.
Vercel üzerinde tek deployment yeterli.

**Alternatifler değerlendirildi:**
- NestJS backend: Aşırı mühendislik, çift deployment, çift maliyet
- Firebase: Supabase daha güçlü SQL desteği, daha kolay migrasyon
- PlanetScale + Cloudinary: Birden fazla servis = daha fazla karmaşıklık

**Sonuç:** Supabase seçildi. Gelecekte gerçek e-ticaret gerekirse backend ayrılır.

---

## ADR-002 — Tek Admin Kullanıcı
Tarih: 2025-06-09
Durum: Aktif

**Karar:** V1'de tek admin hesabı desteklenecek. Çoklu admin V1 dışı.

**Sebep:**
Tek mağaza sahibi var. Çoklu admin için rol/yetki sistemi gerekir; bu ek karmaşıklık
gereksiz. Supabase Auth'ta tek kullanıcı oluşturmak yeterli.

**Not:** V4 roadmap'inde çoklu admin değerlendirilebilir.

---

## ADR-003 — WhatsApp Linki (API Yok)
Tarih: 2025-06-09
Durum: Aktif

**Karar:** WhatsApp Business API entegrasyonu yapılmayacak. `wa.me` yönlendirme linki kullanılacak.

**Sebep:**
WhatsApp Business API ücretli ve mesaj şablonu onayı gerektiriyor.
`wa.me` formatı ücretsiz, anlık ve mesaj içeriği dinamik olabilir.
Mağaza sahibi zaten WhatsApp'ı aktif kullanıyor.

**Kısıt:** Kullanıcı bir kez WhatsApp uygulamasına geçmeli. Browser'dan otomatik mesaj gönderilemez.

---

## ADR-004 — Tailwind CSS Dark Mode Stratejisi
Tarih: 2025-06-09
Durum: Aktif

**Karar:** `class` stratejisi kullanılacak (`darkMode: 'class'` tailwind.config'de). Sistem tercihine göre otomatik başlar, kullanıcı değiştirebilir, `localStorage`'a kaydedilir.

**Sebep:**
`media` stratejisi kullanıcı kontrolü sağlamaz. `class` stratejisi JavaScript ile toggle edilebilir.

**Uygulama:** `html` etiketine `dark` class'ı eklenip çıkarılır. Script `<head>`'de çalışır (FOUC önlenir).

---

## ADR-005 — Fiyat Alanı Opsiyonel
Tarih: 2025-06-09
Durum: Aktif

**Karar:** `products.price` nullable. Admin fiyat girmeyebilir.

**Sebep:**
Bazı ürünlerin fiyatı ölçü ve malzeme seçimine göre değişir. Sabit fiyat vermek
müşteri beklentisini yanlış yönetebilir. Fiyat girilmezse UI'da "Fiyat için iletişim"
gösterilir ve WhatsApp butonu daha belirgin hale gelir.

---

## ADR-006 — Görsel Depolama (Supabase Storage)
Tarih: 2025-06-09
Durum: Aktif

**Karar:** Ürün görselleri Supabase Storage'da `product-images` public bucket'ında tutulur.

**Sebep:**
Supabase Storage, Supabase DB ile entegre. Tek panel'den yönetim mümkün.
URL'ler CDN ile sunulur. Ücretsiz planda 1GB Storage yeterli başlangıç için.

**Kısıt:** 1GB üst sınırda Supabase Pro'ya geçiş gerekir (~25 USD/ay).
500 ürün × 10 görsel × ortalama 150KB = ~750MB. Ücretsiz planda sıkışabilir.

**Önlem:** Görsel başına 5MB limit, WEBP/JPEG tercih.

---

## ADR-007 — Vercel Deployment
Tarih: 2025-06-09
Durum: Aktif

**Karar:** Deployment platformu olarak Vercel kullanılacak.

**Sebep:**
Next.js'in üreticisi Vercel, App Router ile en iyi entegrasyonu sağlar.
Ücretsiz hobby planı bu proje ölçeği için yeterli.
GitHub'a push ile otomatik deployment. Preview URL'ler admin'in incelemesi için kullanışlı.

**Kısıt:** Hobby planında Serverless Function timeout 10s. API işlemleri bu limitte kalmalı.