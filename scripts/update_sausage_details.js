const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const articlesFilePath = path.join(__dirname, '../src/data/articles.json');
const envPath = path.join(__dirname, '../.env.local');

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key === 'DATABASE_URL') {
        databaseUrl = val;
      }
    }
  });
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found');
  process.exit(1);
}

// Nội dung cập nhật chi tiết cho Bài viết 1
const article1Content = `
<h2>Nghệ Thuật Kết Hợp Bia Đức Và Xúc Xích Đức Chuẩn Vị</h2>
<p>Bia Đức và xúc xích Đức từ lâu đã trở thành biểu tượng ẩm thực bất hủ của châu Âu. Trên những bàn tiệc náo nhiệt của lễ hội Oktoberfest hay trong các nhà hàng sang trọng, bộ đôi này luôn là sự lựa chọn số một. Tuy nhiên, để thưởng thức trọn vẹn hương vị nguyên bản, bạn cần chọn đúng dòng xúc xích được làm theo quy chuẩn khắt khe nhất của nước Đức.</p>
<p>Xúc xích Đức hiệu <strong>The Wurst</strong> tại hệ thống của chúng tôi tự hào mang đến trải nghiệm đẳng cấp đó. Đây là dòng xúc xích đặc biệt được <strong>sản xuất trực tiếp tại Việt Nam bởi chính tay các nghệ nhân người Đức (German master butchers)</strong>. Toàn bộ nguyên liệu từ <strong>thịt heo thịt bò hảo hạng cho đến các loại gia vị thảo mộc bí truyền đều được nhập khẩu trực tiếp từ Đức 100%</strong>. Việc chỉ thực hiện khâu sản xuất và đóng gói tại Việt Nam là giải pháp đột phá để mang lại sản phẩm tươi mát dạng chilled fresh mỗi ngày đến tay người tiêu dùng, tránh việc cấp đông đá sâu kéo dài hàng tháng trời làm khô xơ thịt như các loại xúc xích nhập khẩu nguyên gói thông thường.</p>

<h2>Top 3 Loại Xúc Xích Đức The Wurst Được Săn Đón Nhất</h2>

<h3>1. Thüringer Bratwurst — Xúc Xích Nướng Truyền Thống Vùng Thuringia</h3>
<p>Thüringer Bratwurst là niềm tự hào của vùng Thuringia miền Trung nước Đức với lịch sử hơn 600 năm. Xúc xích Bratwurst hiệu The Wurst được làm hoàn toàn từ thịt heo bò nhập khẩu Đức xay thô kết hợp cùng tỏi, kinh giới ô (marjoram) và hạt caraway đặc trưng. Dưới bàn tay trực tiếp của nghệ nhân Đức, mọi công đoạn nhồi và xông khói nhẹ đều đạt chuẩn nghiêm ngặt. Khi áp chảo hoặc nướng trên than hồng, lớp vỏ dai giòn bên ngoài sẽ xém nhẹ, ôm trọn phần nhân thịt mọng nước ngọt ngào bên trong. Đây là đồ nhắm bia đức hoàn hảo khi kết hợp cùng dòng bia lúa mì vàng <a href="/san-pham/benediktiner-weissbier-naturtrub-500ml" style="color:var(--web-gold-dark);font-weight:600;text-decoration:underline;">Benediktiner</a> Weissbier.</p>

<h3>2. Wiener Hun Khói — Hương Vị Xông Khói Gỗ Sồi Cổ Điển</h3>
<p>Wiener (hay còn gọi là xúc xích Frankfurt) nổi tiếng với kết cấu mịn màng và hương thơm gỗ sồi đặc trưng. Xúc xích Wiener của The Wurst sử dụng thịt heo bò nhập khẩu Đức xay mịn, nhồi trong lớp vỏ ruột tự nhiên và xông khói bằng gỗ sồi nhập khẩu. Mọi thứ từ máy móc, công thức pha trộn đến nhiệt độ xông khói đều tuân thủ 100% quy trình chuẩn Đức. Khi luộc sơ hoặc nướng nhẹ, Wiener tỏa ra mùi thơm khói ấm áp, vị ngọt đậm đà tự nhiên của thịt tươi. Dòng sản phẩm này cực kỳ phù hợp khi uống kèm bia đắng <a href="/san-pham/bitburger-premium-pils-330ml" style="color:var(--web-gold-dark);font-weight:600;text-decoration:underline;">Bitburger</a> Premium Pils.</p>

<h3>3. Combo Cold Cut — Trải Nghiệm Đa Dạng Đẳng Cấp</h3>
<p>Dành cho những buổi tiệc tiếp khách sang trọng tại Hà Nội hay TP.HCM, Combo Cold Cut của The Wurst là set thịt nguội và xúc xích cắt lát tiện dụng. Với sự kết hợp tinh tế giữa các loại jambon hun khói, salami và xúc xích tỏi chuẩn Đức, set Cold Cut mang đến sự đa dạng hương vị đầy cuốn hút trên bàn tiệc. Sản phẩm được bảo quản chilled lạnh mát giúp giữ trọn độ tươi mềm và dinh dưỡng tự nhiên.</p>

<h2>Cam Kết Chất Lượng Chuẩn Đức Từ The Wurst</h2>
<p>Mọi sản phẩm xúc xích The Wurst đều tuân thủ nguyên tắc "Sạch - Tươi - Chuẩn vị":</p>
<ul>
  <li><strong>100% Chuyên gia Đức sản xuất:</strong> Trực tiếp vận hành và giám sát chất lượng bởi nghệ nhân Đức.</li>
  <li><strong>100% Gia vị và thịt nhập khẩu Đức:</strong> Đảm bảo hương vị cay nồng đặc trưng của thảo mộc Alps và độ ngọt dai tự nhiên của thịt heo bò đạt chuẩn kiểm dịch châu Âu.</li>
  <li><strong>Sản xuất tươi tại Việt Nam:</strong> Chỉ đóng gói và sản xuất tại chỗ để cung cấp sản phẩm mát chilled fresh mỗi ngày, không chất bảo quản độc hại, không cấp đông đá làm suy giảm chất lượng dinh dưỡng.</li>
</ul>
<p>Hãy nâng tầm bữa tiệc bia Đức của bạn ngay hôm nay với những dòng xúc xích nghệ nhân đẳng cấp nhất từ The Wurst!</p>
`.trim();

// Nội dung cập nhật chi tiết cho Bài viết 2
const article2Content = `
<h2>Tìm Kiếm Địa Chỉ Mua Xúc Xích Đức Chính Hãng Uy Tín</h2>
<p>Xúc xích Đức luôn là món ăn khoái khẩu được săn đón trong các bữa tiệc gia đình hay liên hoan bạn bè. Tuy nhiên, trên thị trường hiện nay có rất nhiều loại xúc xích công nghiệp sử dụng nhiều chất phụ gia hoặc hàng đông lạnh lâu ngày làm mất đi hương vị nguyên bản. Để tìm được dòng xúc xích chuẩn Đức, chế biến từ thịt và gia vị nhập khẩu bởi chính người Đức làm, người tiêu dùng thông thái thường tìm đến các đại lý phân phối chính thức.</p>
<p>Showroom Bia Thầy Tu tại địa chỉ <strong>659A Lạc Long Quân, Tây Hồ, Hà Nội</strong> tự hào là đối tác phân phối chính hãng dòng xúc xích nghệ nhân cao cấp <strong>The Wurst</strong>. Đây là dòng sản phẩm duy nhất kết hợp trọn vẹn giữa nguồn nguyên liệu chuẩn Đức và quy trình chế biến tươi tại chỗ.</p>

<h2>Tại Sao Nên Chọn Xúc Xích Đức The Wurst?</h2>

<h3>1. Nguyên Liệu Nhập Khẩu 100% Từ Đức</h3>
<p>Để có được vị ngọt dai tự nhiên và kết cấu hoàn hảo, xúc xích The Wurst sử dụng nguồn thịt heo, thịt bò hảo hạng nhập khẩu trực tiếp từ Đức, kết hợp cùng các loại hạt gia vị thảo mộc bí truyền vùng Bavaria. Chúng tôi cam kết không sử dụng bột thịt pha tạp hay chất bảo quản hóa học độc hại. Mọi thứ cấu thành nên chiếc xúc xích đều chuẩn Đức 100%.</p>

<h3>2. Người Đức Trực Tiếp Sản Xuất</h3>
<p>Không chỉ dừng lại ở công nghệ, toàn bộ quy trình sản xuất xúc xích The Wurst được vận hành và giám sát trực tiếp bởi các <strong>nghệ nhân làm xúc xích người Đức (German master butchers)</strong>. Từ khâu xay thịt, phối trộn thảo mộc, nhồi ruột tự nhiên đến căn chỉnh nhiệt độ xông khói gỗ sồi, tất cả đều được thực hiện tỉ mỉ theo công thức gia truyền để đảm bảo hương vị nguyên bản chuẩn vị Đức.</p>

<h3>3. Ưu Thế Chilled Fresh Tươi Mát Mỗi Ngày</h3>
<p>Các loại xúc xích nhập khẩu nguyên gói từ châu Âu bắt buộc phải cấp đông đá sâu trong nhiều tháng vận chuyển, khiến tế bào thịt bị vỡ, khi rã đông sẽ bị khô xơ và mất đi vị ngọt tự nhiên. Nhận biết điều đó, The Wurst thực hiện khâu sản xuất và đóng gói ngay tại Việt Nam để cung cấp sản phẩm mát (chilled fresh) mỗi ngày. Xúc xích giữ nguyên độ mọng nước, giòn dai sần sật và độ tươi ngon tối đa.</p>

<h2>Dịch Vụ Giao Hàng Hoả Tốc 2 Giờ Nội Thành HN & HCM</h2>
<p>Showroom Bia Thầy Tu Lạc Long Quân cam kết bảo quản xúc xích trong hệ thống tủ mát chuyên dụng ở nhiệt độ lý tưởng từ 0 - 4°C. Khi khách hàng đặt mua online, chúng tôi cung cấp dịch vụ <strong>ship hoả tốc ngay lập tức trong vòng 2 giờ tại nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM)</strong> bằng túi giữ nhiệt chuyên dụng, đảm bảo sản phẩm luôn tươi mát khi giao tận tay quý khách.</p>
<p>Hãy liên hệ ngay Hotline/Zalo để đặt hàng và nhận báo giá sỉ đại lý tốt nhất cho các dòng xúc xích Bratwurst, Wiener và các combo bia xúc xích Đức thượng hạng!</p>
`.trim();

async function run() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    // Bắt đầu Transaction
    await client.query('BEGIN');

    // Cập nhật Bài viết 1
    const res1 = await client.query(
      "UPDATE seo_articles SET content = $1 WHERE slug = $2 RETURNING id",
      [article1Content, 'top-3-loai-xuc-xich-duc-nhap-khau-an-kem-bia']
    );
    if (res1.rows.length > 0) {
      console.log('Updated Article 1 (Top 3 types) content in DB.');
    } else {
      console.warn('Article 1 not found in DB.');
    }

    // Cập nhật Bài viết 2
    const res2 = await client.query(
      "UPDATE seo_articles SET content = $1 WHERE slug = $2 RETURNING id",
      [article2Content, 'mua-xuc-xich-duc-chinh-hang-o-dau-ha-noi-ship-hoa-toc']
    );
    if (res2.rows.length > 0) {
      console.log('Updated Article 2 (Where to buy) content in DB.');
    } else {
      console.warn('Article 2 not found in DB.');
    }

    await client.query('COMMIT');
    console.log('Successfully committed updates to database.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update sausage articles:', err);
  } finally {
    await client.end();
  }
}

run();
