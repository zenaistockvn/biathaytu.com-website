---
name: amc-content-publishing
description: Use when creating, scheduling, or debugging the content publishing pipeline — from content library through schedule rules to Facebook auto-publish
---

# AMC Content Publishing Pipeline

## Overview

**Core Principle:** Content flows through 4 stages: **Create → Approve → Schedule → Publish**. Each stage has its own status and can be triggered manually or automatically.

## Content Lifecycle

```
CREATE              SCHEDULE              PUBLISH
┌────────┐    ┌───────────┐    ┌────────────┐    ┌──────────┐
│ draft  │───▶│ scheduled │───▶│ posts      │───▶│ Facebook │
│        │    │           │    │ (scheduled)│    │ (published)│
└────────┘    └───────────┘    └────────────┘    └──────────┘
     │                              ▲
     │         Manual publish       │
     └──────────────────────────────┘
```

## Stage 1: Content Creation

**Table:** `generated_contents`
**Status:** `draft` → `approved` → `scheduled` → `published`

### Manual Entry
```
POST /api/content/generate
Body: { productId, platforms: ['facebook'], contentType: 'storytelling' }
```

### Batch Seeding (SQL)
```sql
INSERT INTO generated_contents (product_id, platform, caption, hashtags, content_format, ai_score, status, tenant_id)
VALUES (...);
```

**Caption Rules:**
- Use actual newline characters (`chr(10)`) — NOT literal `\n` text
- Frontend renders via `renderCaption()` splitting on `\n` → `<br/>`
- Facebook Graph API accepts real newlines in `message` field

## Stage 2: Scheduling

### Manual (User clicks "Đăng bài" in Library)
```
POST /api/posts
{ contentId, caption, hashtags, imageUrls, platform, publishNow: false, scheduledAt: "2026-04-05T08:00:00Z" }
```

### Automatic (Cron: daily-planner)
**Trigger:** `POST /api/cron/daily-planner` with `Authorization: Bearer ${CRON_SECRET}`
**Schedule:** Daily 00:00 Asia/Ho_Chi_Minh

**Algorithm:**
1. Get active `schedule_rules` for today's `day_of_week`
2. For each rule, query `generated_contents` where:
   - `platform` matches rule
   - `content_format` matches `content_type`
   - `status IN (draft, approved)` — skip already scheduled
3. Apply rotation:
   - `round_robin`: oldest first (FIFO queue)
   - `newest_first`: latest content first
   - `random`: random pick from top 50
4. Create `posts` row → mark content as `scheduled`

**Image Priority:**
1. `generated_contents.image_urls` (content-specific images)
2. `products.images` (product fallback images)
3. Empty array (text-only post)

## Stage 3: Publishing

### Manual Instant Publish
```
POST /api/posts { publishNow: true }
→ POST /api/publish { postId }
→ Facebook Graph API
```

### Automatic (Cron: auto-publisher)
**Trigger:** `POST /api/cron/auto-publisher`
**Schedule:** Every hour

**Algorithm:**
1. Query `posts WHERE status = 'scheduled' AND scheduled_at <= now()`
2. For each post:
   - Get `social_accounts` for matching `platform + tenant`
   - If no account → mark `needs_review`
   - Call `publishPhoto()` or `publishText()`
   - Success → `status: 'published'`, save `external_id`
   - Error (first time) → keep `scheduled`, save error_log (will retry next hour)
   - Error (second time) → `status: 'failed'`

## Debugging Checklist

| Symptom | Check |
|---------|-------|
| Cron not running | Verify `CRON_SECRET` env var, check Vercel Cron logs |
| No posts created by planner | Check `schedule_rules.is_active`, `days_of_week` includes today, content available |
| Content not picked up | Check `status` = draft/approved (not scheduled/published) |
| Publish fails silently | Check `social_accounts` exists & `is_active`, token not expired |
| Caption breaks on FB | Ensure real newlines in DB, not literal `\n` |
| Image missing in FB post | Check `image_urls` is `['https://...']`, not relative path |
| Post published but no analytics | `post_analytics` fetch cron not implemented yet |

## Schedule Rules Reference

| content_type | Matches content_format | Example |
|-------------|----------------------|---------|
| `tips` | Any educational | Brewing tips |
| `product_intro` | `product_showcase` | Product highlights |
| `promotion` | `promotion` | Flash sales |
| `viral` | `viral`, `engagement` | Trending content |
| `storytelling` | `storytelling` | Brand stories |
| `lifestyle` | `lifestyle` | Lifestyle moments |
| `food_pairing` | `food_pairing` | Beer + food combos |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Insert caption with Python/JS `\n` literal | Use real newline in SQL: `E'Line 1\nLine 2'` or `chr(10)` |
| Schedule without social account | Connect FB Page first at `/accounts` |
| Cron publishes expired content | daily-planner only picks `draft/approved` status |
| Images not showing on FB | Use full HTTPS URL, not `/images/...` relative path |
