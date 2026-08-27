import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const IMAGES_ROOT = join(process.cwd(), 'public/images');
const MAX_IMAGE_BYTES = 1024 * 1024;

// Nợ kỹ thuật hiện tại cần được rút dần, không phải danh sách miễn trừ vĩnh viễn.
// Khi một file được tối ưu xuống dưới 1 MB, hãy xóa chính đường dẫn đó khỏi mảng.
const KNOWN_OVERSIZED = [
  "ai_generated/batch10_img1_0d0c.png",
  "ai_generated/batch2_img3_48c7.png",
  "ai_generated/batch2_img6_001d.png",
  "ai_generated/batch2_img7_7139.png",
  "ai_generated/batch2_img8_1b5f.png",
  "ai_generated/batch3_img6_1dab.png",
  "ai_generated/batch4_img1_1a33.png",
  "ai_generated/batch4_img2_1f30.png",
  "ai_generated/batch4_img9_3863.png",
  "ai_generated/batch5_img3_c0aa.png",
  "ai_generated/batch5_img5_efe0.png",
  "ai_generated/batch5_img6_3f4a.png",
  "ai_generated/batch6_img1_aeed.png",
  "ai_generated/batch6_img4_0761.png",
  "ai_generated/batch6_img6_fe05.png",
  "ai_generated/batch6_img8_79ac.png",
  "ai_generated/batch7_img4_53ed.png",
  "ai_generated/batch8_img10_5cf7.png",
  "ai_generated/batch9_img6_4750.png",
  "ai_generated/batch9_img9_5d13.png",
  "ai_generated/bitburger_dose_hanoi_bb6d.png",
  "ai_generated/bitburger_uv_deb9.png",
  "avatars/do_quang_huy.png",
  "avatars/le_hoang_long.png",
  "avatars/nguyen_minh_tam.png",
  "avatars/pham_thanh_ha.png",
  "avatars/tran_thu_phuong.png",
  "avatars/tran_van_nam.png",
  "facebook/cover_bia_am_thuc_v2_1775560881516.png",
  "facebook/cover_sanh_bia_duc_v2_1775560866216.png",
  "facebook/cover_tiep_khach_v2_1775560932251.png",
  "products/ad_combo.png",
  "products/ad_combo_v2.png",
  "products/ad_hero_bene_v2.png",
  "products/amc_assets/benediktiner_composite_rustic_1775734047862.png",
  "products/amc_assets/bitburg_heritage_story_1775753219026.png",
  "products/amc_assets/bitburg_to_saigon_1775741871482.png",
  "products/amc_assets/bitburger_bbq_food_1775741893404.png",
  "products/amc_assets/bitburger_driving_lifestyle_1775733642452.png",
  "products/amc_assets/bitburger_fusion_food_1775753401190.png",
  "products/amc_assets/bitburger_macro_foam_1775733746609.png",
  "products/amc_assets/bitburger_pour_tutorial_1775753451837.png",
  "products/amc_assets/bitburger_zero_gym_9x16_1775735017778.png",
  "products/amc_assets/dunkel_pork_ribs_16x9_1775734978767.png",
  "products/amc_assets/viet_balcony_sunset_9x16_1775734919638.png",
  "products/amc_assets/weissbier_seafood_16x9_1775734547769.png",
  "products/food_banhmi_v2.png",
  "products/food_bbq.png",
  "products/food_bbq_v2.png",
  "products/food_pho.png",
  "products/food_pho_v2.png",
  "products/food_seafood_flatlay.png",
  "products/hero_bitburger_keg.png",
  "products/hero_bitburger_v2.png",
  "products/hero_dunkel_v2.png",
  "products/hero_weissbier_v2.png",
  "products/lifestyle_friends_v2.png",
  "products/lifestyle_garden_v2.png",
  "products/lifestyle_relax_v2.png",
  "products/lifestyle_rooftop_v2.png",
  "products/macro_condensation_v2.png",
  "products/macro_pour_v2.png",
  "products/official/benediktiner/124_43ed2d310d7b45a6a7c3cd065e139b25.png",
  "products/official/benediktiner/86480_bottle_nobg.png",
  "products/official/benediktiner/glass_nobg.png",
  "products/premium_ugc/benediktiner_beach.png",
  "products/premium_ugc/benediktiner_chill.png",
  "products/premium_ugc/benediktiner_cigar.png",
  "products/premium_ugc/benediktiner_exact_barbershop_1775145113014.png",
  "products/premium_ugc/benediktiner_exact_campfire_1775145479680.png",
  "products/premium_ugc/benediktiner_exact_chalet_1775145550978.png",
  "products/premium_ugc/benediktiner_exact_cigar2_1775145433896.png",
  "products/premium_ugc/benediktiner_exact_f1_1775145403575.png",
  "products/premium_ugc/benediktiner_exact_gondola_1775178997496.png",
  "products/premium_ugc/benediktiner_exact_halong_1775145156646.png",
  "products/premium_ugc/benediktiner_exact_journal_1775145933871.png",
  "products/premium_ugc/benediktiner_exact_library.png",
  "products/premium_ugc/benediktiner_exact_library_1775139048377.png",
  "products/premium_ugc/benediktiner_exact_maybach_1775178801110.png",
  "products/premium_ugc/benediktiner_exact_sourdough_1775145704119.png",
  "products/premium_ugc/benediktiner_exact_suv_1775145991816.png",
  "products/premium_ugc/benediktiner_finedining.png",
  "products/premium_ugc/benediktiner_heritage.png",
  "products/premium_ugc/benediktiner_omakase.png",
  "products/premium_ugc/benediktiner_steakhouse.png",
  "products/premium_ugc/bitburger_businessclass.png",
  "products/premium_ugc/bitburger_exact_astrophotography_1775145620919.png",
  "products/premium_ugc/bitburger_exact_audiophile.png",
  "products/premium_ugc/bitburger_exact_billiards_1775145360848.png",
  "products/premium_ugc/bitburger_exact_cabana.png",
  "products/premium_ugc/bitburger_exact_chef_1775145887488.png",
  "products/premium_ugc/bitburger_exact_cyberpunkrain_1775145685381.png",
  "products/premium_ugc/bitburger_exact_djclub_1775146105283.png",
  "products/premium_ugc/bitburger_exact_esports_1775145178733.png",
  "products/premium_ugc/bitburger_exact_golf.png",
  "products/premium_ugc/bitburger_exact_mancave_1775145092574.png",
  "products/premium_ugc/bitburger_exact_marathon_1775145419405.png",
  "products/premium_ugc/bitburger_exact_midnightrun_1775145751713.png",
  "products/premium_ugc/bitburger_exact_mtbike_1775178891904.png",
  "products/premium_ugc/bitburger_exact_pcbuild_1775178754628.png",
  "products/premium_ugc/bitburger_exact_recordingstudio_1775145577722.png",
  "products/premium_ugc/bitburger_exact_sneakers_1775178823294.png",
  "products/premium_ugc/bitburger_exact_tennis2_1775145948892.png",
  "products/premium_ugc/bitburger_exact_watch_1775145496770.png",
  "products/premium_ugc/bitburger_exact_yeti_1775178932655.png",
  "products/premium_ugc/bitburger_helicopter_pad_1775282328377.png",
  "products/premium_ugc/bitburger_marina_sunset_1775282113669.png",
  "products/premium_ugc/bitburger_workshop_tools_1775282153915.png",
  "products/premium_ugc/dunkel_exact_bathtub_1775146087555.png",
  "products/premium_ugc/dunkel_exact_bushcraft_1775145976323.png",
  "products/premium_ugc/dunkel_exact_carpenter_1775145510989.png",
  "products/premium_ugc/dunkel_exact_chess_1775145718807.png",
  "products/premium_ugc/dunkel_exact_historiclibrary_1775145564935.png",
  "products/premium_ugc/dunkel_exact_jazz.png",
  "products/premium_ugc/dunkel_exact_lounge_1775145194287.png",
  "products/premium_ugc/dunkel_exact_noodleshop_1775178869555.png",
  "products/premium_ugc/dunkel_exact_oxfordshoes_1775145914728.png",
  "products/premium_ugc/dunkel_exact_penthouse.png",
  "products/premium_ugc/dunkel_exact_piano_1775178976240.png",
  "products/premium_ugc/dunkel_exact_porschegarage_1775145606141.png",
  "products/premium_ugc/dunkel_exact_rainycafe_1775145448022.png",
  "products/premium_ugc/dunkel_exact_sausage_1775145390549.png",
  "products/premium_ugc/dunkel_exact_typewriter_1775178774531.png",
  "products/premium_ugc/dunkel_fireside_leather_1775281950376.png",
  "products/premium_ugc/dunkel_steakhouse_date_1775281979432.png",
  "products/premium_ugc/dunkel_whisky_lounge_1775282042082.png",
  "products/premium_ugc/hell_exact_villa.png",
  "products/premium_ugc/mix_giftset_tet_1775282397674.png",
  "products/premium_ugc/weissbier_exact_artgallery_1775178843655.png",
  "products/premium_ugc/weissbier_exact_artstudio_1775145637148.png",
  "products/premium_ugc/weissbier_exact_botanical_1775145964880.png",
  "products/premium_ugc/weissbier_exact_floatingtray_1775145462536.png",
  "products/premium_ugc/weissbier_exact_flyfishing_1775145734929.png",
  "products/premium_ugc/weissbier_exact_golfclubhouse_1775178957218.png",
  "products/premium_ugc/weissbier_exact_koipond_1775178713095.png",
  "products/premium_ugc/weissbier_exact_luxuryyacht.png",
  "products/premium_ugc/weissbier_exact_newspaper_1775145522905.png",
  "products/premium_ugc/weissbier_exact_pineforest_1775145901113.png",
  "products/premium_ugc/weissbier_exact_pizzaoven_1775146028917.png",
  "products/premium_ugc/weissbier_exact_surf_1775145591267.png",
  "products/premium_ugc/weissbier_exact_sushiboat_1775145377000.png",
  "products/premium_ugc/weissbier_exact_tennis.png",
  "products/premium_ugc/weissbier_sushi_omakase_1775281933742.png",
  "products/seasonal_tet_v2.png",
  "products/story_ingredients_v2.png",
  "products/story_monastery.png",
  "products/story_monastery_v2.png",
  "products/the-wurst/cold_cut_150g/the-wurst-cold-cut-01.png",
  "products/the-wurst/cold_cut_150g/the-wurst-cold-cut-02.png",
  "products/the-wurst/cold_cut_150g/the-wurst-cold-cut-03.png",
  "products/the-wurst/cold_cut_150g/the-wurst-cold-cut-04.png",
  "products/the-wurst/cold_cut_150g/the-wurst-cold-cut-05.png",
  "products/the-wurst/combo-cold-cut.png",
  "products/the-wurst/thuringer-bratwurst.png",
  "products/the-wurst/wiener-hun-khoi.png",
  "products/ugc_unboxing.png",
  "sanh_bia_duc_cover.png",
] as const;

function listPngFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return listPngFiles(absolutePath);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.png') ? [absolutePath] : [];
  });
}

function toRepoImagePath(absolutePath: string): string {
  return relative(IMAGES_ROOT, absolutePath).split(sep).join('/');
}

describe('public image size budget', () => {
  const oversizedPngs = listPngFiles(IMAGES_ROOT)
    .filter((absolutePath) => statSync(absolutePath).size > MAX_IMAGE_BYTES)
    .map(toRepoImagePath)
    .sort();

  it('blocks new PNG files larger than 1 MB', () => {
    const known = new Set<string>(KNOWN_OVERSIZED);
    const unexpected = oversizedPngs.filter((path) => !known.has(path));

    expect(KNOWN_OVERSIZED).toHaveLength(157);
    expect(unexpected).toEqual([]);
  });

  it('keeps the technical-debt allowlist in sync as images are optimized', () => {
    const oversized = new Set(oversizedPngs);
    const staleEntries = KNOWN_OVERSIZED.filter((path) => !oversized.has(path));

    expect(staleEntries).toEqual([]);
  });
});

