/**
 * JSON-LD Structured Data for SEO, AEO, and AI Overview optimization.
 * Helps search engines and AI assistants understand the business and products.
 */

const BASE_URL = 'https://www.biathaytu.com';

interface JsonLdProps {
  type: 'organization' | 'product' | 'faq' | 'breadcrumb' | 'website' | 'article';
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
    description: 'Nhà nhập khẩu và phân phối độc quyền Bia Thầy Tu Benediktiner Weissbier tại Việt Nam. Bia lúa mì Đức nguyên bản từ Tu Viện Ettal, Bavaria — 100% nhập khẩu chính hãng chuẩn Luật Tinh Khiết 1516.',
    foundingDate: '2020',
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '218 Đội Cấn, Phường Liễu Giai',
      addressLocality: 'Quận Ba Đình',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-915-312-166',
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
      areaServed: 'VN',
    },
    sameAs: [
      'https://zalo.me/biathaytu',
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
    description: 'Website chính thức của Bia Thầy Tu Benediktiner — bia lúa mì Đức nhập khẩu chính hãng từ Tu Viện Ettal. Đạt giải iTQi 3 Sao 2022.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'vi-VN',
  };
}

export function getProductSchema(product: {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  images?: string[];
  abv?: string;
  volume?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: `${BASE_URL}/san-pham/${product.slug}`,
    image: product.images?.[0] || `${BASE_URL}/logo.jpg`,
    description: product.description || `${product.name} — bia Đức nhập khẩu chính hãng từ Tu Viện Ettal.`,
    brand: {
      '@type': 'Brand',
      name: 'Benediktiner',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Benediktiner Weißbräu GmbH',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'DE',
        addressRegion: 'Bavaria',
      },
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Germany',
    },
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        url: `${BASE_URL}/san-pham/${product.slug}`,
        priceCurrency: 'VND',
        price: product.price,
        availability: 'https://schema.org/InStock',
        seller: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
    }),
    additionalProperty: [
      ...(product.abv ? [{
        '@type': 'PropertyValue',
        name: 'Alcohol by Volume',
        value: `${product.abv}%`,
      }] : []),
      ...(product.volume ? [{
        '@type': 'PropertyValue',
        name: 'Volume',
        value: product.volume,
      }] : []),
      {
        '@type': 'PropertyValue',
        name: 'Origin',
        value: 'Germany (Bavaria)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Brewing Standard',
        value: 'Reinheitsgebot 1516 (German Purity Law)',
      },
    ],
    award: 'iTQi Superior Taste Award 3 Stars 2022',
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
      question: 'Mua bia Đức Benediktiner chính hãng ở đâu tại Việt Nam?',
      answer: 'Bia Thầy Tu Benediktiner được nhập khẩu và phân phối độc quyền tại Việt Nam. Bạn có thể đặt mua trực tiếp qua website biathaytu.com, Zalo (091.531.2166), hoặc tại Showroom 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc.',
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

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/kien-thuc/${article.slug}`,
    },
    headline: article.title,
    description: article.description,
    image: article.imageUrl || `${BASE_URL}/logo.jpg`,
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
