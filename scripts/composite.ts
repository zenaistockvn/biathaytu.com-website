import sharp from 'sharp';
import path from 'path';

const OUT_DIR = 'C:\\Users\\QuangTran\\.gemini\\antigravity\\brain\\0397dc9d-e913-42e9-a0b3-7052c9ab5480\\';
const ASSETS_DIR = 'C:\\Users\\QuangTran\\Downloads\\biathaytu\\public\\images\\products\\';

async function compositeImage(bgPath: string, overlayPath: string, outputPath: string, scale = 0.5, yOffsetRatio = 0.5, xOffsetRatio = 0.5) {
  try {
    const bgMetadata = await sharp(bgPath).metadata();
    const overlayMetadata = await sharp(overlayPath).metadata();

    const targetHeight = Math.round(bgMetadata.height! * scale);
    const targetWidth = Math.round(targetHeight * (overlayMetadata.width! / overlayMetadata.height!));

    const resizedOverlayBuffer = await sharp(overlayPath)
      .resize(targetWidth, targetHeight)
      .toBuffer();

    const left = Math.round((bgMetadata.width! - targetWidth) * xOffsetRatio);
    const top = Math.round((bgMetadata.height! - targetHeight) * yOffsetRatio);

    await sharp(bgPath)
      .composite([{ input: resizedOverlayBuffer, top, left }])
      .toFile(outputPath);

    console.log(`Success: ${outputPath}`);
  } catch (err) {
    console.error(`Error processing ${bgPath}:`, err);
  }
}

async function run() {
  const images = [
    { bg: 'bg_fridge_duo_16x9_1775737786579.png', overlay: 'benediktiner-dunkel-1_13c8182e69d04b45942a07a157ccbb09.png', out: 'final_fridge_1.png', scale: 0.6, y: 0.8, x: 0.5 },
    { bg: 'bg_kitchen_counter_16x9_1775737798822.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_kitchen.png', scale: 0.7, y: 0.9, x: 0.5 },
    { bg: 'bg_rainy_football_16x9_1775737814253.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_football.png', scale: 0.6, y: 0.9, x: 0.5 },
    { bg: 'bg_balcony_sunset_9x16_1775737828635.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_balcony.png', scale: 0.45, y: 0.85, x: 0.5 },
    { bg: 'bg_playing_cards_3x4_1775737843677.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_cards.png', scale: 0.5, y: 0.8, x: 0.5 },
    { bg: 'bg_sunset_cafe_16x9_1775737857517.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_cafe.png', scale: 0.6, y: 0.85, x: 0.5 },
    { bg: 'bg_rainy_dining_3x4_1775737870391.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_dining.png', scale: 0.55, y: 0.8, x: 0.5 },
    { bg: 'bg_garden_patio_16x9_1775737885820.png', overlay: 'official\\benediktiner\\86480_bottle_nobg.png', out: 'final_garden.png', scale: 0.6, y: 0.9, x: 0.5 },
    { bg: 'bg_premium_bar_16x9_1775737900733.png', overlay: 'bitburger_330ml_ce3904b05a2943d280fdf9465d957b4b.png', out: 'final_bar.png', scale: 0.65, y: 0.85, x: 0.5 },
    { bg: 'bg_car_keys_3x4_1775737915808.png', overlay: 'bitburger_330ml_ce3904b05a2943d280fdf9465d957b4b.png', out: 'final_carkeys.png', scale: 0.5, y: 0.8, x: 0.5 }
  ];

  for (const item of images) {
    await compositeImage(
      path.join(OUT_DIR, item.bg),
      path.join(ASSETS_DIR, item.overlay),
      path.join(OUT_DIR, item.out),
      item.scale,
      item.y,
      item.x
    );
  }
  console.log("Done generating all composites!");
}

run();
