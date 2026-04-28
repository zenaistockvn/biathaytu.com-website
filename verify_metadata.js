const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory()
        ? walkSync(dirFile, filelist)
        : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EPERM') return;
      throw err;
    }
  });
  return filelist;
};

const imagesDir = path.join(__dirname, 'public', 'images');
const files = walkSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

const publicRootFiles = fs.readdirSync(path.join(__dirname, 'public'))
  .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
  .map(f => path.join(__dirname, 'public', f));

const allFiles = [...files, ...publicRootFiles];

async function checkMetadata() {
  console.log(`Kiểm tra lại ${allFiles.length} ảnh...`);
  let hasMetadataCount = 0;
  for (const file of allFiles) {
    try {
      const metadata = await sharp(file).metadata();
      const relativePath = path.relative(__dirname, file);
      
      const hasExif = !!metadata.exif;
      const hasIcc = !!metadata.icc;
      const hasXmp = !!metadata.xmp;
      
      if (hasExif || hasIcc || hasXmp) {
        hasMetadataCount++;
        console.log(`\n[CÒN METADATA] File: ${relativePath}`);
        console.log(`Format: ${metadata.format}, Size: ${metadata.width}x${metadata.height}, Has EXIF: ${hasExif}, Has ICC: ${hasIcc}, Has XMP: ${hasXmp}`);
      }
    } catch (err) {
      console.error(`Error reading ${path.relative(__dirname, file)}: ${err.message}`);
    }
  }
  console.log(`\nTổng số file còn chứa Metadata (EXIF/ICC/XMP): ${hasMetadataCount} / ${allFiles.length}`);
}

checkMetadata();
