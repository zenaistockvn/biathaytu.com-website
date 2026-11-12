#!/usr/bin/env node
// Chép bộ skill thương hiệu từ bản gốc (AMC-BIATHAYTU/.agents/skills) sang repo khác.
// Dùng: node dong-bo.mjs <thư mục repo đích>... [--kiem]
//   --kiem: không chép, chỉ báo skill nào lệch với bản gốc (thoát mã 1 nếu lệch).
// Repo đích nhận skill ở .claude/skills/ (hai website) hoặc .agents/skills/ nếu thư mục đó đã có.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BO_SKILL = [
  'chuan-viet-bai',
  'thuong-hieu-german-taste',
  'ke-chuyen-thuong-hieu',
  'dang-bai-facebook',
  'dang-bai-website',
  'mot-chuyen-nhieu-kenh',
];

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const chiKiem = args.includes('--kiem');
const dich = args.filter((a) => a !== '--kiem');
if (!dich.length) {
  console.error('Thiếu thư mục repo đích.');
  process.exit(2);
}

function docCay(dir, base = dir, out = {}) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) docCay(p, base, out);
    else out[path.relative(base, p)] = fs.readFileSync(p, 'utf8');
  }
  return out;
}

let lech = 0;
for (const repo of dich) {
  const agents = path.join(repo, '.agents', 'skills');
  const noiNhan = fs.existsSync(agents) ? agents : path.join(repo, '.claude', 'skills');
  for (const ten of BO_SKILL) {
    const nguon = path.join(goc, ten);
    const toi = path.join(noiNhan, ten);
    if (path.resolve(nguon) === path.resolve(toi)) continue;
    const a = docCay(nguon);
    const b = fs.existsSync(toi) ? docCay(toi) : {};
    const khac = JSON.stringify(a) !== JSON.stringify(b);
    if (chiKiem) {
      if (khac) { lech++; console.log(`LỆCH  ${toi}`); }
      continue;
    }
    if (khac) {
      fs.rmSync(toi, { recursive: true, force: true });
      fs.cpSync(nguon, toi, { recursive: true });
      console.log(`Đã chép  ${toi}`);
    }
  }
}
if (chiKiem) console.log(lech ? `${lech} skill lệch với bản gốc.` : 'Mọi skill khớp bản gốc.');
process.exit(chiKiem && lech ? 1 : 0);
