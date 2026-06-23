# Antigravity — Checklist: Bỏ Supabase, nhận đơn qua Google Sheets + Telegram

**Mục tiêu:** Gỡ hoàn toàn Supabase khỏi website Bia Thầy Tu; đọc dữ liệu từ JSON tĩnh có sẵn (`src/data/*.json`); nhận đơn hàng qua **Google Sheets (nguồn sự thật) + Telegram (thông báo)**.

**📖 Plan chi tiết (BẮT BUỘC đọc để lấy code đầy đủ từng bước):** `docs/superpowers/plans/2026-06-14-bo-supabase-nhan-don-sheets-telegram.md`

## ⚠️ Nguyên tắc bắt buộc
- **KHÔNG báo "Đặt hàng thành công" nếu chưa ghi được vào Google Sheets** → Sheets lỗi thì trả HTTP 502 + thông báo gọi hotline 0899.191.313.
- **Giá luôn tính lại từ `products.json` phía server** — không tin giá client gửi.
- **Chặn số lượng bất thường** (chỉ nhận số nguyên 1–99).
- **Telegram gửi text thuần** (không `parse_mode`); Apps Script chống formula injection.
- Telegram lỗi → chỉ log, KHÔNG chặn đơn.
- Giữ nguyên: `dat-hang/page.tsx`, `dat-hang/layout.tsx`, `src/types/database.ts`, 3 file `*-regression.test.ts`, mọi landing page tĩnh.

## 🔧 Cần con người chuẩn bị trước (điền `.env.local`)
`SHEETS_WEBHOOK_URL`, `SHEETS_WEBHOOK_SECRET` (Apps Script Web App) · `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (@BotFather).
→ Code + unit test KHÔNG phụ thuộc các biến này (test dùng mock); chỉ smoke test cuối (Task 16) mới cần.

## ✅ Checklist (làm tuần tự, mỗi Task = 1 commit, theo TDD: test→fail→code→pass→commit)
- [ ] **Task 1** — Tạo `src/lib/data/products.ts` + test (getAllProducts, getProductBySlugOrId, getBeerProducts, getAccessories, getRelatedBeers, getFeaturedBeers, getProductsByCategory)
- [ ] **Task 2** — Tạo `src/lib/data/articles.ts` (getPublishedArticles, getArticleBySlugOrId, getRelatedArticles)
- [ ] **Task 3** — Tạo `src/lib/data/promo.ts` + test (getActivePromoByCode)
- [ ] **Task 4** — Tạo `src/lib/orders/types.ts` (OrderCustomer, ClientCartItem, PricedItem, OrderTotals, OrderRecord)
- [ ] **Task 5** — Tạo `src/lib/orders/validation.ts` + test (validateOrderInput, chặn quantity 0/âm/thập phân/>99)
- [ ] **Task 6** — Tạo `src/lib/orders/pricing.ts` + test (calculateOrderTotals: auto 5% đơn ≥2tr + promo, giá từ server)
- [ ] **Task 7** — Tạo `src/lib/integrations/googleSheets.ts` + `telegram.ts` + test (mock fetch/env)
- [ ] **Task 8** — Viết lại `src/app/api/order/route.ts`: validate → tính tiền → ghi Sheets (bắt buộc) → Telegram (best-effort)
- [ ] **Task 9** — Viết lại `src/app/api/promo/validate/route.ts` dùng `getActivePromoByCode`
- [ ] **Task 10** — `src/app/(web)/page.tsx`: bỏ `force-dynamic`, dùng `getAllProducts`
- [ ] **Task 11** — `src/app/(web)/san-pham/page.tsx`: bỏ `force-dynamic`, dùng `getBeerProducts`/`getAccessories`
- [ ] **Task 12** — `src/app/(web)/san-pham/[slug]/page.tsx`: bỏ `force-dynamic`, thêm `generateStaticParams`, dùng `getProductBySlugOrId`/`getRelatedBeers`
- [ ] **Task 13** — `kien-thuc/page.tsx` + `kien-thuc/[slug]/page.tsx`: dùng data layer (articles + getFeaturedBeers); xóa `buildArticleQuery`/`UUID_REGEX`
- [ ] **Task 14** — `sitemap.ts`, `llms.txt/route.ts`, `google-merchant.xml/route.ts`: dùng data layer; **xóa** `src/app/api/revalidate/`
- [ ] **Task 15** — Xóa `src/lib/supabase/` + `src/app/api/test-db/`; tạo `scripts/google-apps-script-orders.gs`; cập nhật `.env.example`; gỡ `@supabase/ssr`, `@supabase/supabase-js`, `nodemailer`, `@types/nodemailer` khỏi `package.json`; `npm install`
- [ ] **Task 16** — Verify: `npm run lint` → `npm run test` → `npm run build` (xác nhận `/`, `/san-pham` = Static; `/san-pham/[slug]` = SSG; không còn `/api/test-db`, `/api/revalidate`) → smoke test đơn thật

## 🧪 Lệnh kiểm tra
- Mỗi Task: `npx tsc --noEmit` + chạy test của task đó.
- Sau Task 15: `git grep -n "@/lib/supabase\|@supabase\|nodemailer" -- "src/"` → phải KHÔNG còn kết quả.
- Cuối: `npm run lint && npm run test && npm run build` đều xanh.

## 📌 Cách làm
1. Mở plan chi tiết, làm đúng từng Task theo thứ tự — **mọi code và lệnh đã có sẵn trong plan**, không tự chế.
2. Không nhảy cóc; chỉ qua Task sau khi Task hiện tại `tsc`/test xanh và đã commit.
3. Dùng đúng commit message gợi ý trong plan.
