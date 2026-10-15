import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getPriceRange } from '@/lib/seo/productPricing';
import { getLineProducts } from '@/lib/data/products';
import { getLineForName } from '@/config/productLines';
import { getCompanyZaloUrl } from '@/config/company';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Benediktiner Dunkel, bia đen lúa mì Đức 5.4%',
  description: 'Benediktiner Dunkel 5,4%, bia lúa mì sẫm màu: Mạch nha rang, caramel, độ đắng thấp (IBU 13). Hợp sườn nướng, bò bít tết. Nhập khẩu nguyên chai từ Đức.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/benediktiner-dunkel' },
  openGraph: {
    title: 'Benediktiner Dunkel, bia đen lúa mì Đức 5.4%',
    description: 'Benediktiner Dunkel 5,4%, bia lúa mì sẫm màu: Mạch nha rang, caramel, độ đắng thấp (IBU 13). Hợp sườn nướng, bò bít tết. Nhập khẩu nguyên chai từ Đức.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/benediktiner-dunkel',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Benediktiner Dunkel, bia đen lúa mì Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Dunkel, bia đen lúa mì Đức 5.4%',
    description: 'Bia lúa mì sẫm màu Benediktiner Dunkel: Mạch nha rang, caramel, độ đắng thấp. Hợp món nướng.',
    images:['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.category === 'bia' && getLineForName(p.name)?.id === 'dunkel');
  const product = {
    name: 'Benediktiner Dunkel',
    slug: 'benediktiner-dunkel',
    url: 'https://www.biathaytu.com.vn/benediktiner-dunkel',
    description: 'Bia lúa mì sẫm màu ủ tại Lich, Đức: Hương mạch nha rang, caramel, bánh mì nướng, độ đắng thấp.',
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
          meta: '5,4% vol. Uống ở 8 đến 10°C.',
          cutout: { src: '/images/brand/benediktiner-official/dunkel-glass-cutout.webp', alt: 'Ly Benediktiner Weissbier Dunkel' },
          bottle: { src: '/images/products/official/benediktiner/57425_Benediktiner_Dunklel_VO_E-Hinweis.webp', alt: 'Chai bia Benediktiner Weissbier Dunkel 500ml' },
          backdrop: { src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Tu viện Ettal' },
        }}
        intro={{
          title: 'Lúa mì và mạch nha rang',
          image: { src: '/images/products/official/benediktiner/57425_Benediktiner_Dunklel_VO_E-Hinweis.webp', alt: 'Chai Benediktiner Weissbier Dunkel 500ml' },
          body: (
            <>
              <p>Dunkel trong tiếng Đức nghĩa là &quot;tối, đậm&quot;. Khác với bia đen Stout, Benediktiner Dunkel là bia đen lúa mì (Dunkelweizen).</p>
              <p>Mạch nha rang cho màu nâu hạt dẻ và mùi caramel, bánh mì nướng, chocolate đen. Mùi đó có từ mạch nha, không thêm hương liệu: Bia chỉ có nước, mạch nha, hoa bia và men.</p>
              <p>Màu sẫm nhưng không đắng gắt. Độ đắng chỉ khoảng IBU 13, vị vẫn mượt như bia lúa mì vàng.</p>
            </>
          ),
          actions: [
            { href: linkOrder, label: 'Mở Zalo', external: Boolean(zaloBaseUrl) },
            { href: '/san-pham#benediktiner', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '5,4% vol. Nhiệt độ 8 đến 10°C, ấm hơn Naturtrüb một chút. Lạnh quá thì mất mùi caramel.',
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
            { term: 'Thị giác', text: 'Nâu hạt dẻ, đục. Bọt màu nâu nhạt, xốp mịn.' },
            { term: 'Khứu giác', text: 'Mạch nha rang, kẹo bơ cứng, chocolate đen, thoảng chuối nướng.' },
            { term: 'Vị giác', text: 'Caramel và mật ong, xen vị bánh mì nướng, chút đắng nhẹ của hoa bia.' },
            { term: 'Hậu vị', text: 'Êm, sạch. Vị béo của lúa mì đi cùng mạch nha rang.' },
          ],
        }}
        story={{
          title: 'Một chút lịch sử',
          body: (
            <>
              <p>Cùng gốc với Weissbier Naturtrüb: Công thức dòng Biển Đức, men từ hầm tu viện Ettal (lập năm 1330). Dunkel ủ tại Lich, bang Hessen, bởi nhà bia tư nhân Ihring-Melchior, theo Luật Tinh Khiết 1516.</p>
            </>
          ),
        }}
        ritual={{
          title: 'Nghi thức rót bia',
          kicker: 'Bốn bước',
          steps: [
            ['Nghiêng ly', 'Để ly nghiêng 45 độ, rót bia chầm chậm dọc thành ly.'],
            ['Chừa lại một ít', 'Dừng khi trong chai còn khoảng một phần tư.'],
            ['Xoay chai', 'Xoay nhẹ đáy chai vài vòng cho lớp men dưới đáy tan vào phần bia còn lại.'],
            ['Phủ bọt', 'Dựng ly, rót nốt phần còn lại vào giữa ly để có lớp bọt nâu nhạt dày.'],
          ],
        }}
        formats={{ products: formats }}
        pairing={{
          title: 'Món ăn kèm',
          kicker: 'Món nướng, thịt đỏ',
          intro: 'Hợp bữa tối trời se lạnh hoặc tiệc nướng. Vị caramel và chút đắng của hoa bia cắt bớt vị béo của mỡ nướng:',
          items: [
            { title: 'Món nướng', text: 'Sườn cừu nướng lá hương thảo, bò bít tết chín vừa, xúc xích nướng lò kiểu Đức.' },
            { title: 'Phô mai', text: 'Gouda lâu năm hoặc phô mai xanh.' },
            { title: 'Tráng miệng', text: 'Một miếng chocolate đen nguyên chất, bánh chocolate hoặc tiramisu.' },
          ],
        }}
        cta={{
          title: 'Liên hệ tư vấn',
          kicker: 'Tư vấn qua Zalo',
          text: 'Có thùng 12 chai, thùng 12 lon và két 24 lon 500ml, nhập khẩu từ Đức. Nhắn Zalo để hỏi giá và điểm nhận hàng.',
          action: { href: linkOrder, label: 'Mở Zalo', external: Boolean(zaloBaseUrl) },
        }}
      />
    </>
  );
}
