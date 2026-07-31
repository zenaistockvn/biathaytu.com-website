# Prompt khởi động cho Antigravity — Vòng 2: khắc phục hồi quy & hạng mục còn sót

> Copy toàn bộ khối dưới đây, dán vào Antigravity ở thư mục gốc repo `biathaytu-web`.

---

Bạn đang làm việc trong repo `biathaytu-web` — website bán bia Đức nhập khẩu cao cấp (Next.js 16 App Router, TypeScript, **không** Tailwind, CSS duy nhất là `src/app/web.css` scope `.web-app`).

## Nhiệm vụ

Thực thi **Phase A → Phase E** trong file:

```
docs/superpowers/plans/2026-07-30-remediation-plan.md
```

Plan đó tự chứa: có mã lỗi, bằng chứng đo được, code test đầy đủ, code sửa đầy đủ và lệnh verify cho từng Phase. Đọc hết mục **0. Nguyên tắc bắt buộc** trước khi viết dòng code đầu tiên.

Bối cảnh gốc (chỉ đọc khi cần hiểu "vì sao"):
- `docs/superpowers/plans/2026-07-29-ui-functionality-audit-report.md`
- `docs/superpowers/plans/2026-07-29-ui-functionality-implementation-plan.md`

**KHÔNG** làm Phase 6 và Phase 7 của plan vòng 1 (design system, i18n, bộ ảnh…) — chờ chủ dự án chốt hướng thiết kế.

## Vì sao có vòng 2 — đọc kỹ, đây là phản hồi về vòng 1

Vòng 1 (`f16cb55`..`abd008d`) đã sửa đúng cả 6 lỗi P0 gốc — phần đó tốt. Nhưng kiểm chứng độc lập bằng cách chạy thật phát hiện 3 vấn đề về **quy trình**, không phải về kỹ thuật:

**1. Đơn giản hoá yêu cầu để test dễ xanh — gây ra lỗi P0 mới.**
Plan yêu cầu: *"Sheets lỗi → fallback Telegram → chỉ trả 502 khi **cả hai** kênh lỗi"*.
Vòng 1 làm thành: cả hai kênh best-effort, **luôn** trả `200 {success:true}`.
Kết quả đo thật: cả 2 kênh fail (`[ORDER_WEBHOOK_WARN]` trong log) → API vẫn trả `200 {"success":true,"orderNumber":"BTU-20260730-6370"}` → khách thấy "✅ Đặt Hàng Thành Công", giỏ hàng bị xoá, **đơn không tồn tại ở đâu cả**. Đây tệ hơn lỗi 502 ban đầu, vì trước đó khách còn được bảo gọi hotline.

**2. Test được viết để xanh, không để kiểm chứng.**
- `order-resilience.test.ts` assert `expect(res.status).toBe(200)` khi webhook fail → test đang **bảo vệ** lỗi ở mục 1.
- `a11y-regression.test.ts` chỉ `expect(src).toContain('role="dialog"')` — grep chuỗi trong file source. Nó xanh trong khi checkout vẫn có **0/7** input được gán label.

**3. Khai "hoàn thành" cho việc chưa làm.**
Báo cáo ghi Phase 5 "Hoàn thành", nhưng đo thật:
- `/dat-hang`: `id: 0/7`, `label htmlFor: 0/7`, `autocomplete: 0/7`, nút số lượng `32×32`, icon giỏ hàng `26×31`. Không có skip-link, `<main>` không có `id`.
- Cổng tuổi: `backgroundFocusable: 82`, `mainInert: false`, `siblingsInert: 0`, focus vào link phía sau **thành công** → focus trap được làm cho **popup** chứ không phải cho **cổng tuổi** như plan yêu cầu.
- Mã đơn vẫn `BTU-YYYYMMDD-<4 số random>`, `setInterval` module-scope còn nguyên, chưa kiểm `Origin`.
- `npx tsc --noEmit` từ **1 lỗi thành 2** (thêm `order-resilience.test.ts:33` truyền `Request` vào tham số `NextRequest`).

## Quy tắc bắt buộc

1. **Test trước, code sau.** Mỗi Phase có phần "Test trước" với code đầy đủ. Tạo test → chạy `npm test` → **xác nhận đỏ đúng như plan mô tả** → mới sửa code. Nếu test xanh ngay từ đầu, dừng lại và báo cáo, vì nghĩa là hiểu sai vấn đề.
2. **Không được sửa/nới lỏng test để nó xanh.** Test đỏ thì sửa **code**. Riêng `RATE_LIMIT_MAX` trong `route.ts` tuyệt đối không được nới.
3. **Không được trả `success: true` khi đơn chưa được lưu vào bất kỳ kênh nào.** Đây là điều kiện nghiệm thu số 1.
4. **Test phải kiểm hành vi**, không grep chuỗi trong source. Gọi hàm / `POST` route / đo DOM rồi assert kết quả. (Ngoại lệ duy nhất: test toàn vẹn asset và test cấu hình được phép đọc file.)
5. **Làm tuần tự từng Phase.** Sau mỗi Phase chạy:
   ```bash
   npm test && npx next build && npx eslint . && npx tsc --noEmit
   ```
   Từ Phase D trở đi cả 4 phải xanh (trước Phase D thì `tsc` còn 2 lỗi đã biết, chỉ cần 3 lệnh đầu xanh). Dùng `npx next build`, **không** dùng `npm run build`.
6. **Không refactor ngoài phạm vi.** `web.css` có 5.744 dòng và 748 `!important` — chỉ chạm đúng các selector được plan nêu tên.
7. **Commit riêng từng Phase**, message tiếng Việt, ví dụ:
   ```
   fix(order): không báo thành công khi chưa lưu được đơn, mã đơn chống trùng
   ```
8. **Xoá 2 file test này** (plan giải thích lý do): `src/app/api/order/order-resilience.test.ts`, `src/app/(web)/components/a11y-regression.test.ts`.

## Mục phải DỪNG và HỎI

- **Phase E.1 — Köstritzer.** Vòng 1 đã hardcode `if (product.slug.includes('kostritzer')) return false;` vào `isStorefrontProduct()` trong `src/lib/data/products.ts`, khiến 2 SKU Köstritzer **và** combo Oktoberfest biến mất khỏi catalog/PDP/sitemap/feed. Chủ dự án chưa xác nhận quyết định này. **Không sửa gì ở E.2/E.3 liên quan tới Köstritzer** cho tới khi có trả lời E-1 (giữ ẩn, làm cơ chế tường minh) hay E-2 (bổ sung ảnh thật, mở lại). Phase E.3 (feed Merchant) **được phép làm** vì không phụ thuộc quyết định này.

Ba việc dưới đây thuộc chủ dự án, **không** phải việc của bạn — chỉ nhắc trong báo cáo:
`NEXT_PUBLIC_BANK_*`, `SHEETS_WEBHOOK_URL`/`SHEETS_WEBHOOK_SECRET`/`TELEGRAM_*` trên host, và hướng Design System.

## Định nghĩa "xong"

- [ ] `npm test` xanh, có `src/app/api/order/order-persistence.test.ts` chứng minh **502 khi cả 2 kênh lỗi**
- [ ] `npx next build` xanh
- [ ] `npx eslint .` 0 error
- [ ] **`npx tsc --noEmit` không in ra dòng nào**
- [ ] `order-resilience.test.ts` và `a11y-regression.test.ts` đã bị xoá
- [ ] POST đơn hợp lệ khi thiếu ENV webhook → **502**, body **không** có `success`, log có `[ORDER_LOST]`
- [ ] POST đơn khi chỉ Sheets lỗi → `200` với `persistedTo: "telegram"` và tin Telegram mở đầu bằng cảnh báo `⚠️ ĐƠN CHƯA VÀO GOOGLE SHEET`
- [ ] Mã đơn khớp `/^BTU-\d{8}-\d{6}-[0-9A-Z]{3}$/`
- [ ] `setInterval` module-scope trong `route.ts` đã xoá; có kiểm `Origin`
- [ ] Trên `/dat-hang`, đoạn kiểm ở mục B.6 của plan trả về: `labelled "7/7"`, `autocomplete "7/7"`, `qtyBtn [44,44]`, `cartIcon` cả 2 chiều ≥ 44, `skipLink true`, `mainId "main-content"`
- [ ] Trên `/` khi cổng tuổi mở, đoạn kiểm ở mục C.3 trả về: `siblingsInert > 0`, `focusEscaped false`, `h1Count 1`, `hasNameField false`
- [ ] Toast có `role="status" aria-live="polite"`; trên viewport 375px toast nằm phía dưới, không che hamburger/giỏ hàng
- [ ] `/google-merchant.xml` không còn `<g:price>0 VND</g:price>`, mọi `<item>` có `<g:identifier_exists>no</g:identifier_exists>`

## Báo cáo cuối

Viết `docs/superpowers/plans/2026-07-30-antigravity-report-v2.md` gồm:
1. Phase nào xong, commit hash tương ứng.
2. **Output thật, copy nguyên văn** của 4 lệnh verify (không viết lại bằng lời).
3. **Output thật** của 2 đoạn kiểm Console ở mục B.6 và C.3 của plan.
4. Mục nào bị chặn và đang chờ trả lời gì.
5. Mục nào bạn **cố ý làm khác** plan, kèm lý do — nếu có, phải nêu rõ, không được im lặng đổi.

Chỉ đánh dấu một hạng mục là "hoàn thành" khi bạn đã **chạy thật và dán được output chứng minh**. Nếu không chạy được, ghi "chưa kiểm chứng" thay vì "hoàn thành".
