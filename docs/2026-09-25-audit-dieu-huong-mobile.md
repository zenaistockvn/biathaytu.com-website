# Audit UI/UX — điều hướng, nhất quán DESIGN.md, mobile

**Ngày:** 25/09/2026 · **Phạm vi:** mã nguồn hiện tại (hệ màu Benediktiner, header hai tầng, footer xanh đêm). Chưa chạy trên trình duyệt thật; số chiều cao ở C1, C3 là cộng từ CSS, cần đo lại bằng Playwright ở 390×844.

**Đã sửa so với audit 27/08:** reset link dùng `:where()`; header trong suốt có gradient; hotline lấy từ `COMPANY_CONFIG`; bảng liên hệ nổi đóng bằng Escape và bấm ra ngoài; header có `aria-current` cho trang thường.

Mức độ: 6 cao · 9 trung bình · 5 thấp.

---

## A. Điều hướng và kiến trúc thông tin

### A1 · Cao — Menu chính không có mục "Sản phẩm", hai mục trỏ cùng một trang
"Bia Benediktiner" và "Bia Đức tuyển chọn" đều là anchor của `/san-pham`. `isCurrentPath` trả `false` với mọi href có `#`, nên ở `/san-pham` không mục nào sáng. Trang SKU cũng không đánh dấu mục cha. *(WebHeader.tsx, NAV_LINKS)*
**Sửa:** một mục **Sản phẩm** → `/san-pham`, active cho `/san-pham`, `/san-pham/*` và các trang dòng bia. Hai danh mục chuyển vào panel thả xuống (D2).

### A2 · Cao — Hai loại trang sản phẩm song song, không quan hệ cha con
Trang dòng bia (`/benediktiner-weissbier-naturtrub`, `/benediktiner-dunkel`, `/bitburger-premium-pils`, `/bom-bia-5l-benediktiner`) và trang quy cách `/san-pham/[slug]` cùng mô tả một sản phẩm. Lối vào lẫn lộn:
- Trang chủ: Naturtrüb, Dunkel → trang dòng bia; Festbier → trang SKU.
- Footer: Weissbier, Dunkel, Bom 5L → trang SKU; Bitburger → trang dòng bia.
- `/san-pham` chỉ trỏ trang SKU; từ danh mục không tới được trang dòng bia.
- `/bom-bia-5l-benediktiner` không có link nội bộ nào.

**Sửa:** ba cấp Sản phẩm → Dòng bia (có `FormatStrip` liệt kê quy cách) → Quy cách (SKU). Danh mục nhóm thẻ theo dòng bia, tên dòng trỏ trang dòng bia. Breadcrumb SKU: `Sản phẩm / Weissbier Dunkel / Thùng 12 chai`. Xem D1.

### A3 · Cao — Cùng một đích, nhiều tên gọi
| Route | Nhãn đang dùng |
|---|---|
| `/san-pham` | "Bia Benediktiner", "Bia Đức tuyển chọn" (header) · "Bia Đức" (bottom nav) · "Sản phẩm" (breadcrumb) · "Benediktiner" (breadcrumb JSON-LD) · "Bia của chúng tôi" (H1) |
| `/thuong-hieu` | "Từ 1330" (header) · "Câu chuyện Ettal" (footer) · "Đọc câu chuyện đầy đủ" (trang chủ) |
| `/lien-he` | "Showroom" (header, menu mobile) · "Liên hệ tư vấn" (nút HORECA trên /san-pham) · footer không có link |

**Sửa:** `src/config/navigation.ts` — một bảng `{ href, label }` chuẩn; header, menu mobile, bottom nav, footer, breadcrumb, JSON-LD cùng đọc.

> **Đã sửa · đợt 1 · `536fb10`.** Nhãn đã duyệt: `/san-pham` "Sản phẩm", `/thuong-hieu` "Câu chuyện Ettal", `/lien-he` "Showroom" ("Liên hệ" dành cho nút mở bảng kênh). Header, menu mobile, bottom nav, footer, breadcrumb hiển thị (SKU, bài viết) và JSON-LD breadcrumb của 19 trang đọc từ `NAV` qua `breadcrumbTrail()`. Kèm theo: footer "Nghệ thuật thưởng thức" thành "Thưởng thức"; JSON-LD "Trang Chủ" thành "Trang chủ". Test: `src/config/navigation.test.ts`.
> **Còn mở:** hai mục anchor "Bia Benediktiner", "Bia Đức tuyển chọn" trên header giữ tới A1 (đợt 2); nút "Liên hệ tư vấn" (Zalo) giữ tới A5. JSON-LD của `/huong-dan-rot-bia-lua-mi` và `/bia-duc-cho-nha-hang-khach-san` vẫn dùng tên trang ("Hướng Dẫn Rót Bia", "Bia Đức Cho Nhà Hàng Khách Sạn"), khác nhãn menu ("Thưởng thức", "HORECA"): cần chủ dự án chọn.

### A4 · Trung bình — Trang không có lối vào từ header/footer/menu
Không có link nội bộ: `/ve-chung-toi`, `/bia-thay-tu-la-gi`, `/bia-benediktiner-chinh-hang`, `/bom-bia-5l-benediktiner`. Chỉ một lối vào sâu: `/bang-gia-si-dai-ly`, `/food-pairing-bia-duc` (từ trang HORECA), `/qua-tang-bia-duc` (từ trang bom 5L, vốn mồ côi), `/chung-nhan-nhap-khau-chinh-hang` (từ /ve-chung-toi). Chưa kiểm link trong nội dung bài viết.
**Sửa:** footer thêm cột "Mua hàng" và "Tìm hiểu" (A7). Cân nhắc gộp `/ve-chung-toi` vào `/thuong-hieu`.

### A5 · Trung bình — Liên hệ có năm lối vào, năm hành vi
"Showroom" mở `/lien-he`; "Liên hệ tư vấn" mở Zalo tab mới; "Liên hệ" bottom nav mở bảng nổi; nút nổi desktop mở cùng bảng; "Để lại thông tin tư vấn" cuộn tới form cuối trang SKU; thêm widget Messenger.
**Sửa:** một nhãn "Liên hệ", một hành vi: mở bảng kênh (Zalo, gọi, Messenger, Showroom → `/lien-he`). Link mở app ngoài ghi rõ "Mở Zalo".

### A6 · Trung bình — Cách mua hàng không được nói rõ
Footer và `/san-pham` ghi "không bán hàng trực tuyến", trong khi thẻ có "Giá bán lẻ" và tin nhắn Zalo soạn sẵn là "muốn đặt mua". Câu phủ định nằm đầu danh mục nhưng không nói khách phải làm gì.
**Sửa:** thay bằng một câu hướng dẫn (kênh đặt, ai giao, khu vực — **chủ dự án cung cấp nội dung**), đặt cạnh giá trên trang SKU.

### A7 · Trung bình — Footer thiếu mục chính và trộn loại link
Cột "Khám phá" trộn 3 trang SKU, 1 trang dòng bia, 2 trang nội dung. Không có Kiến thức, HORECA, Liên hệ. *(WebFooter.tsx, productLinks)*
**Sửa:** cột Sản phẩm (4 dòng bia → trang dòng bia) · Tìm hiểu (Câu chuyện Ettal, Thưởng thức, Kiến thức, Bia Thầy Tu là gì, Benediktiner chính hãng) · Mua hàng (Bảng giá sỉ, Quà tặng, Thông tin mua hàng, Chứng nhận nhập khẩu, Liên hệ). Giữ cột thông tin doanh nghiệp và thanh pháp lý.

### A8 · Thấp — Danh mục và Kiến thức chỉ có một cách duyệt
Thanh dính `/san-pham` chỉ có 2 tab, trùng 2 mục header. Không lọc theo dòng bia hay quy cách (chai, lon, bom). `/kien-thuc` là danh sách phẳng.
**Sửa:** tab theo dòng bia; hàng lọc quy cách. Kiến thức nhóm theo 3–4 chủ đề (thưởng thức, món ăn kèm, lịch sử, mua hàng).

---

## B. Nhất quán với DESIGN.md

### B1 · Cao — brand-consistency.css đặt lại góc bo và bóng cho toàn site
DESIGN.md: không bóng, không bo góc (`--web-shadow*: none`, `--web-radius*: 0`). Khối "P2 editorial hierarchy" trong `brand-consistency.css` (nạp sau `web.css`) khai lại:
```css
.web-app {
  --web-radius-lg: 16px;
  --web-shadow: 0 8px 28px rgb(var(--web-ink-rgb) / 0.055);
  --web-shadow-md: 0 14px 34px -22px ...;
  --web-shadow-lg: 0 18px 42px -20px ...;
}
```
Mọi chỗ dùng `var(--web-radius-lg)` (vd. `.product-img-box` trang SKU) đang bo 16px. `design-tokens.test.ts` chỉ kiểm `web.css` nên không bắt được.
**Sửa:** xoá khối đó; mở rộng test quét mọi CSS import trong `src/app/(web)/layout.tsx`, fail nếu file ngoài `web.css` khai lại `--web-radius*`/`--web-shadow*`.

> **Đã sửa · đợt 1 · `f76121e`.** Khối "P2 editorial hierarchy" đã xoá; `.product-img-box` trang SKU về góc vuông (kiểm trên trình duyệt: `border-radius: 0px`). Test mới trong `src/app/design-tokens.test.ts`.

### B2 · Trung bình — Nhãn điều hướng lệch quy tắc Barlow Condensed in hoa
- Bottom nav: Barlow 700, 11px, chữ thường (`web.css` .mobile-bottom-nav-item).
- Thanh danh mục: 12–13px, chữ thường (`brand-consistency.css` .catalog-sticky-link).
- Nút liên hệ nổi: Barlow 13px (.brand-contact-trigger); bảng liên hệ có chữ 11px.

**Sửa:** một kiểu nhãn: Barlow Condensed 600, 13–15px, in hoa, letter-spacing 0.06em. Không dưới 12px.

### B3 · Trung bình — Giá trị cứng và !important thay token
- `--web-mobile-bottom-nav-height` khai hai lần: 60px (`web.css`) và 74px (`mobile-overrides.css`); `padding-bottom` main cũng khai ở cả hai.
- Thanh danh mục `top: 72px`, `scroll-margin-top: 146px` thay vì `var(--web-header-h)`.
- Màu link dùng `!important` ở bottom nav, thanh danh mục, bảng liên hệ.

**Sửa:** một nguồn cho mỗi token (74px trong `web.css`). Chuyển MobileBottomNav, CatalogStickyNav, FloatingZaloCTA sang CSS module như `WebHeader.module.css`.

> **Đã sửa · đợt 1 · `4b0cb3e`.** `--web-mobile-bottom-nav-height: 74px` và `padding-bottom` của main chỉ khai trong `web.css`; thêm token `--web-catalog-nav-h` (54px, mobile 50px). Thanh danh mục `top: var(--web-header-h)`; `scroll-margin-top` và `rootMargin` của IntersectionObserver tính từ token. Ba component có `*.module.css` riêng, không `!important`. Kích thước, màu đo lại trên trình duyệt không đổi. Test: `mobile-first-regression.test.ts`.
> **Còn mở:** `.toast-container` vẫn khai `bottom` ở cả `web.css` và `mobile-overrides.css` (bản sau có `!important`).

### B4 · Thấp — Focus ring nút liên hệ khác chuẩn
Outline 3px vàng 50%, offset 3px, gần như không thấy trên nền trắng. Chuẩn: 2px đặc, offset 2px, `--web-accent` trên nền sáng.

### B5 · Thấp — Hiệu ứng nhấc và hình tròn ngoài phạm vi
Nút liên hệ `translateY(-2px)`, FormatStrip `translateY(-4px)` khi hover (hệ thống chỉ đổi nền). Ô "Z", "M" trong bảng liên hệ là hình tròn; dùng icon nét mảnh.

---

## C. Mobile

### C1 · Cao — Trang SKU: nút Gọi và Zalo dưới màn hình đầu
Ở 390×844: đệm trên 80px, breadcrumb in hoa cả tên SP (2–3 dòng ≈110px), khung ảnh 360px, gap 32px, nhãn loại, H1 2 dòng, quy cách, dòng 18+. Khối giá bắt đầu ≈740px, sát mép bottom nav (770px). Nút Gọi/Zalo nằm dưới màn hình đầu. *(ước tính từ CSS)*
**Sửa:** xem D3.

### C2 · Cao — Menu mobile chưa là hộp thoại
Không đóng bằng Escape, không bẫy focus (Tab thoát ra trang nền đã khoá cuộn), không `role="dialog"`/`aria-modal`, nút menu thiếu `aria-controls`. Nav desktop và mobile cùng nhãn "Điều hướng chính". 7 mục phẳng, hotline ở cuối.
**Sửa:** hành vi dialog đầy đủ, trả focus về nút menu khi đóng, đổi nhãn nav mobile thành "Menu di động". Bố cục mới: D4.

> **Đã sửa (hành vi) · đợt 1 · `b8a6361`.** `role="dialog"`, `aria-modal`, `id` + `aria-controls`; mở thì focus mục đầu, Tab/Shift+Tab chạy vòng trong menu và nút menu, Escape đóng và trả focus về nút menu; nav mobile nhãn "Menu di động". Đã thử bằng phím thật ở 390px. Test: `components/header-menu-a11y.test.ts`.
> **Còn mở:** nút đóng nằm ngoài dialog nên trình đọc màn hình có thể bỏ qua; đưa vào trong menu khi làm D4. Bố cục mới (D4) chưa làm.

### C3 · Trung bình — Thanh cố định chiếm ≈23% màn hình
`/san-pham`: header 72 + thanh danh mục 50 + bottom nav 74 = 196px / 844px. Lần đầu thêm banner cookie.
**Sửa:** header thu còn 56px khi cuộn (đã có state `scrolled`); thanh danh mục thay chỗ header khi cuộn thay vì xếp chồng.

### C4 · Trung bình — Bottom nav dành một ô cho Trang chủ
4 ô: Trang chủ, Bia Đức, Kiến thức, Liên hệ. Logo đã về trang chủ; Showroom không có ô; "Bia Đức" khác mọi tên gọi khác của `/san-pham`.
**Sửa:** Sản phẩm · Kiến thức · Showroom · Liên hệ (D4).

### C5 · Trung bình — Vùng chạm < 44px, ảnh thu nhỏ không dùng được bằng bàn phím
- Tab thanh danh mục 36px (mobile) / 38px (desktop).
- Hàng tiện ích header (hotline, Showroom, Liên hệ tư vấn) 26px.
- Ảnh thu nhỏ `ProductGallery` là `<div onClick>`: không focus, không nhãn, không trạng thái chọn.

**Sửa:** `min-height: 44px` cho tab; vùng chạm ảo `::after` cho hàng tiện ích; ảnh thu nhỏ → `<button type="button" aria-pressed aria-label="Ảnh N">`.

> **Đã sửa · đợt 1 · `1e56bd8`.** Tab danh mục 44px; hotline, Showroom, Liên hệ tư vấn, nút ngôn ngữ nhìn 26px nhưng vùng chạm 44px (đo ở 1280px). Ảnh thu nhỏ là `<button>`, style trong `ProductGallery.module.css`. Hiện không sản phẩm nào có hơn một ảnh nên dải ảnh thu nhỏ chỉ được kiểm bằng test.

### C6 · Thấp — Breadcrumb in hoa cả tên sản phẩm dài
"TRANG CHỦ / SẢN PHẨM / BENEDIKTINER DUNKEL THÙNG 12 CHAI 500ML" xuống 2–3 dòng ở 390px, lặp H1. Trên mobile chỉ cần link về cấp cha.

### C7 · Thấp — Hai lớp chặn liên tiếp khi vào lần đầu
Cổng tuổi và banner cookie cùng mount trong `layout.tsx`. Hiện banner cookie sau khi xác nhận tuổi.

---

## D. Đề xuất thiết kế lại

Giữ nguyên token, font, góc vuông, không bóng.

### D1 — Sơ đồ trang (sửa A1, A2, A4, A7)
```
Menu chính
├─ SẢN PHẨM  /san-pham
│   ├─ Benediktiner
│   │   ├─ Weissbier Naturtrüb   /benediktiner-weissbier-naturtrub → các SKU
│   │   ├─ Weissbier Dunkel      /benediktiner-dunkel → các SKU
│   │   └─ Festbier              (chưa có trang dòng — cần quyết định)
│   └─ Bia Đức tuyển chọn
│       └─ Bitburger Premium Pils /bitburger-premium-pils → các SKU
│   (Bom 5L: /bom-bia-5l-benediktiner, gắn vào dòng tương ứng hoặc mục quy cách)
├─ CÂU CHUYỆN ETTAL  /thuong-hieu (+ gộp /ve-chung-toi)
├─ THƯỞNG THỨC       /huong-dan-rot-bia-lua-mi, /food-pairing-bia-duc
├─ KIẾN THỨC         /kien-thuc (theo chủ đề)
└─ HORECA VÀ ĐẠI LÝ  /bia-duc-cho-nha-hang-khach-san, /bang-gia-si-dai-ly

Footer · Mua hàng / Tìm hiểu
  /thong-tin-mua-hang · /qua-tang-bia-duc · /chung-nhan-nhap-khau-chinh-hang
  /bia-thay-tu-la-gi · /bia-benediktiner-chinh-hang · /lien-he
```
Không đổi URL hiện có.

### D2 — Header desktop (sửa A1, A3, A5)
- **Hàng tiện ích:** `0915 31 21 66` · `[LIÊN HỆ]` (hộp viền 1px) · `VI`. Bỏ hộp "Showroom" và "Liên hệ tư vấn". "Liên hệ" mở cùng bảng kênh với FloatingZaloCTA; Showroom là một dòng trong bảng.
- **Hàng menu:** `SẢN PHẨM ▾` · `CÂU CHUYỆN ETTAL` · `THƯỞNG THỨC` · `KIẾN THỨC` · `HORECA VÀ ĐẠI LÝ`. Mục active: màu `--web-accent` + gạch dưới 2px.
- **Panel "Sản phẩm"** (hover/focus/click, đóng bằng Escape, dùng được bằng bàn phím): căn dưới hàng menu, nền trắng, viền 1px `--web-border`, không bóng, góc vuông. 3 cột ngăn bằng viền 1px:
  1. Nhãn "BENEDIKTINER" (Barlow Condensed 13px in hoa, `--web-text-muted`) + Weissbier Naturtrüb, Weissbier Dunkel, Festbier (Roboto Serif 600, 17px).
  2. Nhãn "BIA ĐỨC TUYỂN CHỌN" + Bitburger Premium Pils; cuối cột link "XEM TẤT CẢ SẢN PHẨM" (gạch chân, `--web-accent`).
  3. Ảnh `beer-garden-closeup.jpg`, object-fit cover, cao ≥170px.

### D3 — Trang SKU mobile, màn hình đầu (sửa C1, C6, B1)
Từ trên xuống, 390×844:
1. Header 72px.
2. Link cấp cha `‹ WEISSBIER DUNKEL` (Barlow Condensed 14px in hoa, `--web-accent`), cao 48px, thay breadcrumb 3 cấp.
3. Khung ảnh 300px, nền `--web-surface-muted`, **góc vuông, không bóng**. Chấm chỉ báo 8px ở đáy thay dải ảnh thu nhỏ (vẫn là `<button>`).
4. Nhãn `BENEDIKTINER · BIA LÚA MÌ ĐEN` (margin-top 20px) · H1 26px · quy cách 18px.
5. Hàng giá: kẻ mảnh trên/dưới 1px, trái "GIÁ BÁN LẺ" + giá 26px Roboto Serif, phải "5,4% vol. · IBU 13".
6. Dòng 18+ (13px) · một câu cách mua (A6, chờ nội dung).
7. **Thanh cố định đáy** thay MobileBottomNav trên `/san-pham/*`: cao 74px + safe-area, viền trên 1px, 2 cột gap 8px: `GỌI ĐẶT HÀNG` (primary, icon điện thoại) · `MỞ ZALO` (outline 2px).

Tiêu chí: giá và hai nút nằm trong màn hình đầu ở 390×844 (kiểm bằng Playwright, chụp trước/sau).

### D4 — Menu và bottom nav mobile (sửa C2, C4, A5, B2)
**Menu mobile** (dialog toàn màn hình, dưới header 72px, padding 20px):
1. Nhóm **SẢN PHẨM** (Roboto Serif 20px in hoa, `--web-accent`) + hàng chip: Naturtrüb · Dunkel · Festbier · Bitburger (nền `--web-surface-muted`, min-height 44px, Barlow Condensed 15px in hoa) → trang dòng bia.
2. Các mục: Câu chuyện Ettal · Thưởng thức · Kiến thức · HORECA và đại lý (Roboto Serif 20px in hoa, padding 15px, kẻ dưới 1px).
3. Nhóm **LIÊN HỆ**: nhãn nhỏ, 2 nút ngang hàng cao 48px `GỌI HOTLINE` (primary) · `MỞ ZALO` (outline); dưới là "Showroom: {địa chỉ từ COMPANY_CONFIG}".
4. Dòng nhỏ (Barlow Condensed 14px in hoa, muted): Bảng giá sỉ · Quà tặng · Thông tin mua hàng · VI.

**Bottom nav:** `SẢN PHẨM` · `KIẾN THỨC` · `SHOWROOM` (/lien-he) · `LIÊN HỆ` (mở bảng). Barlow Condensed 600 13px in hoa, letter-spacing 0.06em, icon nét 1.6. Trạng thái chọn: vạch trên 3px `--web-accent` + chữ `--web-accent`; không đổi nền.

---

## Lộ trình
- **Đợt 1 · sửa nhanh:** B1 · C2 (hành vi dialog) · C5 · B3 · A3 — **xong 26/09/2026**, nhánh `claude/compassionate-goodall-dizuq0`

  | Mục | Commit |
  |---|---|
  | B1 | `f76121e` |
  | B3 | `4b0cb3e` |
  | C5 | `1e56bd8` |
  | C2 | `b8a6361` |
  | A3 | `536fb10` |

  Kiểm: `npm test` 192/192; `next build` thành công (`npm run build` cần `DATABASE_URL` cho `scripts/dump_data.js`, máy kiểm không có `.env.local`).
- **Đợt 2 · điều hướng:** A1 + D2 · D4 · A5 · A7
- **Đợt 3 · cấu trúc sản phẩm:** A2 + D1 · C1 + D3 · A6 · A8

## Cần chủ dự án quyết định
1. ~~Nhãn chuẩn cho `/san-pham`, `/thuong-hieu`, `/lien-he` (A3).~~ Đã duyệt: Sản phẩm · Câu chuyện Ettal · Showroom.
   Còn lại: tên JSON-LD của `/huong-dan-rot-bia-lua-mi` và `/bia-duc-cho-nha-hang-khach-san` theo tên trang hay nhãn menu (A3).
2. Nội dung câu hướng dẫn cách mua (A6).
3. Festbier: tạo trang dòng bia hay tạm trỏ SKU (A2).
4. Gộp `/ve-chung-toi` vào `/thuong-hieu` hay giữ riêng (A4).
