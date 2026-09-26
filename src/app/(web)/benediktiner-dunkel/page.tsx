import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getPriceRange } from '@/lib/seo/productPricing';
import { getLineProducts } from '@/lib/data/products';
import { getLineForName } from '@/config/productLines';
import { getCompanyZaloUrl } from '@/config/company';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Benediktiner Dunkel, Bia Đen Lúa Mì Đức 5.4%',
  description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/benediktiner-dunkel' },
  openGraph: {
    title: 'Benediktiner Dunkel, Bia Đen Lúa Mì Đức 5.4%',
    description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/benediktiner-dunkel',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Benediktiner Dunkel, Bia Đen Lúa Mì Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Dunkel, Bia Đen Lúa Mì Đức 5.4%',
    description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.category === 'bia' && getLineForName(p.name)?.id === 'dunkel');
  const product = {
    name: 'Benediktiner Dunkel',
    slug: 'benediktiner-dunkel',
    url: 'https://www.biathaytu.com.vn/benediktiner-dunkel',
    description: 'Bia đen lúa mì từ Đức, hương mạch nha rang caramel đậm đà.',
    abv: '5.4',
    volume: '500ml',
    images: ['https://www.biathaytu.com.vn/images/products/official/benediktiner/57425_Benediktiner_Dunklel_VO_E-Hinweis.webp'],
  };

  const zaloBaseUrl = getCompanyZaloUrl();
  const msgOrder = 'Chào Bia Thầy Tu, mình muốn được tư vấn về bia đen lúa mì Benediktiner Dunkel.';
  const linkOrder = zaloBaseUrl ? `${zaloBaseUrl}?text=${encodeURIComponent(msgOrder)}` : '/lien-he';
  const formats = getLineProducts('dunkel');

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/benediktiner-dunkel', label: 'Benediktiner Dunkel' }))} />

      <ProductStory
        wordmark="BENEDIKTINER"
        hero={{
          eyebrow: 'Benediktiner Weissbräu Ettal',
          title: 'Weissbier Dunkel',
          kicker: 'Bia lúa mì đen',
          meta: '5,4% vol. Thưởng thức ở 8 đến 10°C.',
          cutout: { src: '/images/brand/benediktiner-official/dunkel-glass-nobg.webp', alt: 'Ly Benediktiner Weissbier Dunkel' },
        }}
        intro={{
          title: 'Lúa mì và mạch nha rang',
          image: { src: '/images/products/official/benediktiner/57425_Benediktiner_Dunklel_VO_E-Hinweis.webp', alt: 'Chai Benediktiner Weissbier Dunkel 500ml' },
          body: (
            <>
              <p>Dunkel trong tiếng Đức nghĩa là &quot;tối, đậm&quot;. Khác với bia đen Stout, Benediktiner Dunkel là bia đen lúa mì (Dunkelweizen).</p>
              <p>Mạch nha được rang để tạo màu nâu hạt dẻ và hương caramel ấm, nhưng bia vẫn giữ độ mượt và sảng khoái đặc trưng của dòng Weissbier.</p>
            </>
          ),
          actions: [
            { href: linkOrder, label: 'Mở Zalo', external: Boolean(zaloBaseUrl) },
            { href: '/san-pham#benediktiner', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '5,4% vol. Nhiệt độ 8 đến 10°C, ấm hơn Weissbier một chút để hương mạch nha bung tỏa.',
          flavors: [
            { label: 'Trái cây', value: 2 },
            { label: 'Gia vị', value: 1 },
            { label: 'Lúa mì', value: 3 },
            { label: 'Mạch nha', value: 5 },
            { label: 'Caramel', value: 5 },
            { label: 'Rang', value: 4 },
            { label: 'Hoa bia', value: 1 },
            { label: 'Đắng', value: 2 },
          ],
          color: 3,
          clarity: 2,
          foam: 2,
        }}
        notes={{
          title: 'Hương vị cảm nhận',
          items: [
            { term: 'Thị giác', text: 'Nâu hạt dẻ đậm, đục. Bọt màu caramel nhạt, xốp mịn.' },
            { term: 'Khứu giác', text: 'Mạch nha rang, kẹo bơ cứng, chocolate đen và thoảng chuối nướng.' },
            { term: 'Vị giác', text: 'Caramel và mật ong, xen vị bánh mì nướng và chút đắng nhẹ của hoa bia.' },
            { term: 'Hậu vị', text: 'Ấm, mượt và sạch. Độ béo của lúa mì hòa quyện với mạch nha.' },
          ],
        }}
        story={{
          title: 'Một chút lịch sử',
          body: (
            <>
              <p>Cùng truyền thống Benedictine từ Tu viện Ettal (thành lập năm 1330) như Weissbier Naturtrüb, Dunkel được nấu tại Lich theo Luật Tinh Khiết 1516.</p>
            </>
          ),
        }}
        formats={{ products: formats }}
        pairing={{
          title: 'Món ăn kèm',
          kicker: 'Nghệ thuật kết hợp',
          items: [
            { title: 'Món nướng', text: 'Sườn nướng, xúc xích nướng và bò bít tết.' },
            { title: 'Phô mai', text: 'Phô mai đậm vị như Gouda lâu năm hoặc phô mai xanh.' },
            { title: 'Tráng miệng', text: 'Bánh chocolate đen hoặc tiramisu.' },
          ],
        }}
        cta={{
          title: 'Liên hệ tư vấn',
          kicker: 'Tư vấn qua Zalo',
          text: 'Nhập khẩu nguyên chai từ Đức. Liên hệ để được tư vấn quy cách, giá và giao hàng.',
          action: { href: linkOrder, label: 'Mở Zalo', external: Boolean(zaloBaseUrl) },
        }}
      />
    </>
  );
}
