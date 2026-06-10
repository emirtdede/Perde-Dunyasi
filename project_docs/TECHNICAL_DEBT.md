# Teknik Borç — Perde Dünyası

> "Şimdi değil, ama mutlaka" listesi.
> V1 çıkışında bilinçli olarak ertelenen veya basit tutulan işler.

---

## Yüksek Öncelik

- [ ] **ISR (Incremental Static Regeneration):** V1'de SSR kullanılacak, ürün sayfaları için ISR daha iyi performans verir. V2'de uygulanmalı.
- [ ] **Görsel optimizasyonu:** Upload sırasında görsel sıkıştırma (sharp kütüphanesi). V1'de ham yükleme yapılır.
- [ ] **Supabase rate limiting:** Auth endpoint'lerinde Supabase'in kendi rate limiting'i aktif edilmeli; admin giriş sayfasında ek koruma eklenebilir.

---

## Orta Öncelik

- [ ] **Full-text arama:** `products` tablosunda Türkçe full-text index. V1'de `ilike` ile basit arama yeterli.
- [ ] **Kampanya bitiş tarihi otomasyonu:** Şu an API katmanında sorgu filtresiyle yapılıyor. Supabase cron veya pg_cron ile DB seviyesinde otomatik `is_active = false` yapılabilir.
- [ ] **Görsel drag-and-drop sıralaması:** Admin panelinde görsel sırası sürükle-bırak ile değiştirme. V1'de yukarı/aşağı ok butonu yeterli.
- [ ] **Admin toplu işlem:** Birden fazla ürünü aynı anda aktif/pasif yapma veya silme. V1'de tekil işlem yeterli.
- [ ] **Sitemap.xml:** Otomatik üretim. V1 sonrasında SEO için kritik.
- [ ] **Open Graph görselleri:** Her ürün için dinamik OG görsel. V1'de statik OG yeterli.

---

## Düşük Öncelik

- [ ] **Toast bileşeni:** V1'de basit `alert()` veya inline mesaj yeterli. Sonra proper toast sistemi kurulacak.
- [ ] **Admin dashboard istatistikleri:** V1'de sadece sayılar (ürün, kategori sayısı). V2'de ziyaret sayısı, en çok görüntülenen ürün vb. eklenebilir.
- [ ] **Hata izleme (Sentry):** V1 sonrasında production hatalarını takip için.
- [ ] **Cache invalidation:** `revalidatePath` / `revalidateTag` ile admin değişikliklerinde statik sayfaların yenilenmesi.

---

## Ödenen Borçlar

_Henüz ödenen borç yok — proje yeni başlıyor._