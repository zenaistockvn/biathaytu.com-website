# SEO + GEO — Plan Thực Thi Hợp Nhất (Antigravity)

> **For agentic workers (Antigravity / Claude / bất kỳ agent nào):** Plan ĐỘC LẬP. Làm **tuần tự từng Phase → từng Task**, mỗi Task theo TDD nhỏ (test → fail → code → pass → commit) khi áp dụng được. Dùng checkbox `- [ ]`. Chỉ qua Task sau khi Task hiện tại `npx tsc --noEmit` + test xanh và đã commit.

**Goal:** Sửa lỗi SEO kỹ thuật và GEO để AI (ChatGPT, Perplexity, Google AI Overview, Gemini, Claude) **tin tưởng, trích dẫn và đề xuất** biathaytu.com chính xác.

**Architecture:** Phase 1 (P0) + Phase 2 (P1 cốt lõi) **kế thừa nguyên văn** plan đã có `docs/superpowers/plans/2026-06-14-seo-geo-fixes.md` (Task 1–12) — KHÔNG viết lại code đã có ở đó. Phase 3 (bổ sung) là các Task **MỚI** chỉ có trong plan này, phát hiện từ audit 2026-06-16. Đọc kèm báo cáo chẩn đoán `docs/superpowers/plans/2026-06-16-seo-geo-audit-report.md`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Vitest 4. KHÔNG thêm thư viện mới.

---

## NAP chuẩn (đã được chủ sở hữu xác nhận — dùng XUYÊN SUỐT)
- **Tên:** Bia Thầy Tu
- **Địa chỉ:** 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội
- **Hotline/Zalo:** 0899.191.313  (E.164: `+84899191313`)
- **Email:** info@biathaytu.com
- **Website:** https://www.biathaytu.com

> ⚠️ Mọi "218 Đội Cấn…" đều SAI. Mọi "+84 915 312 166" / "+84-915-312-166" / "0915312166" đều là số CŨ, phải bỏ.

## 🔧 Cần con người chuẩn bị trước (một số Task Phase 3 cần dữ liệu thật)
- **BS-4 (LocalBusiness):** toạ độ GPS chính xác của showroom 659A Lạc Long Quân (lấy từ Google Maps); giờ mở/đóng cửa thật.
- **BS-6 (vang):** nồng độ cồn (`abv`) thật của 9 chai vang (vang Đức Riesling thường 11–12.5%).
- **BS-7 (GSC):** token xác minh Google Search Console (hoặc file HTML xác minh).
- Nếu chưa có dữ liệu, **bỏ qua Task đó** và để lại checkbox trống — KHÔNG bịa số liệu.

---

## PHASE 1 — P0: Sai sự thật & mâu thuẫn (BẮT BUỘC, làm trước)

> **Nguồn code:** `docs/superpowers/plans/2026-06-14-seo-geo-fixes.md`. Thực thi nguyên văn theo từng Step trong đó.

- [ ] **Task 1** (plan cũ) — Tạo `src/lib/seo/business.ts` + test: `BUSINESS` (NAP chuẩn) + `getBrandInfo()` (suy brand động: Bitburger/Köstritzer/vang/Benediktiner).
- [ ] **Task 2** (plan cũ) — Tạo `src/lib/seo/productPricing.ts` + test: `getPriceRange()` (khoảng giá dòng SKU từ `products.json`).
- [ ] **Task 3** (plan cũ) — `JsonLd.tsx`: Organization schema dùng `BUSINESS` (địa chỉ 659A + phone `+84899191313`); sửa địa chỉ trong FAQ answer; tách `getFaqSchema()` generic. → **Xử lý P0.1 (schema) + P0.2 (số ĐT trong JsonLd)**.
- [ ] **Task 4** (plan cũ) — `getProductSchema`: brand động qua `getBrandInfo`, `manufacturer`/`award`/`Reinheitsgebot` chỉ khi đúng, hỗ trợ `AggregateOffer`. → **Xử lý P0.3 + P1.1**.
- [ ] **Task 5** (plan cũ) — `san-pham/[slug]/page.tsx`: truyền `category` vào `getProductSchema`.
- [ ] **Task 6** (plan cũ) — 4 landing sản phẩm (`benediktiner-weissbier-naturtrub`, `benediktiner-dunkel`, `bom-bia-5l-benediktiner`, `bitburger-premium-pils`): thêm `getPriceRange` + `AggregateOffer`.
- [ ] **Task 7** (plan cũ) — Đồng bộ text "659A Lạc Long Quân" ở `ve-chung-toi`, `bia-thay-tu-la-gi`, `mua-bia-benediktiner-chinh-hang`, `lien-he`, `page.tsx` (FAQ homepage). → **Xử lý phần còn lại của P0.1**.
- [ ] **Task 8** (plan cũ) — `llms.txt/route.ts`: bỏ số cũ; `git rm public/llms.txt`. → **Xử lý P0.2 (llms) + P1.6 (gộp nguồn)**.

**Verify cuối Phase 1:**
```bash
git grep -n "218 Đội Cấn" -- "src/"
git grep -nE "915[\s.-]?312[\s.-]?166" -- "src/" "public/"
```
Cả hai phải KHÔNG còn kết quả. Rồi: `npm run test && npx tsc --noEmit`.

---

## PHASE 2 — P1 cốt lõi (cannibalization + freshness + FAQ landing)

- [ ] **Task 9** (plan cũ) — `sitemap.ts`: hằng `CONTENT_LAST_UPDATED` thay `new Date()` cho base + landing. → **P1.2**.
- [ ] **Task 10** (plan cũ) — Phân hóa intent + cross-link 2 trang Benediktiner (đổi title `bia-benediktiner-chinh-hang` → "Bia Benediktiner Chính Hãng Là Gì? Cách Nhận Biết Hàng Thật"). → **P1.4** (đồng thời rút title trang này xuống ~57 ký tự, nên **BS-3 KHÔNG đụng trang này nữa**).
- [ ] **Task 11** (plan cũ) — Thêm visible FAQ + `FAQPage` schema cho `bia-thay-tu-la-gi` + `food-pairing-bia-duc`. → **P2.3 (một phần)**.
- [ ] **Task 12** (plan cũ) — Verify toàn diện (test + tsc + build).

---

## PHASE 3 — Task BỔ SUNG (MỚI — chỉ có trong plan này)

> Code đầy đủ ngay dưới. Làm sau khi Phase 1–2 xanh.

### Task BS-1: Khóa regression số hotline cũ trên MỌI bề mặt SEO

**Files:** Modify `src/app/seo-regression.test.ts`

> Lý do: test hiện tại (`:96-102`) dùng regex `/091\.531\.2166|0915312166/` **không** khớp định dạng thật `+84-915-312-166` và chỉ quét 2 file. Sau Phase 1, code đã sạch số cũ; test này khóa để không tái phát + mở rộng phạm vi.

- [ ] **Step 1: Thay test "uses the current hotline in public metadata"**

Tìm khối (dòng ~96–102):
```ts
  it('uses the current hotline in public metadata', () => {
    const landing = readProjectFile('src/app/(web)/page.tsx');
    const contact = readProjectFile('src/app/(web)/lien-he/page.tsx');

    expect(`${landing}\n${contact}`).toContain('0899.191.313');
    expect(`${landing}\n${contact}`).not.toMatch(/091\.531\.2166|0915312166/);
  });
```
Thay bằng:
```ts
  it('uses the current hotline and never leaks the legacy number across SEO surfaces', () => {
    const surfaces = [
      'src/app/(web)/page.tsx',
      'src/app/(web)/lien-he/page.tsx',
      'src/app/(web)/components/JsonLd.tsx',
      'src/app/llms.txt/route.ts',
    ]
      .map(readProjectFile)
      .join('\n');

    expect(surfaces).toContain('0899.191.313');
    // Bắt mọi biến thể số cũ: 915 312 166 / 915-312-166 / 915.312.166 / 915312166
    expect(surfaces).not.toMatch(/915[\s.\-]?312[\s.\-]?166/);
  });
```

- [ ] **Step 2: Chạy** `npm run test -- src/app/seo-regression.test.ts` → Expected: PASS (vì Phase 1 đã dọn số cũ). Nếu FAIL → còn sót số cũ ở 1 trong 4 file, quay lại sửa.

- [ ] **Step 3: Commit**
```bash
git add src/app/seo-regression.test.ts
git commit -m "test(seo): lock legacy hotline out of all SEO surfaces"
```

---

### Task BS-2: Sửa root layout (title sai ngữ cảnh + thiếu metadataBase)

**Files:** Modify `src/app/layout.tsx`, `src/app/seo-regression.test.ts`

> Lý do: root metadata đang là "AMC × Bia Thầy Tu — AI Marketing Center" (tên công cụ nội bộ) và thiếu `metadataBase`. `(web)/layout` override cho trang công khai, nhưng root là default cho `not-found` toàn cục + mọi route tương lai ngoài `(web)`.

- [ ] **Step 1: Viết test fail trước** — thêm vào cuối `describe(...)` trong `seo-regression.test.ts`:
```ts
  it('root layout uses brand metadata, not the internal AMC tool name', () => {
    const rootLayout = readProjectFile('src/app/layout.tsx');

    expect(rootLayout).not.toContain('AI Marketing Center');
    expect(rootLayout).toContain('metadataBase');
  });
```

- [ ] **Step 2: Chạy cho fail** — `npm run test -- src/app/seo-regression.test.ts` → Expected: FAIL (chứa "AI Marketing Center", không có metadataBase).

- [ ] **Step 3: Sửa `src/app/layout.tsx`** — thay khối:
```ts
export const metadata: Metadata = {
  title: 'AMC × Bia Thầy Tu — AI Marketing Center',
  description: 'Hệ thống sản xuất content marketing thông minh cho Bia Thầy Tu — Premium German Beer',
};
```
bằng:
```ts
const BASE_URL = 'https://www.biathaytu.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Bia Thầy Tu — Bia Đức Nhập Khẩu Chính Hãng',
  description:
    'Bia Thầy Tu Benediktiner Weissbier — bia lúa mì Đức nhập khẩu chính hãng từ Tu Viện Ettal, Bavaria. Giao hàng toàn quốc.',
};
```

- [ ] **Step 4: Chạy cho pass + tsc** — `npm run test -- src/app/seo-regression.test.ts` (PASS), `npx tsc --noEmit` (0 lỗi).

- [ ] **Step 5: Commit**
```bash
git add src/app/layout.tsx src/app/seo-regression.test.ts
git commit -m "fix(seo): brand-correct root metadata + metadataBase fallback"
```

---

### Task BS-3: Rút gọn title > 60 ký tự (7 trang)

**Files:** Modify metadata của 7 page. → **P1.3**

> Mỗi title thường xuất hiện 1–3 nơi trong file (`metadata.title`, `openGraph.title`, `twitter.title`). **Trước khi sửa mỗi file, mở đọc block `export const metadata` để lấy chuỗi title hiện tại chính xác**, rồi thay ở TẤT CẢ vị trí trong file đó. `bia-benediktiner-chinh-hang` đã xử lý ở Task 10 — BỎ QUA.

- [ ] **Step 1:** `page.tsx` (homepage): `… — Bia Đức Nhập Khẩu Chính Hãng Từ Tu Viện Ettal` → **`Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng`** (54)
- [ ] **Step 2:** `bia-thay-tu-la-gi`: → **`Bia Thầy Tu Là Gì? Nguồn Gốc Bia Benediktiner Đức`** (49)
- [ ] **Step 3:** `ve-chung-toi`: → **`Về Bia Thầy Tu — Nhà Nhập Khẩu Bia Đức Độc Quyền`** (47)
- [ ] **Step 4:** `thuong-hieu`: → **`Câu Chuyện Thương Hiệu Bia Thầy Tu — 400 Năm Ủ Bia`** (50)
- [ ] **Step 5:** `bia-duc-cho-nha-hang-khach-san`: → **`Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)`** (41)
- [ ] **Step 6:** `bang-gia-si-dai-ly`: → **`Bảng Giá Sỉ & Đại Lý Phân Phối Bia Đức`** (39)
- [ ] **Step 7:** `bia-duc-nhap-khau`: → **`Bia Đức Nhập Khẩu — Weissbier, Pilsner, Dunkel`** (47)

- [ ] **Step 8: Verify + commit** — `npm run build` (thành công). Kiểm mắt: mỗi title ≤ 60 ký tự.
```bash
git add "src/app/(web)"
git commit -m "fix(seo): shorten 7 titles under 60 chars for full SERP display"
```

---

### Task BS-4: Thêm `LocalBusiness` (Store) schema

**Files:** Modify `src/app/(web)/components/JsonLd.tsx`, `src/app/(web)/layout.tsx`
**Phụ thuộc:** Task 1 (cần `BUSINESS`). **Cần dữ liệu người:** toạ độ GPS + giờ mở cửa thật.

- [ ] **Step 1:** Trong `JsonLd.tsx`, thêm `'localbusiness'` vào union `type` của `JsonLdProps`:
```ts
  type: 'organization' | 'product' | 'faq' | 'breadcrumb' | 'website' | 'article' | 'localbusiness';
```

- [ ] **Step 2:** Thêm hàm (sau `getOrganizationSchema`), **thay `__LAT__`/`__LNG__` bằng toạ độ thật, kiểm tra lại giờ mở cửa**:
```ts
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${BASE_URL}/#localbusiness`,
    name: BUSINESS.name,
    image: `${BASE_URL}/logo.jpg`,
    url: BASE_URL,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    priceRange: '100.000₫–2.500.000₫',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: { '@type': 'GeoCoordinates', latitude: __LAT__, longitude: __LNG__ },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '08:00',
      closes: '21:00',
    }],
    sameAs: ['https://zalo.me/0899191313'],
    parentOrganization: { '@id': `${BASE_URL}/#organization` },
  };
}
```

- [ ] **Step 3:** Trong `(web)/layout.tsx`, import + render cạnh các JsonLd hiện có:
```tsx
import JsonLd, { getOrganizationSchema, getWebsiteSchema, getLocalBusinessSchema } from './components/JsonLd';
```
```tsx
        <JsonLd type="localbusiness" data={getLocalBusinessSchema()} />
```

- [ ] **Step 4: Verify + commit** — `npx tsc --noEmit`; sau deploy/dev mở Google Rich Results Test cho `/` → có `Store` với địa chỉ 659A.
```bash
git add "src/app/(web)/components/JsonLd.tsx" "src/app/(web)/layout.tsx"
git commit -m "feat(seo): add LocalBusiness (Store) schema for showroom"
```

---

### Task BS-5: Internal linking cho trang mồ côi (P2.5) — định hướng nội dung

**Files:** Modify `ve-chung-toi`, `bia-duc-cho-nha-hang-khach-san`, `qua-tang-bia-duc`

> Đây là task nội dung/JSX, không có chuỗi find-replace cố định. Mục tiêu: mỗi trang dưới đây có ≥2 link nội bộ ngữ cảnh (dùng `<Link>` của `next/link` hoặc `<a href>` theo pattern sẵn có trong từng file). Đặt trong đoạn văn liên quan, anchor text giàu từ khóa.

- [ ] **Step 1:** `ve-chung-toi` → thêm link tới `/bang-gia-si-dai-ly` ("chính sách đại lý & báo giá sỉ") và `/chung-nhan-nhap-khau-chinh-hang` ("giấy tờ nhập khẩu chính hãng").
- [ ] **Step 2:** `bia-duc-cho-nha-hang-khach-san` → thêm link tới `/food-pairing-bia-duc` ("gợi ý food pairing cho thực đơn") và `/bang-gia-si-dai-ly`.
- [ ] **Step 3:** `qua-tang-bia-duc` → thêm link tới ≥2 sản phẩm cụ thể (`/san-pham/<slug>`, ví dụ bom 5L) hoặc `/san-pham`.
- [ ] **Step 4: Verify + commit** — `npm run build`.
```bash
git add "src/app/(web)"
git commit -m "fix(seo): add contextual internal links to orphan landing pages"
```

---

### Task BS-6: Bổ sung `abv` + `volume` cho 9 sản phẩm vang (P2.6)

**Files:** Modify `src/data/products.json`. **Cần dữ liệu người:** `abv` thật mỗi chai.

- [ ] **Step 1:** Với mỗi sản phẩm `"category": "vang"`, điền `"volume"` từ tên ("750ml" hoặc "1,5L" → `"1500ml"`) và `"abv"` (số thật do chủ shop cung cấp; nếu chưa có thì để nguyên `null`, KHÔNG bịa).
- [ ] **Step 2: Verify + commit** — `npm run test && npx tsc --noEmit` (data layer đọc OK).
```bash
git add src/data/products.json
git commit -m "data(seo): fill volume/abv for wine products"
```

---

### Task BS-7: Cấu hình Google Search Console (P2.8)

**Files:** Modify `src/app/(web)/layout.tsx`. **Cần dữ liệu người:** token GSC.

- [ ] **Step 1:** Khi có token, sửa khối `verification` (dòng ~66):
```ts
  verification: {
    google: 'DÁN_TOKEN_GSC_VÀO_ĐÂY',
  },
```
- [ ] **Step 2:** Sau deploy, trong GSC: verify domain + Submit sitemap `https://www.biathaytu.com/sitemap.xml`.
- [ ] **Step 3: Commit**
```bash
git add "src/app/(web)/layout.tsx"
git commit -m "feat(seo): add Google Search Console verification"
```

---

## NGOÀI PHẠM VI tự động (ghi nhận — cần quyết định riêng)
1. **`aggregateRating`/`Review` schema** (P2.2): chỉ thêm khi có review THẬT gắn từng sản phẩm + hiển thị trên trang đó (tránh manual action Google). Cân nhắc chuyển Organization → `LocalBusiness` + `aggregateRating` khớp 6 testimonial homepage.
2. **hreflang / bản tiếng Anh route-based** (P2.9): cần khi muốn AI hỏi tiếng Anh đề xuất; LanguageSwitcher hiện đổi client-side. Nếu thêm `/en` thật → cập nhật test `does not advertise missing language routes` (`seo-regression.test.ts:66`).
3. **OG image riêng từng trang** (P2.4) + **author E-E-A-T thật** (P2.9): cải thiện CTR & độ tin, mức trung bình.
4. **Merchant feed** `g:gtin`/`g:mpn`/`g:identifier_exists`/`g:product_type` + feed cho vang/phụ kiện (P2.7).
5. **Off-page (ROI cao nhất cho ChatGPT):** thực thể Wikidata, Google Business Profile + review thật, backlink báo chí. Không thuộc codebase.

---

## Self-Review (tác giả tự rà)

**1. Spec coverage (so với báo cáo audit):**
- P0.1 NAP → Phase 1 Task 3 + 7 ✅
- P0.2 số ĐT → Task 3 + 8 + BS-1 (khóa test) ✅
- P0.3 brand sai → Task 4 + 5 + 6 ✅
- P1.1 giá schema → Task 4 + 6 ✅ · P1.2 freshness → Task 9 ✅
- P1.3 title dài → BS-3 (+ Task 10 cho trang Benediktiner) ✅
- P1.4 cannibalization → Task 10 ✅ · P1.5 mô tả trùng → ghi nhận trong BS-3 phạm vi title (mô tả: ngoài phạm vi tự động, để thủ công) ⚠️ (xem ghi chú dưới)
- P1.6 gộp llms → Task 8 ✅ · P1.7 root layout → BS-2 ✅
- P2.1 LocalBusiness → BS-4 ✅ · P2.3 FAQ landing → Task 11 ✅ · P2.5 internal link → BS-5 ✅ · P2.6 vang → BS-6 ✅ · P2.8 GSC → BS-7 ✅
- P2.2, P2.4, P2.7, P2.9 → mục "Ngoài phạm vi" (có lý do) ✅

**2. Lỗ hổng đã biết:** P1.5 (viết lại meta description trùng cho ~10 trang) **chưa thành Task riêng** vì cần biên tập nội dung thủ công từng trang — liệt kê ở mục thủ công. Nếu muốn, tạo Task BS-8 viết lại description độc nhất từng trang (mỗi description nêu 1 góc/USP khác nhau).

**3. Type consistency:** `BUSINESS`, `getBrandInfo`, `getPriceRange`, `getFaqSchema`, `getProductSchema`, `getLocalBusinessSchema` dùng nhất quán; `JsonLdProps.type` thêm `'localbusiness'` khớp lời gọi ở layout. ✅

**4. Placeholder:** Chỗ cần dữ liệu người (`__LAT__`/`__LNG__`, `abv`, token GSC) đã đánh dấu rõ ở "Cần con người chuẩn bị" + lệnh "KHÔNG bịa số liệu". ✅

---

## 🚀 PROMPT KHỞI ĐỘNG CHO ANTIGRAVITY (copy nguyên khối dưới)

```
Bạn là agent kỹ sư. Thực thi plan SEO/GEO cho dự án Next.js "Bia Thầy Tu" (biathaytu.com).

ĐỌC TRƯỚC (theo thứ tự):
1. docs/superpowers/plans/2026-06-16-seo-geo-audit-report.md  (hiểu "tại sao")
2. docs/superpowers/plans/2026-06-16-seo-geo-implementation-plan.md  (plan này — "làm gì")
3. docs/superpowers/plans/2026-06-14-seo-geo-fixes.md  (code đầy đủ cho Phase 1–2)

NGUYÊN TẮC BẮT BUỘC:
- Làm TUẦN TỰ: Phase 1 → Phase 2 → Phase 3. Trong mỗi phase làm từng Task theo đúng thứ tự.
- Mỗi Task: theo TDD khi có test (viết test → chạy fail → code → chạy pass), rồi `npx tsc --noEmit`, rồi commit RIÊNG bằng đúng commit message gợi ý.
- KHÔNG nhảy cóc; chỉ qua Task sau khi Task hiện tại tsc + test xanh và đã commit.
- KHÔNG bịa dữ liệu. Các Task BS-4/BS-6/BS-7 cần dữ liệu người (toạ độ GPS, abv vang, token GSC) — nếu chưa được cung cấp, BỎ QUA Task đó, để checkbox trống và báo lại ở cuối.
- KHÔNG đụng 3 file `*-regression.test.ts` ngoài thay đổi được mô tả tường minh trong BS-1/BS-2.
- Giữ NAP chuẩn xuyên suốt: "Bia Thầy Tu", "659A Lạc Long Quân, Phường Tây Hồ, Hà Nội", hotline "0899.191.313" / E.164 "+84899191313".

KIỂM TRA SAU MỖI PHASE:
- Phase 1: `git grep -n "218 Đội Cấn" -- "src/"` và `git grep -nE "915[\s.-]?312[\s.-]?166" -- "src/" "public/"` → cả hai KHÔNG còn kết quả. Rồi `npm run test && npx tsc --noEmit`.
- Phase 2 & 3: `npm run lint && npm run test && npm run build` đều xanh.

BÁO CÁO CUỐI: liệt kê Task đã hoàn tất, Task bỏ qua (kèm lý do thiếu dữ liệu), và kết quả lệnh kiểm tra cuối.
```
