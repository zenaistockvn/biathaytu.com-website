# Prompt khởi động cho Antigravity — Sửa lỗi UI & chức năng biathaytu.com

> Copy toàn bộ khối dưới đây, dán vào Antigravity ở thư mục gốc repo `biathaytu-web`.

---

Bạn đang làm việc trong repo `biathaytu-web` — website bán bia Đức nhập khẩu cao cấp (Next.js 16 App Router, TypeScript, không Tailwind, CSS duy nhất là `src/app/web.css` scope `.web-app`).

## Nhiệm vụ

Thực thi **Phase 1 → Phase 5** trong file:

```
docs/superpowers/plans/2026-07-29-ui-functionality-implementation-plan.md
```

Bối cảnh lỗi và bằng chứng đo được (nếu cần hiểu "vì sao"):

```
docs/superpowers/plans/2026-07-29-ui-functionality-audit-report.md
```

**KHÔNG** làm Phase 6 (hợp nhất design system) và Phase 7 (P2) — hai phase đó cần chủ dự án chốt hướng thiết kế trước.

## Quy tắc bắt buộc

1. **Test trước, code sau.** Mỗi Phase trong plan đều có phần "Test trước" với code test đầy đủ. Tạo file test, chạy `npm test`, **xác nhận test fail đúng như plan mô tả**, rồi mới sửa code. Nếu test pass ngay từ đầu → dừng lại và báo cáo, vì nghĩa là bạn hiểu sai lỗi.
2. **Làm tuần tự từng Phase.** Sau mỗi Phase chạy:
   ```bash
   npm test && npx next build && npx eslint .
   ```
   Tất cả phải xanh trước khi sang Phase kế tiếp. Dùng `npx next build`, **không** dùng `npm run build` (script đó chạy `dump_data.js` cần kết nối DB).
3. **Không refactor ngoài phạm vi.** Không đổi tên biến, không dọn code, không đổi màu, không sửa `web.css` ngoài các dòng plan nêu tên. File `web.css` có 5.744 dòng và 748 `!important` — chạm vào ngoài phạm vi sẽ gây hồi quy thị giác không kiểm soát được.
4. **Commit riêng từng Phase**, message tiếng Việt theo mẫu:
   ```
   fix(compliance): cổng tuổi không còn bị popup che, API bắt buộc xác nhận 18+
   ```
5. **Không tự sinh dữ liệu.** Nếu cần ảnh, giá, hay số tài khoản mà repo không có → **dừng và hỏi**, tuyệt đối không đặt placeholder. Lỗi P0.2 trong báo cáo chính là do placeholder được commit rồi lên production.

## Ba điểm cần hỏi chủ dự án (dừng lại khi tới)

- **Phase 2.4** — `public/` không có ảnh Köstritzer nào. Cần chọn Cách A (bổ sung ảnh thật) hay Cách B (tạm ẩn 2 SKU Köstritzer khỏi bán). Không được tiếp tục dùng ảnh bom **Bitburger** cho sản phẩm **Köstritzer**.
- **Phase 2.2** — cần giá trị thật cho `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_ACCOUNT`, `NEXT_PUBLIC_BANK_HOLDER`.
- **Phase 5.1** — đang có 2 widget chat cùng góc phải dưới. Đề xuất bỏ Facebook Customer Chat, giữ `FloatingZaloCTA`. Cần xác nhận trước khi xoá.

## Định nghĩa "xong" cho lần giao này

- [ ] `npm test` xanh, có thêm test mới cho: bắt buộc xác nhận tuổi, toàn vẹn ảnh, không có `aggregateRating`, phủ catalog, link footer, regex SĐT
- [ ] `npx next build` xanh
- [ ] `npx eslint .` không error
- [ ] `npx tsc --noEmit` xanh
- [ ] Khách mới (đã xoá cookie + localStorage + sessionStorage): mở `/` chỉ thấy cổng xác minh tuổi, đợi 5 giây **không** có popup bóng đá nào che nó
- [ ] `/chua-du-tuoi` không còn header/footer/floating CTA/bottom nav và không có link `/san-pham` nào; có `<meta name="robots" content="noindex, nofollow">`
- [ ] `POST /api/order` thiếu field `purchaser_age_confirmed` → trả 400 với lỗi **về tuổi** (không phải lỗi sản phẩm)
- [ ] `/dat-hang` hiển thị số tài khoản thật, hoặc ẩn hẳn phương thức chuyển khoản nếu ENV chưa cấu hình — **không còn chuỗi "CẦN PHÁP CHẾ"**
- [ ] `view-source` một trang sản phẩm: không còn `aggregateRating`; `getStoreSchema` không còn chuỗi `placeholder`
- [ ] `/san-pham` render đủ **34 SKU** (có section Combo, Rượu Vang, và các SKU Bitburger)
- [ ] Cả 5 link sản phẩm trong footer đều mở được (0 lỗi 404)
- [ ] Không ảnh nào có `naturalWidth === 0` trên `/`, `/san-pham`, và mọi trang `/san-pham/[slug]`
- [ ] Từ chối cookie tiếp thị → reload → `performance.getEntriesByType('resource').filter(r=>/facebook/.test(r.name))` trả về mảng rỗng
- [ ] 9 trang (7 chính sách + `/chua-du-tuoi` + `/nhan-uu-dai`) có canonical trỏ đúng chính nó
- [ ] Mọi input ở checkout có `id` + `htmlFor` + `autocomplete`; nút số lượng và icon giỏ hàng ≥ 44×44 px

## Báo cáo cuối

Viết `docs/superpowers/plans/2026-07-29-antigravity-report.md` gồm: Phase nào xong, file nào đã sửa, output thật của các lệnh verify, và mục nào bị chặn vì đang chờ chủ dự án trả lời.
