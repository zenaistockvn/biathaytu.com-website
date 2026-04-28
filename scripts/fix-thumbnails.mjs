import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  { slug: "luat-tinh-khiet-1516-reinheitsgebot", thumbnail_url: "/images/products/story_ingredients_v2.png" },
  { slug: "bia-lua-mi-duc-weissbier-la-gi", thumbnail_url: "/images/products/macro_pour_v2.png" },
  { slug: "nghe-thuat-food-pairing-cung-bia-duc", thumbnail_url: "/images/products/food_seafood_flatlay.png" },
  { slug: "giai-thuong-itqi-3-sao-benediktiner-weissbier", thumbnail_url: "/images/products/story_monastery_v2.png" },
  { slug: "su-khac-biet-giua-bia-den-dunkel-va-bia-vang-naturtrub", thumbnail_url: "/images/products/lifestyle_friends_v2.png" },
  { slug: "kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam", thumbnail_url: "/images/products/story_monastery.png" },
  { slug: "bia-khong-con-bitburger-0-0-lua-chon-dang-cap", thumbnail_url: "/images/products/lifestyle_rooftop_v2.png" },
  { slug: "bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia", thumbnail_url: "/images/products/macro_condensation_v2.png" },
  { slug: "tang-qua-doi-tac-bia-duc-nhap-khau-cao-cap", thumbnail_url: "/images/products/lifestyle_garden_v2.png" },
  { slug: "nhiet-do-thuong-thuc-bia-duc-ly-tuong-nhat", thumbnail_url: "/images/products/lifestyle_relax_v2.png" }
];

async function updateThumbnails() {
  console.log("Updating thumbnails...");
  for (const update of updates) {
    const { error } = await supabase
      .from('seo_articles')
      .update({ thumbnail_url: update.thumbnail_url })
      .eq('slug', update.slug);
      
    if (error) {
      console.error(`Failed to update ${update.slug}: `, error);
    } else {
      console.log(`Updated: ${update.slug}`);
    }
  }
  console.log("Finished updating thumbnails.");
}

updateThumbnails();
