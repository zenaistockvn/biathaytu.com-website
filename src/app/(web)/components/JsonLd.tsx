/**
 * JSON-LD Structured Data for SEO, AEO, and AI Overview optimization.
 * Helps search engines and AI assistants understand the business and products.
 */

import { getPublicBaseUrl, toAbsoluteSiteUrl } from '@/lib/seo/site';
import { BUSINESS, getBrandInfo } from '@/lib/seo/business';
import { COMPANY_CONFIG, isPendingCompanyValue } from '@/config/company';
import type { NavItem } from '@/config/navigation';

const BASE_URL = getPublicBaseUrl();
const hasConfirmedLegalName = !isPendingCompanyValue(COMPANY_CONFIG.legalName);
const hasConfirmedShowroomAddress = !isPendingCompanyValue(COMPANY_CONFIG.showroomAddress);
const hasConfirmedHotline = !isPendingCompanyValue(COMPANY_CONFIG.hotline) && Boolean(BUSINESS.phoneE164);

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

/* ═══ Pre-built Schema Generators ═══ */

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Bia Thầy Tu',
    ...(hasConfirmedLegalName
      ? {
          legalName: COMPANY_CONFIG.legalName,
          parentOrganization: {
            '@type': 'Organization',
            name: COMPANY_CONFIG.legalName,
            url: COMPANY_CONFIG.legalWebsite,
          },
        }
      : {}),
    alternateName: ['Bia Thầy Tu', 'Benediktiner Vietnam'],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Đơn vị giới thiệu Bia Thầy Tu Benediktiner tại Việt Nam. Thông tin về nguồn gốc Ettal, hương vị bia Đức và tư vấn sản phẩm.',
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
    name: 'Bia Thầy Tu | Bia Đức nhập khẩu Benediktiner',
    description: 'Website giới thiệu Bia Thầy Tu Benediktiner: Nguồn gốc Ettal, hơn 400 năm truyền thống, các dòng Naturtrüb, Dunkel, Festbier và cách rót bia lúa mì.',
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
    ...(hasConfirmedLegalName ? { legalName: BUSINESS.legalName } : {}),
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Điểm giới thiệu và tư vấn Bia Thầy Tu Benediktiner tại Việt Nam.',
    ...(hasConfirmedHotline ? { telephone: BUSINESS.phoneE164 } : {}),
    ...(hasConfirmedShowroomAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_CONFIG.showroomAddress,
            addressCountry: BUSINESS.addressCountry,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: COMPANY_CONFIG.showroomGeo.latitude,
            longitude: COMPANY_CONFIG.showroomGeo.longitude,
          },
          hasMap: COMPANY_CONFIG.showroomMapUrl,
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
    description: product.description || `${product.name}, nhập khẩu chính hãng.`,
    sku: product.id || product.slug,
    mpn: product.id || product.slug,
    brand: { '@type': 'Brand', name: info.brand },
    ...(info.manufacturer
      ? {
          manufacturer: {
            '@type': 'Organization',
            name: info.manufacturer,
            address: {
              '@type': 'PostalAddress',
              addressCountry: info.manufacturerCountry,
              ...(info.manufacturerRegion ? { addressRegion: info.manufacturerRegion } : {}),
            },
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

/** Nhận chuỗi từ `breadcrumbTrail()` (src/config/navigation.ts) để tên khớp breadcrumb hiển thị và menu. */
export function getBreadcrumbSchema(items: NavItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href === '/' ? BASE_URL : toAbsoluteSiteUrl(item.href, BASE_URL),
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
      answer: 'Bia Thầy Tu là tên gọi ở Việt Nam của Benediktiner, bia lúa mì Đức theo công thức dòng Biển Đức, gắn với Tu viện Ettal và hơn 400 năm truyền thống.',
    },
    {
      question: 'Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?',
      answer: 'Không. Benediktiner ủ tại Lich, bang Hessen, theo công thức gốc của dòng Biển Đức, cho Benediktiner Weissbräu GmbH, Ettal. Men lấy từ hầm tu viện Ettal.',
    },
    {
      question: 'Bia Benediktiner Weissbier Naturtrüb có vị gì?',
      answer: 'Hương chuối chín và đinh hương, thân mềm. Bia không lọc nên vàng đục tự nhiên, bọt dày. Uống ngon ở 7 - 9 °C.',
    },
    {
      question: 'Ở Hà Nội xem Bia Thầy Tu ở đâu?',
      answer: `Tại ${COMPANY_CONFIG.showroomAddress}. Anh chị gọi trước để bên mình chuẩn bị đúng dòng bia cần xem.`,
    },
    {
      question: 'Bia Thầy Tu hiện có những dòng Benediktiner nào?',
      answer: 'Weissbier Naturtrüb, Weissbier Dunkel và Festbier. Quy cách chai, lon hay bom 5L tùy từng dòng và từng lô hàng.',
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
