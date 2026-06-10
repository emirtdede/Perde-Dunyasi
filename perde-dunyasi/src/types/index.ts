export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  storagePath: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  price: number | null;
  priceUnit: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  images?: ProductImage[];
};

export type Campaign = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  storagePath: string | null;
  badgeText: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  storagePath?: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SiteSettings = {
  id: string;
  key: string;
  value: string | null;
  updatedAt: string;
};
