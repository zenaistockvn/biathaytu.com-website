---
name: thuong-hieu-german-taste
description: Chuẩn thương hiệu của German Taste, gồm kiến trúc thương hiệu (German Taste, Bia Thầy Tu, Benediktiner, Bitburger, Köstritzer, Vang Đức Nhập Khẩu, Thörle, Rappenhof), định vị và tính cách từng thương hiệu, cách viết tên, bản đồ kênh và page, nhận diện màu và chữ, dòng cảnh báo bắt buộc. Dùng khi cần biết "thương hiệu này nói giọng gì", "bài này đăng page nào", "tên viết thế nào cho đúng", "màu, font nào", khi làm ảnh bìa, banner, hồ sơ page, mô tả kênh, hoặc trước khi viết cho một thương hiệu lần đầu.
---

# Chuẩn thương hiệu German Taste

Phiên bản 2026-11-12. Skill này trả lời "chúng ta là ai và trông, nghe thế nào". Sự thật, luật và từ cấm ở skill `chuan-viet-bai`; cách kể chuyện ở `ke-chuyen-thuong-hieu`.

## 1. Kiến trúc thương hiệu

```
CÔNG TY TNHH GERMAN TASTE (nhà nhập khẩu, phân phối; germantaste.vn)
├── Bia Thầy Tu  → trang thương hiệu bia Benediktiner tại Việt Nam (biathaytu.com.vn)
│     ├── Benediktiner: Naturtrüb, Dunkel, Festbier
│     ├── Bitburger Premium Pils (có page riêng: Bitburger Vietnam)
│     └── Köstritzer Schwarzbier
└── Vang Đức Nhập Khẩu → chuyên trang vang (địa chỉ ở SITE_URL, site.ts)
      ├── Thörle (Saulheim, Rheinhessen)
      └── Rappenhof (Alsheim, Rheinhessen)
```

- "Bia Thầy Tu" là tên gọi tiếng Việt của Benediktiner và tên trang thương hiệu. Không dùng "Bia Thầy Tu" để gọi Bitburger hay Köstritzer.
- German Taste đứng sau, lộ diện ở thông tin pháp lý, liên hệ, page chung. Bài kể chuyện nói bằng giọng thương hiệu sản phẩm, không nói bằng giọng công ty.

## 2. Định vị và tính cách

| Thương hiệu | Một câu định vị | Tính cách | Chuyện hay kể | Không bao giờ |
|---|---|---|---|---|
| **Benediktiner (Bia Thầy Tu)** | Bia lúa mì theo công thức gốc dòng Biển Đức, cho bữa ăn có chủ ý | Điềm, ấm, chậm rãi; như người chủ nhà rót bia cho khách | Tu viện Ettal, men, vì sao bia đục, ly cao, món đi cùng | Giọng nhậu; "thầy tu nấu bia"; "bia Bavaria" |
| **Bitburger** | Pilsner của một gia đình nấu bia ở Bitburg từ 1817 | Gọn, sáng, dứt khoát; như cái đắng thanh của Pils | Wallenborn 1817, Theobald Simon 1883, "Bitte ein Bit" 1951, nhiệt độ rót | Viết tắt "WC"; lẫn với Benediktiner trong cùng bài |
| **Köstritzer** | Bia đen từ Bad Köstritz, Thüringen | Trầm, kiệm lời | Bia đen không có nghĩa là đắng | "Số 1"; chuyện chưa có nguồn |
| **Thörle** | Hai anh em làm vang hữu cơ trên đất đá vôi Saulheim | Trẻ, tỉ mỉ, nói bằng chi tiết kỹ thuật dễ hiểu | Dừng lên men ở 9,5%, đất vỏ hàu, vườn Hölle | Điểm chấm không nguồn |
| **Rappenhof** | Điền trang ở Alsheim, lập năm 1604, thành viên VDP từ 1971 | Cổ điển, chừng mực | Năm 1604, Cuvée 1604, Auslese 2014 | "12 đời" |

Tính cách chung của cả nhà: **người am hiểu, nói thật, không khoe**. Biết nhiều nhưng kể ít, mỗi lần một chuyện.

## 3. Người nghe

- Bia: nam 28 đến 45, hay tiếp khách, chọn kỹ; chủ nhà hàng, quán bia Đức.
- Vang: người mua vang để dùng trong bữa ăn và làm quà; doanh nghiệp đặt quà Tết. Gọi là "anh chị".
- Không nói với người dưới 18. Không nói với "dân nhậu".

## 4. Cách viết tên

| Đúng | Sai |
|---|---|
| Bia Thầy Tu | Bia thầy tu, BIA THẦY TU (trừ logo) |
| Benediktiner Naturtrüb, Dunkel, Festbier | Benedictiner, Benediktiner Weissbier khi nói về chai Naturtrüb trong cùng bài, "Bene." |
| Bitburger Premium Pils | Bitburger Pilsner Premium, Bit |
| Bitburger Football Edition | Bitburger WC |
| Köstritzer Schwarzbier | Kostritzer (chỉ dùng không dấu trong slug, hashtag) |
| Thörle, Rappenhof | Thorle (chỉ trong slug, hashtag) |
| tu viện Ettal | Tu Viện Ettal giữa câu |
| www.biathaytu.com.vn | biathaytu.com |
| German Taste | GermanTaste, German taste |

Thuật ngữ Đức giữ nguyên chữ, giải thích ngay lần đầu: Naturtrüb (đục tự nhiên), Dunkel (tối màu), Trocken (khô), feinherb (hơi ngọt), Spätburgunder (Pinot Noir trồng ở Đức).

## 5. Bản đồ kênh

| Kênh | Vai trò | Thương hiệu được đăng | Skill dùng |
|---|---|---|---|
| biathaytu.com.vn | Nơi chứa bài gốc về bia; không bán online | Benediktiner là chính; Bitburger, Köstritzer | `dang-bai-website` |
| Site Vang Đức Nhập Khẩu | Bài gốc về vang, có giá bán lẻ | Thörle, Rappenhof | `dang-bai-website` |
| Page Bia Thầy Tu | Kể chuyện Benediktiner | Chỉ Benediktiner; không Bitburger, không vang | `dang-bai-facebook` |
| Page Bitburger Vietnam | Kể chuyện Bitburger | Chỉ Bitburger | `dang-bai-facebook` |
| Page Sành Bia Đức, Bia Đức Hà Nội, Bia & Ẩm Thực | Kiến thức, món ăn | Mọi bia, mỗi bài một thương hiệu; không vang | `dang-bai-facebook` |
| Page Tiếp Khách Sành Điệu | Phong cách tiếp khách | Không đăng bia, rượu trực diện | `dang-bai-facebook` |
| Page German Taste | Trang công ty | Bia hoặc vang, mỗi bài một loại, một thương hiệu | `dang-bai-facebook` |
| Page Vang Đức Nhập Khẩu | Kể chuyện vang | Chỉ vang | `dang-bai-facebook` |
| Reels, TikTok, Instagram, Zalo OA, YouTube Shorts, Google Business Profile | Phát lại chuyện đã có | Theo page gốc | `mot-chuyen-nhieu-kenh` |

Danh sách page và luật chặn nằm trong mã: `AMC-BIATHAYTU/src/lib/content-routing.ts`. Bảng trên lệch với mã thì mã đúng, và sửa lại bảng.

## 6. Nhận diện

**Bia Thầy Tu** (nguồn: `biathaytu.com-website/DESIGN.md`, lấy theo nhận diện chính hãng Benediktiner)

| Vai trò | Màu |
|---|---|
| Xanh trời, hành động chính | `#004787` |
| Xanh đêm, khối nền tối và chữ | `#1C3157` |
| Vàng nhãn, chỉ đặt trên nền xanh | `#D6BD79` |
| Nền | `#FFFFFF`, xen `#F4F4F2` |
| Đỏ, chỉ cho cảnh báo | `#C8202A` |

Chữ: tiêu đề Roboto Serif bản rộng; menu, nút, nhãn Barlow Condensed; đoạn văn Barlow. Góc vuông, không đổ bóng, không chuyển sắc.

**Vang Đức Nhập Khẩu** (nguồn: `vangducnhapkhau.vn/src/app/globals.css`, chung hệ với germantaste.vn)

| Vai trò | Màu |
|---|---|
| Đỏ vang, màu thương hiệu | `#710014` |
| Vàng đồng | `#D4AE5C` |
| Nền ngà | `#FFFDF8`, `#F7F2E8` |
| Chữ | `#201D19` |
| Nền tối | `#1A1512` |

Chữ: tiêu đề Noto Serif Display; đoạn văn Be Vietnam Pro. Góc vuông, không bóng, không gradient.

**Bitburger, Köstritzer**: dùng ảnh và logo chính hãng, không tự phối màu mới. Không dùng xanh và vàng Benediktiner cho bài Bitburger.

**Ảnh**
- Thứ tự ưu tiên: ảnh thật anh cung cấp (showroom, sự kiện, bàn ăn) → ảnh chính hãng từ kho media Bitburger Braugruppe và hai nhà vang → ảnh giấy phép mở có ghi nguồn.
- Website không dùng ảnh AI. Facebook: không để máy vẽ lại chai, lon, nhãn, logo; chỉ ghép ảnh sản phẩm chính hãng lên nền, và duyệt bằng mắt (skill `amc-facebook-brand-safety`).
- Ảnh phải khớp chữ: đúng thương hiệu, đúng quy cách (chai, lon, bom), đúng màu bia (Naturtrüb vàng đục, Dunkel nâu, Pils vàng trong).
- Không có người dưới 18, không cảnh lái xe, không cảnh uống cạn, không dựng cảnh say.

## 7. Dòng bắt buộc

- Website bia: giữ khối cảnh báo trong `src/constants/compliance.ts`.
- Site vang: `RESPONSIBLE_NOTICE` trong `src/data/site.ts`.
- Facebook: dòng cuối caption, sau hashtag: "Người dưới 18 tuổi không được uống rượu, bia. Đã uống rượu, bia không lái xe."
- Liên hệ, giờ mở cửa, địa chỉ: lấy từ `company.ts` hoặc `site.ts`, không chép tay.

## 8. Tự kiểm một phút

1. Bài này của thương hiệu nào, có đúng một thương hiệu không?
2. Giọng có đúng tính cách ở mục 2 không?
3. Tên viết đúng bảng mục 4 chưa?
4. Kênh có được đăng thương hiệu này không (mục 5)?
5. Ảnh có khớp chữ không?
6. Có dòng bắt buộc chưa?
