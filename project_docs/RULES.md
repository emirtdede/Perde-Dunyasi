# Proje Kuralları — Perde Dünyası

## Kesin Yasaklar

Kullanıcı açıkça izin vermedikçe bu kurallar geçerlidir:

- Dosya silme yasak.
- Teknoloji değiştirme yasak (Next.js → başka framework, Supabase → başka DB vb.).
- Mimari değiştirme yasak (API Routes → ayrı backend oluşturma vb.).
- Çalışan sistemi yeniden yazma yasak.
- Onaysız refactor yasak.
- Aynı anda birden fazla modülü değiştirme yasak.
- E-ticaret veya ödeme kodu yazmak yasak — kapsam dışıdır.
- Admin dışında kullanıcı kayıt/giriş sistemi oluşturmak yasak.
- `service_role` key'ini istemci tarafında (browser) kullanmak kesinlikle yasak.

---

## Zorunlu Kurallar

- Büyük görevleri küçük adımlara böl.
- Önce mevcut kodu oku, sonra değiştir.
- Her değişiklik minimum etki prensibi ile yapılmalı.
- Belirsiz durumda tahmin etme — kullanıcıya sor.
- GLOSSARY.md'deki terimleri kullan.
- MEMORY.md güncellenmeden görev bitmez.
- WhatsApp linki daima `wa.me` formatında olmalı: `https://wa.me/{numara}?text={encode}`
- Fiyat bilgisi: `price` alanı `null` olabilir; bu durumda UI'da fiyat gösterilmez.

---

## Kod Standartları

- **Dil:** TypeScript (strict mode), `.ts` / `.tsx` uzantıları.
- **Linting:** ESLint (Next.js preset) + Prettier.
- **Naming:**
  - Bileşenler: PascalCase (`ProductCard.tsx`)
  - Fonksiyon / değişken: camelCase (`getProducts`)
  - CSS class: Tailwind utility class (özel isim yok)
  - DB kolon adları: snake_case (`is_active`, `short_desc`)
  - API route dosyaları: `route.ts`
- **Yorum dili:** Türkçe (karmaşık iş mantığı açıklamaları için).
- **Import sırası:** 1) Node modules, 2) Internal aliases (`@/`), 3) Relative paths.
- **Server vs Client:** `use client` direktifini minimumda tut; mümkün olduğunca Server Component kullan.
- **Test:** Kritik fonksiyonlar için birim testi yazılmalı (WhatsApp link üretici, slug üretici, kampanya aktiflik kontrolü).

---

## Admin Paneli Kuralları

- Admin route'larına erişim `middleware.ts` ile korunur.
- Session kontrolü her API route'unda server-side yapılır.
- `service_role` sadece `src/lib/supabase/server.ts` içinde kullanılır.
- Admin formlarında her alan Zod ile validate edilir.
- Silme işlemleri daima onay modalı gerektirir.

---

## Görsel Yükleme Kuralları

- Kabul edilen formatlar: JPEG, PNG, WEBP
- Maksimum boyut: 5MB / görsel
- Ürün başına maksimum: 10 görsel
- Storage bucket adı: `product-images` (public bucket)
- Storage yolu: `products/{product_id}/{uuid}.{ext}`
- Ürün silinirken: tüm görseller Storage'dan da silinmeli (API katmanı sorumlu)

---

## Git Commit Kuralları

```
feat(modül): kısa açıklama
fix(modül): kısa açıklama
docs(modül): kısa açıklama
refactor(modül): kısa açıklama
style(modül): kısa açıklama
chore(modül): kısa açıklama
```

Modül örnekleri: `auth`, `products`, `categories`, `campaigns`, `announcements`, `admin`, `api`, `ui`, `db`

Örnek:
```
feat(products): ürün detay sayfası ve WhatsApp butonu eklendi
fix(admin): görsel sıralaması kaydetme hatası düzeltildi
docs(db): product_images tablo şeması güncellendi
```