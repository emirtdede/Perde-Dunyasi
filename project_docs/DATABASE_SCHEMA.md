# Veritabanı Şeması — Perde Dünyası

> Platform: Supabase (PostgreSQL 15+)
> UUID üretimi: `gen_random_uuid()` (pgcrypto)
> Tüm tablolarda `created_at` ve `updated_at` varsayılan olarak tanımlıdır.

---

## Tablolar

---

### `categories` — Ürün Kategorileri

| Kolon         | Tip            | Özellik                       | Açıklama                        |
|---------------|----------------|-------------------------------|----------------------------------|
| id            | UUID           | PK, DEFAULT gen_random_uuid() |                                  |
| name          | VARCHAR(100)   | NOT NULL                      | Görünen ad: "Stor Perdeler"      |
| slug          | VARCHAR(120)   | UNIQUE, NOT NULL              | URL dostu: "stor-perdeler"       |
| description   | TEXT           | NULLABLE                      | Kısa açıklama                    |
| image_url     | TEXT           | NULLABLE                      | Kategori kapak görseli URL       |
| sort_order    | INTEGER        | DEFAULT 0                     | Menüde sıralama önceliği         |
| is_active     | BOOLEAN        | DEFAULT true                  | Pasif kategoriler katalogda çıkmaz|
| created_at    | TIMESTAMPTZ    | DEFAULT NOW()                 |                                  |
| updated_at    | TIMESTAMPTZ    | DEFAULT NOW()                 |                                  |

**Başlangıç Kategorileri (seed verisi):**
- Stor Perdeler
- Tül Perdeler
- Fon Perdeler
- Jaluzi
- Perde Aksesuarları

---

### `products` — Ürünler

| Kolon           | Tip            | Özellik                       | Açıklama                              |
|-----------------|----------------|-------------------------------|---------------------------------------|
| id              | UUID           | PK, DEFAULT gen_random_uuid() |                                       |
| category_id     | UUID           | FK → categories.id, NOT NULL  |                                       |
| name            | VARCHAR(200)   | NOT NULL                      | Ürün adı                              |
| slug            | VARCHAR(220)   | UNIQUE, NOT NULL              | URL: "zebra-stor-perde-beyaz"         |
| short_desc      | VARCHAR(300)   | NULLABLE                      | WhatsApp mesajında kullanılır         |
| description     | TEXT           | NULLABLE                      | Detay sayfasında HTML destekli içerik |
| price           | NUMERIC(10,2)  | NULLABLE                      | Boşsa "Fiyat için iletişim"           |
| price_unit      | VARCHAR(20)    | DEFAULT 'TL'                  | TL, USD, EUR                          |
| is_active       | BOOLEAN        | DEFAULT true                  | Pasif ürünler katalogda gözükmez      |
| is_featured     | BOOLEAN        | DEFAULT false                 | Ana sayfada öne çıkar                 |
| sort_order      | INTEGER        | DEFAULT 0                     | Kategori içi sıralama                 |
| created_at      | TIMESTAMPTZ    | DEFAULT NOW()                 |                                       |
| updated_at      | TIMESTAMPTZ    | DEFAULT NOW()                 |                                       |

**Notlar:**
- `short_desc` — WhatsApp mesajına otomatik eklenir. Boşsa sadece ürün adı gider.
- `price` NULLABLE: Admin isterse fiyat girer, istemezse WhatsApp'a yönlendirme mesajı çıkar.

---

### `product_images` — Ürün Görselleri

| Kolon       | Tip         | Özellik                       | Açıklama                          |
|-------------|-------------|-------------------------------|-----------------------------------|
| id          | UUID        | PK, DEFAULT gen_random_uuid() |                                   |
| product_id  | UUID        | FK → products.id, NOT NULL    | CASCADE DELETE                    |
| url         | TEXT        | NOT NULL                      | Supabase Storage public URL       |
| storage_path| TEXT        | NOT NULL                      | Supabase Storage bucket içi yolu  |
| is_primary  | BOOLEAN     | DEFAULT false                 | Kart ve detay sayfasında önce gelen |
| sort_order  | INTEGER     | DEFAULT 0                     | Galeri sırası                     |
| created_at  | TIMESTAMPTZ | DEFAULT NOW()                 |                                   |

**İş Kuralı:** Ürün başına max 10 görsel. Ürün silindiğinde `CASCADE DELETE` ile görseller DB'den silinir; Supabase Storage'dan silme işlemi API katmanında yapılır.

---

### `campaigns` — Kampanyalar

| Kolon          | Tip          | Özellik                       | Açıklama                             |
|----------------|--------------|-------------------------------|--------------------------------------|
| id             | UUID         | PK, DEFAULT gen_random_uuid() |                                      |
| title          | VARCHAR(200) | NOT NULL                      | "Haziran Stor İndirimi"              |
| description    | TEXT         | NULLABLE                      | Kampanya açıklaması, HTML destekli   |
| badge_text     | VARCHAR(50)  | NULLABLE                      | Kart üzerinde rozet: "%20 İndirim"   |
| image_url      | TEXT         | NULLABLE                      | Kampanya banner görseli              |
| storage_path   | TEXT         | NULLABLE                      | Görsel silme için storage yolu       |
| start_date     | DATE         | NULLABLE                      | Boşsa "başlangıç tarihi yok"         |
| end_date       | DATE         | NULLABLE                      | Boşsa "süresiz kampanya"             |
| is_active      | BOOLEAN      | DEFAULT true                  | Bitiş tarihi geçenler otomatik false |
| sort_order     | INTEGER      | DEFAULT 0                     |                                      |
| created_at     | TIMESTAMPTZ  | DEFAULT NOW()                 |                                      |
| updated_at     | TIMESTAMPTZ  | DEFAULT NOW()                 |                                      |

**İş Kuralı:** API katmanında `end_date < TODAY` ise `is_active = false` sayılır (DB güncelleme gerekmez; sorgu filtresi yeterli).

---

### `announcements` — Duyurular

| Kolon        | Tip          | Özellik                       | Açıklama                              |
|--------------|--------------|-------------------------------|---------------------------------------|
| id           | UUID         | PK, DEFAULT gen_random_uuid() |                                       |
| title        | VARCHAR(200) | NOT NULL                      |                                       |
| content      | TEXT         | NOT NULL                      | HTML destekli içerik                  |
| is_published | BOOLEAN      | DEFAULT false                 | Admin yayınlamadan önce taslak        |
| published_at | TIMESTAMPTZ  | NULLABLE                      | "Yayınla" butonuna basıldığında NOW() |
| created_at   | TIMESTAMPTZ  | DEFAULT NOW()                 |                                       |
| updated_at   | TIMESTAMPTZ  | DEFAULT NOW()                 |                                       |

---

### `site_settings` — Site Ayarları

| Kolon       | Tip         | Özellik                       | Açıklama                          |
|-------------|-------------|-------------------------------|-----------------------------------|
| id          | UUID        | PK, DEFAULT gen_random_uuid() |                                   |
| key         | VARCHAR(100)| UNIQUE, NOT NULL              | Ayar anahtarı                     |
| value       | TEXT        | NULLABLE                      | Ayar değeri                       |
| updated_at  | TIMESTAMPTZ | DEFAULT NOW()                 |                                   |

**Başlangıç Ayarları (seed verisi):**

| Key                    | Örnek Değer             | Açıklama                 |
|------------------------|-------------------------|--------------------------|
| whatsapp_number        | 905551234567            | WhatsApp link numarası   |
| whatsapp_greeting      | Merhaba, {urun} hakkında fiyat teklifi almak istiyorum. | Mesaj şablonu |
| phone                  | 0555 123 45 67          | Görünen telefon          |
| email                  | info@perredunyasi.com   | İletişim e-postası       |
| address                | Diyarbakır, Türkiye     | Adres metni              |
| google_maps_url        | https://maps.google.com/... | Harita linki          |
| about_text             | ...                     | Hakkımızda sayfası metni |
| instagram_url          |                         | Instagram profil linki   |
| facebook_url           |                         | Facebook profil linki    |
| hero_title             | Hayalinizdeki Perdeler  | Ana sayfa başlığı        |
| hero_subtitle          | En kaliteli ürünler...  | Ana sayfa alt başlık     |
| hero_image_url         |                         | Hero banner görseli URL  |
| meta_title             | Perde Dünyası           | SEO sayfa başlığı        |
| meta_description       | ...                     | SEO açıklaması           |

---

## İlişkiler

```
categories (1) ──────────── (N) products
products   (1) ──────────── (N) product_images
```

---

## İndeksler

```sql
-- Slug ile tekil sorgu (ürün detay sayfası)
CREATE UNIQUE INDEX idx_products_slug ON products(slug);
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- Aktif ürün listeleme (en sık sorgu)
CREATE INDEX idx_products_active ON products(is_active, category_id, sort_order);

-- Öne çıkan ürünler (ana sayfa)
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- Aktif kampanyalar
CREATE INDEX idx_campaigns_active ON campaigns(is_active, end_date);

-- Yayınlanan duyurular
CREATE INDEX idx_announcements_published ON announcements(is_published, published_at DESC);

-- Site ayarları anahtar araması
CREATE UNIQUE INDEX idx_settings_key ON site_settings(key);
```

---

## Supabase RLS (Row Level Security) Politikaları

```sql
-- Ürünler: herkes aktif olanları okuyabilir
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Admin: tüm ürünlere tam erişim (service_role key ile)
-- API Routes server-side'da service_role kullanır, RLS bypass edilir.

-- Görseller: herkes okuyabilir (public bucket)
-- Yazma: sadece API Routes (service_role)
```

---

## Updated_at Otomatik Güncelleme (Trigger)

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Her tabloya ekle:
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- (categories, campaigns, announcements için de aynısı)
```