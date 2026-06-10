# Vibe Coding — Proje Bilgi Merkezi Sistemi

> Cline, Roo Code, Continue, Aider ve benzeri AI ajanlarla
> uzun soluklu projelerde tutarlı çalışmak için tasarlanmış
> tek merkezli bilgi sistemi.

---

## Klasör Yapısı

```text
project-root/
│
├── src/
├── public/
├── package.json
├── .gitignore
├── .clinerules                  ← Ajanın çalışma anayasası
│
└── project_docs/
    │
    ├── PROJECT_SPECIFICATION.md  ← Projenin ana kaynağı
    ├── ARCHITECTURE.md           ← Teknik kararlar
    ├── DATABASE_SCHEMA.md        ← Veri modeli
    ├── API_SPECIFICATION.md      ← Endpoint listesi
    ├── UI_UX_GUIDELINES.md       ← Tasarım sistemi
    ├── DEVELOPMENT_ROADMAP.md    ← Versiyon planı
    │
    ├── MEMORY.md                 ← Ajanın proje hafızası (max 100 satır)
    ├── RULES.md                  ← Yasaklar ve zorunlular
    ├── GLOSSARY.md               ← Projeye özgü terimler
    │
    ├── CHANGELOG.md              ← Son 30 günün değişiklikleri
    ├── CHANGELOG_ARCHIVE/        ← Eski kayıtlar (YYYY-MM.md)
    │
    ├── TASKS.md                  ← Görev listesi
    ├── TECHNICAL_DEBT.md         ← Sonraya bırakılan işler
    ├── DECISIONS.md              ← Mimari karar kayıtları
    ├── RISKS.md                  ← Aktif riskler
    │
    ├── FILE_STRUCTURE.md         ← Proje dosya haritası
    ├── TESTING_STATUS.md         ← Test takibi
    ├── ENVIRONMENT.md            ← Env değişkenleri ve local kurulum
    └── SECURITY.md               ← Güvenlik kuralları ve hassas alanlar
```

---

## Dosyaların Görevleri ve Şablonları

---

### PROJECT_SPECIFICATION.md

Projenin ana kaynağı. Bu dosya değişirse proje değişmiş sayılır.

```markdown
# Proje Adı — Spesifikasyon

## Proje Amacı
[Projenin tek cümlelik özeti]

## Hedef Kullanıcılar
- [Kullanıcı tipi 1]
- [Kullanıcı tipi 2]

## Temel Özellikler
- [Özellik 1]
- [Özellik 2]
- [Özellik 3]

## İş Kuralları
- [Kural 1]
- [Kural 2]

## Yetki Sistemi
- Guest: [yetkiler]
- User: [yetkiler]
- Admin: [yetkiler]

## Monetizasyon
[Ücretlendirme modeli]

## Teknik Gereksinimler
- Minimum Node.js sürümü:
- Tarayıcı desteği:
- Mobil uyumluluk:
```

---

### ARCHITECTURE.md

Teknik kararların özeti. Neden bu teknoloji sorusunun cevabı burada olmalı.

```markdown
# Mimari

## Stack

| Katman        | Teknoloji   | Versiyon | Sebep                |
|---------------|-------------|----------|----------------------|
| Frontend      | Next.js     | 14+      | SSR + App Router     |
| Backend       | NestJS      | 10+      | Modüler yapı         |
| Veritabanı    | PostgreSQL  | 15+      | İlişkisel veri       |
| Cache         | Redis       | 7+       | Session + hız        |
| Kimlik Doğr.  | JWT         | —        | Stateless auth       |
| Dosya Depo    | S3          | —        | Ölçeklenebilir       |
| Deployment    | Docker      | —        | Taşınabilirlik       |

## Klasör Mimarisi
[monorepo / modüler / layered — seçilen yaklaşım]

## Önemli Kısıtlamalar
- [Kısıt 1]
- [Kısıt 2]
```

---

### DATABASE_SCHEMA.md

Tüm tablo yapıları. Her değişiklikten sonra güncellenmeli.

```markdown
# Veritabanı Şeması

## Tablolar

### users
| Kolon        | Tip           | Özellik          |
|--------------|---------------|------------------|
| id           | UUID          | PK               |
| email        | VARCHAR(255)  | UNIQUE, NOT NULL |
| username     | VARCHAR(50)   | UNIQUE, NOT NULL |
| password     | VARCHAR(255)  | NOT NULL         |
| role         | ENUM          | user/admin       |
| created_at   | TIMESTAMP     | DEFAULT NOW()    |

### posts
| Kolon        | Tip           | Özellik          |
|--------------|---------------|------------------|
| id           | UUID          | PK               |
| user_id      | UUID          | FK → users.id    |
| title        | VARCHAR(255)  | NOT NULL         |
| content      | TEXT          |                  |
| created_at   | TIMESTAMP     | DEFAULT NOW()    |

## İlişkiler
- users → posts (1:N)
- [diğer ilişkiler]

## İndeksler
- users.email
- posts.user_id
```

---

### API_SPECIFICATION.md

Tüm endpoint'ler. Frontend ile backend arasındaki sözleşme.

```markdown
# API Spesifikasyonu

Base URL: /api/v1

## Authentication

### POST /auth/register
Body: { email, username, password }
Response: { user, token }

### POST /auth/login
Body: { email, password }
Response: { user, token }

### POST /auth/logout
Auth: Bearer token
Response: { message }

## Users

### GET /users/:id
Auth: Bearer token
Response: { user }

### PATCH /users/:id
Auth: Bearer token (owner/admin)
Body: { username?, bio? }
Response: { user }

## [Diğer Modüller]

## Hata Kodları
| Kod | Anlamı               |
|-----|----------------------|
| 400 | Geçersiz istek       |
| 401 | Kimlik doğrulanamadı |
| 403 | Yetkisiz             |
| 404 | Bulunamadı           |
| 500 | Sunucu hatası        |
```

---

### UI_UX_GUIDELINES.md

Tasarım sistemi. Ajanın UI yazarken referans alacağı tek kaynak.

```markdown
# UI/UX Kılavuzu

## Tema
- Açık / Koyu Mod: destekleniyor
- Varsayılan: sistem tercihi

## Stil
- Genel konsept: [örn. Liquid Glass, Minimal, Brutalist]
- CSS framework: [Tailwind / CSS Modules / Styled Components]

## Renk Paleti
| İsim          | Değer     | Kullanım          |
|---------------|-----------|-------------------|
| primary       | #6B21A8   | Butonlar, CTA     |
| secondary     | #1E1B4B   | Sidebar, Header   |
| background    | #0F0F0F   | Ana arka plan     |
| surface       | #1A1A1A   | Kartlar           |
| text          | #F5F5F5   | Genel metin       |
| error         | #EF4444   | Hata durumu       |
| success       | #22C55E   | Başarı durumu     |

## Tipografi
- Font: Inter
- Heading: 700 weight
- Body: 400 weight
- Kod: JetBrains Mono

## Animasyon
- Kütüphane: Framer Motion
- Süre: 200ms (micro), 400ms (sayfa)
- Easing: easeInOut

## Bileşen Kuralları
- Buton: min-width 120px, border-radius 8px
- Input: border 1px solid, focus ring 2px
- Modal: backdrop-blur, max-w-lg

## Erişilebilirlik
- ARIA label'ları zorunlu
- Kontrast oranı min 4.5:1
- Klavye navigasyonu desteklenmeli
```

---

### DEVELOPMENT_ROADMAP.md

Versiyon planı. Önceliklerin ve kapsamın tek kaynağı.

```markdown
# Geliştirme Yol Haritası

## V1 — Temel (Şu an)
- [ ] Kimlik doğrulama (register/login/logout)
- [ ] Kullanıcı profili
- [ ] Temel CRUD

## V2 — Sosyal Katman
- [ ] Takip/takipçi sistemi
- [ ] Bildirimler
- [ ] Aktivite akışı

## V3 — İçerik
- [ ] Mesajlaşma
- [ ] Dosya yükleme
- [ ] Arama

## V4 — Ölçek
- [ ] Mobil uygulama
- [ ] Cache optimizasyonu
- [ ] CDN entegrasyonu

## İptal Edilen / Ertelenen
- [Sebep ile birlikte listele]
```

---

### MEMORY.md

**En kritik dosya.** Ajanın her oturumda ilk okuduğu yer.

**Kural: maksimum 100 satır. Öz tut. Detay diğer dosyalarda.**

```markdown
# Proje Hafızası

Son güncelleme: YYYY-MM-DD

## Proje Özeti
[2-3 cümle: Proje ne, kimin için, temel hedef ne]

## Teknik Özet
- Frontend: Next.js 14, App Router
- Backend: NestJS
- DB: PostgreSQL
- Auth: JWT

## Şu Anki Durum
- Tamamlanan: [modüller]
- Devam eden: [aktif modül]
- Sıradaki: [planlanan modül]

## Son Yapılan İş
[Son görevin 3-5 cümlelik özeti]

## Dikkat Edilmesi Gerekenler
- [Kritik uyarı 1]
- [Kritik uyarı 2]

## Açık Sorunlar
- [Çözülmemiş teknik sorun varsa]
```

---

### RULES.md

Yasaklar ve zorunlular. Ajan bu dosyayı her görev öncesinde okur.

```markdown
# Proje Kuralları

## Kesin Yasaklar

Bu kurallar kullanıcı açıkça izin vermedikçe geçerlidir:

- Dosya silme yasak.
- Teknoloji değiştirme yasak.
- Mimari değiştirme yasak.
- Çalışan sistemi yeniden yazma yasak.
- Onaysız refactor yasak.
- Çoklu modülü aynı anda değiştirme yasak.

## Zorunlu Kurallar

- Büyük görevleri küçük adımlara böl.
- Önce mevcut kodu oku, sonra değiştir.
- Her değişiklik minimum etki prensibi ile yapılmalı.
- Belirsiz durumda tahmin etme, kullanıcıya sor.
- GLOSSARY.md'deki terimleri kullan.
- MEMORY.md güncellenmeden görev bitmez.

## Kod Standartları

- [Linting kuralı, örn. ESLint + Prettier]
- [Naming convention, örn. camelCase / kebab-case]
- [Yorum dili: Türkçe / İngilizce]
- [Test zorunluluğu: kritik modüllerde zorunlu]
```

---

### GLOSSARY.md

Projeye özgü terimler. Ajan bu dosya sayesinde domain dilini öğrenir
ve tutarsız terminoloji kullanmaz.

```markdown
# Sözlük

## Kullanıcı Tipleri
- **Guest**: Kayıtsız ziyaretçi, salt okuma
- **User**: Kayıtlı üye, içerik oluşturabilir
- **Admin**: Tam yetki, moderasyon yapabilir

## İş Terimleri
- **Koleksiyon**: Kullanıcının oyun/içerik listesi
- **Showcase**: Profilde öne çıkarılan koleksiyon
- **[Terim]**: [Tanım]

## Teknik Terimler
- **[Proje özelinde kısaltma]**: [Açıklama]

## Kullanılmayacak Terimler
- "whitelist/blacklist" → "allowlist/denylist" kullan
- [Diğer tercih edilen alternatifler]
```

---

### CHANGELOG.md

Son 30 günün değişiklikleri. 200 satırı geçince eski kayıtlar
`CHANGELOG_ARCHIVE/YYYY-MM.md` dosyasına taşınır.

```markdown
# Değişiklik Geçmişi

## 2026-06-09
- JWT authentication sistemi eklendi
- /auth/register ve /auth/login endpoint'leri tamamlandı
- User entity oluşturuldu

## 2026-06-08
- Proje iskelet yapısı kuruldu
- PostgreSQL bağlantısı yapılandırıldı
- .env örnek dosyası oluşturuldu
```

---

### TASKS.md

Görev listesi. Her görev sonunda güncellenir.

```markdown
# Görev Listesi

## Aktif Görev
- [ ] Profil sayfası — devam ediyor

## Sıradaki
- [ ] Takip/takipçi sistemi
- [ ] Bildirim sistemi
- [ ] Mesajlaşma modülü

## Tamamlanan
- [x] Proje kurulumu
- [x] Authentication modülü
- [x] User entity

## Engellenen
- [ ] Ödeme sistemi — Stripe entegrasyonu bekliyor
```

---

### TECHNICAL_DEBT.md

Bilinçli olarak sonraya bırakılan işler. "Şimdi değil, ama mutlaka."

```markdown
# Teknik Borç

## Yüksek Öncelik
- [ ] Redis cache entegrasyonu — auth ve sık sorgular için
- [ ] Input validation kapsamı genişletilmeli

## Orta Öncelik
- [ ] Arama full-text indexe taşınmalı
- [ ] Resim yükleme için CDN entegrasyonu

## Düşük Öncelik
- [ ] Gereksiz console.log'lar temizlenmeli
- [ ] Yorum satırları düzenlenmeli

## Ödenen Borçlar
- [x] JWT refresh token eklendi (2026-06-09)
```

---

### DECISIONS.md

Mimari karar kayıtları (ADR). "Neden böyle yaptık?" sorusunun cevabı.

```markdown
# Mimari Kararlar

## ADR-001 — PostgreSQL Seçimi
Tarih: 2026-06-01
Durum: Aktif

Karar: Ana veritabanı olarak PostgreSQL kullanılacak.

Sebep:
İlişkisel veri yoğunluğu yüksek. Kullanıcı, içerik
ve sosyal bağlantılar arası karmaşık ilişkiler var.

Alternatifler değerlendirildi:
- MongoDB: Şemasız yapı bu proje için dezavantaj
- MySQL: PostgreSQL JSON desteği daha güçlü

Sonuç: PostgreSQL seçildi.

---

## ADR-002 — Monorepo Kararı
Tarih: 2026-06-01
Durum: Aktif

Karar: Frontend ve backend ayrı repoda tutulacak.

Sebep:
Bağımsız deployment ve farklı ekip iş akışı.

---

## [Yeni kararlar buraya eklenir]
```

---

### RISKS.md

Aktif riskler. Her görev sonunda gözden geçirilir.

```markdown
# Risk Kaydı

## Yüksek Risk
- **Ödeme sistemi test edilmedi** — canlıya geçmeden önce
  Stripe sandbox testleri zorunlu.

## Orta Risk
- **Dosya yükleme geçici çözümle çalışıyor** — local storage
  kullanılıyor, production öncesi S3'e taşınmalı.

## Düşük Risk
- **Rate limiting yok** — API kötüye kullanıma açık.

## Kapanan Riskler
- ~~JWT secret .env'de değildi~~ → Düzeltildi (2026-06-09)
```

---

### FILE_STRUCTURE.md

Projenin dosya haritası. Her yeni modülden sonra güncellenir.

```markdown
# Dosya Yapısı

## Genel Bakış

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── entities/
│       └── user.entity.ts
│
├── common/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
│
└── main.ts
```

## Klasör Kuralları
- Her modül kendi klasöründe
- DTO'lar modül içi dto/ altında
- Shared kodlar common/ altında
```

---

### TESTING_STATUS.md

Test takibi. Hangi modülün test edildiği, hangisinin edilmediği.

```markdown
# Test Durumu

## Birim Testler
| Modül             | Durum         | Notlar                |
|-------------------|---------------|-----------------------|
| Auth Service      | ✓ Tamamlandı  |                       |
| Users Service     | ✗ Eksik       | Öncelik: Yüksek       |
| Posts Service     | ✗ Eksik       |                       |

## Entegrasyon Testleri
| Akış              | Durum         | Notlar                |
|-------------------|---------------|-----------------------|
| Register → Login  | ✓ Tamamlandı  |                       |
| Profile Update    | ✗ Eksik       |                       |

## E2E Testler
| Senaryo           | Durum         | Notlar                |
|-------------------|---------------|-----------------------|
| Kullanıcı akışı   | ✗ Planlandı   | V2'de yapılacak       |

## Test Ortamı
- Framework: Jest
- E2E: Supertest
- Coverage hedefi: %80 (kritik modüller)
```

---

### ENVIRONMENT.md

Ortam değişkenleri ve local kurulum adımları.

```markdown
# Ortam Yapılandırması

## Kurulum Adımları

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Ortam dosyasını oluştur
cp .env.example .env

# 3. Veritabanını başlat
docker-compose up -d postgres redis

# 4. Migration'ları çalıştır
npm run migration:run

# 5. Uygulamayı başlat
npm run dev
```

## Environment Değişkenleri

```env
# Uygulama
NODE_ENV=development
PORT=3000

# Veritabanı
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=gizli-anahtar-buraya
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# AWS S3 (opsiyonel, geliştirmede gerekli değil)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
```

## Gereksinimler
- Node.js: 18+
- PostgreSQL: 15+
- Redis: 7+
- Docker (opsiyonel ama önerilir)
```

---

### SECURITY.md

Güvenlik kuralları ve hassas alanlar. Ajan bu dosyayı auth
veya kullanıcı verisiyle ilgili iş yaparken okumalı.

```markdown
# Güvenlik Kuralları

## Hassas Alanlar
Bu alanlara dokunurken ekstra dikkatli ol:

- `auth/` klasörü — token ve şifre işlemleri
- `users/` entity'si — kişisel veri
- `.env` dosyası — asla commit etme
- `admin/` rotaları — yetki kontrolü zorunlu

## Zorunlu Kurallar

### Şifre
- Bcrypt, minimum 12 round
- Plain text asla saklanmaz, loglanmaz

### Token
- JWT secret .env'de tutulur, kod içinde olmaz
- Access token: 15 dakika
- Refresh token: 7 gün
- Token response body'de değil, httpOnly cookie'de dönmeli

### API
- Tüm endpoint'lerde input validation zorunlu (class-validator)
- Rate limiting: auth endpoint'lerinde zorunlu
- CORS: sadece izin verilen origin'lar

### Veri
- Kullanıcı verisi response'da minimal dön (şifre asla)
- SQL injection: ORM kullan, raw query yazmaktan kaçın
- Log'lara kişisel veri yazma

## Güvenlik Kontrol Listesi (Canlıya Geçmeden)
- [ ] Tüm endpoint'lerde auth kontrolü var mı?
- [ ] Rate limiting aktif mi?
- [ ] CORS kısıtlaması yapıldı mı?
- [ ] .env production'da güvenli mi?
- [ ] Admin rotaları kısıtlandı mı?
```

---

## .clinerules — Nihai Sürüm

Bu dosyayı proje köküne `.clinerules` olarak kaydet.

```text
════════════════════════════════════════
PROJE BAŞLANGICI
════════════════════════════════════════

Eğer project_docs klasörü yoksa oluştur.

Aşağıdaki dosyaları ve klasörü oluştur:

  PROJECT_SPECIFICATION.md
  ARCHITECTURE.md
  DATABASE_SCHEMA.md
  API_SPECIFICATION.md
  UI_UX_GUIDELINES.md
  DEVELOPMENT_ROADMAP.md
  MEMORY.md
  RULES.md
  GLOSSARY.md
  CHANGELOG.md
  CHANGELOG_ARCHIVE/
  TASKS.md
  TECHNICAL_DEBT.md
  DECISIONS.md
  RISKS.md
  FILE_STRUCTURE.md
  TESTING_STATUS.md
  ENVIRONMENT.md
  SECURITY.md

────────────────────────────────────────
GÖREV BAŞLAMADAN ÖNCE
────────────────────────────────────────

Her görev öncesinde şu dosyaları sırayla oku:

  1. MEMORY.md          → Projenin özeti
  2. RULES.md           → Yasaklar ve zorunlular
  3. TASKS.md           → Güncel görev listesi
  4. PROJECT_SPECIFICATION.md  → Kapsam dışına çıkma
  5. ARCHITECTURE.md    → Teknik sınırlar

UYARI KONTROLÜ:
MEMORY.md'nin "Son güncelleme" tarihine bak.
Eğer 7 günden eskiyse kullanıcıyı şöyle uyar:

"⚠️ MEMORY.md [X] gündür güncellenmemiş.
Devam etmeden önce güncellemek ister misin?"

Güvenlikle ilgili bir görevse SECURITY.md'yi de oku.
Yeni bir terimle karşılaşırsan GLOSSARY.md'yi kontrol et.

────────────────────────────────────────
ÇALIŞMA KURALLARI
────────────────────────────────────────

KESİN YASAKLAR (kullanıcı izni olmadan):
  ✗ Dosya silme
  ✗ Teknoloji değiştirme
  ✗ Mimari değiştirme
  ✗ Çalışan sistemi yeniden yazma
  ✗ Gereksiz refactor
  ✗ Aynı anda birden fazla modülü değiştirme

ZORUNLU KURALLAR:
  ✓ Büyük görevleri küçük adımlara böl
  ✓ Önce mevcut kodu oku, sonra değiştir
  ✓ Her değişiklik minimum etki prensibi ile yapılmalı
  ✓ Belirsiz durumda tahmin etme, kullanıcıya sor
  ✓ GLOSSARY.md'deki terimleri kullan
  ✓ Yeni mimari karar alındıysa DECISIONS.md'ye yaz

────────────────────────────────────────
GÖREV SONUNDA
────────────────────────────────────────

ZORUNLU (her görev sonunda güncelle):

  MEMORY.md
    → Durumu, son yapılan işi, sıradaki adımı güncelle
    → Maksimum 100 satır — öz tut, aşma
    → "Son güncelleme" tarihini yaz
    → MEMORY.md güncellenmeden görev bitmez.

  CHANGELOG.md
    → Tarih ve yapılan değişiklikleri ekle
    → 200 satırı geçince eski kayıtları
      CHANGELOG_ARCHIVE/YYYY-MM.md dosyasına taşı

  TASKS.md
    → Tamamlananları [x] işaretle
    → Ortaya çıkan yeni görevleri ekle

GEREKİRSE güncelle:
  DATABASE_SCHEMA.md   (şema değiştiyse)
  API_SPECIFICATION.md (endpoint eklendi/değiştiyse)
  FILE_STRUCTURE.md    (yeni dosya/klasör eklendiyse)
  TECHNICAL_DEBT.md    (borç eklendi/ödendiyse)
  DECISIONS.md         (mimari karar alındıysa)
  RISKS.md             (yeni risk belirlendiyse)
  TESTING_STATUS.md    (test yazıldıysa)
  ENVIRONMENT.md       (yeni env değişkeni eklendiyse)
  SECURITY.md          (güvenlik kuralı değiştiyse)

────────────────────────────────────────
RAPORLAMA
────────────────────────────────────────

Her görev sonunda kısa rapor ver:

  ✓ Oluşturulan dosyalar
  ✓ Değiştirilen dosyalar
  ✗ Silinen dosyalar (varsa)
  ⚠ Tespit edilen riskler
  → Önerilen sonraki adım

────────────────────────────────────────
GIT
────────────────────────────────────────

Önemli bir modül tamamlandığında commit öner.

Commit formatı:
  feat(modül): kısa açıklama
  fix(modül): kısa açıklama
  docs(modül): kısa açıklama
  refactor(modül): kısa açıklama

Örnek:
  feat(auth): JWT login ve register endpoint'leri eklendi
  fix(users): profil güncelleme validasyon hatası düzeltildi
```

---

## Hızlı Başlangıç Kılavuzu

Yeni bir projeye başlarken takip edilecek sıra:

1. `project_docs/` klasörünü oluştur
2. `PROJECT_SPECIFICATION.md`'yi doldur (en önemli adım)
3. `ARCHITECTURE.md`'de stack kararını yaz
4. `MEMORY.md`'yi proje özetiyle başlat
5. `.clinerules` dosyasını proje köküne ekle
6. Diğer dosyaları ihtiyaç oldukça doldur

---

## İpuçları

**MEMORY.md kısa tutulmazsa sistem yavaşlar.**
Her güncelleme de "bu bilgi MEMORY.md'de mi olmalı yoksa
başka bir dosyada mı?" sorusunu sor.

**DECISIONS.md'yi ihmal etme.**
"Neden böyle yaptık?" sorusu 2 ay sonra gelecek.
O zaman cevabın olsun.

**GLOSSARY.md sürpriz değer katar.**
Ajan proje dilini öğrendikten sonra tutarsız terim
kullanmaz. Domain özgü terimler için bu dosyayı besle.

**CHANGELOG_ARCHIVE/ sistemi şişmeyi önler.**
CHANGELOG.md 200 satırı geçince arşivle.
Tarihsel kayıt kaybolmaz, ama aktif dosya okunabilir kalır.
