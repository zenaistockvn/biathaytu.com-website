# Kế hoạch Refactor UI (Phase 1)
**Tài liệu tham khảo:** `DESIGN.md` (Premium Beer Theme), `docs/ui-audit-report.md`

## 1. Mục tiêu (Phase 1)
- Giữ nguyên màu sắc cốt lõi của thương hiệu Bia Thầy Tu (Vàng Gold / Deep Navy) và font chữ Playfair Display / Inter.
- Xóa bỏ nợ kỹ thuật liên quan đến Inline Styles.
- Tạo thư viện UI Components cơ bản (Button, Card) để chuẩn hóa giao diện.
- Không thay đổi Business Logic, API, Routing hay Database.

## 2. Các thay đổi đề xuất (Proposed Changes)

### 🎨 2.1 Chuẩn hóa CSS & Design Tokens
**File thay đổi:** `src/app/web.css`
- Giữ nguyên cấu trúc màu sắc Vàng/Navy hiện tại.
- Thêm utility classes cho Spacing và Typography để thay thế cho inline styles.
- Chuẩn hóa CSS class cho `.btn-primary`, `.btn-outline` thống nhất.

### 🧱 2.2 Xây dựng UI Kit cơ bản
**Tạo mới thư mục:** `src/app/(web)/components/ui/`
1. `Button.tsx`: Component chuẩn đóng gói `.btn-primary` và `.btn-outline`.

### 🧹 2.3 Dọn dẹp Inline Styles ở Component & Pages
1. `src/app/(web)/components/LandingHero.tsx`:
   - Gỡ bỏ toàn bộ inline styles.
2. `src/app/(web)/components/ProductCard.tsx`:
   - Gỡ inline styles, sử dụng `Button.tsx`.
3. `src/app/(web)/ve-chung-toi/page.tsx` & `src/app/(web)/san-pham/page.tsx`:
   - Loại bỏ inline styles hardcode.

## 3. Trình tự thực hiện (Execution Steps)
- **Bước 1:** Xây dựng `Button` component.
- **Bước 2:** Cập nhật `ProductCard.tsx`.
- **Bước 3:** Cập nhật `LandingHero.tsx`.
- **Bước 4:** Dọn dẹp inline-style ở các trang tĩnh.
- **Bước 5:** Build, lint và tạo báo cáo `docs/ui-refactor-summary.md`.

## 4. Kế hoạch Kiểm thử (Verification Plan)
- Chạy `npm run lint` & `npx tsc --noEmit`.
- Trực quan kiểm tra giao diện không bị vỡ.
