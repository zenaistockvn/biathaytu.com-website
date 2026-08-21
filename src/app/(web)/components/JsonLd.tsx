/** JSON-LD Structured Data for SEO, AEO, and AI Overview optimization. */

import { getPublicBaseUrl, toAbsoluteSiteUrl } from '@/lib/seo/site';
import { BUSINESS, getBrandInfo } from '@/lib/seo/business';
import { BRAND } from '@/lib/brand';

const BASE_URL = getPublicBaseUrl();

interface JsonLdProps {
  type: 'organization' | 'product' | 'faq' | 'breadcrumb' | 'website' | 'article' | 'store';
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: BRAND.consumerBrand,
    legalName: BRAND.legalName,
    alternateName: ['Bia Thầy Tu', 'Benediktiner Vietnam', BRAND.name],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'German Taste giới thiệu và phân phối Benediktiner tại Việt Nam, với thông tin về Ettal, hương vị bia Đức và tư vấn sản phẩm.',
    slogan: BRAND.exclusivity,
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.showroomAddress,
      addressLocality: 'Ba Đình',
      addressRegion: 'Hà Nội',
      addressCountry: BUSINESS.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phoneE164,
      email: BRAND.email,
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
      areaServed: 'VN',
    },
    sameAs: [
      BRAND.socialLinks.zalo,
      BRAND.socialLinks.fanpage,
      BRAND.socialLinks.messenger,
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Bia Thầy Tu — Benediktiner tại Việt Nam',
    description: 'Website thương hiệu Benediktiner tại Việt Nam: câu chuyện Ettal, danh mục bia Đức, cách thưởng thức và tư vấn HORECA.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'vi-VN',
  };
}

export function getStoreSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#store`,
    name: BUSINESS.name,
    legalName: BRAND.legalName,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Điểm giới thiệu và tư vấn Bia Thầy Tu Benediktiner của German Taste tại Hà Nội.',
    telephone: BUSINESS.phoneE164,
    email: BRAND.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.showroomAddress,
      addressLocality: 'Ba Đình',
      addressRegion: 'Hà Nội',
      addressCountry: BUSINESS.addressCountry,
    },
    sameAs: [
      BRAND.socialLinks.zalo,
      BRAND.socialLinks.fanpage,
      BRAND.socialLinks.messenger,
    ],
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
  const normalizedName = product.name.toLowerCase();
  const isBelgium = normalizedName.includes('bỉ') || normalizedName.includes('chimay') || normalizedName.includes('rochefort');

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    url: productUrl,
    image: toAbsoluteSiteUrl(product.images?.[0] || '/images/products/placeholder-product.svg', BASE_URL),
    description: product.description || `${product.name} — thông tin sản phẩm và gợi ý thưởng thức.`,
    sku: product.id || product.slug,
    mpn: product.id || product.slug,
    brand: { '@type': 'Brand', name: info.brand },
    ...(info.manufacturer
      ? {
          manufacturer: {
            '@type': 'Organization',
            name: info.manufacturer,
            address: { '@type': 'PostalAddress', addressCountry: info.manufacturerCountry },
          },
        }
      : {}),
    countryOfOrigin: { '@type': 'Country', name: isBelgium ? 'Belgium' : 'Germany' },
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
  return getFaqSchema([
    {
      question: 'Bia Thầy Tu là bia gì?',
      answer: 'Bia Thầy Tu là cách gọi thân thuộc tại Việt Nam dành cho Benediktiner, thương hiệu bia Đức gắn với truyền thống Tu viện Ettal.',
    },
    {
      question: 'Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?',
      answer: BRAND.historyFacts,
    },
    {
      question: 'Bia Benediktiner Weissbier Naturtrüb có vị gì?',
      answer: 'Benediktiner Weissbier Naturtrüb nổi bật với hương chuối chín và đinh hương, màu vàng đục tự nhiên, lớp bọt trắng mịn và cảm giác êm cân bằng.',
    },
    {
      question: 'Có thể tìm hiểu Bia Thầy Tu tại đâu ở Hà Nội?',
      answer: `Vui lòng liên hệ trước hoặc ghé điểm giới thiệu tại ${BRAND.showroomAddress}. Hotline và email được công bố thống nhất trên website.`,
    },
    {
      question: 'Bia Thầy Tu hiện giới thiệu những dòng Benediktiner nào?',
      answer: 'Các dòng nổi bật gồm Weissbier Naturtrüb, Weissbier Dunkel và Festbier, với nhiều quy cách chai, lon hoặc bom tùy từng thời điểm.',
    },
  ]);
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
    image: toAbsoluteSiteUrl(article.imageUrl || '/logo.png', BASE_URL),
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: article.authorName || BRAND.name,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}
