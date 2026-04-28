INSERT INTO generated_contents 
(id, product_id, platform, caption, hashtags, image_urls, ai_score, status, tenant_id, content_format) 
VALUES 
-- WEEK 1: Nền Thương Hiệu & Niềm Tự Hào (Heritage/Monastery)
(gen_random_uuid(), 'benediktiner-weissbier', 'facebook', $$Uống bia lon mãi rồi, tối thứ 7 tuần trước mình đổi gió mở thử chai Benediktiner Weissbier này ở nhà. Cảm giác nó khác hẳn anh em ạ.
Khác ở cái vị lúa mì đục nguyên bản, không lọc qua, bọt kem dày mịn như mấy tu viện bên Đức làm từ 400 năm trước. Rót từ từ ra ly, nhâm nhi chặn đĩa thịt nguội mộc mạc thế thôi mà nó đã. Kiểu uống chậm, không cần dô dô nhưng lại rất "nhập tâm".
Người ta nói bia Đức có chiều sâu, công nhận uống cái này xong mới hiểu.
📩 Bạn nào muốn tìm Bia đúng gu cho góc chill cá nhân, nhắn mình tư vấn thêm nhé.$$, $$["#QuyenTrinh", "#BiaThayTu", "#Benediktiner", "#ThuGian"]$$, $$["/images/products/premium_ugc/benediktiner_chill.png"]$$, 9.6, 'approved', 'demo-tenant', 'brand_lifestyle'),

(gen_random_uuid(), 'benediktiner-weissbier', 'facebook', $$Anh em có để ý, có những buổi tối riêng tư ở thư phòng, mình đâu cần bia quá nặng đô hay phải uống lấy lượng. Mình cần cái chất lượng.
Chai Benediktiner Weissbier này là dòng lúa mì truyền thống của tu viện Ettal. Vị thơm mùi chuối chín, chút đinh hương thoang thoảng. Ngồi đọc sách, nhấp một ngụm, cảm thấy bao nhiêu xô bồ ngoài đường khép lại sau cánh cửa. 
Bia chọn kỹ, khoảnh khắc chọn lọc. Chơi hệ này tính ra lại hay.
📩 Inbox để nhận set trải nghiệm đầu tay cho góc riêng của bạn.$$, $$["#BenediktinerWeissbier", "#PremiumLifestyle", "#ThuPhong", "#ThuongThuc"]$$, $$["/images/products/premium_ugc/benediktiner_exact_library.png"]$$, 9.8, 'approved', 'demo-tenant', 'brand_experience'),

(gen_random_uuid(), 'benediktiner-weissbier', 'facebook', $$Nhiều bác hỏi mình vì sao bia nhập của Đức lại đục chứ không trong vắt? Thú thật lúc đầu mình cũng thắc mắc.
Hoá ra dòng Naturtrüb này họ giữ nguyên lớp men sống, không hề lọc qua màng máy công nghiệp. Khi rót ra ly nghiêng 45 độ, lắc nhẹ đáy chai rót nốt bọt men cuối, cốc bia nó bung toả y như nướng bánh mì tươi vậy. Lúa mì, hoa bia, men truyền thống - Đạo luật tinh khiết 1516 nó ngấm vào từng giọt.
📩 Mời anh em nhắn "THỬ" để đặt một thùng, tối nay về rót ra ly ngắm cái màu hổ phách này là ghiền luôn á.$$, $$["#BiaDuc", "#Benediktiner", "#ThoiThuong", "#KienThucBia"]$$, $$["/images/products/premium_ugc/benediktiner_heritage.png"]$$, 9.5, 'approved', 'demo-tenant', 'education_product'),

-- WEEK 2: Bối Cảnh Sử Dụng Tinh Hoa (Executive / Jetsetter)
(gen_random_uuid(), 'bitburger-pilsner', 'facebook', $$Đôi khi phần thưởng sau một tuần cày cuốc sấp mặt chốt số, chỉ đơn giản là lên khoang máy bay ngả lưng sớm, hoặc ngồi một góc rooftop nhìn màn đêm buông. 
Mình hay gọi một lon Bitburger Pils. Lớp bọt trắng mỏng, vị đắng thanh thanh nhưng rất "tỉnh". Uống êm, ngậm một ngụm thấy mát ruột sạch miệng. Không cần nâng ly rôm rả, chỉ cần một lon để tự thưởng cho bản thân vì những mục tiêu đã cán đích.
📩 Ai hợp gu tự do, tinh gọn thế này, nhắn chữ "BIT" mình tư vấn nhanh 1 set gửi tận cửa nhà.$$, $$["#Bitburger", "#RooftopBar", "#SelfReward", "#DoanhNhan"]$$, $$["/images/products/premium_ugc/bitburger_rooftop.png"]$$, 9.7, 'approved', 'demo-tenant', 'lifestyle_moment'),

(gen_random_uuid(), 'bitburger-pilsner', 'tiktok', $$Cái cảm giác thư giãn nhất cuối tuần là gì? Hôm qua mình bay business class, tiếp viên mang ra ly Bitburger lạnh muốt. Nhìn mây trôi bên cửa sổ, uống ngụm bia đắng dịu, bao nhiêu stress công việc tan hết. Mình không rành diễn tả mùi vị, nhưng cái cảm giác "sạch miệng" và "sảng khoái" của dòng Pilsner truyền thống này đỉnh thật. Ai chưa tậu thử 1 thùng gác tủ lạnh thì phí lắm á.
📩 Gõ "THỬ" vào inbox, team gửi thẳng báo giá set trải nghiệm nha.$$, $$["#Bitburger", "#BusinessClass", "#Jetsetter", "#BiaNgoai"]$$, $$["/images/products/premium_ugc/bitburger_businessclass.png"]$$, 9.6, 'approved', 'demo-tenant', 'lifestyle_moment'),

(gen_random_uuid(), 'bitburger-pilsner', 'facebook', $$Chơi Golf thì nắng nóng cạn sức, nên lúc ngồi xe điện anh em mình hay thủ sẵn lon Bitburger lạnh. 
Cái hay của dòng này là vị đắng tao nhã của hoa bia Hallertau, giải khát ngang ngửa nước suối nhưng lại có chất xúc tác của men Đức hảo hạng. Swing mấy lỗ xong làm một ngụm, tỉnh người luôn. Anh em nào thích bia giải khát nhưng vẫn phải "đúng tầm" để tiếp đối tác sân Golf thì lưu dòng này lại nghen.
📩 Inbox để nhận gợi ý set biếu hoặc tiếp khách VIP.$$, $$["#GolfLife", "#Bitburger", "#BiaThayTu", "#ThoiThuong"]$$, $$["/images/products/premium_ugc/bitburger_exact_golf.png"]$$, 9.4, 'approved', 'demo-tenant', 'occasion_sports'),

(gen_random_uuid(), 'benediktiner-hell', 'facebook', $$Bỏ phố về biển vài hôm. Nằm dài trên mép hồ bơi vô cực, tiện tay khui chai Benediktiner Hell.
Dành cho ai chưa biết thì dòng "Hell" (Helles) này vị nó cực kỳ êm ái, màu vàng tươi như nắng sớm, uống trơn tuột và không đắng gắt. Trời nóng như đổ lửa thế này, cầm chai bia ướp lạnh áp vào má, nhìn bọt sùi lên quanh miệng chai... nó là phần thưởng xứng đáng của những chuyến getaway. 
📩 Bác nào đợt tới tính ôm gia đình đi nghỉ mát, inbox tụi mình ship bom 5L hoặc thùng chuẩn Đức để bỏ cốp xe hơi nhé.$$, $$["#BenediktinerHell", "#InfinityPool", "#Getaway", "#PremiumVacation"]$$, $$["/images/products/premium_ugc/hell_exact_villa.png"]$$, 9.5, 'approved', 'demo-tenant', 'brand_lifestyle'),

-- WEEK 3: Kiến Thức Ẩm Thực (Food Pairing Omakase / Penthouse)
(gen_random_uuid(), 'benediktiner-weissbier', 'facebook', $$Trước giờ đi ăn Omakase mình toàn gọi Sake, cuối tuần rồi thử mạnh dạn order chai Benediktiner Weissbier. Kết quả ngoài sức tưởng tượng luôn á.
Vị lúa mì thanh nhẹ, beo béo nhè nhẹ của men nó không hề lấn át vị cá sống tươi rói, mà lại tẩy sạch khoang miệng cực mượt trước khi lên món tiếp theo. Ẩm thực cao cấp không nằm ở việc đồ ăn phải đắt, mà nằm ở sự ghép đôi sao cho tinh tế.
💬 Nhắn "TIỆC" kèm số khách, team sẽ hướng dẫn anh em mẹo chọn dòng bia chuẩn bài cho tiệc hải sản nhé.$$, $$["#Omakase", "#FoodPairing", "#Benediktiner", "#TinhHoaAmThuc"]$$, $$["/images/products/premium_ugc/benediktiner_omakase.png"]$$, 9.9, 'approved', 'demo-tenant', 'food_pairing_premium'),

(gen_random_uuid(), 'benediktiner-dunkel', 'facebook', $$Nhiều anh đi tiếp khách ở Steakhouse quen thói quen khui vang đỏ. Bữa nào chán vang, các anh thử chuyển qua Benediktiner Dunkel xem sao.
Chai này dòng lúa mì đen. Nước bia nâu óng như màu gỗ sồi, vị nó thoảng mùi caramel và mật ong đen. Cắn miếng Tomahawk thịt mọng nước, tợp ngụm Dunkel này vào, cái độ ngậy của bò nó quện với độ dịu của bia lúa mì đỉnh thật sự. Hai anh em ngồi bàn tiệc nói chuyện làm ăn, chạm ly thấy nó có "chiều sâu" khủng khiếp.
📩 Inbox mình gợi ý dòng Dunkel cho các buổi tiệc chốt deal quan trọng nghen.$$, $$["#Steakhouse", "#BenediktinerDunkel", "#BusinessDinner", "#BiaDen"]$$, $$["/images/products/premium_ugc/benediktiner_steakhouse.png"]$$, 9.8, 'approved', 'demo-tenant', 'occasion_hosting'),

(gen_random_uuid(), 'bitburger-pilsner', 'tiktok', $$Khách đến nhà chơi, dọn dẹp đảo bếp sạch sẽ, bày dăm ba món canapé, rồi rút mấy lon Bitburger ướp lạnh sâu trên tủ ra xé. Nhìn cái cảnh lớp sương đọng trên mạn nhôm, nghe tiếng "tách" giòn rụm khi khui ngàm, khách chưa uống đã thấy mát mặt. Đâu cần phải dắt nhau ra tụ điểm ồn ào. Làm chủ nhà tinh tế, dọn đồ xịn mà gọn gàng thì khách nể hơn nhiều.
📩 Inbox để được tư vấn các dòng bia vừa vặn với gu tiếp khách tại tư gia của bạn.$$, $$["#Bitburger", "#TiepKhach", "#ChuNhaTinhTe", "#BiaXayTu"]$$, $$["/images/products/premium_ugc/bitburger_exact_balcony.png"]$$, 9.4, 'approved', 'demo-tenant', 'occasion_hosting'),

-- WEEK 4: Giải Trí & Cá Tính (Audiophile / Tennis / Yacht)
(gen_random_uuid(), 'bitburger-pilsner', 'facebook', $$Anh em chơi đĩa than (vinyl) chắc hay có thói quen giống mình: tắt hết đèn, bật một ngọn đèn vàng, từ từ đặt kim than xuống, rồi... mở bia.
Hôm nay chọn Bitburger Pils. Giai điệu mộc mạc của mâm than Analog đi cùng vị đắng thanh tao, cổ điển của hoa bia Hallertau đúng là "perfect match". Mọi thứ chậm lại, giãn ra. Không vội vàng, không áp lực. Mình uống bia bằng tai và bằng sự chiêm nghiệm á mọi người.
💬 Anh em có gu chill đêm tương tự, comment 1 bài nhạc yêu thích, rồi nhắn tin mình set đồ uống cho nhé.$$, $$["#Audiophile", "#VinylRecords", "#Bitburger", "#ChillNight"]$$, $$["/images/products/premium_ugc/bitburger_exact_audiophile.png"]$$, 9.7, 'approved', 'demo-tenant', 'lifestyle_moment'),

(gen_random_uuid(), 'benediktiner-weissbier', 'facebook', $$Sáng chủ nhật làm nóng người 2 set Tennis xong, ngồi nghỉ mệt làm lèo chai Benediktiner ướp rát lạnh. Cảm giác cái hương lúa mạch quyện với chút mồ hôi trên người nó đã vô cùng tận.
Nhiều bạn nghĩ đi thể thao thì chỉ uống được nước lọc với chanh muối. Này là chưa thử dòng bia lúa mì cao cấp bù khoáng tự nhiên rồi. Vừa sang lại vừa thoả mãn.
📩 Save lại bài này hoặc tag thẳng ông bạn chuyên "hành" mình trên sân banh nỉ vào đây để cuối tuần gạ kèo phạt bia anh em ơi!$$, $$["#TennisLife", "#Benediktiner", "#TheThao", "#CuoiTuan"]$$, $$["/images/products/premium_ugc/weissbier_exact_tennis.png"]$$, 9.5, 'approved', 'demo-tenant', 'occasion_sports'),

(gen_random_uuid(), 'benediktiner-weissbier', 'facebook', $$Sự xa hoa trên một chiếc du thuyền đôi khi không nằm ở chai champagne khui bung toé, mà là lúc tĩnh lặng cầm ly Weizen ngắm đại dương.
Đi biển thì cứ phải là bia lúa mì. Nắng chói chang chiếu xuyên qua màu bia vàng đục, bọt kem trắng tương phản với nước biển xanh vắt. Mình chẳng nói điêu, nhưng cái vị êm ái của Benediktiner trên boong tàu là trải nghiệm mà đàn ông nào cũng nên tự thưởng cho mình một lần.
📩 Bác nào tính đi chơi xa cần nạp đạn cho tàu/villa riêng, inbox team gửi báo giá thùng nhé. Cứ gọi là bốc.$$, $$["#MegaYacht", "#YachtLife", "#BenediktinerWeissbier", "#LuxuryBia"]$$, $$["/images/products/premium_ugc/weissbier_exact_luxuryyacht.png"]$$, 9.6, 'approved', 'demo-tenant', 'lifestyle_moment'),

(gen_random_uuid(), 'benediktiner-dunkel', 'facebook', $$Đêm muộn lượn qua phòng trà Jazz quen, bảo bartender: "Cho anh chai gì đậm đà xíu, tối màu và không ồn ào". Cậu ấy đẩy ra chai Benediktiner Dunkel.
Rót ra ly, màu bia tối thăm thẳm như không khí trong cái quán này vậy. Vị đắng nhẹ, malt rang cháy nồng ấm. Ngồi nghe tiếng saxophone lơi lả, uống cái vị này tự dưng thấy đàn ông trưởng thành không cần tranh cãi to tiếng nữa. Mọi thứ được giải quyết qua cái gật đầu.
📩 Anh em tìm loại bia đen đậm chất đàn ông, inbox mình để nhận thông tin về dòng Dunkel này nhé.$$, $$["#JazzClub", "#Speakeasy", "#Dunkel", "#MenLifestyle"]$$, $$["/images/products/premium_ugc/dunkel_exact_jazz.png"]$$, 9.8, 'approved', 'demo-tenant', 'lifestyle_moment'),

(gen_random_uuid(), 'bitburger-pilsner', 'tiktok', $$Mới ghé một khu Cabana sát biển, kéo rèm trắng lên là gió biển lùa vào lồng lộng. Lôi lon Bitburger từ thùng đá lạnh buốt ra khui. 
Pilsner là phải lạnh sâu, sương đóng li ti quanh miệng lon. Vừa ngắm hoàng hôn đỏ lựng, vừa nhậm nhi cái đắng thanh cuốn hút của bia Đức. Cảm giác như thời gian ở đây chầm chậm trôi chứ ko vội vã như trên phố. Đáng tiền lắm.
📩 Cần giải nhiệt đúng điệu hè này? Inbox mình gửi nhẹ báo giá thùng 24 lon nha.$$, $$["#BeachCabana", "#SunsetChill", "#BitburgerPils", "#BiaDuc"]$$, $$["/images/products/premium_ugc/bitburger_exact_cabana.png"]$$, 9.5, 'approved', 'demo-tenant', 'lifestyle_moment')
;
