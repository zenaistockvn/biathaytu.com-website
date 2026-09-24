#!/usr/bin/env node
/**
 * Đo hiệu năng tải trang kiểu Lighthouse mobile: LCP, CLS, số request và dung lượng theo loại tài nguyên.
 * Giả lập điện thoại 390px, mạng 4G chậm (RTT 150ms, 1.6 Mbps xuống) và CPU chậm 4 lần.
 *
 * Dùng:   npm run build && npx next start -p 3100, rồi AUDIT_BASE_URL=http://localhost:3100 node scripts/audit/perf.cjs
 * Tuỳ chọn: AUDIT_PAGES (mặc định vài trang chính), AUDIT_RUNS (mặc định 3, lấy trung vị theo LCP vì
 *           mỗi lần đo lệch nhau cỡ ±0,5 s). Chỉ tham khảo: số tuyệt đối khác Lighthouse thật, dùng để so trước/sau.
 */
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3100';
const PAGES = (process.env.AUDIT_PAGES || '/,/san-pham,/benediktiner-weissbier-naturtrub,/kien-thuc,/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal,/lien-he')
  .split(',').map((p) => p.trim()).filter(Boolean);
const RUNS = Math.max(1, Number(process.env.AUDIT_RUNS || 3));

const kb = (n) => `${Math.round(n / 1024)} KB`;
const sec = (ms) => `${(ms / 1000).toFixed(2)} s`;

async function measure(browser, path) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await context.addCookies([{ name: 'age_verified', value: '2.0', url: BASE }]);
  await context.addInitScript(() => {
    try { localStorage.setItem('cookie_consent_preferences', '{"necessary":true}'); } catch { /* */ }
    window.__lcp = 0; window.__cls = 0; window.__lcpEl = '';
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__lcp = e.startTime;
        const el = e.element;
        window.__lcpEl = e.url ? `img ${decodeURIComponent(e.url).split('/').pop().slice(0, 32)}` : el ? `${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 24)}"` : '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const bytes = { font: 0, script: 0, stylesheet: 0, image: 0, document: 0, other: 0 };
  let requests = 0;
  const types = new Map();
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type));
  cdp.on('Network.loadingFinished', (e) => {
    requests++;
    const t = (types.get(e.requestId) || 'other').toLowerCase();
    bytes[t in bytes ? t : 'other'] += e.encodedDataLength;
  });

  await page.goto(BASE + path, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(3000);
  const m = await page.evaluate(() => ({
    lcp: window.__lcp,
    cls: window.__cls,
    lcpEl: window.__lcpEl,
    // Mốc font cuối cùng tải xong: font chặn LCP khi phần tử LCP là chữ, tranh băng thông khi là ảnh.
    fontsDone: Math.max(0, ...performance.getEntriesByType('resource').filter((r) => /\.woff2/.test(r.name)).map((r) => r.responseEnd)),
  }));
  await context.close();
  return { ...m, requests, bytes, total: Object.values(bytes).reduce((a, b) => a + b, 0) };
}

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const path of PAGES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await measure(browser, path));
    runs.sort((a, b) => a.lcp - b.lcp);
    const r = runs[Math.floor(runs.length / 2)];
    rows.push({
      page: path,
      LCP: sec(r.lcp),
      'LCP range': RUNS > 1 ? `${sec(runs[0].lcp)}–${sec(runs[runs.length - 1].lcp)}` : '',
      'LCP element': r.lcpEl,
      'fonts done': sec(r.fontsDone),
      CLS: Math.max(...runs.map((x) => x.cls)).toFixed(3),
      requests: r.requests,
      total: kb(r.total),
      font: kb(r.bytes.font),
      js: kb(r.bytes.script),
      css: kb(r.bytes.stylesheet),
      img: kb(r.bytes.image),
    });
  }
  await browser.close();
  console.table(rows);
})().catch((e) => { console.error(e); process.exit(1); });
