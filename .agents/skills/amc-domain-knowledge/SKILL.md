---
name: amc-domain-knowledge
description: Architectural and feature knowledge for AI Marketing Center (AMC) to give AI agents deep context on project constraints.
---

# AI Marketing Center (AMC) — Domain Knowledge

> Khi làm việc với repo này, AI Agent **BẮT BUỘC** phải đọc và tuân theo tài liệu dưới đây trước khi viết bất kỳ dòng code nào.

---

## 1. Bối cảnh Dự án

AMC là nền tảng **tự động hóa marketing bằng AI** cho SME Việt Nam, niche đầu tiên là F&B (bia thủ công). Hệ thống thay thế hoàn toàn backend truyền thống (NestJS/Docker) bằng kiến trúc **Cloud-Native Serverless**:

| Component | Công nghệ |
|-----------|-----------|
| Fullstack | Next.js 15 (App Router — SSR + API Routes) |
| Database | Supabase PostgreSQL (RLS enabled) |
| Storage | Supabase Storage (bucket: `product-images`) |
| AI Content | Anthropic Claude 3.5 Sonnet & Haiku |
| AI Vision | Google Gemini 1.5 Flash |
| Hosting | Vercel (Hobby plan, Cron) |
| CSS | **Vanilla CSS** — KHÔNG dùng Tailwind |

---

## 2. Quy tắc Codebase (MUST FOLLOW)

### 2.1 Next.js App Router Patterns

- **Server Components** (`page.tsx`): Fetch data ở đây thông qua `src/lib/data.ts`. KHÔNG dùng `useEffect` cho data fetching.
- **Client Components**: Phải khai báo `'use client'` ở dòng đầu. Chỉ dùng cho tương tác (form, click, state).
- **Pattern đang áp dụng**: Server page fetch → truyền props xuống Client wrapper.

```
// ✅ Đúng pattern
app/library/page.tsx     → Server, gọi getProducts()
app/library/LibraryClient.tsx → Client, nhận props + render UI tương tác
```

### 2.2 Supabase Clients

| Context | File | Hàm | Khi nào dùng |
|---------|------|-----|-------------|
| Browser (client) | `src/lib/supabase/client.ts` | `createClient()` | Upload file, tương tác realtime |
| Server Component | `src/lib/data.ts` | `getProducts()`, `getRules()`, etc. | Fetch data cho SSR page |
| API Route / Cron | `src/lib/supabase/server.ts` | `createAdminSupabase()` | **Bypass RLS** — dùng `service_role_key` |

> ⚠️ **KHÔNG BAO GIỜ** import `createAdminSupabase` trong client component. Service role key chỉ chạy trên server.

### 2.3 Shared Layout

Mọi page phải wrap trong `<DashboardLayout>`:

```tsx
import DashboardLayout from '@/components/DashboardLayout';

export default async function SomePage() {
  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  );
}
```

### 2.4 CSS Rules

- Dùng CSS variables đã định nghĩa trong `globals.css` (VD: `var(--primary)`, `var(--surface)`, `var(--border)`)
- Dùng class đã có: `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.badge`, `.product-card`, `.rule-row`
- KHÔNG tạo thêm styled-components, Tailwind, hay CSS Modules
- Theme: **Bright Modern AI** — nền sáng `#F0F2F8`, glassmorphism, gradient rực rỡ. KHÔNG dùng Dark Mode.

---

## 3. Database Schema (Chi tiết)

### Multi-tenant Architecture
Mọi bảng có `tenant_id` FK → `tenants.id`. RLS enabled trên tất cả tables.
Demo tenant: `id = 'demo-tenant'`, `slug = 'demo-brewery'`.

### Bảng chính

#### `tenants`
| Column | Type | Note |
|--------|------|------|
| id | text PK | `gen_random_uuid()` |
| name | text | |
| slug | text UNIQUE | URL-safe |
| plan | text | Default `'free'` |

#### `products`
| Column | Type | Note |
|--------|------|------|
| id | text PK | |
| name | text | Tên SP |
| description | text? | |
| price | float8? | VNĐ |
| category | text? | VD: `'F&B'` |
| usp | text? | Unique Selling Point |
| images | jsonb | Array URLs `['https://...']` |
| ai_analysis | jsonb? | Kết quả Gemini Vision |
| last_posted_at | timestamptz? | Tracking |
| tenant_id | text FK | |

#### `brand_settings`
| Column | Type | Note |
|--------|------|------|
| tenant_id | text FK UNIQUE | 1:1 với tenant |
| brand_name | text | |
| brand_voice | text | **Dùng trong prompt AI** |
| colors | jsonb? | Brand colors |
| hashtags | jsonb? | Default hashtags |
| logo_url | text? | |

#### `schedule_rules`
| Column | Type | Note |
|--------|------|------|
| name | text | VD: `'Sáng FB Tips'` |
| time | text | Format `'HH:MM'` |
| platform | text | `facebook` / `instagram` / `tiktok` |
| content_type | text | `tips` / `product_intro` / `promotion` / `viral` |
| days_of_week | jsonb | Array int `[1,2,3,4,5]` (0=CN) |
| rotation | text? | Default `'round_robin'` |
| is_active | boolean | Default `true` |

#### `generated_contents`
| Column | Type | Note |
|--------|------|------|
| product_id | text FK | |
| platform | text | |
| caption | text | AI-generated caption |
| hashtags | text? | Space-separated |
| image_urls | jsonb | |
| ai_score | float8? | Claude Haiku score 0-10 |
| status | text | `'draft'` / `'approved'` / `'rejected'` / `'published'` |

#### `posts`
| Column | Type | Note |
|--------|------|------|
| product_id | text? FK | |
| platform | text | |
| caption | text | |
| image_urls | jsonb | |
| scheduled_at | timestamptz | Lịch đăng |
| published_at | timestamptz? | Null nếu chưa đăng |
| status | text | `'scheduled'` / `'published'` / `'failed'` |
| external_id | text? | Platform post ID |
| error_log | text? | |

#### Các bảng phụ
- `users`: email, name, role (`owner`/`admin`/`editor`), tenant_id
- `social_accounts`: platform, account_name, access_token, refresh_token, token_expiry
- `post_analytics`: post_id (UNIQUE FK), likes, comments, shares, reach, engagement
- `content_templates`: name, prompt_template, platforms (jsonb), best_time_slots

---

## 4. AI Engine (src/lib/ai/)

### `claude.ts` — Content Generation

```typescript
// INPUT
generateContent(productData: ProductData, platform: string, brandVoice: string, contentType: string)
// OUTPUT → { caption: string, hashtags: string[] }

// INPUT
reviewContent(caption: string, brandVoice: string)
// OUTPUT → { score: number, approved: boolean, suggestions: string[] }
```

**Models đang dùng:**
- `claude-sonnet-4-20250514` → Sinh caption
- `claude-haiku-4-20250514` → Chấm điểm

### `gemini.ts` — Vision Analysis

```typescript
// INPUT
analyzeProductImage(imageUrl: string)
// OUTPUT → { name, category, features[], colors[], mood, usp, rawDescription }
```

---

## 5. API Routes Reference

### Core AI Pipeline
```
POST /api/content/generate
Body: { productId: string, platforms: string[], contentType: string }
Response: { results: [{ caption, hashtags, ai_score, review, platform }] }
```

### Cron (Vercel)
```
POST /api/cron/daily-planner
Header: Authorization: Bearer ${CRON_SECRET}
Logic: Check schedule_rules → chọn sản phẩm → tạo content → insert vào posts
```

### CRUD Pattern (products, rules, posts)
```
GET    /api/{resource}         → list all (filter by tenant_id)
POST   /api/{resource}         → create
PATCH  /api/{resource}/[id]    → update
DELETE /api/{resource}/[id]    → delete
```

---

## 6. Environment Variables

| Var | Required | Note |
|-----|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ for API | Admin access (bypass RLS) |
| `ANTHROPIC_API_KEY` | ✅ for AI | Claude API |
| `GOOGLE_AI_API_KEY` | ✅ for AI | Gemini API |
| `CRON_SECRET` | ✅ for Cron | Vercel cron auth |

---

## 7. Quy trình Phát triển

Khi thêm feature mới:
1. Nếu cần bảng/cột DB mới → tạo migration SQL idempotent (`CREATE TABLE IF NOT EXISTS`)
2. Nếu cần API → tạo route trong `src/app/api/`
3. Nếu cần UI → tạo `page.tsx` (Server) + `*Client.tsx` (Client) trong `src/app/{feature}/`
4. Wrap page trong `<DashboardLayout>`
5. Thêm nav link trong `src/components/Sidebar.tsx`
