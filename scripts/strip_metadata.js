/**
 * Strip ALL metadata from PNG files (tEXt, iTXt, zTXt, eXIf, iCCP, caBX chunks)
 * Chỉ giữ lại: IHDR, IDAT, IEND, PLTE, tRNS (cần thiết để render)
 * 
 * Cách dùng: node scripts/strip_metadata.js
 * Output: Ghi đè file gốc (backup nếu cần)
 */
const fs = require('fs');
const path = require('path');

// Các chunk CẦN GIỮ LẠI (essential for rendering)
const KEEP_CHUNKS = new Set([
  'IHDR', // Image header
  'PLTE', // Palette
  'IDAT', // Image data
  'IEND', // Image end
  'tRNS', // Transparency
  'gAMA', // Gamma
  'cHRM', // Chromaticity
  'sRGB', // sRGB rendering intent
  'sBIT', // Significant bits
  'bKGD', // Background color
  'pHYs', // Physical pixel dimensions
]);

// Các chunk CẦN XÓA (metadata, text, profiles that may contain AI traces)
// Everything NOT in KEEP_CHUNKS will be removed

function stripPNG(filePath) {
  const buf = fs.readFileSync(filePath);
  
  // Verify PNG signature
  const PNG_SIG = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  if (Buffer.compare(buf.slice(0, 8), PNG_SIG) !== 0) {
    return { skipped: true, reason: 'Not a PNG file' };
  }
  
  const chunks = [];
  let offset = 8; // Skip PNG signature
  let removedChunks = [];
  
  while (offset < buf.length) {
    if (offset + 8 > buf.length) break;
    
    const chunkLength = buf.readUInt32BE(offset);
    const chunkType = buf.slice(offset + 4, offset + 8).toString('ascii');
    const totalChunkSize = 12 + chunkLength; // 4 length + 4 type + data + 4 CRC
    
    if (offset + totalChunkSize > buf.length) break;
    
    if (KEEP_CHUNKS.has(chunkType)) {
      chunks.push(buf.slice(offset, offset + totalChunkSize));
    } else {
      removedChunks.push({ type: chunkType, size: chunkLength });
    }
    
    offset += totalChunkSize;
    
    if (chunkType === 'IEND') break;
  }
  
  if (removedChunks.length === 0) {
    return { skipped: true, reason: 'Already clean' };
  }
  
  // Rebuild PNG
  const newBuf = Buffer.concat([PNG_SIG, ...chunks]);
  
  const originalSize = buf.length;
  const newSize = newBuf.length;
  const saved = originalSize - newSize;
  
  fs.writeFileSync(filePath, newBuf);
  
  return {
    skipped: false,
    removedChunks,
    originalSize,
    newSize,
    saved,
  };
}

// Directories to process
const DIRS = [
  path.join(__dirname, '..', 'public', 'images', 'ai_generated'),
  path.join(__dirname, '..', 'public', 'images', 'library'),
  path.join(__dirname, '..', 'public', 'images', 'facebook'),
  path.join(__dirname, '..', 'public', 'images', 'marketing'),
];

let totalProcessed = 0;
let totalStripped = 0;
let totalSkipped = 0;
let totalBytesSaved = 0;

console.log('=== STRIP METADATA TỪ ẢNH PNG ===\n');

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  
  const walkDir = (d) => {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.toLowerCase().endsWith('.png')) {
        totalProcessed++;
        const result = stripPNG(fullPath);
        const relPath = path.relative(path.join(__dirname, '..', 'public'), fullPath);
        
        if (result.skipped) {
          totalSkipped++;
        } else {
          totalStripped++;
          totalBytesSaved += result.saved;
          const removedTypes = result.removedChunks.map(c => c.type).join(', ');
          console.log(`✂️  ${relPath}`);
          console.log(`   Removed: [${removedTypes}] | Saved: ${(result.saved / 1024).toFixed(1)}KB`);
        }
      }
    }
  };
  
  walkDir(dir);
}

console.log(`\n${'='.repeat(50)}`);
console.log(`📊 KẾT QUẢ:`);
console.log(`   Tổng file PNG: ${totalProcessed}`);
console.log(`   Đã strip metadata: ${totalStripped}`);
console.log(`   Đã sạch sẵn: ${totalSkipped}`);
console.log(`   Tổng dung lượng tiết kiệm: ${(totalBytesSaved / 1024).toFixed(1)}KB`);
console.log(`\n✅ Tất cả ảnh giờ đây AN TOÀN để đăng lên FB / TikTok.`);
