# Prompt khởi động cho Antigravity — Phase 6A–6C: hợp nhất design system (phần đo được)

> Copy toàn bộ khối dưới đây, dán vào Antigravity ở thư mục gốc repo `biathaytu-web`.

---

Bạn đang làm việc trong repo `biathaytu-web` — website bán bia Đức nhập khẩu cao cấp (Next.js 16 App Router, TypeScript, **không** Tailwind, CSS duy nhất là `src/app/web.css` — 5.802 dòng, scope `.web-app`).

## Nhiệm vụ

Thực thi **6A, 6B, 6C** trong file:

```
docs/superpowers/plans/2026-07-30-phase6-design-system-plan.md
```

Plan tự chứa: hiện trạng đo được, bảng đổi tên token 1:1, 6 lỗi tương phản kèm tỉ lệ đã tính sẵn, bảng 51 literal màu cần sửa kèm số dòng, và code test đầy đủ cho cả 3 bước.

**KHÔNG làm 6D và 6E.** Hai bước đó cần review thị giác của người thật, đã được loại khỏi phạm vi giao. Đọc tới đó thì dừng.

**KHÔNG chạm** bất cứ thứ gì thuộc vòng 1–3 (đơn hàng `/api/order`, cổng tuổi, checkout a11y, catalog, SEO, cơ chế SKU ẩn) — đã kiểm chứng đạt.

## Bối cảnh: quyết định thiết kế đã chốt

Chủ dự án đã chốt: **hệ SÁNG là chuẩn duy nhất** — nền đá ấm `#F4F1E9` + xanh rừng `#2F5D3A`. Dải tối vẫn dùng nhưng có chủ đích (`.hero-dark`, `.usp-bar`, `.b2b-section`, `.product-guarantee`, `.knowledge-hero`, `.web-footer`). Lý do quyết định: 0/34 ảnh catalog được tách nền nên hệ tối sẽ hiện ra 34 hộp trắng; và toàn bộ phễu chuyển đổi đang sáng.

## BỐN CÁI BẪY — đọc trước khi gõ dòng đầu tiên

**1. Thứ tự thay thế token: TÊN DÀI TRƯỚC.** Đây là cái bẫy nguy hiểm nhất của cả Phase 6.

`--web-gold-light` **phải** được thay trước `--web-gold`. Nếu làm ngược, `--web-gold` sẽ khớp vào tiền tố của `--web-gold-light` và tạo ra `--web-accent-light` — một token **không tồn tại**, và mọi chỗ dùng nó sẽ mất màu âm thầm. Đúng thứ tự:

```
1. --web-gold-light  → --web-accent-soft
2. --web-gold-dark   → --web-accent-strong
3. --web-gold-hover  → --web-accent-hover
4. --web-gold-bg     → --web-accent-bg
5. --web-gold        → --web-accent
6. --web-navy-light  → --web-ink-soft
7. --web-navy        → --web-ink
```

Phạm vi: `src/app/web.css` **và** mọi `.tsx` có `var(--web-gold…)` / `var(--web-navy…)` trong inline style (khoảng **506** lượt dùng tổng cộng). Test `design-tokens.test.ts` (mục 6A.5) sẽ bắt được lỗi này qua assert *"mọi token được dùng đều đã được định nghĩa"*.

**2. 6A phải KHÔNG đổi một pixel nào.** Đây là đổi tên, giá trị giữ nguyên tuyệt đối. Bắt buộc chụp ảnh `/`, `/san-pham`, `/dat-hang` trước và sau 6A, và chúng phải **giống hệt nhau**. Nếu khác → bạn đã đổi giá trị ở đâu đó.

**3. Không chạm vùng dòng `3774–5400` của `web.css`.** Đó là CSS của 4 landing page (`.weissbier-landing`, `.bitburger-landing`, `.biaduc-landing`, `.uudai-landing`), thuộc 6E. Test `legacy-palette.test.ts` đã miễn trừ vùng này — đừng "tranh thủ" dọn nó.

**4. Không xoá `!important`.** `web.css` hiện có **749** `!important`. Đó là việc riêng, làm sau, theo lô nhỏ có review thị giác. Phase 6 chỉ đổi *giá trị màu*, không đổi *độ ưu tiên*. Sau khi xong, số `!important` phải **vẫn là 749**.

## Quy tắc thực thi

1. **Test trước, code sau.** Tạo test → `npm test` → **xác nhận đỏ đúng như plan mô tả** → mới sửa code. Test xanh ngay từ đầu = hiểu sai vấn đề → dừng và báo cáo.
2. **Không sửa/nới lỏng test để nó xanh.** Đặc biệt: không hạ ngưỡng `min: 4.5` trong `contrast.test.ts`, không mở rộng vùng miễn trừ trong `legacy-palette.test.ts`.
3. **Không tự sáng tác màu.** Mọi giá trị hex cần dùng đều đã có sẵn trong plan (`#8FBF9C`, `#B9C4BC`, `#F4F1E9`, `#8B6914`, `#4B5A50`…). Cần một màu không có trong plan → **dừng và hỏi**.
4. Sau mỗi bước chạy **cả 4** lệnh, tất cả phải xanh:
   ```bash
   npm test && npx next build && npx eslint . && npx tsc --noEmit
   ```
   Dùng `npx next build`, **không** dùng `npm run build`.
5. **Ba commit riêng**, message tiếng Việt:
   ```
   refactor(design): đổi tên token màu cho đúng nghĩa và hợp nhất DESIGN.md
   fix(a11y): sửa 6 lỗi tương phản WCAG AA ở tầng token
   fix(design): dọn 51 literal màu palette cũ trong hệ dùng chung
   ```

## Định nghĩa "xong"

- [ ] `npm test` xanh, có 3 file test mới: `src/app/design-tokens.test.ts`, `src/app/contrast.test.ts`, `src/app/legacy-palette.test.ts`
- [ ] `npx next build` xanh, **117 trang**
- [ ] `npx eslint .` 0 error
- [ ] **`npx tsc --noEmit` không in ra dòng nào**
- [ ] `grep -rn -- "--web-gold\|--web-navy" src/ | wc -l` → **0**
- [ ] Test token parity xanh: mọi `var(--web-…)` đang dùng đều có định nghĩa trong khối `.web-app`
- [ ] `DESIGN.md`: frontmatter khớp `web.css`, `sans: "Inter"` + `serif: "Playfair Display"` khớp `src/app/layout.tsx`, không còn `Be Vietnam Pro`; phần văn bản không còn `B8860B` / `0D1B2A` / `722F37` / `FEFCF8` / `Deep Navy`
- [ ] 6 cặp màu trong bảng 6B đều đạt ngưỡng đã ghi (7.79 / 7.79 / 14.19 / 5.79 / 5.79 / 5.48)
- [ ] `.footer-18-badge` có `font-size` ≥ **12px**
- [ ] `.p-body`, `.disclaimer-text`, `.tab-count` **không còn** dùng `--web-text-muted`
- [ ] `grep -c "5c4a00" src/app/web.css` → **0**; nút `.btn-primary` hover là **xanh đậm**, không còn nâu
- [ ] Ngoài vùng landing và ngoài nút Zalo/Messenger/phone: không còn `rgba(218,165,32` / `rgba(184,134,11` / `rgba(115,92,0` / `rgba(254,252,248` / `rgba(253,252,240` / `rgba(10,22,40` / `rgba(13,27,42` / `rgba(114,47,55`
- [ ] `.icon-circle-gold` đã đổi thành `.icon-circle-accent`, và nơi dùng trong `src/app/(web)/page.tsx` đã cập nhật
- [ ] `grep -c "!important" src/app/web.css` → **vẫn là 749**
- [ ] Ảnh `/`, `/san-pham`, `/dat-hang` sau **6A** giống hệt trước 6A

## Báo cáo cuối — bắt buộc

Viết `docs/superpowers/plans/2026-07-30-antigravity-report-phase6a-6c.md` gồm:

1. Ba commit hash, mỗi commit ứng với bước nào.
2. **Output thật, copy nguyên văn** của 4 lệnh verify sau bước cuối — kèm dòng `✓ Generating static pages … (117/117)`.
3. **Output thật** của các lệnh grep trong "Định nghĩa xong" (số `--web-gold`/`--web-navy` còn lại, số `5c4a00`, số `!important`).
4. **Output thật** của script đo tương phản (mục 4 của `2026-07-29-ui-functionality-audit-report.md`) chạy trên `/`, `/san-pham`, `/dat-hang` — phải là mảng rỗng.
5. Ảnh chụp `/`, `/san-pham`, `/dat-hang`: **trước 6A** và **sau 6C**. Nêu rõ những gì đổi và tại sao (đúng ra chỉ được đổi: nút hover xanh thay nâu, viền/glow xanh thay vàng, header + bottom nav khớp nền đá ấm, link footer sáng hơn, badge 18+ to hơn).
6. Bảng 51 literal đã sửa: dòng nào, từ gì sang gì.
7. Mọi chỗ bạn **cố ý làm khác** plan, kèm lý do. Nếu có, phải nêu rõ — không được im lặng đổi.

Chỉ đánh dấu một hạng mục "hoàn thành" khi đã **chạy thật và dán được output chứng minh**. Không chạy được thì ghi "chưa kiểm chứng". Cả 3 vòng trước đều được kiểm chứng lại độc lập bằng cách chạy thật, vòng này cũng vậy.
