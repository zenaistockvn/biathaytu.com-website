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
  markdown += `> Website giới thiệu thương hiệu: Nguồn gốc Ettal, các dòng Benediktiner, vị từng dòng, cách rót và thông tin tư vấn tại Việt Nam. Website không bán hàng trực tuyến.\n\n`;

  markdown += `## Thông tin thương hiệu (Brand & Contact Info)\n`;
  markdown += `- **Tên thương hiệu:** Bia Thầy Tu, Benediktiner tại Việt Nam\n`;
  markdown += `- **Sản phẩm chính:** Benediktiner Weissbier Naturtrüb, Weissbier Dunkel và Festbier.\n`;
  markdown += `- **Thông tin nguồn gốc:** Hơn 400 năm truyền thống bia lúa mì của dòng Biển Đức, gắn với Tu viện Ettal (lập năm 1330). Bia ủ tại Lich, bang Hessen, theo công thức gốc cho Benediktiner Weissbräu GmbH, Ettal; men lấy từ hầm tu viện Ettal.\n`;
  markdown += `- **Điểm giới thiệu:** ${COMPANY_CONFIG.showroomAddress}\n`;
  markdown += `- **Hotline tư vấn:** ${COMPANY_CONFIG.hotline}\n`;
  markdown += `- **Email:** ${COMPANY_CONFIG.email}\n`;
  markdown += `- **Zalo:** ${getCompanyZaloUrl() || 'Xem tại trang Liên hệ'}\n`;
  markdown += `- **Website chính thức:** ${baseUrl}\n\n`;

  markdown += `## Danh mục sản phẩm (Product Guide)\n`;
  if (products && products.length > 0) {
    (products as ProductItem[]).forEach((product) => {
      const productUrl = `${baseUrl}/san-pham/${product.slug || product.id}`;
      const specs = [product.volume ? `dung tích ${product.volume}` : null, product.abv ? `nồng độ ${product.abv}%` : null]
        .filter(Boolean)
        .join(', ');

      markdown += `### [${product.name}](${productUrl})\n`;
      markdown += `- **Quy cách:** ${specs ? `${specs} ` : ''}(Xuất xứ: ${product.origin || 'Đức'})\n`;
      if (product.description) {
        markdown += `- **Mô tả:** ${product.description}\n`;
      }
      markdown += `\n`;
    });
  } else {
    markdown += `- [Benediktiner Weissbier Naturtrüb](${baseUrl}/benediktiner-weissbier-naturtrub): Bia lúa mì không lọc, nồng độ cồn 5.4%, hương chuối chín và đinh hương.\n`;
    markdown += `- [Benediktiner Dunkel](${baseUrl}/benediktiner-dunkel): Bia lúa mì đen, nâu đồng, hương mạch nha rang và caramel, nồng độ cồn 5.4%.\n`;
    markdown += `- [Bom bia 5L Benediktiner](${baseUrl}/bom-bia-5l-benediktiner): Bom bia lúa mì 5 lít có vòi rót, dùng cho tiệc gia đình hoặc làm quà.\n`;
  }

  markdown += `\n## Bài kiến thức về bia (Knowledge Base)\n`;
  if (articles && articles.length > 0) {
    (articles as ArticleItem[]).forEach((article) => {
      const articleUrl = `${baseUrl}/kien-thuc/${article.slug || article.id}`;
      markdown += `- [${article.title}](${articleUrl}): ${article.meta_description || ''}\n`;
    });
  } else {
    markdown += `- [Bia Thầy Tu là gì?](${baseUrl}/bia-thay-tu-la-gi): Bia Thầy Tu là tên gọi ở Việt Nam của Benediktiner, bia lúa mì Đức gắn với Tu viện Ettal.\n`;
    markdown += `- [Hướng dẫn rót bia lúa mì](${baseUrl}/huong-dan-rot-bia-lua-mi): Cách rót bia Weissbier để có bọt dày và hòa lớp men dưới đáy chai.\n`;
    markdown += `- [Chứng nhận nhập khẩu](${baseUrl}/chung-nhan-nhap-khau-chinh-hang): Tính minh bạch và giấy tờ pháp lý nhập khẩu bia Đức.\n`;
  }

  markdown += `\n## Câu hỏi thường gặp (FAQs)\n`;
  markdown += `1. **Bia Thầy Tu Benediktiner Weissbier có vị gì?**\n`;
  markdown += `   - Hương chuối chín và đinh hương, thân mềm, bọt dày; bia không lọc nên đục tự nhiên (Naturtrüb). Uống ngon ở 7 - 9 °C.\n`;
  markdown += `2. **Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?**\n`;
  markdown += `   - Không. Bia ủ tại Lich, bang Hessen, theo công thức gốc của dòng Biển Đức cho Benediktiner Weissbräu GmbH, Ettal.\n`;
  markdown += `3. **Ở Hà Nội xem sản phẩm ở đâu?**\n`;
  markdown += `   - Tại ${COMPANY_CONFIG.showroomAddress}. Gọi trước qua hotline ${COMPANY_CONFIG.hotline}.\n`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
