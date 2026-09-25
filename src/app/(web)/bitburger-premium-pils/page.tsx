import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getPriceRange } from '@/lib/seo/productPricing';
import { getBeerProducts } from '@/lib/data/products';
import { getCompanyZaloUrl } from '@/config/company';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bitburger Premium Pils, Bia Pilsner Đức Từ 1817',
  description: 'Bitburger Premium Pils, pilsner Đức nấu với hoa bia Siegelhopfen từ 1817. Xem hương vị, món ăn kèm và các quy cách chai, lon, bom 5 lít.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bitburger-premium-pils' },
  openGraph: {
    title: 'Bitburger Premium Pils, Bia Pilsner Đức Từ 1817',
    description: 'Bitburger Premium Pils, pilsner Đức nấu với hoa bia Siegelhopfen từ 1817. Xem hương vị, món ăn kèm và các quy cách chai, lon, bom 5 lít.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/bitburger-premium-pils',
    images: [
      {
        url: '/images/brand/bitburger-official/siegelhopfen-field.jpg',
        width: 1200,
        height: 630,
        alt: 'Vùng trồng hop Holsthum của nhà máy bia Bitburger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitburger Premium Pils, Bia Pilsner Đức Từ 1817',
    description: 'Bitburger Premium Pils, pilsner Đức nấu với hoa bia Siegelhopfen từ 1817.',
    images: ['/images/brand/bitburger-official/siegelhopfen-field.jpg'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.name.includes('Bitburger'));
  const product = {
    name: 'Bitburger Premium Pils',
    slug: 'bitburger-premium-pils',
    url: 'https://www.biathaytu.com.vn/bitburger-premium-pils',
    description: 'Bia Pilsner tươi mát chuẩn Đức, lên men đáy với hoa bia Siegelhopfen.',
    abv: '4.8',
    volume: '330ml, 500ml',
  };

  const zaloBaseUrl = getCompanyZaloUrl();
  const msgGeneral = 'Chào Bia Thầy Tu, mình muốn tư vấn đặt mua bia Bitburger Premium Pils chính hãng. Giao nhanh giúp mình nhé.';
  const linkGeneral = zaloBaseUrl ? `${zaloBaseUrl}?text=${encodeURIComponent(msgGeneral)}` : '/lien-he';

  const formats = getBeerProducts().filter((p) => p.name.includes('Bitburger'));

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/bitburger-premium-pils', label: 'Bitburger Premium Pils' }))} />

      <ProductStory
        wordmark="BITBURGER"
        hero={{
          eyebrow: 'Bitburger, từ 1817',
          title: 'Premium Pils',
          kicker: 'Bia vàng lên men đáy',
          meta: '4,8% vol. "Bitte ein Bit", dòng pilsner được yêu thích tại Đức.',
          photo: { src: '/images/brand/bitburger-official/siegelhopfen-field.jpg', alt: 'Người trồng hoa bia Siegelhopfen cho Bitburger giữa vùng hop Holsthum', position: 'center 30%' },
        }}
        intro={{
          title: 'Vị đắng thanh khiết',
          image: { src: '/images/products/official/bitburger/flasche_longneck_033l_pils_frontal_betaut_V8.webp', alt: 'Chai Bitburger Premium Pils 330ml' },
          body: (
            <>
              <p>Nấu theo Luật Tinh Khiết 1516, Bitburger dùng nước mềm vùng Eifel, lúa mạch chọn lọc, hoa bia và men bia riêng của nhà máy.</p>
              <p>Bia vàng trong, vị đắng sắc nét dễ chịu, làm sạch khoang miệng, hợp với các món nướng đậm vị.</p>
            </>
          ),
          actions: [
            { href: linkGeneral, label: 'Tư vấn đặt hàng', external: Boolean(zaloBaseUrl) },
            { href: '/san-pham#bia-duc-khac', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '4,8% vol. Thưởng thức lạnh, ly Pokal chân cao.',
          flavors: [
            { label: 'Trái cây', value: 1 },
            { label: 'Gia vị', value: 0 },
            { label: 'Lúa mì', value: 1 },
            { label: 'Mạch nha', value: 3 },
            { label: 'Caramel', value: 0 },
            { label: 'Rang', value: 0 },
            { label: 'Hoa bia', value: 5 },
            { label: 'Đắng', value: 4 },
          ],
          color: 1,
          clarity: 0,
          foam: 1,
        }}
        notes={{
          title: 'Hương vị cảm nhận',
          items: [
            { term: 'Thị giác', text: 'Vàng rơm, trong. Lớp bọt trắng mịn, lâu tan.' },
            { term: 'Khứu giác', text: 'Thảo mộc tươi mát và hương hoa cỏ tinh tế của hoa bia.' },
            { term: 'Vị giác', text: 'Mở đầu bằng vị ngọt nhẹ của mạch nha, tiếp theo là vị đắng thanh, sắc nét.' },
            { term: 'Hậu vị', text: 'Khô, sạch miệng, đọng lại vị đắng dịu kéo dài.' },
          ],
        }}
        story={{
          title: 'Hop Siegelhopfen',
          body: (
            <p>Hoa bia Siegelhopfen được trồng riêng cho Bitburger tại vùng Holsthum, gần Bitburg, trong Vườn quốc gia Südeifel. Nhà máy có truyền thống nấu bia từ năm 1817.</p>
          ),
        }}
        formats={{ products: formats }}
        pairing={{
          title: 'Món ăn kèm',
          kicker: 'Nghệ thuật kết hợp',
          intro: 'Vị đắng thanh và khả năng làm sạch vòm họng giúp Pils hợp với bữa tiệc nhiều món:',
          items: [
            { title: 'Món Việt đậm vị', text: 'Mực nướng muối ớt, tôm rang muối, heo quay và lẩu Thái.' },
            { title: 'Đồ nướng và xúc xích', text: 'Xúc xích Đức nướng, steak bò và sườn cừu sốt BBQ.' },
            { title: 'Hải sản và khai vị', text: 'Cá hồi áp chảo, hàu nướng mỡ hành và khoai tây chiên.' },
          ],
        }}
        cta={{
          title: 'Đặt hàng',
          kicker: 'Tư vấn qua Zalo',
          text: 'Nhập khẩu nguyên chai, lon từ Đức. Liên hệ để được tư vấn quy cách, giá và giao hàng.',
          action: { href: linkGeneral, label: 'Liên hệ đặt hàng qua Zalo', external: Boolean(zaloBaseUrl) },
        }}
      />
    </>
  );
}
