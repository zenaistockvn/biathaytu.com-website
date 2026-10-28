import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getBeerProducts } from '@/lib/data/products';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bom bia 5L Benediktiner, bia Đức nhập khẩu cho tiệc',
  description: 'Bom 5L Benediktiner rót được khoảng 15 ly, có van xả khí và vòi rót sẵn, không cần máy hay bình CO2. Ướp tủ mát 6 - 8 tiếng, mở rồi nên dùng hết trong 48 giờ.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bom-bia-5l-benediktiner' },
  openGraph: {
    title: 'Bom bia 5L Benediktiner, bia Đức nhập khẩu cho tiệc',
    description: 'Bom 5L Benediktiner rót được khoảng 15 ly, có van xả khí và vòi rót sẵn, không cần máy hay bình CO2. Ướp tủ mát 6 - 8 tiếng, mở rồi nên dùng hết trong 48 giờ.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/bom-bia-5l-benediktiner',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bom bia 5L Benediktiner, bia Đức nhập khẩu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bom bia 5L Benediktiner, bia Đức nhập khẩu',
    description: 'Bom 5L Benediktiner: Ướp lạnh bao lâu, mở van thế nào, rót và giữ bia sau khi mở.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const product = {
    name: 'Bom Bia 5L Benediktiner',
    slug: 'bom-bia-5l-benediktiner',
    url: 'https://www.biathaytu.com.vn/bom-bia-5l-benediktiner',
    description: 'Bom bia Đức 5 lít có van xả khí và vòi rót sẵn, dùng cho tiệc gia đình hoặc làm quà biếu.',
    abv: '5.4',
    volume: '5000ml',
  };

  // Mọi bom 5L đang bán, giá lấy từ dữ liệu sản phẩm.
  const kegs = getBeerProducts().filter((p) => /bom\s*5\s*l/i.test(p.name));

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/bom-bia-5l-benediktiner', label: 'Bom Bia 5L' }))} />

      <ProductStory
        wordmark="BENEDIKTINER"
        hero={{
          eyebrow: 'Cho bàn tiệc',
          title: 'Bom bia 5 lít',
          kicker: 'Benediktiner',
          meta: 'Khoảng 15 ly. Vòi rót tích hợp sẵn.',
          cutout: { src: '/images/brand/benediktiner-official/festbier-keg-nobg.webp', alt: 'Bom 5 lít Benediktiner Festbier' },
        }}
        intro={{
          title: 'Bia tươi tại bàn tiệc',
          // Hero đã dùng bom Festbier; khối giới thiệu dùng bom Naturtrüb, khớp nút "Xem chi tiết sản phẩm" (audit L7).
          image: { src: '/images/products/official/benediktiner/438775_Bene_Weissbier_NT_5l_Keg_front.webp', alt: 'Bom Benediktiner Weissbier Naturtrüb 5 lít' },
          body: (
            <>
              <p>Một bom 5 lít rót được khoảng 15 ly, đủ cho bàn tiệc gia đình hay một buổi dã ngoại. Vỏ kim loại giữ lạnh tốt.</p>
              <p>Van xả khí ở nắp, vòi rót ở chân bom. Không cần máy chiết hay bình CO2, đặt lên bàn là tự rót được.</p>
            </>
          ),
          actions: [
            { href: '/san-pham/benediktiner-naturtrub-bom-5l', label: 'Xem chi tiết sản phẩm' },
            { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
          ],
        }}
        ritual={{
          title: 'Sử dụng và bảo quản',
          kicker: 'Bốn bước',
          steps: [
            ['Ướp lạnh', 'Để bom trong ngăn mát tủ lạnh 6-8 tiếng trước khi dùng. Không để ngăn đá.'],
            ['Thông khí', 'Xoay van thông khí trên đỉnh bom theo hướng dẫn để giảm áp suất trước khi rót.'],
            ['Mở vòi rót', 'Kéo vòi ở hông bom ra, xoay xuống để bia chảy. Điều chỉnh lực xoay để kiểm soát bọt.'],
            ['Dùng trong 48 giờ', 'Nên dùng hết trong 48 giờ sau khi mở để giữ bọt và độ tươi.'],
          ],
        }}
        formats={{ title: 'Các bom 5 lít', products: kegs }}
        cta={{
          title: 'Quà tặng',
          kicker: 'Doanh nghiệp và dịp lễ',
          text: 'Bom 5 lít cũng dùng làm quà biếu đối tác dịp lễ, Tết. Xem các set quà.',
          action: { href: '/qua-tang-bia-duc', label: 'Xem các set quà tặng' },
        }}
      />
    </>
  );
}
