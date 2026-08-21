/** @type {import('next').NextConfig} */
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
      {
        source: '/dat-hang',
        destination: '/lien-he',
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
