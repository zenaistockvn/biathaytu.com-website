const fs = require('fs');
const path = require('path');

// 1. Target internal link mapping (copied from scripts/inject_internal_links.js)
const LINK_MAP = [
  { keyword: "Benediktiner Weissbier Dunkel", url: "/san-pham/benediktiner-dunkel-500ml" },
  { keyword: "Bitburger Premium Pils", url: "/san-pham/bitburger-premium-pils-330ml" },
  { keyword: "Köstritzer Schwarzbier", url: "/san-pham/kostritzer-schwarzbier-bom-5l" },
  { keyword: "Benediktiner Weissbier", url: "/san-pham/benediktiner-weissbier-naturtrub-500ml" },
  { keyword: "Benediktiner Naturtrüb", url: "/san-pham/benediktiner-weissbier-naturtrub-500ml" },
  { keyword: "Benediktiner Dunkel", url: "/san-pham/benediktiner-dunkel-500ml" },
  { keyword: "Weissbier Dunkel", url: "/san-pham/benediktiner-dunkel-500ml" },
  { keyword: "bom bia 5l", url: "/san-pham/bom-5l-benediktiner-weissbier" },
  { keyword: "Benediktiner", url: "/san-pham/benediktiner-weissbier-naturtrub-500ml" },
  { keyword: "Köstritzer", url: "/san-pham/kostritzer-schwarzbier-bom-5l" },
  { keyword: "Bitburger", url: "/san-pham/bitburger-premium-pils-330ml" },
  { keyword: "bom 5l", url: "/san-pham/bom-5l-benediktiner-weissbier" }
];

// Sort LINK_MAP by keyword length in descending order to guarantee longest-match first
LINK_MAP.sort((a, b) => b.keyword.length - a.keyword.length);

// Helper to determine if a character is alphanumeric (including Vietnamese accented characters)
function isAlphanumeric(char) {
  if (!char) return false;
  return /[a-zA-Z0-9À-ỹĐđ]/.test(char);
}

// Injects internal links using a Single-pass Longest-Match-First algorithm on text nodes
function injectLinks(content) {
  let tokens = content.split(/(<[^>]+>)/g);
  let changed = false;
  let linkCount = 0;
  
  // Track which keywords have been linked in the current article
  let linkedKeywords = new Set();
  let insideLink = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // If it's an HTML tag, trace if we enter or exit an anchor tag, then skip it
    if (token.startsWith('<')) {
      if (/^<a\b/i.test(token)) {
        insideLink = true;
      } else if (/^<\/a>/i.test(token)) {
        insideLink = false;
      }
      continue;
    }

    // If we are already inside a link, do not wrap anything.
    if (insideLink) {
      for (const item of LINK_MAP) {
        const kw = item.keyword;
        const kwLen = kw.length;
        let idx = 0;
        const lowerToken = token.toLowerCase();
        const lowerKw = kw.toLowerCase();
        
        while ((idx = lowerToken.indexOf(lowerKw, idx)) !== -1) {
          const preceding = token[idx - 1];
          const succeeding = token[idx + kwLen];
          if (!isAlphanumeric(preceding) && !isAlphanumeric(succeeding)) {
            linkedKeywords.add(kw);
          }
          idx += kwLen;
        }
      }
      continue;
    }

    let newToken = "";
    let index = 0;

    // Single-pass scanning of the text node
    while (index < token.length) {
      let matched = false;

      // Check each keyword starting with the longest one
      for (const item of LINK_MAP) {
        const kw = item.keyword;
        const url = item.url;
        const kwLen = kw.length;

        // Check if keyword matches at the current pointer (case-insensitive)
        if (token.substr(index, kwLen).toLowerCase() === kw.toLowerCase()) {
          // Check word boundaries
          const preceding = token[index - 1];
          const succeeding = token[index + kwLen];

          if (!isAlphanumeric(preceding) && !isAlphanumeric(succeeding)) {
            matched = true;

            // Only link if this keyword hasn't been linked yet in this article
            if (!linkedKeywords.has(kw)) {
              const linkTag = `<a href="${url}" style="color:var(--web-gold-dark);font-weight:600;text-decoration:underline;">`;
              const closeTag = `</a>`;
              const matchText = token.substr(index, kwLen);

              newToken += linkTag + matchText + closeTag;
              linkedKeywords.add(kw);
              linkCount++;
              changed = true;
            } else {
              // If already linked, keep original text but still jump past it to avoid matching sub-keywords
              newToken += token.substr(index, kwLen);
            }

            index += kwLen;
            break; // Break the LINK_MAP loop to scan from the new index
          }
        }
      }

      // If no keyword matched at this position, move pointer by 1 character
      if (!matched) {
        newToken += token[index];
        index++;
      }
    }

    tokens[i] = newToken;
  }

  return { content: tokens.join(''), changed, linkCount };
}

// Calculate word count from content HTML
function getWordCount(html) {
  const cleanText = html.replace(/<[^>]*>/g, ' ');
  const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// New articles to be injected
const newArticles = [
  {
    id: "phan-biet-bia-thay-tu-trappist-va-bia-tu-vien",
    product_id: null,
    title: "Phân Biệt Bia Thầy Tu Trappist Và Bia Tu Viện Abbey Beer",
    slug: "phan-biet-bia-thay-tu-trappist-va-bia-tu-vien",
    meta_description: "Phân biệt chi tiết giữa dòng bia thầy tu Trappist chính tông và bia tu viện Abbey beer. Hướng dẫn cách chọn dòng bia chuẩn gu cho bàn tiệc cuối tuần của bạn.",
    keywords: ["bia thầy tu", "bia trappist", "bia tu vien", "mua bia thầy tu hà nội", "địa chỉ mua bia đức"],
    rawContent: `<p>Đối với những tín đồ đam mê bia thầy tu, việc phân biệt giữa bia Trappist chính tông và bia tu viện Abbey beer không chỉ là câu chuyện phân loại kỹ thuật, mà còn thể hiện gu thưởng thức tinh tế. Dù cả hai dòng bia này đều gắn liền với lịch sử tu viện lâu đời và sở hữu hương vị đậm đà cuốn hút, chúng lại có những tiêu chuẩn sản xuất và tính pháp lý rất khác nhau.</p>
<div style="margin: 24px 0;">
  <img src="/images/articles/phan-biet-bia-thay-tu.png" alt="Phân biệt bia thầy tu Trappist và bia tu viện Abbey beer" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<h2>Bia Thầy Tu Trappist - Chứng nhận ATP và tính độc bản tối cao</h2>
<p>Bia Trappist (Bia Thầy Tu) là danh xưng được bảo hộ pháp lý nghiêm ngặt bởi Hiệp hội Trappist Quốc tế (ITA). Để được dán nhãn logo "Authentic Trappist Product" (ATP), một chai bia thầy tu phải đáp ứng đầy đủ ba tiêu chí cốt lõi:</p>
<ul>
  <li>Thứ nhất, bia phải được nấu trực tiếp bên trong bức tường của một tu viện Trappist dòng Xitô Cải cách.</li>
  <li>Thứ hai, quy trình nấu bia phải do chính các tu sĩ (đan sĩ) thực hiện hoặc giám sát trực tiếp.</li>
  <li>Thứ ba, nhà máy bia không được vận hành vì mục đích thương mại phi lợi nhuận cá nhân. Mọi doanh thu sau khi trang trải chi phí vận hành và bảo dưỡng tu viện đều được dùng để làm từ thiện hoặc hỗ trợ cộng đồng.</li>
</ul>
<p>Hiện nay trên toàn thế giới chỉ có khoảng hơn 10 tu viện được cấp quyền sử dụng nhãn ATP, tiêu biểu như <strong>Chimay</strong>, <strong>Rochefort</strong>, Orval, Westmalle (vương quốc Bỉ) hay <strong>La Trappe</strong> (Hà Lan). Mỗi ngụm bia thầy tu Trappist chính tông mang lại hương vị sâu lắng của men sống tự nhiên, với độ phức hợp hương thơm từ trái cây khô, caramel và đinh hương.</p>

<h3>Bia Tu Viện Abbey Beer - Phong cách truyền thống đầy phóng khoáng</h3>
<p>Ngược lại với sự khắt khe của Trappist, bia tu viện (Abbey beer hay Bière d'Abbaye, thường được viết không dấu là bia tu vien) là dòng bia được nấu theo phong cách, công thức truyền thống của các tu viện xưa, nhưng quy trình sản xuất đã được thương mại hóa hoặc nhượng quyền cho các nhà máy bia hiện đại bên ngoài. Dòng bia này không bắt buộc phải nấu bởi đan sĩ hay nằm trong khuôn viên tu viện.</p>
<p>Một ví dụ điển hình của dòng bia tu viện nổi tiếng là Benediktiner. Được nấu theo công thức cổ truyền của tu viện Ettal vùng Bavaria nước Đức, Benediktiner mang đến trải nghiệm bia lúa mì (Weissbier) vô cùng mượt mà, đục mờ tự nhiên với men sống sống động. Sự thành công của Benediktiner chính là minh chứng cho việc kết hợp hoàn hảo giữa công thức tu viện truyền thống và công nghệ sản xuất hiện đại.</p>

<h2>So sánh chi tiết bia thầy tu Trappist và bia tu viện Abbey beer</h2>
<p>Để giúp bạn dễ dàng chọn lựa dòng bia chuẩn gu cho bàn tiệc cuối tuần, hãy cùng phân tích các khía cạnh khác nhau của hai dòng bia cao cấp này:</p>
<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; border-color: var(--web-border); margin: 20px 0;">
  <thead>
    <tr style="background-color: var(--web-navy); color: white;">
      <th>Tiêu chí</th>
      <th>Bia Thầy Tu Trappist (Chimay, La Trappe)</th>
      <th>Bia Tu Viện Abbey Beer (Benediktiner)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Địa điểm nấu</strong></td>
      <td>Bắt buộc bên trong tu viện Trappist dòng Xitô</td>
      <td>Tại nhà máy bia thương mại hoặc tu viện bất kỳ</td>
    </tr>
    <tr>
      <td><strong>Người sản xuất</strong></td>
      <td>Do tu sĩ đan sĩ thực hiện hoặc giám sát trực tiếp</td>
      <td>Các nghệ nhân nấu bia thương mại chuyên nghiệp</td>
    </tr>
    <tr>
      <td><strong>Chứng nhận pháp lý</strong></td>
      <td>Logo ATP (Authentic Trappist Product) độc quyền</td>
      <td>Logo Bia Tu Viện được chứng nhận hoặc nhượng quyền</td>
    </tr>
    <tr>
      <td><strong>Mục đích lợi nhuận</strong></td>
      <td>Không vì lợi nhuận, doanh thu làm từ thiện xã hội</td>
      <td>Thương mại hóa nhằm tối đa hóa quy mô thị trường</td>
    </tr>
    <tr>
      <td><strong>Đại diện nổi tiếng</strong></td>
      <td>Chimay, La Trappe, Rochefort, Westvleteren</td>
      <td>Benediktiner, Leffe, Grimbergen, Maredsous</td>
    </tr>
  </tbody>
</table>

<h3>Đặc trưng hương vị của từng dòng bia</h3>
<p>Bia thầy tu Trappist thường có nồng độ cồn từ trung bình đến rất cao (từ 7% đến 12% ABV). Men bia đặc trưng của dòng Trappist tạo nên hương thơm phức hợp của các loại quả sẫm màu như mận, nho khô kết hợp cùng vị ngọt ấm áp của mạch nha caramel. Những chai Chimay Xanh hay La Trappe Quadrupel luôn mang lại hậu vị sâu, đậm đà và kéo dài.</p>
<p>Trong khi đó, các dòng bia tu viện Abbey beer như Benediktiner Weissbier lại nổi bật với sự êm dịu, dễ uống. Với nồng độ cồn vừa phải (thường từ 5% đến 5.4% ABV), bia lúa mì tu viện mang hương chuối chín đặc trưng, hương đinh hương phảng phất và hậu vị ngọt dịu nhẹ nhàng, cực kỳ thích hợp cho các buổi gặp gỡ thân mật.</p>

<h2>Địa chỉ mua bia đức và bia thầy tu nhập khẩu chính hãng tại Hà Nội</h2>
<p>Nếu quý khách đang muốn tìm địa chỉ mua bia đức uy tín hoặc mua bia thầy tu hà nội chính hãng để thưởng thức đúng hương vị chuẩn tông của bia thầy tu Trappist hay bia tu viện Abbey beer, quý khách hàng cần lựa chọn những đại lý nhập khẩu uy tín. Tại Hà Nội, Showroom Bia Thầy Tu tọa lạc tại địa chỉ 659A Lạc Long Quân, Tây Hồ, Hà Nội là điểm đến hàng đầu được giới sành bia tin tưởng.</p>
<p>Chúng tôi tự hào là đại lý phân phối chính thức các dòng bia nhập khẩu cao cấp từ Đức và Bỉ, cam kết bảo quản sản phẩm ở nhiệt độ chuẩn để giữ nguyên men sống chất lượng cao. Quý khách hàng tại khu vực Hà Nội hoặc TP.HCM (Sài Gòn) có thể liên hệ trực tiếp qua số điện thoại Hotline để được tư vấn giao hàng tận nơi nhanh chóng.</p>
<p><strong>Thông tin liên hệ mua hàng:</strong></p>
<ul>
  <li><strong>Địa chỉ showroom:</strong> 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội.</li>
  <li><strong>Hotline / Zalo tư vấn:</strong> 0899.191.313</li>
  <li><strong>Khu vực hỗ trợ giao hàng nhanh:</strong> Nội thành Hà Nội và đối tác vận chuyển tại TP.HCM (Sài Gòn).</li>
</ul>
<p>Hãy liên hệ với chúng tôi ngay hôm nay để nhận báo giá sỉ tốt nhất cho các dòng bia nhập khẩu cao cấp. Thưởng thức có trách nhiệm và chúc quý khách tìm được dòng bia ưng ý!</p>`,
    micro_content_count: 0,
    status: "published",
    tenant_id: "biathaytu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumbnail_url: "/images/articles/phan-biet-bia-thay-tu.png"
  },
  {
    id: "mua-bia-thay-tu-chimay-la-trappe-o-dau-chinh-hang-ha-noi",
    product_id: null,
    title: "Mua Bia Thầy Tu Chimay, La Trappe Ở Đâu Chính Hãng Hà Nội?",
    slug: "mua-bia-thay-tu-chimay-la-trappe-o-dau-chinh-hang-ha-noi",
    meta_description: "Tìm kiếm địa chỉ mua dòng bia thầy tu Chimay, La Trappe nhập khẩu chính hãng tại Hà Nội. Đại lý bia nhập khẩu Tây Hồ cam kết uy tín và dịch vụ ship nhanh 2 giờ.",
    keywords: ["mua bia thầy tu", "bia chimay chính hãng", "bia la trappe hà nội", "đại lý bia nhập khẩu tây hồ"],
    rawContent: `<p>Bia thầy tu Trappist luôn nằm trong danh sách những thức uống đẳng cấp nhất thế giới nhờ quy trình nấu thủ công nghiêm ngặt từ các đan viện dòng Xitô. Trong số các thương hiệu nổi tiếng, Chimay (Bỉ) và La Trappe (Hà Lan) là hai cái tên quen thuộc nhất đối với người yêu bia. Nhưng câu hỏi đặt ra là: Bạn có thể tìm thấy đại lý phân phối chính thức để mua bia thầy tu uy tín, chất lượng ở đâu tại thủ đô?</p>
<div style="margin: 24px 0;">
  <img src="/images/articles/mua-bia-thay-tu-chimay.png" alt="Mua bia thầy tu Chimay và La Trappe chính hãng tại Hà Nội" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<h2>Sức hút khó cưỡng của bia thầy tu Chimay và La Trappe</h2>
<p>Chimay là biểu tượng bất diệt của bia thầy tu Bỉ. Được nấu lần đầu tiên vào năm 1862 tại đan viện Scourmont, dòng bia này chinh phục thực khách bằng hương vị mạnh mẽ, đậm đà. Chimay Đỏ sở hữu hương trái cây nhẹ dịu, Chimay Trắng (Triple) mang vị đắng thanh thoát của hoa bia tươi, còn dòng bia chimay chính hãng cao cấp nhất - Chimay Xanh (Grande Réserve) quyến rũ người uống bằng hương thơm caramel, socola và quả chín sẫm màu.</p>
<p>Bên cạnh Chimay, La Trappe là thương hiệu bia thầy tu Hà Lan duy nhất đạt chứng nhận ATP, nổi tiếng với sự tinh khiết và êm ái. Dòng bia này được sản xuất tại đan viện Koningshoeven từ năm 1884. Từ chai La Trappe Blond tươi mát cho đến chai La Trappe Quadrupel nồng ấm đậm hương gỗ sồi và trái cây khô, dòng bia này luôn mang đến một sự cân bằng tuyệt hảo. Đây là lý do vì sao nhu cầu tìm mua bia la trappe hà nội chính ngạch không ngừng tăng cao trong những năm gần đây.</p>

<h3>Tại sao nên mua bia thầy tu tại đại lý phân phối chính thức?</h3>
<p>Vì bia thầy tu Trappist là dòng bia lên men hai lần (lên men trong chai nhờ men sống), chất lượng hương vị phụ thuộc rất lớn vào khâu bảo quản và vận chuyển. Nếu bia bị để ở nhiệt độ cao hoặc tiếp xúc trực tiếp với ánh nắng mặt trời, men sống bên trong sẽ bị biến chất, làm mất đi vị ngon nguyên bản.</p>
<p>Để đảm bảo thưởng thức trọn vẹn hương vị hoàng gia Đức hay Bỉ, quý khách chỉ nên chọn các đại lý lớn có hệ thống kho lạnh chuyên dụng. Việc lựa chọn một đại lý bia nhập khẩu tây hồ uy tín sẽ giúp quý khách hoàn toàn an tâm về nguồn gốc xuất xứ, hóa đơn VAT đầy đủ và quy trình bảo quản tiêu chuẩn quốc tế.</p>

<h2>Địa chỉ mua bia thầy tu Chimay, La Trappe chính hãng tại Hà Nội</h2>
<p>Nếu bạn đang băn khoăn tìm kiếm một showroom phân phối chính ngạch các dòng bia nhập khẩu cao cấp, hãy đến ngay Showroom Bia Thầy Tu tại địa chỉ: 659A Lạc Long Quân, Tây Hồ, Hà Nội.</p>
<p>Chúng tôi tự hào là đơn vị phân phối lâu năm, cung cấp đầy đủ các phiên bản bia Chimay, La Trappe, Rochefort và nhiều dòng bia Đức danh tiếng như Benediktiner hay Bitburger. Chúng tôi cam kết 100% sản phẩm chính hãng, hỗ trợ giao hàng nhanh tận nơi trên toàn quốc, bao gồm Hà Nội và khu vực TP.HCM (Sài Gòn).</p>

<h3>Dịch vụ ship nhanh 2 giờ và hỗ trợ khách hàng chu đáo</h3>
<p>Nhằm đem lại sự thuận tiện tối đa cho quý khách hàng tổ chức tiệc tại nhà, showroom của chúng tôi cung cấp dịch vụ giao hàng hỏa tốc trong vòng 2 giờ cho các đơn hàng nội thành Hà Nội. Chúng tôi có đội ngũ nhân viên nhiệt tình hỗ trợ tư vấn chọn bia phù hợp với món ăn và khẩu vị của thực khách.</p>
<p><strong>Thông tin liên hệ nhanh:</strong></p>
<ul>
  <li><strong>Địa chỉ Showroom cửa hàng:</strong> 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội.</li>
  <li><strong>Hotline đặt hàng hỏa tốc:</strong> <a href="tel:0899191313">0899.191.313</a></li>
  <li><strong>Hỗ trợ Zalo:</strong> Nhắn tin ngay qua <a href="https://zalo.me/0899191313" target="_blank" rel="noopener noreferrer">Liên hệ Zalo Bia Thầy Tu</a> để nhận báo giá sỉ tốt nhất.</li>
  <li><strong>Số điện thoại hỗ trợ khiếu nại & phản hồi dịch vụ:</strong> 0899.191.313</li>
  <li><strong>Khu vực giao hàng:</strong> Phục vụ nhanh tại Hà Nội và hỗ trợ ship đi các tỉnh thành, đặc biệt là TP.HCM (Sài Gòn).</li>
</ul>
<p>Hãy liên hệ với chúng tôi ngay hôm nay để trải nghiệm dòng bia thầy tu Trappist đẳng cấp nhất. Thưởng thức có trách nhiệm và chúc quý khách có những phút giây trọn vẹn bên người thân yêu!</p>`,
    micro_content_count: 0,
    status: "published",
    tenant_id: "biathaytu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    thumbnail_url: "/images/articles/mua-bia-thay-tu-chimay.png"
  }
];

// Main Execution
const articlesFilePath = path.join(__dirname, '../src/data/articles.json');
let articles = [];

try {
  articles = JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
  console.log(`Loaded ${articles.length} articles from ${articlesFilePath}`);
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

  // 1. Run internal links injection
  console.log(`Injecting internal links for: "${newArticle.title}"`);
  const { content: finalContent, changed, linkCount } = injectLinks(newArticle.rawContent);
  console.log(`  Linked keywords count: ${linkCount} (changed: ${changed})`);

  // 2. Build final article object
  const articleToInject = {
    id: newArticle.id,
    product_id: newArticle.product_id,
    title: newArticle.title,
    slug: newArticle.slug,
    content: finalContent,
    meta_description: newArticle.meta_description,
    keywords: newArticle.keywords,
    word_count: getWordCount(finalContent),
    micro_content_count: newArticle.micro_content_count,
    status: newArticle.status,
    tenant_id: newArticle.tenant_id,
    created_at: newArticle.created_at,
    updated_at: newArticle.updated_at,
    thumbnail_url: newArticle.thumbnail_url
  };

  console.log(`  Word count: ${articleToInject.word_count}`);

  // 3. Add to beginning of articles database
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
