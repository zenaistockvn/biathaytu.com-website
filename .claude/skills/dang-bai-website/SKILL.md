---
name: dang-bai-website
description: Quy trình đăng một bài lên website của German Taste, cho cả biathaytu.com.vn (bài Kiến thức trong articles.json) và site Vang Đức Nhập Khẩu (bài Kiến thức trong blogs.ts). Gồm chọn site, dựng bài từ một chuyện, cấu trúc bài, title và meta, FAQ, link nội bộ, ảnh bìa, cách thêm vào dữ liệu, lệnh kiểm, nhánh và duyệt, việc sau khi bài lên. Dùng khi "đăng bài lên web", "viết bài Kiến thức", "thêm bài blog", "bài tuần này cho site vang", "đưa chuyện này lên website".
---

# Đăng bài website

Phiên bản 2026-11-12. Thứ tự đọc: `chuan-viet-bai` → `thuong-hieu-german-taste` → `ke-chuyen-thuong-hieu` → skill này. Website là nơi chứa **bài gốc**: đầy đủ, có nguồn, tìm được trên Google và được AI trích. Facebook và các kênh khác kể lại một phần của bài này.

## 1. Bài nào lên site nào

| Chủ đề | Site | Kênh máy quét |
|---|---|---|
| Benediktiner, Bitburger, Köstritzer, văn hóa bia Đức, bom 5L, món ăn với bia | biathaytu.com.vn | `web-bia` |
| Thörle, Rappenhof, giống nho, đọc nhãn, vang với món ăn, quà vang | Vang Đức Nhập Khẩu | `web-vang` |

Không đăng bài vang lên site bia và ngược lại. Một đề tài một bài: trước khi viết, tìm trong dữ liệu xem đã có bài trả lời câu hỏi này chưa; có rồi thì sửa bài cũ.

## 2. Bài website khác bài Facebook

Người đọc website tới từ một câu hỏi họ gõ vào ô tìm kiếm. Vì vậy:

- **Tiêu đề là câu hỏi hoặc câu trả lời**, có từ khóa chính ở đầu.
- **Đoạn đầu vẫn mở bằng một khoảnh khắc** (kiểu chuyện ở `ke-chuyen-thuong-hieu`), nhưng trong ba câu đầu phải cho thấy bài trả lời câu gì.
- **Mỗi tiêu đề con là một câu hỏi nhỏ; câu ngay dưới trả lời thẳng**, rồi mới kể và giải thích. Đoạn trả lời thẳng này là thứ Google và AI trích.
- **Chuyện nằm trong thân bài**: mỗi bài một chuyện chính từ kho chuyện, đặt ở phần mở hoặc phần giải thích.
- **Kết bằng việc làm được ngay** (nhiệt độ, cách rót, món đi cùng), rồi lời mời liên hệ đúng kiểu của site.

Khung:

```
Tiêu đề (câu hỏi hoặc câu trả lời)
Đoạn mở: khoảnh khắc + bài này trả lời câu gì
H2 câu hỏi 1 → câu trả lời thẳng → chuyện, chi tiết
H2 câu hỏi 2 → câu trả lời thẳng → giải thích
H2 mẹo dùng ngay
Câu hỏi thường gặp (2 đến 3 câu, không lặp ý thân bài)
Lời mời liên hệ
```

## 3. biathaytu.com.vn

**Dữ liệu**: thêm một mục vào `src/data/articles.json`.

| Trường | Quy định |
|---|---|
| `id` | UUID mới |
| `slug` | Không dấu, có từ khóa chính, không trùng; đổi slug phải thêm cặp cũ → mới vào `src/config/renamed-article-slugs.json` |
| `title` | 50 đến 60 ký tự, viết hoa đầu câu, từ khóa ở đầu. Chủ đề trang Kiến thức xếp theo chữ trong tiêu đề (`src/config/articleTopics.ts`): có "món" vào Món ăn kèm; "rót", "ly", "nhiệt độ", "bảo quản" vào Thưởng thức; "lịch sử", "nguồn gốc", số năm vào Lịch sử |
| `meta_description` | 120 đến 160 ký tự, trả lời luôn câu hỏi |
| `content` | HTML, chỉ `p`, `h2`, `h3`, `ul`, `ol`, `li`, `a`, `strong`, `table`. Không giá. Không emoji, mũi tên, gạch dài, ngoặc kép cong |
| `keywords` | 3 đến 5 cụm |
| `thumbnail_url`, `image_credit` | Do agent `image-curator` lo; ảnh bìa 16:9, không ảnh AI, có dòng trong `SOURCES.md` |
| `status` | `published`; bài nháp để giá trị khác |
| `tenant_id` | `biathaytu` |
| `created_at`, `updated_at` | Ngày viết; sửa đáng kể thì đổi `updated_at` |

**Quy tắc riêng**: không "đặt hàng", "mua ngay", "giao hàng"; lời mời là "Gọi tư vấn", "Mở Zalo", "Ghé showroom"; liên hệ lấy từ `COMPANY_CONFIG`; link nội bộ trỏ tới trang đang tồn tại, slug sản phẩm hiện tại.

**Kiểm**:

```bash
node .claude/skills/chuan-viet-bai/scripts/kiem-van.mjs src/data/articles.json --kenh web-bia --diff main
npm test
```

Rồi chạy agent `compliance-reviewer`. Test fail thì sửa bài, không tắt test.

**Nhánh và duyệt**: làm trên nhánh riêng, không commit thẳng `main`, không deploy. Gửi anh toàn văn bài và kết quả kiểm; anh duyệt mới gộp.

## 4. Site Vang Đức Nhập Khẩu

Quy trình tuần đầy đủ: `docs/agent-bai-kien-thuc.md`; đề bài: `docs/lich-bai-kien-thuc.md`. Tóm tắt:

**Dữ liệu**: trong `src/data/blogs.ts`.

1. Thêm mục vào `blogEntries`: `id` bằng `slug`, `title`, `excerpt`, `cover: ""`, `date`, `category` (một tên trong `BLOG_CATEGORIES`), `content` là HTML (`p`, `h2`, `table`, `a`).
2. Thêm mục cùng slug vào `blogSeoBySlug`: `seoTitle` tối đa 60 ký tự; `seoDescription` 120 đến 160; `updatedAt`; 3 đến 5 `keywords`; 2 câu `faq`; 2 đến 4 `relatedProductSlugs`.

**Quy tắc riêng**: gọi "anh chị", không "bạn"; 250 đến 500 chữ; tên chai qua `chai('slug')`, giá qua `gia('slug')`, `giaSet('Tên set')`, không gõ tay; không chấm than; số cồn ghi "theo hồ sơ hãng"; kết bằng một mẹo hoặc gợi ý một chai rồi `${contactCta}`.

**Kiểm**:

```bash
node .claude/skills/chuan-viet-bai/scripts/kiem-van.mjs src/data/blogs.ts --kenh web-vang --xung anh-chi --diff <nhánh nền>
node scripts/kiem-van-ai.cjs . .claude/skills/chuan-viet-bai/scripts/quy-tac.json
npx tsc --noEmit && npm run lint && npm run build
```

**Nhánh và duyệt**: nhánh `bai-kien-thuc-2026-tuan-WW`; không push, không gộp khi anh chưa duyệt; cập nhật trạng thái trong lịch bài.

## 5. Bài mẫu để soi

- Site vang: `vi-sao-riesling-kabinett-it-con` trong `blogs.ts`. Mở bằng một ngụm vang và con số trên nhãn, mỗi tiêu đề con một ý, kết bằng mẹo dùng ngay.
- Site bia: `bitburger-premium-pils-200-nam-bia-pils-vung-eifel` và `nguon-goc-bia-thay-tu-tu-vien-ettal` trong `articles.json`. Chuyện gốc gác kể theo mốc năm.

Đọc một bài mẫu cùng site trước khi viết bài mới để khớp giọng và độ dài.

## 6. Sau khi bài lên

1. Mở trang thật, kiểm tiêu đề, ảnh bìa, link, khối cảnh báo.
2. Thêm link từ một đến hai bài cũ liên quan sang bài mới.
3. Site bia: nếu bài thêm sự thật mới về thương hiệu, báo `geo-specialist` cập nhật `llms.txt`.
4. Ghi chuyện vừa dùng vào `ke-chuyen-thuong-hieu/references/kho-chuyen.md` (nguồn là slug bài mới) để các kênh khác kể lại được.
5. Chuyển sang `mot-chuyen-nhieu-kenh` để làm bản Facebook, video ngắn, Zalo.

## 7. Bảng kiểm

- [ ] Đúng site; chưa có bài nào trả lời câu hỏi này?
- [ ] Tiêu đề và meta đúng độ dài, từ khóa ở đầu?
- [ ] Ba câu đầu cho thấy bài trả lời câu gì?
- [ ] Dưới mỗi tiêu đề con, câu đầu trả lời thẳng?
- [ ] Có một chuyện chính, mọi chi tiết có nguồn?
- [ ] Giá: site bia không có; site vang chỉ qua hàm?
- [ ] Link nội bộ sống; ảnh bìa có nguồn?
- [ ] Máy quét, test, build đều qua?
- [ ] Trên nhánh riêng, đã gửi anh toàn văn, chưa gộp?
