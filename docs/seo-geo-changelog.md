# Báo cáo Thay đổi Tối ưu hóa SEO & GEO (SEO & GEO Changelog)

Tài liệu này tổng hợp toàn bộ các thay đổi kỹ thuật, nội dung và cấu trúc đã thực hiện trên website biathaytu.com.

---

## 1. Các lỗi nghiêm trọng đã sửa (P0)

* **Đồng bộ nồng độ cồn (ABV) Benediktiner Weissbier Naturtrüb:**
  * **Lỗi phát hiện:** Nồng độ cồn hiển thị không đồng nhất ở một số trang và schema.
  * **Khắc phục:** Thống nhất **5.4% ABV** trên toàn bộ website thông qua `PRODUCT_MASTER_DATA` và gán động vào các page. Đã viết test case Vitest tự động khóa chặt giá trị này.
* **Sửa mô tả Benediktiner Festbier:**
  * **Lỗi phát hiện:** Festbier bị gọi nhầm là bia lúa mì.
  * **Khắc phục:** Định vị lại đây là dòng **bia lễ hội đặc trưng vùng Bavaria**, không phải bia lúa mì. Xóa bỏ tất cả từ khóa "lúa mì" liên quan đến Festbier trong mô tả sản phẩm. Đã viết test case Vitest kiểm chứng.
* **Thống nhất nguồn gốc Ettal và nhà máy sản xuất Lich:**
  * **Lỗi phát hiện:** Nội dung cũ dễ gây hiểu lầm bia Benediktiner được sản xuất trực tiếp tại tu viện Ettal.
  * **Khắc phục:** Thống nhất diễn đạt: *"Benediktiner được sản xuất tại Lich, Đức, theo công thức Benedictine gắn với Tu viện Ettal và theo giấy phép của Benediktiner Weissbräu GmbH Ettal."*
* **Chuẩn hóa mốc lịch sử:**
  * **Lỗi phát hiện:** Nhầm lẫn mốc 1330 và 1609.
  * **Khắc phục:** Quy định rõ: **1330** thành lập tu viện Ettal, **1609** bắt đầu truyền thống ủ bia. Sử dụng cụm *"hơn 400 năm truyền thống nấu bia"*.
* **Loại bỏ tuyên bố sức khỏe vô căn cứ:**
  * **Khắc phục:** Quét và làm sạch các câu từ y tế/sức khỏe thiếu nguồn trong toàn bộ mã nguồn.

---

## 2. Các file đã sửa đổi & Tác động SEO/UX

| Đường dẫn file | Thay đổi chính | Tác động SEO | Tác động UX | Rủi ro |
| :--- | :--- | :--- | :--- | :--- |
| `src/data/productMasterData.ts` | Tạo nguồn Product Master Data chuẩn hóa. | Nâng cao dữ liệu có cấu trúc cho AI Search. | Dữ liệu đồng bộ, chính xác. | Không |
| `src/lib/data/products.ts` | Tích hợp Master Data vào hàm merge sản phẩm. | Đồng bộ dữ liệu schema và UI. | Không lo lệch thông tin. | Không |
| `src/app/robots.ts` | Chặn index giỏ hàng, checkouts, search và UTM/filters. Cho phép OAI-SearchBot, chặn GPTBot. | Tối ưu hóa Crawl Budget, tránh duplicate content. | Tránh index trang rác. | Rất thấp |
| `src/app/sitemap.xml/route.ts` (và pages, products, articles) | Tách sitemap động phân cấp XML và xóa sitemap.ts cũ. | Khả năng crawl nhanh và chuẩn hóa lastmod. | Hỗ trợ bot tốt hơn. | Không |
| `src/app/(web)/components/JsonLd.tsx` | Loại bỏ rating giả lập, đồng bộ offers giá thật. | Tránh hình phạt spam của Google, tăng độ tin cậy. | Schema chuẩn. | Không |
| `src/app/(web)/thong-tin-chinh-thuc-bia-thay-tu-benediktiner/page.tsx` | Tạo trang thực thể chính thức (entity page). | Tối ưu GEO/AEO cho AI Search, tăng E-E-A-T. | Người đọc dễ đối chiếu thông tin chuẩn. | Không |
| `src/app/(web)/components/References.tsx` | Tạo component nguồn trích dẫn. | Google AI Search dễ quét và trích nguồn. | Tăng uy tín thương hiệu. | Không |
| `src/app/(web)/components/WebFooter.tsx` | Cập nhật thông điệp trách nhiệm uống bia 18+. | Tuân thủ pháp luật quảng cáo đồ uống có cồn. | Chuyên nghiệp hơn. | Không |

---

## 3. Cách thức Rollback (Nếu xảy ra sự cố)

Dự án đã được cấu hình Git trên branch `fix/seo-geo-biathaytu`. Để quay lại trạng thái ban đầu trước khi sửa:
```bash
git checkout main
```
Hoặc xóa branch lỗi và làm lại:
```bash
git branch -D fix/seo-geo-biathaytu
```
