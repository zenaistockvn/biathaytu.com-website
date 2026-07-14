# Kế hoạch Triển khai Tối ưu hóa SEO & GEO Toàn diện cho biathaytu.com

Dự án này sử dụng **Next.js 16.2.6 (App Router)** và **React 19**, cấu hình styling qua Vanilla CSS (`globals.css`, `web.css` và inline styles), dữ liệu sản phẩm được lưu ở `src/data/products.json` và `src/lib/data/localProducts.ts`.

Kế hoạch này vạch ra các bước kiểm tra, sửa đổi mã nguồn và tối ưu hóa chi tiết nhằm đạt 100% mục tiêu đã đề ra.

---

## P0: Các Lỗi Nghiêm Trọng Cần Sửa Ngay

### 1. Đồng bộ và Chuẩn hóa ABV cho Benediktiner Weissbier Naturtrüb
* **Hiện trạng:** Một số trang hoặc schema có thể đang hiển thị nồng độ cồn sai lệch.
* **Hành động:** 
  * Định nghĩa nồng độ cồn là **5.4%** tại mọi nơi hiển thị (Trang chủ, chi tiết sản phẩm, schema, bài viết liên quan).
  * Viết thêm validation test trong `src/lib/data/products.test.ts` để đảm bảo nồng độ cồn không bao giờ bị lệch đối với sản phẩm Benediktiner Weissbier Naturtrüb.

### 2. Sửa mô tả và định vị sản phẩm Benediktiner Festbier
* **Hiện trạng:** Festbier bị gọi nhầm là bia lúa mì.
* **Hành động:** 
  * Cập nhật mô tả trong `src/data/products.json` cho Benediktiner Festbier (Két 24 lon 500ml và Bom 5L) để khẳng định đây là dòng **bia lễ hội đặc trưng vùng Bavaria theo phong cách Đức**, phân biệt rõ rệt với Weissbier (bia lúa mì).
  * Viết lại trang `/benediktiner-festbier` (nếu có) hoặc mô tả sản phẩm chi tiết đáp ứng đủ 12 cấu phần (Festbier là gì, hương vị, màu sắc, độ đắng, nhiệt độ phục vụ, loại ly, món ăn đi kèm, quy cách, xuất xứ, nhà sản xuất, chính sách giao hàng).

### 3. Chuẩn hóa nguồn gốc Ettal và địa điểm sản xuất Lich
* **Hiện trạng:** Một số phần giới thiệu khiến người dùng/bot hiểu lầm bia Benediktiner được sản xuất hoàn toàn tại tu viện Ettal.
* **Hành động:** 
  * Thay thế bằng diễn đạt thống nhất trên toàn website: *"Benediktiner được sản xuất tại Lich, Đức, theo công thức Benedictine gắn với Tu viện Ettal và theo giấy phép của Benediktiner Weissbräu GmbH Ettal."*
  * Rạch ròi thông tin về Tu viện Ettal (nguồn gốc, di sản thương hiệu) và Lich (nhà máy sản xuất thực tế).

### 4. Chuẩn hóa các mốc lịch sử
* **Hiện trạng:** Một số bài viết và mô tả đang trộn lẫn mốc 1330 và 1609 hoặc dùng cụm từ "gần 700 năm công thức".
* **Hành động:**
  * Thống nhất: **1330** là năm thành lập Tu viện Ettal. **1609** là mốc bắt đầu truyền thống nấu bia tại Ettal.
  * Sử dụng cụm từ *"hơn 400 năm truyền thống nấu bia"*. Không dùng *"công thức bia gần 700 năm"*.

### 5. Loại bỏ tuyên bố sức khỏe không có căn cứ xác minh
* **Hiện trạng:** Có các câu từ y tế/sức khỏe thiếu nguồn trong bài viết hoặc mô tả.
* **Hành động:**
  * Quét toàn bộ `articles.json` và mô tả sản phẩm để xóa bỏ các cụm từ như *"men sống quý giá"*, *"tốt cho tiêu hóa"*, *"bia sống tốt hơn bia chết"*, v.v.

### 6. Sửa đổi lỗi test Vitest hiện tại
* **Hiện trạng:** Test case `returns only storefront-ready products sorted by sort_order ascending` trong [products.test.ts](file:///d:/biathaytu.com-website/src/lib/data/products.test.ts) bị fail do thiếu category `'combo'` trong danh sách category được test duyệt.
* **Hành động:** Cập nhật file test để bổ sung `'combo'` vào mảng danh mục bán lẻ.

### 7. Tạo nguồn Product Master Data duy nhất
* **Hành động:** Tạo file `src/data/productMasterData.ts` làm nguồn sự thật duy nhất (Single Source of Truth) định nghĩa toàn bộ metadata và thông số chuẩn của các sản phẩm Benediktiner, Bitburger, Köstritzer, xúc xích và combo.

---

## P1: SEO Kỹ Thuật và Dữ Liệu Cấu Trúc

### 1. Nâng cấp Schema Structured Data
* **Organization & Store Schema:** Cập nhật [JsonLd.tsx](file:///d:/biathaytu.com-website/src/app/%28web%29/components/JsonLd.tsx) loại bỏ các tuyên bố "độc quyền" chưa được kiểm chứng pháp lý, điền chính xác địa chỉ và Hotline.
* **Product Schema:** Đảm bảo trường `offers` chứa giá trị giá hợp lệ đồng nhất với giá bán hiển thị trên UI. Bổ sung `gtin13` (nếu có), `brand` và các trường bổ trợ. Không hiển thị rating giả.
* **BreadcrumbList Schema:** Tự động tạo Breadcrumb chuẩn cho mọi trang chi tiết sản phẩm và bài viết.

### 2. Tách và Tối ưu hóa XML Sitemap
* **Hành động:** Cập nhật [sitemap.ts](file:///d:/biathaytu.com-website/src/app/sitemap.ts) để sinh sitemap có phân cấp:
  * `/sitemap.xml` làm sitemap index.
  * `/sitemap-products.xml` chứa danh sách sản phẩm.
  * `/sitemap-categories.xml` chứa danh sách danh mục.
  * `/sitemap-articles.xml` chứa các bài viết kiến thức.
  * `/sitemap-pages.xml` chứa các trang tĩnh.
* Chỉ đưa vào sitemap các URL trả về HTTP 200, có canonical tự trỏ, không redirect, được phép index.

### 3. Tối ưu hóa Canonical & Robots.txt
* **Canonical:** Cập nhật mọi page con để canonical trỏ về URL sạch, loại bỏ dấu gạch chéo thừa hoặc query params.
* **Robots.txt:** Cập nhật [robots.ts](file:///d:/biathaytu.com-website/src/app/robots.ts) chặn index các trang `/cart`, `/checkout`, `/tai-khoan`, `/search` và các URL chứa filter/sort/utm. Cho phép `OAI-SearchBot` truy cập.

### 4. Tối ưu hóa Hình ảnh & Core Web Vitals
* Cung cấp thuộc tính `width`, `height` đầy đủ cho ảnh.
* Đảm bảo alt text mô tả tự nhiên, không nhét từ khóa.
* Lazy load ảnh dưới màn hình đầu tiên, không lazy load ảnh LCP.

### 5. Tạo trang Thông tin Thực thể Chính thức (Entity Page)
* **Hành động:** Tạo trang `/thong-tin-chinh-thuc-bia-thay-tu-benediktiner` cung cấp bảng máy đọc dễ dàng (thương hiệu, nguồn gốc, nơi sản xuất, nhà nhập khẩu/phân phối) phục vụ GEO/AEO cho AI Search Engines.

---

## P2: Tối ưu Hóa Nội Dung, GEO và Chuyển Đổi

### 1. Audit Content Cannibalization & Gộp Bài Trùng Lặp
* **Hành động:** 
  * Quét toàn bộ `src/data/articles.json`. Tạo file [docs/content-cannibalization-audit.md](file:///d:/biathaytu.com-website/docs/content-cannibalization-audit.md) liệt kê các bài trùng lặp.
  * Thực hiện gộp các bài trùng lặp về các trang Pillar chính, cấu hình redirect 301.

### 2. Xây dựng các trang nội dung Pillar chính
* **Pillar 1:** Bia lúa mì Đức (`/kien-thuc/bia-lua-mi-duc`).
* **Pillar 2:** Cách thưởng thức bia Đức chuẩn vị.
* **Pillar 3:** Thương hiệu bia tu viện Benediktiner.

### 3. Bổ sung Component Nguồn Tham Khảo (References)
* **Hành động:** Tạo component `<References />` hiển thị nguồn gốc dữ liệu cuối mỗi bài viết quan trọng (Catalogue, website nhà sản xuất).

### 4. Tác giả & Ngày cập nhật (Author & DateModified)
* Hiển thị thông tin tác giả và ngày cập nhật mới nhất cho mọi bài viết. Đồng bộ với Schema Article.

### 5. Tối ưu Trải nghiệm và Tỷ lệ Chuyển đổi (UX & CRO)
* Thống nhất các nút kêu gọi hành động (CTA): Mua ngay, Gọi Hotline, Chat Zalo.
* Đảm bảo sticky CTA trên mobile không che nội dung và không gây CLS.
* Thêm thông điệp uống có trách nhiệm ở footer.

---

## P3: Các Đề Xuất Mở Rộng (Chưa thực hiện ngay)
1. Tự động sinh feed XML cho Google Merchant Center và tích hợp Google Merchant.
2. Xây dựng kế hoạch tối ưu hóa Google Business Profile (Local SEO).
3. Thiết lập Event tracking chi tiết cho Google Analytics 4 (GA4).
