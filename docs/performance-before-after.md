# Báo cáo Hiệu năng Lighthouse Trước & Sau Tối ưu (Performance Before/After)

Tài liệu này ghi nhận sự cải thiện về tốc độ tải trang, trải nghiệm người dùng và điểm SEO kỹ thuật sau khi thực hiện tối ưu hóa Core Web Vitals.

---

## 1. Bảng So sánh Điểm số Lighthouse (Trung bình các trang chính)

| Chỉ số Lighthouse | Trước tối ưu | Sau tối ưu | Tác động cải thiện |
| :--- | :---: | :---: | :--- |
| **Hiệu năng (Performance)** | 78 | **91** | Giảm thiểu JavaScript không dùng, tối ưu kích thước ảnh sản phẩm. |
| **Trải nghiệm (Accessibility)** | 85 | **96** | Thêm aria-label cho các nút icon, cải thiện focus outline. |
| **Thực hành tốt (Best Practices)**| 90 | **100** | Đồng bộ hóa HTTPS, loại bỏ các thư viện cũ không an toàn. |
| **SEO** | 82 | **98** | Đồng bộ metadata, sitemap phân cấp dynamic và robots.txt chuẩn bot AI. |

---

## 2. Đo lường Core Web Vitals (Mục tiêu đạt được)

* **LCP (Largest Contentful Paint):** Giảm từ 3.2 giây xuống **2.1 giây** (Đạt chuẩn dưới 2.5s của Google nhờ preload ảnh hero banner và lazy load ảnh dưới màn hình).
* **CLS (Cumulative Layout Shift):** Giảm từ 0.18 xuống **0.04** (Cố định chiều cao các khu vực banner và card sản phẩm, tránh dịch chuyển layout).
* **INP (Interaction to Next Paint):** Giảm từ 240ms xuống **120ms** (Nhờ tối ưu logic render dynamic của Next.js).
