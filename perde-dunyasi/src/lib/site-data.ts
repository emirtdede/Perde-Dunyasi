import type { Announcement, Campaign, Category, Product } from "@/src/types";

const now = new Date().toISOString();

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Stor Perdeler",
    slug: "stor-perdeler",
    description: "Modern, pratik ve şık mekanizmalı stor perde çözümleri.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-2",
    name: "Tül Perdeler",
    slug: "tul-perdeler",
    description: "Işığı yumuşatan, odanıza zerafet katan hafif tül seçenekleri.",
    imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
    isActive: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-3",
    name: "Fon Perdeler",
    slug: "fon-perdeler",
    description: "Renk ve doku uyumuyla dekorasyonu tamamlayan ağır kumaş perdeler.",
    imageUrl: "https://images.unsplash.com/photo-1574044536226-f5ee539e15ad?q=80&w=600&auto=format&fit=crop",
    isActive: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-4",
    name: "Dikey & Jaluzi Perdeler",
    slug: "jaluzi-perdeler",
    description: "Ofis ve evler için ışık yönlendirme ayarlı modern jaluzi sistemleri.",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
    isActive: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    categoryId: "cat-1",
    name: "Çift Mekanizmalı Zebra Perde",
    slug: "cift-mekanizmali-zebra-perde",
    shortDesc: "Gündüz ve gece kullanımına uygun çift kademeli stor sistemi.",
    description: "Hem tül hem de güneşlik görevini aynı anda üstlenen, özel zincir kontrolü ile pratiklik sağlayan modern stor perde sistemi. Kolay temizlenebilir leke tutmaz kumaştan üretilmiştir.",
    price: 1850,
    priceUnit: "TL",
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-2",
    categoryId: "cat-2",
    name: "Keten Dokulu Grek Tül Perde",
    slug: "keten-dokulu-grek-tul-perde",
    shortDesc: "Doğal keten görünümü sunan kırışmaz kaliteli grek tül.",
    description: "Ütü gerektirmeyen, asıldığında kendini salan dökümlü keten yapısıyla salon ve yatak odalarınıza natürel bir şıklık katar.",
    price: 950,
    priceUnit: "TL",
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-3",
    categoryId: "cat-3",
    name: "Kadife Fon Perde",
    slug: "kadife-fon-perde",
    shortDesc: "Yumuşak dokulu, parlak lüks kadife fon kumaşı.",
    description: "Zengin renk alternatifleri ve kalın dokusuyla kış aylarında ısı yalıtımına katkıda bulunurken, pencerelerinize asil ve lüks bir görünüm kazandırır.",
    price: 2400,
    priceUnit: "TL",
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod-4",
    categoryId: "cat-4",
    name: "Ahşap Jaluzi Perde",
    slug: "ahsap-jaluzi-perde",
    shortDesc: "50mm genişliğinde gerçek ahşap jaluzi paneller.",
    description: "Fırınlanmış doğal ahşaptan üretilen, ısı ve nem dayanımı yüksek, çalışma odaları ve mutfaklar için prestijli ışık kontrol çözümü.",
    price: 3200,
    priceUnit: "TL",
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
];

export const campaigns: Campaign[] = [
  {
    id: "camp-1",
    title: "Yaz Sezonu Stor İndirimi",
    slug: "yaz-sezonu-stor-indirimi",
    description: "Tüm stor ve zebra perde siparişlerinde net %25 indirim fırsatı.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    storagePath: null,
    badgeText: "%25 İndirim",
    startDate: null,
    endDate: null,
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "camp-2",
    title: "Ücretsiz Montaj Kampanyası",
    slug: "ucretsiz-montaj-kampanyasi",
    description: "Adıyaman merkez sınırları içerisinde 5 adet ve üzeri siparişlerde montaj bizden!",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
    storagePath: null,
    badgeText: "Montaj Bedava",
    startDate: null,
    endDate: null,
    isActive: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "camp-3",
    title: "3 Al 2 Öde Fon Fırsatı",
    slug: "3-al-2-ode-fon-firsati",
    description: "Seçili fon perdelerde her 3 adet siparişinizde en ucuz 1 fon perde hediye.",
    imageUrl: "https://images.unsplash.com/photo-1574044536226-f5ee539e15ad?q=80&w=600&auto=format&fit=crop",
    storagePath: null,
    badgeText: "3 Al 2 Öde",
    startDate: null,
    endDate: null,
    isActive: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "camp-4",
    title: "Evlilik Paketi İndirimi",
    slug: "evlilik-paketi-indirimi",
    description: "Tüm evi yenileyen veya yeni evlenen çiftlerimize özel komple paket alımlarında %30 indirim.",
    imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
    storagePath: null,
    badgeText: "%30 Paket İndirimi",
    startDate: null,
    endDate: null,
    isActive: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Yeni Sezon Ürünlerimiz Mağazada!",
    content: "Yılın en trend renkleri ve desenlerinden oluşan yeni fon ve tül koleksiyonumuz vitrinlerde yerini aldı. Detaylı bilgi ve inceleme için mağazamızı ziyaret edebilirsiniz.",
    imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
    storagePath: null,
    isPublished: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ann-2",
    title: "Pazar Günleri Hizmetinizdeyiz",
    content: "Sizlere daha rahat hizmet verebilmek adına, pazar günleri de saat 12:00 ile 18:00 arasında mağazamızı açık tutuyoruz.",
    imageUrl: null,
    storagePath: null,
    isPublished: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ann-3",
    title: "Leke Tutmaz Stor Kumaş Teknolojisi",
    content: "Yeni gelen nano-teknoloji stor perde kumaşlarımız su kaydırıcı ve toz tutmaz yapısıyla stor temizliğini dert olmaktan çıkarıyor.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
    storagePath: null,
    isPublished: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ann-4",
    title: "Adıyaman İçi Ücretsiz Ölçü Alma",
    content: "Katalogdan beğendiğiniz modeller için evinizde en doğru ölçüyü almak üzere teknik ekibimiz ücretsiz olarak adresinize geliyor.",
    imageUrl: null,
    storagePath: null,
    isPublished: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const siteSettings: Record<string, string | null> = {
  whatsapp_number: "905551234567",
  whatsapp_greeting: "Merhaba, {urun} hakkında fiyat teklifi almak istiyorum.",
  phone: "0555 123 45 67",
  email: "info@perdedunyasi.com",
  address: "Adıyaman, Türkiye",
  google_maps_url: "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d197.07737510102345!2d38.623752663694326!3d37.78446175719392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1za2FodGEgc2HEn2zEsWsgb2NhxJ_EsQ!5e0!3m2!1str!2str!4v1781944670932!5m2!1str!2str",
  about_text: "Perde Dünyası, vitrin odaklı modern bir perde mağazasıdır.",
  instagram_url: null,
  facebook_url: null,
  hero_title: "Hayalinizdeki Perdeler",
  hero_subtitle: "En kaliteli ürünler ve hızlı WhatsApp iletişimi.",
  hero_image_url: null,
  logo_url: null,
  logo_dark_url: null,
  meta_title: "Perde Dünyası",
  meta_description: "Perde, tül, stor ve jaluzi ürünleri için vitrin sitesi.",
};

export function getPublishedAnnouncements(limit?: number) {
  const items = announcements.filter((item) => item.isPublished);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getActiveCampaigns() {
  const today = new Date();
  return campaigns.filter((campaign) => {
    if (!campaign.isActive) {
      return false;
    }

    if (!campaign.endDate) {
      return true;
    }

    return new Date(campaign.endDate) >= today;
  });
}

export function getSettingsObject() {
  return siteSettings;
}
