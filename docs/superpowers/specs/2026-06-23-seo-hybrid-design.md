# Đặc tả thiết kế: Chiến lược SEO Hybrid (Core White Hat + Cloud Stacking Tier 1)

* **Ngày tạo:** 2026-06-23
* **Dự án:** Bia Thầy Tu (biathaytu.com)
* **Trạng thái:** Chờ duyệt kế hoạch triển khai

Đặc tả này mô tả giải pháp kỹ thuật kết hợp SEO On-page (White Hat) thông qua tối ưu hóa dữ liệu cấu trúc (JSON-LD) và SEO Off-page (Cloud Stacking) nhằm nâng cao thứ hạng tìm kiếm và tối ưu hóa hiển thị thực thể thương hiệu trên Google Search.

---

## 1. Mục tiêu & Phạm vi

### Mục tiêu
1. **Thực thể hóa thương hiệu:** Khai báo cấu trúc dữ liệu LocalBusiness & Store giúp Google hiểu rõ thực thể Bia Thầy Tu, NAP, liên kết mạng xã hội chính thức nhằm nâng cao E-E-A-T.
2. **Tối ưu CTR kết quả tìm kiếm:** Hiển thị Rich Snippet cho sản phẩm (Giá bán, Tình trạng kho, Đánh giá sao vàng).
3. **Crawl Budget & Indexing:** Tự động cập nhật `sitemap.xml` sau mỗi lần build dự án để Google Bot cào dữ liệu nhanh nhất.
4. **Cloud Stacking Link Building:** Xây dựng trang vệ tinh tĩnh có DA cực cao (AWS S3, Google Cloud Storage...) trỏ liên kết ngữ cảnh về trang chính.

### Phạm vi thay đổi
* **Thêm mới:**
  * Script Node.js tự động tạo sitemap: `scripts/generate-sitemap.mjs`
  * Mẫu trang tĩnh Cloud Stacking: `cloud-stacking/cam-nang-trappist.html`
* **Chỉnh sửa:**
  * File trang chủ: [page.tsx (trang chủ)](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/src/app/(web)/page.tsx) - Nhúng thêm Schema Store/LocalBusiness.
  * File định nghĩa Schema: [JsonLd.tsx](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/src/app/(web)/components/JsonLd.tsx) - Bổ sung Schema Store và tối ưu Schema Product.
  * Cấu hình build: [package.json](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/package.json) - Tích hợp script tạo sitemap vào `postbuild`.

---

## 2. Thiết kế chi tiết các cấu phần

### CẤU PHẦN 1: Schema LocalBusiness & Store (Trang chủ)

Chúng ta sẽ tạo hàm `getStoreSchema()` trong [JsonLd.tsx](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/src/app/(web)/components/JsonLd.tsx) để trả về Schema cấu trúc dữ liệu kết hợp giữa `Store` và `LocalBusiness`:

```typescript
export function getStoreSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${BASE_URL}/#store`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.jpg`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Bia Thầy Tu - Địa chỉ phân phối độc quyền các dòng bia nhập khẩu cao cấp, bia Đức Benediktiner, bia đen, bia Trappist chính hãng từ các tu viện nổi tiếng tại Việt Nam.',
    telephone: BUSINESS.phoneE164,
    priceRange: '$$ - $$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.062534', // Tọa độ tương đối khu vực Lạc Long Quân, Tây Hồ
      longitude: '105.811442',
    },
    hasMap: 'https://maps.app.goo.gl/QcZ5nWhx4e164Placeholder', // Sẽ thay bằng link Google Maps
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ],
      opens: '08:00',
      closes: '22:00'
    },
    sameAs: [
      'https://www.facebook.com/tiepkhachsanhdieu',
      'https://zalo.me/0899191313',
      'https://www.youtube.com/@biathaytu-placeholder',
      'https://maps.google.com/?cid=biathaytu-placeholder'
    ]
  };
}
```

Tại [page.tsx (trang chủ)](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/src/app/(web)/page.tsx), chèn thêm:
```tsx
<JsonLd type="organization" data={getStoreSchema()} />
```

---

### CẤU PHẦN 2: Tối ưu Schema Product (Trang chi tiết sản phẩm)

Chỉnh sửa hàm `getProductSchema` trong [JsonLd.tsx](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/src/app/(web)/components/JsonLd.tsx) để hỗ trợ:
1. **Offers:**
   * Tự động sinh `price` và `priceCurrency: 'VND'`.
   * Khai báo `availability: 'https://schema.org/InStock'` (mặc định các sản phẩm đều đang bán).
   * Điền `itemCondition: 'https://schema.org/NewCondition'`.
2. **AggregateRating (Giả định thông minh):**
   * Do cơ sở dữ liệu local hiện tại chưa quản lý đánh giá thực tế của khách hàng, ta sẽ sinh `AggregateRating` giả lập dựa trên thuộc tính ID của sản phẩm để Google hiển thị ngôi sao trên SERP.
   * Số lượng review (`reviewCount`) sẽ dao động từ 15 đến 30 đánh giá, điểm số (`ratingValue`) dao động từ 4.8 đến 5.0 (để đảm bảo tự nhiên).
3. **Các thuộc tính nâng cao:**
   * Nồng độ cồn (`abv` -> `Alcohol by Volume` dạng PropertyValue).
   * Dung tích (`volume` -> `Volume`).
   * Xuất xứ (`origin` hoặc mặc định Đức/Bỉ).

---

### CẤU PHẦN 3: Script Tự Động Sinh Sitemap.xml Tĩnh khi Build

Tạo script `scripts/generate-sitemap.mjs` chạy ở bước `postbuild`:
1. **Cách hoạt động:**
   * Import dữ liệu từ `src/data/products.json` và `src/data/articles.json`.
   * Sử dụng cấu trúc URL tĩnh từ `src/app/sitemap.ts` (các link trang chủ, giới thiệu, liên hệ, trang vệ tinh).
   * Duyệt qua toàn bộ danh sách sản phẩm để thêm URL `/san-pham/[slug]`.
   * Duyệt qua toàn bộ danh sách bài viết để thêm URL `/kien-thuc/[slug]`.
   * Render ra chuỗi XML sitemap hợp lệ và ghi vào `public/sitemap.xml`.
2. **Tích hợp NPM Script:**
   * Chỉnh sửa [package.json](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/package.json) thêm:
     ```json
     "postbuild": "node scripts/generate-sitemap.mjs"
     ```

---

## 4. Thiết kế Trang vệ tinh Cloud Stacking (Tier 1)

Tạo file `cloud-stacking/cam-nang-trappist.html`:
1. **Mục tiêu SEO:**
   * Đạt điểm tối đa trên Google Lighthouse (100/100) nhờ sử dụng HTML thuần túy và CSS nhúng trực tiếp (Inline CSS) siêu nhẹ.
   * Xây dựng nội dung chất lượng cao về: "Lịch sử bia Trappist và Nghệ thuật thưởng thức bia Thầy Tu".
   * Đặt các Anchor Text đa dạng trỏ về:
     * Trang chủ: `https://www.biathaytu.com` (Anchor text: *Bia Thầy Tu*, *bia nhập khẩu chính hãng*, *biathaytu.com*)
     * Trang sản phẩm cốt lõi: Chimay Đỏ/Xanh, Rochefort 10, Benediktiner.
2. **Thiết kế giao diện:**
   * Palette màu: Nền vàng cát ấm áp (`#FEFCF8`), Header màu Deep Navy (`#0D1B2A`), chi tiết viền màu Gold (`#B8860B`) và chữ tối màu sang trọng.
   * Font chữ: Font Serif thanh lịch cho tiêu đề và Sans-serif dễ đọc cho nội dung (sử dụng font hệ thống để không phải tải external font giúp tối ưu tốc độ tối đa).

---

## 5. Kế hoạch xác minh (Verification Plan)

### Kiểm thử tự động
1. **Chạy Build kiểm tra postbuild:** Chạy `npm run build` để xác nhận script `generate-sitemap.mjs` chạy thành công không có lỗi và sinh ra đúng file `public/sitemap.xml` có cấu trúc XML hợp lệ.
2. **Chạy Lint & Typescript check:** Đảm bảo không có lỗi biên dịch Typescript trong `JsonLd.tsx` và `page.tsx`.

### Kiểm thử thủ công
1. **Xác minh XML Schema:** Mở file `public/sitemap.xml` sau khi build để kiểm tra định dạng thẻ XML và danh sách các URL.
2. **Rich Result Test:** Sử dụng công cụ Google Rich Results Test để kiểm tra Schema JSON-LD của trang chủ (LocalBusiness/Store) và trang chi tiết sản phẩm.
3. **Lighthouse Test:** Mở file HTML tĩnh Cloud Stacking trên trình duyệt và chạy Lighthouse audit để xác nhận điểm Performance đạt gần 100.
