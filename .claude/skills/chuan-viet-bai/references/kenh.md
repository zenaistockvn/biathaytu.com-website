# Quy định theo kênh

| | web-bia (biathaytu.com.vn) | web-vang (vangducnhapkhau.vn) | facebook (AMC) |
|---|---|---|---|
| Xưng hô | Không xưng; nói thẳng với người đọc | Gọi "anh chị", không xưng, không dùng "bạn" | "mình" và "bạn", hoặc "anh" tùy page |
| Độ dài | Theo câu hỏi; bài Kiến thức đủ trả lời, không kéo dài | 250 đến 500 chữ | Caption 150 đến 300 chữ |
| Giá | Không có trong thân bài | Chỉ qua `gia()`, `giaSet()` | Không ghi |
| CTA | "Gọi tư vấn", "Mở Zalo", "Ghé showroom" | Kết bằng một mẹo dùng ngay hoặc gợi ý một chai, rồi `${contactCta}` | Một câu hỏi mở, hoặc "lưu lại", "gửi cho người cần" |
| Dấu câu | Không emoji, mũi tên, gạch dài, ngoặc kép cong, "…" | Không chấm than, gạch dài, emoji | Emoji tối đa 2, không gạch dài |
| Title, meta | Title 50 đến 60 ký tự, meta 120 đến 160, từ khóa chính ở đầu | `seoTitle` tối đa 60, `seoDescription` 120 đến 160 | 3 đến 6 hashtag, sau CTA |
| Link | Link nội bộ tới trang tồn tại, slug hiện tại | Link tới bài khác hoặc trang chai | Không link trong caption; link ở bình luận đầu |

## web-bia

- Dữ liệu: `src/data/articles.json`, `src/data/products.json`. Cách thêm, sửa, gỡ bài: agent `content-editor`.
- Thẻ được dùng trong `content`: `p`, `h2`, `h3`, `ul`, `ol`, `li`, `a`, `strong`, `table`.
- Viết xong chạy agent `compliance-reviewer`, rồi `npm test`.

## web-vang

- Quy trình tuần, nhánh, báo cáo: `docs/agent-bai-kien-thuc.md`. Đề bài: `docs/lich-bai-kien-thuc.md`.
- Thêm bài trong `src/data/blogs.ts` (`blogEntries` và `blogSeoBySlug`), 2 câu `faq` không lặp ý thân bài.
- Mẹo chung (nhiệt độ, cách cất, rót mấy ly) được viết khi là kiến thức phổ thông, ghi "khoảng", "thường".

## facebook

- Khung 4 lớp, tỷ lệ nội dung, hashtag: skill `premium-storyselling`. Định dạng và giờ đăng: `viral-content-writing`.
- Mỗi bài một thương hiệu, một quy cách: skill `amc-facebook-brand-safety`.
- Seeding (bình luận, bài group): skill `amc-seeding-generator`; vẫn theo luật và bảng sự thật ở đây.
- Caption lưu vào `generated_contents` ở trạng thái `draft` để anh duyệt.
