import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src/app');
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const prohibitedMetadataPatterns = [
  /mua bia đức/i,
  /mua bia benediktiner/i,
  /đặt mua/i,
  /đặt hàng/i,
  /giao hàng toàn quốc/i,
  /giao toàn quốc/i,
  /giao nhanh/i,
  /đăng ký ngay/i,
];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function metadataSegments(source) {
  const segments = [];
  const staticStart = source.indexOf('export const metadata');
  if (staticStart !== -1) {
    const end = source.indexOf('export default', staticStart);
    segments.push(source.slice(staticStart, end === -1 ? source.length : end));
  }

  let cursor = 0;
  while (true) {
    const dynamicStart = source.indexOf('generateMetadata', cursor);
    if (dynamicStart === -1) break;
    const end = source.indexOf('export default', dynamicStart);
    segments.push(source.slice(dynamicStart, end === -1 ? source.length : end));
    cursor = dynamicStart + 'generateMetadata'.length;
  }
  return segments;
}

const violations = [];
for (const file of walk(ROOT)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const segment of metadataSegments(source)) {
    for (const pattern of prohibitedMetadataPatterns) {
      const match = segment.match(pattern);
      if (match) {
        violations.push(`${path.relative(process.cwd(), file)}: ${match[0]}`);
      }
    }
  }
}

const globalLayout = fs.readFileSync(path.join(ROOT, '(web)', 'layout.tsx'), 'utf8').toLowerCase();
for (const keyword of ['bia đức nhập khẩu', 'benediktiner', 'bia thầy tu']) {
  if (!globalLayout.includes(keyword)) {
    violations.push(`src/app/(web)/layout.tsx: missing core keyword "${keyword}"`);
  }
}

if (violations.length) {
  console.error('Brochure metadata audit failed:');
  for (const violation of [...new Set(violations)]) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Brochure metadata audit PASS: no prohibited sales copy in static/dynamic metadata source.');
console.log('Core keywords PASS: bia Đức nhập khẩu / Benediktiner / bia thầy tu.');
