# 🍺 Bia Thầy Tu — Official Website (biathaytu.com)

> Nền tảng bán lẻ và quảng bá thương hiệu chính thức cho Bia Thầy Tu (Bia Đức nhập khẩu cao cấp).

Repository này chứa mã nguồn cho website bán lẻ (B2C/B2B) của Bia Thầy Tu, được tách ra từ hệ thống AMC (AI Marketing Center) nguyên bản để tối ưu hiệu suất, SEO và nâng cao trải nghiệm người dùng cuối.

---

## 📐 Kiến trúc Hệ thống

### Tech Stack

| Layer | Công nghệ | Vai trò |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Fullstack (React, SSR/SSG) |
| **Styling** | Vanilla CSS / CSS Modules | Giao diện chuẩn Premium, Glassmorphism |
| **Database** | Supabase (PostgreSQL) | Quản lý sản phẩm, đơn hàng, khách hàng |
| **Authentication**| Supabase Auth | Quản lý người dùng, giỏ hàng |
| **Hosting** | Vercel | Triển khai serverless, Edge caching tự động |

---

## 📂 Cấu trúc thư mục

```
📦 src/
 ┣ 📂 app/
 ┃ ┣ 📂 (web)/                # Routing chính của giao diện website bán lẻ
 ┃ ┣ 📂 api/                  # Backend API routes
 ┃ ┣ 📂 login/                # Giao diện Đăng nhập / Xác thực
 ┃ ┣ 📜 globals.css           # Global Styles & Design Tokens
 ┃ ┣ 📜 web.css               # Specific styles cho giao diện Web
 ┃ ┣ 📜 layout.tsx            # Root layout 
 ┃ ┣ 📜 sitemap.ts            # Dynamic Sitemap phục vụ SEO
 ┃ ┗ 📜 robots.ts             # Dynamic Robots.txt
 ┣ 📂 components/             # Reusable UI components (Buttons, Cards, Modals...)
 ┣ 📂 lib/                    # Helpers, cấu hình Supabase clients
 ┣ 📂 stores/                 # State Management (Zustand: useCartStore, v.v...)
 ┗ 📂 types/                  # TypeScript types/interfaces
```

---

## ✨ Tính năng cốt lõi

- 🛒 **Trải nghiệm mua sắm mượt mà:** Giao diện tối ưu UI/UX theo tiêu chuẩn Premium (Dark Mode, Vibrant Colors, Micro-animations), phù hợp với định vị thương hiệu bia cao cấp.
- ⚡ **Hiệu suất cực cao:** Áp dụng Server Components của Next.js 15 giúp tăng tốc độ tải trang, giảm dung lượng JS gửi xuống client.
- 🔍 **SEO Optimization:** Tối ưu hóa Meta tags, Open Graph (OG), Sitemap, và cấu trúc HTML Semantic để tăng hạng trên các công cụ tìm kiếm.
- 📱 **Mobile-First Responsive:** Hiển thị hoàn hảo trên mọi kích thước màn hình (Mobile, Tablet, Desktop).
- 🔐 **Bảo mật dữ liệu:** Áp dụng Row Level Security (RLS) của Supabase để cách ly và bảo vệ thông tin người dùng an toàn.

---

## 🚀 Hướng dẫn cài đặt & Chạy Local

### 1. Clone & Cài đặt dependencies

```bash
git clone https://github.com/zenaistockvn/biathaytu.com-website.git
cd biathaytu.com-website
npm install
```

### 2. Cấu hình Biến môi trường

Tạo file `.env.local` ở thư mục gốc và sao chép các keys từ Supabase project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Khởi chạy Development Server

```bash
npm run dev
```

Mở trình duyệt và truy cập `http://localhost:3000` (hoặc cổng được hiển thị trong terminal) để xem ứng dụng.

---

## 🚀 Triển khai (Deployment)

Dự án được thiết kế để triển khai liền mạch trên **Vercel**:
1. Push code lên nhánh `main`.
2. Vercel tự động nhận diện framework Next.js và tiến hành build.
3. Đảm bảo cung cấp đầy đủ Environment Variables trên Vercel Dashboard trước khi deploy.

---

## 📝 License

**Private** — Thuộc quyền sở hữu của Bia Thầy Tu. Mọi hành vi sao chép mã nguồn đều không được phép.
