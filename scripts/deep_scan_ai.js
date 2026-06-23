/**
 * Deep scan: Kiểm tra C2PA manifest + hidden AI watermarks
 * C2PA (Coalition for Content Provenance and Authenticity) embeds
 * provenance data in a JUMBF box (JPEG) or dedicated chunk (PNG)
 */
const fs = require('fs');
const path = require('path');

const AI_DIR = path.join(__dirname, '..', 'public', 'images', 'ai_generated');
const LIBRARY_DIR = path.join(__dirname, '..', 'public', 'images', 'library');
const FACEBOOK_DIR = path.join(__dirname, '..', 'public', 'images', 'facebook');
const MARKETING_DIR = path.join(__dirname, '..', 'public', 'images', 'marketing');

// C2PA / Content Credentials markers (binary signatures)
const C2PA_MARKERS = [
  Buffer.from('c2pa'),          // C2PA identifier
  Buffer.from('jumb'),          // JUMBF box
  Buffer.from('jumd'),          // JUMBF description
  Buffer.from('c2ma'),          // C2PA manifest
  Buffer.from('contentauth'),   // Adobe Content Authenticity
  Buffer.from('cai'),           // Content Authenticity Initiative  
  Buffer.from('steg'),          // steganography marker
];

// Additional text markers to check in raw binary
const TEXT_MARKERS = [
  'stable diffusion', 'midjourney', 'dall-e', 'openai', 'comfyui',
  'a]111', 'invoke', 'novelai', 'dreamstudio', 'stability',
  'adobe firefly', 'bing image', 'copilot designer',
  'made with ai', 'ai_generated', 'ai generated',
  'digital source type', 'trainedalgorithmicmedia',
  'c2pa.actions', 'c2pa.hash', 'c2pa.claim',
  'contentcredentials', 'content credentials',
  'nano banana', 'gemini', 'imagen', 'flux', 'ideogram', 'leonardo',
  'parameters\n', 'negative prompt', 'cfg scale',
];

function deepScanFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const findings = [];
  
  // 1. Check for C2PA binary markers
  for (const marker of C2PA_MARKERS) {
    const idx = buf.indexOf(marker);
    if (idx !== -1) {
      findings.push({
        type: 'C2PA_BINARY',
        marker: marker.toString(),
        offset: idx,
        context: buf.slice(Math.max(0, idx - 10), Math.min(buf.length, idx + 50)).toString('utf-8').replace(/[\x00-\x1f\x7f-\xff]/g, '.')
      });
    }
  }
  
  // 2. Check for text markers in raw binary
  const bufStr = buf.toString('utf-8').toLowerCase();
  for (const marker of TEXT_MARKERS) {
    const idx = bufStr.indexOf(marker);
    if (idx !== -1) {
      findings.push({
        type: 'TEXT_MARKER',
        marker: marker,
        offset: idx,
        context: bufStr.substring(Math.max(0, idx - 20), Math.min(bufStr.length, idx + 80)).replace(/[\x00-\x1f]/g, '.')
      });
    }
  }
  
  // 3. PNG specific: Check for caBX chunk (C2PA in PNG) or custom chunks
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    let offset = 8;
    while (offset < buf.length - 12) {
      const chunkLength = buf.readUInt32BE(offset);
      const chunkType = buf.slice(offset + 4, offset + 8).toString('ascii');
      
      // caBX = C2PA content box in PNG
      if (chunkType === 'caBX' || chunkType === 'caAs') {
        findings.push({
          type: 'C2PA_PNG_CHUNK',
          marker: chunkType,
          offset: offset,
          context: `C2PA chunk found at offset ${offset}, length ${chunkLength}`
        });
      }
      
      // Check tEXt/iTXt for any content at all
      if (['tEXt', 'iTXt', 'zTXt'].includes(chunkType) && chunkLength > 0) {
        const data = buf.slice(offset + 8, offset + 8 + Math.min(chunkLength, 2000)).toString('utf-8').replace(/\0/g, ' | ');
        findings.push({
          type: 'PNG_TEXT_CHUNK',
          marker: chunkType,
          offset: offset,
          context: data.substring(0, 300)
        });
      }
      
      offset += 12 + chunkLength;
      if (chunkLength > buf.length) break;
    }
  }
  
  return findings;
}

function scanDir(dir, label) {
  if (!fs.existsSync(dir)) return;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📁 ${label}: ${dir}`);
  console.log('='.repeat(60));
  
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  let clean = 0, flagged = 0;
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const findings = deepScanFile(fullPath);
    
    if (findings.length > 0) {
      flagged++;
      console.log(`\n🔴 ${file}`);
      for (const f of findings) {
        console.log(`   [${f.type}] marker="${f.marker}" @offset=${f.offset}`);
        console.log(`   context: ${f.context.substring(0, 150)}`);
      }
    } else {
      clean++;
    }
  }
  
  console.log(`\n📊 Kết quả ${label}: ${files.length} files | ✅ Sạch: ${clean} | 🔴 Flagged: ${flagged}`);
}

// Scan critical directories
scanDir(AI_DIR, 'AI Generated (CẦN KIỂM TRA KỸ NHẤT)');
scanDir(LIBRARY_DIR, 'Library');
scanDir(FACEBOOK_DIR, 'Facebook Covers');

// Also scan subdirs of marketing
if (fs.existsSync(MARKETING_DIR)) {
  const subdirs = fs.readdirSync(MARKETING_DIR, { withFileTypes: true });
  for (const sub of subdirs) {
    if (sub.isDirectory()) {
      scanDir(path.join(MARKETING_DIR, sub.name), `Marketing/${sub.name}`);
    } else if (/\.(png|jpg|jpeg|webp)$/i.test(sub.name)) {
      // handle files directly in marketing
    }
  }
  scanDir(MARKETING_DIR, 'Marketing (root files)');
}
