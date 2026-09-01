/** @type {import('next').NextConfig} */
const RETIRED_BEER_ARTICLE_SLUGS = [
  'top-5-dong-bia-bi-nhap-khau-duoc-ua-chuong-nhat',
  'gia-bia-chimay-xanh-do-vang-chinh-hang',
  'so-sanh-bia-duc-va-bia-bi-gu-thuong-thuc',
  'hop-qua-tang-bia-bi-bia-duc-nhap-khau-sang-trong',
  'mua-bia-thay-tu-chimay-la-trappe-o-dau-chinh-hang-ha-noi',
  'giai-ma-vi-dang-thanh-bitburger-premium-pilsner-duc',
  'so-sanh-bia-lua-mi-benediktiner-va-pilsner-bitburger',
  'bia-khong-con-bitburger-0-0-lua-chon-dang-cap',
  'bitburger-hanh-trinh-200-nam-bia-draft-so-1',
  'bitburger-premium-pils-bia-draft-so-1-nuoc-duc',
];

const RETIRED_BEER_PRODUCT_SLUGS = [
  'bitburger-premium-pils-thung-12-chai-330ml',
  'kostritzer-schwarzbier-bom-5l',
  'bitburger-premium-pils-ket-24-lon-330ml',
  'bitburger-football-edition-2026',
  'bitburger-00-alkoholfrei-ket-24-lon-330ml',
  'bitburger-premium-pils',
  'bitburger-premium-pils-bom-5l',
  'combo-match-night-bitburger-football-edition-xuc-xich',
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',
      },
    ],
  },
  async redirects() {
    return [
      ...RETIRED_BEER_ARTICLE_SLUGS.map((slug) => ({
        source: `/kien-thuc/${slug}`,
        destination: '/bia-benediktiner-chinh-hang',
        statusCode: 301,
      })),
      ...RETIRED_BEER_PRODUCT_SLUGS.map((slug) => ({
        source: `/san-pham/${slug}`,
        destination: '/san-pham',
        statusCode: 301,
      })),
      {
        source: '/bitburger-premium-pils',
        destination: '/bia-benediktiner-chinh-hang',
        statusCode: 301,
      },
      {
        source: '/dat-hang',
        destination: '/lien-he',
        statusCode: 301,
      },
      {
        source: '/mua-bia-benediktiner-chinh-hang',
        destination: '/bia-benediktiner-chinh-hang',
        statusCode: 301,
      },
      {
        source: '/chinh-sach-giao-hang',
        destination: '/thong-tin-mua-hang',
        statusCode: 301,
      },
      {
        source: '/chinh-sach-thanh-toan',
        destination: '/thong-tin-mua-hang',
        statusCode: 301,
      },
      {
        source: '/chinh-sach-doi-tra',
        destination: '/thong-tin-mua-hang',
        statusCode: 301,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
