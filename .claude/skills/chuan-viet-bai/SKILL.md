---
name: chuan-viet-bai
description: Chuẩn viết bài dùng chung cho Bia Thầy Tu (biathaytu.com.vn), Vang Đức (vangducnhapkhau.vn) và nội dung Facebook của AMC. Gồm bảng sự thật thương hiệu, luật quảng cáo rượu bia, giọng văn viết như người, quy định theo kênh và máy quét từ cấm. Dùng MỖI KHI viết, sửa hoặc duyệt chữ tiếng Việt về bia, vang của German Taste: bài Kiến thức, landing, mô tả sản phẩm, FAQ, title, meta, caption Facebook, seeding, kịch bản video. Từ khóa "viết bài", "viết caption", "sửa bài", "duyệt bài", "kiểm văn", "văn AI", "sự thật thương hiệu".
---

# Chuẩn viết bài dùng chung (German Taste)

Phiên bản 2026-11-12. Một bộ quy tắc cho cả ba dự án. Skill khác (storyselling, viral, humanizer, agent content-editor, agent bài Kiến thức) chỉ thêm phần riêng của kênh; chỗ nào trái với skill này thì skill này đúng.

## Thứ tự làm việc

1. Gọi tên **một câu hỏi** bài trả lời và **kênh** đăng: `web-bia`, `web-vang` hoặc `facebook`.
2. Đọc [references/su-that.md](references/su-that.md). Chỉ viết điều có trong đó hoặc trong file dữ liệu nó chỉ tới. Thiếu thì ghi `[cần xác minh: ...]` và hỏi anh, không đoán.
3. Đọc [references/kenh.md](references/kenh.md) phần của kênh: xưng hô, độ dài, CTA, có được ghi giá không.
4. Viết theo [references/viet-nhu-nguoi.md](references/viet-nhu-nguoi.md).
5. Tự rà theo [references/luat-ruou-bia.md](references/luat-ruou-bia.md).
6. Chạy máy quét, sửa tới khi còn 0 lỗi phải sửa:

```bash
node <thư mục skill>/scripts/kiem-van.mjs <file> --kenh web-bia
node <thư mục skill>/scripts/kiem-van.mjs src/data/blogs.ts --kenh web-vang --xung anh-chi --diff origin/master
echo "caption nháp" | node <thư mục skill>/scripts/kiem-van.mjs - --kenh facebook
```

7. Giao bài kèm: câu hỏi chính, kênh, kết quả máy quét, các chỗ `[cần xác minh]`.

Máy quét chỉ bắt được từ và dấu câu. Cách nói vòng, chi tiết bịa, ý sai thì phải tự đọc lại.

## Bốn điều không được sai

- **Không bịa.** Không tự nghĩ ra con số, năm, giải thưởng, lời khách, trải nghiệm cá nhân ("mình uống lần đầu ở..."), xếp hạng.
- **Không chép giá vào bài hay vào skill.** Giá đổi; nguồn giá ghi ở `su-that.md`.
- **Không khuyến khích uống, không gắn bia, vang với sức khỏe**, không nhắm người dưới 18.
- **Không văn quảng cáo**: bỏ tính từ, kể sự thật cụ thể (tên, năm, nơi, nhiệt độ).

## Nơi đặt skill và cách cập nhật

Bản gốc: `AMC-BIATHAYTU/.agents/skills/chuan-viet-bai/`. Bản sao y nguyên: `biathaytu.com-website/.claude/skills/chuan-viet-bai/` và `vangducnhapkhau.vn/.claude/skills/chuan-viet-bai/`. Sửa ở bản gốc, đổi dòng "Phiên bản" và `version` trong `scripts/quy-tac.json`, rồi chép cả thư mục sang hai repo kia. Ba bản phải cùng phiên bản.

`scripts/quy-tac.json` giữ cấu trúc `bannedPhrases` (nhóm → danh sách) và `watchPhrases` (danh sách) để `vangducnhapkhau.vn/scripts/kiem-van-ai.cjs` đọc được.
