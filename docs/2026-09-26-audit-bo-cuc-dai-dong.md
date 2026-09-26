# Audit bố cục — chỗ dài dòng, lặp, lệch (sau đợt 3)

**Ngày:** 26/09/2026 · **Cách kiểm:** chụp nguyên trang 21 route bằng Playwright ở 1440px và 390px, xem từng ảnh; đo chiều cao trang, số thẻ, ảnh lặp. Cùng loại vấn đề với footer vừa sửa (`713bec7`): quá nhiều khối, thông tin lặp, bố cục lệch.

Mức độ: 4 cao · 6 trung bình · 2 thấp. Đã sửa L1, L2, L6, L7, L9, L10 (`d818dda`); L3, L4, L5, L8 (`1ab5346`); giờ hỗ trợ (L4, ``0a6fa29``); L12 sửa, L11 giữ có chủ đích (commit dọn `!important`).

---

## Cao

### L1 · `/san-pham` quá dài, thẻ lặp tên dòng
- 16 thẻ, mỗi thẻ cao 570px trên mobile → trang **13.286px** (dài nhất site, ngang `/kien-thuc`).
- Mỗi nhóm đã có tiêu đề "Weissbier Naturtrüb" nhưng thẻ nào cũng ghi lại "Benediktiner Naturtrüb".
- Lưới 3 cột: Naturtrüb 4 thẻ thành 3 + 1 thẻ lẻ; "Hộp mix 2 vị" 1 thẻ bỏ trống 2/3 hàng.

**Đề xuất:** lưới 4 cột desktop, 2 cột mobile; thẻ trong nhóm chỉ ghi quy cách + giá (tên dòng đã ở tiêu đề nhóm); gộp nhóm 1 thẻ vào hàng của nhóm liền trước hoặc hiển thị dạng hàng ngang.

> **Đã sửa · `d818dda`.** Thẻ gọn trong danh mục: 2 cột mobile, 3 cột tablet, 4 cột desktop; thẻ chỉ ghi quy cách, thông số, giá (tên dòng ở tiêu đề nhóm), SKU khác tên chung ghi thêm tên riêng (Bitburger 0.0, Football Edition). Mobile 13.286px → 6.688px.

### L2 · Trang SKU: 8 khối sau phần đầu, nhiều khối lặp hoặc chung chung
Theo thứ tự: bảng thông số · Hương vị nổi bật · mô tả · accordion 4 mục · Cam kết chất lượng · Món nhắm (3 xúc xích + combo) · Có thể bạn sẽ thích (4 thẻ) · form tư vấn. Mobile ~10.000px.
- Bảng thông số lặp ABV, IBU (đã ở hàng giá), dung tích và quy cách (đã ở dưới tên): 4/5 dòng trùng.
- "Cam kết chất lượng" là 4 câu giống hệt nhau trên mọi SKU.
- "Có thể bạn sẽ thích" và "Món nhắm" kéo người xem sang sản phẩm khác trước khi thấy form.

**Đề xuất:** bảng thông số chỉ giữ Xuất xứ (hoặc bỏ); gộp "Hương vị nổi bật" vào mô tả; bỏ "Cam kết" hoặc thu thành một dòng; "Có thể bạn sẽ thích" thay bằng dải quy cách cùng dòng (FormatStrip); "Món nhắm" thu thành một dòng link.

> **Đã sửa · `d818dda`.** Bảng thông số bỏ dòng đã hiện phía trên (bia chỉ còn Xuất xứ); "Hương vị nổi bật" vào đầu phần mô tả; bỏ "Cam kết chất lượng" ở bia (xúc xích, combo giữ vì có thông tin bảo quản lạnh); món nhắm thành một dòng link; "Có thể bạn sẽ thích" thay bằng "Quy cách khác" cùng dòng. Mobile ~10.000px → 5.234px.

### L3 · `/kien-thuc`: 23 bài hiện một lượt, ảnh bìa lặp
- Mobile **13.227px**. 64/66 bài không có ảnh bìa riêng nên dùng ảnh thay thế: 23 thẻ chỉ có 5 ảnh (`home-hero.jpg` 8 lần, `beer-garden-closeup.jpg` 7 lần, `so-close-to-heaven.jpg` 5 lần).
- Danh sách phẳng, không nhóm (phần còn lại của A8).

**Đề xuất:** hiện 9 bài + nút "Xem thêm" (hoặc phân trang); nhóm theo chủ đề; ảnh bìa riêng cho bài (cần ảnh chính hãng).

> **Đã sửa · `1ab5346`.** Bài nổi bật + 9 bài, nút "Xem thêm bài viết" (bài chưa hiện vẫn có trong HTML). Chip chủ đề: Món ăn kèm · Thưởng thức · Lịch sử và câu chuyện · Các dòng bia (xếp theo từ khoá tiêu đề, `src/config/articleTopics.ts`). **Chờ:** ảnh bìa riêng (chủ dự án có ảnh, 26/09).

### L4 · Khối "Ghé thăm showroom" trong bài viết (`GeoLocalCTA.tsx`)
- Kiểu riêng, lệch hệ thống: nút vàng "Gọi Hotline Ngay", icon ghim, chữ in hoa kiểu khác.
- **Giờ mâu thuẫn:** khối ghi "Hotline / Zalo (8:00 - 22:00)", trang Liên hệ và bản dịch ghi 9:00 – 21:00.
- Nút "Chat qua Zalo" (quy tắc A5: "Mở Zalo").
- Sau khối này còn "Tìm hiểu thêm về các dòng bia" (3 thẻ) và "Bài viết liên quan": đuôi bài dài.

**Đề xuất:** thống nhất giờ (cần chủ dự án xác nhận), đổi khối sang kiểu `CtaBand` của hệ thống, giữ một trong hai khối cuối.

> **Đã sửa (một phần) · `1ab5346`.** Khối viết lại bằng CSS module theo hệ thống (bỏ `<style>` nhúng và `!important`), tiêu đề chữ thường, nút sáng + link "Mở Zalo". Giờ hỗ trợ thống nhất **8:00 - 22:00** (chủ dự án xác nhận) trong `COMPANY_CONFIG.supportHours`, dùng ở trang Liên hệ, khối showroom, bản dịch (`0a6fa29`). **Giữ** khối sản phẩm cuối bài (chủ dự án xác nhận giữ).

---

## Trung bình

### L5 · Trang chủ: hai lối vào sản phẩm liền nhau, khối "Ghé thăm" lặp footer
- "Bia của chúng tôi" (ô Benediktiner / Bia Đức) và "Các dòng bia" (3 thẻ) cùng dẫn vào sản phẩm, cách nhau một khối.
- "Ghé thăm" ghi địa chỉ + hotline, ngay trên footer cũng ghi địa chỉ + hotline.

> **Đã sửa · `1ab5346`.** Bỏ khối "Bia của chúng tôi" (quyết định chủ dự án: giữ "Các dòng bia"); "Các dòng bia" lên ngay sau hero, thêm icon ly.

### L6 · Dải xanh cuối trang dính liền footer xanh
`/benediktiner-dunkel` (và 2 trang dòng bia khác) "Đặt hàng", `/thuong-hieu` "Tiếp tục hành trình", `/san-pham` "Cho nhà hàng": nền xanh đêm nối thẳng vào footer xanh đêm, thành một mảng dài không thấy ranh giới.
**Đề xuất:** dải cuối dùng nền xám hoặc vàng nhãn, hoặc bỏ khi footer đã có liên hệ.

> **Đã sửa · `d818dda`.** Dải cuối của 3 trang dòng bia, trang bom 5L, `/thuong-hieu` nền trắng kẻ trên; `/san-pham` nền xám; nút chính xanh trời.

### L7 · `/bom-bia-5l-benediktiner`: ảnh lặp và nhãn trùng (lỗi)
- Ảnh bom Festbier xuất hiện hai lần liền (hero và khối giới thiệu).
- Dải "Các bom 5 lít": 3 ô cùng ghi **"Bom 5L"**, không phân biệt Naturtrüb / Festbier / Bitburger (`formatLabel` bỏ tên dòng).

> **Đã sửa · `d818dda`.** Khối giới thiệu dùng ảnh bom Naturtrüb (hero giữ bom Festbier). FormatStrip ghi tên dòng khi dải gồm nhiều dòng: Naturtrüb / Festbier / Bitburger.

### L8 · `/ve-chung-toi` trùng `/thuong-hieu` và lặp liên hệ
Bảng "Thông tin liên hệ" + khối "Kết nối với chúng tôi" + footer: địa chỉ, hotline, email hiện ba lần trên một màn. Nội dung trùng ý với `/thuong-hieu` (A4, chờ quyết định gộp).

> **Đã sửa · `1ab5346`.** Gộp vào `/thuong-hieu`: 301 trong `next.config.js`, gỡ trang và mục sitemap. Không còn link nội bộ nào tới trang cũ. Phần "Ba giá trị cốt lõi" không chuyển sang (trang Câu chuyện Ettal đã có "Triết lý").

### L9 · Trang dòng bia: section một câu, dải quy cách lệch trái
- "Một chút lịch sử" chỉ một câu nhưng chiếm một section có tiêu đề lớn.
- "Các quy cách" 3 ô nhỏ dồn trái, trống 2/3 hàng trên desktop.

> **Đã sửa · `d818dda`.** "Một chút lịch sử" thành dòng cuối bảng "Hương vị cảm nhận"; dải quy cách căn giữa, tiêu đề căn giữa.

### L10 · Nhãn Zalo còn sót, trái quy tắc A5
"Chat Zalo B2B" (HORECA), "Chat qua Zalo" (bài viết), "Trao đổi qua Zalo" (trang chủ), "Liên hệ đặt hàng qua Zalo" (trang dòng bia). Ba nhãn "đặt hàng" cũng nên xem lại cùng lưu ý pháp lý của A6.

> **Đã sửa · `d818dda`.** Mọi link mở Zalo ghi "Mở Zalo" (HORECA, quà tặng, bảng giá sỉ, trang chủ, bài viết, thông tin mua hàng, form tư vấn, mặc định ZaloCTA). Trang dòng bia: tiêu đề "Đặt hàng" → "Liên hệ tư vấn", tin nhắn soạn sẵn "muốn đặt mua" → "muốn được tư vấn về".

---

## Thấp

### L11 · `/thong-tin-mua-hang` mục 8 lặp thông tin doanh nghiệp của footer
Trang pháp lý nên chấp nhận được; có thể thay bằng một câu dẫn xuống footer.
**Giữ có chủ đích:** trang thông tin mua hàng là trang pháp lý, thông tin pháp nhân phải đọc được ngay trên trang, không phụ thuộc footer.

### L12 · Tiêu đề trong bài viết viết Hoa Mỗi Chữ
Ví dụ "Giới Thiệu Về Xúc Xích Thüringer Bratwurst Trứ Danh". DESIGN.md: tiêu đề dạng câu dài viết thường. Nằm trong `articles.json`, sửa được bằng bước làm sạch dữ liệu.
**Đã sửa:** 180 tiêu đề h2–h4 trong 35 bài chuyển về viết hoa đầu câu, giữ hoa tên riêng; mốc cắt đoạn trong `articles.ts` đổi theo; nội dung 23 bài đang hiển thị giống hệt trước khi bỏ qua hoa thường. `design-rules.test.ts` chặn tái phát. Tiêu đề bài (h1) chưa đổi.

---

## Cần chủ dự án quyết định
1. ~~Giờ hỗ trợ (L4).~~ 8:00 – 22:00.
2. ~~Trang chủ giữ khối nào (L5).~~ Giữ "Các dòng bia".
3. ~~Gộp `/ve-chung-toi` (L8).~~ Đã gộp.
4. ~~Ảnh bìa riêng (L3).~~ Có, chờ chủ dự án gửi.
