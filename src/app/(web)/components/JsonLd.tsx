/**
 * JSON-LD Structured Data for SEO, AEO, and AI Overview optimization.
 * Helps search engines and AI assistants understand the business and products.
 */

import { getPublicBaseUrl, toAbsoluteSiteUrl } from '@/lib/seo/site';
import { BUSINESS, getBrandInfo } from '@/lib/seo/business';

const BASE_URL = getPublicBaseUrl();

interface JsonLdProps {
  type: 'organization' | 'product' | 'faq' | 'breadcrumb' | 'website' | 'article' | 'store' | 'itemlist';
  data: Record<string, unknown>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
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
    alternateName: ['Bia Thầy Tu', 'Benediktiner Vietnam'],
    url: BASE_URL,
    logo: `${BASE_URL}/logo.jpg`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Nhà phân phối các dòng Bia Thầy Tu Benediktiner Weissbier và Bitburger chính hãng tại Việt Nam. Bia lúa mì Đức nguyên bản sản xuất tại Lich theo công thức từ Tu Viện Ettal, Bavaria — 100% nhập khẩu chính hãng chuẩn Luật Tinh Khiết 1516.',
    foundingDate: '2020',
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phoneE164,
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
      areaServed: 'VN',
    },
    sameAs: [
      'https://www.facebook.com/tiepkhachsanhdieu',
      'https://zalo.me/biathaytu',
      'https://zalo.me/0899191313',
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Bia Thầy Tu — Bia Đức Cao Cấp Benediktiner',
    description: 'Website chính thức của Bia Thầy Tu Benediktiner — bia lúa mì Đức nhập khẩu chính hãng nấu theo công thức của Tu Viện Ettal.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'vi-VN',
  };
}

export function getStoreSchema() {
  const mapUrl = 'https://www.google.com/maps/search/?api=1&query=659A+Lac+Long+Quan+Tay+Ho+Ha+Noi';
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${BASE_URL}/#store`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.jpg`,
    image: `${BASE_URL}/images/products/official/benediktiner/bottle_removebg.png`,
    description: 'Bia Thầy Tu - Địa chỉ phân phối chính hãng các dòng bia nhập khẩu cao cấp, bia Đức Benediktiner, bia đen, bia Trappist từ các tu viện nổi tiếng tại Việt Nam.',
    telephone: BUSINESS.phoneE164,
    priceRange: '$$ - $$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '21.062534',
      longitude: '105.811442',
    },
    hasMap: mapUrl,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ],
      opens: '08:00',
      closes: '22:00'
    },
    sameAs: [
      'https://www.facebook.com/tiepkhachsanhdieu',
      'https://zalo.me/0899191313',
      mapUrl
    ]
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
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
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
      availability: 'https://schema.org/InStock',
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
      answer: 'Bia Thầy Tu (Benediktiner Weissbier) là dòng bia lúa mì truyền thống của Đức. Ngày nay, bia được sản xuất tại Lich, Đức theo công thức Benedictine gắn với Tu viện Ettal (Bavaria) và theo giấy phép của Benediktiner Weissbräu GmbH Ettal. Bia tuân thủ nghiêm ngặt Luật Tinh Khiết 1516 (Reinheitsgebot), chỉ sử dụng 4 nguyên liệu: nước, malt lúa mì, hoa bia và men bia.',
    },
    {
      question: 'Bia Benediktiner Weissbier có vị gì?',
      answer: 'Benediktiner Weissbier Naturtrüb có hương vị đặc trưng gồm trái chuối chín, đinh hương, với lớp bọt trắng mịn dày và hậu vị ngọt dịu. Bia có màu vàng hổ phách tự nhiên, không lọc (Naturtrüb), giữ trọn men sống và hương vị tự nhiên.',
    },
    {
      question: 'Mua bia Đức Benediktiner chính hãng ở đâu tại Việt Nam?',
      answer: 'Bia Thầy Tu Benediktiner được nhập khẩu và phân phối chính hãng tại Việt Nam. Bạn có thể đặt mua trực tiếp qua website biathaytu.com, Zalo (0899.191.313), hoặc tại Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc.',
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
      answer: 'Bia Thầy Tu hiện phân phối các dòng: Benediktiner Weissbier Naturtrüb (bia lúa mì tươi), Benediktiner Dunkel (bia đen), Bom 5L Benediktiner, và Combo Mix 2 vị. Tất cả đều được nhập khẩu 100% nguyên chai từ Đức.',
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

export function getSpeakableSchema(cssSelectors: string[], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Speakable',
    cssSelector: cssSelectors,
    url: url,
  };
}

export function getHowToSchema(howto: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howto.name,
    description: howto.description,
    step: howto.steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: `${BASE_URL}/#step-${idx + 1}`,
      ...(step.image ? { image: toAbsoluteSiteUrl(step.image, BASE_URL) } : {}),
    })),
  };
}

export function getItemListSchema(items: Array<{ name: string; url: string; position: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url,
      name: item.name,
    })),
  };
}

