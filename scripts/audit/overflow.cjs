#!/usr/bin/env node
/**
 * Phát hiện chữ tràn ngang và trang bị cuộn ngang ở các độ rộng màn hình phổ biến.
 * Bỏ qua phần tử nằm trong vùng cuộn ngang có chủ đích (carousel, bảng có overflow-x).
 *
 * Dùng:   npm run build && npm run audit:overflow
 * Tuỳ chọn: AUDIT_BASE_URL, AUDIT_PAGES giống scripts/audit/contrast.cjs
 */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');

const PORT = Number(process.env.AUDIT_PORT || 3100);
const BASE = process.env.AUDIT_BASE_URL || `http://localhost:${PORT}`;
const WIDTHS = [360, 390, 768, 1024, 1440];
const PAGES = (process.env.AUDIT_PAGES || [
  '/', '/san-pham', '/san-pham/benediktiner-festbier-bom-5l', '/benediktiner-weissbier-naturtrub', '/bitburger-premium-pils',
  '/bia-duc-nhap-khau', '/nhan-uu-dai', '/benediktiner-dunkel', '/bom-bia-5l-benediktiner', '/qua-tang-bia-duc',
  '/bang-gia-si-dai-ly', '/thuong-hieu', '/ve-chung-toi', '/kien-thuc', '/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal',
  '/lien-he', '/bia-thay-tu-la-gi', '/food-pairing-bia-duc', '/chung-nhan-nhap-khau-chinh-hang', '/chua-du-tuoi',
].join(',')).split(',').map((p) => p.trim()).filter(Boolean);

async function ensureServer() {
  try { await fetch(BASE); return null; } catch { /* chưa chạy */ }
  if (process.env.AUDIT_BASE_URL) throw new Error(`Không kết nối được ${BASE}`);
  // Chạy thẳng next (không qua npx) để kill() dừng đúng server, tránh server mồ côi phục vụ bản build cũ.
  const proc = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '-p', String(PORT)], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try { await fetch(BASE); return proc; } catch { /* đợi */ }
  }
  proc.kill();
  throw new Error('next start không lên sau 30 giây. Đã chạy `npm run build` chưa?');
}

function inspect() {
  const vw = document.documentElement.clientWidth;
  const inScroller = (el) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const o = getComputedStyle(n).overflowX;
      if (o === 'auto' || o === 'scroll') return true;
    }
    return false;
  };
  const issues = [];
  for (const el of document.querySelectorAll('h1, h2, h3, h4, p, a, button, li, span, strong')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || inScroller(el)) continue;
    const r = el.getBoundingClientRect();
    // Bỏ qua chữ chỉ dành cho trình đọc màn hình (khung 1x1px, cố ý bị cắt).
    if (!r.width || r.bottom + scrollY <= 0 || (r.width <= 1 && r.height <= 1)) continue;
    const clipped = el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible' && el.clientWidth > 0;
    if (r.right > vw + 1 || clipped) {
      issues.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), text: el.textContent.trim().slice(0, 50), fontSize: cs.fontSize, right: Math.round(r.right), viewport: vw });
    }
  }
  return { pageScroll: document.documentElement.scrollWidth > vw, issues: issues.slice(0, 10) };
}

(async () => {
  const server = await ensureServer();
  const browser = await chromium.launch();
  let problems = 0;
  try {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
      await context.addCookies([{ name: 'age_verified', value: '2.0', url: BASE }]);
      await context.addInitScript(() => { try { sessionStorage.setItem('football_campaign_popup_shown', 'true'); localStorage.setItem('cookie_consent_preferences', '{"necessary":true}'); } catch { /* */ } });
      const page = await context.newPage();
      for (const p of PAGES) {
        await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 60000 });
        const r = await page.evaluate(inspect);
        if (r.pageScroll || r.issues.length) {
          problems++;
          console.log(`FAIL ${width}px ${p}${r.pageScroll ? '  [trang bị cuộn ngang]' : ''}`);
          for (const i of r.issues) console.log(`     <${i.tag} class="${i.cls}"> ${i.fontSize}, mép phải ${i.right}px / ${i.viewport}px  "${i.text}"`);
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }
  console.log(problems ? `\n${problems} trang/độ rộng có chữ tràn.` : `\nKhông có chữ tràn ở ${WIDTHS.join(', ')}px.`);
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
