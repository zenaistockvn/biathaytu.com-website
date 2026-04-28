import { createClient } from '@supabase/supabase-js';

// The script runs with --env-file=.env.local, so process.env will have the vars.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    title: "Luật Tinh Khiết 1516 (Reinheitsgebot): Di Sản Bia Đức Hơn 500 Năm",
    slug: "luat-tinh-khiet-1516-reinheitsgebot",
    meta_description: "Tìm hiểu Luật Tinh Khiết 1516 (Reinheitsgebot) - nền tảng làm nên đẳng cấp và chất lượng của bia Đức suốt hơn 500 năm qua.",
    thumbnail_url: "/images/products/story_monastery_v2.png",
    word_count: 850,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Một buổi tối thảnh thơi, bạn rót cho mình một ly Benediktiner. Sắc bia hổ phách sóng sánh cùng lớp bọt trắng muốt mịn màng. Cảm giác tròn vị, thuần khiết đọng lại sau mỗi ngụm không phải là sự tình cờ. Nó là kết quả của một di sản vô giá: <strong>Luật Tinh Khiết 1516 (Reinheitsgebot)</strong>.</p>
      <h2>Bộ Luật Về Bia Lâu Đời Nhất Thế Giới</h2>
      <p>Ra đời năm 1516 tại Bavaria, Reinheitsgebot quy định khắt khe rằng bia Đức chỉ được nấu từ đúng 4 nguyên liệu cơ bản: nước, mạch nha, hoa bia và men bia. Không chất phụ gia, không hóa chất tạo hương, không ngô hay gạo để giảm chi phí. Quy định này đảm bảo mọi giọt bia Đức đều đạt đến sự thuần khiết tối đa.</p>
      <h2>Bảo Chứng Cho Đẳng Cấp Xứng Tầm</h2>
      <p>Những thương hiệu như Benediktiner Weissbier hay Bitburger vẫn kiên định với truyền thống này suốt hàng thế kỷ. Mạch nha lúa mì tuyển chọn, hoa bia Hallertau trứ danh cùng dòng nước suối Bavaria tinh khiết hội tụ lại, tạo nên cấu trúc hương vị phức tạp mà không cần bất kỳ chất xúc tác nhân tạo nào.</p>
      <p>Người sành bia nhận ra ngay sự khác biệt. Hậu vị sạch, cảm giác êm ái khi thưởng thức và sự khoan khoái sau mỗi bữa tiệc là minh chứng rõ rệt nhất. Chọn một chai bia chuẩn Luật Tinh Khiết chính là gu chọn lọc tinh tế của những người biết mình thực sự muốn gì.</p>
      <h2>Trải Nghiệm Hương Vị Vượt Thời Gian</h2>
      <p>Hãy để bữa tiệc sắp tới của bạn thêm phần chỉn chu với những ly bia Đức chuẩn mực. Không cần ồn ào, chỉ cần đúng nhịp, đúng vị.</p>
      <p><em>Inbox ngay cho Bia Thầy Tu để nhận gợi ý dòng bia phù hợp nhất với phong cách tiếp khách của bạn.</em></p>
    `
  },
  {
    title: "Bia Lúa Mì Đức (Weissbier) Là Gì? Sự Thật Về Lớp Bọt Và Mùi Chuối Chín",
    slug: "bia-lua-mi-duc-weissbier-la-gi",
    meta_description: "Khám phá thế giới của Bia lúa mì Đức (Weissbier): bí ẩn đằng sau lớp bọt kem dày dặn và hương chuối đinh hương đặc trưng.",
    thumbnail_url: "/images/products/official/benediktiner/glass_removebg.png",
    word_count: 900,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Bàn tiệc cuối tuần đã dọn sẵn. Bạn nâng chai Benediktiner Weissbier Naturtrüb, rót nhẹ nhàng vào chiếc ly thủy tinh thon dài. Lớp bọt kem trắng ngần dâng lên, dày và lâu tan, đi kèm đó là hương thơm thoang thoảng của chuối chín và đinh hương. Đó chính là linh hồn của Weissbier – dòng bia lúa mì trứ danh nước Đức.</p>
      <h2>Weissbier Là Gì?</h2>
      <p>Weissbier (hoặc Weizenbier) có nghĩa đen là "bia trắng" hay bia lúa mì. Điểm đặc trưng nhất của dòng bia này là tỷ lệ lúa mì lên đến hơn 50% trong thành phần mạch nha, kết hợp cùng mạch nha đại mạch. Sự kết hợp này mang lại cho bia một màu vàng hổ phách đục tự nhiên (Naturtrüb) do không qua màng lọc, giữ lại toàn bộ lượng men sống quý giá.</p>
      <h2>Giải Mã Hương Vị Độc Đáo</h2>
      <p>Nhiều người lầm tưởng hương chuối và đinh hương là do phụ gia. Sự thật nằm ở dòng men lên men nổi (ale yeast) đặc biệt của các tu viện Đức. Trong quá trình lên men tự nhiên ở nhiệt độ ấm, men sinh ra các este và phenol tự nhiên, tạo nên nốt hương trái cây đặc trưng, tròn trịa và êm dịu. Vị bia đầy đặn, mượt mà lan tỏa trong khoang miệng, để lại hậu vị thanh mát và ngọt nhẹ.</p>
      <h2>Thưởng Thức Đúng Gu</h2>
      <p>Rót Weissbier là một nghệ thuật. Cần nghiêng ly 45 độ, rót chậm rãi, và đừng quên lắc nhẹ chút bia còn lại ở đáy chai để hòa tan hoàn toàn lớp men sống, rồi rót nốt để tạo thành "vương miện bọt" hoàn hảo.</p>
      <p><em>Bạn đã sẵn sàng để tự mình trải nghiệm? Nhắn "THỬ" cho Bia Thầy Tu để team gửi ngay set trải nghiệm Weissbier dành cho người mới bắt đầu.</em></p>
    `
  },
  {
    title: "Nghệ Thuật Food Pairing: Kết Hợp Món Ăn Hoàn Hảo Cùng Bia Đức",
    slug: "nghe-thuat-food-pairing-cung-bia-duc",
    meta_description: "Hướng dẫn kết hợp ẩm thực (food pairing) cùng bia Đức chuẩn gu: hải sản, đồ nướng BBQ, phô mai và các dòng bia Benediktiner, Bitburger.",
    thumbnail_url: "/images/products/food_seafood_flatlay.png",
    word_count: 950,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Một bữa tiệc chỉn chu không thể thiếu sự hài hòa giữa đồ ăn và thức uống. Thay vì những sự lựa chọn quen thuộc, kết hợp món ngon cùng bia Đức nhập khẩu premium đang trở thành gu thưởng thức tinh tế của người hiện đại.</p>
      <h2>Weissbier Và Hải Sản: Bản Giao Hưởng Thanh Mát</h2>
      <p>Hương thơm chuối chín và đinh hương của Benediktiner Weissbier là đối tác hoàn hảo cho các món hải sản hấp, tôm nướng hay salad tươi mát. Vị lúa mì thanh nhẹ cùng lớp bọt kem mịn màng giúp cân bằng vị mặn của biển cả, đánh thức vị giác một cách tinh tế mà không làm lấn át hương vị nguyên bản của món ăn.</p>
      <h2>Dunkel Weissbier Và Bữa Tiệc Thịt Nướng</h2>
      <p>Sắc nâu hạt dẻ cùng nốt hương caramel, mạch nha rang của Benediktiner Dunkel sinh ra là để dành cho những miếng steak bò mọng nước hay sườn nướng BBQ đậm vị. Vị đậm đà của bia đen kết hợp cùng sốt nướng tạo nên một tổng thể ấm áp, hậu vị sâu lắng, thích hợp cho những buổi tối trò chuyện thân mật.</p>
      <h2>Bitburger Pilsner Cùng Các Món Nhắm Gọn</h2>
      <p>Khi xem một trận bóng hay những buổi after-work năng động, Bitburger Premium Pils với hoa bia Hallertau đắng thanh, giòn rụm sẽ làm mới khoang miệng cực kỳ hiệu quả khi dùng chung với pizza, đồ chiên rán hay phô mai tổng hợp.</p>
      <p>Một người chủ nhà tinh ý luôn biết cách chọn đúng dòng bia cho đúng món ăn. Bàn tiệc của bạn đã lên thực đơn chưa?</p>
      <p><em>Nhắn "TIỆC" kèm số lượng khách, Bia Thầy Tu sẽ gợi ý ngay set bia và cách kết hợp món ăn xứng tầm cho bạn.</em></p>
    `
  },
  {
    title: "Giải Thưởng iTQi 3 Sao Là Gì? Vì Sao Benediktiner Weissbier Được Xướng Tên?",
    slug: "giai-thuong-itqi-3-sao-benediktiner-weissbier",
    meta_description: "Tìm hiểu giải thưởng Superior Taste Award (iTQi) 3 Sao và lý do Benediktiner Weissbier chinh phục hội đồng chuyên gia quốc tế.",
    thumbnail_url: "/images/products/story_monastery_v2.png",
    word_count: 880,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Trong thế giới ẩm thực và đồ uống cao cấp, Viện Hương Vị Quốc Tế (iTQi) tại Brussels, Bỉ, được ví như giải "Oscar" danh giá. Năm 2022, Benediktiner Weissbier Naturtrüb tự hào nhận giải thưởng cao nhất: <strong>Superior Taste Award - 3 Sao (Hương Vị Vượt Trội)</strong>. Đây là dấu ấn khẳng định chất lượng đẳng cấp của dòng bia tu viện truyền thống.</p>
      <h2>Quy Trình Đánh Giá Khắc Nghiệt</h2>
      <p>Giải thưởng iTQi không hề dễ dàng đạt được. Hội đồng giám khảo gồm hơn 200 bếp trưởng và chuyên gia nếm thử (sommelier) từ các hiệp hội uy tín nhất Châu Âu. Họ đánh giá sản phẩm qua quy trình "mù" (blind tasting), không hề biết tên thương hiệu hay xuất xứ, chỉ tập trung hoàn toàn vào ấn tượng thị giác, khứu giác, cấu trúc và hậu vị.</p>
      <h2>Sự Chinh Phục Tuyệt Đối</h2>
      <p>Để đạt được 3 sao – mức điểm trên 90/100, một sản phẩm phải thực sự xuất chúng. Benediktiner Weissbier đã thuyết phục hoàn toàn hội đồng bởi sắc hổ phách đục lấp lánh, lớp bọt kem dày dặn giữ lâu. Mùi hương hòa quyện giữa lúa mì mạch nha và nốt hương trái cây tự nhiên đã mang đến trải nghiệm thưởng thức tròn trịa, cân bằng hoàn hảo.</p>
      <h2>Sự Lựa Chọn Của Người Có Gu</h2>
      <p>Một chai bia đạt iTQi 3 sao trên bàn tiệc không chỉ là thức uống, mà còn là câu chuyện về lịch sử hơn 400 năm ủ bia của Tu Viện Ettal. Đó là sự chỉn chu của người mời, và sự trân trọng dành cho người thưởng thức.</p>
      <p><em>Inbox ngay để Bia Thầy Tu mang tận tay bạn trải nghiệm hương vị 3 sao quốc tế này.</em></p>
    `
  },
  {
    title: "Sự Khác Biệt Giữa Bia Đen (Dunkel) Và Bia Vàng (Naturtrüb) Lúa Mì",
    slug: "su-khac-biet-giua-bia-den-dunkel-va-bia-vang-naturtrub",
    meta_description: "Bia đen (Dunkel) và bia vàng (Naturtrüb) của Đức có gì khác biệt? Hướng dẫn chọn bia lúa mì chuẩn gu theo từng dịp và món ăn.",
    thumbnail_url: "/images/products/official/benediktiner/bottle_removebg.png",
    word_count: 820,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Đứng trước hai lựa chọn kinh điển của nhà Benediktiner: Weissbier Naturtrüb (bia lúa mì vàng) và Weissbier Dunkel (bia lúa mì đen), không ít người băn khoăn đâu mới là "chân ái" cho bữa tiệc tối nay. Cả hai đều mang DNA tu viện truyền thống, nhưng lại vẽ nên hai bức tranh hương vị hoàn toàn riêng biệt.</p>
      <h2>Naturtrüb: Sức Sống Thanh Mát</h2>
      <p>Naturtrüb đại diện cho sự tươi mới. Bia có màu vàng hổ phách đục, bọt kem trắng bồng bềnh. Mạch nha lúa mì tự nhiên mang đến hương chuối và đinh hương đặc trưng, thoảng chút mật ong nhẹ nhàng. Vị bia thanh, mát mẻ, phù hợp tuyệt đối cho những buổi chiều tụ tập, ăn kèm hải sản hoặc các món salad nhẹ nhàng.</p>
      <h2>Dunkel: Chiều Sâu Lắng Đọng</h2>
      <p>Trái ngược với sự tươi sáng của Naturtrüb, Dunkel khoác lên mình màu nâu hạt dẻ quyến rũ nhờ quá trình rang mạch nha kỹ lưỡng. Tầng hương phức hợp hơn với sự xuất hiện của caramel, chuối nướng và socola nhẹ. Vị đậm đà, ấm áp len lỏi vào từng tế bào vị giác. Dunkel là lựa chọn hoàn hảo cho những đêm muộn, nhâm nhi cùng steak bò, sườn nướng hay phô mai ủ lâu năm.</p>
      <h2>Chọn Bia Theo Bối Cảnh</h2>
      <p>Bạn không cần phải là chuyên gia để chọn đúng bia. Chỉ cần hiểu không khí buổi tiệc. Nếu cần sự cởi mở, tươi vui: chọn Naturtrüb. Nếu cần chiều sâu, tĩnh lặng và đậm đà: chọn Dunkel.</p>
      <p><em>Bạn vẫn chưa chắc chắn? Inbox kèm mô tả gu của bạn — mình sẽ tư vấn cá nhân ngay.</em></p>
    `
  },
  {
    title: "Khám Phá Tu Viện Ettal: Nơi Lưu Giữ Công Thức Bia Hơn 400 Năm",
    slug: "kham-pha-tu-vien-ettal-cong-thuc-bia-400-nam",
    meta_description: "Hành trình ngược thời gian về Bavaria, khám phá Tu Viện Ettal - cái nôi sinh ra dòng bia thầy tu Benediktiner trứ danh thế giới.",
    thumbnail_url: "/images/products/story_monastery_v2.png",
    word_count: 910,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Có những hương vị được tạo ra trong phòng thí nghiệm hiện đại, nhưng cũng có những hương vị được tôi luyện qua hàng thế kỷ tĩnh lặng dưới hầm ngầm của các tu viện cổ kính. Benediktiner Weissbier thuộc về vế thứ hai, bắt nguồn từ Tu Viện Ettal, nằm lọt thỏm giữa vùng núi Bavaria hoang sơ của Đức.</p>
      <h2>Từ Năm 1330 Đến Huyền Thoại Bia Thầy Tu</h2>
      <p>Được Hoàng đế Ludwig xứ Bavaria thành lập vào năm 1330, Tu Viện Ettal không chỉ là nơi tu tập tâm linh mà còn là cái nôi của nghệ thuật ủ bia và làm thảo dược. Bắt đầu từ năm 1609, các thầy tu dòng Benedictine đã chính thức thương mại hóa xưởng ủ bia của mình, tuân thủ nghiêm ngặt Luật Tinh Khiết 1516.</p>
      <h2>Bí Quyết Vượt Thời Gian</h2>
      <p>Trải qua hơn 400 năm, công thức làm bia vẫn được giữ gìn nguyên vẹn. Mạch nha lúa mì tuyển chọn, hoa bia hái thủ công từ vùng Hallertau, cùng nguồn nước suối tinh khiết róc rách chảy từ dãy núi Alps đã hòa quyện cùng loại men nuôi cấy độc quyền của tu viện. Sự kết hợp này tạo ra thứ bia lúa mì có hương vị chuối chín và đinh hương không thể sao chép.</p>
      <h2>Đẳng Cấp Được Bảo Chứng</h2>
      <p>Ngày nay, dù công nghệ hiện đại đã can thiệp vào khâu đóng chai, Benediktiner vẫn giữ vững triết lý ủ bia chậm rãi của các thầy tu. Mở một chai Benediktiner không chỉ là thưởng thức một loại đồ uống, mà là nếm thử một phần lịch sử Châu Âu thu nhỏ.</p>
      <p><em>Bạn đã trải nghiệm hương vị 400 năm tuổi này chưa? Inbox "THỬ" — team Bia Thầy Tu sẽ gửi báo giá set trải nghiệm lần đầu.</em></p>
    `
  },
  {
    title: "Bia Không Cồn Bitburger 0.0%: Lựa Chọn Đẳng Cấp Cho Nhịp Sống Hiện Đại",
    slug: "bia-khong-con-bitburger-0-0-lua-chon-dang-cap",
    meta_description: "Bitburger 0.0% Alkoholfrei - Giải pháp hoàn hảo cho những cuộc gặp mặt không cồn, giữ nguyên hương vị Pilsner Đức chính gốc.",
    thumbnail_url: "/images/products/official/benediktiner/glass_removebg.png",
    word_count: 840,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Một buổi trưa hẹn gặp đối tác quan trọng, hoặc một buổi tối ngay sau phòng gym. Bạn muốn cảm giác sảng khoái của một ly bia lạnh, nhưng lại cần sự tỉnh táo 100% để tiếp tục công việc hoặc cầm vô lăng. Nhịp sống hiện đại đòi hỏi một giải pháp tinh tế hơn là những ly nước lọc nhàm chán. Đó là lúc Bitburger 0.0% Alkoholfrei xuất hiện.</p>
      <h2>Công Nghệ Tách Cồn Chân Không Độc Quyền</h2>
      <p>Điều khiến bia không cồn thường bị chê là hương vị nhạt nhẽo. Bitburger đã giải quyết bài toán này bằng công nghệ ủ bia Pilsner truyền thống, lên men đầy đủ để tạo ra hương vị hoa bia Hallertau đắng thanh và mạch nha đậm đà. Sau đó, họ áp dụng công nghệ chưng cất chân không ở nhiệt độ thấp để tách cồn ra khỏi bia mà không làm mất đi các hợp chất hương vị quý giá.</p>
      <h2>Giữ Nguyên Trải Nghiệm, Không Lo Say Xỉn</h2>
      <p>Rót ra ly, Bitburger 0.0% vẫn mang màu vàng lóng lánh, lớp bọt trắng mịn màng. Ngụm đầu tiên vẫn mang lại cảm giác giòn rụm, thanh mát chuẩn vị Đức. Nó cho phép bạn hòa mình vào mọi cuộc vui, cạn ly cùng bạn bè mà vẫn làm chủ hoàn toàn bản thân.</p>
      <h2>Tôn Trọng Sự Lựa Chọn Của Khách</h2>
      <p>Trong một bữa tiệc thiết đãi, chuẩn bị sẵn vài lon Bitburger 0.0% thể hiện sự chỉn chu và tâm lý của người chủ nhà đối với những vị khách không dùng cồn. Thật tinh tế, và cực kỳ đúng mực.</p>
      <p><em>Inbox ngay cho chúng tôi để bổ sung Bitburger 0.0% vào danh sách đồ uống cho tủ lạnh nhà bạn.</em></p>
    `
  },
  {
    title: "Bí Quyết Rót Bia Lúa Mì Chuẩn Chuyên Gia: Tại Sao Lại Lắc Nhẹ Đáy Chai?",
    slug: "bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia",
    meta_description: "Hướng dẫn cách rót bia lúa mì Weissbier chuẩn chuyên gia Đức, bí quyết giữ bọt kem dầy và hòa quyện men sống hoàn hảo.",
    thumbnail_url: "/images/products/official/benediktiner/bottle_removebg.png",
    word_count: 800,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Có một sự thật ít người biết: cách bạn rót bia quyết định tới 30% trải nghiệm hương vị, đặc biệt là với dòng bia lúa mì (Weissbier) mang men sống nguyên bản như Benediktiner Naturtrüb. Rót sai cách, bạn bỏ lỡ linh hồn của thức uống này.</p>
      <h2>Chuẩn Bị Ly Đúng Kiểu</h2>
      <p>Bia lúa mì cần được rót vào chiếc ly Weizen thủy tinh cao, thon dần ở phần thân và phình ra ở miệng. Thiết kế này giúp khóa chặt hương thơm của chuối và đinh hương, đồng thời tạo không gian cho lớp bọt kem vươn lên mạnh mẽ. Hãy đảm bảo ly đã được rửa sạch và tráng qua nước lạnh trước khi rót.</p>
      <h2>Nghệ Thuật Nghiêng Ly 45 Độ</h2>
      <p>Bắt đầu bằng cách nghiêng ly một góc 45 độ. Rót từ từ bia dọc theo thành ly một cách nhẹ nhàng. Hãy kiên nhẫn, để bia chảy êm ái cho đến khi trong chai còn lại khoảng 2-3 cm bia (tương đương 2 đốt ngón tay).</p>
      <h2>Động Tác Đánh Thức "Men Sống"</h2>
      <p>Dừng lại. Đừng vội rót cạn. Đặt ly xuống. Dùng tay lắc nhẹ chai bia theo vòng tròn để lớp men sống (trầm tích dưới đáy chai) hòa tan hoàn toàn vào lượng bia còn lại. Lúc này, rót thẳng phần bia đục chứa men này lên giữa ly. Bạn sẽ thấy một "vương miện" bọt trắng muốt, bồng bềnh nổi lên tuyệt đẹp.</p>
      <p>Ly bia lúc này đã sẵn sàng. Tròn vị, đậm hương, đẹp mắt. Đúng phong cách thưởng thức của một người sành sỏi.</p>
      <p><em>Save ngay bài viết này lại để lần sau rót bia đúng cách nhé, hoặc tag người bạn rót bia điệu nghệ nhất của bạn vào đây!</em></p>
    `
  },
  {
    title: "Gợi Ý Tặng Quà Đối Tác Bằng Bia Đức Nhập Khẩu: Tinh Tế, Sang Trọng, Đẳng Cấp",
    slug: "tang-qua-doi-tac-bia-duc-nhap-khau-cao-cap",
    meta_description: "Lựa chọn bia Đức nhập khẩu làm quà tặng đối tác doanh nghiệp, khách hàng VIP: thể hiện sự tinh tế, chỉn chu và đẳng cấp khác biệt.",
    thumbnail_url: "/images/products/story_monastery_v2.png",
    word_count: 920,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Khi những món quà truyền thống như rượu vang đỏ hay rượu mạnh dần trở nên quá quen thuộc, việc tìm kiếm một món quà biếu đối tác mang tính độc đáo, thể hiện được gu thẩm mỹ mà không quá phô trương là một nghệ thuật. Bia Đức nhập khẩu cao cấp chính là lời giải hoàn hảo cho bài toán này.</p>
      <h2>Khác Biệt Làm Nên Đẳng Cấp</h2>
      <p>Không phải loại bia nào cũng mang đi biếu được. Những dòng bia sản xuất hàng loạt khó có thể truyền tải sự trân trọng. Nhưng một thùng Benediktiner Weissbier nhập khẩu nguyên chai 100% từ Đức, mang theo câu chuyện 400 năm lịch sử của Tu Viện Ettal và bảo chứng giải thưởng iTQi 3 Sao, lại là một câu chuyện hoàn toàn khác.</p>
      <h2>Sự Chỉn Chu Không Cần Ồn Ào</h2>
      <p>Thiết kế chai cổ điển, nắp bật truyền thống cùng sắc bia hổ phách tự nhiên mang lại cảm giác sang trọng đậm chất Châu Âu. Tặng bia Đức không mang lại cảm giác nặng nề về mặt vật chất, nhưng lại ghi điểm tuyệt đối về sự tinh ý và phong cách sống hiện đại. Người nhận có thể dễ dàng khui một chai để thiết đãi bạn bè dịp cuối tuần, hay nhâm nhi trong một buổi tối thư giãn bên bàn làm việc.</p>
      <h2>Gợi Ý Lựa Chọn Phù Hợp</h2>
      <p>Với khách hàng VIP, thùng Mix 12 chai (gồm 6 chai vàng Naturtrüb và 6 chai đen Dunkel) là một set quà hoàn chỉnh, giúp người nhận trải nghiệm trọn vẹn hai sắc thái hương vị đỉnh cao. Nếu đối tác là người thích sự năng động, các bom bia 5L cực kỳ ấn tượng trên bàn tiệc chắc chắn sẽ làm họ thích thú.</p>
      <p><em>Nhắn "QUÀ" cho Bia Thầy Tu để nhận ngay bộ catalogue gợi ý set quà biếu cao cấp theo từng hạn mức ngân sách của doanh nghiệp bạn.</em></p>
    `
  },
  {
    title: "Nhiệt Độ Thưởng Thức Bia Đức Lý Tưởng Nhất Là Bao Nhiêu?",
    slug: "nhiet-do-thuong-thuc-bia-duc-ly-tuong-nhat",
    meta_description: "Khám phá nhiệt độ ướp lạnh lý tưởng để thưởng thức trọn vẹn hương vị của bia lúa mì Weissbier và bia Pilsner Đức.",
    thumbnail_url: "/images/products/food_bbq.png",
    word_count: 860,
    status: "published",
    tenant_id: "demo-tenant",
    content: `
      <p>Nhiều người có thói quen ướp bia thật sâu trong ngăn đá, hoặc thêm đá lạnh trực tiếp vào ly để giải khát tức thì. Nhưng với những dòng bia cao cấp nhập khẩu từ Đức, việc làm này vô tình phá hỏng hoàn toàn cấu trúc hương vị nguyên bản mà các nghệ nhân đã dày công tạo ra.</p>
      <h2>Quy Tắc Chung: Lạnh Vừa Đủ, Không Bỏ Đá</h2>
      <p>Bia Đức, đặc biệt là các dòng lên men theo chuẩn Luật Tinh Khiết 1516, chứa hàm lượng men sống và tinh dầu hoa bia cực kỳ phong phú. Thêm đá sẽ làm loãng bia, trong khi nhiệt độ quá thấp (dưới 3°C) sẽ khiến các nốt hương trái cây, mạch nha bị "đóng băng" và tê liệt vị giác của bạn. Mọi thứ chỉ còn lại cảm giác lạnh buốt mờ nhạt.</p>
      <h2>Nhiệt Độ Chuẩn Cho Từng Dòng Bia</h2>
      <p>Với dòng <strong>Weissbier (bia lúa mì)</strong> như Benediktiner Naturtrüb, nhiệt độ lý tưởng nhất là từ <strong>7°C đến 9°C</strong>. Ở khoảng nhiệt độ này, hương thơm của đinh hương, chuối chín và cấu trúc bọt kem sẽ phát huy trọn vẹn nhất vẻ đẹp của chúng.</p>
      <p>Với dòng <strong>Dunkel (bia lúa mì đen)</strong>, bạn có thể thưởng thức ở nhiệt độ ấm hơn một chút, khoảng <strong>8°C đến 10°C</strong>. Nhiệt độ ấm hơn giúp làm bật lên hương vị mạch nha rang, caramel và chocolate ẩn sâu bên trong.</p>
      <p>Đối với dòng <strong>Pilsner</strong> như Bitburger, nhiệt độ <strong>6°C đến 8°C</strong> là điểm ngọt ngào nhất để cảm nhận độ giòn rụm và vị đắng thanh đặc trưng của hoa bia Hallertau.</p>
      <h2>Cách Ướp Lạnh Chuyên Gia</h2>
      <p>Hãy bảo quản bia ở ngăn mát tủ lạnh trong 24 giờ trước khi uống. Đừng quên làm mát cả ly thủy tinh trước khi rót. Một tiểu tiết nhỏ nhưng tạo ra khác biệt vô cùng lớn trên bàn tiệc.</p>
      <p><em>Chỉn chu từng chi tiết nhỏ chính là cách thưởng thức xứng tầm. Inbox cho Bia Thầy Tu để nhận thêm nhiều tip hay về nghệ thuật thưởng thức bia nhập khẩu.</em></p>
    `
  }
];

async function seed() {
  console.log("Starting to seed SEO articles...");
  let successCount = 0;
  for (const article of articles) {
    const { error } = await supabase
      .from('seo_articles')
      .insert(article);
    
    if (error) {
      console.error(`Failed to insert ${article.slug}: `, error);
    } else {
      successCount++;
      console.log(`Inserted: ${article.slug}`);
    }
  }
  console.log(`Finished seeding. Successfully inserted ${successCount} articles.`);
}

seed();
