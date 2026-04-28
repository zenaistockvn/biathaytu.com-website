---
name: amc-system-reference
description: Use when working on any AMC feature, debugging API routes, modifying cron jobs, or understanding the content publishing pipeline — comprehensive reference for all system modules and data flows
---

# AMC System Reference — All Features & Functions

## Overview

AMC (AI Marketing Center) is a serverless marketing automation platform for Bia Thầy Tu. This skill documents **every module, API, cron job, and data flow** so agents can quickly find how things work.

**Core Principle:** Library-first content → Schedule Rules → Auto-publish. AI generates content offline; the system selects and publishes automatically.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    NEXT.JS APP                       │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐    │
│  │  Pages    │  │  API      │  │  Cron Jobs     │    │
│  │  (SSR)    │  │  Routes   │  │  (Vercel)      │    │
│  └─────┬────┘  └─────┬────┘  └───────┬────────┘    │
│        │              │               │              │
│        ▼              ▼               ▼              │
│  ┌─────────────────────────────────────────────┐    │
│  │          Supabase (PostgreSQL + RLS)         │    │
│  │  products │ generated_contents │ posts       │    │
│  │  schedule_rules │ social_accounts │ ...      │    │
│  └─────────────────────────────────────────────┘    │
│                       │                              │
│                       ▼                              │
│              Facebook Graph API v21.0                │
└─────────────────────────────────────────────────────┘
```

## Module Reference

### 1. Content Library (`/library`)

**Purpose:** Kho 200 bài content marketing, quản lý bằng filter/search/edit.

| File | Role |
|------|------|
| `app/library/page.tsx` | Server Component — fetch data via `getProducts()` + `getGeneratedContents()` |
| `app/library/LibraryClient.tsx` | Client wrapper — filters, strategy stats, content cards |
| `components/ContentCard.tsx` | Render 1 bài content: caption, images, actions (Copy, Edit, Schedule) |
| `components/EditContentModal.tsx` | Inline edit caption + hashtags |
| `components/PickImageModal.tsx` | Swap content image from gallery |

**Data Flow:**
```
page.tsx (SSR) → getGeneratedContents() → Supabase
  → LibraryClient (client) → ContentCard[] → User actions
```

**Key Functions:**
- `renderCaption(text)`: Split `\n` → `<br/>` elements (avoids CSS pre-wrap + webkit-line-clamp conflict)
- `getContentImages(content, productName)`: Intelligent image mapping — product + strategy → best image
- `copyCaption()`: Copy caption + hashtags to clipboard
- Filter by: Product, Strategy (content_format), Platform

---

### 2. Content Publishing Pipeline

**Flow:** Content → Schedule → Publish

```
┌──────────────┐    ┌───────────┐    ┌──────────────┐
│ generated_   │───▶│   posts   │───▶│  Facebook    │
│ contents     │    │           │    │  Graph API   │
│ (status:     │    │ (status:  │    │              │
│  draft)      │    │  scheduled│    │              │
└──────────────┘    │  →published)   └──────────────┘
                    └───────────┘
```

#### A. Manual Publishing (`/api/posts` + `/api/publish`)

```typescript
// POST /api/posts — Create post from content library
{
  contentId: string,
  productId: string,
  platform: 'facebook' | 'instagram' | 'tiktok',
  caption: string,
  hashtags?: string,
  imageUrls: string[],
  publishNow: boolean,      // true = publish immediately
  scheduledAt?: string       // ISO date for scheduling
}

// POST /api/publish — Actually send to Facebook
{ postId: string }
// → Fetches post → Gets social_account → Calls FB API → Updates status
```

#### B. Automatic Publishing (Cron Jobs)

**`/api/cron/daily-planner`** — Runs daily at 00:00 Asia/Ho_Chi_Minh
1. Fetch all `tenants`
2. For each tenant: get active `schedule_rules` matching today's `day_of_week`
3. For each rule: query `generated_contents` matching `platform` + `content_format` + `status IN (draft, approved)`
4. Apply rotation strategy: `round_robin` (oldest first), `newest_first`, or `random`
5. Create `posts` row with `status: 'scheduled'`
6. Mark content as `status: 'scheduled'`

**`/api/cron/auto-publisher`** — Runs every hour
1. Query `posts` where `status = 'scheduled'` AND `scheduled_at <= now()`
2. For each post: get `social_accounts` for matching platform + tenant
3. Call Facebook Graph API (`publishPhoto` or `publishText`)
4. Update post: `status: 'published'`, save `external_id`
5. On error: retry once, then mark `status: 'failed'`

---

### 3. Facebook Integration (`src/lib/facebook.ts`)

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `getOAuthUrl()` | `/dialog/oauth` | Build OAuth consent URL |
| `exchangeCodeForToken()` | `/oauth/access_token` | Code → short-lived → long-lived token (60 days) |
| `getUserPages()` | `/me/accounts` | List pages user manages |
| `publishPhoto()` | `/{pageId}/photos` | Post photo + caption |
| `publishText()` | `/{pageId}/feed` | Post text-only |
| `getPostInsights()` | `/{postId}/insights` | Fetch impressions, reach, engagement |

**Graph API Version:** v21.0
**Scopes:** `pages_manage_posts`, `pages_read_engagement`, `pages_read_user_content`

---

### 4. AI Studio (`/studio`)

**Purpose:** Interactive content generation hub with prompt templates, brand DNA, ad specs.

| Data Source | Table | Records |
|-------------|-------|---------|
| Image Prompts | `image_prompts` | 22 |
| Brand DNA | `brand_dna` | 2 (Bitburger, Benediktiner) |
| Ad Platform Specs | `ad_platform_specs` | 11 |
| Ad Angles | `ad_angles` | 5 |
| Content Tips | `content_tips` | 24 |

---

### 5. Schedule Rules (`/rules`)

**Purpose:** Define autopilot publishing rules.

| Field | Type | Example |
|-------|------|---------|
| `name` | text | "Sáng FB Tips" |
| `time` | text (HH:MM) | "08:00" |
| `platform` | text | "facebook" |
| `content_type` | text | "storytelling" |
| `days_of_week` | jsonb | [1,2,3,4,5] |
| `rotation` | text | "round_robin" / "random" / "newest_first" |

**API Routes:**
- `GET /api/rules` — List all rules
- `POST /api/rules` — Create rule
- `PATCH /api/rules/[id]` — Update
- `DELETE /api/rules/[id]` — Delete

---

### 6. Calendar (`/calendar`)

**Purpose:** Visual calendar of scheduled/published posts.

**Data Source:** `content_calendar` table (30 entries) + `posts` table

---

### 7. Blog SEO (`/blog`)

**Purpose:** Long-form SEO articles for organic traffic.

**Data Source:** `seo_articles` table (4 articles)

---

### 8. Analytics (`/analytics`)

**Purpose:** Post performance tracking.

**Data Source:** `post_analytics` table (currently 0 rows — needs cron to fetch from FB)

---

### 9. Social Accounts (`/accounts`)

**Purpose:** Connect/manage Facebook Pages via OAuth.

**Flow:**
```
User clicks Connect → OAuth dialog → Callback with code
→ exchangeCodeForToken() → getUserPages()
→ Select page → Save to social_accounts table
```

---

### 10. Activity Log (`/activity`)

**Purpose:** Audit trail of all user actions.

**Data Source:** `activity_logs` table
**Logger:** `src/lib/activity-log.ts`

---

### 11. Authentication (`/login`)

**Method:** Supabase Auth (email/password)
**Admin:** `admin@biathaytu.com`
**Auth middleware:** `src/lib/auth.ts` — extracts tenant_id from JWT or defaults to `demo-tenant`

---

## API Routes Quick Reference

| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/api/products` | CRUD products |
| PATCH/DELETE | `/api/products/[id]` | Update/delete product |
| GET/POST | `/api/rules` | CRUD schedule rules |
| PATCH/DELETE | `/api/rules/[id]` | Update/delete rule |
| GET/POST | `/api/posts` | CRUD posts |
| POST | `/api/publish` | Publish post to Facebook |
| POST | `/api/content/generate` | AI content generation |
| POST | `/api/cron/daily-planner` | Cron: plan daily posts |
| POST | `/api/cron/auto-publisher` | Cron: publish due posts |
| GET/POST | `/api/accounts` | Social account management |
| GET/POST | `/api/auth/*` | Login/logout/callback |
| GET | `/api/insights` | Dashboard stats |

## Database Quick Reference

| Table | Rows | Purpose |
|-------|------|---------|
| `tenants` | 1 | Multi-tenant root |
| `users` | 1 | Admin accounts |
| `products` | 14 | Beer SKUs |
| `generated_contents` | 200 | Content library |
| `posts` | 7 | Published/scheduled posts |
| `schedule_rules` | 8 | Automation rules |
| `social_accounts` | 0 | Connected FB pages |
| `post_analytics` | 0 | Post metrics |
| `content_calendar` | 30 | Editorial calendar |
| `seo_articles` | 4 | SEO blog posts |
| `brand_settings` | 1 | Brand voice config |
| `brand_dna` | 2 | Brand identity data |
| `content_templates` | 6 | AI prompt templates |
| `image_prompts` | 22 | Image generation prompts |
| `ad_platform_specs` | 11 | Ad format specs |
| `ad_angles` | 5 | Ad creative angles |
| `content_tips` | 24 | Content writing tips |
| `activity_logs` | 5 | User action audit trail |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Import `createAdminSupabase` in client component | Use `createClient()` from `@/lib/supabase/client` |
| Fetch data with `useEffect` in page | Use server component `page.tsx` + `getProducts()` |
| Use `whiteSpace: pre-wrap` with `webkit-line-clamp` | Use `renderCaption()` with `<br/>` elements |
| Hardcode `tenant_id` | Use `getAuthContext(request)` or `DEFAULT_TENANT_ID` |
| Missing `verifyCronAuth()` in cron routes | Always check `Authorization: Bearer ${CRON_SECRET}` |
| Only publish first image to FB | Known limitation — `publishPhoto()` takes single URL |
