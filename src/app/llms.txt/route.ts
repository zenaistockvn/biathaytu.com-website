import { NextResponse } from 'next/server';
import { getVisibleProducts } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';
import { getPublicBaseUrl } from '@/lib/seo/site';
import { COMPANY_CONFIG, getCompanyZaloUrl } from '@/config/company';

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

  const products = getVisibleProducts() as unknown as ProductItem[];
  const articles = getPublishedArticles() as unknown as ArticleItem[];

  let markdown = `# Bia Thầy Tu Benediktiner\n\n`;
  markdown += `> Website giới thiệu thương hiệu: nguồn gốc Ettal, các dòng Benediktiner, hương vị, nghệ thuật thưởng thức và thông tin tư vấn tại Việt Nam. Website không bán hàng trực tuyến.\n\n`;
  
  markdown += `## Thông Tin Thương Hiệu (Brand & Contact Info)\n`;
  markdown += `- **Tên thương hiệu:** Bia Thầy Tu, Benediktiner tại Việt Nam\n`;
  markdown += `- **Sản phẩm cốt lõi:** Benediktiner Weissbier Naturtrüb, Weissbier Dunkel và Festbier.\n`;
  markdown += `- **Thông tin nguồn gốc:** Truyền thống hơn 400 năm từ Tu viện Ettal; bia được nấu tại Lich theo công thức Benedictine nguyên bản cho Benediktiner Weissbräu GmbH, Ettal.\n`;
  markdown += `- **Điểm giới thiệu:** ${COMPANY_CONFIG.showroomAddress}\n`;
  markdown += `- **Hotline tư vấn:** ${COMPANY_CONFIG.hotline}\n`;
  markdown += `- **Email:** ${COMPANY_CONFIG.email}\n`;
  markdown += `- **Zalo:** ${getCompanyZaloUrl() || 'Xem tại trang Liên hệ'}\n`;
  markdown += `- **Website chính thức:** ${baseUrl}\n\n`;

  markdown += `## Danh Mục Sản Phẩm Tham Khảo (Product Guide)\n`;
  if (products && products.length > 0) {
    (products as ProductItem[]).forEach((product) => {
      const productUrl = `${baseUrl}/san-pham/${product.slug || product.id}`;
      const abvText = product.abv ? `, nồng độ ${product.abv}%` : '';
      const volumeText = product.volume ? `, dung tích ${product.volume}` : '';
      
      markdown += `### [${product.name}](${productUrl})\n`;
      markdown += `- **Quy cách:** ${volumeText}${abvText} (Xuất xứ: ${product.origin || 'Đức'})\n`;
      if (product.description) {
        markdown += `- **Mô tả:** ${product.description}\n`;
      }
      markdown += `\n`;
    });
  } else {
    markdown += `- [Benediktiner Weissbier Naturtrüb](${baseUrl}/benediktiner-weissbier-naturtrub): Bia lúa mì không lọc, nồng độ cồn 5.4%, hương chuối chín và đinh hương.\n`;
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
  markdown += `2. **Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?**\n`;
  markdown += `   - Không. Bia được nấu tại Lich, Đức theo công thức Benedictine nguyên bản cho Benediktiner Weissbräu GmbH, Ettal.\n`;
  markdown += `3. **Tìm hiểu sản phẩm tại đâu ở Hà Nội?**\n`;
  markdown += `   - Liên hệ trước hoặc ghé ${COMPANY_CONFIG.showroomAddress}. Hotline tư vấn: ${COMPANY_CONFIG.hotline}.\n`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
