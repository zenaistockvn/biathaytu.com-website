import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/data/products';
import { getPublicBaseUrl } from '@/lib/seo/site';

export const dynamic = 'force-dynamic';

interface ProductItem {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number | null;
  category: string | null;
  images: string[] | null;
}

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function getAbsoluteImageUrl(imagePath: string | undefined, baseUrl: string): string {
  if (!imagePath) return `${baseUrl}/logo.jpg`;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${baseUrl}/${imagePath.replace(/^\//, '')}`;
}

export async function GET() {
  const baseUrl = getPublicBaseUrl();
  const products = getProductsByCategory('bia') as unknown as ProductItem[];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>${escapeXml('Bia Thầy Tu - Bia Đức Nhập Khẩu Cao Cấp')}</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>${escapeXml('Website chính thức phân phối và bán lẻ B2C các dòng Bia Thầy Tu Benediktiner Weissbier & Bitburger tại Việt Nam.')}</description>\n`;

  if (products && products.length > 0) {
    (products as ProductItem[]).forEach((product) => {
      const productUrl = `${baseUrl}/san-pham/${product.slug || product.id}`;
      const imageUrl = getAbsoluteImageUrl(product.images?.[0], baseUrl);
      const title = product.name;
      const description = product.description || `${product.name} - dòng bia nhập khẩu chính hãng từ Đức.`;
      
      // Determine brand based on name
      let brand = 'Benediktiner';
      if (title.toLowerCase().includes('bitburger')) {
        brand = 'Bitburger';
      } else if (title.toLowerCase().includes('kostritzer')) {
        brand = 'Köstritzer';
      }

      // Check if price is available
      const priceVal = product.price ? `${product.price} VND` : '0 VND';
      const availability = product.price ? 'in_stock' : 'out_of_stock';

      xml += `    <item>\n`;
      xml += `      <g:id>${escapeXml(product.id)}</g:id>\n`;
      xml += `      <g:title>${escapeXml(title)}</g:title>\n`;
      xml += `      <g:description>${escapeXml(description)}</g:description>\n`;
      xml += `      <g:link>${escapeXml(productUrl)}</g:link>\n`;
      xml += `      <g:image_link>${escapeXml(imageUrl)}</g:image_link>\n`;
      xml += `      <g:condition>new</g:condition>\n`;
      xml += `      <g:availability>${availability}</g:availability>\n`;
      xml += `      <g:price>${priceVal}</g:price>\n`;
      xml += `      <g:brand>${escapeXml(brand)}</g:brand>\n`;
      xml += `      <g:google_product_category>Food, Beverages &amp; Tobacco &gt; Beverages &gt; Alcoholic Beverages &gt; Beer</g:google_product_category>\n`;
      xml += `    </item>\n`;
    });
  }

  xml += `  </channel>\n`;
  xml += `</rss>\n`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
