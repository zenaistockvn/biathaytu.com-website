#!/usr/bin/env node
/**
 * Chụp computed style của mọi phần tử để chứng minh một lần sửa CSS không đổi giao diện.
 * So thuộc tính chứ không so pixel: chỉ ra đúng phần tử và thuộc tính bị đổi.
 *
 * Dùng:   node scripts/audit/style-snapshot.cjs capture <tên>
 *         node scripts/audit/style-snapshot.cjs compare <tên-trước> <tên-sau>
 * Tuỳ chọn: AUDIT_BASE_URL (mặc định http://localhost:3000, cần server đang chạy),
 *           AUDIT_PAGES, AUDIT_WIDTHS, AUDIT_SHOTS=1 (chụp thêm ảnh toàn trang).
 *           Kết quả lưu ở .audit/style-snapshots/<tên>/.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const WIDTHS = (process.env.AUDIT_WIDTHS || '360,768,1024,1440').split(',').map(Number);
const PAGES = (process.env.AUDIT_PAGES || [
  '/', '/san-pham', '/san-pham/benediktiner-festbier-bom-5l', '/benediktiner-weissbier-naturtrub', '/bitburger-premium-pils',
  '/benediktiner-dunkel', '/bom-bia-5l-benediktiner', '/qua-tang-bia-duc',
  '/bang-gia-si-dai-ly', '/thuong-hieu', '/ve-chung-toi', '/kien-thuc', '/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal',
  '/lien-he', '/bia-thay-tu-la-gi', '/food-pairing-bia-duc', '/chung-nhan-nhap-khau-chinh-hang', '/chua-du-tuoi',
].join(',')).split(',').map((p) => p.trim()).filter(Boolean);
const OUT = path.join(process.cwd(), '.audit', 'style-snapshots');

const PROPS = [
  'display', 'position', 'top', 'right', 'bottom', 'left', 'float', 'z-index', 'box-sizing',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'color', 'background-color', 'background-image', 'background-size', 'background-position',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
  'text-transform', 'text-align', 'text-decoration-line', 'text-underline-offset', 'white-space',
  'opacity', 'visibility', 'box-shadow', 'text-shadow', 'transform', 'filter', 'backdrop-filter',
  'overflow-x', 'overflow-y', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
  'justify-content', 'align-items', 'align-self', 'row-gap', 'column-gap', 'order',
  'grid-template-columns', 'grid-template-rows', 'grid-column-start', 'grid-column-end',
  'object-fit', 'object-position', 'aspect-ratio', 'max-width', 'min-height', 'max-height',
  'outline-style', 'outline-color', 'outline-width', 'outline-offset', 'cursor', 'pointer-events', 'content',
  'list-style-type', 'vertical-align', 'transition-property', 'animation-name',
];

function snapshot(props) {
  const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META']);
  const out = {};
  const keyOf = (el) => {
    const parts = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const i = n.parentElement ? [...n.parentElement.children].indexOf(n) : 0;
      const cls = typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/)[0] : '';
      parts.unshift(`${n.tagName.toLowerCase()}${cls}:${i}`);
    }
    return parts.join('>');
  };
  const read = (cs) => {
    const o = {};
    for (const p of props) o[p] = cs.getPropertyValue(p);
    return o;
  };
  for (const el of document.body.querySelectorAll('*')) {
    if (skip.has(el.tagName) || el.closest('nextjs-portal, [data-nextjs-toast], #__next-build-watcher')) continue;
    const r = el.getBoundingClientRect();
    const key = keyOf(el);
    out[key] = { ...read(getComputedStyle(el)), rect: [r.x, r.y + scrollY, r.width, r.height].map(Math.round).join(',') };
    for (const pe of ['::before', '::after']) {
      const cs = getComputedStyle(el, pe);
      if (cs.content && cs.content !== 'none' && cs.content !== 'normal') out[key + pe] = read(cs);
    }
  }
  return out;
}

async function capture(name) {
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.addCookies([{ name: 'age_verified', value: '2.0', url: BASE }]);
      await context.addInitScript(() => { try { localStorage.setItem('cookie_consent_preferences', '{"necessary":true}'); } catch { /* */ } });
      const page = await context.newPage();
      for (const p of PAGES) {
        await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 120000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        const data = await page.evaluate(snapshot, PROPS);
        const file = `${width}${p.replace(/\//g, '_') || '_'}.json`;
        fs.writeFileSync(path.join(dir, file), JSON.stringify(data));
        if (process.env.AUDIT_SHOTS) {
          // Cuộn hết trang để ảnh lazy-load tải xong, rồi về đầu trang trước khi chụp.
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 60)); }
            // 'instant': trang có scroll-behavior: smooth, cuộn mượt sẽ chưa về đầu khi chụp.
            scrollTo({ top: 0, behavior: 'instant' });
            dispatchEvent(new Event('scroll'));
            await new Promise((r) => setTimeout(r, 400));
          });
          // Trang có kết nối kéo dài (widget chat...) có thể không bao giờ "networkidle"; không chặn việc chụp.
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
          await page.screenshot({ path: path.join(dir, file.replace(/\.json$/, '.png')), fullPage: true });
        }
        process.stdout.write(`${width}px ${p}  ${Object.keys(data).length} phần tử\n`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

function compare(a, b) {
  const da = path.join(OUT, a);
  const db = path.join(OUT, b);
  let total = 0;
  for (const file of fs.readdirSync(da)) {
    if (!fs.existsSync(path.join(db, file))) { console.log(`THIẾU ${file} trong ${b}`); total++; continue; }
    const A = JSON.parse(fs.readFileSync(path.join(da, file), 'utf8'));
    const B = JSON.parse(fs.readFileSync(path.join(db, file), 'utf8'));
    const diffs = [];
    for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) {
      if (!A[key] || !B[key]) { diffs.push(`${A[key] ? '-' : '+'} ${key}`); continue; }
      for (const prop of Object.keys(A[key])) {
        // Chrome thỉnh thoảng trả margin:auto là 0px thay vì giá trị đã dàn trang; khung phần tử đã đứng yên thì bỏ qua.
        if (prop.startsWith('margin-') && A[key].rect === B[key].rect) continue;
        if (A[key][prop] !== B[key][prop]) diffs.push(`  ${key}\n      ${prop}: ${A[key][prop]}  =>  ${B[key][prop]}`);
      }
    }
    if (diffs.length) {
      total += diffs.length;
      console.log(`\n${file}: ${diffs.length} khác biệt`);
      diffs.slice(0, 15).forEach((d) => console.log(d));
    }
  }
  console.log(total ? `\nTổng cộng ${total} khác biệt.` : '\nKhông có khác biệt.');
  process.exitCode = total ? 1 : 0;
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'capture' && a) capture(a).catch((e) => { console.error(e); process.exit(1); });
else if (cmd === 'compare' && a && b) compare(a, b);
else console.log('Dùng: capture <tên> | compare <tên-trước> <tên-sau>');
