# UI/UX Kılavuzu — Perde Dünyası

## Tasarım Felsefesi

Modern, şık ve mağazanın kimliğini yansıtan bir vitrin. Siyah-turuncu renk paleti güçlü ve premium bir his yaratır. Kullanıcı ürüne odaklanır; arayüz kendini geri çeker.

---

## Tema

- **Açık / Koyu Mod:** İkisi de desteklenir.
- **Varsayılan:** Sistem tercihi (`prefers-color-scheme`).
- **Kalıcılık:** `localStorage` ile kullanıcı tercihi saklanır.
- **Geçiş:** Tailwind `dark:` prefix + `class` stratejisi kullanılır (`html` etiketine `dark` class eklenir).

---

## Renk Paleti

### Ana Renkler

| Token             | Açık Mod  | Koyu Mod  | Kullanım                                        |
|-------------------|-----------|-----------|-------------------------------------------------|
| `primary`         | #F97316   | #FB923C   | CTA butonlar, badge, hover, aktif link, vurgu   |
| `primary-dark`    | #EA580C   | #F97316   | Primary hover durumu                            |
| `primary-light`   | #FED7AA   | #7C2D12   | Primary arka plan nüansları, chip, rozet        |

### Nötr Renkler

| Token             | Açık Mod  | Koyu Mod  | Kullanım                              |
|-------------------|-----------|-----------|---------------------------------------|
| `bg-base`         | #FFFFFF   | #0A0A0A   | Ana sayfa arka planı                  |
| `bg-surface`      | #F8F8F8   | #141414   | Kart, panel, modal arka planı         |
| `bg-elevated`     | #F0F0F0   | #1E1E1E   | Hover kart, dropdown, ikincil yüzeyler|
| `border`          | #E5E5E5   | #2A2A2A   | Tüm kenarlıklar                       |
| `text-primary`    | #0A0A0A   | #F5F5F5   | Başlıklar, önemli metin               |
| `text-secondary`  | #525252   | #A3A3A3   | İkincil metin, açıklamalar            |
| `text-muted`      | #A3A3A3   | #525252   | Yer tutucu, devre dışı metin          |

### Durum Renkleri

| Token     | Değer   | Kullanım                   |
|-----------|---------|----------------------------|
| `success` | #22C55E | Başarı bildirimi           |
| `error`   | #EF4444 | Hata bildirimi, form hatası|
| `warning` | #F59E0B | Uyarı bildirimi            |
| `info`    | #3B82F6 | Bilgi bildirimi            |

### Tailwind Config Örneği

```js
// tailwind.config.js
colors: {
  primary: {
    DEFAULT: '#F97316',
    dark: '#EA580C',
    light: '#FED7AA',
  },
  surface: {
    light: '#F8F8F8',
    dark: '#141414',
  }
}
```

---

## Tipografi

- **Font Ailesi:** `Inter` (Google Fonts) — `font-sans`
- **Mono Font:** `JetBrains Mono` — sadece kod blokları için

| Kullanım         | Tailwind Class                | Weight |
|------------------|-------------------------------|--------|
| Hero Başlık      | `text-5xl md:text-7xl`        | 800    |
| Sayfa Başlığı    | `text-3xl md:text-4xl`        | 700    |
| Bölüm Başlığı    | `text-2xl md:text-3xl`        | 700    |
| Kart Başlığı     | `text-lg md:text-xl`          | 600    |
| Gövde Metni      | `text-base`                   | 400    |
| Küçük Metin      | `text-sm`                     | 400    |
| Etiket / Badge   | `text-xs`                     | 600    |

**Letter Spacing:** Başlıklarda `-0.02em` (tight), gövdede normal.
**Line Height:** Başlıklar `1.1–1.2`, gövde `1.6–1.7`.

---

## Animasyon

- **Kütüphane:** Framer Motion 11+
- **Temel Kurallar:**
  - `reduced-motion` media query'ye saygı göster — hareket azalt veya sıfırla.
  - Animasyonlar içeriği geciktirmez; görüntülenmeyi hızlandırır.

| Animasyon Tipi        | Süre    | Easing        | Kullanım                     |
|-----------------------|---------|---------------|------------------------------|
| Mikro etkileşim       | 150ms   | `easeOut`     | Hover, focus, buton tıklama  |
| Sayfa geçişi          | 300ms   | `easeInOut`   | Route değişimi               |
| Kart / modal açılma   | 200ms   | `spring`      | Belirme, kayma               |
| Scroll animasyonu     | 400ms   | `easeOut`     | Viewport'a girince reveal    |
| Bildirim (toast)      | 250ms   | `easeInOut`   | Çıkma ve kapanma             |

**Scroll Reveal Örneği:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
```

---

## Bileşen Kuralları

### Buton

| Varyant     | Görünüm                                        | Kullanım                |
|-------------|------------------------------------------------|-------------------------|
| `primary`   | Turuncu arka plan, beyaz metin, rounded-lg      | Ana CTA                 |
| `secondary` | Şeffaf, turuncu kenarlık, turuncu metin        | İkincil aksiyon         |
| `ghost`     | Şeffaf, koyu hover, muted metin                | Üçüncül aksiyon         |
| `danger`    | Kırmızı, silme onayı                           | Silme işlemleri         |

```tsx
// Boyut sınıfları
sm:  px-3 py-1.5 text-sm
md:  px-5 py-2.5 text-base  (varsayılan)
lg:  px-7 py-3.5 text-lg

// Ortak:
rounded-lg font-semibold transition-all duration-150
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
disabled:opacity-50 disabled:cursor-not-allowed
```

### Ürün Kartı

```
┌────────────────────────┐
│  [Görsel - aspect 4/3] │
│  [Kategori Badge]      │ ← turuncu, sol üst köşe
├────────────────────────┤
│  Ürün Adı              │ ← font-semibold
│  Kısa açıklama         │ ← text-sm text-secondary, 2 satır clamp
│  ─────────────────     │
│  Fiyat  [WA Butonu →]  │ ← fiyat varsa göster, buton turuncu
└────────────────────────┘
```

- Border: `border border-border`
- Hover: `hover:border-primary hover:shadow-lg hover:shadow-primary/10`
- `rounded-xl overflow-hidden`

### Input / Form

```tsx
// Temel input
className="w-full rounded-lg border border-border bg-surface px-4 py-2.5
           text-text-primary placeholder:text-text-muted
           focus:outline-none focus:ring-2 focus:ring-primary
           dark:bg-surface-dark"
```

- Hata durumu: `border-error ring-error/30`
- Yardım metni: `text-xs text-text-secondary mt-1`
- Hata mesajı: `text-xs text-error mt-1`

### Modal / Dialog

```
- backdrop: rgba(0,0,0,0.6) + backdrop-blur-sm
- max-width: max-w-lg (admin formları), max-w-3xl (görsel önizleme)
- rounded-2xl
- shadow: shadow-2xl
- Animasyon: scale(0.95)→scale(1) + opacity 0→1, 200ms spring
```

### Toast / Bildirim

```
- Pozisyon: sağ alt köşe (bottom-4 right-4)
- Yığılma: en fazla 3 toast
- Başarı: yeşil sol kenarlık
- Hata: kırmızı sol kenarlık
- Otomatik kapanma: 4 saniye
```

### Admin Panel

```
- Sidebar: 240px sabit genişlik, koyu arka plan
- İçerik alanı: sol sidebar hariç tüm genişlik
- Mobil: sidebar drawer (hamburger butonu)
- Aktif menü item: turuncu arka plan, sol kenarlık vurgusu
```

---

## Layout & Grid

```
Max içerik genişliği:  1280px  (max-w-7xl)
Sayfa kenar boşluğu:   px-4 sm:px-6 lg:px-8
Section dikey boşluk:  py-16 md:py-24

Ürün grid (katalog):
  Mobil:    1 kolon  (grid-cols-1)
  Tablet:   2 kolon  (sm:grid-cols-2)
  Desktop:  3 kolon  (lg:grid-cols-3)
  Geniş:    4 kolon  (xl:grid-cols-4)

Ana sayfa öne çıkan ürünler:
  Mobil:    1 kolon
  Tablet:   2 kolon
  Desktop:  4 kolon
```

---

## Header

```
- Yükseklik: h-16 (sabit)
- Sticky: top-0 z-50
- Arka plan: bg-base/80 backdrop-blur-md (blur ile şeffaflık)
- Sol: Logo (siyah/turuncu SVG veya metin)
- Orta: Navigation linkleri (masaüstünde)
- Sağ: Tema değiştirici (güneş/ay ikonu) + Mobil hamburger
- Scroll'da shadow eklenir: shadow-sm
```

---

## Footer

```
- Arka plan: bg-surface (dark: bg-surface-dark)
- Üst: Logo + kısa açıklama | Hızlı linkler | İletişim bilgileri | Sosyal medya
- Alt: Copyright + "Perde Dünyası © 2025"
- Renk tonu: text-secondary
```

---

## Sayfa Yapıları

### Ana Sayfa Sıralama
1. Hero Section — büyük başlık, alt metin, "Ürünleri İncele" CTA butonu
2. Kategoriler — yatay scroll (mobil), grid (masaüstü)
3. Öne Çıkan Ürünler — 4'lü grid
4. Aktif Kampanyalar — banner/kart listesi
5. Son Duyurular — 3 duyuru listesi
6. İletişim CTA — WhatsApp'a yönlendiren büyük banner

### Ürün Kataloğu Sayfası
1. Başlık + breadcrumb
2. Sol kenar: Kategori filtresi (masaüstü sidebar, mobil drawer)
3. Üst: Sıralama seçimi
4. Sağ: Ürün grid + sayfalama

### Ürün Detay Sayfası
1. Breadcrumb
2. Sol: Görsel galerisi (ana görsel + küçük görsel listesi)
3. Sağ: Ürün adı, fiyat, açıklama, "WhatsApp Fiyat Teklifi Al" büyük butonu
4. Alt: "Benzer Ürünler" (aynı kategori)

---

## İkon Kütüphanesi

- **Lucide React** kullanılır.
- İkon boyutları: `size={16}` (küçük), `size={20}` (standart), `size={24}` (büyük)
- WhatsApp ikonu: özel SVG (Lucide'de yok)

---

## Görsel Kuralları

- **Aspect ratio (ürün):** `4:3` veya `1:1` — tutarlılık için admin bilgilendirilmeli
- **Format:** WEBP tercihli (upload sırasında dönüştürme gerekmez; Supabase Storage URL'de `?format=origin`)
- **Placeholder:** Yükleme sırasında `blur-up` tekniği (Next.js `blurDataURL`)
- **Lazy loading:** Viewport dışındakiler için `loading="lazy"`
- **Alt metin:** Zorunlu — ürün adı kullanılır

---

## Erişilebilirlik

- Tüm etkileşimli elemanlarda `aria-label` zorunlu.
- Kontrast oranı: en az **4.5:1** (normal metin), **3:1** (büyük metin).
- Klavye navigasyonu: Tab sırası mantıklı, focus görünür.
- Modal: focus trap uygulanır; Escape ile kapatılır.
- Form: her input'un `<label>` veya `aria-label` ile bağlantısı var.
- Renk bilgisi tek başına anlam taşımaz (ikonla desteklenir).