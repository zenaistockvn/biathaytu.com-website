#!/usr/bin/env node
/**
 * Đo tương phản chữ trên trang render thật (WCAG 2.1 AA).
 *
 * Cách đo: ẩn toàn bộ chữ, chụp ảnh, rồi so màu chữ với từng pixel thật nằm phía sau.
 * Bắt được gradient, ảnh nền, lớp phủ và độ trong suốt kế thừa, những thứ test tĩnh
 * trên token (src/app/contrast.test.ts) không thấy được.
 *
 * Dùng:   npm run build && npm run audit:contrast
 * Tuỳ chọn: AUDIT_BASE_URL=http://localhost:3000  (mặc định tự chạy `next start` ở cổng 3100)
 *           AUDIT_PAGES=/,/san-pham               (chỉ đo vài trang)
 *           AUDIT_SHOTS=before                     (lưu ảnh chụp vào .audit/shots/before/)
 * Kết quả:  .audit/contrast-report.json, exit code 1 nếu còn chữ dưới AA.
 */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.AUDIT_PORT || 3100);
const BASE = process.env.AUDIT_BASE_URL || `http://localhost:${PORT}`;
const OUT = path.join(process.cwd(), '.audit');
const SHOTS = process.env.AUDIT_SHOTS ? path.join(OUT, 'shots', process.env.AUDIT_SHOTS) : null;

const PAGES = (process.env.AUDIT_PAGES || [
  '/', '/san-pham', '/san-pham/benediktiner-festbier-bom-5l', '/san-pham/the-wurst-wiener-hun-khoi-500g',
  '/benediktiner-weissbier-naturtrub', '/bitburger-premium-pils',
  '/benediktiner-dunkel', '/bom-bia-5l-benediktiner', '/qua-tang-bia-duc', '/bang-gia-si-dai-ly',
  '/thuong-hieu', '/ve-chung-toi', '/kien-thuc', '/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal', '/lien-he',
  '/bia-thay-tu-la-gi', '/food-pairing-bia-duc', '/chung-nhan-nhap-khau-chinh-hang', '/bia-benediktiner-chinh-hang',
  '/huong-dan-rot-bia-lua-mi', '/bia-duc-cho-nha-hang-khach-san', '/thong-tin-mua-hang', '/chinh-sach-bao-mat',
  '/chinh-sach-cookie', '/chinh-sach-kiem-soat-do-tuoi', '/dieu-khoan-su-dung', '/chua-du-tuoi',
].join(',')).split(',').map((p) => p.trim()).filter(Boolean);

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

/** Chữ trang trí có chủ đích mờ (không mang thông tin). Thêm vào đây phải có lý do. */
const DECORATIVE = [];

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

/** Chạy trong trang: liệt kê mọi phần tử có chữ, màu chữ, vùng chữ và có nằm trong phần tử cố định không. */
function collect(decorative) {
  const parse = (s) => {
    const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (el.closest('[aria-hidden="true"]') || decorative.some((d) => el.closest(d))) return;
    const textNodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!textNodes.length) return;
    const range = document.createRange(); let rect = null;
    for (const n of textNodes) {
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        if (r.width < 1 || r.height < 1) continue;
        rect = rect ? { l: Math.min(rect.l, r.left), t: Math.min(rect.t, r.top), r: Math.max(rect.r, r.right), b: Math.max(rect.b, r.bottom) }
          : { l: r.left, t: r.top, r: r.right, b: r.bottom };
      }
    }
    if (!rect || rect.b + scrollY <= 0 || rect.r <= 0) return; // ngoài màn hình (vd. skip-link)
    let opacity = 1, fixed = false;
    const inDialog = !!el.closest('[aria-modal="true"]');
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = getComputedStyle(n); opacity *= parseFloat(s.opacity);
      if (s.position === 'fixed' || s.position === 'sticky') fixed = true;
    }
    if (opacity < 0.05) return;
    const clip = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text';
    const fgs = (clip && cs.backgroundImage !== 'none' ? (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []) : [cs.color])
      .map(parse).filter(Boolean).map((c) => ({ ...c, a: c.a * opacity }));
    if (!fgs.length || fgs.every((c) => c.a < 0.05)) return;
    const pathParts = [];
    for (let n = el, i = 0; n && n !== document.body && i < 3; n = n.parentElement, i++) {
      pathParts.unshift(n.tagName.toLowerCase() + (n.classList[0] ? '.' + n.classList[0] : ''));
    }
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10) || 400;
    out.push({
      text: textNodes.map((t) => t.textContent.trim()).join(' ').replace(/\s+/g, ' ').slice(0, 60),
      selector: pathParts.join(' > '), fixed, inDialog, fgs, size, weight,
      large: size >= 24 || (size >= 18.66 && weight >= 700),
      rect: { x: rect.l + scrollX, y: rect.t + scrollY, w: rect.r - rect.l, h: rect.b - rect.t },
    });
  });
  return out;
}

/** Chạy trong trang: so từng item với pixel nền trong ảnh chụp. */
async function score({ b64, items }) {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0);
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const over = (t, b) => ({ r: t.r * t.a + b.r * (1 - t.a), g: t.g * t.a + b.g * (1 - t.a), b: t.b * t.a + b.b * (1 - t.a) });
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  return items.map((it) => {
    const x0 = Math.max(0, Math.floor(it.rect.x)), y0 = Math.max(0, Math.floor(it.rect.y));
    const w = Math.min(cv.width - x0, Math.ceil(it.rect.w)), h = Math.min(cv.height - y0, Math.ceil(it.rect.h));
    if (w < 1 || h < 1) return null;
    const d = cx.getImageData(x0, y0, w, h).data, step = Math.max(1, Math.floor(Math.sqrt((w * h) / 500)));
    const ratios = []; const sum = { r: 0, g: 0, b: 0 }; let n = 0;
    for (let yy = 0; yy < h; yy += step) for (let xx = 0; xx < w; xx += step) {
      const i = (yy * w + xx) * 4, bg = { r: d[i], g: d[i + 1], b: d[i + 2] };
      sum.r += bg.r; sum.g += bg.g; sum.b += bg.b; n++;
      ratios.push(Math.min(...it.fgs.map((fg) => ratio(over(fg, bg), bg))));
    }
    ratios.sort((a, b) => a - b);
    return {
      text: it.text, selector: it.selector, fontSize: it.size, fontWeight: it.weight,
      required: it.large ? 3 : 4.5, ratio: +ratios[Math.floor(ratios.length / 2)].toFixed(2),
      worst10: +ratios[Math.floor(ratios.length * 0.1)].toFixed(2),
      fg: it.fgs.map((c) => hex(c) + (c.a < 0.99 ? '@' + c.a.toFixed(2) : '')).join(' → '),
      bg: hex({ r: sum.r / n, g: sum.g / n, b: sum.b / n }), y: Math.round(it.rect.y),
    };
  }).filter(Boolean);
}

async function auditPage(browser, viewportName, pagePath, gate) {
  const context = await browser.newContext({ viewport: VIEWPORTS[viewportName], reducedMotion: 'reduce' });
  if (!gate) await context.addCookies([{ name: 'age_verified', value: '2.0', url: BASE }]);
  await context.addInitScript(() => {
    try {
      localStorage.setItem('cookie_consent_preferences', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    } catch { /* storage bị chặn */ }
  });
  const page = await context.newPage();
  try {
    await page.goto(BASE + pagePath, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    if (SHOTS) {
      fs.mkdirSync(SHOTS, { recursive: true });
      const name = `${viewportName}${gate ? '-cong-tuoi' : ''}${pagePath === '/' ? '-home' : pagePath.replace(/\//g, '_')}.png`;
      await page.screenshot({ path: path.join(SHOTS, name), fullPage: !gate });
    }
    await page.evaluate(() => { scrollTo(0, 0); dispatchEvent(new Event('scroll')); });
    await page.waitForTimeout(600);
    const items = (await page.evaluate(collect, DECORATIVE)).filter((i) => (gate ? i.inDialog : true));
    // nextjs-portal: nút dev tools của `next dev`, nằm trong shadow DOM nên bước ẩn phần tử cố định không bắt được.
    await page.addStyleTag({ content: '*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important;text-decoration-color:transparent!important}nextjs-portal{display:none!important}' });
    await page.waitForTimeout(150);
    // Ảnh B: đúng khung màn hình ở đầu trang. Phần tử cố định (header, thanh điều hướng, cổng tuổi)
    // chỉ đúng vị trí trong ảnh khung màn hình; ảnh toàn trang sẽ dời chúng đi.
    const viewportHeight = VIEWPORTS[viewportName].height;
    const withFixed = await page.screenshot({ fullPage: false });
    // Ảnh A: ẩn phần tử cố định để chúng không che chữ của nội dung trang.
    await page.evaluate(() => document.querySelectorAll('body *').forEach((el) => {
      const p = getComputedStyle(el).position;
      if (p === 'fixed' || p === 'sticky') el.style.setProperty('visibility', 'hidden', 'important');
    }));
    await page.waitForTimeout(100);
    const withoutFixed = await page.screenshot({ fullPage: true });
    const fixedScores = await page.evaluate(score, { b64: withFixed.toString('base64'), items: items.filter((i) => i.fixed && i.rect.y + i.rect.h <= viewportHeight) });
    const flowScores = await page.evaluate(score, { b64: withoutFixed.toString('base64'), items: items.filter((i) => !i.fixed) });
    return [...fixedScores, ...flowScores];
  } finally {
    await context.close();
  }
}

(async () => {
  const server = await ensureServer();
  const browser = await chromium.launch();
  const report = { base: BASE, date: new Date().toISOString(), pages: {}, failures: [] };
  try {
    const runs = [];
    for (const vp of Object.keys(VIEWPORTS)) for (const p of PAGES) runs.push([vp, p, false]);
    for (const vp of Object.keys(VIEWPORTS)) runs.push([vp, '/', true]);
    for (const [vp, p, gate] of runs) {
      const key = `${vp} ${p}${gate ? ' [cổng tuổi]' : ''}`;
      try {
        const scored = await auditPage(browser, vp, p, gate);
        const fails = scored.filter((s) => s.ratio < s.required);
        report.pages[key] = { measured: scored.length, failures: fails.length };
        for (const f of fails) report.failures.push({ page: key, ...f });
        console.log(`${fails.length ? 'FAIL' : 'ok  '} ${key.padEnd(62)} ${String(scored.length).padStart(4)} dòng chữ, ${fails.length} dưới AA`);
      } catch (e) {
        report.pages[key] = { error: e.message.split('\n')[0] };
        report.failures.push({ page: key, error: e.message.split('\n')[0] });
        console.log(`ERR  ${key}: ${e.message.split('\n')[0]}`);
      }
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'contrast-report.json'), JSON.stringify(report, null, 2));
  const measured = Object.values(report.pages).reduce((s, p) => s + (p.measured || 0), 0);
  console.log(`\n${measured} dòng chữ, ${report.failures.length} lỗi. Chi tiết: .audit/contrast-report.json`);
  for (const f of report.failures.slice(0, 40)) {
    console.log(f.error ? `  ${f.page}: ${f.error}` : `  ${f.ratio}:1 (cần ${f.required}) ${f.fg} trên ${f.bg}  ${f.page}  ${f.selector}  "${f.text}"`);
  }
  process.exit(report.failures.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
