# Sözlük — Perde Dünyası

Bu dosya projeye özgü terimleri tanımlar.
Ajan kod yazarken ve dokümantasyon oluştururken bu terimleri tutarlı kullanmalıdır.

---

## Kullanıcı Tipleri

- **Ziyaretçi:** Kayıt olmadan siteyi gezen kullanıcı. Ürünleri görür, WhatsApp teklifi alabilir. Hesabı yoktur.
- **Admin / Mağaza Sahibi:** Tek admin kullanıcısı. Email+şifre ile `/admin` paneline giriş yapar. Tüm içeriği yönetir.

---

## İş Terimleri

- **Ürün:** Mağazada satılan perde, tül, stor, jaluzi vb. bir kalem. DB: `products` tablosu.
- **Kategori:** Ürünlerin gruplandığı ana başlık (Stor Perdeler, Tül Perdeler vb.). DB: `categories` tablosu.
- **Kampanya:** Belirli bir süre veya süresiz geçerli indirim/teklif. DB: `campaigns` tablosu.
- **Duyuru:** Mağaza haberleri, yeni koleksiyon bildirimleri, önemli notlar. DB: `announcements` tablosu.
- **Fiyat Teklifi:** Ziyaretçinin WhatsApp üzerinden mağazadan fiyat istemesi. Sistem içinde ödeme yoktur.
- **WhatsApp Butonu:** Her ürün sayfasında bulunan, WhatsApp'ı önceden doldurulmuş mesajla açan buton.
- **Öne Çıkan Ürün:** `is_featured = true` olan ürün. Ana sayfada ayrı bölümde gösterilir.
- **Aktif/Pasif:** Ürün, kategori veya kampanyanın `is_active` durumu. Pasif olanlar ziyaretçilere gösterilmez.
- **Taslak:** `is_published = false` olan duyuru. Sadece admin görebilir.
- **Site Ayarları:** `site_settings` tablosunda tutulan, admin panelinden değiştirilebilen yapılandırma değerleri (WhatsApp numarası, adres vb.).

---

## Ürün Türleri (Örnekler — Kategori Adları)

- **Stor Perde:** Rulo mekanizmalı, yukarı-aşağı açılan perde.
- **Tül Perde:** Yarı saydam, genellikle beyaz veya krem rengi ince kumaş perde.
- **Fon Perde:** Kalın, ışık geçirmeyen veya az geçiren dekoratif perde.
- **Jaluzi:** Yatay veya dikey lamellere sahip ayarlanabilir perde sistemi.
- **Perde Aksesuarları:** Korniş, perde bandı, kanca, ray gibi yardımcı ürünler.

---

## Teknik Terimler

- **Slug:** URL'de kullanılan, Türkçe karakter içermeyen, tire ile ayrılmış kısa metin. Örnek: `zebra-stor-perde-bej`.
- **Primary Görsel:** Ürünün `is_primary = true` olan, kart ve detay sayfasında önce gösterilen görseli.
- **SSR:** Server-Side Rendering — Next.js'in her istekte sunucuda HTML üretmesi.
- **SSG:** Static Site Generation — Next.js'in build zamanında HTML üretmesi (ürün detay sayfaları için kullanılır).
- **ISR:** Incremental Static Regeneration — SSG ile üretilmiş sayfaların belirli aralıkta yeniden üretilmesi.
- **RLS:** Row Level Security — Supabase'in DB satır düzeyinde erişim kontrolü.
- **Service Role:** Supabase'in RLS'yi bypass eden admin key'i. Sadece sunucu tarafında kullanılır.
- **Anon Key:** Supabase'in public (RLS'ye tabi) key'i. İstemci tarafında kullanılabilir.
- **wa.me:** WhatsApp'ın resmi yönlendirme URL formatı: `https://wa.me/{telefon}?text={mesaj}`.

---

## Kullanılmayacak Terimler

| Yanlış          | Doğru                  | Sebep                               |
|-----------------|------------------------|-------------------------------------|
| "Ürün satışı"   | "Fiyat teklifi"        | Satın alma yok, sadece WA iletişimi |
| "Sepet"         | Kullanılmaz            | Kapsam dışı                         |
| "Sipariş"       | Kullanılmaz            | Kapsam dışı                         |
| "Müşteri"       | "Ziyaretçi"            | Kayıt sistemi yok                   |
| "blacklist"     | "denylist"             | Daha kapsayıcı terim                |
| "whitelist"     | "allowlist"            | Daha kapsayıcı terim                |
| "master"        | "main"                 | Git branch adlandırması             |