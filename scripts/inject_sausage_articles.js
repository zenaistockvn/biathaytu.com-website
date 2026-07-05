const fs = require('fs');
const path = require('path');

// Helper function to calculate word count from HTML content (stripping tags)
function getWordCount(html) {
  const cleanText = html.replace(/<[^>]*>/g, ' ');
  const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// 2 New Sausage Articles with detailed, high-quality, long-form content (>700 words each)
const newArticles = [
  {
    id: "top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia",
    product_id: null,
    title: "Top 3 Loại Xúc Xích Đức Nhập Khẩu Ăn Kèm Bia Ngon Nhất",
    slug: "top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia",
    meta_description: "Khám phá top 3 loại xúc xích Đức nhập khẩu ăn kèm bia ngon nhất chuẩn vị. Hướng dẫn cách chế biến xúc xích Bratwurst, Wiener hun khói thơm ngon tại nhà.",
    keywords: ["xúc xích đức", "xúc xích đức nhập khẩu", "đồ nhắm bia đức", "xúc xích bratwurst"],
    thumbnail_url: "/images/products/the-wurst/thuringer-bratwurst.png",
    status: "published",
    tenant_id: "biathaytu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rawContent: `<p>Bia Đức từ lâu đã trở thành biểu tượng của sự sảng khoái và tinh tế, nhưng trải nghiệm thưởng thức bia ngoại sẽ không bao giờ trọn vẹn nếu thiếu đi những đĩa đồ nhắm đậm vị. Trong thế giới ẩm thực, xúc xích đức luôn là người bạn đồng hành số một trên bàn bia. Nhiều người thường tìm kiếm dòng xúc xích đức nhập khẩu và chấp nhận mua những sản phẩm đông lạnh dài ngày. Tuy nhiên, thương hiệu The Wurst mang đến một giải pháp hoàn hảo: xúc xích được sản xuất ngay tại Việt Nam bởi chính tay các nghệ nhân xúc xích Đức (German sausage masters), áp dụng 100% công nghệ Đức và gia vị nhập khẩu chính gốc. Việc sản xuất tươi tại chỗ giúp sản phẩm giữ nguyên độ tươi ngon (bảo quản lạnh, không bị đông đá cứng ngắc nhiều tháng như hàng nhập khẩu nguyên cây), đồng thời lưu giữ trọn vẹn 100% hương vị Đức truyền thống.</p>

<div style="margin: 24px 0;">
  <img src="/images/products/the-wurst/thuringer-bratwurst.png" alt="Top 3 loại xúc xích Đức nhập khẩu ăn kèm bia ngon nhất hiệu The Wurst" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<h2>Sức hút khó cưỡng từ đồ nhắm bia đức chuẩn vị thượng hạng</h2>
<p>Không phải ngẫu nhiên mà sự kết hợp giữa bia lúa mì Đức và xúc xích lại nổi tiếng toàn cầu. Vị đắng nhẹ, thanh mát của bia giúp trung hòa chất béo ngậy của thịt nướng, trong khi hương vị đậm đà từ các loại thảo mộc trong xúc xích lại thúc đẩy hậu vị ngọt ngào của mạch nha chín. Để đáp ứng nhu cầu thưởng thức xúc xích đức chất lượng cao tại Hà Nội và Hồ Chí Minh, thương hiệu The Wurst đã ra đời. Điểm khác biệt lớn nhất của The Wurst so với các loại xúc xích đức nhập khẩu đông lạnh trên thị trường chính là quy trình sản xuất fresh (tươi ngon) tại Việt Nam do chính các chuyên gia Đức đảm nhiệm.</p>
<p>Nhờ sản xuất nội địa, xúc xích The Wurst không cần trải qua quá trình cấp đông sâu kéo dài nhiều tháng trời, từ đó giữ được độ mọng nước tự nhiên của thịt heo tuyển chọn và lớp vỏ giòn dai đặc trưng. Từng sớ thịt mềm ngọt hòa quyện cùng các loại gia vị nhập khẩu như kinh giới cay (marjoram), đinh hương, và hạt tiêu đen tạo nên một tổng thể hương vị vô cùng hài hòa, mang lại trải nghiệm chuẩn vị 100% như đang thưởng thức tại lễ hội Oktoberfest ở Bavaria.</p>

<h2>Top 3 loại xúc xích đức ngon nhất hiệu The Wurst bạn phải thử</h2>
<p>Nếu bạn đang lên kế hoạch cho một buổi tụ tập cuối tuần cùng người thân, hãy chuẩn bị ngay top 3 sản phẩm xúc xích đức xuất sắc nhất dưới đây để làm đồ nhắm bia đức thượng hạng:</p>

<h3>1. The Wurst Thüringer Bratwurst — Xúc xích nướng thảo mộc kiểu Đức</h3>
<p>Thüringer Bratwurst là dòng xúc xích nướng trứ danh vùng Thuringia với lịch sử hơn 600 năm. Xúc xích này nổi bật với màu trắng xám tự nhiên của thịt heo tươi không qua chất tạo màu hóa học, hòa quyện với các loại thảo mộc đặc trưng. Khi chế biến bằng phương pháp nướng hoặc áp chảo, lớp vỏ ngoài sẽ cháy cạnh vàng ươm, tỏa ra hương thơm nồng nàn cực kỳ kích thích vị giác. Đây là loại xúc xích lý tưởng nhất để ăn kèm với mù tạt vàng và bánh mì pretzel truyền thống Đức bên bàn tiệc.</p>

<h3>2. The Wurst Wiener — Xúc xích xông khói sồi nhẹ nhàng</h3>
<p>Khác với dòng Bratwurst đậm vị thảo mộc, xúc xích Wiener hun khói mang phong cách thanh nhã hơn với hương thơm khói gỗ sồi tự nhiên thoang thoảng. Xúc xích có cấu trúc thịt xay mịn màng, vỏ ngoài dai giòn nhờ sử dụng ruột cừu tự nhiên. Wiener hun khói rất dễ chế biến, bạn chỉ cần luộc sơ hoặc hấp nóng trong vài phút là có thể thưởng thức. Vị ngọt dịu của thịt kết hợp với vị mặn nhẹ và mùi khói sồi đặc trưng khiến dòng xúc xích này cực kỳ được ưa chuみに bởi cả người lớn và trẻ nhỏ.</p>

<h3>3. Combo Cold Cut The Wurst — Thịt nguội thủ công kiểu Đức sành điệu</h3>
<p>Đối với những buổi tiệc ngẫu hứng hoặc tiếp khách nhanh, Combo Cold Cut 150g là lựa chọn tiện lợi nhất. Đây là sự kết hợp tinh tế giữa các loại thịt nguội thủ công cắt lát mỏng chuẩn Đức. Bạn không cần nấu nướng phức tạp, chỉ cần bày đĩa lạnh cùng với phô mai, olive xanh, dưa chuột muối và nhâm nhi cùng những ly bia mát lạnh. Combo này mang lại trải nghiệm vị giác đa dạng từ béo ngậy, mặn nhẹ đến chua thanh, là món khai vị hoàn hảo cho mọi cuộc vui.</p>

<h2>Hướng dẫn cách chế biến xúc xích Đức chuẩn vị tại nhà</h2>
<p>Để giữ nguyên độ mọng nước và hương thơm thảo mộc của xúc xích đức ngon, phương pháp chế biến đóng vai trò cực kỳ quan trọng. Dưới đây là hai cách chế biến đơn giản nhưng chuẩn vị nhất mà các chuyên gia The Wurst khuyến nghị:</p>

<h3>Nướng áp chảo với bia Đức (Dành cho Thüringer Bratwurst)</h3>
<p>Trước khi áp chảo, bạn không nên khía sâu vào thân xúc xích Bratwurst vì sẽ làm mất đi lượng nước thịt ngọt ngào bên trong. Hãy đổ một chút nước và vài thìa bia lúa mì Đức vào chảo, đun sôi rồi thả xúc xích vào luộc sơ khoảng 2-3 phút cho nóng đều. Sau đó, chắt cạn nước, cho một chút bơ nhạt vào chảo và tiến hành áp chảo xúc xích ở lửa vừa cho đến khi lớp vỏ ngoài chuyển màu vàng nâu cháy cạnh đẹp mắt. Hương vị của bia quyện cùng bơ sẽ làm nổi bật mùi thơm thảo mộc của xúc xích.</p>

<h3>Luộc sơ giữ độ giòn dai (Dành cho Wiener hun khói)</h3>
<p>Đối với xúc xích Wiener hun khói, cách chế biến ngon nhất là luộc trong nước nóng (khoảng 80 độ C, không đun sôi sùng sục) trong vòng 3-5 phút. Việc luộc nước sôi quá mạnh có thể làm rách lớp vỏ ruột cừu tự nhiên và làm trôi đi vị khói sồi thơm ngon. Khi xúc xích căng mọng và nóng đều, vớt ra và thưởng thức ngay khi còn nóng để cảm nhận tiếng "tách" giòn tan khi cắn miếng đầu tiên.</p>

<h2>Thưởng thức xúc xích Đức cùng Bia lúa mì Benediktiner hảo hạng</h2>
<p>Đồ nhắm ngon phải đi đôi với bia xịn. Bộ đôi xúc xích The Wurst và bia lúa mì Benediktiner Weissbier là sự kết hợp hoàng kim của ẩm thực Đức. Men bia sống đục tự nhiên, hương chuối chín ngọt ngào và bọt bia creamy của Benediktiner sẽ nâng tầm vị ngon của xúc xích thảo mộc lên một tầm cao mới. Khách hàng tại Tây Hồ, Hà Nội và các quận nội thành có thể liên hệ ngay đại lý để đặt ship hỏa tốc giao nhanh 2 giờ tận nhà. Hãy tận hưởng không khí lễ hội bia Đức ngay tại phòng khách của bạn với những sản phẩm chất lượng cao nhất!</p>`
  },
  {
    id: "mua-xuc-xich-duc-chinh-hang-o-dau-ha-noi-ship-hoa-toc",
    product_id: null,
    title: "Mua Xúc Xích Đức Chính Hãng Ở Đâu Hà Nội Ship Hỏa Tốc?",
    slug: "mua-xuc-xich-duc-chinh-hang-o-dau-ha-noi-ship-hoa-toc",
    meta_description: "Tìm địa chỉ mua xúc xích Đức nhập khẩu chính hãng tại Hà Nội. Cam kết chất lượng, bảo quản chuẩn lạnh, ship hoả tốc ngay lập tức tại Tây Hồ và các quận nội thành.",
    keywords: ["xúc xích đức hà nội", "mua xúc xích đức ở đâu", "xúc xích đức ngon", "đại lý xúc xích đức tây hồ"],
    thumbnail_url: "/images/products/the-wurst/wiener-hun-khoi.png",
    status: "published",
    tenant_id: "biathaytu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rawContent: `<p>Với sự phát triển mạnh mẽ của văn hóa thưởng thức bia nhập khẩu tại các thành phố lớn, nhu cầu tìm kiếm đồ nhắm bia chất lượng cao ngày càng tăng nhiệt. Trong số đó, xúc xích Đức luôn là món ăn khoái khẩu hàng đầu. Tuy nhiên, nhiều khách hàng vẫn luôn băn khoăn câu hỏi mua xúc xích đức ở đâu tại thủ đô để đảm bảo chuẩn vị truyền thống và tuyệt đối an toàn vệ sinh thực phẩm? Giờ đây, những tín đồ của ẩm thực châu Âu không cần phải đi đâu xa. Showroom Bia Thầy Tu tại địa chỉ 659A Lạc Long Quân, Tây Hồ, Hà Nội tự hào là đại lý phân phối chính thức dòng xúc xích đức hà nội cao cấp mang thương hiệu The Wurst. Dòng sản phẩm này được sản xuất ngay tại Việt Nam bởi các chuyên gia ẩm thực người Đức, sử dụng dây chuyền công nghệ Đức và gia vị nhập khẩu chính gốc, mang đến hương vị chuẩn Đức 100% mà không qua cấp đông sâu kéo dài nhiều tháng.</p>

<div style="margin: 24px 0;">
  <img src="/images/products/the-wurst/wiener-hun-khoi.png" alt="Mua xúc xích Đức ngon chính hãng ở đâu Hà Nội ship hỏa tốc" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<h2>The Wurst — Dòng xúc xích Đức sản xuất tại Việt Nam theo tiêu chuẩn châu Âu</h2>
<p>Nhiều người tiêu dùng Việt Nam có thói quen sính ngoại, thường ưu tiên tìm kiếm các loại xúc xích đức nhập khẩu trực tiếp từ Đức. Tuy nhiên, họ lại không biết rằng xúc xích nhập khẩu nguyên cây thường phải cấp đông sâu ở nhiệt độ cực âm trong nhiều tháng trời để phục vụ quá trình vận chuyển đường biển xa xôi. Việc đông lạnh dài ngày này làm giảm đáng kể độ mọng nước tự nhiên của thịt heo và làm trôi đi hương thơm của các loại thảo mộc nhạy cảm.</p>
<p>Nhận biết được điều đó, đại lý xúc xích đức tây hồ đã mang đến giải pháp đột phá từ thương hiệu The Wurst. Đây là dòng xúc xích được sản xuất trực tiếp tại Việt Nam bởi chính các chuyên gia xúc xích người Đức (German sausage masters). Với việc áp dụng nghiêm ngặt công nghệ Đức, sử dụng máy móc chuyên dụng và các hạt gia vị nhập khẩu, The Wurst mang lại lợi ích kép: Đảm bảo độ tươi ngon tối đa nhờ bảo quản lạnh (chilled) thay vì cấp đông đá cứng, đồng thời lưu giữ 100% hương vị Đức nguyên bản của dòng Thüringer Bratwurst và Wiener hun khói.</p>

<h2>Tại sao The Wurst là dòng xúc xích đức ngon được giới sành bia săn đón?</h2>
<h3>Quy chuẩn vàng tạo nên thương hiệu xúc xích Đức thượng hạng</h3>
<p>Để đạt được danh hiệu xúc xích đức ngon và chinh phục những thực khách sành sỏi nhất tại Hà Nội, The Wurst tuân thủ các cam kết vàng về chất lượng:</p>
<ul>
  <li><strong>Nguyên liệu thịt sạch tuyển chọn:</strong> Sử dụng thịt heo tươi sạch có nguồn gốc rõ ràng, tỷ lệ nạc mỡ được căn chỉnh hoàn hảo theo công thức chuẩn Đức để xúc xích không bị khô hay quá béo.</li>
  <li><strong>Không phụ gia độc hại:</strong> Cam kết 100% không sử dụng hàn sai, chất bảo quản độc hại hay bột tạo ngọt công nghiệp. Vị ngọt của xúc xích hoàn toàn đến từ thịt heo tươi lên men tự nhiên.</li>
  <li><strong>Vỏ ruột tự nhiên giòn dai:</strong> Dùng ruột cừu hoặc ruột heo tự nhiên làm lớp vỏ bọc bên ngoài, tạo độ giòn dai sần sật đặc trưng khi cắn, khác biệt hoàn toàn với các loại vỏ collagen nhân tạo rẻ tiền trên thị trường.</li>
  <li><strong>Gia vị nhập khẩu độc quyền:</strong> Các loại thảo mộc, hương liệu được nhập khẩu trực tiếp từ Đức, mang lại mùi thơm đặc trưng không thể làm giả.</li>
</ul>

<h2>Địa chỉ showroom mua xúc xích Đức uy tín tại Tây Hồ, Hà Nội</h2>
<p>Nếu bạn muốn mua xúc xích đức ngon để chuẩn bị cho bữa tiệc BBQ ngoài trời hay bữa nhậu cuối tuần cùng chiến hữu, hãy ghé thăm Showroom Bia Thầy Tu. Địa chỉ cửa hàng tọa lạc tại: <strong>659A Lạc Long Quân, Xuân La, Tây Hồ, Hà Nội</strong>. Showroom sở hữu hệ thống tủ mát chuyên dụng lớn, bảo quản xúc xích ở nhiệt độ chuẩn từ 0 đến 4 độ C. Đây là nhiệt độ lý tưởng nhất để duy trì chất lượng tươi ngon tuyệt đối của xúc xích fresh, giúp men thịt phát triển tự nhiên và giữ trọn hương vị.</p>
<p>Bên cạnh xúc xích The Wurst, quý khách cũng có thể dễ dàng chọn mua các dòng bia Đức tu viện nổi tiếng như Benediktiner Weissbier hay Bitburger Pilsner nhập khẩu để kết hợp thành một combo hoàn hảo. Sự phối hợp giữa xúc xích thảo mộc nướng cháy cạnh và những ly bia lúa mì mát lạnh sẽ mang đến một hành trình khám phá ẩm thực Bavaria vô cùng đáng nhớ cho các thực khách.</p>

<h2>Dịch vụ ship hỏa tốc 2 giờ tiện lợi tại nội thành Hà Nội & Hồ Chí Minh</h2>
<p>Thấu hiểu bận rộn của khách hàng và những cuộc vui phát sinh đột xuất, đại lý xúc xích đức tây hồ cung cấp dịch vụ giao hàng siêu tốc giao ngay lập tức trong vòng 2 giờ tại toàn bộ các quận nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM). Chỉ cần nhấc máy và liên hệ với chúng tôi, các khay xúc xích tươi ngon sẽ được đóng gói chuyên nghiệp kèm đá giữ lạnh và ship nhanh chóng đến tận cửa nhà bạn.</p>
<p><strong>Thông tin đặt hàng nhanh chóng:</strong></p>
<ul>
  <li><strong>Địa chỉ cửa hàng:</strong> 659A Lạc Long Quân, Xuân La, Tây Hồ, Hà Nội.</li>
  <li><strong>Hotline / Zalo liên hệ:</strong> 0899 19 13 13</li>
  <li><strong>Thời gian phục vụ:</strong> Từ 8:00 đến 22:00 tất cả các ngày trong tuần (kể cả chủ nhật).</li>
</ul>
<p>Hãy liên hệ ngay hôm nay để nhận báo giá sỉ tốt nhất cho các dòng sản phẩm xúc xích The Wurst cao cấp. Thưởng thức ẩm thực văn minh, sành điệu và chúc bạn có một bữa tiệc ấm cúng, trọn vẹn bên bạn bè và gia đình!</p>`
  }
];

// Main Injection Logic
const articlesFilePath = path.join(__dirname, '../src/data/articles.json');
let articles = [];

try {
  if (fs.existsSync(articlesFilePath)) {
    articles = JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
    console.log(`Loaded ${articles.length} articles from ${articlesFilePath}`);
  } else {
    console.log(`Local articles.json not found, initializing empty array.`);
  }
} catch (error) {
  console.error(`Error reading ${articlesFilePath}:`, error);
  process.exit(1);
}

let addedCount = 0;

for (const newArticle of newArticles) {
  // Check if article already exists to prevent duplicates
  const exists = articles.some(a => a.slug === newArticle.slug || a.id === newArticle.id);
  if (exists) {
    console.log(`Article with slug "${newArticle.slug}" already exists. Skipping.`);
    continue;
  }

  // Count words
  const wordCount = getWordCount(newArticle.rawContent);
  console.log(`Processing "${newArticle.title}":`);
  console.log(`  Word count: ${wordCount}`);
  if (wordCount < 700) {
    console.error(`Error: Article "${newArticle.title}" only has ${wordCount} words, which is under the 700-word requirement!`);
    process.exit(1);
  }

  // Build final article object with content equal to rawContent for now (links will be injected by inject_internal_links.js)
  const articleToInject = {
    id: newArticle.id,
    product_id: newArticle.product_id,
    title: newArticle.title,
    slug: newArticle.slug,
    content: newArticle.rawContent,
    meta_description: newArticle.meta_description,
    keywords: newArticle.keywords,
    word_count: wordCount,
    micro_content_count: 0,
    status: newArticle.status,
    tenant_id: newArticle.tenant_id,
    created_at: newArticle.created_at,
    updated_at: newArticle.updated_at,
    thumbnail_url: newArticle.thumbnail_url
  };

  // Add to beginning of articles database
  articles.unshift(articleToInject);
  addedCount++;
}

if (addedCount > 0) {
  try {
    fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
    console.log(`Successfully injected ${addedCount} new articles into ${articlesFilePath}`);
  } catch (error) {
    console.error(`Error writing updated articles database:`, error);
    process.exit(1);
  }
} else {
  console.log('No new articles were added.');
}
