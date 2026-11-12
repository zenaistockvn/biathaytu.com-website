#!/usr/bin/env node
// Máy quét văn dùng chung (skill chuan-viet-bai).
// Dùng:
//   node kiem-van.mjs <file hoặc thư mục...> [--kenh web-bia|web-vang|facebook] [--xung anh-chi] [--diff <ref>]
//   echo "đoạn văn" | node kiem-van.mjs - --kenh facebook
// --diff <ref>: chỉ quét các dòng mới thêm so với <ref> (ví dụ origin/master), để chỉ soi bài mới.
// Thoát mã 1 khi có lỗi phải sửa; nhóm "watch" chỉ nhắc.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rules = JSON.parse(fs.readFileSync(path.join(here, 'quy-tac.json'), 'utf8'));

const args = process.argv.slice(2);
const opt = { kenh: null, xung: null, diff: null };
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--kenh') opt.kenh = args[++i];
  else if (args[i] === '--xung') opt.xung = args[++i];
  else if (args[i] === '--diff') opt.diff = args[++i];
  else targets.push(args[i]);
}
if (!targets.length) {
  console.error('Thiếu file cần quét. Xem hướng dẫn ở đầu file.');
  process.exit(2);
}
if (opt.kenh && !(opt.kenh in rules.bannedByChannel)) {
  console.error(`Kênh không hợp lệ: ${opt.kenh}. Chọn: ${Object.keys(rules.bannedByChannel).join(', ')}`);
  process.exit(2);
}

const banned = { ...rules.bannedPhrases, ...(opt.kenh ? rules.bannedByChannel[opt.kenh] : {}) };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = (w) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(w.normalize('NFC'))}(?![\\p{L}\\p{N}])`, 'giu');
const bannedRes = Object.entries(banned).flatMap(([cat, list]) => list.map((w) => [cat, w, wordRe(w)]));
const watchRes = rules.watchPhrases.map((w) => [w, wordRe(w)]);

const web = opt.kenh === 'web-bia' || opt.kenh === 'web-vang';
const patterns = [
  [/không chỉ[^.]{0,60}mà còn/giu, 'không chỉ... mà còn'],
  [/không phải [^.,]{1,40},? mà là/giu, 'không phải X mà là Y'],
  [/dù (bạn|anh chị) là[^.]{0,60}hay/giu, 'dù bạn là... hay'],
  [/[—–]/gu, 'gạch dài'],
];
if (web) {
  patterns.push([/(?<!<)!(?=\s|$|["'<])/gu, 'chấm than']);
  patterns.push([/\p{Extended_Pictographic}/gu, 'emoji']);
  patterns.push([/→/gu, 'mũi tên']);
}
if (opt.kenh === 'web-bia') patterns.push([/[“”‘’]/gu, 'ngoặc kép cong'], [/…/gu, 'dấu ba chấm liền']);
if (opt.xung === 'anh-chi') patterns.push([/(?<![\p{L}\p{N}])bạn(?![\p{L}\p{N}])/giu, 'xưng "bạn" (phải là "anh chị")']);

const TEXT_EXT = /\.(md|mdx|txt|html?|json|tsx?|jsx?|mjs|cjs|csv|sql)$/i;
const SKIP_DIR = new Set(['node_modules', '.git', '.next', 'dist', 'build']);
function walk(p, out) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIR.has(path.basename(p))) return;
    for (const f of fs.readdirSync(p)) walk(path.join(p, f), out);
  } else if (TEXT_EXT.test(p)) out.push(p);
}

/** Trả về [{file, line, text}] */
function collect() {
  const rows = [];
  if (opt.diff) {
    const out = execFileSync('git', ['diff', '-U0', opt.diff, '--', ...targets], { encoding: 'utf8', maxBuffer: 1 << 28 });
    let file = '', line = 0;
    for (const l of out.split('\n')) {
      if (l.startsWith('+++ ')) file = l.slice(6);
      else if (l.startsWith('@@')) line = Number(/\+(\d+)/.exec(l)[1]) - 1;
      else if (l.startsWith('+')) rows.push({ file, line: ++line, text: l.slice(1) });
    }
    return rows;
  }
  for (const t of targets) {
    if (t === '-') {
      fs.readFileSync(0, 'utf8').split(/\r?\n/).forEach((text, i) => rows.push({ file: '(stdin)', line: i + 1, text }));
      continue;
    }
    const files = [];
    walk(t, files);
    for (const file of files) {
      fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((text, i) => rows.push({ file, line: i + 1, text }));
    }
  }
  return rows;
}

const hits = {};
const watchCount = {};
const add = (cat, r, word, idx) => {
  const from = Math.max(0, idx - 50);
  const snippet = r.text.slice(from, idx + word.length + 50).trim();
  (hits[cat] ||= []).push(`${r.file}:${r.line}  [${word}]  ${snippet}`);
};

for (const r of collect()) {
  if (!/[à-ỹÀ-Ỹđ]/.test(r.text)) continue;
  if (/\.(tsx?|jsx?|mjs|cjs)$/.test(r.file) && /^\s*(\/\/|\*|\/\*)/.test(r.text)) continue;
  const text = r.text.normalize('NFC');
  const row = { ...r, text };
  for (const [cat, w, re] of bannedRes) for (const m of text.matchAll(re)) add(cat, row, w, m.index);
  for (const [name, re] of [...patterns].map(([re, name]) => [name, re])) for (const m of text.matchAll(re)) add('Kiểu câu AI và dấu câu', row, name, m.index);
  for (const [w, re] of watchRes) for (const m of text.matchAll(re)) {
    add('watch (hạn chế, tối đa 2 lần mỗi bài)', row, w, m.index);
    watchCount[w] = (watchCount[w] || 0) + 1;
  }
}

let blocking = 0;
for (const [cat, list] of Object.entries(hits)) {
  console.log(`\n### ${cat} (${list.length})`);
  list.forEach((l) => console.log(l));
  if (!cat.startsWith('watch')) blocking += list.length;
}
const w = Object.entries(watchCount).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}: ${n}`).join(', ');
console.log(`\nKết quả: ${blocking} lỗi phải sửa${w ? `; watch: ${w}` : ''}.`);
process.exit(blocking ? 1 : 0);
