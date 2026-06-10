# Risk Kaydı — Perde Dünyası

---

## Yüksek Risk

- **WhatsApp numarası girilmeden yayına alınırsa** — "Fiyat Teklifi Al" butonu görünmez,
  sitenin ana amacı çalışmaz. Önlem: Admin dashboard'da WhatsApp numarası eksikse
  kırmızı uyarı banner göster.

- **Supabase Storage 1GB dolumu** — 500+ ürün eklenirse depolama limiti aşılabilir.
  Önlem: Admin görsel yüklerken mevcut Storage kullanımını göster; %80 dolunca uyar.

---

## Orta Risk

- **Vercel Hobby plan timeout (10s)** — Toplu görsel yükleme veya büyük görsel işlemi
  timeout'a neden olabilir. Önlem: Görsel yükleme işlemini tek tek (sıralı) yap, max 5MB/görsel.

- **Supabase ücretsiz plan DB bağlantı limiti** — Hobby projesi 60 saniye hareketsizlikte
  DB bağlantısını kapatır (cold start). Önlem: Next.js Supabase client'ında connection pooler kullan.

- **Slug çakışması** — İki ürün aynı ada sahipse slug üretici otomatik numara ekler,
  ama admin bunu fark etmeyebilir. Önlem: Admin formunda anlık slug önizleme göster.

- **WhatsApp mesajı çok uzunsa reddedilebilir** — wa.me URL 4096 karakter limitine yaklaşılırsa
  mesaj kesilir. Önlem: `short_desc` alanını 300 karakterle sınırla; WhatsApp mesajını 500 altında tut.

---

## Düşük Risk

- **SEO — Görsellerin alt metni yoksa** — Tarayıcı uyarısı ve SEO puanı düşer.
  Önlem: `product.name` otomatik alt metin olarak kullanılır; boş alt metin bırakılmaz.

- **Admin şifresini unutursa** — Supabase Auth üzerinden "şifremi unuttum" e-postası gönderilir.
  Önlem: Giriş sayfasına "Şifremi Unuttum" linki ekle.

- **Mobil WhatsApp uygulaması yüklü değilse** — `wa.me` linki çalışmayabilir.
  Önlem: Buton başlığına "WhatsApp ile Fiyat Teklifi Al" yaz; beklenti yönetilir.

---

## Kapanan Riskler

_Henüz kapanan risk yok — proje yeni başlıyor._