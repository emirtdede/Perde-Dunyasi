// One-off script to insert 4 sample items into Supabase Database for each category.
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Simple manual env parser for .env.local
const envPath = path.join(__dirname, "../.env.local");
let supabaseUrl = "";
let supabaseKey = "";

if (fs.existsSync(envPath)) {
  const fileContent = fs.readFileSync(envPath, "utf-8");
  fileContent.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
      if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseKey = val;
    }
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const now = new Date().toISOString();

async function runSeed() {
  console.log("Seeding Supabase DB with 4 mock entries for each section...");

  // 1. Categories
  const categories = [
    {
      id: "1a111111-1111-1111-1111-111111111111",
      name: "Stor Perdeler",
      slug: "stor-perdeler",
      description: "Modern, pratik ve şık mekanizmalı stor perde çözümleri.",
      image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
      is_active: true,
      sort_order: 1
    },
    {
      id: "2b222222-2222-2222-2222-222222222222",
      name: "Tül Perdeler",
      slug: "tul-perdeler",
      description: "Işığı yumuşatan, odanıza zerafet katan hafif tül seçenekleri.",
      image_url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
      is_active: true,
      sort_order: 2
    },
    {
      id: "3c333333-3333-3333-3333-333333333333",
      name: "Fon Perdeler",
      slug: "fon-perdeler",
      description: "Renk ve doku uyumuyla dekorasyonu tamamlayan ağır kumaş perdeler.",
      image_url: "https://images.unsplash.com/photo-1574044536226-f5ee539e15ad?q=80&w=600&auto=format&fit=crop",
      is_active: true,
      sort_order: 3
    },
    {
      id: "4d444444-4444-4444-4444-444444444444",
      name: "Dikey & Jaluzi Perdeler",
      slug: "jaluzi-perdeler",
      description: "Ofis ve evler için ışık yönlendirme ayarlı modern jaluzi sistemleri.",
      image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
      is_active: true,
      sort_order: 4
    }
  ];

  for (const cat of categories) {
    const { error } = await supabase.from("categories").upsert(cat, { onConflict: "slug" });
    if (error) console.error("Error seeding category", cat.name, error.message);
  }
  console.log("Categories seeded.");

  // 2. Products
  const products = [
    {
      id: "10000000-0000-0000-0000-000000000001",
      category_id: "1a111111-1111-1111-1111-111111111111",
      name: "Çift Mekanizmalı Zebra Perde",
      slug: "cift-mekanizmali-zebra-perde",
      short_desc: "Gündüz ve gece kullanımına uygun çift kademeli stor sistemi.",
      description: "Hem tül hem de güneşlik görevini aynı anda üstlenen, özel zincir kontrolü ile pratiklik sağlayan modern stor perde sistemi. Kolay temizlenebilir leke tutmaz kumaştan üretilmiştir.",
      price: 1850.00,
      price_unit: "TL",
      is_active: true,
      is_featured: true,
      sort_order: 1
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      category_id: "2b222222-2222-2222-2222-222222222222",
      name: "Keten Dokulu Grek Tül Perde",
      slug: "keten-dokulu-grek-tul-perde",
      short_desc: "Doğal keten görünümü sunan kırışmaz kaliteli grek tül.",
      description: "Ütü gerektirmeyen, asıldığında kendini salan dökümlü keten yapısıyla salon ve yatak odalarınıza natürel bir şıklık katar.",
      price: 950.00,
      price_unit: "TL",
      is_active: true,
      is_featured: true,
      sort_order: 2
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      category_id: "3c333333-3333-3333-3333-333333333333",
      name: "Kadife Fon Perde",
      slug: "kadife-fon-perde",
      short_desc: "Yumuşak dokulu, parlak lüks kadife fon kumaşı.",
      description: "Zengin renk alternatifleri ve kalın dokusuyla kış aylarında ısı yalıtımına katkıda bulunurken, pencerelerinize asil ve lüks bir görünüm kazandırır.",
      price: 2400.00,
      price_unit: "TL",
      is_active: true,
      is_featured: true,
      sort_order: 3
    },
    {
      id: "40000000-0000-0000-0000-000000000004",
      category_id: "4d444444-4444-4444-4444-444444444444",
      name: "Ahşap Jaluzi Perde",
      slug: "ahsap-jaluzi-perde",
      short_desc: "50mm genişliğinde gerçek ahşap jaluzi paneller.",
      description: "Fırınlanmış doğal ahşaptan üretilen, ısı ve nem dayanımı yüksek, çalışma odaları ve mutfaklar için prestijli ışık kontrol çözümü.",
      price: 3200.00,
      price_unit: "TL",
      is_active: true,
      is_featured: false,
      sort_order: 4
    }
  ];

  for (const prod of products) {
    const { error } = await supabase.from("products").upsert(prod, { onConflict: "slug" });
    if (error) console.error("Error seeding product", prod.name, error.message);
  }
  console.log("Products seeded.");

  // 3. Product Images (Assign primary Unsplash images so they look full)
  const productImages = [
    {
      product_id: "10000000-0000-0000-0000-000000000001",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
      storage_path: "general/zebra.webp",
      is_primary: true,
      sort_order: 1
    },
    {
      product_id: "20000000-0000-0000-0000-000000000002",
      url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
      storage_path: "general/tul.webp",
      is_primary: true,
      sort_order: 1
    },
    {
      product_id: "30000000-0000-0000-0000-000000000003",
      url: "https://images.unsplash.com/photo-1574044536226-f5ee539e15ad?q=80&w=600&auto=format&fit=crop",
      storage_path: "general/fon.webp",
      is_primary: true,
      sort_order: 1
    },
    {
      product_id: "40000000-0000-0000-0000-000000000004",
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
      storage_path: "general/jaluzi.webp",
      is_primary: true,
      sort_order: 1
    }
  ];

  for (const img of productImages) {
    // Check if image already exists to prevent duplicate entries
    const { data } = await supabase.from("product_images").select("id").eq("product_id", img.product_id).limit(1);
    if (!data || data.length === 0) {
      const { error } = await supabase.from("product_images").insert(img);
      if (error) console.error("Error seeding product image", img.storage_path, error.message);
    }
  }
  console.log("Product images connected.");

  // 4. Campaigns
  const campaigns = [
    {
      id: "10000000-0000-0000-0000-000000000011",
      title: "Yaz Sezonu Stor İndirimi",
      slug: "yaz-sezonu-stor-indirimi",
      description: "Tüm stor ve zebra perde siparişlerinde net %25 indirim fırsatı.",
      image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
      badge_text: "%25 İndirim",
      is_active: true,
      sort_order: 1
    },
    {
      id: "20000000-0000-0000-0000-000000000012",
      title: "Ücretsiz Montaj Kampanyası",
      slug: "ucretsiz-montaj-kampanyasi",
      description: "Adıyaman merkez sınırları içerisinde 5 adet ve üzeri siparişlerde montaj bizden!",
      image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=600&auto=format&fit=crop",
      badge_text: "Montaj Bedava",
      is_active: true,
      sort_order: 2
    },
    {
      id: "30000000-0000-0000-0000-000000000013",
      title: "3 Al 2 Öde Fon Fırsatı",
      slug: "3-al-2-ode-fon-firsati",
      description: "Seçili fon perdelerde her 3 adet siparişinizde en ucuz 1 fon perde hediye.",
      image_url: "https://images.unsplash.com/photo-1574044536226-f5ee539e15ad?q=80&w=600&auto=format&fit=crop",
      badge_text: "3 Al 2 Öde",
      is_active: true,
      sort_order: 3
    },
    {
      id: "40000000-0000-0000-0000-000000000014",
      title: "Evlilik Paketi İndirimi",
      slug: "evlilik-paketi-indirimi",
      description: "Tüm evi yenileyen veya yeni evlenen çiftlerimize özel komple paket alımlarında %30 indirim.",
      image_url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
      badge_text: "%30 Paket İndirimi",
      is_active: true,
      sort_order: 4
    }
  ];

  for (const camp of campaigns) {
    const { error } = await supabase.from("campaigns").upsert(camp, { onConflict: "slug" });
    if (error) console.error("Error seeding campaign", camp.title, error.message);
  }
  console.log("Campaigns seeded.");

  // 5. Announcements
  const announcements = [
    {
      id: "10000000-0000-0000-0000-000000000021",
      title: "Yeni Sezon Ürünlerimiz Mağazada!",
      content: "Yılın en trend renkleri ve desenlerinden oluşan yeni fon ve tül koleksiyonumuz vitrinlerde yerini aldı. Detaylı bilgi ve inceleme için mağazamızı ziyaret edebilirsiniz.",
      image_url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop",
      is_published: true,
      published_at: now
    },
    {
      id: "20000000-0000-0000-0000-000000000022",
      title: "Pazar Günleri Hizmetinizdeyiz",
      content: "Sizlere daha rahat hizmet verebilmek adına, pazar günleri de saat 12:00 ile 18:00 arasında mağazamızı açık tutuyoruz.",
      image_url: null,
      is_published: true,
      published_at: now
    },
    {
      id: "30000000-0000-0000-0000-000000000023",
      title: "Leke Tutmaz Stor Kumaş Teknolojisi",
      content: "Yeni gelen nano-teknoloji stor perde kumaşlarımız su kaydırıcı ve toz tutmaz yapısıyla stor temizliğini dert olmaktan çıkarıyor.",
      image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
      is_published: true,
      published_at: now
    },
    {
      id: "40000000-0000-0000-0000-000000000024",
      title: "Adıyaman İçi Ücretsiz Ölçü Alma",
      content: "Katalogdan beğendiğiniz modeller için evinizde en doğru ölçüyü almak üzere teknik ekibimiz ücretsiz olarak adresinize geliyor.",
      image_url: null,
      is_published: true,
      published_at: now
    }
  ];

  for (const ann of announcements) {
    const { error } = await supabase.from("announcements").upsert(ann, { onConflict: "id" });
    if (error) console.error("Error seeding announcement", ann.title, error.message);
  }
  console.log("Announcements seeded.");

  console.log("Seeding complete successfully.");
}

runSeed().catch(console.error);
