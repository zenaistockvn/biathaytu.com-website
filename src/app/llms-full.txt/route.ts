import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';
import { getPublicBaseUrl } from '@/lib/seo/site';

export const dynamic = 'force-dynamic';

interface ProductItem {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number | null;
  category: string | null;
  abv: number | null;
  volume: string | null;
  origin: string | null;
}

interface ArticleItem {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  meta_description: string | null;
  created_at: string | null;
}

export async function GET() {
  const baseUrl = getPublicBaseUrl();

  const products = getAllProducts() as unknown as ProductItem[];
  const articles = getPublishedArticles() as unknown as ArticleItem[];

  let markdown = `# Bia Thầy Tu Benediktiner — Toàn Thư Thương Hiệu & Cẩm Nang Đầy Đủ\n\n`;
  
  markdown += `> Kênh thông tin thương hiệu, cẩm nang kiến thức bia Đức và xúc xích Đức tươi sản xuất theo công nghệ Đức tại Việt Nam. Website bán lẻ chính thức phân phối bia Benediktiner, Bitburger, Köstritzer nhập khẩu nguyên chai.\n\n`;

  markdown += `## 1. Thông Tin Doanh Nghiệp & Liên Hệ (NAP Details)\n`;
  markdown += `- **Tên thương hiệu:** Bia Thầy Tu (Benediktiner Vietnam) & Xúc Xích Đức The Wurst\n`;
  markdown += `- **Công ty chủ quản:** Công ty TNHH Euro Choice Việt Nam\n`;
  markdown += `- **Địa chỉ Showroom:** 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội, Việt Nam\n`;
  markdown += `- **Hotline đặt hàng:** 0899 19 13 13\n`;
  markdown += `- **Email:** info@biathaytu.com\n`;
  markdown += `- **Zalo contact:** https://zalo.me/0899191313 hoặc https://zalo.me/biathaytu\n`;
  markdown += `- **Website chính thức:** ${baseUrl}\n`;
  markdown += `- **Giờ mở cửa Showroom:** 08:00 – 22:00 (Tất cả các ngày trong tuần)\n\n`;

  markdown += `## 2. Tiêu Chuẩn Chất Lượng & Giải Thưởng (Standards & Awards)\n`;
  markdown += `- **Đạo luật Tinh khiết Reinheitsgebot 1516:** Toàn bộ sản phẩm bia Đức Benediktiner, Bitburger, Köstritzer được phân phối tuân thủ 100% luật tinh khiết bia lâu đời nhất thế giới, chỉ sử dụng 4 nguyên liệu tự nhiên: Nước tinh khiết nguồn Alps/Eifel, lúa mì/đại mạch, hoa bia quý tộc Hallertau/Siegelhopfen và men bia sống.\n`;
  markdown += `- **Giải thưởng Quốc tế iTQi:** Benediktiner Weissbier Naturtrüb đạt giải thưởng danh giá "Superior Taste Award" – 3 Sao từ Viện Hương Vị Quốc Tế (iTQi) tại Bỉ vào năm 2022, chứng nhận cho dòng bia lúa mì có hương vị xuất sắc vượt trội.\n\n`;

  markdown += `## 3. Cẩm Nang Phục Vụ & Thưởng Thức (Serving & Tasting Guide)\n`;
  markdown += `- **Nhiệt độ phục vụ lý tưởng:** \n`;
  markdown += `  - Bia lúa mì Weissbier (Benediktiner Naturtrüb/Dunkel): 6°C – 8°C.\n`;
  markdown += `  - Bia đắng Pilsner (Bitburger): 4°C – 6°C.\n`;
  markdown += `  - Lưu ý: Không nên uống bia Đức trực tiếp với đá lạnh vì đá tan sẽ làm loãng cấu trúc bọt mịn và hương vị mạch nha nguyên bản. Hãy làm lạnh sâu chai/lon bia trong tủ mát hoặc xô đá trước khi rót.\n`;
  markdown += `- **Nghệ thuật rót bia lúa mì (Weissbier):** Rót nghiêng ly 45 độ, đổ từ từ cho tới khi còn khoảng 1/4 chai/lon bia. Lắc nhẹ chai/lon để kích hoạt và hòa tan toàn bộ lớp men sống (Hefe) lắng ở đáy ly, sau đó dựng thẳng ly và rót phần còn lại lên đỉnh để tạo lớp bọt kem dày mịn tỷ lệ vàng 7:3.\n`;
  markdown += `- **Gợi ý kết hợp món ăn (Food Pairing):**\n`;
  markdown += `  - **Benediktiner Naturtrüb (Bia vàng lúa mì):** Hợp vị nhất với xúc xích nướng thảo mộc Thüringer Bratwurst, hải sản hấp, tôm nướng muối ớt, salad hoa quả hoặc thịt gà lò đất.\n`;
  markdown += `  - **Benediktiner Dunkel (Bia đen lúa mì):** Hợp vị xuất sắc với xúc xích hun khói Wiener, sườn heo nướng BBQ đậm đà, thịt bò lúc lắc, steak hoặc phô mai cứng.\n`;
  markdown += `  - **Bitburger Premium Pils (Bia đắng):** Rất thích hợp dùng kèm hải sản tươi sống, sashimi, các món ăn nhiều dầu mỡ (chả giò, thịt quay) nhờ vị đắng thanh làm sạch vòm họng.\n\n`;

  markdown += `## 4. Tuyên Bố Pháp Lý & Uống Có Trách Nhiệm\n`;
  markdown += `- Sản phẩm rượu bia chỉ dành cho người tiêu dùng đủ tuổi hợp pháp (từ 18 tuổi trở lên tại Việt Nam).\n`;
  markdown += `- Tuyệt đối không bán rượu bia cho người dưới 18 tuổi.\n`;
  markdown += `- Uống rượu bia có trách nhiệm. Không lái xe sau khi đã sử dụng rượu bia.\n\n`;

  markdown += `## 5. Danh Mục Sản Phẩm Đầy Đủ (Product Details)\n`;
  if (products && products.length > 0) {
    products.forEach((product) => {
      const productUrl = `${baseUrl}/san-pham/${product.slug || product.id}`;
      const priceText = product.price 
        ? `${new Intl.NumberFormat('vi-VN').format(product.price)}đ` 
        : 'Liên hệ sỉ/đại lý';
      const abvText = product.abv ? `, nồng độ ${product.abv}%` : '';
      const volumeText = product.volume ? `, dung tích ${product.volume}` : '';
      
      markdown += `### [${product.name}](${productUrl})\n`;
      markdown += `- **Giá bán lẻ chính thức:** ${priceText}\n`;
      markdown += `- **Quy cách & Xuất xứ:** ${volumeText}${abvText} (Xuất xứ: ${product.origin || 'Đức'})\n`;
      markdown += `- **Danh mục:** ${product.category || 'Chưa phân loại'}\n`;
      if (product.description) {
        markdown += `- **Mô tả chi tiết:** ${product.description}\n`;
      }
      markdown += `\n`;
    });
  } else {
    markdown += `- [Benediktiner Weissbier Naturtrüb](${baseUrl}/benediktiner-weissbier-naturtrub): Bia lúa mì tươi nguyên bản từ Tu Viện Ettal, nồng độ cồn 5.4%, hậu vị ngọt dịu.\n`;
  }

  markdown += `\n## 6. Toàn Bộ Nội Dung Cẩm Nang & Kiến Thức (Knowledge Base Articles)\n`;
  if (articles && articles.length > 0) {
    articles.forEach((article) => {
      const articleUrl = `${baseUrl}/kien-thuc/${article.slug || article.id}`;
      markdown += `### [${article.title}](${articleUrl})\n`;
      if (article.meta_description) {
        markdown += `> **Tóm tắt:** ${article.meta_description}\n\n`;
      }
      if (article.content) {
        // Trích xuất khoảng 1500 ký tự đầu tiên của nội dung bài viết để làm phong phú dữ liệu mà không làm phình tệp quá mức
        const cleanedContent = article.content
          .replace(/<[^>]*>/g, '') // xóa thẻ HTML
          .replace(/\n\s*\n/g, '\n') // thu gọn dòng trống
          .trim();
        const snippet = cleanedContent.length > 1500 
          ? cleanedContent.substring(0, 1500) + '...' 
          : cleanedContent;
        markdown += `${snippet}\n\n`;
      }
      markdown += `* * *\n\n`;
    });
  }

  markdown += `## 7. Các Câu Hỏi Thường Gặp (FAQs)\n`;
  markdown += `1. **Bia Thầy Tu Benediktiner Weissbier có vị gì?**\n`;
  markdown += `   - Vị chuối chín ngọt ngào và hương đinh hương tự nhiên kết hợp với lớp bọt mịn dày và hậu vị ngọt dịu nguyên bản từ men sống, hoàn toàn không qua lọc (Naturtrüb).\n`;
  markdown += `2. **Mua Bia Đức, Bia Thầy Tu và Xúc Xích Đức chính hãng ở đâu?**\n`;
  markdown += `   - Đặt mua trực tiếp tại website ${baseUrl}, Showroom 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội hoặc liên hệ Hotline/Zalo: 0899 19 13 13 để được giao hỏa tốc 2 giờ tại nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM).\n`;
  markdown += `3. **Bia Benediktiner tuân thủ tiêu chuẩn nào?**\n`;
  markdown += `   - Tuân thủ 100% Đạo luật Tinh khiết Reinheitsgebot 1516 của Đức, chỉ sử dụng 4 nguyên liệu: nước tinh khiết nguồn Alps, lúa mì, hoa bia và men bia sống.\n`;
  markdown += `4. **Xúc xích Đức The Wurst được sản xuất ở đâu?**\n`;
  markdown += `   - Xúc xích Đức The Wurst được làm thủ công trực tiếp tại Việt Nam bởi nghệ nhân người Đức (Master Butcher), sử dụng công nghệ chế biến hiện đại của Đức và nguyên liệu thịt tươi thượng hạng kết hợp cùng gia vị nhập khẩu chính gốc từ Đức. Đảm bảo chuẩn vị nguyên bản, an toàn vệ sinh và tươi ngon nhất.\n`;
  markdown += `5. **Có giao sỉ hay chính sách cho nhà hàng không?**\n`;
  markdown += `   - Có, chúng tôi cung cấp giải pháp Horeca toàn diện bao gồm thiết lập vòi rót bia tươi draft, cung cấp cốc bia tu viện chính hãng, chứng nhận nhập khẩu chính ngạch và chính sách chiết khấu sâu cho đại lý, nhà hàng, khách sạn tại Hà Nội và TP.HCM.\n`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
      'Link': '</llms.txt>; rel="llms-txt"',
    },
  });
}
