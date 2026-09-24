#!/usr/bin/env node
/**
 * Đo hiệu năng tải trang kiểu Lighthouse mobile: LCP, CLS, số request và dung lượng theo loại tài nguyên.
 * Giả lập điện thoại 390px, mạng 4G chậm (RTT 150ms, 1.6 Mbps xuống) và CPU chậm 4 lần.
 *
 * Dùng:   npm run build && npx next start -p 3100, rồi AUDIT_BASE_URL=http://localhost:3100 node scripts/audit/perf.cjs
 * Tuỳ chọn: AUDIT_PAGES (mặc định vài trang chính). Chỉ tham khảo: số tuyệt đối khác Lighthouse thật, dùng để so trước/sau.
 */
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3100';
const PAGES = (process.env.AUDIT_PAGES || '/,/san-pham,/benediktiner-weissbier-naturtrub,/kien-thuc,/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal,/lien-he')
  .split(',').map((p) => p.trim()).filter(Boolean);

const kb = (n) => `${Math.round(n / 1024)} KB`;

(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const path of PAGES) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await context.addCookies([{ name: 'age_verified', value: '2.0', url: BASE }]);
    await context.addInitScript(() => {
      try { localStorage.setItem('cookie_consent_preferences', '{"necessary":true}'); } catch { /* */ }
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
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
      const key = t === 'font' ? 'font' : t === 'script' ? 'script' : t === 'stylesheet' ? 'stylesheet' : t === 'image' ? 'image' : t === 'document' ? 'document' : 'other';
      bytes[key] += e.encodedDataLength;
    });

    const t0 = Date.now();
    await page.goto(BASE + path, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    const loadMs = Date.now() - t0;
    const { lcp, cls } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
    const total = Object.values(bytes).reduce((a, b) => a + b, 0);
    rows.push({ page: path, LCP: `${(lcp / 1000).toFixed(2)} s`, CLS: cls.toFixed(3), load: `${(loadMs / 1000).toFixed(1)} s`, requests, total: kb(total), font: kb(bytes.font), js: kb(bytes.script), css: kb(bytes.stylesheet), img: kb(bytes.image) });
    await context.close();
  }
  await browser.close();
  console.table(rows);
})().catch((e) => { console.error(e); process.exit(1); });
