# Prompt giao việc Sprint 2 — dán nguyên khối cho ChatGPT/Codex

---

Bạn là senior frontend engineer. Hãy thực hiện 4 việc trong repo GitHub `zenaistockvn/biathaytu.com-website`.

**Cách làm việc:**
- Tạo branch `fix/sprint2-performance-conversion` từ `main`.
- Commit theo từng việc (4 commit riêng, đừng gộp).
- Mở 1 pull request khi xong.
- Stack: Next.js 16 App Router + React 19, TypeScript strict, CSS thuần (không Tailwind), test bằng Vitest 4.
- Chạy `npm run build` và `npx vitest run` trước mỗi commit. **Không được để build đỏ hoặc test đỏ.** Hiện tại `main` đang xanh: 21/21 file test, 100/100 test.

**Bối cảnh sản phẩm — đọc kỹ, ảnh hưởng tới Việc 3:**
Đây là website **giới thiệu** bia Đức cao cấp, **KHÔNG bán hàng trực tuyến**. Footer ghi rõ "Website giới thiệu sản phẩm — không bán hàng trực tuyến". Không có giỏ hàng, không có checkout, không có `src/app/api`. Mọi chuyển đổi đều qua hotline / Zalo / để lại thông tin tư vấn.

**Thông tin liên hệ chuẩn — đã có sẵn trong `src/config/company.ts`, dùng qua helper, KHÔNG hardcode:**
```
COMPANY_CONFIG.hotline          // '0915 31 21 66'
COMPANY_CONFIG.showroomAddress  // '26 Vạn Phúc, Ba Đình, Hà Nội'
getCompanyTelHref()             // 'tel:0915312166' — có thể trả null
getCompanyZaloUrl()             // 'https://zalo.me/0915312166' — có thể trả null
```

---

## VIỆC 1 — Trang sản phẩm nặng 8,2 MB vì 18 thẻ `<img>` thô

### Số đo hiện tại
Đo trên production build, viewport mobile 390px:

| Trang | Dung lượng tải |
|---|---|
| `/` | 300 KB |
| `/san-pham` | 426 KB |
| **`/san-pham/[slug]`** | **8 249 KB** |

Trang chi tiết sản phẩm nặng gấp **19 lần** trang danh mục. Ba file chiếm 7,3 / 7,9 MB:

```
2,61 MB  /images/products/the-wurst/combo-cold-cut.png
2,35 MB  /images/products/the-wurst/thuringer-bratwurst.png
2,34 MB  /images/products/the-wurst/wiener-hun-khoi.png
```

### Nguyên nhân
Chúng được phục vụ **thô**, không đi qua `next/image`. So sánh trên cùng một trang:

```
/images/products/the-wurst/combo-cold-cut.png                    → 2,61 MB   ← <img> thô
/_next/image?url=...bitburger_flasche...jpg&w=828&q=75           → 0,16 MB   ← next/image
```

`next/image` tự resize theo viewport và đổi sang WebP/AVIF. Thẻ `<img>` thô thì trình duyệt tải nguyên file gốc.

### Yêu cầu sửa

Chuyển **18 thẻ `<img>`** sang `next/image`. Vị trí chính xác:

| File | Dòng |
|---|---|
| `src/app/(web)/san-pham/[slug]/page.tsx` | 267, 288 |
| `src/app/(web)/bitburger-premium-pils/page.tsx` | 167, 266, 281, 296, 311, 326, 341 |
| `src/app/(web)/benediktiner-weissbier-naturtrub/page.tsx` | 72, 204, 219, 234, 249, 264, 279 |
| `src/app/(web)/benediktiner-dunkel/page.tsx` | 70 |
| `src/app/(web)/bom-bia-5l-benediktiner/page.tsx` | 57 |

**⚠️ KHÔNG đụng vào `src/app/(web)/components/FacebookPixel.tsx:73`** — đó là tracking pixel trong `<noscript>`, bắt buộc phải là `<img>` thô.

Quy tắc chuyển đổi:
- Ảnh nằm trong khung có kích thước cố định → dùng `fill` + `sizes`, và đảm bảo phần tử cha có `position: relative`.
- Ảnh có kích thước biết trước → truyền `width` / `height` thật.
- `sizes` phải khớp layout thực tế, ví dụ ảnh trong grid 2 cột trên desktop: `sizes="(max-width: 768px) 100vw, 50vw"`.
- Ảnh trong màn hình đầu tiên → thêm `priority`. Ảnh phía dưới → để lazy mặc định, **không** thêm `priority` (thêm bừa sẽ làm chậm LCP).
- Giữ nguyên `alt` hiện có. Nếu thẻ nào thiếu `alt`, bổ sung mô tả tiếng Việt có nghĩa.

### Nghiệm thu
`/san-pham/[slug]` trên viewport 390px phải giảm từ **8 249 KB xuống dưới 900 KB**. Đo bằng tab Network của DevTools (disable cache) hoặc script Playwright cộng `content-length` của mọi response.

---

## VIỆC 2 — Trang sản phẩm không có nút hành động nào trong màn hình đầu

### Số đo hiện tại
Toạ độ `top` tuyệt đối của các phần tử, đo trên `main`:

| Phần tử | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Khung ảnh | 165 (cao 420) | 142 (cao 500) |
| `<h1>` tên sản phẩm | 633 ✔ trong fold | 142 ✔ |
| Khối `.product-actions` | **1450** | **843** |
| Nút CTA đầu tiên ("Gọi 0915 31 21 66") | **1535** | **928** |

Trên mobile, khách phải cuộn **691px qua khỏi màn hình đầu** mới thấy nút hành động đầu tiên — gần 2 màn hình. Trên desktop nút nằm ngay dưới fold 28px.

Nguyên nhân: giữa `<h1>` (633) và khối hành động (1450) là ~800px gồm pill tag, bảng thông số và ghi chú hương vị — toàn bộ đẩy CTA xuống.

### Yêu cầu sửa
Trong `src/app/(web)/san-pham/[slug]/page.tsx`, đưa `<ProductOrderActions>` (hiện ở dòng 228) lên **ngay sau khối giá**, trước `.product-detail-tags` và `.product-specs`.

Thứ tự mong muốn ở cột phải:
```
<h1> tên sản phẩm
giá + ghi chú "giá tham khảo"
<ProductOrderActions />     ← chuyển lên đây
pill tags
bảng thông số
ghi chú hương vị
.product-guarantee
```

Kiểm tra `ProductOrderActions.tsx` sau khi chuyển: `aria-labelledby="product-consultation-title"` và `<a href="#tu-van-san-pham">` vẫn phải trỏ đúng.

**Thêm:** dòng "Giá tham khảo — vui lòng liên hệ để được báo giá" đang đặt ở **10px**, dưới ngưỡng đọc được tối thiểu. Nâng lên tối thiểu **12px**.

### Nghiệm thu
Nút CTA đầu tiên phải có `top < 844` trên mobile 390×844, và `top < 900` trên desktop 1440×900.

---

## VIỆC 3 — Form tư vấn không gửi đi đâu cả

### Hiện trạng
`src/app/(web)/components/ProductConsultationForm.tsx`:

```tsx
const handleSubmit = (event) => {
  event.preventDefault();
  window.open(`https://zalo.me/...?text=${...}`, '_blank');
};
```

Khách điền 4 trường (họ tên, SĐT, email, nội dung) rồi… một tab mới mở ra. **Không có state thành công, không có thông báo lỗi, không có fallback.** Popup bị chặn, máy không cài Zalo, hoặc khách đang ở desktop → lead mất trắng mà khách không hề biết.

### ⚠️ Giới hạn phạm vi
Đây là **form thu thông tin tư vấn (lead)**, KHÔNG phải đơn hàng. **Không** xây giỏ hàng, checkout, tính tiền, hay mã giảm giá. Website không bán hàng trực tuyến.

### Yêu cầu sửa

**Bước 1.** Tạo API route `src/app/api/consultation/route.ts` (hiện chưa có thư mục `src/app/api`):
- Chỉ nhận `POST`, trả `405` cho method khác.
- Validate phía server: `name` và `content` không rỗng; `phone` khớp số điện thoại Việt Nam (`^(0|\+84)[0-9]{8,10}$` sau khi bỏ khoảng trắng và dấu chấm); `email` nếu có thì phải hợp lệ.
- Ghi vào Google Sheets qua `SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET` (đã khai báo trong `.env.example`). **Sheets là nguồn sự thật.**
- Gửi thông báo Telegram qua `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` — **best-effort**: lỗi thì chỉ log, không chặn.
- Telegram gửi **text thuần, không dùng `parse_mode`** (tránh injection).
- Nếu Sheets lỗi → trả `502` kèm thông điệp có hotline. **Tuyệt đối không báo thành công giả.**
- Nếu thiếu ENV → trả lỗi rõ ràng, không im lặng nuốt.

Tham khảo `docs/superpowers/plans/2026-06-14-bo-supabase-nhan-don-sheets-telegram.md` — plan cũ đã mô tả kiến trúc Sheets + Telegram này (phần đặt hàng trong đó đã lỗi thời, chỉ lấy phần tích hợp).

**Bước 2.** Sửa `ProductConsultationForm.tsx`:
- `POST` về `/api/consultation`, có 3 trạng thái: `idle` → `submitting` → `success` | `error`.
- Nút submit disabled + đổi chữ khi đang gửi.
- Thành công: hiện thông báo **ngay trong trang**, không mở tab mới.
- Lỗi: hiện thông điệp tiếng Việt kèm hotline và link Zalo làm phương án dự phòng.
- Thông báo lỗi liên kết với input bằng `aria-describedby`; vùng thông báo có `role="status"` (thành công) / `role="alert"` (lỗi).
- Đánh dấu trường bắt buộc bằng `*` — hiện chỉ có Email ghi "(không bắt buộc)", các trường còn lại không có dấu hiệu gì.

**Bước 3.** Viết unit test cho lớp validate và lớp tích hợp (mock `fetch`), theo đúng phong cách các file test có sẵn trong repo.

### Nghiệm thu
Điền form rồi submit → thấy phản hồi ngay trong trang. Không còn `window.open` trong luồng submit.

---

## VIỆC 4 — Hàng rào chặn ảnh nặng lọt vào repo

`public/images` hiện nặng **516 MB**, còn **157 file PNG lớn hơn 1 MB**, trong đó:

```
18,6 MB  public/images/products/official/benediktiner/glass_nobg.png
 4,9 MB  public/images/products/official/benediktiner/86480_bottle_nobg.png
```

Viết một test (đặt cạnh các file `*.test.ts` có sẵn) fail khi có file trong `public/images` vượt **1 MB**. Vì hiện đã có 157 file vi phạm, hãy:
- Đưa danh sách 157 file hiện tại vào một mảng `KNOWN_OVERSIZED` để test xanh ngay.
- Test fail khi xuất hiện file **mới** vượt ngưỡng mà không nằm trong danh sách đó.
- Ghi comment trong file test: danh sách này là nợ kỹ thuật cần rút dần, không phải miễn trừ vĩnh viễn.

**Không** nén hay xoá 157 file đó trong PR này — đó là việc riêng, cần review nội dung.

---

## Ngoài phạm vi — đừng làm trong PR này

- Không nén / thay thế ảnh trong `public/images` (chỉ thêm test cảnh báo).
- Không đụng banner cookie, menu mobile, trang 404, tap target, hay 43 node contrast còn lại — thuộc Sprint 3.
- Không refactor `Heading`/`Text`/`Section` — thuộc Sprint 4.
- Không đụng nhánh `codex/unify-german-taste-brand` (PR #18 đang mở).

## Kiểm tra trước khi mở PR

```bash
npm ci
npm run build      # phải xanh
npx vitest run     # phải giữ 100/100 xanh, cộng thêm test mới của Việc 3 và 4
```

Chạy `npm start` rồi xác nhận:

| Kiểm tra | Ngưỡng |
|---|---|
| `/san-pham/[slug]` @390px | < 900 KB (từ 8 249 KB) |
| Nút CTA đầu tiên @390×844 | `top` < 844 |
| Nút CTA đầu tiên @1440×900 | `top` < 900 |
| Submit form tư vấn | phản hồi trong trang, không mở tab mới |

## Mô tả PR cần ghi rõ

1. Dung lượng `/san-pham/[slug]` trước và sau (số thật đo được).
2. Các biến ENV cần cấu hình trước khi deploy: `SHEETS_WEBHOOK_URL`, `SHEETS_WEBHOOK_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. **Thiếu thì form tư vấn sẽ lỗi** — nêu rõ để không deploy nhầm.
3. Số file trong danh sách `KNOWN_OVERSIZED` của Việc 4.
