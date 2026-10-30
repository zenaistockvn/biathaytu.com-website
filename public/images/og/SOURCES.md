# Ảnh chia sẻ (og:image) cho Zalo, Facebook

Mọi file ở đây là JPEG 1200x630 dựng từ ảnh chính hãng có sẵn, không có ảnh AI. Test `src/app/share-images.test.ts` kiểm kích thước, dung lượng và việc mỗi sản phẩm đều có thẻ.

| File | Nguồn |
| --- | --- |
| `home.jpg` | Cắt phủ từ `images/brand/benediktiner-official/home-hero.jpg` (giữ phần ly và chai bên phải) |
| `garden.jpg` | Cắt phủ từ `images/brand/benediktiner-official/beer-garden-closeup.jpg` |
| `restaurant.jpg` | Cắt phủ từ `images/restaurant/phong-vip-benediktiner.jpg` |
| `bitburger.jpg` | Cắt phủ từ `images/brand/bitburger-official/siegelhopfen-field.jpg` |
| `products/<slug>.jpg` | Ảnh sản phẩm đầu tiên của SKU trong `src/data/products.json` (nền đã tách), đặt giữa nền xanh đêm `#1C3157`, cao tối đa 560px. Ảnh vuông có nền sẵn thì vừa chiều cao, hai bên xanh đêm |

| `articles/<slug>.jpg` | Cắt phủ từ ảnh bìa (`thumbnail_url`) của bài cùng `slug` trong `src/data/articles.json`; bài Ettal dùng ảnh 600x400 nên phóng 2 lần; bài `oktoberfest-la-gi-le-hoi-bia-munich` dùng ảnh bom Festbier tách nền nên đặt trên nền xanh đêm `#1C3157` như ảnh sản phẩm |

Vì sao có thư mục này: ảnh sản phẩm tách nền cao và hẹp (tỉ lệ khoảng 1:4) bị Zalo, Facebook cắt phủ thành một đoạn thân chai, và một số nền tảng không hiển thị `.webp` ổn định.

Dựng lại khi thêm SKU mới (ffmpeg, đặt `slug` và `anh` theo sản phẩm):

```bash
ffmpeg -y -f lavfi -i "color=c=0x1C3157:s=1200x630" -i public/images/products/official/<anh>.webp \
  -filter_complex "[1:v]format=rgba,scale=w=1000:h=560:force_original_aspect_ratio=decrease:flags=lanczos[p];[0:v][p]overlay=(W-w)/2:(H-h)/2:format=auto" \
  -frames:v 1 -q:v 3 public/images/og/products/<slug>.jpg
```
