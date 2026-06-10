-- Perde Dünyası Database Schema
-- Platform: Supabase (PostgreSQL 15+)

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  short_desc VARCHAR(300),
  description TEXT,
  price NUMERIC(10,2),
  price_unit VARCHAR(20) DEFAULT 'TL',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. product_images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  description TEXT,
  badge_text VARCHAR(50),
  image_url TEXT,
  storage_path TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. site_settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --- INDEXES ---

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_key ON site_settings(key);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active, category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active, end_date);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, published_at DESC);

-- --- UPDATED_AT TRIGGER FUNCTION ---

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --- TRIGGERS ---

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- --- ROW LEVEL SECURITY (RLS) ---

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Select Policies for Public
CREATE POLICY "Public read active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public read active campaigns" ON campaigns
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read published announcements" ON announcements
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT USING (true);

-- Admin Policies: Fully enabled for authenticated users (or since we use service_role, RLS is bypassed by design)
-- But we can add helper admin policies just in case
CREATE POLICY "Admin full access categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access campaigns" ON campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access announcements" ON announcements FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL TO authenticated USING (true);

-- --- SEED DATA ---

-- Categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Stor Perdeler', 'stor-perdeler', 'Modern ve pratik stor perde çözümleri.', 1, true),
('Tül Perdeler', 'tul-perdeler', 'Işığı yumuşatan hafif tül seçenekleri.', 2, true),
('Fon Perdeler', 'fon-perdeler', 'Pencerelerinize derinlik katan kumaş perdeler.', 3, true),
('Jaluzi', 'jaluzi', 'Metal, ahşap veya plastik şeritli jaluzi perdeler.', 4, true),
('Perde Aksesuarları', 'perde-aksesuarlari', 'Perde bağı, raylar ve süsleyici aksesuarlar.', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
('whatsapp_number', '905551234567'),
('whatsapp_greeting', 'Merhaba, {urun} hakkında fiyat teklifi almak istiyorum.'),
('phone', '0555 123 45 67'),
('email', 'info@perdedunyasi.com'),
('address', 'Adıyaman, Türkiye'),
('google_maps_url', NULL),
('about_text', 'Perde Dünyası, vitrin odaklı modern bir perde mağazasıdır. Adıyaman''da kaliteli ürünler ve hızlı iletişimimizle hizmet veriyoruz.'),
('instagram_url', NULL),
('facebook_url', NULL),
('hero_title', 'Hayalinizdeki Perdeler'),
('hero_subtitle', 'En kaliteli ürünler ve hızlı WhatsApp iletişimi.'),
('hero_image_url', NULL),
('logo_url', NULL),
('meta_title', 'Perde Dünyası'),
('meta_description', 'Perde, tül, stor ve jaluzi ürünleri için vitrin sitesi.')
ON CONFLICT (key) DO NOTHING;

-- 7. visits Table (Analytics)
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id VARCHAR(100) NOT NULL,
  path VARCHAR(255) NOT NULL,
  referrer VARCHAR(255),
  ip_address VARCHAR(45),
  country VARCHAR(100) DEFAULT 'Bilinmiyor',
  city VARCHAR(100) DEFAULT 'Bilinmiyor',
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can insert visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access visits" ON visits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin full access visits all" ON visits FOR ALL TO authenticated USING (true);

