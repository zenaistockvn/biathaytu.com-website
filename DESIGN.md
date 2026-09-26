---
name: Bia Thầy Tu Design System
description: Premium German Beer, theo nhận diện chính hãng Benediktiner
colors:
  primary: "#004787"      # Xanh trời Benediktiner (ảnh hero benediktiner-weissbier.de)
  primary-light: "#2F6DB0"
  primary-dark: "#003A6E"
  secondary: "#1C3157"    # Xanh đêm: đỉnh trời trong ảnh chiến dịch "So close to heaven"
  accent-on-dark: "#D6BD79" # Vàng nhãn chai, chỉ đặt trên nền xanh
  heritage: "#7A6230"     # Vàng đồng cho badge giải thưởng trên nền sáng
  danger: "#C8202A"       # Đỏ chữ "Weissbier" trên nhãn
  background: "#FFFFFF"   # Nền trắng như chimay.com
  section: "#F4F4F2"      # Section xen kẽ xám nhạt
  surface: "#FFFFFF"
  border: "#DADAD5"
  text-main: "#1C3157"
  text-secondary: "#464E66"
  text-muted: "#596077"
typography:
  display: "Roboto Serif, serif"             # Bản rộng (wdth 125), thay Copperplate của benediktiner-weissbier.de
  sans: "Barlow, sans-serif"                 # Đoạn văn dài
  condensed: "Barlow Condensed, sans-serif"  # Menu, nút, nhãn, h4-h6 (như benediktiner-weissbier.de)
  display-stretch: "125%"
  base-size: "16px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "60px"
  2xl: "80px"
rounded:
  default: "0"            # Góc vuông như chimay.com
  full: "9999px"          # Chỉ cho chấm tròn, bong bóng số
shadow: "none"
components:
  button:
    primary:
      bg: "{colors.primary}"
      text: "#FFFFFF"
      radius: "{rounded.default}"
    on-dark:
      bg: "{colors.accent-on-dark}"
      text: "{colors.secondary}"
  card:
    bg: "{colors.surface}"
    border: "1px solid {colors.border}"
    radius: "{rounded.default}"
---

## Nguồn gốc

Hệ thiết kế ghép hai nguồn, không tự phát minh:

- **Bố cục lấy theo chimay.com:** hero ảnh tràn màn hình, section chia đôi (nửa ảnh, nửa khối màu phẳng), ô danh mục lớn, nền trắng xen xám nhạt, góc vuông, không đổ bóng, nút chữ nhật chữ in hoa.
- **Màu và chữ lấy theo Benediktiner:**

| Yếu tố | Nguồn |
| --- | --- |
| Xanh đêm `#1C3157` | Ảnh chiến dịch `Bene_Weissbier_Kampagnenmotiv_EN_210x297_3.pdf` |
| Xanh trời `#004787` | Ảnh hero `brand/benediktiner-official/home-hero.jpg` (benediktiner-weissbier.de) |
| Vàng nhãn `#D6BD79`, đỏ `#C8202A` | Logo và nhãn chai Benediktiner |
| Font | benediktiner-weissbier.de dùng Copperplate (tiêu đề) và Barlow Condensed (chữ). Copperplate không có ký tự tiếng Việt (thiếu cả `đ ư ơ`) nên thay bằng **Roboto Serif bản rộng** (`font-stretch: 125%`), gần nhất về độ rộng và nét. Barlow Condensed giữ nguyên. Đoạn văn dài dùng **Barlow** bản thường cùng họ cho dễ đọc. |

Không dùng màu đỏ, vàng da bò hay huy hiệu của Chimay: đó là nhận diện của hãng khác.

## Màu

- **Nền trang:** trắng `#FFFFFF` (`--web-bg`), section xen kẽ xám nhạt `#F4F4F2` (`--web-bg-section`).
- **Hành động chính:** xanh trời `#004787` (`--web-accent`), chữ trắng.
- **Khối màu phẳng:** xanh đêm `--web-ink` (`--web-sky` nay là cùng một màu, không chuyển sắc). Dùng thành khối lớn như Chimay: nửa section cạnh ảnh, dải HORECA, footer.
- **Quy tắc duy nhất về điểm nhấn:** nền sáng nhấn bằng xanh trời; nền xanh nhấn bằng vàng nhãn (`--web-accent-on-ink`). Đúng như cách logo tự phối màu.
- **Đỏ** `#C8202A` chỉ dành cho giảm giá, sắp hết hàng và cảnh báo pháp lý.

**Chữ trên dải tối:** chỉ dùng ba token, không dùng trắng trong suốt tuỳ ý.
- Chữ chính: `--web-on-ink` (`#FFFFFF`)
- Chữ phụ: `--web-on-ink-muted` (`#C9D3E3`, tối thiểu 6.0:1 kể cả ở đáy gradient)
- Link, điểm nhấn: `--web-accent-on-ink` (`#D6BD79`, tối thiểu 4.9:1)

**Đặt tên token và prop theo vai trò, không theo màu.** Component `Heading`/`Text` nhận `ink`, `accent`, `on-ink`, `on-ink-accent`. Palette đổi thì chỗ gọi vẫn đúng. (Lần đổi palette trước, prop `color="gold"` và khối "nền accent, chữ ink" viết inline đã thành chữ tối trên nền tối ở 15 chỗ.)

### Token kênh màu và độ trong suốt

Khi cần độ trong suốt (alpha), toàn bộ hệ thống sử dụng cú pháp CSS hiện đại `rgb(var(--token-rgb) / alpha)`, không viết cứng `rgba(r, g, b, a)`. Các kênh trong token ngăn bằng **dấu cách** (`28 49 87`); viết dấu phẩy hoặc dùng `rgba(var(--token-rgb), a)` là CSS không hợp lệ, trình duyệt sẽ âm thầm bỏ qua.

| Token kênh màu | Giá trị RGB | Token hex tương ứng | Ứng dụng chính |
| --- | --- | --- | --- |
| `--web-ink-rgb` | `28 49 87` | `--web-ink` (`#1C3157`) | Bóng đổ (`box-shadow`, `text-shadow`) ngả navy tự nhiên, lớp phủ nhẹ |
| `--web-ink-deep-rgb` | `21 38 69` | `--web-ink-deep` (`#152645`) | Nền phủ modal/overlay, gradient che chắn phía trên header trong suốt |
| `--web-accent-rgb` | `0 71 135` | `--web-accent` (`#004787`) | Quầng sáng nút, viền focus ring, nền phụ bán trong suốt |
| `--web-accent-on-ink-rgb` | `214 189 121` | `--web-accent-on-ink` (`#D6BD79`) | Điểm nhấn viền hoặc nền nhẹ trên bề mặt tối |
| `--web-on-ink-rgb` | `255 255 255` | `--web-on-ink` (`#FFFFFF`) | Viền thẻ trên dải tối, nền thẻ bán trong suốt |
| `--web-bg-rgb` | `255 255 255` | `--web-bg` (`#FFFFFF`) | Nền trắng bán trong suốt khi cần pha trộn |
| `--web-border-rgb` | `218 218 213` | `--web-border` (`#DADAD5`) | Đường phân cách, viền bán trong suốt |
| `--web-red-rgb` | `200 32 42` | `--web-red` (`#C8202A`) | Nền thông báo lỗi/cảnh báo pháp lý bán trong suốt |

**Không đổ bóng, không bo góc.** Như chimay.com, bề mặt phẳng: `--web-shadow*` là `none`, `--web-radius*` là `0`. Chiều sâu đến từ ảnh và khối màu, không từ bóng. Chỉ giữ `box-shadow` cho vòng focus (`0 0 0 3px ...`). `--web-radius-full` chỉ cho chấm tròn và bong bóng số, không cho nút hay nhãn.

### Quy tắc bề mặt (Surfaces)

Để website có nhịp điệu thị giác nhất quán và không bị loãng:
1. **Section đầu tiên (Hero):** ảnh chính hãng tràn màn hình. Khi không có ảnh, dùng khối phẳng `var(--web-sky)` (cùng màu `--web-ink`).
2. **Các dải tối tiếp theo trên trang:** khối phẳng `var(--web-ink)`, thường đặt cạnh ảnh theo kiểu chia đôi của Chimay.
3. **Thẻ nằm trên dải tối:** Dùng `background: var(--web-ink-deep)` (`#152645`), viền `rgb(var(--web-on-ink-rgb) / 0.12)`.
4. **Khai báo ngữ cảnh bề mặt:** Mọi dải tối phải có thuộc tính `data-surface="ink"` hoặc nằm trong selector tối để các component con (Heading, Text, Button, Form) tự động áp dụng token chữ và focus tương ứng (`--web-on-ink`, `--web-accent-on-ink`).

### Header và thanh điều hướng

1. **Header nền đặc (`styles.solid` trong `WebHeader.module.css`):**
   - Nền đặc `var(--web-bg)`, viền dưới `var(--web-border)`, chữ `--web-ink`. Dùng khi đã cuộn, khi mở menu mobile, khi mở panel "Sản phẩm", và trên mọi trang không có hero tối.
2. **Header trong suốt (`styles.onDark`):**
   - Chỉ ở đầu trang tại các route có hero tối trong `DARK_HERO_PATHS` hoặc `/kien-thuc/*`.
   - Logo và menu hiển thị `--web-on-ink`; gradient bảo vệ ở đỉnh (`--web-ink-deep-rgb`) giữ tương phản AA trên ảnh.
3. **Chiều cao:** `--web-header-h` là 72px, từ 1024px là 88px (hai hàng: tiện ích 26px + menu 32px, cách mép trên dưới ~12px). Huy hiệu 96px treo xuống dưới thanh header, thu còn 80px khi cuộn. Mọi chỗ đặt theo header (hero, thanh danh mục dính, trang không có hero, toast) đọc token này, không viết cứng px.
4. **Menu desktop:** SẢN PHẨM ▾ · CÂU CHUYỆN ETTAL · THƯỞNG THỨC · KIẾN THỨC · HORECA VÀ ĐẠI LÝ. "Sản phẩm" sáng cho `/san-pham`, mọi SKU, trang dòng bia và trang bom 5L (`isProductsPath`). Panel "Sản phẩm" phẳng (nền trắng, viền 1px, không bóng) ba cột: Benediktiner, Bia Đức tuyển chọn + "Xem tất cả sản phẩm", ảnh; mở bằng rê chuột hoặc focus, đóng bằng Escape và trả focus về mục.
5. **Hàng tiện ích:** hotline · [LIÊN HỆ] · ngôn ngữ. "Liên hệ" mở bảng kênh chung (Mở Zalo, Điện thoại, Messenger, Showroom) giống nút nổi và ô Liên hệ của bottom nav.
6. **Menu mobile:** hộp thoại (`role="dialog"`, bẫy focus, Escape, trả focus về nút menu). Nhóm Sản phẩm có chip dòng bia; các mục nội dung; nhóm Liên hệ với hai nút Gọi hotline / Mở Zalo và địa chỉ showroom; dòng nhỏ Bảng giá sỉ · Quà tặng · Thông tin mua hàng · ngôn ngữ.
7. **Thanh điều hướng dưới (mobile, `MobileBottomNav`):** SẢN PHẨM · KIẾN THỨC · SHOWROOM · LIÊN HỆ; cao `--web-mobile-bottom-nav-height` (74px); nền đặc, viền trên. Mục chọn: vạch trên 3px `--web-accent` + chữ xanh trời, không đổi nền. Trên `/san-pham/*` thay bằng `SkuActionBar` (Gọi tư vấn / Mở Zalo) cùng chiều cao.

### Trạng thái tương tác (Interaction States)

1. **Liên kết (Links):**
   - Không giảm `opacity` khi hover trên `.web-app a:hover` (tránh làm giảm tỷ lệ tương phản xuống dưới 4.5:1).
   - Link trong đoạn văn xuôi (`p a`, `li a`, `.prose a`) sử dụng gạch chân `text-decoration: underline; text-underline-offset: 3px`.
   - Link dạng nút hoặc card giữ nguyên màu chữ, chỉ chuyển đổi trạng thái nền.
2. **Nút chính (Primary Buttons):**
   - Trên nền sáng: nền `--web-accent` (`#004787`), chữ `--web-on-ink` (`#FFFFFF`) → hover sang `--web-accent-hover` (`#003A6E`).
   - Trên dải tối: nền `--web-accent-on-ink` (`#D6BD79`), chữ `--web-ink` (`#1C3157`) → hover sang `--web-accent-on-ink-soft` (`#E5D3A1`). Tương phản luôn > 6.0:1.
3. **Trạng thái Focus (`*:focus-visible`):**
   - Trên nền sáng: outline 2px solid `var(--web-accent)`, offset 2px.
   - Trên dải tối: outline 2px solid `var(--web-accent-on-ink)`, offset 2px.
4. **Form và ô nhập liệu:**
   - Viền mặc định: `var(--web-border)`.
   - Khi focus: viền `var(--web-accent)` và vòng hào quang nhẹ `rgb(var(--web-accent-rgb) / 0.2)`.
   - Khi lỗi: viền `var(--web-red)`.
   - Trạng thái thành công: **Tuyệt đối không dùng màu xanh lá**. Sử dụng nền nhẹ `var(--web-accent-bg)`, chữ `var(--web-accent)` kèm biểu tượng/thông báo rõ ràng.
5. **Nút bị vô hiệu hóa (Disabled):**
   - Áp dụng `opacity: 0.5` và `cursor: not-allowed`, `pointer-events: none` **chỉ** khi phần tử có thuộc tính `:disabled` hoặc `[aria-disabled="true"]`.

## Chữ

- **Tiêu đề `h1`, `h2` và logo chữ:** Roboto Serif 600, bản rộng (`font-stretch: var(--web-display-stretch)`), **in hoa** như Copperplate trên web Benediktiner. Line-height 1.28 để dấu chồng trên chữ hoa (`Ầ Ẫ Ỗ`) không chạm dòng trên.
- **Mọi chỗ khai `font-family: var(--font-display)` phải kèm `font-stretch: var(--web-display-stretch)`**, nếu không chữ sẽ ra bản hẹp.
- Roboto Serif được tự phục vụ từ `public/fonts/` (khai ở `src/app/fonts.css`), đã cắt gọn còn đúng độ rộng 125% và độ đậm 600–700: khoảng 56 KB thay vì 180 KB. Cần độ đậm hay độ rộng khác thì cắt lại theo `public/fonts/README.md`, đừng khai thêm trong CSS.
- Barlow chỉ nạp 400 và 600, Barlow Condensed nạp 500, 600, 700. Thêm độ đậm mới thì nạp thêm trong `src/app/layout.tsx`.
- **Tiêu đề dạng câu dài** (bài viết, thẻ bài viết, `h2` trong nội dung bài): chữ thường. Câu tiếng Việt dài in hoa rất khó đọc.
- **`h3`:** Roboto Serif 600 bản rộng, chữ thường (tên sản phẩm, tiêu đề thẻ).
- **`h4`–`h6`:** Barlow Condensed 700, in hoa, giãn `0.04em`.
- **Nội dung:** Barlow 400, 16px, line-height 1.65.
- **Nhãn, nút, menu, tab, chip:** Barlow Condensed 600, in hoa, 13–15px, giãn `0.06em` (tối đa `0.08em` cho nhãn nhỏ).
- **Cỡ chữ tối thiểu 12px** ở mọi chỗ, kể cả nhãn phụ và dòng chú thích.
- **Cỡ tiêu đề hero:** trang chủ `--web-fs-hero` (tối đa 84px); hero trang con (`PhotoHero size="medium"`) `--web-fs-hero-page` (tối đa 60px) để tiêu đề 2–4 chữ nằm một dòng.
- Không dùng chữ nghiêng cho tiêu đề (chỉ nạp bản đứng, trình duyệt sẽ nghiêng giả).
- Độ đậm tối đa 700. Không dùng 800/900.

## Hình ảnh

- Chỉ dùng ảnh chính hãng: `public/images/products/official/`, `public/images/brand/benediktiner-official/`, `public/images/brand/bitburger-official/`. Mỗi thư mục có `SOURCES.md`.
- **Không dùng ảnh do AI tạo.** Ảnh AI vẽ sai nhãn chai (chữ vô nghĩa, sai tên hãng, sai khuôn mặt thầy tu trên huy hiệu).
- Ảnh sản phẩm tách nền đặt trên `--web-sky`, `object-fit: contain`, không cắt nhãn.

## Nội dung

Không dùng emoji, mũi tên `→` hay gạch ngang dài `—` trong nội dung hiển thị. Bài viết và sản phẩm lấy từ database được làm sạch tự động trong `scripts/dump_data.js` (xem `scripts/lib/editorial-clean.cjs`).

## Hiệu ứng

Không dùng: chữ gradient, quầng sáng (glow), vệt sáng quét (shimmer), animation lặp vô hạn (lơ lửng, nhấp nháy), thẻ kính mờ. Hiệu ứng mờ nền chỉ giữ cho menu mobile và nền popup.

Rê chuột chỉ đổi nền, màu chữ hoặc gạch chân; **không nhấc phần tử** (`translateY`). Ngoại lệ duy nhất: ảnh trong thẻ sản phẩm phóng nhẹ 4%.

## Bố cục

- **Container:** tối đa 1200px, lề 16px trên mobile.
- **Khoảng cách section:** mọi section dùng `--web-section-py` (`clamp(56px, 6vw, 80px)`: 80px desktop, 56px mobile), kể cả đệm trong khối màu của `SplitBlock` và đáy hero trang con. Không viết clamp riêng trong module (test `spacing.test.ts` chặn 96/104/112px).
- **Hai section cùng nền đứng liền nhau** không được để dải trắng cộng dồn; dải cuối trang không dùng nền xanh đêm vì dính liền footer (dùng nền trắng có kẻ trên hoặc xám).
- **`main` không có `padding-bottom`:** footer tự chừa chỗ cho thanh điều hướng dưới.
- **Nút và mọi phần tử bấm được:** góc vuông, vùng chạm tối thiểu 44px (hàng tiện ích header dùng vùng chạm ảo `::after`).

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--web-header-h` | 72px, 88px từ 1024px | Header, đệm trên hero và trang không hero |
| `--web-section-py` | `clamp(56px, 6vw, 80px)` | Đệm trên dưới mọi section |
| `--web-mobile-bottom-nav-height` | 74px | Bottom nav, `SkuActionBar`, đệm đáy footer |
| `--web-catalog-nav-h` | 54px, 50px dưới 769px | Thanh danh mục dính ở `/san-pham` |
| `--web-fs-hero` / `--web-fs-hero-page` | tối đa 84px / 60px | Tiêu đề hero trang chủ / trang con |

Mỗi token chỉ khai trong `web.css` (test `design-tokens.test.ts` chặn file CSS khác khai lại `--web-radius*`, `--web-shadow*`).
- **Ngữ pháp Chimay:** hero ảnh tràn màn hình; section chia đôi nửa ảnh, nửa khối màu phẳng; ô danh mục lớn; thẻ sản phẩm là ảnh ngữ cảnh kèm tên, không viền, không bóng.

## Component (ngữ pháp Chimay)

Nằm trong `src/app/(web)/components/ui/`, mỗi component có CSS module riêng. Xem tất cả ở `/xem-truoc-giao-dien` (chỉ chạy khi dev).

| Component | Dùng cho | Tương ứng trên chimay.com |
| --- | --- | --- |
| `PhotoHero` | Hero ảnh tràn màn hình, chữ viền rỗng "BENEDIKTINER" tràn đáy | Hero trang chủ, trang Chimay Bleue |
| `TitleBlock` | Tiêu đề kèm dòng phụ in hoa (`kicker`), icon nét mảnh tuỳ chọn | "Nos Bières / TRAPPISTES" |
| `SplitBlock` | Nửa ảnh, nửa khối màu phẳng (`ink`, `accent`, `gold`, `mist`); `wordmark` thêm chữ viền dọc | "Découvrez l'Abbaye", "Visitez l'Espace" |
| `CategoryTile` + `CategoryTileGrid` | Hai ô danh mục lớn: ảnh trên, khối màu có icon dưới | "Nos bières / Nos fromages" |
| `OutlineWordmark` | Chữ viền rỗng khổng lồ, ngang hoặc dọc, chỉ để trang trí | Chữ "CHIMAY" viền |
| `LineIcons` | Icon nét mảnh: ly Weizen, chai, bom, tu viện | Hình khắc ly bia, bánh phô mai |
| `Button` | `primary`, `dark`, `light`, `outline`, `link` | Nút chữ nhật đen/trắng, "VOIR TOUTES LES ACTUALITÉS" |
| `BeerCard`, `ProductCard` | Thẻ bia / sản phẩm: ảnh trên nền xám, tên, thông số một dòng, giá. `ProductCard variant="compact"` dùng trong danh mục: chỉ quy cách, thông số, giá (tên dòng ở tiêu đề nhóm) | Danh sách "Nos bières" |
| `ProductStory` | Template trang dòng bia: hero, giới thiệu, hồ sơ hương vị (lịch sử là dòng cuối bảng), cách rót, quy cách, món ăn kèm, dải cuối nền trắng | Trang Chimay Bleue |
| `FlavorWheel`, `ProfileScale`, `FormatStrip` | Bánh xe hương vị, thang màu/độ trong/bọt, dải quy cách căn giữa lấy từ dữ liệu (ghi thêm tên dòng khi dải gồm nhiều dòng) | "Roue des saveurs", "Couleur", "Nos différents formats" |
| `EditorialPage` (+ `PageHeader`, `Summary`, `InfoGrid`, `StepList`, `CtaBand`, `FaqSection`) | Trang nội dung và pháp lý: dải tiêu đề, cột bài viết 760px có sẵn kiểu chữ | Các trang phụ |
| `ArticleCard`, `FeaturedArticle` | Thẻ bài viết và bài nổi bật (ảnh trái, khối xám phải) | "Une actualité pétillante" |

Component chức năng (trong `src/app/(web)/components/`, mỗi cái một CSS module, không style inline):

| Component | Dùng cho |
| --- | --- |
| `WebHeader`, `WebFooter`, `MobileBottomNav`, `CatalogStickyNav` | Khung điều hướng (xem mục Header và thanh điều hướng) |
| `FloatingZaloCTA` | Bảng kênh liên hệ dùng chung (Mở Zalo, Điện thoại, Messenger, Showroom); icon nét mảnh, không khung tròn |
| `SkuActionBar` | Thanh cố định Gọi tư vấn / Mở Zalo trên trang SKU dưới 769px |
| `san-pham/ProductCatalog` | Danh mục ba cấp: nhóm → dòng bia (tên dòng link trang dòng) → thẻ compact 2/3/4 cột; hàng lọc Tất cả · Chai · Lon · Bom |
| `kien-thuc/KnowledgeBrowser` | Chip chủ đề + 9 bài mỗi lượt, "Xem thêm"; bài chưa hiện vẫn có trong HTML |
| `ProductGallery`, `ProductDetailsAccordion`, `ProductOrderActions`, `ProductConsultationForm` | Ảnh (chấm chỉ báo dưới 768px), câu hỏi thường gặp, khối liên hệ, form tư vấn trên trang SKU |
| `GeoLocalCTA` | Khối showroom cuối bài viết: dải xanh đêm, nút sáng + link, bản đồ |
| `AlcoholWarning` (`footer`, `checkout`), `CompanyLegalDetails` | Cảnh báo đồ uống có cồn và khối pháp nhân (bắt buộc) |
| `LanguageSwitcher` | Ô ngôn ngữ trong hàng tiện ích và menu mobile |

- **Khối màu và nút:** trên `ink`/`accent` dùng nút `light`; trên `gold`/`mist` dùng nút `dark`. `SplitBlock` tự chọn.
- **Footer:** khối xanh đêm ba tầng: (1) giới thiệu ngắn + ba cột Sản phẩm / Tìm hiểu / Mua hàng; (2) hàng liên hệ hotline · email · showroom + nút Mở Zalo; (3) một đoạn thông tin doanh nghiệp nhỏ. Cuối là thanh vàng nhãn (link pháp lý, cảnh báo đồ uống có cồn, bản quyền), tương ứng thanh da bò của Chimay. Thông tin doanh nghiệp, cảnh báo và câu "không bán hàng trực tuyến" là bắt buộc, không được bỏ.
- **Nhãn link mở ứng dụng ngoài:** luôn ghi "Mở Zalo". Không dùng lời kêu gọi "đặt hàng / đặt mua": website chưa đăng ký bán hàng với Bộ Công Thương.
- **Cổng tuổi, banner cookie:** hộp trắng góc vuông như chimay.com; cổng tuổi đặt trên ảnh thương hiệu tối. Nút "Từ chối" cookie cùng kích thước nút "Chấp nhận".
- **Giá không viết cứng trong trang:** lấy từ dữ liệu sản phẩm (`getProductBySlugOrId`, `FormatStrip`) để luôn khớp trang chi tiết.
- **Reset toàn cục dùng `:where(.web-app)`** (thẻ `p`, `a`, gạch chân link) để giữ specificity thấp; class của component luôn thắng mà không cần `!important`.
- **Header** (`WebHeader.tsx` + `WebHeader.module.css`): từ 1024px có hai tầng trong thanh 88px (hàng tiện ích và menu in hoa, xem mục Header). Dưới 1024px chỉ có huy hiệu, tên và nút menu.
- **Class `container` toàn cục đặt lại `padding` và `margin`**: khoảng đệm dọc và đường kẻ phải nằm ở phần tử bọc ngoài hoặc bên trong, không đặt chung phần tử với `container`.
- **CSS module cạnh component, không style inline (`style={{}}`), không thêm `!important` mới.** Cần thắng quy tắc toàn cục `.web-app h2` / `.web-app button` thì dùng bộ chọn hai class (0,2,0) hoặc đổi thẻ (`<p>` thay `h2`) thay vì `!important`.

## Nguồn dữ liệu dùng chung

Không viết lại chuỗi hay link trong component; đọc từ các file sau.

| File | Nội dung |
| --- | --- |
| `src/config/navigation.ts` | `NAV` (tên chuẩn của mỗi route: Sản phẩm, Câu chuyện Ettal, Showroom cho `/lien-he`…), `PRODUCT_LINES`, `KEG_PAGE`, `isProductsPath()`, `breadcrumbTrail()` cho breadcrumb hiển thị và JSON-LD |
| `src/config/productLines.ts` | Dòng bia (Naturtrüb, Dunkel, Festbier, Hộp mix 2 vị, Bitburger): mỗi SKU khớp đúng một dòng; quy cách Chai / Lon / Bom suy từ tên |
| `src/config/company.ts` | Pháp nhân, địa chỉ, hotline, email, giờ hỗ trợ `supportHours` (8:00 - 22:00) |
| `src/config/articleTopics.ts` | Chủ đề bài Kiến thức theo từ khoá tiêu đề |

## Khả năng truy cập

- Mọi phần tử tương tác phải có focus ring nhìn thấy được (`--web-accent` trên nền sáng, `--web-accent-on-ink` trên dải tối).
- Chữ đạt WCAG 2.1 AA (4.5:1, chữ lớn 3:1) trên mọi nền, kể cả chữ đặt trên ảnh (cần lớp phủ tối).
- 0 lỗi tràn ngang trên toàn bộ các kích thước màn hình (360px, 390px, 768px, 1024px, 1440px).
