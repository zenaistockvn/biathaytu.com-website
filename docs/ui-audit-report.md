# Giao diện & Kiến trúc UI – Báo cáo Kiểm toán (UI Audit Report)
**Dự án:** Bia Thầy Tu (biathaytu-web)
**Ngày kiểm toán:** 17/05/2026
**Thực hiện bởi:** Senior Product Designer & Frontend Architect

## 1. Executive Summary (Tóm tắt)
Dự án "Bia Thầy Tu" hiện tại sử dụng stack công nghệ **Next.js 16.2.1, React 19**, nhưng hệ thống styling không sử dụng Tailwind CSS hay CSS-in-JS (như styled-components, emotion). Thay vào đó, dự án dùng **Vanilla CSS** với BEM-like convention (được scoped qua class `.web-app` trong `web.css` và `globals.css`). 
Mặc dù có một Design System cơ bản được mô tả trong `DESIGN.md`, việc thực thi trên code (implementation) đang gặp phải nợ kỹ thuật (Technical Debt) rất lớn do lạm dụng **inline styles (`style={{...}}`)**, code lặp lại nhiều và thiếu các component UI chuẩn (UI Kit).

## 2. UI Problems by Severity (Mức độ nghiêm trọng)

### 🔴 Critical (Nghiêm trọng)
- **Lạm dụng Inline Styles:** Hơn 700+ trường hợp HTML chứa inline style phức tạp. Điều này phá vỡ khả năng maintain, khó áp dụng responsive (media queries không thể dùng trong inline style), và không thể reuse CSS.
- **Thiếu UI Kit Component:** Nút bấm (Button), thẻ (Card), typography không được component hóa triệt để. Code HTML bị lặp lại rất nhiều ở các file page (`san-pham/page.tsx`, `ve-chung-toi/page.tsx`, `thuong-hieu/page.tsx`, ...).

### 🟠 High (Cao)
- **Hardcode giá trị màu và khoảng cách:** Dù đã có CSS Variables trong `web.css` (`var(--web-gold)`, `var(--web-navy)`), rất nhiều inline styles vẫn hardcode mã hex (VD: `#fff`, `rgba(184, 134, 11, 0.12)`) và padding (`padding: '120px 0 60px'`).
- **Responsive Handling kém:** Sử dụng `clamp()` trong inline style là một giải pháp hay, nhưng khi kết hợp với inline styles làm cho việc debug layout trên mobile/tablet cực kỳ khó khăn, không tuân theo break point chuẩn.

### 🟡 Medium (Trung bình)
- **Component Consistency:** Nút CTA lúc thì dùng class `btn-primary`, lúc thì viết inline style thẳng vào thẻ `<button>` (VD: Nút "Thêm vào giỏ" dạng icon trong `ProductCard.tsx`).
- **Loading / Error / Empty States:** Ngoại trừ Toast message, ứng dụng đang thiếu vắng các Skeleton loading chuẩn hoặc Error boundaries, điều này có thể gây hẫng hụt UX khi Next.js gọi API từ Supabase bị chậm.

### 🟢 Low (Thấp)
- **Focus / Active States (Accessibility):** Có xử lý focus trên `FloatingZaloCTA` nhưng nhiều phần tử khác (buttons, links) khi tương tác bằng bàn phím chưa có viền focus (focus ring) rõ ràng.

## 3. Screen-by-screen Review

1. **Trang chủ (`/`) & Landing Pages Sản phẩm (`/[slug]`):**
   - *Hierarchy (Hệ thống thị giác):* Tốt. Ảnh hưởng thị giác mạnh nhờ Hero section tối màu (`hero-dark`), làm nổi bật chai/ly bia.
   - *Vấn đề:* Code của `LandingHero.tsx` cực kỳ rối rắm với hàng tá inline styles cho Typo. Quá nhiều logic hiển thị trộn lẫn markup.
2. **Trang Danh mục Sản phẩm (`/san-pham`):**
   - *Flow:* Rõ ràng. Card sản phẩm (`ProductCard.tsx`) tái sử dụng tốt.
   - *Vấn đề:* Responsive grid có thể không ổn định nếu nội dung chữ quá dài do chiều cao thẻ card chưa được fix cứng chuẩn xác.
3. **Các trang nội dung (Về chúng tôi, Thương hiệu, B2B):**
   - *Layout:* Đang sử dụng các `<section>` hardcode padding và background trực tiếp bằng thẻ `div style={{}}`.
   - *Visual:* Thiếu tính nhất quán nếu sau này có designer yêu cầu đổi màu nền chung, do các thẻ này hardcode `#fff` thay vì biến CSS.
4. **Blog / Kiến thức (`/blog`, `/kien-thuc`):**
   - Rendering Markdown khá ổn qua thư viện `marked`, nhưng bộ CSS cho rich-text (prose style) chưa thực sự đồng nhất và chuẩn hóa theo hệ Typography `Playfair Display` (Heading) và `Inter` (Body).

## 4. Component Consistency Review
- **Buttons:** Đang có `btn-primary`, `btn-outline` trong `web.css` nhưng không được bọc thành một `<Button />` component chuẩn của React. Dẫn đến việc render `<button>` hoặc `<Link>` đều phải gắn class thủ công.
- **Cards:** `product-card-v2` và `glass-card` khá đẹp về mặt UI, nhưng logic hiển thị (như điều kiện render thẻ meta) bị phơi bày ra ngoài.
- **Typography:** Lệ thuộc quá nhiều vào thẻ cơ bản `<h1>, <p>` với inline style `fontSize: 'clamp(...)'`. Chưa có các component như `<Heading>`, `<Text>` để giới hạn các biến thể Typography.

## 5. Design System Gaps
- Dự án đã có định nghĩa `colors`, `typography`, `spacing` trong `DESIGN.md`.
- **Gap lớn nhất:** Không có ánh xạ (mapping) 1-1 giữa Design Tokens và React Components. Developer đang tự do gõ style thủ công thay vì tuân thủ ràng buộc của hệ thống.
- **Iconography:** File `MobileBottomNav.tsx`, `ProductCard.tsx` chép mã SVG trực tiếp, khiến code rối và dung lượng phình to. Cần 1 hệ thống icon chuẩn.

## 6. Accessibility Issues
- Thiếu `aria-label` cho một số nút bấm icon (VD: nút add to cart trong ProductCard cần thuộc tính `aria-label="Thêm vào giỏ hàng"` cho Screen reader).
- Thiếu Focus outline thống nhất cho tất cả interactive elements.

## 7. Technical Debt in UI Code
- **Mức độ Nợ Kỹ Thuật: Cực cao ở khía cạnh Code Maintainability.**
- Hàng trăm file React Component đang chứa inline-styles. Nếu muốn đổi từ `Inter` sang phông khác, hoặc đổi khoảng cách chuẩn từ `24px` sang `20px`, Frontend dev sẽ phải dùng Regex Find & Replace rất cực khổ thay vì đổi 1 dòng ở biến CSS.

## 8. Refactor Roadmap (Lộ trình tối ưu)

### Phase 1: Chuẩn hóa System Tokens & Tạo UI Kit (Nên làm ngay)
- Tích hợp và cấu hình **Tailwind CSS** (Rất khuyến nghị để thay thế Vanilla CSS + Inline styles trong Next.js).
- Tạo mapping CSS Variables từ `DESIGN.md` vào Tailwind theme.
- Xây dựng thư mục `src/app/(web)/components/ui`: tạo `<Button />`, `<Heading />`, `<Text />`.

### Phase 2: Dọn dẹp Inline Styles (Chuyển đổi Dần dần)
- Sử dụng Regex hoặc làm thủ công loại bỏ triệt để `style={{...}}` trong `LandingHero.tsx`, `ProductCard.tsx` và toàn bộ các trang (`page.tsx`).
- Thay thế các SVG thô bằng các file component riêng biệt (ví dụ: `<IconCart />`, `<IconHome />`) hoặc dùng thư viện (như `lucide-react`).

### Phase 3: Hoàn thiện UX (Nâng cấp)
- Thêm loading Skeleton cho Product list và Blog list.
- Cải thiện Empty state cho Giỏ hàng (Cart).
- Chuẩn hóa các nút Focus, Outline cho toàn bộ trang để đạt chuẩn Web Accessibility.

## 9. Files likely to be changed later
Các file cần "đại phẫu" khi refactor ở các Phase tới:
1. Toàn bộ các file `page.tsx` trong `src/app/(web)/*` (Đặc biệt là `ve-chung-toi`, `thuong-hieu`, `san-pham`).
2. `src/app/(web)/components/LandingHero.tsx`
3. `src/app/(web)/components/ProductCard.tsx`
4. `src/app/web.css`
5. `src/app/(web)/components/MobileBottomNav.tsx`
