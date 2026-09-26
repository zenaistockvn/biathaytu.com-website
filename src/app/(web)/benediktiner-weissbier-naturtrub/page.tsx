import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getPriceRange } from '@/lib/seo/productPricing';
import { getLineProducts } from '@/lib/data/products';
import { getLineForName } from '@/config/productLines';
import { getCompanyZaloUrl } from '@/config/company';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Benediktiner Weissbier Naturtrüb, Nhập Khẩu Đức',
  description: 'Khám phá Benediktiner Weissbier Naturtrüb 5,4%: nguồn gốc Ettal, hương chuối và đinh hương, cách rót và thưởng thức bia lúa mì Đức.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub' },
  openGraph: {
    title: 'Benediktiner Weissbier Naturtrüb, Nhập Khẩu Đức',
    description: 'Khám phá Benediktiner Weissbier Naturtrüb 5,4%: nguồn gốc Ettal, hương chuối và đinh hương, cách rót và thưởng thức bia lúa mì Đức.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub',
    images: [
      {
        url: '/images/brand/benediktiner-official/home-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb, Nhập Khẩu Đức',
    description: 'Bia lúa mì Đức nguyên bản từ tu viện Ettal (Bavaria) nấu theo Luật Tinh Khiết 1516. Đạt giải iTQi 3 Sao danh giá.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.category === 'bia' && getLineForName(p.name)?.id === 'naturtrub');
  const product = {
    name: 'Benediktiner Weissbier Naturtrüb',
    slug: 'benediktiner-weissbier-naturtrub',
    url: 'https://www.biathaytu.com.vn/benediktiner-weissbier-naturtrub',
    description: 'Bia lúa mì Đức nguyên bản, không lọc, giữ trọn vẹn hương vị men sống tự nhiên từ tu viện Ettal.',
    abv: '5.4',
    volume: '500ml',
  };

  const zaloBaseUrl = getCompanyZaloUrl();
  const msgOrder = 'Chào Bia Thầy Tu, mình muốn đặt mua bia lúa mì Benediktiner Weissbier Naturtrüb chính hãng. Tư vấn chương trình ưu đãi và giao hàng giúp mình nhé.';
  const linkOrder = zaloBaseUrl ? `${zaloBaseUrl}?text=${encodeURIComponent(msgOrder)}` : '/lien-he';
  const formats = getLineProducts('naturtrub');

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/benediktiner-weissbier-naturtrub', label: 'Weissbier Naturtrüb' }))} />

      <ProductStory
        wordmark="BENEDIKTINER"
        hero={{
          eyebrow: 'Benediktiner Weissbräu Ettal',
          title: 'Weissbier Naturtrüb',
          kicker: 'Bia lúa mì không lọc',
          meta: '5,4% vol. Thưởng thức ở 6 đến 8°C.',
          photo: { src: '/images/brand/benediktiner-official/home-hero.jpg', alt: 'Ly và chai Benediktiner Weissbier Naturtrüb trước Tu viện Ettal và dãy Alps', position: '68% center' },
        }}
        intro={{
          title: 'Tinh túy từ lớp men sống',
          image: { src: '/images/products/official/benediktiner/bottle_removebg.png', alt: 'Chai Benediktiner Weissbier Naturtrüb' },
          body: (
            <>
              <p>Naturtrüb trong tiếng Đức nghĩa là &quot;đục tự nhiên&quot;. Thay vì lọc sạch men như bia công nghiệp phổ thông, Benediktiner Weissbier giữ lại lớp men sống nguyên bản.</p>
              <p>Lớp men tiếp tục lên men trong chai, tạo nên màu hổ phách đục, lớp bọt dày mịn và hương vị trọn vẹn nhất của bia lúa mì Bavaria.</p>
            </>
          ),
          actions: [
            { href: linkOrder, label: 'Liên hệ đặt hàng', external: Boolean(zaloBaseUrl) },
            { href: '/san-pham#benediktiner', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '5,4% vol. Nhiệt độ 6 đến 8°C. Ly Weizen cao.',
          flavors: [
            { label: 'Trái cây', value: 5 },
            { label: 'Gia vị', value: 4 },
            { label: 'Lúa mì', value: 4 },
            { label: 'Mạch nha', value: 2 },
            { label: 'Caramel', value: 1 },
            { label: 'Rang', value: 0 },
            { label: 'Hoa bia', value: 1 },
            { label: 'Đắng', value: 1 },
          ],
          color: 2,
          clarity: 2,
          foam: 2,
        }}
        notes={{
          title: 'Hương vị cảm nhận',
          items: [
            { term: 'Thị giác', text: 'Vàng hổ phách đục. Lớp bọt trắng dày, lâu tan, bám chặt thành ly.' },
            { term: 'Khứu giác', text: 'Hương chuối chín ngọt tự nhiên, đinh hương cay nhẹ và lúa mì nướng ấm.' },
            { term: 'Vị giác', text: 'Êm, mượt và tròn trong khoang miệng. Vị ngọt nhẹ của trái cây cân bằng, không đắng gắt.' },
            { term: 'Hậu vị', text: 'Nhẹ nhàng, ngọt thanh của mạch nha, hương trái cây kéo dài.' },
          ],
        }}
        story={{
          title: 'Một chút lịch sử',
          body: (
            <>
              <p>Tu viện Ettal được các tu sĩ dòng Benedictine thành lập năm 1330, ở độ cao 877 m dưới chân dãy Alps, Bavaria. Truyền thống bia lúa mì của tu viện là nền tảng của công thức Benediktiner.</p>
              <p>Ngày nay bia được nấu tại Lich theo công thức Benedictine nguyên bản và Luật Tinh Khiết 1516.</p>
            </>
          ),
        }}
        ritual={{
          title: 'Nghi thức rót',
          kicker: 'Chuẩn Bavaria, bốn bước',
          steps: [
            ['Ướp lạnh', 'Ủ lạnh chai và ly Weizen thon dài ở 6 đến 8°C trước khi rót.'],
            ['Rót nghiêng 45°', 'Rót chậm dọc thành ly nghiêng cho đến khi trong chai còn khoảng một phần tư.'],
            ['Xoay nhẹ chai', 'Lăn nhẹ chai vài vòng để lớp men sống dưới đáy hòa tan.'],
            ['Phủ bọt', 'Rót phần men còn lại vào giữa ly để tạo lớp bọt dày mịn.'],
          ],
        }}
        formats={{ products: formats }}
        pairing={{
          image: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier trên bàn gỗ ngoài vườn', position: '70% center' },
          title: 'Món ăn kèm',
          kicker: 'Nghệ thuật kết hợp',
          intro: 'Vị lúa mì ngọt mát và độ sủi mượt giúp Weissbier tôn lên nhiều món ăn:',
          items: [
            { title: 'Hải sản', text: 'Tôm hấp sả, cua, mực nướng sa tế và lẩu hải sản chua ngọt.' },
            { title: 'Đồ nướng và gia cầm', text: 'Gà quay mật ong, xá xíu, salad ức gà nướng và xúc xích trắng kiểu Đức.' },
            { title: 'Phô mai mềm và tráng miệng', text: 'Phô mai dê, Gouda mềm, tart táo và panna cotta trái cây.' },
          ],
        }}
        cta={{
          title: 'Đặt hàng',
          kicker: 'Tư vấn qua Zalo',
          text: 'Nhập khẩu nguyên chai từ Đức. Liên hệ để được tư vấn quy cách, giá và giao hàng.',
          action: { href: linkOrder, label: 'Liên hệ đặt hàng qua Zalo', external: Boolean(zaloBaseUrl) },
        }}
      />
    </>
  );
}
