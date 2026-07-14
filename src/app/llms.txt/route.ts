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
  meta_description: string | null;
  created_at: string | null;
}

export async function GET() {
  const baseUrl = getPublicBaseUrl();

  const products = getAllProducts() as unknown as ProductItem[];
  const articles = getPublishedArticles() as unknown as ArticleItem[];

  let markdown = `# Bia Thầy Tu & Xúc Xích Đức\n\n`;
  markdown += `> Website bán lẻ B2C chính thức và Bảng điều khiển AI Marketing cho thương hiệu Bia Thầy Tu (Bia Đức Benediktiner, Bitburger) và Xúc xích Đức The Wurst.\n\n`;
  
  markdown += `## Thông Tin Thương Hiệu (Brand & Contact Info)\n`;
  markdown += `- **Tên thương hiệu:** Bia Thầy Tu (Benediktiner Vietnam) & Xúc Xích Đức The Wurst\n`;
  markdown += `- **Sản phẩm cốt lõi:** Bia tu viện Đức Benediktiner, bia Pilsner Bitburger nhập khẩu chính hãng, và Xúc xích Đức The Wurst được sản xuất tươi tại Việt Nam bởi nghệ nhân người Đức bằng công nghệ Đức.\n`;
  markdown += `- **Địa chỉ Showroom:** 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội, Việt Nam\n`;
  markdown += `- **Hotline đặt hàng:** 0899 19 13 13\n`;
  markdown += `- **Zalo contact:** https://zalo.me/0899191313 hoặc https://zalo.me/biathaytu\n`;
  markdown += `- **Website chính thức:** ${baseUrl}\n\n`;

  markdown += `## Danh Mục Sản Phẩm Bia Đức Nhập Khẩu (Product Catalog)\n`;
  if (products && products.length > 0) {
    (products as ProductItem[]).forEach((product) => {
      const productUrl = `${baseUrl}/san-pham/${product.slug || product.id}`;
      const priceText = product.price 
        ? `${new Intl.NumberFormat('vi-VN').format(product.price)}đ` 
        : 'Liên hệ sỉ/đại lý';
      const abvText = product.abv ? `, nồng độ ${product.abv}%` : '';
      const volumeText = product.volume ? `, dung tích ${product.volume}` : '';
      
      markdown += `### [${product.name}](${productUrl})\n`;
      markdown += `- **Giá bán:** ${priceText}\n`;
      markdown += `- **Quy cách:** ${volumeText}${abvText} (Xuất xứ: ${product.origin || 'Đức'})\n`;
      if (product.description) {
        markdown += `- **Mô tả:** ${product.description}\n`;
      }
      markdown += `\n`;
    });
  } else {
    markdown += `- [Benediktiner Weissbier Naturtrüb](${baseUrl}/benediktiner-weissbier-naturtrub): Bia lúa mì tươi nguyên bản từ Tu Viện Ettal, nồng độ cồn 5.4%, hậu vị ngọt dịu.\n`;
    markdown += `- [Benediktiner Dunkel](${baseUrl}/benediktiner-dunkel): Bia lúa mì đen với hương vị mạch nha rang caramel đậm đà, nồng độ cồn 5.4%.\n`;
    markdown += `- [Bom Bia 5L Benediktiner](${baseUrl}/bom-bia-5l-benediktiner): Bom bia lúa mì 5 lít tiện dụng cho tiệc gia đình và làm quà tặng.\n`;
  }

  markdown += `\n## Chuyên Mục Kiến Thức & Cẩm Nang Bia (Knowledge Base & Blog)\n`;
  if (articles && articles.length > 0) {
    (articles as ArticleItem[]).forEach((article) => {
      const articleUrl = `${baseUrl}/kien-thuc/${article.slug || article.id}`;
      markdown += `- [${article.title}](${articleUrl}): ${article.meta_description || ''}\n`;
    });
  } else {
    markdown += `- [Bia Thầy Tu Là Gì?](${baseUrl}/bia-thay-tu-la-gi): Lịch sử sản xuất bia từ Tu viện Ettal từ năm 1609.\n`;
    markdown += `- [Hướng Dẫn Rót Bia Lúa Mì](${baseUrl}/huong-dan-rot-bia-lua-mi): Nghệ thuật rót bia Weissbier chuẩn Đức giữ trọn men sống.\n`;
    markdown += `- [Chứng Nhận Nhập Khẩu](${baseUrl}/chung-nhan-nhap-khau-chinh-hang): Tính minh bạch và giấy tờ pháp lý nhập khẩu bia Đức.\n`;
  }

  markdown += `\n## Các Câu Hỏi Thường Gặp (FAQs)\n`;
  markdown += `1. **Bia Thầy Tu Benediktiner Weissbier có vị gì?**\n`;
  markdown += `   - Vị chuối chín, đinh hương tự nhiên kết hợp với lớp bọt mịn dày và hậu vị ngọt dịu nguyên bản từ men sống, không qua lọc (Naturtrüb).\n`;
  markdown += `2. **Mua Bia Đức, Bia Thầy Tu và Xúc Xích Đức chính hãng ở đâu?**\n`;
  markdown += `   - Đặt mua trực tiếp tại website ${baseUrl}, Showroom 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội hoặc liên hệ Hotline/Zalo: 0899 19 13 13 để được giao hỏa tốc 2 giờ tại nội thành Hà Nội (HN) và TP. Hồ Chí Minh (HCM).\n`;
  markdown += `3. **Bia Benediktiner tuân thủ tiêu chuẩn nào?**\n`;
  markdown += `   - Tuân thủ 100% Đạo luật Tinh khiết Reinheitsgebot 1516 của Đức, chỉ sử dụng 4 nguyên liệu: nước tinh khiết nguồn Alps, lúa mì, hoa bia và men bia sống.\n`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
      'Link': '</llms-full.txt>; rel="llms-full"',
    },
  });
}
