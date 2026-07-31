# Plan Phase 6 — Hợp Nhất Design System (6A → 6E)

> **Ngày:** 2026-07-30 · **Repo:** `biathaytu-web` · **Branch:** `feature/age-verification-and-compliance` (HEAD `ee829ea`)
> **Quyết định đã chốt bởi chủ dự án:** lấy **hệ SÁNG** (đá ấm `#F4F1E9` + xanh rừng `#2F5D3A`) làm chuẩn duy nhất; dải tối vẫn được dùng nhưng **có chủ đích**, như một nhịp trong hệ sáng.
> **Tài liệu liên quan:** `2026-07-29-ui-functionality-audit-report.md` (mục P1.4, P1.10), `2026-07-29-ui-functionality-implementation-plan.md` (Phase 6 phác thảo)
> **Prompt giao Antigravity (chỉ 6A–6C):** `2026-07-30-antigravity-prompt-phase6a-6c.md`

---

## 0. Hiện trạng đo được (2026-07-30)

| Chỉ số | Giá trị |
|---|---|
| `src/app/web.css` | **5.802 dòng**, **749** `!important` |
| Trang dùng hệ **tối** | **4**: `.weissbier-landing` (443 dòng CSS), `.bitburger-landing` (558), `.biaduc-landing` (330), `.uudai-landing` (277) — tổng **~1.608 dòng**, tất cả `background: #070b12 !important` + chữ trắng + vàng `#d4af37` |
| Trang dùng hệ **sáng** | **29** (trang chủ, catalog, mọi PDP, giỏ/checkout, 7 chính sách, kiến thức, 47 bài viết…) |
| Literal màu cũ trong **hệ dùng chung** | **27** (vàng/nâu/kem/wine) + **24** shadow tint navy = **51** |
| Literal màu trong **4 landing** | **96** (`d4af37` ×39, `f3e5ab` ×23, `070b12` ×30, `0b0f19` ×3, `0b2240` ×1) |
| Token `--web-*` đang dùng | **38** tên khác nhau, ~**506** lượt dùng cho riêng `--web-gold*` + `--web-navy*` |
| Ảnh catalog | **10** `.jpg` nội bộ (không thể trong suốt → nền trắng) + **19** hotlink CDN + 5 png chưa rõ · **0** ảnh tách nền |
| Dải tối **đã có sẵn** trong hệ sáng | `.hero-dark`, `.usp-bar`, `.b2b-section`, `.product-guarantee`, `.knowledge-hero`, `.web-footer` |

**Vì sao chọn hệ sáng (ghi lại để không phải tranh luận lại):**
1. **0/34 ảnh catalog được tách nền.** Nền `#070b12` sẽ hiện ra 34 hộp trắng. Đi hệ tối = phải làm lại toàn bộ bộ ảnh trước — việc đắt nhất của Phase 7.
2. Toàn bộ **phễu chuyển đổi** (trang chủ → catalog → PDP → giỏ → checkout) đang sáng. Landing tối → PDP sáng tạo cú giật màu đúng lúc khách sẵn sàng mua nhất.
3. Đá ấm + xanh rừng khớp câu chuyện *tu viện Ettal / Reinheitsgebot / 4 nguyên liệu*. Đen + vàng kim là ngôn ngữ của spirits & club, khác hạng mục.
4. Sửa tương phản WCAG ở hệ sáng làm được ở tầng token; hệ tối + vàng kim là bãi mìn tương phản.

---

## 1. Nguyên tắc bắt buộc

1. **6A không được làm đổi một pixel nào.** Đây là đổi tên token, giá trị giữ nguyên tuyệt đối. Nếu ảnh trước/sau khác nhau → làm sai.
2. **Thay thế token theo thứ tự tên DÀI TRƯỚC.** `--web-gold-light` phải được thay **trước** `--web-gold`, nếu không `--web-gold` sẽ khớp vào tiền tố của `--web-gold-light` và tạo ra `--web-accent-light` sai lệch. Đây là cái bẫy nguy hiểm nhất của cả Phase 6.
3. **Không xoá `!important` trong Phase 6.** Nó là việc riêng, làm sau, theo lô nhỏ có review thị giác. Phase này chỉ đổi *giá trị màu*, không đổi *độ ưu tiên*.
4. **Không chạm vùng dòng `3774–5400`** (4 landing) trong 6A/6B/6C. Vùng đó dành riêng cho 6E.
5. **Mỗi bước một commit**, message tiếng Việt.

**Lệnh verify sau mỗi bước — cả 4 phải xanh:**

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

---

# 6A — Token nói đúng sự thật + `DESIGN.md` thành nguồn duy nhất

**Vấn đề:** tên token đang nói dối, và đó là nguyên nhân gốc của mọi lỗi màu còn sót.

```css
--web-gold: #2F5D3A;        /* ← xanh rừng, KHÔNG phải vàng */
--web-gold-dark: #2F5D3A;   /* ← xanh */
--web-navy: #14241A;        /* ← xanh-đen, KHÔNG phải navy */
```

Ai đọc `--web-gold` cũng sẽ code ra màu vàng. Đó chính là cách `.btn-primary:hover → #5c4a00` (nâu) và `.icon-circle-gold` (nền vàng, viền xanh) tồn tại tới hôm nay.

## 6A.1 — Bảng đổi tên (1:1, giá trị KHÔNG đổi)

Thay theo **đúng thứ tự này** (dài → ngắn):

| # | Tên cũ | Tên mới | Giá trị (giữ nguyên) |
|---|---|---|---|
| 1 | `--web-gold-light` | `--web-accent-soft` | `#4A7D55` |
| 2 | `--web-gold-dark` | `--web-accent-strong` | `#2F5D3A` |
| 3 | `--web-gold-hover` | `--web-accent-hover` | `#264C30` |
| 4 | `--web-gold-bg` | `--web-accent-bg` | `#E4DFCF` |
| 5 | `--web-gold` | `--web-accent` | `#2F5D3A` |
| 6 | `--web-navy-light` | `--web-ink-soft` | `#2A3E31` |
| 7 | `--web-navy` | `--web-ink` | `#14241A` |

Phạm vi: `src/app/web.css` **và** mọi `.tsx` có `var(--web-gold…)` / `var(--web-navy…)` trong inline style.

## 6A.2 — Token mới bổ sung

Thêm vào khối `.web-app` (chưa dùng ở 6A, sẽ dùng ở 6B/6D):

```css
  /* Dùng cho chữ/link đặt trên dải tối (--web-ink) */
  --web-on-ink: #F4F1E9;          /* 14.2:1 trên --web-ink */
  --web-on-ink-muted: #B9C4BC;    /*  9.0:1 trên --web-ink */
  --web-accent-on-ink: #8FBF9C;   /*  7.8:1 trên --web-ink */

  /* Vàng DI SẢN — chỉ dùng cho badge giải thưởng iTQi và mốc 1330.
     TUYỆT ĐỐI không dùng cho CTA, link, hay nền lớn. */
  --web-heritage: #8B6914;
```

## 6A.3 — Gỡ alias trùng giá trị (giữ hay bỏ)

Ba token này trùng hoàn toàn giá trị với token khác:

| Alias | Trùng với | Xử lý |
|---|---|---|
| `--web-cream: #F4F1E9` | `--web-bg` | Giữ, ghi chú "alias của `--web-bg`" trong DESIGN.md |
| `--web-star: #4A7D55` | `--web-accent-soft` | Giữ (ngữ nghĩa riêng: màu sao rating) |
| `--web-wine: #4B5A50` | `--web-text-secondary` | Giữ (ngữ nghĩa riêng: dòng vang) |

**Không đổi giá trị, không xoá** — chỉ ghi chú. Xoá alias là việc của Phase khác.

## 6A.4 — Viết lại `DESIGN.md` thành nguồn sự thật duy nhất

`DESIGN.md` hiện **tự mâu thuẫn 3 chiều**: frontmatter ghi `Be Vietnam Pro`; phần văn bản bên dưới vẫn nói Gold `#B8860B` + Navy `#0D1B2A` + `Playfair Display`; code thực tế nạp **Inter + Playfair**.

Sửa:
- **`typography` trong frontmatter** phải khớp `src/app/layout.tsx`: `sans: "Inter"`, `serif: "Playfair Display"`, `heading-font: "Playfair Display"`.
- **`colors` trong frontmatter** phải khớp đúng token mới của `web.css`.
- **Viết lại toàn bộ phần văn bản** (Overview → Do/Don't): thay mọi mô tả Gold/Navy/Warm White bằng hệ đá ấm + xanh rừng. Bổ sung mục **"Dải tối dùng có chủ đích"** liệt kê 6 vùng được phép dùng nền `--web-ink`: `.hero-dark`, `.usp-bar`, `.b2b-section`, `.product-guarantee`, `.knowledge-hero`, `.web-footer` — kèm quy tắc: chữ trên dải tối dùng `--web-on-ink` / `--web-on-ink-muted`, link dùng `--web-accent-on-ink`.
- Giữ nguyên quy tắc "target ≥ 44px" và "không inline style" (đã đúng).

## 6A.5 — Test

Tạo `src/app/design-tokens.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CSS = fs.readFileSync(path.join(ROOT, 'src/app/web.css'), 'utf8');
const DESIGN = fs.readFileSync(path.join(ROOT, 'DESIGN.md'), 'utf8');
const LAYOUT = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8');

/** Trích khối token trong `.web-app { ... }` đầu tiên. */
function definedTokens(): Map<string, string> {
  const start = CSS.indexOf('.web-app {');
  const end = CSS.indexOf('}', start);
  const block = CSS.slice(start, end);
  const map = new Map<string, string>();
  for (const m of block.matchAll(/(--web-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(m[1], m[2].trim());
  }
  return map;
}

/** Mọi token được dùng qua var(--web-…) trong toàn bộ src/. */
function usedTokens(): Set<string> {
  const used = new Set<string>();
  (function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(e.name)) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/var\((--web-[a-z0-9-]+)/g)) used.add(m[1]);
      }
    }
  })(path.join(ROOT, 'src'));
  return used;
}

describe('design tokens', () => {
  it('KHÔNG còn token nói dối tên (--web-gold*, --web-navy*)', () => {
    const liars = [...definedTokens().keys(), ...usedTokens()]
      .filter((t) => /^--web-(gold|navy)/.test(t));
    expect([...new Set(liars)]).toEqual([]);
  });

  it('mọi token được dùng đều đã được định nghĩa (bắt lỗi đổi tên sai/gõ sai)', () => {
    const defined = definedTokens();
    const orphans = [...usedTokens()].filter((t) => !defined.has(t));
    expect(orphans).toEqual([]);
  });

  it('DESIGN.md khai đúng font đang nạp trong layout.tsx', () => {
    expect(LAYOUT).toContain('Inter');
    expect(LAYOUT).toContain('Playfair_Display');
    const fm = DESIGN.slice(0, DESIGN.indexOf('---', 4));
    expect(fm).toMatch(/sans:\s*"Inter/);
    expect(fm).toMatch(/serif:\s*"Playfair Display/);
    expect(fm).not.toMatch(/Be Vietnam Pro/);
  });

  it('DESIGN.md khai đúng màu chủ đạo của web.css', () => {
    const defined = definedTokens();
    const fm = DESIGN.slice(0, DESIGN.indexOf('---', 4));
    for (const [token, expected] of [
      ['--web-accent', 'primary'],
      ['--web-bg', 'background'],
      ['--web-text', 'text-main'],
      ['--web-border', 'border'],
    ] as const) {
      const value = defined.get(token)!;
      expect(fm.toLowerCase(), `DESIGN.md thiếu ${expected}: ${value}`).toContain(value.toLowerCase());
    }
  });

  it('phần văn bản DESIGN.md không còn mô tả hệ Gold/Navy cũ', () => {
    const body = DESIGN.slice(DESIGN.indexOf('---', 4));
    for (const stale of ['B8860B', '0D1B2A', '722F37', 'FEFCF8', 'Deep Navy', 'Gold gradients']) {
      expect(body, `còn sót "${stale}"`).not.toContain(stale);
    }
  });
});
```

## 6A.6 — Verify

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
grep -rn -- "--web-gold\|--web-navy" src/ | wc -l    # phải = 0
```

**Bắt buộc kiểm thị giác:** chụp ảnh `/`, `/san-pham`, `/dat-hang` trước và sau. Phải **giống hệt nhau**. 6A là đổi tên, không phải đổi thiết kế.

---

# 6B — Sửa 6 lỗi tương phản WCAG AA ở tầng token

Tất cả tỉ lệ dưới đây tôi đã tính bằng công thức WCAG 2.1 (relative luminance).

| # | Selector | Hiện tại | Tỉ lệ | Sửa thành | Tỉ lệ mới |
|---|---|---|---|---|---|
| 1 | `.web-app .footer-links a` (dòng 3245, 5765) + `.web-app .web-footer .footer-links a` | `#4A7D55` trên `#14241A` | **3.36** ❌ | `var(--web-accent-on-ink)` = `#8FBF9C` | **7.79** ✅ |
| 2 | `.web-app .footer-brand` (dòng 1864) | `#4A7D55` trên `#14241A`, 18px/700 | **3.36** ❌ | `var(--web-accent-on-ink)` | **7.79** ✅ |
| 3 | `.web-app .footer-18-badge` (dòng 1893) | `#EF4444` trên `#14241A`, **font 8px** | **4.30** ❌ | nền `var(--web-bg)` + chữ `var(--web-ink)`, `font-size: 12px`, `min-width/height: 22px` | **14.19** ✅ |
| 4 | `.web-app .disclaimer-text` (dòng 1650) — **cảnh báo 18+ bắt buộc** | `--web-text-muted` `#5D6B61` trên `#E9E5D8` | **4.45** ❌ | `var(--web-text-secondary)` = `#4B5A50` | **5.79** ✅ |
| 5 | `.web-app .p-body` (dòng 2794) — body copy mọi `.section-alt` | `#5D6B61` trên `#E9E5D8` | **4.45** ❌ | `var(--web-text-secondary)` | **5.79** ✅ |
| 6 | `.web-app .tab-count` (dòng 2981) | `#5D6B61` trên `#E4DFCF` | **4.21** ❌ | `var(--web-text-secondary)` | **5.48** ✅ |

> Ghi chú #4: cảnh báo pháp lý 18+ hiện là **chữ khó đọc nhất trên site**. Sửa mục này quan trọng hơn thẩm mỹ.
> Ghi chú #3: chữ 8px là quá nhỏ cho một badge pháp lý, bất kể tương phản.

## 6B.1 — Test (đo tỉ lệ thật, không grep)

Tạo `src/app/contrast.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const CSS = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8');

function tokens(): Record<string, string> {
  const start = CSS.indexOf('.web-app {');
  const block = CSS.slice(start, CSS.indexOf('}', start));
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/(--web-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) out[m[1]] = m[2];
  return out;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function ratio(fg: string, bg: string): number {
  const [a, b] = [luminance(fg), luminance(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('tương phản WCAG AA của các cặp màu token', () => {
  const T = tokens();
  const CASES: Array<{ name: string; fg: string; bg: string; min: number }> = [
    { name: 'link footer trên dải tối', fg: '--web-accent-on-ink', bg: '--web-ink', min: 4.5 },
    { name: 'chữ thường trên dải tối', fg: '--web-on-ink-muted', bg: '--web-ink', min: 4.5 },
    { name: 'chữ chính trên dải tối', fg: '--web-on-ink', bg: '--web-ink', min: 4.5 },
    { name: 'body copy trên section-alt', fg: '--web-text-secondary', bg: '--web-bg-section', min: 4.5 },
    { name: 'body copy trên bg-warm', fg: '--web-text-secondary', bg: '--web-bg-warm', min: 4.5 },
    { name: 'chữ chính trên nền trang', fg: '--web-text', bg: '--web-bg', min: 4.5 },
    { name: 'accent trên nền trang', fg: '--web-accent-strong', bg: '--web-bg', min: 4.5 },
  ];

  it.each(CASES)('$name ≥ $min:1', ({ fg, bg, min }) => {
    expect(T[fg], `thiếu token ${fg}`).toBeTruthy();
    expect(T[bg], `thiếu token ${bg}`).toBeTruthy();
    expect(+ratio(T[fg], T[bg]).toFixed(2)).toBeGreaterThanOrEqual(min);
  });

  it('không selector nào còn dùng --web-text-muted trên nền section-alt/bg-warm', () => {
    for (const sel of ['.web-app .p-body', '.web-app .disclaimer-text', '.web-app .tab-count']) {
      const i = CSS.indexOf(sel + ' ');
      expect(i, `không tìm thấy ${sel}`).toBeGreaterThan(-1);
      const block = CSS.slice(i, CSS.indexOf('}', i));
      expect(block, `${sel} vẫn dùng --web-text-muted`).not.toContain('--web-text-muted');
    }
  });

  it('badge 18+ ở footer có font ≥ 12px', () => {
    const i = CSS.indexOf('.web-app .footer-18-badge');
    const block = CSS.slice(i, CSS.indexOf('}', i));
    const size = Number((block.match(/font-size:\s*(\d+)px/) ?? [])[1]);
    expect(size).toBeGreaterThanOrEqual(12);
  });
});
```

## 6B.2 — Verify

Ngoài 4 lệnh, chạy đo trực tiếp trên trang bằng script tương phản trong **mục 4 của báo cáo audit** (`2026-07-29-ui-functionality-audit-report.md`) trên `/`, `/san-pham`, `/dat-hang` → phải trả về **mảng rỗng**.

---

# 6C — Dọn 51 literal màu cũ trong hệ dùng chung

**Không chạm vùng dòng 3774–5400** (4 landing — để 6E).

## 6C.1 — 27 literal màu hiển thị (bắt buộc sửa)

| Dòng | Hiện tại | Sửa thành | Vì sao |
|---|---|---|---|
| 516 | `box-shadow: 0 4px 15px rgba(115, 92, 0, .25)` | `rgba(47, 93, 58, .25)` | shadow ô-liu dưới nút xanh |
| 521 | `background: #5c4a00` (hover `.btn-primary`) | `var(--web-accent-hover)` | **nút CTA chính hover đổi từ xanh sang nâu** |
| 523 | `rgba(115, 92, 0, .35)` | `rgba(47, 93, 58, .35)` | |
| 449, 457 | `border/border-color: rgba(218,165,32, …)` (`.glass-card-dark`) | `rgba(47, 93, 58, …)` | viền vàng trên site xanh |
| 489 | `linear-gradient(… rgba(218,165,32,.2) … .05))` (`.icon-circle-gold`) | gradient từ `rgba(47,93,58,.18)` → `rgba(47,93,58,.04)`; **đổi tên class → `.icon-circle-accent`** | nền vàng + viền xanh |
| 1068 | `border-color: rgba(218,165,32,.6)` | `rgba(47, 93, 58, .6)` | |
| 1138 | `background: rgba(218,165,32,.05)` | `rgba(47, 93, 58, .05)` | |
| 2229 | `radial-gradient(… rgba(218,165,32,.15) …)` | `rgba(47, 93, 58, .15)` | |
| 841, 865, 1334, 2097, 2105 | `rgba(184, 134, 11, …)` (glow/nền/viền vàng) | `rgba(47, 93, 58, …)` cùng alpha | 5 chỗ |
| 148 | `background-color: rgba(253, 252, 240, .88)` (`.web-header--solid`) | `rgba(244, 241, 233, .88)` | header trắng-kem lệch nền đá ấm |
| 665 | `background: rgba(254, 252, 248, .96)` (`.mobile-bottom-nav`) | `rgba(244, 241, 233, .96)` | nav trắng hơn trang |
| 666 | `border-top: 1px solid rgba(232, 227, 218, .9)` | `rgba(207, 201, 182, .9)` (= `--web-border`) | |
| 435 | `border-color: rgba(114, 47, 55, .08)` (`.wine-card`) | `rgba(75, 90, 80, .08)` (= `--web-wine`) | |
| 144 | gradient `rgba(10, 22, 40, …)` (`.web-header--transparent`) | `rgba(20, 36, 26, …)` | |

> Chỗ nào dùng được `var(--web-*)` thì ưu tiên biến; chỗ cần alpha thì dùng `rgba()` của **đúng giá trị token** (`#2F5D3A` = `47,93,58`; `#14241A` = `20,36,26`; `#F4F1E9` = `244,241,233`; `#CFC9B6` = `207,201,182`).

**Đổi tên class `.icon-circle-gold` → `.icon-circle-accent`** và cập nhật nơi dùng (`src/app/(web)/page.tsx`). Tên class cũng không được nói dối.

## 6C.2 — 24 shadow tint navy (nên sửa, rủi ro thấp)

`rgba(10, 22, 40, …)` ×11 và `rgba(13, 27, 42, …)` ×13 — bóng đổ pha navy trên site xanh. Thay toàn bộ thành `rgba(20, 36, 26, …)` (giữ nguyên alpha và offset).

**Ngoại lệ — giữ nguyên, không đổi:** các `rgba(13, 27, 42, …)` trong `.floating-zalo-cta` / `.floating-phone-cta` / `.floating-messenger-cta` (dòng 583, 593, 597, 606, 610, 619, 623). Đó là bóng của nút thương hiệu Zalo/Messenger/điện thoại — màu của bên thứ ba, không thuộc hệ màu site.

## 6C.3 — Test

Tạo `src/app/legacy-palette.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const CSS = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8').split('\n');

/** Vùng CSS của 4 landing — miễn trừ ở 6C, sẽ dọn ở 6E. */
const LANDING_START = CSS.findIndex((l) => l.includes('.weissbier-landing {'));
const LANDING_END = CSS.findIndex((l) => l.includes('.uudai-landing')) + 300;

/** Bóng của nút thương hiệu bên thứ ba (Zalo/Messenger/phone) — giữ nguyên. */
const THIRD_PARTY = /floating-(zalo|phone|messenger|contact)/;

function offendingLines(pattern: RegExp): string[] {
  const out: string[] = [];
  let inThirdParty = false;
  CSS.forEach((line, i) => {
    if (/^\.web-app \./.test(line) || /^\.[a-z]/.test(line)) inThirdParty = THIRD_PARTY.test(line);
    if (i >= LANDING_START && i <= LANDING_END) return;
    if (inThirdParty) return;
    if (pattern.test(line)) out.push(`${i + 1}: ${line.trim()}`);
  });
  return out;
}

describe('hệ dùng chung không còn literal palette cũ', () => {
  it('không còn vàng/nâu cũ', () => {
    expect(offendingLines(/#5c4a00|#B8860B|#DAA520|rgba\(115,\s*92,\s*0|rgba\(218,\s*165,\s*32|rgba\(184,\s*134,\s*11/i)).toEqual([]);
  });

  it('không còn trắng-kem cũ', () => {
    expect(offendingLines(/rgba\(254,\s*252,\s*248|rgba\(253,\s*252,\s*240|#FEFCF8|rgba\(232,\s*227,\s*218/i)).toEqual([]);
  });

  it('không còn navy/wine cũ', () => {
    expect(offendingLines(/rgba\(10,\s*22,\s*40|rgba\(13,\s*27,\s*42|rgba\(114,\s*47,\s*55|#0D1B2A|#722F37/i)).toEqual([]);
  });

  it('không còn class nói dối tên màu', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8');
    expect(src).not.toContain('icon-circle-gold');
    expect(src).not.toContain('icon-circle-navy');
  });
});
```

## 6C.4 — Verify

4 lệnh xanh + **chụp ảnh so sánh** `/` (hero, USP bar, B2B section, footer), `/san-pham` (card + tab), `/dat-hang` (nút submit, focus ring input). Chỉ được thay đổi những chỗ nêu trong bảng — nút CTA hover phải là **xanh đậm**, không còn nâu.

---

# 6D — Thống nhất lớp "chen ngang" *(cần mắt người — KHÔNG giao Antigravity)*

Đây là những thứ **đầu tiên** mọi khách nhìn thấy, và đang lệch hệ nặng nhất. Không có test nào đo được "đúng thương hiệu", nên bước này phải làm với review thị giác từng commit.

| Thành phần | Màu đang dùng | Mục tiêu |
|---|---|---|
| `AgeVerificationGate.tsx` | `#070b12`, `#0f172a`, `#1e293b`, `#334155`, `#fbbf24`, `#d97706`, `#94a3b8`, `#cbd5e1`, `#ef4444` (slate + amber) | Nền `--web-ink`, thẻ `--web-ink-soft`, tiêu đề `--web-on-ink`, phụ đề `--web-on-ink-muted`, nút chính `--web-accent`, viền `rgba(244,241,233,.14)` |
| `CookieConsent.tsx` | cùng họ slate + amber | như trên |
| `FootballCampaignPopup` (CSS 3327–3499) | `#d4af37`, `#f3e5ab`, `#0b0f19`, `#0b2240` | `--web-accent` / `--web-ink`; `.button-gold-pulse` → `.button-accent-pulse` |
| `/chua-du-tuoi` (`(bare)`) | `#0f172a`, `#1e293b`, `#fbbf24`, `#f59e0b` | như cổng tuổi |
| `AlcoholWarning.tsx` | **5 variant, 5 bộ màu không liên quan**: `#0d1117`/`#f1c40f`, `#fff9e6`/`#d97706`, `rgba(243,156,18)`, `#161b22`/`#e6edf3` | 5 class trong `web.css` dùng **cùng** token. Đồng thời: đổi `role="alert"` → `role="note"` cho banner tĩnh; xoá `minHeight: '10%'` (CSS vô nghĩa) |
| `dat-hang/page.tsx` inline | `#1e293b`, `#64748b`, `#f8fafc`, `#e2e8f0`, `#d97706`, `#fff9e6`, `#92400e`, `red` | Chuyển sang class trong `web.css` + token. Dấu `*` bắt buộc dùng `--web-red`, không dùng `red` |

**Thứ tự đề xuất:** cổng tuổi → cookie banner → `/chua-du-tuoi` → `AlcoholWarning` → popup → checkout. Mỗi thành phần một commit, kèm ảnh trước/sau.

Ràng buộc kỹ thuật cần giữ: cổng tuổi `z-index 99999`, cookie `9999`, toast `9998`, popup `9000`, bottom nav `46`, header `50` — **không đổi thứ tự lớp**, nếu không sẽ tái phát lỗi P0.1 (popup che cổng tuổi).

---

# 6E — Chuyển 4 landing sang thân sáng + hero tối *(cần mắt người — KHÔNG giao Antigravity)*

| Wrapper | Trang | Vùng CSS | Số dòng |
|---|---|---|---|
| `.weissbier-landing` | `/benediktiner-weissbier-naturtrub` | 3774–4217 | 443 |
| `.bitburger-landing` | `/bitburger-premium-pils` | 4223–4781 | 558 |
| `.biaduc-landing` | `/bia-duc-nhap-khau` | 4787–5117 | 330 |
| `.uudai-landing` | `/nhan-uu-dai` | 5123–5400 | 277 |

**Cách làm cho từng trang (một commit / trang):**

1. Bỏ `background-color: #070b12 !important; color: #ffffff !important` ở wrapper → trang thừa hưởng nền sáng của `.web-app`.
2. Giữ **hero** tối bằng cách dùng lại `.hero-dark` (đã có) thay vì hero riêng.
3. Xoá phần CSS đang **cài lại** những thứ hệ chung đã có, đổi sang class dùng chung:
   - card sản phẩm → `.product-card-v2`
   - nút → `.btn-primary` / `.btn-outline`
   - tiêu đề mục → `.section-label` + `.section-title` + `.section-divider` (hoặc component `SectionHeader`)
   - grid → `.grid-featured-products` / `.split-section`
   - dải thống kê → `.stat-card`
4. Phần **thật sự riêng** của trang (ví dụ `.weissbier-ritual-num`, `.bitburger-timeline`) thì giữ, nhưng đổi màu sang token.
5. Vàng `#d4af37` → `--web-accent`; chỉ giữ `--web-heritage` cho badge giải thưởng iTQi và mốc 1330.

**Kỳ vọng:** xoá được khoảng **1.200 trong 1.608 dòng**, vì phần lớn là trùng lặp hệ chung.

**Bắt buộc:** mỗi commit kèm ảnh trước/sau ở cả desktop 1280 và mobile 375. Sau mỗi trang, chạy script đo tương phản của mục 4 báo cáo audit trên đúng trang đó → phải rỗng.

---

## Phân công

| Bước | Giao được cho Antigravity? | Vì sao |
|---|---|---|
| **6A** | ✅ Có | Đổi tên máy móc, có test kiểm token parity + DESIGN.md |
| **6B** | ✅ Có | Tỉ lệ tương phản là số, test tính được |
| **6C** | ✅ Có | `grep` literal = 0 là tiêu chí khách quan |
| **6D** | ❌ Không | "Đúng thương hiệu" không có test. Cần review thị giác từng commit |
| **6E** | ❌ Không | Như trên, cộng thêm rủi ro hồi quy layout trên 4 trang SEO priority 0.9 |

Prompt cho 6A–6C: `2026-07-30-antigravity-prompt-phase6a-6c.md`.

---

## Định nghĩa "xong" cho 6A–6C

- [ ] `npm test && npx next build && npx eslint . && npx tsc --noEmit` — cả 4 xanh
- [ ] `grep -rn -- "--web-gold\|--web-navy" src/` → **0 dòng**
- [ ] Mọi `var(--web-…)` được dùng đều có định nghĩa (test token parity xanh)
- [ ] `DESIGN.md` frontmatter khớp `web.css` + khớp font trong `layout.tsx`; phần văn bản không còn `B8860B`/`0D1B2A`/`Deep Navy`
- [ ] Script đo tương phản trên `/`, `/san-pham`, `/dat-hang` → **mảng rỗng**
- [ ] `.footer-18-badge` font ≥ 12px
- [ ] `.p-body`, `.disclaimer-text`, `.tab-count` không còn dùng `--web-text-muted`
- [ ] `grep -c "5c4a00"` = 0; không còn `rgba(218,165,32` / `rgba(184,134,11` / `rgba(115,92,0` ngoài vùng landing
- [ ] `.icon-circle-gold` / `.icon-circle-navy` đã đổi tên; nơi dùng trong `.tsx` đã cập nhật
- [ ] Nút `.btn-primary` hover là **xanh đậm**, không còn nâu `#5c4a00`
- [ ] Ảnh `/`, `/san-pham`, `/dat-hang` sau 6A **giống hệt** trước 6A
- [ ] `web.css` vẫn còn **749** `!important` (Phase 6 không dọn `!important`)

## Ngoài phạm vi — tuyệt đối không chạm

Vòng 1–3 (đơn hàng, cổng tuổi, checkout a11y, catalog, SEO, SKU ẩn) đã kiểm chứng đạt. Phase 7 (i18n, bộ ảnh nội bộ thay 19 ảnh hotlink, sanitize `ArticleBody`, 3 slug hỏng, thứ tự heading, form liên hệ, giới hạn mã giảm giá, dọn 749 `!important`) — xem `2026-07-29-ui-functionality-implementation-plan.md`.
