import { BRAND_IMAGE_POOLS } from '@/lib/images';

export interface ImageItem {
  id: string;
  name: string;
  src: string;
  category: string;
  product: string;
  description: string;
}

export interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'all', label: 'Tất cả', icon: '📸', color: '#A855F7' },
  { id: 'official', label: 'Official Packshots', icon: '🏛️', color: '#EAB308' },
  { id: 'hero', label: 'Hero Product', icon: '🏆', color: '#3B82F6' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌿', color: '#22C55E' },
  { id: 'food', label: 'Food Pairing', icon: '🍜', color: '#F59E0B' },
  { id: 'macro', label: 'Macro / ASMR', icon: '🔍', color: '#EF4444' },
  { id: 'seasonal', label: 'Seasonal', icon: '🎄', color: '#EC4899' },
  { id: 'ad', label: 'Advertising', icon: '📢', color: '#F97316' },
  { id: 'story', label: 'Storytelling', icon: '📖', color: '#8B5CF6' },
  { id: 'ugc', label: 'UGC / Seeding', icon: '📱', color: '#14B8A6' },
];

const MANUAL_IMAGES: ImageItem[] = [
  // ═══ HERO PRODUCT ═══
  { id: 'hero_wb_v2', name: 'Weissbier — Studio Premium', src: '/images/products/hero_weissbier_v2.png', category: 'hero', product: 'Benediktiner Weissbier', description: 'Hasselblad X2D, granite surface, warm golden rim light, dark charcoal gradient' },
  { id: 'hero_dk_v2', name: 'Dunkel — Moody Evening', src: '/images/products/hero_dunkel_v2.png', category: 'hero', product: 'Benediktiner Dunkel', description: 'Sony A7R IV, weathered oak, chiaroscuro, fireplace ember bokeh' },
  { id: 'hero_hl_v2', name: 'Hell — Fresh Morning', src: '/images/products/hero_hell_v2.png', category: 'hero', product: 'Benediktiner Hell', description: 'Fujifilm GFX 100S, white marble, natural window light, airy clean mood' },
  { id: 'hero_bp_v2', name: 'Bitburger Pils — Clean Modern', src: '/images/products/hero_bitburger_v2.png', category: 'hero', product: 'Bitburger Pils', description: 'Canon EOS R5, wet reflective surface, cool-toned rim light, navy backdrop' },
  { id: 'hero_fb', name: 'Festbier — Oktoberfest', src: '/images/products/hero_festbier.png', category: 'hero', product: 'Benediktiner Festbier', description: 'Festive golden can, Bavarian pretzel, festival garland, celebratory mood' },
  { id: 'hero_bit_keg', name: 'Bitburger 5L Fass — Party', src: '/images/products/hero_bitburger_keg.png', category: 'hero', product: 'Bitburger Pils', description: 'Party keg 5L, bar counter, 2 tulip glasses, warm ambient lighting' },

  // ═══ LIFESTYLE ═══
  { id: 'life_garden_v2', name: 'Garden Moment', src: '/images/products/lifestyle_garden_v2.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Vietnamese tropical garden, golden hour, dappled light, fairy lights' },
  { id: 'life_rooftop_v2', name: 'Rooftop Evening', src: '/images/products/lifestyle_rooftop_v2.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Saigon rooftop bar, blue hour, city skyline bokeh, urban sophistication' },
  { id: 'life_friends_v2', name: 'Khoảnh Khắc Bạn Bè', src: '/images/products/lifestyle_friends_v2.png', category: 'lifestyle', product: 'Combo', description: '4 bạn trẻ Hà Nội, rooftop bar, golden hour, clinking glasses, city bokeh' },
  { id: 'life_relax_v2', name: 'Buổi Tối Thư Giãn', src: '/images/products/lifestyle_relax_v2.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Modern apartment, leather sofa, vinyl records, warm lamp, quiet luxury' },

  // ═══ FOOD PAIRING ═══
  { id: 'food_pho_v2', name: 'Weissbier × Phở', src: '/images/products/food_pho_v2.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Steaming pho, fresh herbs, lime, dark wood, directional window light' },
  { id: 'food_bbq_v2', name: 'Dunkel × BBQ Ribs', src: '/images/products/food_bbq_v2.png', category: 'food', product: 'Benediktiner Dunkel', description: 'Smoky grilled ribs, cast iron board, firelight glow, dark moody tones' },
  { id: 'food_banhmi_v2', name: 'Pils × Bánh Mì', src: '/images/products/food_banhmi_v2.png', category: 'food', product: 'Bitburger Pils', description: 'Crispy bánh mì, pickled vegetables, marble counter, modern fusion' },
  { id: 'food_seafood', name: 'Hải Sản Flat Lay', src: '/images/products/food_seafood_flatlay.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Overhead flat lay, grilled prawns, spring rolls, herbs, 1:1 Instagram' },

  // ═══ MACRO / ASMR ═══
  { id: 'macro_pour_v2', name: 'Pour Shot — Slow Motion', src: '/images/products/macro_pour_v2.png', category: 'macro', product: 'Benediktiner Weissbier', description: 'Cascading golden-amber pour, carbonation bubbles, backlit rim, 100mm macro' },
  { id: 'macro_cond_v2', name: 'Condensation Detail', src: '/images/products/macro_condensation_v2.png', category: 'macro', product: 'Bitburger Pils', description: 'Water droplets on cold bottle, specular highlights, sensory detail, 100mm' },

  // ═══ SEASONAL / CAMPAIGN ═══
  { id: 'season_tet_v2', name: 'Tết — Năm Mới', src: '/images/products/seasonal_tet_v2.png', category: 'seasonal', product: 'Combo', description: 'Red-gold tray, kumquat, mai blossoms, lucky envelopes, fairy light bokeh' },
  { id: 'season_summer_v2', name: 'Summer Beach', src: '/images/products/seasonal_summer_v2.png', category: 'seasonal', product: 'Bitburger Pils', description: 'Ice bucket on sand, turquoise ocean, palm trees, midday sunlight' },
  { id: 'season_midautumn', name: 'Trung Thu', src: '/images/products/seasonal_midautumn.png', category: 'seasonal', product: 'Benediktiner Weissbier', description: 'Mooncakes, paper lanterns, moonlight, warm amber-gold reflections' },
  { id: 'season_christmas', name: 'Christmas — Year-End', src: '/images/products/seasonal_christmas.png', category: 'seasonal', product: 'Combo', description: 'Christmas tree, fairy lights, snowfall, dark marble, festive warmth' },

  // ═══ ADVERTISING ═══
  { id: 'ad_bene_v2', name: 'Dem Himmel So Nah', src: '/images/products/ad_hero_bene_v2.png', category: 'ad', product: 'Benediktiner Weissbier', description: 'Volumetric golden light rays, heavenly cathedral effect, tagline space' },
  { id: 'ad_combo_v2', name: 'Three Brothers', src: '/images/products/ad_combo_v2.png', category: 'ad', product: 'Combo', description: 'Weissbier + Dunkel + Hell lineup, gradient background, retail promo' },

  // ═══ STORYTELLING ═══
  { id: 'story_mon_v2', name: 'Monastery at Dawn', src: '/images/products/story_monastery_v2.png', category: 'story', product: 'Benediktiner', description: 'Medieval Ettal cellar, golden morning light, stone arches, oak barrel' },
  { id: 'story_ing_v2', name: 'Reinheitsgebot 1516', src: '/images/products/story_ingredients_v2.png', category: 'story', product: 'Brewing Heritage', description: 'Barley, hops, water, yeast, Renaissance chiaroscuro, fine art still life' },

  // ═══ UGC / SEEDING ═══
  { id: 'ugc_unbox', name: 'Unboxing Moment', src: '/images/products/ugc_unboxing.png', category: 'ugc', product: 'Benediktiner Weissbier', description: 'POV unboxing, kraft paper, straw packing, iPhone 16 Pro, authentic joy' },

  // ═══ PREMIUM & WEALTHY LIFESTYLE (AI BATCH 1 & 2) ═══
  { id: 'prem_bene_finedining', name: 'Fine Dining (Premium)', src: '/images/products/premium_ugc/benediktiner_finedining.png', category: 'ugc', product: 'Benediktiner Weissbier', description: 'High-end steak fusion, dark marble, candle reflection, restaurant' },
  { id: 'prem_bene_beach', name: 'Sunset Beach (Premium)', src: '/images/products/premium_ugc/benediktiner_beach.png', category: 'lifestyle', product: 'Benediktiner Hell', description: 'iPhone sunset beach, chilled vacation realism, relaxed vibe' },
  { id: 'prem_bene_chill', name: 'Cozy Home (Premium)', src: '/images/products/premium_ugc/benediktiner_chill.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Reading at home, warm floor lamp, wooden table, quiet luxury' },
  { id: 'prem_bene_heritage', name: 'Monastery (Cinematic)', src: '/images/products/premium_ugc/benediktiner_heritage.png', category: 'story', product: 'Benediktiner', description: 'Kloster Ettal morning mist, vintage kegs, cinematic 16:9 heritage' },
  
  { id: 'prem_bit_desk', name: 'Coder Desk (Premium)', src: '/images/products/premium_ugc/bitburger_desk.png', category: 'ugc', product: 'Bitburger Pils', description: 'Glowing monitor, mechanical keyboard, moody office, coder lifestyle' },

  { id: 'prem_bit_business', name: 'Business Class Flight', src: '/images/products/premium_ugc/bitburger_businessclass.png', category: 'ugc', product: 'Bitburger Pils', description: 'Airplane cabin, tray table, Jetsetter lifestyle flight POV' },
  { id: 'prem_bene_omakase', name: 'Omakase Counter', src: '/images/products/premium_ugc/benediktiner_omakase.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Japanese Omakase sushi, wooden block, sharp focus premium dining' },
  { id: 'prem_bene_steak', name: 'Steakhouse Executive', src: '/images/products/premium_ugc/benediktiner_steakhouse.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Closing deal at dim steakhouse, suits clinking glasses, flash glare' },
  { id: 'prem_bene_cigar', name: 'Executive Cigar Lounge', src: '/images/products/premium_ugc/benediktiner_cigar.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Premium cigar, chestnut beer, leather chair, masculine study' },

  // ═══ EXACT REFERENCE MATCH (AI BATCH 3 & 4) ═══
  { id: 'exact_bene_library', name: 'Exact Match: Library', src: '/images/products/premium_ugc/benediktiner_exact_library.png', category: 'story', product: 'Benediktiner Weissbier', description: 'Template match: Dark oak study room, fireplace glow' },
  { id: 'exact_dunkel_resort', name: 'Exact Match: Resort Deck', src: '/images/products/premium_ugc/dunkel_exact_resort.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Coastal resort deck, sunset relaxation' },
  
  { id: 'exact_bit_car', name: 'Exact Match: Luxury Car', src: '/images/products/premium_ugc/bitburger_exact_car.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Center console of a high end luxury car, leather seats' },
  { id: 'exact_bit_golf', name: 'Exact Match: Golf Course', src: '/images/products/premium_ugc/bitburger_exact_golf.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Golf cart steering wheel, lush 18-hole green' },
  { id: 'exact_weiss_tomahawk', name: 'Exact Match: Tomahawk', src: '/images/products/premium_ugc/weissbier_exact_tomahawk.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Template match: Michelin star restaurant, dry-aged Tomahawk steak' },
  { id: 'exact_dunkel_penthouse', name: 'Exact Match: Penthouse', src: '/images/products/premium_ugc/dunkel_exact_penthouse.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Black marble counter, penthouse skyline night' },

  // BATCH 5
  { id: 'exact_weiss_tennis', name: 'Exact Match: Country Club', src: '/images/products/premium_ugc/weissbier_exact_tennis.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Wooden bench, expensive tennis racket' },
  { id: 'exact_bit_ski', name: 'Exact Match: Alpine Ski', src: '/images/products/premium_ugc/bitburger_exact_ski.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Luxury ski resort balcony, sunny snow mountains' },
  { id: 'exact_dunkel_glamping', name: 'Exact Match: VIP Glamping', src: '/images/products/premium_ugc/dunkel_exact_glamping.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Luxury glamping campfire, evening fairy lights' },
  { id: 'exact_hell_villa', name: 'Exact Match: Villa Pool', src: '/images/products/premium_ugc/hell_exact_villa.png', category: 'lifestyle', product: 'Benediktiner Hell', description: 'Template match: Infinity pool edge, bright summer luxury' },
  { id: 'exact_bit_audio', name: 'Exact Match: Audiophile', src: '/images/products/premium_ugc/bitburger_exact_audiophile.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Vintage vinyl record player, oak cabinet' },
  { id: 'exact_weiss_yacht', name: 'Exact Match: Mega Yacht', src: '/images/products/premium_ugc/weissbier_exact_luxuryyacht.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Teak deck of mega yacht, ocean horizon' },
  { id: 'exact_dunkel_jazz', name: 'Exact Match: Jazz Speakeasy', src: '/images/products/premium_ugc/dunkel_exact_jazz.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Dimly lit jazz club brass table, moody red gold' },
  { id: 'exact_bit_cabana', name: 'Exact Match: Beach Cabana', src: '/images/products/premium_ugc/bitburger_exact_cabana.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Luxury beach cabana, white curtains, sunset' },
  
  // BATCH 6 (LOCALIZED PREMIUM)
  { id: 'exact_bit_mancave', name: 'Exact Match: Mancave & EPL', src: '/images/products/premium_ugc/bitburger_exact_mancave_1775145092574.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Luxury man-cave, watching football match, ambient led' },
  { id: 'exact_bene_barbershop', name: 'Exact Match: Barbershop', src: '/images/products/premium_ugc/benediktiner_exact_barbershop_1775145113014.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Classic gentlemen barbershop, leather chairs' },
  { id: 'exact_bene_halong', name: 'Exact Match: Halong Bay', src: '/images/products/premium_ugc/benediktiner_exact_halong_1775145156646.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Mega yacht in Halong bay limestone karsts, sunset' },
  { id: 'exact_bit_esports', name: 'Exact Match: Esports Room', src: '/images/products/premium_ugc/bitburger_exact_esports_1775145178733.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: High-end RGB gaming PC setup, neon reflections' },
  { id: 'exact_dunkel_lounge', name: 'Exact Match: VIP Karaoke', src: '/images/products/premium_ugc/dunkel_exact_lounge_1775145194287.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Expensive VIP Karaoke room Saigon, dark vibe' },

  // BATCH 7 & 8 (Diverse Experiences)
  { id: 'exact_bit_billiards', name: 'Exact Match: Billiards', src: '/images/products/premium_ugc/bitburger_exact_billiards_1775145360848.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Green felt pool table, 8-ball, smoke haze' },
  { id: 'exact_weiss_sushi', name: 'Exact Match: Sushi Boat', src: '/images/products/premium_ugc/weissbier_exact_sushiboat_1775145377000.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Template match: Lavish Japanese sushi boat, Omakase' },
  { id: 'exact_dunkel_sausage', name: 'Exact Match: Bratwurst', src: '/images/products/premium_ugc/dunkel_exact_sausage_1775145390549.png', category: 'food', product: 'Benediktiner Dunkel', description: 'Template match: German Bratwurst & pretzel board, firelight' },
  { id: 'exact_bene_f1', name: 'Exact Match: F1 Party', src: '/images/products/premium_ugc/benediktiner_exact_f1_1775145403575.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Formula 1 viewing party, red LED' },
  { id: 'exact_bit_marathon', name: 'Exact Match: Marathon', src: '/images/products/premium_ugc/bitburger_exact_marathon_1775145419405.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Athletic track, carbon plate running shoes' },
  { id: 'exact_bene_cigar2', name: 'Exact Match: Cigar Lounge', src: '/images/products/premium_ugc/benediktiner_exact_cigar2_1775145433896.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Thick Cuban cigar on crystal ashtray, leather couch' },
  { id: 'exact_dunkel_rainy', name: 'Exact Match: Neon Rain', src: '/images/products/premium_ugc/dunkel_exact_rainycafe_1775145448022.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Rainy window, neon city lights reflection' },
  { id: 'exact_weiss_float', name: 'Exact Match: Floating Tray', src: '/images/products/premium_ugc/weissbier_exact_floatingtray_1775145462536.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Infinity pool floating breakfast tray' },
  { id: 'exact_bene_camp', name: 'Exact Match: Acoustic Camp', src: '/images/products/premium_ugc/benediktiner_exact_campfire_1775145479680.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Campfire, acoustic guitar neck' },
  { id: 'exact_bit_watch', name: 'Exact Match: Luxury Watch', src: '/images/products/premium_ugc/bitburger_exact_watch_1775145496770.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Swiss mechanical chronometer, dark leather' },
  { id: 'exact_dunkel_carp', name: 'Exact Match: Carpenter', src: '/images/products/premium_ugc/dunkel_exact_carpenter_1775145510989.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Woodworking shop, oak bench, wood shavings' },
  { id: 'exact_weiss_news', name: 'Exact Match: Broadsheet', src: '/images/products/premium_ugc/weissbier_exact_newspaper_1775145522905.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Parisian bistro, Financial Times newspaper' },

  // BATCH 9 & 10 (Final 12)
  { id: 'exact_bene_chalet', name: 'Exact Match: Ski Chalet', src: '/images/products/premium_ugc/benediktiner_exact_chalet_1775145550978.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Luxury ski chalet, fireplace, snow window' },
  { id: 'exact_dunkel_lib', name: 'Exact Match: Historic Library', src: '/images/products/premium_ugc/dunkel_exact_historiclibrary_1775145564935.png', category: 'story', product: 'Benediktiner Dunkel', description: 'Template match: Stack of antique leather-bound books' },
  { id: 'exact_bit_studio', name: 'Exact Match: Audio Studio', src: '/images/products/premium_ugc/bitburger_exact_recordingstudio_1775145577722.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Acoustic recording studio, drum set' },
  { id: 'exact_weiss_surf', name: 'Exact Match: Surf Beach', src: '/images/products/premium_ugc/weissbier_exact_surf_1775145591267.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Custom surfboard, white sand beach' },
  { id: 'exact_dunkel_garage', name: 'Exact Match: Porsche Garage', src: '/images/products/premium_ugc/dunkel_exact_porschegarage_1775145606141.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Vintage Porsche 911, automotive garage' },
  { id: 'exact_bit_astro', name: 'Exact Match: Astrophotography', src: '/images/products/premium_ugc/bitburger_exact_astrophotography_1775145620919.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Milky Way galaxy glamping' },
  { id: 'exact_weiss_art', name: 'Exact Match: Art Loft', src: '/images/products/premium_ugc/weissbier_exact_artstudio_1775145637148.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Parisian art loft, fine art painting easel' },
  { id: 'exact_bit_cyber', name: 'Exact Match: Cyberpunk', src: '/images/products/premium_ugc/bitburger_exact_cyberpunkrain_1775145685381.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Rainy concrete ledge, neon city reflections' },
  { id: 'exact_bene_sour', name: 'Exact Match: Sourdough Bread', src: '/images/products/premium_ugc/benediktiner_exact_sourdough_1775145704119.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Template match: Fresh artisan sourdough bread loaf' },
  { id: 'exact_dunkel_chess', name: 'Exact Match: Chess Board', src: '/images/products/premium_ugc/dunkel_exact_chess_1775145718807.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Wooden chess board mid-game, fallen King' },
  { id: 'exact_weiss_fly', name: 'Exact Match: Fly-fishing', src: '/images/products/premium_ugc/weissbier_exact_flyfishing_1775145734929.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Alpine stream, fly-fishing rod' },
  { id: 'exact_bit_mid', name: 'Exact Match: Midnight Run', src: '/images/products/premium_ugc/bitburger_exact_midnightrun_1775145751713.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Midnight food truck, luxury SUV grill' },
  
  // BATCH 11 (Final Culinary / Architecture)
  { id: 'exact_bit_chef', name: 'Exact Match: Chef Knife', src: '/images/products/premium_ugc/bitburger_exact_chef_1775145887488.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Damascus steel chef knife, marble kitchen' },
  { id: 'exact_weiss_pine', name: 'Exact Match: Pine Forest', src: '/images/products/premium_ugc/weissbier_exact_pineforest_1775145901113.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Mountain pine forest balcony, sunrise' },
  { id: 'exact_dunkel_oxford', name: 'Exact Match: Oxford Shoes', src: '/images/products/premium_ugc/dunkel_exact_oxfordshoes_1775145914728.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Polished leather Oxford shoes, brush' },
  { id: 'exact_bene_write', name: 'Exact Match: Fountain Pen', src: '/images/products/premium_ugc/benediktiner_exact_journal_1775145933871.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Leather-bound journal, gold-nib fountain pen' },
  { id: 'exact_bit_ten2', name: 'Exact Match: Tennis Club', src: '/images/products/premium_ugc/bitburger_exact_tennis2_1775145948892.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Country club tennis bench, balls, towel' },
  { id: 'exact_weiss_botan', name: 'Exact Match: Conservatory', src: '/images/products/premium_ugc/weissbier_exact_botanical_1775145964880.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Victorian glass botanical conservatory' },
  { id: 'exact_dunkel_bush', name: 'Exact Match: Bushcraft', src: '/images/products/premium_ugc/dunkel_exact_bushcraft_1775145976323.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Cast-iron skillet over campfire' },
  { id: 'exact_bene_suv', name: 'Exact Match: SUV Overlanding', src: '/images/products/premium_ugc/benediktiner_exact_suv_1775145991816.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Luxury off-road SUV tailgate' },
  { id: 'exact_weiss_pizza', name: 'Exact Match: Pizza Oven', src: '/images/products/premium_ugc/weissbier_exact_pizzaoven_1775146028917.png', category: 'food', product: 'Benediktiner Weissbier', description: 'Template match: Outdoor wood-fired pizza oven' },
  { id: 'exact_dunkel_bath', name: 'Exact Match: Clawfoot Bathtub', src: '/images/products/premium_ugc/dunkel_exact_bathtub_1775146087555.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Vintage porcelain clawfoot bathtub' },
  { id: 'exact_bit_dj', name: 'Exact Match: DJ Booth', src: '/images/products/premium_ugc/bitburger_exact_djclub_1775146105283.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: High-end luxury nightclub DJ booth' },

  // BATCH 12 & 13 (Ultra-Niche Prestige)
  { id: 'exact_weiss_koi', name: 'Exact Match: Koi Pond', src: '/images/products/premium_ugc/weissbier_exact_koipond_1775178713095.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Zen limestone rock by high-end Koi pond' },
  { id: 'exact_bit_pc', name: 'Exact Match: PC Builder', src: '/images/products/premium_ugc/bitburger_exact_pcbuild_1775178754628.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: RTX graphics card, tech enthusiast neon' },
  { id: 'exact_dunkel_type', name: 'Exact Match: Typewriter', src: '/images/products/premium_ugc/dunkel_exact_typewriter_1775178774531.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Vintage mechanical typewriter on scarred oak desk' },
  { id: 'exact_bene_maybach', name: 'Exact Match: Chauffeured Car', src: '/images/products/premium_ugc/benediktiner_exact_maybach_1775178801110.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: White leather Maybach back seat, neon city' },
  { id: 'exact_bit_sneakers', name: 'Exact Match: Sneakerhead', src: '/images/products/premium_ugc/bitburger_exact_sneakers_1775178823294.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Ultra-rare hypebeast sneaker display case' },
  { id: 'exact_weiss_gallery', name: 'Exact Match: Art Gallery', src: '/images/products/premium_ugc/weissbier_exact_artgallery_1775178843655.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Modern abstract art gallery exhibition' },
  { id: 'exact_dunkel_noodle', name: 'Exact Match: Cyberpunk Noodle', src: '/images/products/premium_ugc/dunkel_exact_noodleshop_1775178869555.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Tokyo blade runner midnight noodle shop' },
  { id: 'exact_bit_mtb', name: 'Exact Match: Mountain Bike', src: '/images/products/premium_ugc/bitburger_exact_mtbike_1775178891904.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Downhill MTB muddy tire in pine forest' },
  { id: 'exact_bit_yeti', name: 'Exact Match: Yeti Camp', src: '/images/products/premium_ugc/bitburger_exact_yeti_1775178932655.png', category: 'lifestyle', product: 'Bitburger Pils', description: 'Template match: Premium Yeti cooler in a sunlit campsite' },
  { id: 'exact_weiss_golfhouse', name: 'Exact Match: Golf House', src: '/images/products/premium_ugc/weissbier_exact_golfclubhouse_1775178957218.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Elite country club overlooking 18th hole sunset' },
  { id: 'exact_dunkel_piano', name: 'Exact Match: Grand Piano', src: '/images/products/premium_ugc/dunkel_exact_piano_1775178976240.png', category: 'lifestyle', product: 'Benediktiner Dunkel', description: 'Template match: Glossy black Steinway piano lid, classical' },
  { id: 'exact_bene_gondola', name: 'Exact Match: Alpine Gondola', src: '/images/products/premium_ugc/benediktiner_exact_gondola_1775178997496.png', category: 'lifestyle', product: 'Benediktiner Weissbier', description: 'Template match: Inside luxury ski lift looking at snowy peaks' }
];

const OFFICIAL_IMAGES: ImageItem[] = [];
Object.entries(BRAND_IMAGE_POOLS).forEach(([brand, urls]) => {
  urls.forEach((url, i) => {
    let filename = url.split('/').pop() || '';
    if (filename.length > 25) filename = filename.substring(0, 25) + '...';
    OFFICIAL_IMAGES.push({
      id: `off_${brand}_${i}`,
      name: filename,
      src: url,
      category: 'official',
      product: brand === 'benediktiner' ? 'Benediktiner' : 'Bitburger',
      description: 'Official brand packshot / product standard image',
    });
  });
});

export const IMAGES: ImageItem[] = [...OFFICIAL_IMAGES, ...MANUAL_IMAGES];
