#!/usr/bin/env node
/**
 * Tìm các `!important` thừa trong CSS toàn cục và gỡ chúng.
 *
 * Một `!important` (quy tắc R, thuộc tính p) là thừa khi, trên mọi trang và độ rộng đã quét,
 * với mọi phần tử R khớp: không có inline style đặt p, không quy tắc nào khác đặt p kèm !important,
 * và R vẫn thắng mọi quy tắc cạnh tranh nhờ specificity hoặc thứ tự. Quy tắc cạnh tranh được khớp
 * sau khi bỏ trạng thái (:hover, :focus...) nên trạng thái tương tác cũng được tính. Thuộc tính có
 * trong @keyframes luôn giữ !important (vì !important thắng animation). Quy tắc không khớp phần tử
 * nào (menu đang mở, popup...) giữ nguyên.
 *
 * Dùng:   node scripts/audit/important-usage.cjs          (báo cáo)
 *         node scripts/audit/important-usage.cjs --write  (gỡ !important thừa)
 * Tuỳ chọn: AUDIT_BASE_URL (mặc định http://localhost:3000), AUDIT_PAGES, AUDIT_WIDTHS.
 * Sau khi --write, chạy style-snapshot.cjs compare để xác nhận giao diện không đổi.
 */
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const { chromium } = require('playwright');

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const WIDTHS = (process.env.AUDIT_WIDTHS || '360,390,768,1024,1280,1440').split(',').map(Number);
const PAGES = (process.env.AUDIT_PAGES || [
  '/', '/san-pham', '/san-pham/benediktiner-festbier-bom-5l', '/benediktiner-weissbier-naturtrub', '/bitburger-premium-pils',
  '/benediktiner-dunkel', '/bom-bia-5l-benediktiner', '/qua-tang-bia-duc',
  '/bang-gia-si-dai-ly', '/thuong-hieu', '/ve-chung-toi', '/kien-thuc', '/kien-thuc/nguon-goc-bia-thay-tu-tu-vien-ettal',
  '/lien-he', '/bia-thay-tu-la-gi', '/food-pairing-bia-duc', '/chung-nhan-nhap-khau-chinh-hang', '/chua-du-tuoi',
  '/bia-duc-cho-nha-hang-khach-san', '/bia-benediktiner-chinh-hang', '/huong-dan-rot-bia-lua-mi', '/thong-tin-mua-hang',
  '/chinh-sach-bao-mat', '/chinh-sach-cookie', '/chinh-sach-kiem-soat-do-tuoi', '/dieu-khoan-su-dung',
].join(',')).split(',').map((p) => p.trim()).filter(Boolean);
const FILES = ['src/app/web.css', 'src/app/mobile-overrides.css', 'src/app/brand-consistency.css', 'src/app/editorial-pages.css'];

/* Chạy trong trình duyệt. */
function analyze() {
  const STATE = /:(?:hover|focus-visible|focus-within|focus|active|visited|link|any-link|target|placeholder-shown|checked|autofill|-webkit-autofill|disabled|enabled|open|popover-open|user-invalid|invalid|valid)(?![\w-])/g;
  const PE = /::?(?:before|after|placeholder|selection|marker|first-line|first-letter|backdrop|file-selector-button|-webkit-[\w-]+|-moz-[\w-]+)/;

  const splitList = (s) => {
    const out = []; let depth = 0; let cur = '';
    for (const ch of s) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const spec = (sel) => {
    let a = 0; let b = 0; let c = 0; let i = 0;
    const add = (s) => { a += s[0]; b += s[1]; c += s[2]; };
    const readParen = () => { let depth = 0; const start = i; for (; i < sel.length; i++) { if (sel[i] === '(') depth++; if (sel[i] === ')') { depth--; if (depth === 0) { i++; break; } } } return sel.slice(start + 1, i - 1); };
    const maxOf = (list) => splitList(list).map(spec).reduce((m, s) => (s[0] - m[0] || s[1] - m[1] || s[2] - m[2]) > 0 ? s : m, [0, 0, 0]);
    while (i < sel.length) {
      const ch = sel[i];
      if (ch === '#') { a++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '.') { b++; i++; while (i < sel.length && /[\w-]|\\./.test(sel[i])) { if (sel[i] === '\\') i++; i++; } }
      else if (ch === '[') { b++; while (i < sel.length && sel[i] !== ']') i++; i++; }
      else if (ch === ':') {
        const m = /^::?([\w-]+)/.exec(sel.slice(i)); i += m[0].length;
        const name = m[1];
        const isPE = m[0].startsWith('::') || ['before', 'after', 'first-line', 'first-letter'].includes(name);
        if (sel[i] === '(') {
          const inner = readParen();
          if (name === 'where') { /* 0 */ }
          else if (['is', 'not', 'has', 'matches'].includes(name)) add(maxOf(inner));
          else if (/^nth-/.test(name)) { b++; const of = / of (.*)$/.exec(inner); if (of) add(maxOf(of[1])); }
          else if (isPE) c++; else b++;
        } else if (isPE) c++; else b++;
      } else if (/[a-zA-Z]/.test(ch)) { c++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else i++;
    }
    return [a, b, c];
  };
  const cmp = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];

  const rules = []; const animProps = new Set(); let order = 0;
  const walk = (list, media, sheet) => {
    for (const r of list) {
      if (r instanceof CSSMediaRule) { if (matchMedia(r.media.mediaText).matches) walk(r.cssRules, [...media, r.media.mediaText], sheet); }
      else if (r instanceof CSSSupportsRule) { if (CSS.supports(r.conditionText)) walk(r.cssRules, media, sheet); }
      else if (r instanceof CSSKeyframesRule) { for (const k of r.cssRules) for (let j = 0; j < k.style.length; j++) animProps.add(k.style[j]); }
      else if (r instanceof CSSStyleRule) rules.push({ rule: r, order: order++, media: media.join(' && '), sheet });
    }
  };
  [...document.styleSheets].forEach((s, idx) => { try { walk(s.cssRules, [], s.href || `inline#${idx}`); } catch { /* khác origin */ } });

  const byEl = new Map(); const wild = new Set();
  for (const r of rules) {
    const st = r.rule.style;
    r.props = new Map();
    for (let j = 0; j < st.length; j++) r.props.set(st[j], st.getPropertyPriority(st[j]) === 'important');
    if (!r.props.size) continue;
    for (const item of splitList(r.rule.selectorText)) {
      const peM = PE.exec(item);
      const pe = peM ? peM[0].replace(/^:(?!:)/, '::') : '';
      let base = item.replace(PE, '').replace(STATE, '');
      for (let k = 0; k < 3; k++) base = base.replace(/:(?:not|is|where|has)\(\s*\)/g, '');
      base = base.trim().replace(/[>+~]\s*$/, (m) => m + ' *') || '*';
      let els;
      try { els = document.querySelectorAll(base); } catch { r.props.forEach((_, p) => wild.add(p)); continue; }
      const s = spec(item);
      for (const el of els) {
        if (!byEl.has(el)) byEl.set(el, []);
        byEl.get(el).push({ r, spec: s, pe });
      }
    }
  }

  const matched = new Set(); const needed = new Set();
  const keyOf = (r, p) => `${r.rule.selectorText} @ ${r.media} | ${p}`;
  for (const [el, entries] of byEl) {
    for (const e of entries) {
      for (const [p, imp] of e.r.props) {
        if (!imp) continue;
        const key = keyOf(e.r, p);
        matched.add(key);
        if (needed.has(key)) continue;
        let need = animProps.has(p) || wild.has(p) || (!e.pe && el.style && [...el.style].includes(p));
        if (!need) {
          for (const c of entries) {
            if (c.r === e.r || c.pe !== e.pe || !c.r.props.has(p)) continue;
            if (c.r.props.get(p)) { need = true; break; }
            const d = cmp(e.spec, c.spec);
            if (d < 0 || (d === 0 && e.r.order < c.r.order)) { need = true; break; }
          }
        }
        if (need) needed.add(key);
      }
    }
  }
  return { matched: [...matched], needed: [...needed] };
}

async function main() {
  const write = process.argv.includes('--write');
  const browser = await chromium.launch();
  const matched = new Set(); const needed = new Set();
  let normPage;
  try {
    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.addCookies([{ name: 'age_verified', value: '2.0', url: BASE }]);
      await context.addInitScript(() => { try { localStorage.setItem('cookie_consent_preferences', '{"necessary":true}'); } catch { /* */ } });
      const page = await context.newPage();
      for (const p of PAGES) {
        await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 120000 });
        const r = await page.evaluate(analyze);
        r.matched.forEach((k) => matched.add(k));
        r.needed.forEach((k) => needed.add(k));
      }
      process.stdout.write(`${width}px xong\n`);
      await context.close();
    }

    normPage = await (await browser.newContext()).newPage();
    await normPage.goto(BASE + '/chua-du-tuoi');
    const decls = [];
    const roots = FILES.map((f) => {
      const root = postcss.parse(fs.readFileSync(f, 'utf8'), { from: f });
      root.walkDecls((d) => {
        if (!d.important || d.parent.type !== 'rule') return;
        const media = [];
        for (let n = d.parent.parent; n && n.type !== 'root'; n = n.parent) if (n.type === 'atrule' && n.name === 'media') media.unshift(n.params);
        decls.push({ file: f, d, selector: d.parent.selector, media, prop: d.prop });
      });
      return { f, root };
    });
    const norm = await normPage.evaluate(({ selectors, medias, props }) => {
      const sel = {}; const med = {}; const longhands = {};
      for (const s of selectors) { try { const sh = new CSSStyleSheet(); sh.replaceSync(`${s}{}`); sel[s] = sh.cssRules[0] ? sh.cssRules[0].selectorText : null; } catch { sel[s] = null; } }
      for (const m of medias) { try { const sh = new CSSStyleSheet(); sh.replaceSync(`@media ${m}{}`); med[m] = sh.cssRules[0].media.mediaText; } catch { med[m] = null; } }
      for (const p of props) { const st = document.createElement('div').style; st.setProperty(p, 'inherit'); longhands[p] = [...st]; }
      return { sel, med, longhands };
    }, {
      selectors: [...new Set(decls.map((x) => x.selector))],
      medias: [...new Set(decls.flatMap((x) => x.media))],
      props: [...new Set(decls.map((x) => x.prop))],
    });

    const stats = {};
    for (const x of decls) {
      const s = (stats[x.file] ||= { total: 0, removed: 0, needed: 0, unmatched: 0 });
      s.total++;
      const selector = norm.sel[x.selector];
      const longs = norm.longhands[x.prop] || [];
      if (!selector || !longs.length || x.media.some((m) => norm.med[m] == null)) { s.unmatched++; continue; }
      const media = x.media.map((m) => norm.med[m]).join(' && ');
      const keys = longs.map((l) => `${selector} @ ${media} | ${l}`);
      if (keys.some((k) => needed.has(k))) { s.needed++; continue; }
      if (!keys.every((k) => matched.has(k))) { s.unmatched++; continue; }
      s.removed++;
      if (write) { x.d.important = false; delete x.d.raws.important; }
    }
    console.table(stats);
    if (write) for (const { f, root } of roots) fs.writeFileSync(f, root.toString());
    console.log(write ? 'Đã gỡ các !important thừa. Chạy style-snapshot compare để xác nhận.' : 'Chạy lại với --write để gỡ.');
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
