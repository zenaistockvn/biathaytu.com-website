/** @type {import('next').NextConfig} */
const RETIRED_BEER_ARTICLE_SLUGS = [
  'top-5-dong-bia-bi-nhap-khau-duoc-ua-chuong-nhat',
  'gia-bia-chimay-xanh-do-vang-chinh-hang',
  'so-sanh-bia-duc-va-bia-bi-gu-thuong-thuc',
  'hop-qua-tang-bia-bi-bia-duc-nhap-khau-sang-trong',
  'mua-bia-thay-tu-chimay-la-trappe-o-dau-chinh-hang-ha-noi',
];

const RETIRED_BEER_PRODUCT_SLUGS = [
  'kostritzer-schwarzbier-bom-5l',
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
];

const RETIRED_ARTICLES = require('./src/config/retired-articles.json');

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
      // Domain chính là www.biathaytu.com.vn; biathaytu.com (có hoặc không www) chuyển 301 giữ nguyên đường dẫn.
      // Đặt đầu danh sách để đổi domain trước, các redirect đường dẫn bên dưới áp dụng ở bước sau.
      ...['www.biathaytu.com', 'biathaytu.com'].map((host) => ({
        source: '/:path*',
        has: [{ type: 'host', value: host }],
        destination: 'https://www.biathaytu.com.vn/:path*',
        statusCode: 301,
      })),
      ...Object.entries(RETIRED_ARTICLES).map(([slug, destination]) => ({
        source: `/kien-thuc/${slug}`,
        destination,
        statusCode: 301,
      })),
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
        source: '/san-pham/benediktiner-weissbier-naturtrub-500ml',
        destination: '/san-pham/benediktiner-naturtrub-thung-12-chai-500ml',
        statusCode: 301,
      },
      {
        source: '/san-pham/bitburger-premium-pils-330ml',
        destination: '/san-pham/bitburger-premium-pils-thung-12-chai-330ml',
        statusCode: 301,
      },
      {
        source: '/san-pham/benediktiner-dunkel-500ml',
        destination: '/san-pham/benediktiner-dunkel-thung-12-chai-500ml',
        statusCode: 301,
      },
      {
        source: '/san-pham/bom-5l-benediktiner-weissbier',
        destination: '/san-pham/benediktiner-naturtrub-bom-5l',
        statusCode: 301,
      },
      // Trang chiến dịch đã gỡ (09/2026); danh mục sản phẩm thay thế.
      {
        source: '/nhan-uu-dai',
        destination: '/san-pham',
        statusCode: 301,
      },
      {
        source: '/bia-duc-nhap-khau',
        destination: '/san-pham',
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
        // Tên file font đổi mỗi khi tạo lại (xem public/fonts/README.md), nên được cache vĩnh viễn.
        source: '/fonts/:all*',
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
