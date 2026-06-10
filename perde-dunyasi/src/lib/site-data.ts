import type { Announcement, Campaign, Category, Product } from "@/src/types";

const now = new Date().toISOString();

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Stor Perdeler",
    slug: "stor-perdeler",
    description: "Modern ve pratik stor perde çözümleri.",
    imageUrl: null,
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "cat-2",
    name: "Tül Perdeler",
    slug: "tul-perdeler",
    description: "Işığı yumuşatan hafif tül seçenekleri.",
    imageUrl: null,
    isActive: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    categoryId: "cat-1",
    name: "Zebra Stor Perde",
    slug: "zebra-stor-perde",
    shortDesc: "Gün ışığını kontrollü biçimde içeri alır.",
    description: "Katalog için örnek ürün açıklaması.",
    price: 1250,
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
    name: "Jakarlı Tül",
    slug: "jakarli-tul",
    shortDesc: "Salonlar için zarif tül seçeneği.",
    description: "Katalog için örnek ürün açıklaması.",
    price: null,
    priceUnit: "TL",
    isActive: true,
    isFeatured: false,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
];

export const campaigns: Campaign[] = [
  {
    id: "camp-1",
    title: "Haziran Stor İndirimi",
    slug: "haziran-stor-indirimi",
    description: "Seçili stor perde modellerinde özel kampanya.",
    imageUrl: null,
    storagePath: null,
    badgeText: "%20 İndirim",
    startDate: null,
    endDate: null,
    isActive: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Yeni koleksiyon mağazada",
    content: "Yeni sezon tül ve fon perdeler mağazaya geldi.",
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
  google_maps_url: null,
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
