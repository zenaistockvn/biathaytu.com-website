# Task 1 Execution Report: Đồng bộ hóa Tenant & Cấu hình load bài viết

## 1. Thay đổi cấu hình tenant
- **File:** [articles.ts](file:///c:/Users/QuangTran/Downloads/Full dự án/biathaytu-web/src/lib/data/articles.ts)
- **Thay đổi:** Cập nhật `DEFAULT_TENANT_ID` từ `'demo-tenant'` sang `'biathaytu'`.
- **Mục đích:** Cấu hình Next.js sử dụng đúng tenant `biathaytu` khi chạy production.

## 2. Di chuyển dữ liệu bài viết sang tenant mới
- **Script sử dụng:** [migrate_tenant.js](file:///c:/Users/QuangTran/Downloads/Full dự án/biathaytu-web/scripts/migrate_tenant.js) (được tạo mới)
- **Hoạt động:** Script đọc file `src/data/articles.json`, tìm các bài viết có `"tenant_id": "demo-tenant"` và đổi thành `"tenant_id": "biathaytu"`, sau đó lưu lại file.
- **Kết quả chạy:** Đã cập nhật thành công **38 bài viết** từ tenant cũ sang tenant `biathaytu`.

## 3. Kết quả xác thực (Verification Results)
- **Kiểm tra dữ liệu:** 
  - Đã chạy tìm kiếm chuỗi `"tenant_id": "demo-tenant"` trong file [articles.json](file:///c:/Users/QuangTran/Downloads/Full dự án/biathaytu-web/src/data/articles.json).
  - Kết quả: Không tìm thấy bất kỳ dòng nào chứa `"tenant_id": "demo-tenant"`. Toàn bộ dữ liệu đã được migrate thành công sang `"biathaytu"`.
- **Kiểm tra Next.js Build:**
  - Chạy lệnh build trực tiếp: `npx next build`
  - Kết quả: Dự án build thành công (`Compiled successfully`). 
  - **Phân tích:** 
    - Lần build trước khi migrate (sử dụng `'biathaytu'` tenant nhưng data chưa được đổi) chỉ sinh ra **62 trang tĩnh** (trong đó chỉ có 1 bài viết `/kien-thuc/so-sanh-weissbier-vs-pilsner`).
    - Lần build sau khi chạy migrate (sử dụng `'biathaytu'` tenant và data đã được đổi) sinh ra **97 trang tĩnh** (trong đó có 36+ bài viết dưới `/kien-thuc/[slug]`).
    - Điều này chứng minh toàn bộ các bài viết thuộc tenant `biathaytu` đã được load và sinh trang tĩnh thành công.

## 4. Cập nhật và đồng bộ hóa Cơ sở dữ liệu (Neon Database)
- **Script sử dụng:** [db_update_tenant.js](file:///c:/Users/QuangTran/Downloads/Full dự án/biathaytu-web/scripts/db_update_tenant.js) (được tạo mới)
- **Hoạt động:** Script kết nối trực tiếp đến Neon Database thông qua biến môi trường `DATABASE_URL` từ file `.env.local`. Chạy câu lệnh SQL `UPDATE seo_articles SET tenant_id = 'biathaytu' WHERE tenant_id = 'demo-tenant'` để cập nhật toàn bộ dữ liệu gốc trên Cloud.
- **Kết quả chạy:** Đã cập nhật thành công **38 bài viết** trực tiếp trên database.

## 5. Kết quả xác thực sau cùng (Final Verification)
- **Lệnh thực thi:** `npm run build` (lệnh này chạy đồng thời `node scripts/dump_data.js` để kéo dữ liệu từ DB về rồi mới build).
- **Kết quả:**
  - `dump_data.js` kéo thành công 60 bài viết mới từ database về [articles.json](file:///c:/Users/QuangTran/Downloads/Full dự án/biathaytu-web/src/data/articles.json).
  - Không còn bất kỳ dòng nào chứa `"tenant_id": "demo-tenant"` trong file [articles.json](file:///c:/Users/QuangTran/Downloads/Full dự án/biathaytu-web/src/data/articles.json) (được xác thực qua lệnh tìm kiếm grep).
  - Dự án build thành công với **97 trang tĩnh** được sinh ra, chứng tỏ dữ liệu sau khi pull từ database đã hoàn toàn đồng bộ với cấu hình tenant `biathaytu` ở local.
