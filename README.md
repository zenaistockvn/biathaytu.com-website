# 🍺 Bia Thầy Tu — Website & AI Marketing Center

> Website bán lẻ B2C chính thức + Bảng điều khiển AI Marketing tự động cho thương hiệu Bia Thầy Tu (Bia Đức nhập khẩu cao cấp).

---

## 📐 Tech Stack

| Layer | Công nghệ | Vai trò |
|---|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) | Fullstack SSR/SSG |
| **Language** | TypeScript 5 | Strict type safety |
| **Styling** | Vanilla CSS + CSS Modules | Premium UI, Glassmorphism |
| **State** | Zustand | Cart, Toast global store |
| **Database** | Supabase (PostgreSQL + RLS) | Products, Orders, Content, Accounts |
| **Auth** | Supabase Auth + Middleware | Session-based, protected AMC routes |
| **AI** | DeepSeek V4 / Anthropic / Google Gemini | Content generation, SEO, Analytics |
| **Social** | Meta Graph API | Facebook/Instagram publishing |
| **Email** | Nodemailer | Order confirmation (SMTP) |
| **Hosting** | Vercel | Serverless, Edge caching, Cron jobs |

---

## 📂 Cấu trúc thư mục

```
📦 src/
 ┣ 📂 app/
 ┃ ┣ 📂 (web)/                  # 🛒 Website bán lẻ B2C
 ┃ ┃ ┣ 📂 components/           #   → WebHeader, WebFooter, ProductCard, ZaloCTA...
 ┃ ┃ ┣ 📂 san-pham/             #   → Trang sản phẩm + chi tiết [slug]
 ┃ ┃ ┣ 📂 blog/                 #   → Blog / Kiến thức bia
 ┃ ┃ ┣ 📂 dat-hang/             #   → Trang đặt hàng (Checkout)
 ┃ ┃ ┣ 📂 thuong-hieu/          #   → Giới thiệu thương hiệu
 ┃ ┃ ┣ 📂 lien-he/              #   → Liên hệ + Zalo CTA
 ┃ ┃ ┗ 📂 [satellite-pages]/    #   → Các trang SEO satellite
 ┃ ┃
 ┃ ┣ 📂 amc/                    # 🎯 AI Marketing Center (Admin Dashboard)
 ┃ ┃ ┣ 📂 library/              #   → Content Library (CRUD bài viết)
 ┃ ┃ ┣ 📂 calendar/             #   → Lịch đăng bài tự động
 ┃ ┃ ┣ 📂 studio/               #   → AI Content Studio (Generate)
 ┃ ┃ ┣ 📂 analytics/            #   → Facebook Insights Dashboard
 ┃ ┃ ┣ 📂 inbox/                #   → Social Inbox (Quản lý tin nhắn)
 ┃ ┃ ┣ 📂 gallery/              #   → Thư viện hình ảnh
 ┃ ┃ ┣ 📂 accounts/             #   → Quản lý tài khoản social
 ┃ ┃ ┣ 📂 orders/               #   → Quản lý đơn hàng
 ┃ ┃ ┣ 📂 rules/                #   → Brand rules & AI guidelines
 ┃ ┃ ┗ 📂 video-prompts/        #   → Video prompt templates
 ┃ ┃
 ┃ ┣ 📂 api/                    # ⚡ Backend API Routes
 ┃ ┃ ┣ 📂 ai/                   #   → AI content generation endpoints
 ┃ ┃ ┣ 📂 content/              #   → Content CRUD + SEO + bulk operations
 ┃ ┃ ┣ 📂 cron/                 #   → Scheduled jobs (daily-planner, auto-publisher)
 ┃ ┃ ┣ 📂 auth/                 #   → OAuth flows (Facebook, Instagram, YouTube...)
 ┃ ┃ ┣ 📂 order/                #   → Tạo đơn hàng (B2C)
 ┃ ┃ ┣ 📂 orders/               #   → Quản lý đơn hàng (AMC)
 ┃ ┃ ┣ 📂 publish/              #   → Đăng bài lên Facebook/Instagram
 ┃ ┃ ┗ 📂 insights/             #   → Facebook Insights fetcher
 ┃ ┃
 ┃ ┣ 📂 login/                  # 🔐 Authentication page
 ┃ ┣ 📜 globals.css              # Design tokens & global styles
 ┃ ┣ 📜 web.css                  # Website-specific styles
 ┃ ┣ 📜 layout.tsx               # Root layout
 ┃ ┣ 📜 sitemap.ts               # Dynamic SEO sitemap
 ┃ ┗ 📜 robots.ts                # Dynamic robots.txt
 ┃
 ┣ 📂 components/                # 🧩 AMC shared components (Sidebar, Modals...)
 ┣ 📂 lib/                       # 🔧 Utilities (Supabase clients, AI, Facebook API...)
 ┣ 📂 stores/                    # 📦 Zustand stores (useCartStore, useToastStore)
 ┣ 📂 types/                     # 📋 TypeScript types (Database, domain models)
 ┣ 📂 constants/                 # 🔢 App constants
 ┗ 📜 middleware.ts               # 🛡️ Auth middleware (public/protected route guard)
```

---

## ✨ Tính năng

### 🛒 Website bán lẻ (B2C)

- **Landing page** premium với hero section, featured products, brand story
- **Catalog sản phẩm** với filter, giỏ hàng (Zustand), checkout form
- **SEO tối ưu** — Sitemap, Robots.txt, JSON-LD, Open Graph, meta tags đầy đủ
- **Satellite pages** — Các trang content SEO (bia-duc-nhap-khau, food-pairing...)
- **Blog & Kiến thức** — Nội dung từ Supabase, SSG/ISR
- **Responsive** — Mobile-first, dark premium aesthetic
- **Zalo CTA** — Tích hợp nút chat Zalo trên toàn bộ giao diện

### 🎯 AI Marketing Center (AMC)

- **Content Studio** — AI tạo bài viết, SEO articles, ad copy (DeepSeek V4)
- **Content Library** — CRUD, batch operations, content multiplication
- **Auto Publisher** — Lên lịch & tự động đăng Facebook/Instagram (Cron)
- **Social Inbox** — Quản lý tin nhắn fanpage tập trung
- **Analytics Dashboard** — Facebook Insights, post performance tracking
- **Gallery** — Quản lý reference assets & hình ảnh marketing
- **Order Management** — Xem, cập nhật trạng thái đơn hàng B2C
- **Brand Rules** — Quản lý guideline cho AI content generation

---

## 🚀 Cài đặt & Chạy Local

### 1. Clone & Install

```bash
git clone https://github.com/zenaistockvn/biathaytu.com-website.git
cd biathaytu.com-website
npm install
```

### 2. Cấu hình Environment

Copy `.env.example` → `.env.local` và điền các giá trị:

```env
# Database (Supabase) — BẮT BUỘC
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
DEEPSEEK_API_KEY=sk-your-deepseek-key

# Facebook (cho Auto Publisher)
FACEBOOK_APP_ID=your-fb-app-id
FACEBOOK_APP_SECRET=your-fb-app-secret

# Vercel Cron
CRON_SECRET=your-random-secret

# Token Encryption (AES-256-GCM)
TOKEN_ENCRYPTION_KEY=your-64-hex-char-key
```

### 3. Chạy Development

```bash
npm run dev
```

Truy cập:
- 🌐 Website: `http://localhost:3000`
- 🎯 AMC Dashboard: `http://localhost:3000/amc` (yêu cầu đăng nhập)

---

## 🚢 Deployment (Vercel)

1. Push code lên nhánh `main`
2. Vercel tự động build với Next.js 16 + Turbopack
3. **Cấu hình trên Vercel Dashboard:**
   - Thêm tất cả Environment Variables từ `.env.example`
   - Vercel Cron Jobs đã cấu hình trong `vercel.json`:
     - `daily-planner` — 17:00 UTC hàng ngày
     - `auto-publisher` — 14:00 UTC hàng ngày
     - `insights/fetch` — 06:00 UTC hàng ngày

---

## 🔐 Routing & Authentication

| Route Pattern | Quyền truy cập | Mô tả |
|---|---|---|
| `/` | Public | Landing page |
| `/san-pham/**` | Public | Sản phẩm |
| `/blog/**`, `/kien-thuc/**` | Public | Blog, kiến thức |
| `/thuong-hieu`, `/lien-he` | Public | Thương hiệu, liên hệ |
| `/login` | Public | Đăng nhập |
| `/amc/**` | 🔒 Protected | AI Marketing Center |
| `/api/cron/**` | Cron Secret | Scheduled jobs |

---

## 📝 License

**Private** — Thuộc quyền sở hữu của Bia Thầy Tu. Mọi hành vi sao chép mã nguồn không được phép.
