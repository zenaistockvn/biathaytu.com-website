/**
 * JSON-LD Structured Data for SEO, AEO, and AI Overview optimization.
 * Helps search engines and AI assistants understand the business and products.
 */

import { getPublicBaseUrl, toAbsoluteSiteUrl } from '@/lib/seo/site';
import { BUSINESS, getBrandInfo } from '@/lib/seo/business';
import { COMPANY_CONFIG, isPendingCompanyValue } from '@/config/company';

const BASE_URL = getPublicBaseUrl();
const hasConfirmedLegalName = !isPendingCompanyValue(COMPANY_CONFIG.legalName);
const hasConfirmedShowroomAddress = !isPendingCompanyValue(COMPANY_CONFIG.showroomAddress);
const hasConfirmedHotline = !isPendingCompanyValue(COMPANY_CONFIG.hotline) && Boolean(BUSINESS.phoneE164);

interface JsonLdProps {
  type: 'organization' | 'product' | 'faq' | 'breadcrumb' | 'website' | 'article' | 'store';
  data: Record<string, unknown>;
}

export default function JsonLd({ type: _type, data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ═══ Pre-built Schema Generators ═══ */

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Bia Thầy Tu',
    ...(hasConfirmedLegalName ? { legalName: COMPANY_CONFIG.legalName } : {}),
    alternateName: ['Bia Thầy Tu', 'Benediktiner Vietnam'],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Đơn vị giới thiệu và phân phối Bia Thầy Tu Benediktiner tại Việt Nam. Thông tin về bia Đức nhập khẩu chính hãng, nguồn gốc, hương vị và tư vấn sản phẩm.',
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    ...(hasConfirmedShowroomAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_CONFIG.showroomAddress,
            addressCountry: BUSINESS.addressCountry,
          },
        }
      : {}),
    ...(hasConfirmedHotline
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: BUSINESS.phoneE164,
            contactType: 'customer service',
            availableLanguage: ['Vietnamese', 'English'],
            areaServed: 'VN',
          },
        }
      : {}),
    ...(BUSINESS.zaloUrl ? { sameAs: [BUSINESS.zaloUrl] } : {}),
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Bia Thầy Tu — Bia Đức Nhập Khẩu Benediktiner',
    description: 'Website giới thiệu Bia Thầy Tu Benediktiner — bia Đức nhập khẩu chính hãng từ Tu Viện Ettal, cùng thông tin sản phẩm, văn hóa bia và tư vấn.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'vi-VN',
  };
}

export function getStoreSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${BASE_URL}/#store`,
    name: BUSINESS.name,
    ...(hasConfirmedLegalName ? { legalName: BUSINESS.legalName } : {}),
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Điểm giới thiệu và tư vấn các dòng bia Đức nhập khẩu, nổi bật với Benediktiner và Bia Thầy Tu tại Việt Nam.',
    ...(hasConfirmedHotline ? { telephone: BUSINESS.phoneE164 } : {}),
    ...(hasConfirmedShowroomAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_CONFIG.showroomAddress,
            addressCountry: BUSINESS.addressCountry,
          },
        }
      : {}),
    ...(BUSINESS.zaloUrl ? { sameAs: [BUSINESS.zaloUrl] } : {}),
  };
}

export function getProductSchema(product: {
  id?: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
  price?: number;
  priceFrom?: number;
  priceTo?: number;
  offerCount?: number;
  images?: string[];
  abv?: string;
  volume?: string;
  category?: string | null;
  inStock?: boolean;
}) {
  const productUrl = product.url || `${BASE_URL}/san-pham/${product.slug}`;
  const info = getBrandInfo(product.name, product.category);

  let offers: Record<string, unknown> | undefined;
  if (typeof product.price === 'number') {
    offers = {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}/#store` },
    };
  } else if (typeof product.priceFrom === 'number') {
    offers = {
      '@type': 'AggregateOffer',
      url: productUrl,
      priceCurrency: 'VND',
      lowPrice: product.priceFrom,
      ...(typeof product.priceTo === 'number' ? { highPrice: product.priceTo } : {}),
      ...(typeof product.offerCount === 'number' ? { offerCount: product.offerCount } : {}),
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: { '@id': `${BASE_URL}/#store` },
    };
  }

  const isBelgium = product.name.toLowerCase().includes('bỉ') ||
                    product.name.toLowerCase().includes('chimay') ||
                    product.name.toLowerCase().includes('rochefort');

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    image: toAbsoluteSiteUrl(product.images?.[0] || '/logo.jpg', BASE_URL),
    description: product.description || `${product.name} — nhập khẩu chính hãng.`,
    sku: product.id || product.slug,
    mpn: product.id || product.slug,
    brand: { '@type': 'Brand', name: info.brand },
    ...(info.manufacturer
      ? {
          manufacturer: {
            '@type': 'Organization',
            name: info.manufacturer,
            address: { '@type': 'PostalAddress', addressCountry: info.manufacturerCountry, addressRegion: 'Bavaria' },
          },
        }
      : {}),
    countryOfOrigin: { '@type': 'Country', name: isBelgium ? 'Belgium' : 'Germany' },
    ...(offers ? { offers } : {}),
    additionalProperty: [
      ...(product.abv ? [{ '@type': 'PropertyValue', name: 'Alcohol by Volume', value: `${product.abv}%` }] : []),
      ...(product.volume ? [{ '@type': 'PropertyValue', name: 'Volume', value: product.volume }] : []),
      { '@type': 'PropertyValue', name: 'Origin', value: isBelgium ? 'Belgium' : 'Germany' },
      ...(info.isBeer
        ? [{ '@type': 'PropertyValue', name: 'Brewing Standard', value: 'Reinheitsgebot 1516 (German Purity Law)' }]
        : []),
    ],
    ...(info.isAwardWinner ? { award: 'iTQi Superior Taste Award 3 Stars 2022' } : {}),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function getLandingFAQSchema() {
  const faqs = [
    {
      question: 'Bia Thầy Tu là bia gì?',
      answer: 'Bia Thầy Tu (Benediktiner Weissbier) là dòng bia lúa mì truyền thống của Đức, được ủ theo phương pháp tu viện từ năm 1609 tại Tu Viện Ettal, Bavaria. Bia được sản xuất theo Luật Tinh Khiết 1516 (Reinheitsgebot), chỉ sử dụng 4 nguyên liệu: nước, malt lúa mì, hoa bia và men bia.',
    },
    {
      question: 'Bia Benediktiner Weissbier có vị gì?',
      answer: 'Benediktiner Weissbier Naturtrüb có hương vị đặc trưng gồm trái chuối chín, đinh hương, với lớp bọt trắng mịn dày và hậu vị ngọt dịu. Bia có màu vàng hổ phách tự nhiên, không lọc (Naturtrüb), giữ trọn men sống và hương vị tự nhiên.',
    },
    {
      question: 'Tìm thông tin và tư vấn về bia Đức Benediktiner chính hãng ở đâu tại Việt Nam?',
      answer: 'Bia Thầy Tu giới thiệu thông tin về Benediktiner nhập khẩu tại Việt Nam. Vui lòng xem trang Liên hệ hoặc sử dụng hotline, email và các kênh tư vấn được công bố trên website để được hỗ trợ về sản phẩm và báo giá tham khảo.',
    },
    {
      question: 'Bia Benediktiner có giải thưởng gì?',
      answer: 'Năm 2022, Benediktiner Weissbier Naturtrüb đã được Viện Hương Vị Quốc Tế (iTQi) trao giải "Superior Taste Award" — 3 Sao, mức cao nhất dành cho sản phẩm có hương vị vượt trội trên toàn thế giới.',
    },
    {
      question: 'Luật Tinh Khiết 1516 (Reinheitsgebot) là gì?',
      answer: 'Reinheitsgebot là luật tinh khiết bia của Đức ban hành năm 1516 bởi Công tước Wilhelm IV của Bavaria. Luật quy định bia chỉ được sản xuất từ 4 nguyên liệu: nước, malt đại mạch (sau bổ sung lúa mì), hoa bia và men. Đây là luật an toàn thực phẩm lâu đời nhất thế giới. Benediktiner tuân thủ 100% luật này.',
    },
    {
      question: 'Bia Thầy Tu có bao nhiêu dòng sản phẩm?',
      answer: 'Bia Thầy Tu hiện giới thiệu các dòng Benediktiner Weissbier Naturtrüb, Benediktiner Dunkel, Bom 5L Benediktiner và các combo sản phẩm. Thông tin quy cách và mô tả chi tiết được cập nhật tại danh mục sản phẩm.',
    },
  ];

  return getFaqSchema(faqs);
}

export function getArticleSchema(article: {
  title: string;
  slug: string;
  url?: string;
  description: string;
  imageUrl?: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  const articleUrl = article.url || `${BASE_URL}/kien-thuc/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.title,
    description: article.description,
    image: toAbsoluteSiteUrl(article.imageUrl || '/logo.jpg', BASE_URL),
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Bia Thầy Tu',
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}
