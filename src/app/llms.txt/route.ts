import { NextResponse } from 'next/server';
import { getVisibleProducts } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';
import { BRAND } from '@/lib/brand';

export const dynamic = 'force-dynamic';

interface ProductItem {
  id: string;
  name: string;
  slug: string | null;
  shortDescription?: string;
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
  const baseUrl = BRAND.siteUrl;
  const products = getVisibleProducts() as unknown as ProductItem[];
  const articles = getPublishedArticles() as unknown as ArticleItem[];

  let markdown = `# Bia Thầy Tu Benediktiner\n\n`;
  markdown += `> Website giới thiệu thương hiệu: nguồn gốc Ettal, các dòng Benediktiner, hương vị, nghệ thuật thưởng thức và thông tin tư vấn tại Việt Nam. Website không bán hàng trực tuyến.\n\n`;

  markdown += `## Thông Tin Thương Hiệu (Brand & Contact Info)\n`;
  markdown += `- **Tên thương hiệu:** ${BRAND.consumerBrand}\n`;
  markdown += `- **Pháp nhân:** ${BRAND.legalName}\n`;
  markdown += `- **Vai trò tại Việt Nam:** ${BRAND.exclusivity}\n`;
  markdown += `- **Sản phẩm cốt lõi:** Benediktiner Weissbier Naturtrüb, Weissbier Dunkel và Festbier.\n`;
  markdown += `- **Thông tin nguồn gốc:** ${BRAND.historyFacts}\n`;
  markdown += `- **Điểm giới thiệu:** ${BRAND.showroomAddress}\n`;
  markdown += `- **Hotline tư vấn:** ${BRAND.hotline}\n`;
  markdown += `- **Email:** ${BRAND.email}\n`;
  markdown += `- **Zalo:** ${BRAND.socialLinks.zalo}\n`;
  markdown += `- **Website chính thức:** ${BRAND.siteUrl}\n`;
  markdown += `- **Lưu ý:** ${BRAND.legalDisclaimer}\n\n`;

  markdown += `## Danh Mục Sản Phẩm Tham Khảo (Product Guide)\n`;
  if (products.length > 0) {
    products.forEach((product) => {
      const productUrl = `${baseUrl}/san-pham/${product.slug || product.id}`;
      const abvText = product.abv ? `, nồng độ ${product.abv}%` : '';
      const volumeText = product.volume ? `, dung tích ${product.volume}` : '';

      markdown += `### [${product.name}](${productUrl})\n`;
      markdown += `- **Quy cách:** ${volumeText}${abvText} (Xuất xứ: ${product.origin || 'Đức'})\n`;
      if (product.shortDescription) markdown += `- **Mô tả:** ${product.shortDescription}\n`;
      markdown += `\n`;
    });
  }

  markdown += `\n## Chuyên Mục Kiến Thức & Cẩm Nang Bia (Knowledge Base & Blog)\n`;
  articles.forEach((article) => {
    const articleUrl = `${baseUrl}/kien-thuc/${article.slug || article.id}`;
    markdown += `- [${article.title}](${articleUrl}): ${article.meta_description || ''}\n`;
  });

  markdown += `\n## Các Câu Hỏi Thường Gặp (FAQs)\n`;
  markdown += `1. **Bia Thầy Tu Benediktiner Weissbier có vị gì?**\n`;
  markdown += `   - Vị chuối chín, đinh hương tự nhiên kết hợp lớp bọt mịn dày và hậu vị dịu của Weissbier Naturtrüb.\n`;
  markdown += `2. **Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?**\n`;
  markdown += `   - ${BRAND.historyFacts}\n`;
  markdown += `3. **Tìm hiểu sản phẩm tại đâu ở Hà Nội?**\n`;
  markdown += `   - Liên hệ trước hoặc ghé ${BRAND.showroomAddress}. Hotline tư vấn: ${BRAND.hotline}.\n`;

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
