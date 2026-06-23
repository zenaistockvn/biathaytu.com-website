# Báo cáo kết quả Refactor UI - Phase 1

## 1. Tổng quan
- **Mục tiêu:** Dọn dẹp nợ kỹ thuật (technical debt) từ các inline-styles, xây dựng component cốt lõi và chuẩn hóa UI theo `DESIGN.md`.
- **Phạm vi tác động:** `ProductCard`, `LandingHero`, `ve-chung-toi`, `san-pham`, `web.css`.

## 2. Chi tiết công việc đã thực hiện
1. **Xây dựng `Button` component (`src/app/(web)/components/ui/Button.tsx`):**
   - Hỗ trợ các thuộc tính như `variant` (`primary`, `outline`, `secondary`, `ghost`), `size` (`sm`, `md`, `lg`), và `href` (tự động render thành `<Link>`).
   - Sử dụng các lớp CSS được chuẩn hóa từ `web.css`.
   
2. **Cập nhật `ProductCard.tsx`:**
   - Thay thế toàn bộ các tag `<button>` thủ công (dùng inline styles lộn xộn) bằng component `<Button>`.
   - Các nút "Thêm vào giỏ" và "Mua Ngay" đã được chuẩn hóa về UI, đồng bộ kích thước và hover state.
   
3. **Cập nhật `LandingHero.tsx`:**
   - Gỡ bỏ hàng loạt các thuộc tính `style={{...}}` trong các thẻ `<h1>`, `<p>`, `<span>`.
   - Tạo mới các class trong `web.css` như `.hero-title`, `.hero-desc`, `.hero-badge` để tái sử dụng.
   - Thay thế thẻ `<Link>` gọi hành động bằng `<Button size="lg">`.
   
4. **Dọn dẹp trang tĩnh (`ve-chung-toi/page.tsx`):**
   - Loại bỏ inline-style của nút "Đến Trang Liên Hệ" và sử dụng `<Button variant="primary">`.

5. **Cập nhật CSS (`web.css`):**
   - Bổ sung kích thước cho nút bấm (`.btn-sm`, `.btn-lg`).
   - Bổ sung các class dành riêng cho component LandingHero để làm sạch mã nguồn.

## 3. Next steps (Phase 2)
- Tiếp tục refactor layout components (như `WebHeader`, `MobileBottomNav`) sang mô hình sử dụng class-based và components chuẩn.
- Bắt đầu đưa các component của hệ thống Bento Grid / UI Kit vào thay thế cho các phần phức tạp.
- Khắc phục một số lỗi TypeScript `tsc` cũ còn tồn đọng trong `san-pham/[slug]/page.tsx` và `mobile-first-regression.test.ts`.

## 4. Kiểm tra
- Giao diện đã được kiểm tra trên localhost:3000 và không làm vỡ layout cũ, nhưng source code đã trở nên gọn gàng, có tính module và maintainable hơn nhiều.
