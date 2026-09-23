#!/usr/bin/env node
/**
 * Đếm màu viết cứng (hex, rgb/rgba) còn nằm ngoài khối token `.web-app { ... }` của src/app/web.css.
 * Mục tiêu: mọi màu hiển thị đi qua token (xem DESIGN.md).
 *
 * Dùng:   npm run audit:colors            (báo cáo)
 *         npm run audit:colors -- --strict (exit 1 nếu còn màu viết cứng)
 * Cũng được src/app/premium-brand-guard.test.ts dùng lại qua module.exports.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');

/** Màu thương hiệu bên thứ ba (nút Zalo, gọi điện, Messenger): giữ nguyên, không phải màu Bia Thầy Tu. */
const THIRD_PARTY = /^(#(2ea3ff|0068ff|004bc1|35d86a|16a34a|087c34|00c6ff|0072ff|9026ff)|rgba?\(\s*(0,\s*104,\s*255|22,\s*163,\s*74|0,\s*114,\s*255|0,\s*38,\s*115|0,\s*43,\s*119)\b)/i;

const COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*(?!var\()[^)]*\)/g;
const TSX_COLOR_PROP = /\b(color|background|backgroundColor|borderColor|border|borderTop|borderBottom|borderLeft|borderRight|boxShadow|outline|fill|stroke|textShadow)\s*:[^,\n}]+/g;

function walk(dir, ext, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (ext.test(e.name) && !/\.test\./.test(e.name)) out.push(p);
  }
  return out;
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

/** Bỏ khối token gốc: đó là nơi duy nhất được phép định nghĩa giá trị màu. */
function withoutTokenBlock(file, css) {
  if (!file.endsWith(path.join('app', 'web.css'))) return css;
  const start = css.indexOf('.web-app {');
  return css.slice(0, start) + css.slice(css.indexOf('}', start) + 1);
}

function scan() {
  const findings = [];
  for (const file of walk('src', /\.css$/)) {
    const css = withoutTokenBlock(file, stripComments(fs.readFileSync(path.join(ROOT, file), 'utf8')));
    css.split('\n').forEach((line, i) => {
      for (const m of line.match(COLOR) || []) if (!THIRD_PARTY.test(m)) findings.push({ file, line: i + 1, value: m, kind: 'css' });
    });
  }
  for (const file of walk('src', /\.tsx$/)) {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    // Khối <style> nhúng trong TSX tính như CSS.
    for (const block of src.match(/<style[^>]*>[\s\S]*?<\/style>|__html:\s*`[\s\S]*?`|style\.textContent\s*=\s*['"`][\s\S]*?['"`]/g) || []) {
      for (const m of stripComments(block).match(COLOR) || []) if (!THIRD_PARTY.test(m)) findings.push({ file, line: 0, value: m, kind: 'tsx-style' });
    }
    src.split('\n').forEach((line, i) => {
      for (const p of line.matchAll(TSX_COLOR_PROP)) {
        for (const m of p[0].match(COLOR) || []) if (!THIRD_PARTY.test(m)) findings.push({ file, line: i + 1, value: m, kind: 'tsx-inline' });
      }
    });
  }
  return findings;
}

module.exports = { scan, THIRD_PARTY };

if (require.main === module) {
  const findings = scan();
  const byFile = {}, byValue = {};
  for (const f of findings) {
    byFile[f.file] = (byFile[f.file] || 0) + 1;
    const v = f.value.toUpperCase().replace(/\s+/g, '').replace(/,[0-9.]+\)$/, ',a)');
    byValue[v] = (byValue[v] || 0) + 1;
  }
  console.log(`Màu viết cứng ngoài khối token: ${findings.length}`);
  console.log(`  CSS: ${findings.filter((f) => f.kind === 'css').length}, <style> trong TSX: ${findings.filter((f) => f.kind === 'tsx-style').length}, style inline TSX: ${findings.filter((f) => f.kind === 'tsx-inline').length}\n`);
  console.log('Theo file:');
  for (const [f, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${f}`);
  console.log('\nGiá trị gặp nhiều nhất:');
  for (const [v, n] of Object.entries(byValue).sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`  ${String(n).padStart(4)}  ${v}`);
  if (process.argv.includes('--strict') && findings.length) process.exit(1);
}
