const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT_DIR, 'scripts', 'unused-images-report.json');

function cleanUnusedImages() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error('Unused images report not found. Please run find-unused-images.js first.');
    return;
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  const unusedImages = report.unused;

  if (!unusedImages || unusedImages.length === 0) {
    console.log('No unused images to clean up.');
    return;
  }

  console.log(`Starting cleanup of ${unusedImages.length} unused images...`);
  let deletedCount = 0;
  let deletedSize = 0;
  let failedCount = 0;

  unusedImages.forEach(img => {
    const fullPath = path.join(ROOT_DIR, img.path);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        deletedCount++;
        deletedSize += img.size;
        console.log(`Deleted: ${img.path}`);
      } catch (err) {
        console.error(`Failed to delete ${img.path}:`, err.message);
        failedCount++;
      }
    } else {
      console.log(`Skipped (already gone): ${img.path}`);
    }
  });

  console.log('\n--- CLEANUP COMPLETE ---');
  console.log(`Successfully deleted: ${deletedCount} images`);
  console.log(`Size saved: ${(deletedSize / (1024 * 1024)).toFixed(2)} MB (${deletedSize} bytes)`);
  if (failedCount > 0) {
    console.log(`Failed to delete: ${failedCount} images`);
  }
}

cleanUnusedImages();
