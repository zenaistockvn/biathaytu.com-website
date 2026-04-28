---
description: Sản xuất content premium cho Bia Thầy Tu — đọc skill + viết + humanize + seed vào Supabase. Dùng khi tạo batch content mới.
---

# /content-pipeline — Quy trình sản xuất content Bia Thầy Tu

## Pre-flight
1. Đọc skill `premium-storyselling/SKILL.md` — toàn bộ brand DNA, product knowledge, tone, blacklist
2. Đọc skill `vietnamese-content-humanizer/SKILL.md` — 6-point checklist + AI word blacklist
3. Xác nhận mục tiêu: **bao nhiêu bài**, **chủ đề gì**, **platform nào**

## Step 1: Chọn chủ đề theo Calendar Framework
- Tuần 1: Nền thương hiệu (manifesto, giá trị, brand comparison)
- Tuần 2: Bối cảnh sử dụng (after-work, tiếp khách, pairing, quà biếu)
- Tuần 3: Kiến thức sản phẩm (tasting note, cách rót, nhiệt độ)
- Tuần 4: Chốt & chăm sóc (feedback, FAQ, set trải nghiệm)

## Step 2: Viết content theo khung 4 lớp
Mỗi bài PHẢI có:
1. **Bối cảnh** — mô tả cảnh, ai, ở đâu, làm gì
2. **Sản phẩm** — xuất hiện tự nhiên, tả bằng cảm giác
3. **Giá trị / Insight** — 1 câu "gật đầu"
4. **CTA mềm** — chọn từ thư viện CTA trong SKILL.md

## Step 3: Humanize (BẮT BUỘC)
Chạy qua checklist 6 điểm vietnamese-content-humanizer:
- [ ] Không có từ AI blacklist (tuy nhiên, do đó, đáng chú ý...)
- [ ] Có trải nghiệm cá nhân / bối cảnh cụ thể
- [ ] Giọng văn tự nhiên, đọc to nghe như người nói
- [ ] Không mở bài bằng câu hỏi tu từ
- [ ] Có variation nhịp câu (ngắn + dài xen kẽ)
- [ ] Kết bằng CTA hoặc insight, không bằng tóm tắt

## Step 4: Kiểm tra giá & sản phẩm
- Giá PHẢI theo biathaytu.com.vn (thùng/két/bom)
- Không nhắc giá lẻ chai/lon
- Product name chính xác (xem SKILL.md mục 4)

## Step 5: Seed vào Supabase
```sql
INSERT INTO generated_contents 
(product_id, platform, caption, hashtags, ai_score, status, content_format, tenant_id) 
VALUES ('[product_id]', '[platform]', '[caption]', '[hashtags]', [score], 'approved', '[format]', 'demo-tenant');
```

## Step 6: Verify
- Query `SELECT count(*) FROM generated_contents WHERE tenant_id = 'demo-tenant'`
- Kiểm tra không có từ blacklist: `WHERE caption LIKE '%45k%' OR caption LIKE '%giá sốc%'`

## content_format taxonomy:
- `brand_manifesto` — tuyên ngôn thương hiệu
- `brand_value` — giải thích giá trị 
- `brand_lifestyle` — lifestyle gắn brand
- `brand_experience` — trải nghiệm thưởng thức
- `brand_comparison` — so sánh 2 brand
- `occasion_guide` — hướng dẫn dịp dùng
- `occasion_hosting` — tiếp khách
- `occasion_sports` — xem trận / gathering
- `occasion_gifting` — quà biếu
- `lifestyle_moment` — khoảnh khắc đời thường
- `food_pairing_premium` — pairing ẩm thực
- `education_product` — kiến thức sản phẩm
- `education_guide` — hướng dẫn chọn / dùng
- `education_tipguide` — tip nhỏ
- `education_tutorial` — tutorial (rót bia, etc.)
- `social_proof` — feedback khách
- `trust_building` — hậu trường, quy trình
- `offer_soft` — set trải nghiệm, set tiệc
- `interactive_quiz` — quiz / game
- `interactive_game` — mini game
- `event_livestream` — event live
- `faq_handling` — FAQ
- `recap_milestone` — recap tháng
