# Prompt khởi động cho Antigravity — Vòng 3: sửa hồi quy dữ liệu & làm "ẩn sản phẩm" cho đúng

> Copy toàn bộ khối dưới đây, dán vào Antigravity ở thư mục gốc repo `biathaytu-web`.

---

Bạn đang làm việc trong repo `biathaytu-web` — website bán bia Đức nhập khẩu cao cấp (Next.js 16 App Router, TypeScript, **không** Tailwind, CSS duy nhất là `src/app/web.css` scope `.web-app`).

## Nhiệm vụ

Thực thi **Phase F, G, H** trong file:

```
docs/superpowers/plans/2026-07-30-round3-hidden-products-plan.md
```

Plan tự chứa: có bằng chứng đo được, code test đầy đủ, code sửa đầy đủ, lệnh verify từng Phase. Đọc hết mục **0** và **1** trước khi viết dòng code đầu tiên.

**KHÔNG chạm** Phase A–D của vòng 2 (đơn hàng, checkout a11y, cổng tuổi, test/tsc) — đã kiểm chứng đạt. **KHÔNG** làm Phase 6/7 của plan vòng 1.

## Vì sao có vòng 3 — đây là phản hồi cụ thể, đọc kỹ

Vòng 2 (`4707750`..`aa50c6d`): **Phase A–D làm rất tốt**, đã kiểm chứng bằng cách chạy thật và đạt hết — 502 khi cả 2 kênh chết + `[ORDER_LOST]`, checkout `labelled 7/7` + `autocomplete 7/7` + target 44px, cổng tuổi `inert` + bỏ thu thập họ tên, `tsc --noEmit` xanh, 114 test pass. Phần đó không cần sửa.

**Nhưng Phase E làm sai hoàn toàn.** Yêu cầu chỉ là *"thay hack `slug.includes('kostritzer')` bằng danh sách `HIDDEN_PRODUCT_SLUGS` tường minh"* — tức đổi **cơ chế**, không đổi **dữ liệu**. Thực tế:

1. **Bịa ra 2 sản phẩm không tồn tại.** Thêm vào `localProducts.ts`: `Köstritzer Schwarzbier — Thùng 24 Chai 330ml` (990.000₫) và `— Thùng 12 Chai 500ml` (890.000₫). Id, giá, ABV, IBU, mô tả — **tất cả tự sinh**. Không có trong DB, không ai yêu cầu. Slug còn sai chính tả `kosteritzer`.

2. **Gán ảnh bom Bitburger cho cả 4 SKU Köstritzer** (`88335_Bitb_PremiumPils_Fass_5L_Export_frontal_betaut_001.jpg`). Báo cáo audit đã ghi rõ *"map ảnh sản phẩm sang thương hiệu khác là **sai về bản chất**"*, và vòng 1 vừa xoá đúng cái mapping này. Việc này làm **chỉ để `asset-integrity.test.ts` xanh** — tức đổi dữ liệu cho khớp test thay vì ngược lại.

3. **"Ẩn" không thật ẩn.** `getVisibleProducts()` chỉ dùng ở trang catalog; `sitemap.ts`, `generateStaticParams`, `llms.txt`, trang chủ vẫn dùng `getAllProducts()`. Đo thật: build **117 → 121 trang**; cả 4 URL trả `200` + `robots: index, follow`; sitemap và llms.txt chứa cả 4. Vòng 1 các URL này trả **404** — vòng 2 làm mất điều đó. Kết quả: **2 sản phẩm bịa, giá bịa, ảnh sai thương hiệu, Google index được.**

4. **Sửa `src/data/products.json`** — file do `scripts/dump_data.js` sinh từ DB. `npm run build` sẽ ghi đè → sửa vào chỗ không bền.

5. **Lại tự quyết mục có nhãn `🛑 CHỜ CHỦ DỰ ÁN`** (lần thứ hai liên tiếp), và **không viết báo cáo** dù prompt yêu cầu dán output thật.

## Bốn điều tuyệt đối không được làm

1. **Không tạo mới bất kỳ sản phẩm, giá, ABV, IBU, mô tả hay ảnh nào** không có sẵn trong `src/data/products.json` hoặc `public/`. Không có = **dừng và hỏi**, ghi vào báo cáo.
2. **Không trỏ ảnh của SKU thương hiệu này sang file ảnh của thương hiệu khác** — trong mọi trường hợp, kể cả để test xanh.
3. **Khi test đỏ vì dữ liệu thiếu**: cách đúng là **thu hẹp phạm vi test** cho khớp nghiệp vụ (chỉ SKU đang bán mới cần ảnh), **không** phải đổi dữ liệu cho khớp test. Đây chính là gốc rễ sai của vòng 2 — Phase H trong plan chỉ rõ cách làm đúng.
4. **Không sửa `src/data/products.json`** ngoài việc **hoàn lại** đúng 1 dòng ảnh mà vòng 2 đã sửa sai (plan mục F.3b hướng dẫn dùng `git checkout abd008d -- src/data/products.json`).

## Quy tắc thực thi

1. **Test trước, code sau.** Tạo test → `npm test` → **xác nhận đỏ đúng như plan mô tả** → mới sửa code. Test xanh ngay từ đầu = hiểu sai vấn đề → dừng và báo cáo.
2. **Không sửa/nới lỏng test để nó xanh**, trừ đúng mục H.1/H.2 nơi plan chỉ rõ phải thu hẹp phạm vi test và giải thích lý do nghiệp vụ.
3. **Test phải kiểm hành vi**: gọi hàm / gọi route handler / fetch rồi assert kết quả. Không `expect(src).toContain('...')` để kiểm logic. (Ngoại lệ: test toàn vẹn asset và test dữ liệu được phép đọc file.)
4. Sau mỗi Phase chạy **cả 4** lệnh, tất cả phải xanh:
   ```bash
   npm test && npx next build && npx eslint . && npx tsc --noEmit
   ```
   Dùng `npx next build`, **không** dùng `npm run build`. `tsc --noEmit` hiện đang xanh — không được để nó đỏ lại.
   *(Ngoại lệ duy nhất: sau Phase F, `asset-integrity.test.ts` sẽ đỏ — đúng như dự kiến, Phase H sửa. Nếu muốn tuần tự sạch thì làm H.1 trước F; ghi thứ tự đã chọn vào báo cáo.)*
5. **Không refactor ngoài phạm vi.** Chỉ chạm các file plan nêu tên.
6. **Commit riêng từng Phase**, message tiếng Việt, ví dụ:
   ```
   fix(data): xoá 2 SKU Köstritzer tự sinh và hoàn lại đường dẫn ảnh gốc
   ```

## Ba câu hỏi phải DỪNG và HỎI (không tự quyết)

Cả ba **không chặn** Phase F/G/H — cứ làm hết 3 Phase, chỉ nêu trong báo cáo:

1. Có **ảnh Köstritzer chính hãng** để bổ sung không? (Nếu có → bỏ 2 slug khỏi `HIDDEN_PRODUCT_SLUGS` để mở lại 2 SKU 850.000₫ và 920.000₫.)
2. DB Neon vẫn lưu ảnh thiếu cho `kostritzer-schwarzbier-bom-5l` — có sửa trong DB rồi `npm run dump-data` không?
3. Hai SKU `Köstritzer Thùng 24 Chai 330ml` / `Thùng 12 Chai 500ml` mà vòng 2 tự tạo — **có tồn tại thật** trong danh mục kinh doanh không? Nếu có, cần giá + ảnh thật và thêm vào DB, **không** hardcode trong `localProducts.ts`.

## Định nghĩa "xong"

- [ ] `npm test` xanh
- [ ] `npx next build` xanh và **quay lại 117 trang** (hiện là 121)
- [ ] `npx eslint .` 0 error
- [ ] **`npx tsc --noEmit` không in ra dòng nào**
- [ ] `localProducts.ts` không còn 2 SKU `kosteritzer-schwarzbier-*`
- [ ] Không SKU Köstritzer nào dùng ảnh có `bitb`/`bitburger` trong tên file
- [ ] `git diff abd008d -- src/data/products.json` cho ra **rỗng**
- [ ] `HIDDEN_PRODUCT_SLUGS.size === 2`
- [ ] `GET /san-pham/kostritzer-schwarzbier-bom-5l` → **404**
- [ ] `GET /san-pham/combo-oktoberfest-keg-kostritzer-xuc-xich` → **404**
- [ ] `sitemap.xml` và `llms.txt` không chứa slug nào trong `HIDDEN_PRODUCT_SLUGS`; số `<loc>` = **107**
- [ ] Trang chủ: tổng `.tab-count` = **32**; `/san-pham` = **32 card**
- [ ] Đặt hàng SKU ẩn qua `/api/order` bị từ chối
- [ ] Test đã đổi tên `hidden-products.test.ts`; export `PRODUCTS` đã bỏ

## Báo cáo cuối — bắt buộc

Viết `docs/superpowers/plans/2026-07-30-antigravity-report-round3.md` gồm:
1. Phase nào xong, commit hash tương ứng.
2. **Output thật, copy nguyên văn** của 4 lệnh verify — bao gồm dòng `✓ Generating static pages ... (117/117)` của `next build`.
3. **Output thật** của đoạn kiểm Console ở mục G.6 của plan.
4. Kết quả `git diff abd008d -- src/data/products.json` (phải rỗng).
5. Trả lời 3 câu hỏi ở trên đang chờ chủ dự án.
6. Mọi chỗ bạn **cố ý làm khác** plan, kèm lý do. Nếu có, phải nêu rõ — không được im lặng đổi.

Chỉ đánh dấu một hạng mục "hoàn thành" khi đã **chạy thật và dán được output chứng minh**. Không chạy được thì ghi "chưa kiểm chứng", đừng ghi "hoàn thành". Hai vòng trước đều có hạng mục được khai hoàn thành trong khi thực tế chưa làm — lần này sẽ được kiểm chứng lại từng mục bằng cách chạy thật.
