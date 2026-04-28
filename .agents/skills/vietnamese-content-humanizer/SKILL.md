---
name: vietnamese-content-humanizer
description: Humanize AI-generated Vietnamese content — 6-point checklist, AI word blacklist, prompt context framework, output debugging. Use EVERY TIME you generate or review Vietnamese content.
---

# Vietnamese Content Humanizer

Bạn là chuyên gia biến output AI thành văn viết tự nhiên tiếng Việt. Skill này **BẮT BUỘC** áp dụng mỗi khi sinh hoặc review content tiếng Việt trong hệ thống AMC.

> ⚠️ **Nguyên tắc cốt lõi:** AI là công cụ viết nháp 80%. Con người sửa 20% còn lại — thêm trải nghiệm cá nhân, cảm xúc thật, và giọng thương hiệu. Output KHÔNG BAO GIỜ được copy-paste nguyên.

---

## 1. Prompt Context Framework — 5 yếu tố BẮT BUỘC

Mỗi prompt sinh content tiếng Việt PHẢI chứa đủ 5 yếu tố sau. Thiếu bất kỳ yếu tố nào → output sẽ chung chung.

| # | Yếu tố | Mô tả | Ví dụ F&B/Bia |
|---|--------|-------|---------------|
| 1 | **CÁI GÌ** | Viết content gì, chủ đề gì | "Viết bài giới thiệu bia Benediktiner Weissbier" |
| 2 | **CHO AI** | Đối tượng đọc cụ thể | "Nam 25-35, dân văn phòng Sài Gòn, thích thử món mới cuối tuần" |
| 3 | **GIỌNG VĂN** | Tone & style cụ thể | "Sang trọng nhưng gần gũi, như anh bạn sành bia đang giới thiệu" |
| 4 | **YÊU CẦU CHI TIẾT** | Độ dài, cấu trúc, số lượng ý | "Dài 300 chữ, có 1 câu hook mở đầu, 2 điểm nổi bật sản phẩm, 1 CTA" |
| 5 | **ĐIỀU KHÔNG MUỐN** | Blacklist rõ ràng | "Không dùng từ 'tuy nhiên', 'do đó'. Không viết kiểu bullet point. Không mở bài bằng 'Trong thế giới hiện đại...'" |

### Ví dụ prompt đầy đủ cho AMC:

```
Viết caption Facebook giới thiệu bia Bitburger Premium Pils.

Đối tượng: Nam 25-40 tuổi, dân văn phòng Sài Gòn và Hà Nội, thích bia
nhưng chưa biết nhiều về bia Đức. Hay uống bia cuối tuần với bạn bè.

Giọng văn: Như anh bạn sành bia đang rủ đi uống. Sang trọng nhưng
không xa cách. Dùng "mình" và "bạn".

Yêu cầu: Dài 150-200 chữ. Mở bài bằng tình huống thực tế. Nhắc đến
hương vị cụ thể (malt, hoa bia). Kết bằng CTA nhẹ nhàng.

KHÔNG: Không dùng "tuy nhiên", "do đó", "đáng chú ý". Không liệt kê
bullet point. Không dùng từ "thưởng thức" quá 1 lần. Không mở bài bằng
câu hỏi tu từ kiểu "Bạn đã bao giờ...?"
```

---

## 2. Checklist 6 điểm nhận diện "Văn AI" (MUST-CHECK)

Sau khi sinh content, **BẮT BUỘC** chạy qua 6 tiêu chí sau. Chỗ nào không đạt → sửa trước khi trả output.

### ✅ Tiêu chí 1: Từ nối tự nhiên

AI hay dùng từ nối sách giáo khoa. Người Việt nói chuyện khác.

| ❌ Từ nối AI | ✅ Từ nối tự nhiên |
|-------------|-------------------|
| Tuy nhiên | Nhưng mà / Cơ mà / Thế nhưng |
| Do đó | Thế nên / Nên là |
| Ngoài ra | Với lại / Rồi còn |
| Sau đó | Xong rồi / Rồi / Thế là |
| Điều đáng chú ý là | Cái hay ở đây là |
| Có thể kết luận rằng | Chốt lại thì / Nói chung là |
| Mặc dù vậy | Dù vậy thì / Kệ, dù gì thì |
| Trước hết | Đầu tiên là / Cái đầu tiên |
| Cuối cùng | Rồi cuối cùng thì |

**Bảng đầy đủ:** Xem [references/ai-word-replacements.md](references/ai-word-replacements.md)

### ✅ Tiêu chí 2: Từ đệm tự nhiên

Văn nói tiếng Việt LUÔN có từ đệm. Thiếu từ đệm = robot đọc báo cáo.

**Từ đệm nên rắc đều bài:**
- Đầu câu: "Tự dưng", "Nói thật là", "Ừ thì", "Thú thật"
- Giữa câu: "kiểu", "đại khái", "tầm"
- Cuối câu: "luôn á", "thôi á", "đó", "nha", "nghen"
- Cảm thán: "Ơ", "Ủa", "Trời ơi", "Wow"

**Ví dụ:**
- ❌ `"Video thu về 48.2K tim."` 
- ✅ `"Video được tận 48.2K tim luôn á."`

### ✅ Tiêu chí 3: Cảm xúc cá nhân

AI viết rất "sạch" — toàn phân tích khô khan. Content hay PHẢI có cảm xúc.

**Cụm từ thêm cảm xúc:**
- Ngạc nhiên: "Mình xem xong mà sốc luôn", "Hoá ra...", "Ai ngờ..."
- Thích thú: "Ngon lắm luôn", "Đỉnh thật sự", "Cái này phải thử"
- Tò mò: "Mình cũng tò mò nên thử luôn", "Ban đầu mình cứ tưởng..."
- Hài hước: "Mặt mình kiểu ?? :D ??", "Khổ nỗi...", "Buồn cười ghê"

**Ví dụ:**
- ❌ `"Phân tích cho thấy yếu tố chính là giá trị vượt kỳ vọng."`
- ✅ `"Ngồi nghiên cứu 1 hồi thì mình mới vỡ lẽ ra, hoá ra cái khiến clip này viral chính là vì giá rẻ mà ngon ngoài sức tưởng tượng luôn."`

### ✅ Tiêu chí 4: Chủ ngữ - Vị ngữ đầy đủ

AI hay viết câu cụt, ngắt vụn — giống liệt kê gạch đầu dòng, không giống người kể chuyện.

- ❌ `"Không nhạc. Không edit. Rất đơn giản. Nhưng vẫn viral."`
- ✅ `"Clip này không nhạc, không edit, đơn giản lắm. Thế mà nó vẫn viral mạnh."`

**Quy tắc:** Mỗi câu/mệnh đề phải có chủ ngữ rõ ràng, nối bằng từ nối tự nhiên. Đọc lên phải nghe như đang nói chuyện.

### ✅ Tiêu chí 5: Không dùng từ trừu tượng

**Phép thử "Bác bán phở":** Đọc câu lên — bác bán phở có hiểu không? Nếu không → sửa.

| ❌ Từ trừu tượng / chuyên ngành | ✅ Cách nói bình thường |
|--------------------------------|----------------------|
| Khoảng cách kỳ vọng | Rẻ ngoài sức tưởng tượng |
| Giá trị vượt kỳ vọng | Được nhiều hơn mình tưởng |
| Tối ưu hoá | Làm cho tốt hơn |
| Tạo sự tò mò | Nói cụ thể tò mò VỀ CÁI GÌ |
| Insight | Điều hay ho mình phát hiện ra |
| Engagement | Lượng tương tác |
| Narrative arc | Mạch chuyện |
| Brand awareness | Khiến nhiều người biết đến thương hiệu |
| Hiệu ứng leo thang | (Nói cụ thể hiệu ứng gì) |

### ✅ Tiêu chí 6: Nhịp bài có biến tấu

Bài AI viết mọi đoạn dài bằng nhau, đều như đếm nhịp. Bài con người có nhịp thở.

**Pattern đúng:**
```
[Đoạn dài — kể chuyện, giải thích]
→ [Câu ngắn kèm cảm xúc: "Nói lại thấy buồn."]
→ [Đoạn dài — tiếp tục phát triển ý]
→ [Câu ngắn: "Mà đúng thật."]
```

Nếu đọc lại bài mà thấy đều đều → thêm vài câu ngắn xen kẽ để tạo nhịp.

---

## 3. Bảy lỗi phổ biến của AI viết tiếng Việt

Khi review output, kiểm tra 7 lỗi sau. Mỗi lỗi kèm cách sửa cụ thể.

| # | Lỗi | Dấu hiệu | Cách sửa |
|---|-----|----------|---------|
| 1 | Câu ngắt vụn, thiếu từ nối | Nhiều câu 3-5 chữ liên tiếp | Nối thành câu dài, thêm từ nối tự nhiên |
| 2 | Nhảy thẳng vào kết luận | Không có bối cảnh trước khi phân tích | Thêm bối cảnh thị trường/tình huống → rồi mới vào ý chính |
| 3 | Thiếu "tính con người" | Đúng kiến thức nhưng nhạt hoét | Thêm từ đệm, cảm xúc, chi tiết đời thường |
| 4 | Từ ngữ không thông dụng | Dùng từ chuyên ngành, văn viết | Áp dụng phép thử "bác bán phở" |
| 5 | Đầu mục dài dòng | Tiêu đề 2-3 dòng, nhồi giải thích | Giữ tiêu đề ngắn, giải thích xuống phần body |
| 6 | Các ý bị trùng lặp | 2 ý nói cùng 1 điều dưới tên khác | Kiểm tra ý nào bao hàm ý nào → gộp hoặc bỏ |
| 7 | Sai 1 từ lệch tone | 1 từ gợi cảm giác sai | "Thô mộc" → "Mộc mạc" (tiêu cực → tích cực) |

**Chi tiết + ví dụ Before/After:** Xem [references/feedback-templates.md](references/feedback-templates.md)

---

## 4. Output Debug Playbook — 5 tình huống

Khi output không như ý, KHÔNG viết lại prompt từ đầu. Dùng follow-up cụ thể:

### Tình huống 1: Output quá formal
```
Viết lại nhưng bỏ hết những từ trang trọng. Viết giống đang nhắn tin
cho bạn bè. Dùng 'mình' thay vì 'bạn', dùng 'thì' thay vì 'tuy nhiên'.
```

### Tình huống 2: Có đoạn hay, có đoạn dở
```
Đoạn mở bài hay rồi, giữ nguyên. Nhưng đoạn giữa bài từ '...' đến hết
bị nhạt. Viết lại đoạn đó thôi, thêm 1 ví dụ thực tế vào.
```

### Tình huống 3: Đúng ý nhưng quá dài
```
Rút gọn còn [X] chữ. Giữ nguyên ý chính, bỏ đoạn giải thích thừa.
Ưu tiên giữ ví dụ, bỏ phần lý thuyết.
```

### Tình huống 4: Cứ viết kiểu liệt kê
```
Không viết kiểu bullet point hay đánh số. Viết thành đoạn văn liền mạch,
chuyển ý bằng câu tự nhiên.
```

### Tình huống 5: Output nhạt, không có điểm nhấn
```
Bài này đúng nhưng nhạt. Thêm 1 câu mở đầu gây sốc hoặc phản trực giác.
Thêm 1 quan điểm mạnh mẽ mà không phải ai cũng đồng ý.
```

> **Nguyên tắc chung:** "Viết lại cho hay hơn" là câu VÔ DỤNG. Phải chỉ rõ: sửa ĐÂU, sai THẾ NÀO, sửa THEO HƯỚNG NÀO.

---

## 5. Áp dụng cho F&B / Bia (AMC-specific)

### Brand Voice cho bia Đức tại Việt Nam
- **Sang trọng nhưng gần gũi** — không xa cách, không bình dân
- **Giáo dục nhẹ nhàng** — chia sẻ văn hoá bia, không dạy đời
- **Truyền cảm hứng khám phá** — "thử cái mới" thay vì "nên uống cái này"

### Từ nên dùng (F&B Vietnam)
- "Ngon lắm", "Thơm thật sự", "Uống êm", "Hậu vị ngọt nhẹ"
- "Cuối tuần rồi", "Chiều mát", "Nhâm nhi", "Chill cùng bạn bè"
- "Bia Đức chính gốc", "Truyền thống mấy trăm năm"

### Từ TRÁNH (F&B Vietnam)
- ❌ "Thưởng thức" (quá 1 lần/bài)
- ❌ "Tuyệt vời", "Tuyệt hảo" (quá sáo)
- ❌ "Sản phẩm chất lượng cao" (quảng cáo trắng trợn)
- ❌ "Nâng tầm trải nghiệm" (AI phrase điển hình)
- ❌ "Hành trình vị giác" (không ai nói vậy ngoài đời)

### Ví dụ Before/After cho content bia

**❌ BEFORE (AI output raw):**
> "Bitburger Premium Pils là dòng bia pilsner cao cấp đến từ Đức với lịch sử hơn 200 năm. Sản phẩm nổi bật với hương vị cân bằng giữa malt và hoa bia, mang đến trải nghiệm thưởng thức đẳng cấp. Hãy nâng tầm buổi tối của bạn với Bitburger."

**✅ AFTER (Humanized):**
> "Mình uống Bitburger lần đầu là ở quán craft beer trên Bùi Viện, xong từ đó ghiền luôn. Cái vị nó khác bia bình thường lắm — malt thơm nhẹ, đắng thanh thanh ở cuối, uống xong miệng sạch chứ không bị ngấy. Bia Đức mấy trăm năm, ngon có lý do. Cuối tuần này thử đi, mình nghĩ bạn sẽ thích."

---

## 6. Workflow tích hợp với các skill khác

```
[social-content]  → Chọn platform, content pillar, hook formula
        ↓
[copywriting]     → Áp dụng nguyên tắc copy (benefits > features, CTA)
        ↓
[marketing-psychology] → Chọn psychological trigger phù hợp
        ↓
[beer-image-prompts]   → Tạo ảnh minh hoạ nếu cần
        ↓
★ [vietnamese-content-humanizer] → Humanize output qua 6-point checklist
        ↓
Output cuối cùng → Review & publish
```

**Skill này luôn chạy CUỐI CÙNG** trước khi output được đưa vào `generated_contents`.

---

## Related Skills
- **copywriting**: Nguyên tắc viết copy (áp dụng TRƯỚC humanizer)
- **social-content**: Chiến lược nền tảng, hook formulas
- **marketing-psychology**: Trigger tâm lý thuyết phục
- **amc-domain-knowledge**: Brand voice, schema, tech stack
