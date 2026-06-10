import { createSupabaseServerClient } from "./server";
import type { Category, Product, Campaign, Announcement, ProductImage } from "@/src/types";
import {
  categories as mockCategories,
  products as mockProducts,
  campaigns as mockCampaigns,
  announcements as mockAnnouncements,
  siteSettings as mockSettings,
} from "@/src/lib/site-data";
import fs from "fs";
import path from "path";

// Check if Supabase environment variables are configured
const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

// ==========================================
// FILE-BASED LOCAL DATABASE (Fallback)
// ==========================================
// All local data is persisted to a JSON file on disk so that
// API route handlers and page renderers share the same state.
// This fixes the issue where in-memory variables are isolated
// across different Next.js module instances.

const LOCAL_DB_PATH = path.join(process.cwd(), ".local-db.json");

interface LocalDB {
  categories: Category[];
  products: Product[];
  campaigns: Campaign[];
  announcements: Announcement[];
  settings: Record<string, string | null>;
  productImages: ProductImage[];
}

function getDefaultDB(): LocalDB {
  return {
    categories: [...mockCategories],
    products: [...mockProducts],
    campaigns: [...mockCampaigns],
    announcements: [...mockAnnouncements],
    settings: { ...mockSettings },
    productImages: [],
  };
}

function readLocalDB(): LocalDB {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(raw) as LocalDB;
    }
  } catch (err) {
    console.error("Error reading local DB file, using defaults:", err);
  }
  return getDefaultDB();
}

function writeLocalDB(db: LocalDB): void {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local DB file:", err);
  }
}

// ==========================================
// COMPATIBILITY ACCESSORS
// ==========================================
// These provide read/write access to the file-based local DB
// so that existing function code works without modification.
// Every read fetches from disk, every write persists to disk.

// --- Getter helpers (always read fresh from disk) ---
function get_localCategories(): Category[] { return readLocalDB().categories; }
function get_localProducts(): Product[] { return readLocalDB().products; }
function get_localCampaigns(): Campaign[] { return readLocalDB().campaigns; }
function get_localAnnouncements(): Announcement[] { return readLocalDB().announcements; }
function get_localSettings(): Record<string, string | null> { return readLocalDB().settings; }
function get_localProductImages(): ProductImage[] { return readLocalDB().productImages; }

// --- Setter helpers (read-modify-write to disk) ---
function set_localCategories(val: Category[]) { const db = readLocalDB(); db.categories = val; writeLocalDB(db); }
function set_localProducts(val: Product[]) { const db = readLocalDB(); db.products = val; writeLocalDB(db); }
function set_localCampaigns(val: Campaign[]) { const db = readLocalDB(); db.campaigns = val; writeLocalDB(db); }
function set_localAnnouncements(val: Announcement[]) { const db = readLocalDB(); db.announcements = val; writeLocalDB(db); }
function set_localSettings(val: Record<string, string | null>) { const db = readLocalDB(); db.settings = val; writeLocalDB(db); }
function set_localProductImages(val: ProductImage[]) { const db = readLocalDB(); db.productImages = val; writeLocalDB(db); }

// --- Property-style accessors for backward compatibility ---
// JavaScript trick: use a module-level object with getters/setters
// so existing code like `_db.localCategories.find(...)` and `_db.localCategories = [...]` works.
const _db = {} as {
  localCategories: Category[];
  localProducts: Product[];
  localCampaigns: Campaign[];
  localAnnouncements: Announcement[];
  localSettings: Record<string, string | null>;
  localProductImages: ProductImage[];
};

Object.defineProperty(_db, "localCategories", { get: get_localCategories, set: set_localCategories });
Object.defineProperty(_db, "localProducts", { get: get_localProducts, set: set_localProducts });
Object.defineProperty(_db, "localCampaigns", { get: get_localCampaigns, set: set_localCampaigns });
Object.defineProperty(_db, "localAnnouncements", { get: get_localAnnouncements, set: set_localAnnouncements });
Object.defineProperty(_db, "localSettings", { get: get_localSettings, set: set_localSettings });
Object.defineProperty(_db, "localProductImages", { get: get_localProductImages, set: set_localProductImages });

// All references below use _db.localXxx to read/write through the file-based DB

// Helper to generate UUIDs for mock data
function generateUUID() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

interface DBProductImage {
  id: string;
  product_id: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

// ==========================================
// CATEGORIES SERVICE
// ==========================================

export async function getCategories(includeInactive = false): Promise<Category[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      let query = supabase.from("categories").select("*").order("sort_order", { ascending: true });
      if (!includeInactive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        imageUrl: item.image_url,
        isActive: item.is_active,
        sortOrder: item.sort_order,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (err) {
      console.error("Supabase getCategories error, falling back to mock:", err);
    }
  }

  // Fallback
  let list = _db.localCategories;
  if (!includeInactive) {
    list = list.filter(c => c.isActive);
  }
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image_url,
        isActive: data.is_active,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.error("Supabase getCategoryById error, falling back to mock:", err);
    }
  }

  return _db.localCategories.find(c => c.id === id) || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image_url,
        isActive: data.is_active,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.error("Supabase getCategoryBySlug error, falling back to mock:", err);
    }
  }

  return _db.localCategories.find(c => c.slug === slug) || null;
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image_url: data.imageUrl || null,
        sort_order: data.sortOrder || 0,
        is_active: data.isActive !== false,
      };
      const { data: inserted, error } = await supabase.from("categories").insert(dbData).select().single();
      if (error) throw error;
      return {
        id: inserted.id,
        name: inserted.name,
        slug: inserted.slug,
        description: inserted.description,
        imageUrl: inserted.image_url,
        isActive: inserted.is_active,
        sortOrder: inserted.sort_order,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };
    } catch (err) {
      console.error("Supabase createCategory error, falling back to mock:", err);
    }
  }

  const newCat: Category = {
    id: generateUUID(),
    name: data.name || "Yeni Kategori",
    slug: data.slug || "yeni-kategori",
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    sortOrder: Number(data.sortOrder) || 0,
    isActive: data.isActive !== false,
    createdAt: now,
    updatedAt: now,
  };
  _db.localCategories.push(newCat);
  return newCat;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData: Record<string, string | number | boolean | null | undefined> = {};
      if (data.name !== undefined) dbData.name = data.name;
      if (data.slug !== undefined) dbData.slug = data.slug;
      if (data.description !== undefined) dbData.description = data.description;
      if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;
      if (data.sortOrder !== undefined) dbData.sort_order = data.sortOrder;
      if (data.isActive !== undefined) dbData.is_active = data.isActive;

      const { data: updated, error } = await supabase
        .from("categories")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        imageUrl: updated.image_url,
        isActive: updated.is_active,
        sortOrder: updated.sort_order,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };
    } catch (err) {
      console.error("Supabase updateCategory error, falling back to mock:", err);
    }
  }

  const idx = _db.localCategories.findIndex(c => c.id === id);
  if (idx === -1) return null;

  _db.localCategories[idx] = {
    ..._db.localCategories[idx],
    ...data,
    updatedAt: now,
  };
  return _db.localCategories[idx];
}

export async function deleteCategory(id: string): Promise<boolean> {
  // Check if there are active products using this category
  const productsInCategory = await getProducts({ categoryId: id });
  if (productsInCategory.length > 0) {
    throw new Error("Bu kategoriye ait ürünler var. Önce ürünleri taşıyın veya silin.");
  }

  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase deleteCategory error, falling back to mock:", err);
    }
  }

  const initialLen = _db.localCategories.length;
  _db.localCategories = _db.localCategories.filter(c => c.id !== id);
  return _db.localCategories.length < initialLen;
}

// ==========================================
// PRODUCTS SERVICE
// ==========================================

export async function getProducts(params?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  search?: string;
  includeInactive?: boolean;
}): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      let query = supabase.from("products").select("*, categories(*), product_images(*)");
      
      if (!params?.includeInactive) {
        query = query.eq("is_active", true);
      }
      if (params?.categoryId) {
        query = query.eq("category_id", params.categoryId);
      }
      if (params?.isFeatured !== undefined) {
        query = query.eq("is_featured", params.isFeatured);
      }
      if (params?.search) {
        query = query.ilike("name", `%${params.search}%`);
      }
      
      const { data, error } = await query.order("sort_order", { ascending: true });
      if (error) throw error;

      let filtered = data || [];
      
      // Filter by category slug if provided
      if (params?.categorySlug) {
        filtered = filtered.filter(p => p.categories && p.categories.slug === params.categorySlug);
      }

      return filtered.map(item => ({
        id: item.id,
        categoryId: item.category_id,
        name: item.name,
        slug: item.slug,
        shortDesc: item.short_desc,
        description: item.description,
        price: item.price ? Number(item.price) : null,
        priceUnit: item.price_unit,
        isActive: item.is_active,
        isFeatured: item.is_featured,
        sortOrder: item.sort_order,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        category: item.categories ? {
          id: item.categories.id,
          name: item.categories.name,
          slug: item.categories.slug,
          description: item.categories.description,
          imageUrl: item.categories.image_url,
          isActive: item.categories.is_active,
          sortOrder: item.categories.sort_order,
          createdAt: item.categories.created_at,
          updatedAt: item.categories.updated_at,
        } : undefined,
        images: (item.product_images || []).map((img: DBProductImage) => ({
          id: img.id,
          productId: img.product_id,
          url: img.url,
          storagePath: img.storage_path,
          isPrimary: img.is_primary,
          sortOrder: img.sort_order,
          createdAt: img.created_at,
          altText: null,
        })).sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder),
      }));
    } catch (err) {
      console.error("Supabase getProducts error, falling back to mock:", err);
    }
  }

  // Fallback
  let list = [..._db.localProducts];
  
  if (!params?.includeInactive) {
    list = list.filter(p => p.isActive);
  }
  if (params?.categoryId) {
    list = list.filter(p => p.categoryId === params.categoryId);
  }
  if (params?.categorySlug) {
    const cat = _db.localCategories.find(c => c.slug === params.categorySlug);
    list = cat ? list.filter(p => p.categoryId === cat.id) : [];
  }
  if (params?.isFeatured !== undefined) {
    list = list.filter(p => p.isFeatured === params.isFeatured);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q));
  }

  // Add category object and images
  return list
    .map(p => ({
      ...p,
      category: _db.localCategories.find(c => c.id === p.categoryId) || undefined,
      images: _db.localProductImages
        .filter(img => img.productId === p.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), product_images(*)")
        .eq("slug", slug)
        .single();
      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return {
        id: data.id,
        categoryId: data.category_id,
        name: data.name,
        slug: data.slug,
        shortDesc: data.short_desc,
        description: data.description,
        price: data.price ? Number(data.price) : null,
        priceUnit: data.price_unit,
        isActive: data.is_active,
        isFeatured: data.is_featured,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: data.categories ? {
          id: data.categories.id,
          name: data.categories.name,
          slug: data.categories.slug,
          description: data.categories.description,
          imageUrl: data.categories.image_url,
          isActive: data.categories.is_active,
          sortOrder: data.categories.sort_order,
          createdAt: data.categories.created_at,
          updatedAt: data.categories.updated_at,
        } : undefined,
        images: (data.product_images || []).map((img: DBProductImage) => ({
          id: img.id,
          productId: img.product_id,
          url: img.url,
          storagePath: img.storage_path,
          isPrimary: img.is_primary,
          sortOrder: img.sort_order,
          createdAt: img.created_at,
          altText: null,
        })).sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder),
      };
    } catch (err) {
      console.error("Supabase getProductBySlug error, falling back to mock:", err);
    }
  }

  const p = _db.localProducts.find(prod => prod.slug === slug);
  if (!p) return null;

  return {
    ...p,
    category: _db.localCategories.find(c => c.id === p.categoryId) || undefined,
    images: _db.localProductImages
      .filter(img => img.productId === p.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*), product_images(*)")
        .eq("id", id)
        .single();
      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return {
        id: data.id,
        categoryId: data.category_id,
        name: data.name,
        slug: data.slug,
        shortDesc: data.short_desc,
        description: data.description,
        price: data.price ? Number(data.price) : null,
        priceUnit: data.price_unit,
        isActive: data.is_active,
        isFeatured: data.is_featured,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: data.categories ? {
          id: data.categories.id,
          name: data.categories.name,
          slug: data.categories.slug,
          description: data.categories.description,
          imageUrl: data.categories.image_url,
          isActive: data.categories.is_active,
          sortOrder: data.categories.sort_order,
          createdAt: data.categories.created_at,
          updatedAt: data.categories.updated_at,
        } : undefined,
        images: (data.product_images || []).map((img: DBProductImage) => ({
          id: img.id,
          productId: img.product_id,
          url: img.url,
          storagePath: img.storage_path,
          isPrimary: img.is_primary,
          sortOrder: img.sort_order,
          createdAt: img.created_at,
          altText: null,
        })).sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder),
      };
    } catch (err) {
      console.error("Supabase getProductById error, falling back to mock:", err);
    }
  }

  const p = _db.localProducts.find(prod => prod.id === id);
  if (!p) return null;

  return {
    ...p,
    category: _db.localCategories.find(c => c.id === p.categoryId) || undefined,
    images: _db.localProductImages
      .filter(img => img.productId === p.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData = {
        category_id: data.categoryId,
        name: data.name,
        slug: data.slug,
        short_desc: data.shortDesc || null,
        description: data.description || null,
        price: data.price || null,
        price_unit: data.priceUnit || "TL",
        is_active: data.isActive !== false,
        is_featured: data.isFeatured === true,
        sort_order: data.sortOrder || 0,
      };
      const { data: inserted, error } = await supabase.from("products").insert(dbData).select().single();
      if (error) throw error;
      return {
        id: inserted.id,
        categoryId: inserted.category_id,
        name: inserted.name,
        slug: inserted.slug,
        shortDesc: inserted.short_desc,
        description: inserted.description,
        price: inserted.price ? Number(inserted.price) : null,
        priceUnit: inserted.price_unit,
        isActive: inserted.is_active,
        isFeatured: inserted.is_featured,
        sortOrder: inserted.sort_order,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };
    } catch (err) {
      console.error("Supabase createProduct error, falling back to mock:", err);
    }
  }

  const newProd: Product = {
    id: generateUUID(),
    categoryId: data.categoryId || _db.localCategories[0]?.id || "cat-1",
    name: data.name || "Yeni Ürün",
    slug: data.slug || "yeni-urun",
    shortDesc: data.shortDesc || null,
    description: data.description || null,
    price: data.price !== undefined ? Number(data.price) : null,
    priceUnit: data.priceUnit || "TL",
    isActive: data.isActive !== false,
    isFeatured: data.isFeatured === true,
    sortOrder: Number(data.sortOrder) || 0,
    createdAt: now,
    updatedAt: now,
  };
  _db.localProducts.push(newProd);
  return newProd;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData: Record<string, string | number | boolean | null | undefined> = {};
      if (data.categoryId !== undefined) dbData.category_id = data.categoryId;
      if (data.name !== undefined) dbData.name = data.name;
      if (data.slug !== undefined) dbData.slug = data.slug;
      if (data.shortDesc !== undefined) dbData.short_desc = data.shortDesc;
      if (data.description !== undefined) dbData.description = data.description;
      if (data.price !== undefined) dbData.price = data.price;
      if (data.priceUnit !== undefined) dbData.price_unit = data.priceUnit;
      if (data.isActive !== undefined) dbData.is_active = data.isActive;
      if (data.isFeatured !== undefined) dbData.is_featured = data.isFeatured;
      if (data.sortOrder !== undefined) dbData.sort_order = data.sortOrder;

      const { data: updated, error } = await supabase
        .from("products")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return {
        id: updated.id,
        categoryId: updated.category_id,
        name: updated.name,
        slug: updated.slug,
        shortDesc: updated.short_desc,
        description: updated.description,
        price: updated.price ? Number(updated.price) : null,
        priceUnit: updated.price_unit,
        isActive: updated.is_active,
        isFeatured: updated.is_featured,
        sortOrder: updated.sort_order,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };
    } catch (err) {
      console.error("Supabase updateProduct error, falling back to mock:", err);
    }
  }

  const idx = _db.localProducts.findIndex(p => p.id === id);
  if (idx === -1) return null;

  _db.localProducts[idx] = {
    ..._db.localProducts[idx],
    ...data,
    updatedAt: now,
  };
  return _db.localProducts[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase deleteProduct error, falling back to mock:", err);
    }
  }

  const initialLen = _db.localProducts.length;
  _db.localProducts = _db.localProducts.filter(p => p.id !== id);
  return _db.localProducts.length < initialLen;
}

// ==========================================
// PRODUCT IMAGES SERVICE
// ==========================================

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []).map(img => ({
        id: img.id,
        productId: img.product_id,
        url: img.url,
        storagePath: img.storage_path,
        isPrimary: img.is_primary,
        sortOrder: img.sort_order,
        createdAt: img.created_at,
        altText: null,
      }));
    } catch (err) {
      console.error("Supabase getProductImages error, falling back to mock:", err);
    }
  }
  return _db.localProductImages
    .filter(img => img.productId === productId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createProductImage(productId: string, url: string, storagePath: string): Promise<ProductImage> {
  const now = new Date().toISOString();
  const existingImages = await getProductImages(productId);
  const isPrimary = existingImages.length === 0;
  const maxSortOrder = existingImages.reduce((max, img) => Math.max(max, img.sortOrder), -1);
  const sortOrder = maxSortOrder + 1;

  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData = {
        product_id: productId,
        url,
        storage_path: storagePath,
        is_primary: isPrimary,
        sort_order: sortOrder,
      };
      const { data, error } = await supabase
        .from("product_images")
        .insert(dbData)
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        productId: data.product_id,
        url: data.url,
        storagePath: data.storage_path,
        isPrimary: data.is_primary,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        altText: null,
      };
    } catch (err) {
      console.error("Supabase createProductImage error, falling back to mock:", err);
    }
  }

  const newImg: ProductImage = {
    id: generateUUID(),
    productId,
    url,
    storagePath,
    isPrimary,
    sortOrder,
    createdAt: now,
    altText: null,
  };
  _db.localProductImages.push(newImg);
  return newImg;
}

export async function setPrimaryImage(productId: string, imageId: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { error: err1 } = await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
      if (err1) throw err1;

      const { error: err2 } = await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", imageId);
      if (err2) throw err2;

      return true;
    } catch (err) {
      console.error("Supabase setPrimaryImage error, falling back to mock:", err);
    }
  }

  _db.localProductImages = _db.localProductImages.map(img => {
    if (img.productId === productId) {
      return { ...img, isPrimary: img.id === imageId };
    }
    return img;
  });
  return true;
}

export async function deleteProductImage(imageId: string): Promise<boolean> {
  let imgToDelete: ProductImage | null = null;
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("id", imageId)
        .single();
      if (!error && data) {
        imgToDelete = {
          id: data.id,
          productId: data.product_id,
          url: data.url,
          storagePath: data.storage_path,
          isPrimary: data.is_primary,
          sortOrder: data.sort_order,
          createdAt: data.created_at,
          altText: null,
        };
      }
    } catch (err) {
      console.error("Supabase error fetching image before delete:", err);
    }
  } else {
    imgToDelete = _db.localProductImages.find(img => img.id === imageId) || null;
  }

  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from("product_images").delete().eq("id", imageId);
      if (error) throw error;

      if (imgToDelete && imgToDelete.isPrimary) {
        const remaining = await getProductImages(imgToDelete.productId);
        if (remaining.length > 0) {
          await setPrimaryImage(imgToDelete.productId, remaining[0].id);
        }
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteProductImage error, falling back to mock:", err);
    }
  }

  const initialLen = _db.localProductImages.length;
  _db.localProductImages = _db.localProductImages.filter(img => img.id !== imageId);
  const deleted = _db.localProductImages.length < initialLen;

  if (deleted && imgToDelete && imgToDelete.isPrimary) {
    const remaining = _db.localProductImages.filter(img => img.productId === imgToDelete!.productId);
    if (remaining.length > 0) {
      remaining[0].isPrimary = true;
    }
  }

  return deleted;
}

export async function reorderProductImages(productId: string, orders: { id: string; sortOrder: number }[]): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      await Promise.all(
        orders.map(o =>
          supabase
            .from("product_images")
            .update({ sort_order: o.sortOrder })
            .eq("id", o.id)
        )
      );
      return true;
    } catch (err) {
      console.error("Supabase reorderProductImages error, falling back to mock:", err);
    }
  }

  _db.localProductImages = _db.localProductImages.map(img => {
    const orderObj = orders.find(o => o.id === img.id);
    if (orderObj) {
      return { ...img, sortOrder: orderObj.sortOrder };
    }
    return img;
  });
  return true;
}

// ==========================================
// CAMPAIGNS SERVICE
// ==========================================

export async function getCampaigns(includeInactive = false): Promise<Campaign[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      let query = supabase.from("campaigns").select("*").order("sort_order", { ascending: true });
      if (!includeInactive) {
        query = query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (error) throw error;

      const today = new Date();
      return (data || [])
        .map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          imageUrl: item.image_url,
          storagePath: item.storage_path,
          badgeText: item.badge_text,
          startDate: item.start_date,
          endDate: item.end_date,
          isActive: item.is_active,
          sortOrder: item.sort_order,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
        .filter(c => {
          if (includeInactive) return true;
          // Extra validation: if endDate exists and has passed, treat as inactive
          if (c.endDate && new Date(c.endDate) < today) return false;
          return true;
        });
    } catch (err) {
      console.error("Supabase getCampaigns error, falling back to mock:", err);
    }
  }

  // Fallback
  let list = _db.localCampaigns;
  if (!includeInactive) {
    const today = new Date();
    list = list.filter(c => {
      if (!c.isActive) return false;
      if (c.endDate && new Date(c.endDate) < today) return false;
      return true;
    });
  }
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).single();
      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image_url,
        storagePath: data.storage_path,
        badgeText: data.badge_text,
        startDate: data.start_date,
        endDate: data.end_date,
        isActive: data.is_active,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.error("Supabase getCampaignById error, falling back to mock:", err);
    }
  }

  return _db.localCampaigns.find(c => c.id === id) || null;
}

export async function createCampaign(data: Partial<Campaign>): Promise<Campaign> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData = {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        badge_text: data.badgeText || null,
        image_url: data.imageUrl || null,
        storage_path: data.storagePath || null,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        is_active: data.isActive !== false,
        sort_order: data.sortOrder || 0,
      };
      const { data: inserted, error } = await supabase.from("campaigns").insert(dbData).select().single();
      if (error) throw error;
      return {
        id: inserted.id,
        title: inserted.title,
        slug: inserted.slug,
        description: inserted.description,
        imageUrl: inserted.image_url,
        storagePath: inserted.storage_path,
        badgeText: inserted.badge_text,
        startDate: inserted.start_date,
        endDate: inserted.end_date,
        isActive: inserted.is_active,
        sortOrder: inserted.sort_order,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };
    } catch (err) {
      console.error("Supabase createCampaign error, falling back to mock:", err);
    }
  }

  const newCamp: Campaign = {
    id: generateUUID(),
    title: data.title || "Yeni Kampanya",
    slug: data.slug || "yeni-kampanya",
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    storagePath: data.storagePath || null,
    badgeText: data.badgeText || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    isActive: data.isActive !== false,
    sortOrder: Number(data.sortOrder) || 0,
    createdAt: now,
    updatedAt: now,
  };
  _db.localCampaigns.push(newCamp);
  return newCamp;
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData: Record<string, string | number | boolean | null | undefined> = {};
      if (data.title !== undefined) dbData.title = data.title;
      if (data.slug !== undefined) dbData.slug = data.slug;
      if (data.description !== undefined) dbData.description = data.description;
      if (data.badgeText !== undefined) dbData.badge_text = data.badgeText;
      if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;
      if (data.storagePath !== undefined) dbData.storage_path = data.storagePath;
      if (data.startDate !== undefined) dbData.start_date = data.startDate;
      if (data.endDate !== undefined) dbData.end_date = data.endDate;
      if (data.isActive !== undefined) dbData.is_active = data.isActive;
      if (data.sortOrder !== undefined) dbData.sort_order = data.sortOrder;

      const { data: updated, error } = await supabase
        .from("campaigns")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        description: updated.description,
        imageUrl: updated.image_url,
        storagePath: updated.storage_path,
        badgeText: updated.badge_text,
        startDate: updated.start_date,
        endDate: updated.end_date,
        isActive: updated.is_active,
        sortOrder: updated.sort_order,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };
    } catch (err) {
      console.error("Supabase updateCampaign error, falling back to mock:", err);
    }
  }

  const idx = _db.localCampaigns.findIndex(c => c.id === id);
  if (idx === -1) return null;

  _db.localCampaigns[idx] = {
    ..._db.localCampaigns[idx],
    ...data,
    updatedAt: now,
  };
  return _db.localCampaigns[idx];
}

export async function deleteCampaign(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase deleteCampaign error, falling back to mock:", err);
    }
  }

  const initialLen = _db.localCampaigns.length;
  _db.localCampaigns = _db.localCampaigns.filter(c => c.id !== id);
  return _db.localCampaigns.length < initialLen;
}

// ==========================================
// ANNOUNCEMENTS SERVICE
// ==========================================

export async function getAnnouncements(includeUnpublished = false): Promise<Announcement[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      let query = supabase.from("announcements").select("*");
      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }
      // Sort published ones by published_at DESC, draft ones by created_at DESC
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        isPublished: item.is_published,
        publishedAt: item.published_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (err) {
      console.error("Supabase getAnnouncements error, falling back to mock:", err);
    }
  }

  // Fallback
  let list = _db.localAnnouncements;
  if (!includeUnpublished) {
    list = list.filter(a => a.isPublished);
  }
  return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("announcements").select("*").eq("id", id).single();
      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        isPublished: data.is_published,
        publishedAt: data.published_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.error("Supabase getAnnouncementById error, falling back to mock:", err);
    }
  }

  return _db.localAnnouncements.find(a => a.id === id) || null;
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData = {
        title: data.title,
        content: data.content,
        is_published: data.isPublished === true,
        published_at: data.isPublished ? now : null,
      };
      const { data: inserted, error } = await supabase.from("announcements").insert(dbData).select().single();
      if (error) throw error;
      return {
        id: inserted.id,
        title: inserted.title,
        content: inserted.content,
        isPublished: inserted.is_published,
        publishedAt: inserted.published_at,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };
    } catch (err) {
      console.error("Supabase createAnnouncement error, falling back to mock:", err);
    }
  }

  const newAnn: Announcement = {
    id: generateUUID(),
    title: data.title || "Yeni Duyuru",
    content: data.content || "",
    isPublished: data.isPublished === true,
    publishedAt: data.isPublished ? now : null,
    createdAt: now,
    updatedAt: now,
  };
  _db.localAnnouncements.push(newAnn);
  return newAnn;
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | null> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const dbData: Record<string, string | number | boolean | null | undefined> = {};
      if (data.title !== undefined) dbData.title = data.title;
      if (data.content !== undefined) dbData.content = data.content;
      if (data.isPublished !== undefined) {
        dbData.is_published = data.isPublished;
        if (data.isPublished) {
          dbData.published_at = now;
        }
      }

      const { data: updated, error } = await supabase
        .from("announcements")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return {
        id: updated.id,
        title: updated.title,
        content: updated.content,
        isPublished: updated.is_published,
        publishedAt: updated.published_at,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };
    } catch (err) {
      console.error("Supabase updateAnnouncement error, falling back to mock:", err);
    }
  }

  const idx = _db.localAnnouncements.findIndex(a => a.id === id);
  if (idx === -1) return null;

  const wasPublished = _db.localAnnouncements[idx].isPublished;
  const isPublishedNow = data.isPublished !== undefined ? data.isPublished : wasPublished;

  _db.localAnnouncements[idx] = {
    ..._db.localAnnouncements[idx],
    ...data,
    publishedAt: isPublishedNow && !wasPublished ? now : _db.localAnnouncements[idx].publishedAt,
    updatedAt: now,
  };
  return _db.localAnnouncements[idx];
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase deleteAnnouncement error, falling back to mock:", err);
    }
  }

  const initialLen = _db.localAnnouncements.length;
  _db.localAnnouncements = _db.localAnnouncements.filter(a => a.id !== id);
  return _db.localAnnouncements.length < initialLen;
}

// ==========================================
// SITE SETTINGS SERVICE
// ==========================================

export async function getSettings(): Promise<Record<string, string | null>> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      
      const settingsObj: Record<string, string | null> = {};
      (data || []).forEach(row => {
        settingsObj[row.key] = row.value;
      });
      return settingsObj;
    } catch (err) {
      console.error("Supabase getSettings error, falling back to mock:", err);
    }
  }

  return _db.localSettings;
}

export async function updateSettings(settings: Record<string, string | null>): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServerClient();
      
      // Perform an upsert for each setting key
      const upsertData = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));

      // In Supabase we can upsert by key because it has a UNIQUE index
      const { error } = await supabase
        .from("site_settings")
        .upsert(upsertData, { onConflict: "key" });
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Supabase updateSettings error, falling back to mock:", err);
    }
  }

  _db.localSettings = {
    ..._db.localSettings,
    ...settings,
  };
  return true;
}
