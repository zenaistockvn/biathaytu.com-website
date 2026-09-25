import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getBeerProducts } from '@/lib/data/products';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bom Bia 5L Benediktiner, Bia Đức Nhập Khẩu Cho Tiệc',
  description: 'Bom bia 5L Benediktiner Weissbier, bia Đức nhập khẩu chính hãng, phù hợp tiệc tại nhà và sự kiện. Thông tin sản phẩm, cách dùng, bảo quản và tư vấn.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bom-bia-5l-benediktiner' },
  openGraph: {
    title: 'Bom Bia 5L Benediktiner, Bia Đức Nhập Khẩu Cho Tiệc',
    description: 'Tìm hiểu bom bia 5L Benediktiner Weissbier: nguồn gốc Đức, dung tích, cách làm lạnh, sử dụng, bảo quản và thông tin tư vấn sản phẩm.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/bom-bia-5l-benediktiner',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bom Bia 5L Benediktiner, Bia Đức Nhập Khẩu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bom Bia 5L Benediktiner, Bia Đức Nhập Khẩu',
    description: 'Thông tin bom bia 5L Benediktiner Weissbier, cách dùng, bảo quản và tư vấn sản phẩm.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const product = {
    name: 'Bom Bia 5L Benediktiner',
    slug: 'bom-bia-5l-benediktiner',
    url: 'https://www.biathaytu.com.vn/bom-bia-5l-benediktiner',
    description: 'Bom bia Đức 5 lít, phù hợp tiệc tùng và quà tặng doanh nghiệp.',
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
          image: { src: '/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.webp', alt: 'Bom Benediktiner Festbier 5 lít' },
          body: (
            <>
              <p>Bom 5 lít làm điểm nhấn cho bàn tiệc gia đình, dã ngoại hay sự kiện. Vỏ kim loại chuyên dụng giữ lạnh tốt và bảo quản chất lượng bia.</p>
              <p>Vòi rót tích hợp sẵn cho phép tự rót bia tươi ngay tại bàn.</p>
            </>
          ),
          actions: [
            { href: '/san-pham/benediktiner-naturtrub-bom-5l', label: 'Xem chi tiết sản phẩm' },
            { href: '/lien-he', label: 'Liên hệ tư vấn' },
          ],
        }}
        ritual={{
          title: 'Sử dụng và bảo quản',
          kicker: 'Bốn bước',
          steps: [
            ['Làm lạnh sâu', 'Để bom trong tủ lạnh ít nhất 10 tiếng trước khi dùng. Không để ngăn đá.'],
            ['Thông khí', 'Xoay van thông khí trên đỉnh bom theo hướng dẫn để giảm áp suất trước khi rót.'],
            ['Mở vòi rót', 'Kéo vòi ở hông bom ra, xoay xuống để bia chảy. Điều chỉnh lực xoay để kiểm soát bọt.'],
            ['Dùng trong 48 giờ', 'Ngon nhất khi dùng hết trong 48 giờ sau khi mở để giữ bọt và độ tươi.'],
          ],
        }}
        formats={{ title: 'Các bom 5 lít', products: kegs }}
        cta={{
          title: 'Quà tặng',
          kicker: 'Doanh nghiệp và dịp lễ',
          text: 'Bom bia 5 lít còn là món quà tặng đối tác, bạn bè trong các dịp lễ, Tết.',
          action: { href: '/qua-tang-bia-duc', label: 'Xem các set quà tặng' },
        }}
      />
    </>
  );
}
