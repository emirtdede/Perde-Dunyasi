# API Spesifikasyonu — Perde Dünyası

> Tüm route'lar Next.js App Router API Routes olarak `/src/app/api/` altında yer alır.
> Admin route'ları `/api/admin/` prefix'ini kullanır ve server-side session kontrolü gerektirir.
> İstek/yanıt formatı: `application/json` (upload hariç: `multipart/form-data`).

---

## Kimlik Doğrulama

Admin endpoint'leri Supabase Auth session'ı ile korunur.
Server Component ve API Route'larda `createServerClient` (Supabase SSR) kullanılır.
Oturumu olmayan istekler `401 Unauthorized` döner.

### POST `/api/auth/login`
Admin girişi.
```
Body:   { email: string, password: string }
200:    { user: { id, email }, session: { access_token, refresh_token } }
401:    { error: "Geçersiz email veya şifre" }
429:    { error: "Çok fazla deneme. Lütfen bekleyin." }
```

### POST `/api/auth/logout`
Admin çıkışı. Session cookie'yi temizler.
```
Auth:   Supabase session (cookie)
200:    { message: "Çıkış başarılı" }
```

### GET `/api/auth/me`
Oturum kontrolü — admin paneli layout'unda kullanılır.
```
Auth:   Supabase session (cookie)
200:    { user: { id, email } }
401:    { error: "Oturum bulunamadı" }
```

---

## Kategoriler

### GET `/api/categories`
Tüm aktif kategorileri döner. Cache: 5 dakika (Next.js `revalidate`).
```
Query:  ?include_inactive=true  (sadece admin erişimi ile)
200:    { categories: Category[] }
```

### POST `/api/admin/categories`
Yeni kategori oluşturur.
```
Auth:   Admin session
Body:   { name, slug?, description?, image_url?, sort_order? }
201:    { category: Category }
400:    { error: "...", fields: { slug: "Bu slug zaten kullanılıyor" } }
```

### PUT `/api/admin/categories/[id]`
Kategori günceller.
```
Auth:   Admin session
Body:   { name?, slug?, description?, image_url?, sort_order?, is_active? }
200:    { category: Category }
404:    { error: "Kategori bulunamadı" }
```

### DELETE `/api/admin/categories/[id]`
Kategori siler. Ürünleri olan kategori silinemez.
```
Auth:   Admin session
200:    { message: "Kategori silindi" }
409:    { error: "Bu kategoriye ait ürünler var. Önce ürünleri taşıyın veya silin." }
```

---

## Ürünler

### GET `/api/products`
Aktif ürün listesi.
```
Query:  ?category=<slug>        Kategoriye göre filtrele
        ?featured=true          Sadece öne çıkanlar
        ?search=<q>             Ada göre arama (ilike)
        ?page=1&limit=12        Sayfalama
200:    { products: Product[], total: number, page: number, totalPages: number }
```

### GET `/api/products/[slug]`
Tek ürün detayı (görseller dahil). SSG için kullanılır.
```
200:    { product: ProductDetail }  ← category, images[] dahil
404:    { error: "Ürün bulunamadı" }
```

### GET `/api/products/featured`
Ana sayfa için öne çıkan ürünler (max 8).
```
200:    { products: Product[] }
```

### POST `/api/admin/products`
Yeni ürün oluşturur.
```
Auth:   Admin session
Body:   {
          name, slug?, category_id, short_desc?, description?,
          price?, price_unit?, is_active?, is_featured?, sort_order?
        }
201:    { product: Product }
400:    { error: "...", fields: {} }
```

### PUT `/api/admin/products/[id]`
Ürün günceller.
```
Auth:   Admin session
Body:   (aynı alanlar, hepsi opsiyonel)
200:    { product: Product }
404:    { error: "Ürün bulunamadı" }
```

### DELETE `/api/admin/products/[id]`
Ürün ve bağlı görselleri siler (Storage + DB).
```
Auth:   Admin session
200:    { message: "Ürün silindi" }
404:    { error: "Ürün bulunamadı" }
```

---

## Ürün Görselleri

### POST `/api/admin/products/[id]/images`
Ürüne görsel yükler.
```
Auth:   Admin session
Body:   multipart/form-data — files: File[] (max 10 - mevcut görsel sayısı)
200:    { images: ProductImage[] }
400:    { error: "Maksimum görsel sayısı aşıldı (10)" }
413:    { error: "Dosya boyutu 5MB'ı geçemez" }
415:    { error: "Sadece JPEG, PNG, WEBP formatları desteklenir" }
```

### PUT `/api/admin/products/[id]/images/[imageId]/primary`
Görseli birincil yapar (diğerlerini sıfırlar).
```
Auth:   Admin session
200:    { message: "Birincil görsel güncellendi" }
```

### DELETE `/api/admin/products/[id]/images/[imageId]`
Görsel siler (Storage + DB).
```
Auth:   Admin session
200:    { message: "Görsel silindi" }
```

### PUT `/api/admin/products/[id]/images/reorder`
Görsel sırasını günceller.
```
Auth:   Admin session
Body:   { order: [{ id: UUID, sort_order: number }] }
200:    { message: "Sıralama güncellendi" }
```

---

## Kampanyalar

### GET `/api/campaigns`
Aktif ve süresi dolmamış kampanyaları döner.
```
Query:  ?all=true  (sadece admin — aktif olmayan dahil)
200:    { campaigns: Campaign[] }
```

### POST `/api/admin/campaigns`
Yeni kampanya oluşturur.
```
Auth:   Admin session
Body:   { title, description?, badge_text?, image_url?, storage_path?, start_date?, end_date?, is_active?, sort_order? }
201:    { campaign: Campaign }
```

### PUT `/api/admin/campaigns/[id]`
Kampanya günceller.
```
Auth:   Admin session
Body:   (hepsi opsiyonel)
200:    { campaign: Campaign }
```

### DELETE `/api/admin/campaigns/[id]`
Kampanya siler; varsa görseli Storage'dan da siler.
```
Auth:   Admin session
200:    { message: "Kampanya silindi" }
```

---

## Duyurular

### GET `/api/announcements`
Yayınlanmış duyuruları döner (eski → yeni).
```
Query:  ?limit=5         Son N duyuru
200:    { announcements: Announcement[] }
```

### POST `/api/admin/announcements`
Yeni duyuru oluşturur (varsayılan: taslak).
```
Auth:   Admin session
Body:   { title, content, is_published? }
201:    { announcement: Announcement }
```

### PUT `/api/admin/announcements/[id]`
Duyuru günceller veya yayınlar.
```
Auth:   Admin session
Body:   { title?, content?, is_published? }
Not:    is_published: true yapılırsa published_at = NOW() otomatik set edilir.
200:    { announcement: Announcement }
```

### DELETE `/api/admin/announcements/[id]`
Duyuru siler.
```
Auth:   Admin session
200:    { message: "Duyuru silindi" }
```

---

## Site Ayarları

### GET `/api/settings`
Tüm ayarları key-value olarak döner. Public endpoint.
```
200:    { settings: { [key: string]: string | null } }
Not:    Hassas ayarlar (admin email vb.) bu endpoint'te döndürülmez.
```

### PUT `/api/admin/settings`
Bir veya birden fazla ayarı günceller.
```
Auth:   Admin session
Body:   { [key: string]: string }
200:    { message: "Ayarlar güncellendi", updated: string[] }
400:    { error: "Geçersiz ayar anahtarı: xyz" }
```

---

## WhatsApp

### GET `/api/whatsapp/[productSlug]`
WhatsApp yönlendirme URL'i üretir ve redirect yapar.
```
200 (redirect): wa.me/{whatsapp_number}?text={encoded_message}
404:            { error: "Ürün bulunamadı" }
503:            { error: "WhatsApp numarası tanımlanmamış" }
```

**Mesaj Şablonu:**
```
Merhaba, {ürün adı} ({kategori}) hakkında fiyat teklifi almak istiyorum.
{short_desc varsa eklenir}
Web: perredunyasi.com/urunler/{slug}
```

---

## Slug Üretimi

### GET `/api/admin/slugify`
Verilen metinden slug üretir (benzersizlik kontrolü dahil).
```
Query:  ?text=Zebra+Stor+Perde&table=products
200:    { slug: "zebra-stor-perde" }          ← benzersizse
        { slug: "zebra-stor-perde-2" }        ← zaten varsa numara ekler
```

---

## Genel Hata Formatı

```json
{
  "error": "İnsan okunabilir hata mesajı",
  "code": "VALIDATION_ERROR",
  "fields": {
    "slug": "Bu slug zaten kullanılıyor"
  }
}
```

## HTTP Hata Kodları

| Kod | Anlamı                        |
|-----|-------------------------------|
| 400 | Geçersiz istek / validasyon   |
| 401 | Oturum yok / geçersiz         |
| 403 | Yetkisiz (oturum var ama yetki yok) |
| 404 | Kaynak bulunamadı             |
| 409 | Çakışma (slug duplicate vb.)  |
| 413 | Dosya çok büyük               |
| 415 | Desteklenmeyen medya tipi     |
| 429 | Rate limit aşıldı             |
| 500 | Sunucu hatası                 |

---

## TypeScript Tip Referansları

```typescript
// types/index.ts içinde tanımlanır

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface Product {
  id: string;
  category_id: string;
  category?: Category;
  name: string;
  slug: string;
  short_desc: string | null;
  description: string | null;
  price: number | null;
  price_unit: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  sort_order: number;
}

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  badge_text: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  sort_order: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface SiteSettings {
  [key: string]: string | null;
}
```