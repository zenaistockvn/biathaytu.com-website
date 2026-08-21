# RÀ SOÁT CODEBASE — biathaytu.com

> **Trạng thái:** KIỂM KÊ ONLY — chưa thay đổi code/runtime  
> **Repository:** `zenaistockvn/biathaytu.com-website`  
> **Snapshot:** `main`, rà soát ngày 2026-08-21  
> **Mục tiêu:** xác định toàn bộ bề mặt thương mại trước khi chuyển website từ e-commerce sang brochure/product-information site.

## 0. Tóm tắt điều hành

Codebase hiện **vẫn là một storefront B2C có luồng mua hàng hoàn chỉnh**, không chỉ là website giới thiệu sản phẩm.

Luồng giao dịch chính đang tồn tại:

`ProductCard / Product detail` → `useCartStore` → `/dat-hang` → `/api/promo/validate` → `/api/order` → Supabase (`orders`, `order_items`) + Telegram + Google Sheets.

Các bề mặt cần chú ý nhất ở task gỡ giao dịch sau này:

- Cart state bằng Zustand, persisted ở local storage.
- Nút **“Thêm vào giỏ”**, **“Mua Ngay”**, CTA **“Đặt Hàng Ngay”**.
- Header + mobile bottom navigation có icon/link giỏ hàng.
- Route `/dat-hang` là checkout đầy đủ: số lượng, coupon, thông tin nhận hàng, phương thức thanh toán, COD, tổng tiền và submit đơn.
- API `/api/order` thực sự tạo đơn, ghi database và phát notification.
- API `/api/promo/validate` và dữ liệu `promo_codes.json` thực thi coupon.
- JSON-LD `Product` đang phát `Offer` hoặc `AggregateOffer` kèm giá.
- `/google-merchant.xml` đang phát product feed có giá/availability.
- Một số trang SEO/chính sách vẫn dùng ngôn ngữ giao dịch như “đặt mua trực tiếp”, “đặt hàng online”, “COD”, “thanh toán”.
- `/nhan-uu-dai` có form chọn **loại bia** và **khu vực nhận hàng**, kèm voucher/giảm giá và copy “đơn hàng đầu tiên”; tuy chưa tạo order trực tiếp, form hiện vượt phạm vi form tư vấn tối giản đã đặt ra.
- Không thấy route đăng nhập/đăng ký/tài khoản khách hàng trong cây `src/app`; checkout hiện là guest checkout.
- Không thấy Server Action (`"use server"`) chuyên xử lý order; luồng server dùng Route Handler `/api/order`.
- Không phát hiện sản phẩm nào có ABV được khai báo rõ `>=15%` trong `src/data/products.json` tại snapshot kiểm tra; một số sản phẩm vang có ABV `null`, vì vậy đây **không phải xác nhận pháp lý về toàn bộ danh mục rượu vang**.
- Không thấy logo/câu khẳng định **“Đã thông báo Bộ Công Thương”** trong các runtime/legal source đã kiểm tra.

### Phạm vi và giới hạn kỹ thuật của lần quét

- Cây repository/route được lập từ recursive Git tree của `main`.
- GitHub code-search index của repository đang không khả dụng, nên kiểm kê literal được thực hiện bằng cách đọc trực tiếp các file runtime/data/legal/SEO/commerce liên quan từ tree, thay vì dựa vào indexed code search.
- Các số dòng dưới đây là số dòng của snapshot `main` tại thời điểm audit. Với các component lớn, dùng **range** khi một yếu tố thương mại trải qua nhiều dòng.
- README/tài liệu được ghi riêng vì không render ra website nhưng phản ánh kiến trúc e-commerce còn tồn tại.

---

# 1. Danh sách route/page hiện có

## 1.1. Route UI — App Router pages

| Route | File | Chức năng ngắn |
|---|---|---|
| `/` | `src/app/(web)/page.tsx` | Homepage: hero, thương hiệu, danh mục/sản phẩm, FAQ; hiện có ProductCard và FAQ COD. |
| `/chua-du-tuoi` | `src/app/(bare)/chua-du-tuoi/page.tsx` | Trang chặn người dùng không đủ tuổi. |
| `/bang-gia-si-dai-ly` | `src/app/(web)/bang-gia-si-dai-ly/page.tsx` | Landing B2B/bảng giá sỉ–đại lý, mức giá tham khảo, CTA báo giá/hotline/Zalo. |
| `/benediktiner-dunkel` | `src/app/(web)/benediktiner-dunkel/page.tsx` | Landing SEO cho Benediktiner Dunkel. |
| `/benediktiner-weissbier-naturtrub` | `src/app/(web)/benediktiner-weissbier-naturtrub/page.tsx` | Landing SEO cho Benediktiner Weissbier Naturtrüb. |
| `/bia-benediktiner-chinh-hang` | `src/app/(web)/bia-benediktiner-chinh-hang/page.tsx` | Landing SEO về Benediktiner chính hãng. |
| `/bia-duc-cho-nha-hang-khach-san` | `src/app/(web)/bia-duc-cho-nha-hang-khach-san/page.tsx` | Landing B2B cho nhà hàng/khách sạn. |
| `/bia-duc-nhap-khau` | `src/app/(web)/bia-duc-nhap-khau/page.tsx` | Landing SEO về bia Đức nhập khẩu. |
| `/bia-thay-tu-la-gi` | `src/app/(web)/bia-thay-tu-la-gi/page.tsx` | Bài/landing giải thích khái niệm “Bia Thầy Tu”. |
| `/bitburger-premium-pils` | `src/app/(web)/bitburger-premium-pils/page.tsx` | Landing SEO cho Bitburger Premium Pils. |
| `/blog` | `src/app/(web)/blog/page.tsx` | Danh sách blog/tin bài. |
| `/blog/[slug]` | `src/app/(web)/blog/[slug]/page.tsx` | Chi tiết bài blog theo slug. |
| `/bom-bia-5l-benediktiner` | `src/app/(web)/bom-bia-5l-benediktiner/page.tsx` | Landing SEO cho bom bia 5L Benediktiner. |
| `/chinh-sach-bao-mat` | `src/app/(web)/chinh-sach-bao-mat/page.tsx` | Chính sách bảo mật; hiện đề cập dữ liệu mua hàng/đơn hàng/thanh toán/giao hàng. |
| `/chinh-sach-cookie` | `src/app/(web)/chinh-sach-cookie/page.tsx` | Chính sách cookie. |
| `/chinh-sach-doi-tra` | `src/app/(web)/chinh-sach-doi-tra/page.tsx` | Chính sách đổi trả; hiện tham chiếu số lượng và “đơn đặt hàng”. |
| `/chinh-sach-giao-hang` | `src/app/(web)/chinh-sach-giao-hang/page.tsx` | Chính sách giao hàng/phí giao hàng/đơn hàng. |
| `/chinh-sach-kiem-soat-do-tuoi` | `src/app/(web)/chinh-sach-kiem-soat-do-tuoi/page.tsx` | Chính sách kiểm soát độ tuổi. |
| `/chinh-sach-thanh-toan` | `src/app/(web)/chinh-sach-thanh-toan/page.tsx` | Chính sách thanh toán, COD và chuyển khoản ngân hàng. |
| `/chung-nhan-nhap-khau-chinh-hang` | `src/app/(web)/chung-nhan-nhap-khau-chinh-hang/page.tsx` | Nội dung/chứng nhận nhập khẩu chính hãng. |
| `/dat-hang` | `src/app/(web)/dat-hang/page.tsx` | **Checkout hoàn chỉnh:** cart, quantity, promo, customer, address, payment, COD/bank transfer, submit order. |
| `/dieu-khoan-su-dung` | `src/app/(web)/dieu-khoan-su-dung/page.tsx` | Điều khoản sử dụng; hiện mô tả hợp đồng mua bán, đặt hàng, thanh toán, COD, coupon. |
| `/food-pairing-bia-duc` | `src/app/(web)/food-pairing-bia-duc/page.tsx` | Landing kiến thức food pairing. |
| `/huong-dan-rot-bia-lua-mi` | `src/app/(web)/huong-dan-rot-bia-lua-mi/page.tsx` | Hướng dẫn rót bia lúa mì. |
| `/kien-thuc` | `src/app/(web)/kien-thuc/page.tsx` | Danh mục bài kiến thức. |
| `/kien-thuc/[slug]` | `src/app/(web)/kien-thuc/[slug]/page.tsx` | Chi tiết bài kiến thức theo slug. |
| `/lien-he` | `src/app/(web)/lien-he/page.tsx` | Trang liên hệ; metadata/body hiện dùng nhiều copy “Đặt Hàng/Đặt mua”. |
| `/mua-bia-benediktiner-chinh-hang` | `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx` | **Landing thương mại mạnh:** “Đặt mua trực tiếp”, `/dat-hang`, “Đặt hàng online”, ProductCard. |
| `/nhan-uu-dai` | `src/app/(web)/nhan-uu-dai/page.tsx` | Landing thu lead/voucher; có chọn loại bia, khu vực nhận hàng, voucher giảm giá. |
| `/qua-tang-bia-duc` | `src/app/(web)/qua-tang-bia-duc/page.tsx` | Landing quà tặng bia Đức. |
| `/san-pham` | `src/app/(web)/san-pham/page.tsx` | Catalogue sản phẩm; render ProductCard có giá, add-to-cart và Buy Now. |
| `/san-pham/[slug]` | `src/app/(web)/san-pham/[slug]/page.tsx` | Chi tiết sản phẩm; giá + quantity + add-to-cart + Buy Now + Product JSON-LD. |
| `/thuong-hieu` | `src/app/(web)/thuong-hieu/page.tsx` | Nội dung thương hiệu/lịch sử. |
| `/ve-chung-toi` | `src/app/(web)/ve-chung-toi/page.tsx` | Giới thiệu doanh nghiệp; hiển thị pháp nhân/NAP. |

## 1.2. API/generated routes

| Route | File | Chức năng |
|---|---|---|
| `POST /api/order` | `src/app/api/order/route.ts` | **Tạo đơn hàng server-side**, tính lại giá/discount/shipping, ghi Supabase, notify Telegram/Google Sheets. |
| `POST /api/promo/validate` | `src/app/api/promo/validate/route.ts` | Validate coupon/promo theo code và subtotal. |
| `/google-merchant.xml` | `src/app/google-merchant.xml/route.ts` | Google Merchant product feed; xuất price/availability/link sản phẩm. |
| `/llms.txt` | `src/app/llms.txt/route.ts` | LLM-readable site summary. |
| `/robots.txt` | `src/app/robots.ts` | Dynamic robots.txt. |
| `/sitemap.xml` | `src/app/sitemap.ts` | Dynamic sitemap. |

### Không thấy route tài khoản khách hàng

Trong cây `src/app` không thấy page/route `login`, `register`, `signup`, `account`, `tai-khoan` hoặc tương đương. Luồng `/dat-hang` thu thông tin khách trực tiếp và hoạt động theo mô hình guest checkout.

---

# 2. Mọi vị trí có yếu tố thương mại

## 2.1. Cart / Buy / Quantity / Checkout — runtime trực tiếp

| File | Dòng | Yếu tố thương mại |
|---|---:|---|
| `src/app/(web)/components/ProductOrderActions.tsx` | 4, 21–33 | Import/use `useCartStore`; `addItem`; `handleAddToCart`; `handleBuyNow`; Buy Now redirect `/dat-hang`. |
| `src/app/(web)/components/ProductOrderActions.tsx` | 39–49 | Bộ chọn **số lượng** với tăng/giảm và numeric quantity. |
| `src/app/(web)/components/ProductOrderActions.tsx` | 53–57 | Nút **“Thêm vào giỏ”**. |
| `src/app/(web)/components/ProductOrderActions.tsx` | 60–63 | Nút **“Mua Ngay”**. |
| `src/app/(web)/components/ProductCard.tsx` | 58–75 | Cart store; lấy giá; add 1 item; buy-now add item rồi redirect `/dat-hang`. |
| `src/app/(web)/components/ProductCard.tsx` | 100–113 | Product JSON-LD nhận `price`. |
| `src/app/(web)/components/ProductCard.tsx` | 132–166 | Render giá; nút/icon **Thêm vào giỏ**; CTA **Mua Ngay**. |
| `src/app/(web)/components/WebHeader.tsx` | 42 | Lấy tổng số item trong cart. |
| `src/app/(web)/components/WebHeader.tsx` | 78–83 | CTA desktop trỏ `/dat-hang`, label từ `nav.order`. |
| `src/app/(web)/components/WebHeader.tsx` | 85–99 | Desktop cart link `/dat-hang`, ShoppingCart icon, badge số item, aria-label “Giỏ hàng…”. |
| `src/app/(web)/components/WebHeader.tsx` | 171–177 | Mobile menu CTA `/dat-hang`, render `nav.order`. |
| `src/app/(web)/components/MobileBottomNav.tsx` | 4, 18–29 | Cart store + item bottom-nav `{ href: '/dat-hang', label: 'Giỏ Hàng', icon: ShoppingCart }`. |
| `src/app/(web)/context/LanguageContext.tsx` | ~21 | `nav.order: 'Đặt Hàng Ngay'`; được WebHeader render. |
| `src/app/(web)/san-pham/[slug]/page.tsx` | 62–76 | Lấy `price`, truyền giá vào Product JSON-LD. |
| `src/app/(web)/san-pham/[slug]/page.tsx` | 111–132 | Render giá và `ProductOrderActions`. |
| `src/app/(web)/san-pham/page.tsx` | component render ProductCard | Catalogue kế thừa toàn bộ giá/cart/buy actions từ `ProductCard`. |
| `src/app/(web)/components/ProductTabs.tsx` | product grid | Homepage product tabs render `ProductCard`, vì vậy kế thừa giá/cart/buy actions. |
| `src/app/(web)/page.tsx` | ~288–291 | FAQ về **“thanh toán khi nhận hàng (COD)”** và trả lời hỗ trợ COD toàn quốc. |

## 2.2. `/dat-hang` — checkout hoàn chỉnh

| File | Dòng | Yếu tố |
|---|---:|---|
| `src/app/(web)/dat-hang/page.tsx` | 7, 18–45 | Cart store; items; remove/update/clear; subtotal; promo state; payment state mặc định `cod`. |
| `src/app/(web)/dat-hang/page.tsx` | 65–104 | Gọi `/api/promo/validate`, áp dụng coupon/discount. |
| `src/app/(web)/dat-hang/page.tsx` | 110–218 | Submit order: customer, address, quantity, promo code, payment method, totals → `POST /api/order`; clear cart khi thành công. |
| `src/app/(web)/dat-hang/page.tsx` | ~220–255 | Success/empty-cart messaging liên quan đặt hàng/giỏ hàng. |
| `src/app/(web)/dat-hang/page.tsx` | ~260–330 | Heading **Thanh Toán**, danh sách cart item, giá, tăng/giảm **số lượng**, remove item. |
| `src/app/(web)/dat-hang/page.tsx` | ~332–365 | Input coupon/promo và nút áp dụng. |
| `src/app/(web)/dat-hang/page.tsx` | ~367–402 | Tạm tính, giảm giá, phí giao hàng, tổng cộng. |
| `src/app/(web)/dat-hang/page.tsx` | ~405–495 | Form khách hàng + địa chỉ giao hàng. |
| `src/app/(web)/dat-hang/page.tsx` | ~496–520 | Chọn phương thức thanh toán; có **COD** / chuyển khoản. |
| `src/app/(web)/dat-hang/page.tsx` | ~521–575 | Xác nhận tuổi/điều khoản và submit **HOÀN TẤT ĐẶT HÀNG**. |

## 2.3. State management / pricing / coupon data

| File | Dòng | Chức năng thương mại |
|---|---:|---|
| `src/stores/useCartStore.ts` | 4–57 | Zustand persisted cart: `items`, `quantity`, add/remove/update/clear, item count, subtotal; storage `cart-storage`. |
| `src/lib/orders/pricing.ts` | toàn file | `FREE_SHIPPING_THRESHOLD`, shipping fee, VIP minimum order; tính subtotal/discount/shipping/grand total. |
| `src/lib/orders/types.ts` | toàn file | Order item/request types: quantity, unit price, total price, customer/payment/subtotal/discount/shipping/total. |
| `src/lib/orders/validation.ts` | toàn file | Validate order; payment methods gồm `cod`, `bank_transfer`; validate customer/items/age/payment/totals. |
| `src/lib/orders/productLookup.ts` | toàn file | Trusted product lookup, active/orderable product và unit price dùng khi tạo đơn. |
| `src/lib/data/promo.ts` | 3–18 | `PromoCode`, discount type/value, minimum order, active/expiry; lookup promo code. |
| `src/data/promo_codes.json` | 1–20 | Coupon `VIP10` (10%) và `FREESHIP` (30.000đ, min order 500.000đ), đều active. |
| `src/lib/seo/productPricing.ts` | toàn file | Map giá/price range theo product, dùng cho Product structured data và Merchant feed. |
| `src/data/products.json` | nhiều record | Product catalogue có trường giá/retail/final pricing dùng bởi UI/SEO. |

## 2.4. API / persistence / integrations liên quan đơn hàng

| File | Dòng | Chức năng |
|---|---:|---|
| `src/app/api/order/route.ts` | toàn file | POST order: validation → trusted product lookup → pricing/promo → insert `orders` → insert `order_items` → promo usage → Telegram/Sheets → return order number. |
| `src/app/api/promo/validate/route.ts` | toàn file | POST validate promo/coupon theo code + subtotal, trả discount. |
| `src/lib/integrations/googleSheets.ts` | toàn file | Đẩy dữ liệu order sang Google Apps Script/Google Sheets. |
| `src/lib/integrations/telegram.ts` | toàn file | Gửi Telegram notification khi có order. |
| `scripts/google-apps-script-orders.gs` | toàn file | Receiver/logging cho order gửi sang Google Sheets. |
| `supabase/migrations/20260702000000_storefront_data_hardening.sql` | 15–16 | Index `promo_codes (is_active, expires_at)` phục vụ promo storefront. |

> Ghi chú database: `001_init.sql` là schema nền/legacy cho products/content và không phải migration định nghĩa order flow hiện hành. Runtime `/api/order` vẫn thực hiện insert vào `orders` và `order_items`, nên hai bảng này là dependency thực tế của checkout dù schema tạo bảng không nằm trong migration nền được đọc ở trên.

## 2.5. Các page/copy thương mại khác

| File | Dòng/range | Nội dung |
|---|---:|---|
| `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx` | ~35–75 | Buying options có **“Đặt mua trực tiếp”**, href `/dat-hang`, CTA **“Đặt hàng online”**. |
| `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx` | ~120–170 | CTA `/dat-hang`, copy đặt mua qua website. |
| `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx` | ~230–270 | ProductCard + CTA đặt bia/đặt hàng. |
| `src/app/(web)/lien-he/page.tsx` | metadata, breadcrumb, heading; ~1–90 | Title/metadata/body **“Liên Hệ & Đặt Hàng”**, **“Đặt Hàng & Tư Vấn”**, “Đặt mua lẻ…”. |
| `src/app/(web)/bang-gia-si-dai-ly/page.tsx` | product table / pricing section | Render giá bán lẻ/mức giá tham khảo và CTA liên hệ báo giá. Đây là pricing B2B, không phải checkout, nhưng vẫn là commercial surface. |
| `src/app/(web)/nhan-uu-dai/page.tsx` | 8–21 | Form state có `beerPreference`, `address`; `priceRange`; Zalo copy voucher giảm giá. |
| `src/app/(web)/nhan-uu-dai/page.tsx` | ~44–90 | Voucher 100K, “đơn hàng đầu tiên”, giao hàng, ưu đãi. |
| `src/app/(web)/nhan-uu-dai/page.tsx` | ~145–210 | Form cho phép chọn **Vị Bia Bạn Muốn Thử Nghiệm** và nhập **Khu Vực Nhận Hàng**. |
| `src/app/(web)/chinh-sach-thanh-toan/page.tsx` | toàn nội dung policy | “Thanh Toán”, COD, chuyển khoản, thông tin tài khoản ngân hàng. |
| `src/app/(web)/chinh-sach-giao-hang/page.tsx` | toàn nội dung policy | Đơn hàng, giao hàng, phí/điều kiện giao nhận. |
| `src/app/(web)/chinh-sach-doi-tra/page.tsx` | ~24–31 | “Giao sai chủng loại, số lượng so với đơn đặt hàng”. |
| `src/app/(web)/chinh-sach-bao-mat/page.tsx` | các mục dữ liệu/mục đích xử lý | Thu/đề cập dữ liệu mua hàng, sản phẩm đã mua, giá trị đơn, giao hàng, xử lý đơn/thanh toán. |
| `src/app/(web)/dieu-khoan-su-dung/page.tsx` | ~52–180 | **Đặt Hàng & Hợp Đồng Mua Bán**, đặt hàng trực tuyến, đơn hàng, minimum order, thanh toán, COD/chuyển khoản, coupon/hủy đơn. |
| `src/app/google-merchant.xml/route.ts` | product loop/feed | Phát Merchant XML có `g:price`, availability và product URL — commercial feed dù không phải JSON-LD. |
| `README.md` | phần đầu/Features/structure | Mô tả site là **Website Bán Lẻ B2C**, cart, checkout, orders, promo và email xác nhận đơn. Không render runtime nhưng xác nhận intent kiến trúc cũ. |

### Tài khoản khách hàng

- **Không phát hiện** UI đăng ký/đăng nhập/tài khoản khách hàng trong route tree hiện tại.
- Có khái niệm `customer` trong checkout/order payload, nhưng đây là thông tin người nhận/khách đặt hàng, không phải authenticated customer account.

---

# 3. Chuỗi ký tự thuộc danh sách cấm

Quét theo nghĩa **không phân biệt hoa/thường** và ghi cả biến thể chữ hoa trong UI.

## 3.1. `Mua ngay`

- `src/app/(web)/components/ProductOrderActions.tsx:60–63` — button **“Mua Ngay”**.
- `src/app/(web)/components/ProductCard.tsx:~163–166` — CTA **“Mua Ngay”**.

## 3.2. `Đặt hàng`

- `src/app/(web)/context/LanguageContext.tsx:~21` — `nav.order: 'Đặt Hàng Ngay'`.
- `src/app/(web)/components/WebHeader.tsx:78–83, 171–177` — render `nav.order`, link `/dat-hang`.
- `src/app/(web)/dat-hang/page.tsx:~220–575` — nhiều copy trạng thái/order submit, gồm **“HOÀN TẤT ĐẶT HÀNG”**.
- `src/app/(web)/lien-he/page.tsx:~1–90` — metadata/breadcrumb/heading có **“Đặt Hàng”**.
- `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx:~35–75, ~120–170` — **“Đặt hàng online”** và CTA `/dat-hang`.
- `src/app/(web)/dieu-khoan-su-dung/page.tsx:~52–180` — “Đặt Hàng & Hợp Đồng Mua Bán”, “Đặt hàng trực tuyến”, đơn hàng được xác nhận.
- `src/app/(web)/chinh-sach-doi-tra/page.tsx:~24–31` — “đơn đặt hàng”.
- `README.md` — “Giỏ hàng & Đặt hàng nhanh”, route `dat-hang`, xác nhận đơn hàng.

## 3.3. `Đặt mua`

- `src/app/(web)/components/JsonLd.tsx:~40–50` — canonical FAQ answer nói có thể **“đặt mua trực tiếp qua website”**.
- `src/app/(web)/lien-he/page.tsx:~80` — “Đặt mua lẻ cho gia đình, quà tặng”.
- `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx:~35–75` — buying option **“Đặt mua trực tiếp”**.
- `src/app/(web)/mua-bia-benediktiner-chinh-hang/page.tsx:~120–170` — body copy “đặt mua qua website”.

## 3.4. `Thêm vào giỏ`

- `src/app/(web)/components/ProductOrderActions.tsx:25–28` — toast “Đã thêm … sản phẩm vào giỏ hàng”.
- `src/app/(web)/components/ProductOrderActions.tsx:53–57` — button **“Thêm vào giỏ”**.
- `src/app/(web)/components/ProductCard.tsx:65–68` — add-to-cart + toast “vào giỏ hàng”.
- `src/app/(web)/components/ProductCard.tsx:~153–158` — title/aria **“Thêm vào giỏ” / “Thêm vào giỏ hàng”**.

## 3.5. `Giỏ hàng`

- `src/app/(web)/components/ProductOrderActions.tsx:25–28` — toast.
- `src/app/(web)/components/ProductCard.tsx:65–68, ~153–158` — toast/title/aria.
- `src/app/(web)/components/WebHeader.tsx:85–99` — aria-label **“Giỏ hàng…”** + cart icon/badge.
- `src/app/(web)/components/MobileBottomNav.tsx:~24–29` — label **“Giỏ Hàng”**.
- `src/app/(web)/dat-hang/page.tsx` — checkout/cart-empty/cart item UI.
- `README.md` — mô tả **“Giỏ hàng & Đặt hàng nhanh”**.

## 3.6. `Thanh toán`

- `src/app/(web)/dat-hang/page.tsx:~260–575` — heading **Thanh Toán**, payment method, submit.
- `src/app/(web)/page.tsx:~288–291` — FAQ “thanh toán khi nhận hàng (COD)”.
- `src/app/(web)/chinh-sach-thanh-toan/page.tsx` — title/heading/body nhiều occurrence **Thanh Toán**.
- `src/app/(web)/dieu-khoan-su-dung/page.tsx:~52–180` — điều khoản payment/COD/chuyển khoản.
- `src/app/(web)/chinh-sach-bao-mat/page.tsx` — mục đích xử lý đơn/thanh toán; nội dung bảo mật thanh toán.

## 3.7. `Checkout`

- `README.md` — cây thư mục mô tả `/dat-hang` là **“Trang đặt hàng (Checkout)”**; phần Features mô tả checkout form.
- Trong runtime, route tên `/dat-hang`; không thấy route `/checkout`. Một số prop/variant dùng lowercase `checkout` (ví dụ `AlcoholWarning variant="checkout"`) nhưng đó không phải CTA.

## 3.8. `COD`

- `src/app/(web)/page.tsx:~288–291` — FAQ và answer về **COD**.
- `src/app/(web)/dat-hang/page.tsx:~496–520` — **“Thanh toán khi nhận hàng (COD)”**.
- `src/app/(web)/chinh-sach-thanh-toan/page.tsx` — section **COD**.
- `src/app/(web)/dieu-khoan-su-dung/page.tsx` — COD trong điều khoản thanh toán.
- `src/lib/orders/validation.ts` — semantic payment value lowercase `cod` trong `ORDER_PAYMENT_METHODS`.
- `src/app/(web)/dat-hang/page.tsx:~33–37` — payment state mặc định lowercase `cod`.

---

# 4. Vị trí hiển thị thông tin pháp nhân

## 4.1. Nguồn NAP trung tâm

`src/lib/seo/business.ts:~3–15`

- `legalName`: **Công ty TNHH Euro Choice Việt Nam**
- `alternateName`: Bia Thầy Tu
- `streetAddress`: **659A Lạc Long Quân**
- `addressLocality`: **Phường Tây Hồ**
- `addressRegion`: **Hà Nội**
- `addressCountry`: VN
- telephone/email cũng được định nghĩa trong object này.

## 4.2. Các vị trí render/nhắc pháp nhân

| File | Dòng/range | Thông tin |
|---|---:|---|
| `src/app/(web)/components/WebFooter.tsx` | ~20–30 | `Công ty TNHH Euro Choice Việt Nam`; địa chỉ `659A Lạc Long Quân, Phường Tây Hồ, Hà Nội`; **Giấy CN ĐKDN số 0110870013 do Sở KH&ĐT TP Hà Nội cấp ngày 07/10/2024**. |
| `src/app/(web)/components/JsonLd.tsx` | organization/seller schema | Organization/seller lấy `BUSINESS_NAP.legalName` và postal address. |
| `src/app/(web)/ve-chung-toi/page.tsx` | section “Đơn vị vận hành & phân phối” | Pháp nhân, địa chỉ, điện thoại, email từ `BUSINESS_NAP`. |
| `src/app/(web)/chinh-sach-bao-mat/page.tsx` | contact/legal section | Tên công ty và địa chỉ từ `BUSINESS_NAP`. |
| `src/app/(web)/chinh-sach-thanh-toan/page.tsx` | bank/contact sections | Tên người nhận có fallback `BUSINESS_NAP.legalName`; địa chỉ/chi nhánh liên quan doanh nghiệp. |
| `src/app/(web)/dieu-khoan-su-dung/page.tsx` | contact/legal section | Tên pháp nhân/địa chỉ doanh nghiệp. |

### Mã số thuế / giấy phép kinh doanh

- **Không thấy chuỗi được gắn nhãn rõ “MST” hoặc “Mã số thuế”** trong các nguồn runtime/legal đã kiểm tra.
- Số **`0110870013`** xuất hiện ở footer với nhãn **“Giấy CN ĐKDN số”**, không tự diễn giải lại thành MST trong audit này.
- Không thấy số “giấy phép bán rượu/bia” riêng biệt trong các source runtime đã kiểm tra.

### Bộ Công Thương

- Không thấy logo **“Đã thông báo Bộ Công Thương”** hoặc câu khẳng định website đã thông báo/đăng ký với Bộ Công Thương trong các source runtime/legal đã kiểm tra.

---

# 5. State management / API route / server action liên quan đơn hàng

## 5.1. Client state

### `src/stores/useCartStore.ts:4–57`

Zustand persisted store chứa:

- `items: CartItem[]`
- `quantity`
- `addItem`
- `removeItem`
- `updateQuantity`
- `clearCart`
- `getTotalItems`
- `getSubtotal`
- persisted key: `cart-storage`

Đây là state trung tâm của cart và được dùng bởi ProductCard, ProductOrderActions, WebHeader, MobileBottomNav và checkout.

## 5.2. Order API

### `src/app/api/order/route.ts`

Route `POST /api/order` là backend order processor thực sự:

1. nhận `OrderRequestBody`;
2. validate customer/items/age/payment;
3. lookup product server-side;
4. tính lại pricing thay vì tin giá client;
5. validate/apply promo;
6. tính subtotal/discount/shipping/grand total;
7. insert record vào `orders`;
8. insert `order_items`;
9. cập nhật promo usage;
10. gửi Telegram notification;
11. gửi Google Sheets/Apps Script;
12. trả `orderNumber` về checkout.

## 5.3. Promo API

### `src/app/api/promo/validate/route.ts`

- Nhận `code`, `subtotal`.
- Lookup promo active.
- Kiểm tra minimum order/expiry.
- Trả discount/result cho `/dat-hang`.

Nguồn promo:

- `src/lib/data/promo.ts:3–18`
- `src/data/promo_codes.json:1–20`

## 5.4. Order domain helpers

- `src/lib/orders/pricing.ts` — pricing/shipping/discount/total.
- `src/lib/orders/types.ts` — request/item/customer/payment monetary model.
- `src/lib/orders/validation.ts` — order validation và payment methods `cod`, `bank_transfer`.
- `src/lib/orders/productLookup.ts` — server trusted product/price lookup.

## 5.5. Downstream order integrations

- `src/lib/integrations/telegram.ts`
- `src/lib/integrations/googleSheets.ts`
- `scripts/google-apps-script-orders.gs`

Các file này phục vụ notification/persistence phụ cho order flow.

## 5.6. Server Actions

- **Không phát hiện Server Action order chuyên biệt** (`"use server"`) trong cấu trúc đã quét.
- Server-side order mutation hiện nằm ở **Route Handler** `src/app/api/order/route.ts`.

## 5.7. Customer account/auth

- Không thấy authenticated customer account store hoặc route đăng nhập/đăng ký khách hàng.
- `customer` trong order là dữ liệu guest checkout, không phải account state.

---

# 6. Structured data — Product / Offer / AggregateOffer

## 6.1. Generator chính

### `src/app/(web)/components/JsonLd.tsx:~101–175`

Nhánh `type === 'product'` tạo object:

- `"@type": "Product"`
- Nếu có exact price: `offers: { "@type": "Offer", priceCurrency, price, availability, url, seller }`
- Nếu chỉ có price range: `offers: { "@type": "AggregateOffer", lowPrice, highPrice, offerCount, priceCurrency }`

Seller dùng organization/legal info từ `BUSINESS_NAP`.

Ngoài ra `CANONICAL_FAQS` trong cùng file (~40–50) có answer chứa **“đặt mua trực tiếp qua website”**.

## 6.2. Call sites Product JSON-LD

| File | Dòng/range | Cách dùng |
|---|---:|---|
| `src/app/(web)/components/ProductCard.tsx` | 100–113 | `<JsonLd type="product" ... price={...} />` cho product card. |
| `src/app/(web)/san-pham/[slug]/page.tsx` | 62–76 | Product detail tính price và phát Product JSON-LD. |
| `src/app/(web)/san-pham/page.tsx` | qua `ProductCard` | Catalogue gián tiếp phát Product JSON-LD cho card. |
| `src/app/(web)/components/ProductTabs.tsx` | qua `ProductCard` | Product tabs/homepage gián tiếp phát Product JSON-LD. |

## 6.3. Nguồn giá cho structured data

### `src/lib/seo/productPricing.ts`

Map product → `price` hoặc `lowPrice/highPrice`, sau đó được `JsonLd.tsx` dùng để tạo `Offer`/`AggregateOffer`.

## 6.4. Feed thương mại ngoài JSON-LD

### `src/app/google-merchant.xml/route.ts`

Không phải JSON-LD, nhưng là product commerce feed cho Google Merchant và phát:

- product ID/title/description/link;
- availability;
- `g:price`.

Đây nên được coi là một commerce endpoint độc lập khi chuyển sang brochure-only.

---

# 7. Các dependency/điểm nối cần chú ý khi gỡ commerce ở task sau

> Phần này chỉ là dependency map; **chưa đề xuất/chưa thực hiện thay đổi**.

1. `ProductCard` và `ProductOrderActions` là hai nguồn CTA mua hàng chính.
2. `WebHeader` và `MobileBottomNav` nối người dùng trực tiếp tới `/dat-hang`.
3. `/dat-hang` phụ thuộc `useCartStore`, `/api/promo/validate`, `/api/order`.
4. `/api/order` phụ thuộc `lib/orders/*`, promo data, Supabase, Telegram và Google Sheets.
5. `/mua-bia-benediktiner-chinh-hang` có hard-link `/dat-hang`; không chỉ phụ thuộc component dùng chung.
6. `LanguageContext` vẫn có label `nav.order = 'Đặt Hàng Ngay'`.
7. `JsonLd.tsx` + `productPricing.ts` phát Offer/AggregateOffer, nên việc giữ Product SEO nhưng bỏ offer cần tách cẩn thận.
8. `google-merchant.xml` là commerce feed riêng, không bị loại bỏ chỉ bằng cách xóa cart UI.
9. Các policy page và FAQ còn copy giao dịch nên việc xóa checkout route không đủ để loại toàn bộ chuỗi cấm.
10. `/nhan-uu-dai` cần được rà riêng theo nguyên tắc form tư vấn vì hiện có product preference + address + voucher/order copy.

---

# 8. Kết luận kiểm kê

**Kết luận:** ở snapshot hiện tại, `biathaytu.com-website` vẫn có đầy đủ các lớp của một e-commerce storefront:

- presentation: price/cart/buy/checkout UI;
- client state: persisted cart;
- promotion: coupon data + validation API;
- transaction: order API;
- persistence: database insert `orders`/`order_items`;
- fulfillment/notification: shipping/payment fields, Telegram, Google Sheets;
- acquisition: Merchant feed;
- SEO commerce: Product + Offer/AggregateOffer structured data;
- legal/copy: payment, COD, delivery, sales contract, order language.

Vì vậy, chuyển sang brochure-only cần xử lý **theo dependency graph**, không chỉ ẩn nút mua hoặc xóa `/dat-hang`.

---

## File thay đổi trong task audit này

- **THÊM:** `/RA-SOAT.md`
- **KHÔNG SỬA:** bất kỳ file code/config/data/runtime nào khác.
- **KHÔNG XÓA route** trong task này.
- **KHÔNG sửa link nội bộ** trong task này.
- Build không được dùng để biến đổi code; đây là task kiểm kê/documentation-only. Runtime source vẫn nguyên trạng.
