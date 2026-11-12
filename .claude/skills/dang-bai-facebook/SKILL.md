---
name: dang-bai-facebook
description: Quy trình đăng một bài Facebook cho các page của German Taste (Bia Thầy Tu, Bitburger Vietnam, Sành Bia Đức, Bia Đức Hà Nội, Bia & Ẩm Thực, German Taste, Vang Đức Nhập Khẩu), từ chọn chuyện tới sau khi đăng. Gồm chọn page, giải phẫu một bài kể chuyện trên Facebook, dòng mở, ngắt dòng, hashtag, dòng cảnh báo, ảnh, lưu vào AMC, lên lịch, trả lời bình luận, và bảng kiểm trước khi đăng. Dùng khi "viết bài Facebook", "đăng fanpage", "caption", "lên lịch bài", "trả lời comment", "bài tuần này cho page".
---

# Đăng bài Facebook

Phiên bản 2026-11-12. Thứ tự đọc: `chuan-viet-bai` (sự thật, luật, từ cấm) → `thuong-hieu-german-taste` (giọng, page) → `ke-chuyen-thuong-hieu` (cách kể) → skill này (đưa chuyện lên Facebook).

## 1. Chọn page trước khi viết

| Page | Đăng gì | Xưng hô |
|---|---|---|
| Bia Thầy Tu | Chỉ Benediktiner | "mình" và "bạn" |
| Bitburger Vietnam | Chỉ Bitburger | "mình" và "bạn" |
| Sành Bia Đức, Bia Đức Hà Nội, Bia & Ẩm Thực | Mọi bia; mỗi bài một thương hiệu | "mình" và "bạn" |
| Tiếp Khách Sành Điệu | Chuyện tiếp khách; không bia, rượu trực diện | "mình" và "bạn" |
| German Taste | Bia hoặc vang; mỗi bài một loại, một thương hiệu | "German Taste" hoặc không xưng |
| Vang Đức Nhập Khẩu | Chỉ vang | Gọi "anh chị", không xưng |

Mã chặn sai page: `src/lib/content-routing.ts` (`validatePostBrandSafety`). Bài bị mã chặn thì sửa bài, không sửa mã.

## 2. Giải phẫu một bài kể chuyện

```
[Dòng mở]            Một câu. Có lúc, nơi hoặc vật. Đứng một mình.
(dòng trống)
[Dựng cảnh]          Hai đến bốn câu ngắn.
(dòng trống)
[Bước ngoặt]         Một câu, dưới mười chữ, đứng một mình.
(dòng trống)
[Giải nghĩa]         Ba đến năm câu. Sự thật thương hiệu nằm ở đây.
(dòng trống)
[Trở lại hiện tại]   Một đến hai câu: chi tiết ấy bây giờ ở đâu trong chai, trong ly.
(dòng trống)
[Kết]                Một câu hỏi mở, hoặc một hình ảnh.
(dòng trống)
#hashtag (3 đến 6)
Người dưới 18 tuổi không được uống rượu, bia. Đã uống rượu, bia không lái xe.
```

- **Dòng mở quyết định người ta có bấm "Xem thêm" không.** Trên điện thoại chỉ vài dòng đầu hiện ra. Không chào, không tên sản phẩm, không câu hỏi tu từ.
- **Đoạn ngắn, cách nhau một dòng trống.** Mỗi đoạn tối đa ba dòng trên màn hình điện thoại.
- **120 đến 250 chữ.** Chuyện cần dài hơn thì để bài website, Facebook kể phần hay nhất.
- **Emoji tối đa 2**, không ở dòng mở. Không gạch dài. Không viết hoa cả câu.
- **Không link trong caption.** Cần dẫn về bài website thì đặt link ở bình luận đầu tiên.
- **Không giá, không hotline, không "inbox đặt hàng".**
- **Kết**: câu hỏi phải trả lời được bằng chuyện của người đọc ("Nhà bạn hay ăn hải sản với gì?"), không phải câu đố, không rủ uống, không "tag", không "like nếu".

Ví dụ đầy đủ: `ke-chuyen-thuong-hieu/references/vi-du.md`.

## 3. Bốn dạng bài

| Dạng | Khi nào | Lưu ý |
|---|---|---|
| **Ảnh + chuyện** | Mặc định | Một ảnh khớp đúng chi tiết đang kể |
| **Album 3 đến 6 ảnh** | Chuyện có các bước (cách rót, đọc nhãn) | Mỗi ảnh một ý; caption vẫn theo khung mục 2, ngắn hơn |
| **Reels 20 đến 40 giây** | Chuyện một chi tiết, hiểu lầm | Kịch bản theo `mot-chuyen-nhieu-kenh`; có phụ đề |
| **Bài trả lời câu hỏi** | Khách hỏi thật, nhiều lần | Mở bằng chính câu hỏi; trả lời thẳng ở câu thứ hai |

## 4. Nhịp tuần

Tỷ lệ nội dung và số bài mỗi tuần theo `premium-storyselling` mục 3 và 5, hoặc lịch anh duyệt. Trong mỗi tuần của một page chính nên có đủ: một chuyện gốc gác hoặc văn hóa, một chuyện chi tiết sản phẩm, một chuyện bàn ăn, và một chuyện của mình khi có phiếu. Không đăng hai bài liền nhau cùng một kiểu chuyện.

## 5. Ảnh

- Ảnh thật anh gửi → ảnh chính hãng → ảnh ghép sản phẩm chính hãng trên nền đã duyệt. Không để máy vẽ lại chai, lon, nhãn, logo.
- Ảnh phải cho thấy đúng thứ bài đang kể: kể lớp men thì thấy đáy chai hoặc ly bia đục; kể ly cao thì thấy ly.
- Đúng thương hiệu, đúng quy cách, đúng màu bia. Không người dưới 18, không tay lái, không cảnh uống cạn.
- Kích thước: 1080×1350 (dọc) hoặc 1080×1080. URL ảnh phải là HTTPS đầy đủ.
- Kiểm bằng mắt và bằng lệnh theo skill `amc-facebook-brand-safety`.

## 6. Đưa vào AMC

1. Chạy máy quét: `echo "<caption>" | node .agents/skills/chuan-viet-bai/scripts/kiem-van.mjs - --kenh facebook`. Phải 0 lỗi phải sửa.
2. Lưu vào `generated_contents` với `status = 'draft'`: `product_id` đúng quy cách, `platform`, `caption` dùng xuống dòng thật (không phải chuỗi `\n`), `hashtags`, `content_format`, `image_urls`, `tenant_id`. Chi tiết: skill `amc-content-publishing`.
3. Gửi anh bản xem: caption nguyên văn, ảnh, page, giờ dự kiến, mã chuyện trong kho chuyện, kết quả máy quét.
4. Anh duyệt thì mới chuyển `approved` và lên lịch. Lưu ý: cron `daily-planner` hiện lấy cả bài `draft`; nếu page đang bật lịch tự động, giữ bản nháp ngoài bảng cho tới khi anh duyệt.
5. Trước giờ đăng chạy `node scripts/audit-facebook-scheduled.cjs` và `node scripts/audit-facebook-sku-alignment.cjs`.

Không tự đăng, không tự lên lịch khi anh chưa duyệt.

## 7. Sau khi đăng

- Đặt link bài website (nếu có) ở bình luận đầu tiên.
- Trả lời bình luận trong ngày, giọng như bài viết: ngắn, đúng câu hỏi, có một chi tiết thật.
- Hỏi giá, hỏi mua: không báo giá ở bình luận công khai; mời nhắn tin page hoặc Zalo để được tư vấn.
- Bình luận rủ uống nhiều, nhắc lái xe, người dưới 18: không hùa theo; trả lời trung tính hoặc ẩn.
- Câu hỏi hay của khách ghi vào phiếu chuyện (`ke-chuyen-thuong-hieu/references/phieu-chuyen.md`) để thành bài sau.
- Không dùng tài khoản khác tự khen bài của mình. Seeding (`amc-seeding-generator`) là việc anh quyết, và không được đóng vai khách thật.

## 8. Bảng kiểm trước khi gửi anh duyệt

- [ ] Đúng page, đúng một thương hiệu, đúng một quy cách?
- [ ] Tóm được chuyện trong một dòng; có khoảnh khắc và một bước ngoặt?
- [ ] Mọi tên, năm, số có trong `su-that.md`, kho chuyện hoặc phiếu chuyện?
- [ ] Dòng mở đứng riêng, không tên sản phẩm?
- [ ] 120 đến 250 chữ, đoạn ngắn, emoji tối đa 2?
- [ ] Không link, giá, hotline, lời rủ uống, câu like?
- [ ] 3 đến 6 hashtag; có dòng cảnh báo cuối bài?
- [ ] Ảnh khớp chữ và đã duyệt bằng mắt?
- [ ] Máy quét 0 lỗi phải sửa?
- [ ] Lưu `draft`, chưa lên lịch?
