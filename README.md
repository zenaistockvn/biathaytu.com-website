# 🍺 Bia Thầy Tu — Website Bán Lẻ B2C

> Website bán lẻ B2C chính thức cho thương hiệu Bia Thầy Tu (Bia Đức nhập khẩu cao cấp). Nơi giới thiệu di sản bia Đức hơn 400 năm tuổi và cung cấp trải nghiệm mua sắm bia trực tuyến cao cấp.

---

## 📐 Tech Stack

| Layer | Công nghệ | Vai trò |
|---|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) | Fullstack SSR/ISR/SSG |
| **Language** | TypeScript 5 | Strict type safety |
| **Styling** | Vanilla CSS + CSS Modules | Premium UI, Gold & Dark Premium aesthetic |
| **Animation** | GSAP (GreenSock) | Micro-interactions và hiệu ứng chuyển động mượt mà |
| **State** | Zustand | Cart và Toast global state management |
| **Database** | Supabase (PostgreSQL + RLS) | Quản lý Products, Orders, Blog content |
| **Email** | Nodemailer | Gửi email xác nhận đơn hàng tự động (SMTP) |
| **Hosting** | Vercel / Netlify | Serverless, Edge caching, On-demand Revalidation |

---

## 📂 Cấu trúc thư mục thực tế

```
📦 src/
 ┣ 📂 app/
 ┃ ┣ 📂 (web)/                  # 🛒 Website bán lẻ B2C
 ┃ ┃ ┣ 📂 components/           #   → WebHeader, WebFooter, ProductCard, CartModal, ZaloCTA...
 ┃ ┃ ┣ 📂 context/              #   → CartContext / Global UI context
 ┃ ┃ ┣ 📂 san-pham/             #   → Trang danh sách sản phẩm + chi tiết [slug]
 ┃ ┃ ┣ 📂 blog/                 #   → Blog / Tin tức thương hiệu
 ┃ ┃ ┣ 📂 kien-thuc/            #   → Kiến thức về bia Đức
 ┃ ┃ ┣ 📂 dat-hang/             #   → Trang đặt hàng (Checkout) và xác nhận
 ┃ ┃ ┣ 📂 thuong-hieu/          #   → Giới thiệu lịch sử, di sản Bia Thầy Tu
 ┃ ┃ ┣ 📂 lien-he/              #   → Trang liên hệ + Bản đồ cửa hàng
 ┃ ┃ ┣ 📂 utils/                #   → Helpers cho phần UI web
 ┃ ┃ ┗ 📂 [satellite-pages]/    #   → Các trang vệ tinh tối ưu SEO (bia-duc-nhap-khau, food-pairing-bia-duc,...)
 ┃ ┃
 ┃ ┣ 📂 api/                    # ⚡ Backend API Routes
 ┃ ┃ ┣ 📂 order/                #   → Tiếp nhận và lưu thông tin đơn hàng
 ┃ ┃ ┣ 📂 promo/                #   → Áp dụng mã giảm giá và khuyến mãi
 ┃ ┃ ┣ 📂 revalidate/           #   → API trigger On-Demand ISR cho blog/sản phẩm
 ┃ ┃ ┗ 📂 test-db/              #   → Kiểm tra kết nối tới Supabase
 ┃ ┃
 ┃ ┣ 📜 globals.css            # Design tokens & global CSS variables
 ┃ ┣ 📜 web.css                # Style chung dành riêng cho website B2C
 ┃ ┣ 📜 layout.tsx             # Root layout (Metadata, Google Fonts, Providers)
 ┃ ┣ 📜 sitemap.ts             # Dynamic SEO sitemap
 ┃ ┗ 📜 robots.ts              # Dynamic robots.txt
 ┃
 ┣ 📂 constants/               # 🔢 Hằng số cấu hình (màu sắc, kích thước, endpoints)
 ┣ 📂 data/                    # 📂 Static mock data cho sản phẩm và bài viết
 ┣ 📂 lib/                     # 🔧 Cấu hình Client (Supabase client...)
 ┣ 📂 stores/                  # 📦 Zustand stores (useCartStore, useToastStore)
 ┣ 📂 types/                   # 📋 TypeScript types (Database, Cart, Order)
 ┗ 📂 utils/                   # 🛠️ Helper functions (format tiền tệ, xử lý ngày tháng)
```

---

## ✨ Tính năng nổi bật

- **Landing Page Premium:** Hero section ấn tượng, kết hợp hiệu ứng cuộn GSAP, tôn vinh di sản và chất lượng của Bia Thầy Tu.
- **Giỏ hàng & Đặt hàng nhanh:** Tích hợp giỏ hàng nổi thông minh dùng Zustand. Checkout form đơn giản nhưng đầy đủ thông tin, tự động gửi email xác nhận.
- **Tối ưu hóa SEO:** Đạt điểm SEO tối đa nhờ sitemap.ts và robots.ts tự động, thẻ meta Open Graph phong phú, JSON-LD cấu trúc dữ liệu cho sản phẩm và bài viết.
- **Hệ thống vệ tinh SEO (Satellite Pages):** Các trang nội dung chuyên sâu được tối ưu hóa SEO on-page (ví dụ: `/food-pairing-bia-duc`, `/huong-dan-rot-bia-lua-mi`, `/bia-duc-nhap-khau`) giúp tăng lưu lượng truy cập tự nhiên.
- **Zalo Chat Widget:** Tích hợp nút chat Zalo trực tiếp, tối ưu chuyển đổi khách hàng tiềm năng.
- **Responsive & Mobile-first:** Hiển thị xuất sắc trên mọi thiết bị di động và máy tính bảng.

---

## 🚀 Hướng dẫn chạy Local

### 1. Cài đặt các gói phụ thuộc

```bash
npm install
```

### 2. Thiết lập biến môi trường

Tạo file `.env.local` ở thư mục gốc và cấu hình các thông số sau:

```env
# Database & Storage (Supabase) - BẮT BUỘC
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gửi Email SMTP (Xác nhận đơn hàng)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RECEIVER_EMAIL=order-recipient-email@gmail.com
```

### 3. Khởi động máy chủ phát triển

```bash
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:3000`

---

## 🚢 Deployment

Dự án có thể dễ dàng deploy lên **Vercel** hoặc **Netlify**:

1. Kết nối kho lưu trữ GitHub của bạn với Vercel/Netlify.
2. Cấu hình các Environment Variables trong Dashboard của nhà cung cấp dịch vụ tương tự như file `.env.local`.
3. Hệ thống sẽ tự động build mỗi khi bạn push code lên nhánh `main`.

---

## 📂 Tài liệu tham khảo & Quy chuẩn thương hiệu

Các tài liệu nghiên cứu về chiến lược giá, bộ tài liệu marketing và setup page được gom vào thư mục:
👉 [docs/references/](file:///c:/Users/QuangTran/Downloads/Full%20dự%20án/biathaytu-web/docs/references/)

- `Giá sản phẩm EC-BIATHAYTU.pdf`: Bảng giá sản phẩm chính thức.
- `EC_chien_luoc_gia_combo_euro_choice_bia_thay_tu.docx.pdf`: Chiến lược giá và gói combo sản phẩm.
- `facebook_page_setup_guide.md` & `fbtool_research.md`: Tài liệu hướng dẫn thiết lập fanpage và công cụ.

---

## 📝 Bản quyền

**Private** — Dự án thuộc quyền sở hữu độc quyền của Bia Thầy Tu. Mọi hành vi sao chép hay sử dụng mã nguồn khi chưa được phép đều bị nghiêm cấm.
