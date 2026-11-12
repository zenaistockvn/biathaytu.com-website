# Bảng sự thật

Chỉ dùng điều ghi ở đây và trong các file dữ liệu được chỉ tới. Mọi thứ khác: `[cần xác minh: ...]`.

## Doanh nghiệp

- CÔNG TY TNHH GERMAN TASTE nhập khẩu và phân phối. Bia Thầy Tu (www.biathaytu.com.vn, luôn có `.vn`) là trang thương hiệu bia Benediktiner. Chuyên trang vang tên là "Vang Đức Nhập Khẩu"; địa chỉ web lấy từ `SITE_URL` trong `vangducnhapkhau.vn/src/data/site.ts`, không gõ tay.
- Địa chỉ showroom, hotline, Zalo: lấy từ `biathaytu.com-website/src/config/company.ts` (`COMPANY_CONFIG`) hoặc `vangducnhapkhau.vn/src/data/site.ts`. Không chép tay, không dùng địa chỉ Đội Cấn, Liễu Giai, Ba Đình làm địa chỉ showroom.

## Giá

Không ghi giá trong skill, không gõ tay giá vào bài.

| Kênh | Nguồn giá | Cách dùng |
|---|---|---|
| web-bia | `biathaytu.com-website/src/data/products.json` | Thân bài không có giá; trang sản phẩm tự lấy từ dữ liệu |
| web-vang | `vangducnhapkhau.vn/src/data/products.ts`, `gifts.ts` | Chỉ qua hàm `gia('slug')`, `giaSet('Tên set')`, tên chai qua `chai('slug')` |
| facebook | Không ghi giá trong caption | Nếu anh duyệt một bài có giá, lấy đúng từ hai nguồn trên vào ngày viết |

Giá vang trong `products.json` của site bia và `products.ts` của site vang đang khác nhau (ghi nhận 12/11/2026). Khi cần nói giá vang, hỏi anh trước.

## Bia

**Benediktiner**
- Ủ chủ yếu tại Lich, bang Hessen, bởi nhà bia tư nhân Ihring-Melchior, theo công thức gốc dòng Biển Đức. Men lấy từ hầm tu viện Ettal (Bavaria). Tu viện do Hoàng đế Ludwig IV lập năm 1330.
- Không viết: "ủ tại tu viện Ettal", "bia Bavaria", "chuẩn Bavaria", "đến từ Bavaria", "các thầy tu nấu bia", "bia do tu sĩ làm".
- "Hơn 400 năm truyền thống": site bia đang dùng cụm này (bài `nguon-goc-bia-thay-tu-tu-vien-ettal`). Được viết đúng như vậy, gắn với truyền thống nấu bia của tu viện, không viết thành "chai bia 400 năm tuổi" hay "công thức không đổi 400 năm". Mốc cụ thể 1609 (năm tu viện dựng nhà bia, theo tài liệu báo chí Bitburger Braugruppe) chưa có trên site: cần anh duyệt trước khi dùng. "Gần 700 năm" chỉ nói về tu viện (1330), không nói về bia.
- Naturtrüb: bia lúa mì đục tự nhiên, hương chuối chín và đinh hương, phục vụ 7 đến 9 °C. Tên dòng trên site là Naturtrüb, không gọi lẫn thành tên khác trong cùng một bài.
- Dunkel: nâu đồng, mạch nha rang, caramel, 8 đến 10 °C.
- Festbier: lon 500ml và bom 5L, 6 đến 8 °C.

**Bitburger Premium Pils**: Bitburg, vùng Eifel (Rheinland-Pfalz); 4 đến 6 °C. Năm 1817 Johann Peter Wallenborn mở xưởng bia ở Bitburg; năm 1883 Theobald Simon, thế hệ thứ ba, chuyển sang lên men chìm kiểu Pilsner; khẩu hiệu "Bitte ein Bit" ra mắt năm 1951 tại hội chợ ANUGA; nhà bia thuộc gia đình Simon (đều đã có trong bài `bitburger-premium-pils-200-nam-bia-pils-vung-eifel`). Bản bóng đá gọi là "Bitburger Football Edition" hoặc "Bitburger phiên bản bóng đá"; không viết tắt "WC".

**Köstritzer Schwarzbier**: Bad Köstritz, Thüringen; bom 5L. Không viết "bia đen số 1 tại Đức". Mốc 1543 và chuyện Goethe là lời của hãng, chưa có trên site: cần anh duyệt trước khi dùng.

**Văn hóa bia Đức đã có bài trên site, dùng được**: Luật Tinh khiết ban hành 23/4/1516 tại Ingolstadt (nước, mạch nha, hoa bia, men); Oktoberfest bắt đầu từ lễ cưới Thái tử Ludwig và Công chúa Therese ngày 12/10/1810; tục Biergarten; cách nâng ly Prost.

**Bom 5L**: van xả khí ở nắp, vòi rót ở chân; ướp tủ mát 6 đến 8 tiếng; không cần máy hay bình CO2.

**Quy cách đang bán**: thùng 12 chai, thùng 12 lon, két 24 lon, bom 5L. Danh sách và quy cách chính xác: `products.json`. Không nói giá lẻ từng chai, từng lon.

**Đã ngừng, không nhắc**: xúc xích The Wurst.

**Bitburger 0.0 Alkoholfrei (bia không cồn), cần anh xác nhận**: skill cũ của AMC ghi đã ngừng bán, nhưng `products.json` của site bia vẫn có trang sản phẩm (ghi nhận 12/11/2026). Cho tới khi anh xác nhận: không viết bài Facebook hay seeding quảng bá dòng này; trên website giữ nguyên, không thêm bài mới. Dù còn bán cũng không gắn với sức khỏe, lái xe, tập gym, mang thai.

## Vang (nguồn: `vangducnhapkhau.vn/docs/DU-LIEU-CHINH-HANG.md`, tra 28/09/2026)

**Thörle**: Saulheim, Rheinhessen. Hai anh em Christoph và Johannes Thörle. Toàn bộ vang có chứng nhận hữu cơ. Đất trầm tích đá vôi phủ hoàng thổ và đất sét.

**Rappenhof**: Alsheim, Rheinhessen. Thành lập 1604 (Hieronymus Hirsch), thành viên VDP từ 1971, chủ hiện tại Elisabeth và Klaus Muth, khoảng 31 ha. Không viết "12 đời".

| Chai | Phong cách | Cồn theo hồ sơ hãng |
|---|---|---|
| Thörle Riesling Trocken | trắng khô | 12,0% (2025) |
| Thörle Austernkalk Riesling Trocken | trắng khô, đất đá vôi vỏ hàu | 12,5% (2025) |
| Thörle Riesling Kabinett | ngọt trái cây (fruchtsüß), dừng lên men ở 9,5% | 9,5% (2025) |
| Thörle Sauvignon Blanc | trắng khô | 12,0% (2025) |
| Thörle Spätburgunder | đỏ, 18 tháng thùng barrique Pháp đã dùng | 13,0% (2023) |
| Thörle Hölle Spätburgunder | đỏ vườn đơn Hölle, gốc nho 50 năm | 13,0% (2023) |
| Rappenhof Riesling Trocken | trắng khô | 12,0% (2025) |
| Rappenhof Riesling Kabinett | hơi ngọt (feinherb) | 10,5% (2025) |
| Rappenhof Oelberg Riesling Auslese 2014 | ngọt, VDP.Große Lage | 7,5% |
| Rappenhof Cuvée Rouge 1604 | đỏ phối Blauer Portugieser và Cabernet Sauvignon, ủ barrique | 12% |

- Số cồn là theo niên vụ hãng đang bán; lô nhập có thể khác niên vụ. Viết "theo hồ sơ hãng, niên vụ X"; số trên nhãn lô hàng là chuẩn.
- Điểm chấm: chỉ được dùng Falstaff 93 điểm cho Oelberg Auslese 2014. Không dùng điểm nào khác.
- Mùi vị: lấy đúng ghi chú của hãng trong `products.ts`, tả bằng thứ người Việt biết (chanh, táo xanh, anh đào).
- Nhiệt độ phục vụ là gợi ý chung, không phải thông số hãng, ghi "khoảng": trắng và Auslese 8 đến 10 °C; đỏ 14 đến 16 °C.
- Quy cách Magnum 1,5L theo danh mục German Taste; trang hãng chỉ ghi chai 0,75L.

## Cần nguồn mới được viết

Giải thưởng, năm, số liệu (ABV, IBU, sản lượng), "nhà phân phối chính thức", lời khách, số khách. Nguồn chấp nhận: trang chính hãng của nhà sản xuất hoặc anh cung cấp.
