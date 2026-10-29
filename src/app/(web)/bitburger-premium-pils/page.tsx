import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getLineProducts } from '@/lib/data/products';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bitburger Premium Pils, bia Pilsner Đức từ 1817',
  description: 'Bitburger Premium Pils, pilsner Đức nấu với hoa bia Siegelhopfen từ 1817. Xem hương vị, món ăn kèm và các quy cách chai, lon, bom 5 lít.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/bitburger-premium-pils' },
  openGraph: {
    title: 'Bitburger Premium Pils, bia Pilsner Đức từ 1817',
    description: 'Bitburger Premium Pils, pilsner Đức nấu với hoa bia Siegelhopfen từ 1817. Xem hương vị, món ăn kèm và các quy cách chai, lon, bom 5 lít.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/bitburger-premium-pils',
    images: [
      {
        url: '/images/og/bitburger.jpg',
        width: 1200,
        height: 630,
        alt: 'Vùng trồng hop Holsthum của nhà máy bia Bitburger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitburger Premium Pils, bia Pilsner Đức từ 1817',
    description: 'Bitburger Premium Pils, pilsner Đức nấu với hoa bia Siegelhopfen từ 1817.',
    images: ['/images/og/bitburger.jpg'],
  },
};

export default function Page() {
  const product = {
    name: 'Bitburger Premium Pils',
    slug: 'bitburger-premium-pils',
    url: 'https://www.biathaytu.com.vn/bitburger-premium-pils',
    description: 'Pilsner của nhà bia Bitburger, lên men đáy, nấu với hoa bia Siegelhopfen. Vàng sáng, đắng rõ, hậu vị khô.',
    abv: '4.8',
    volume: '330ml, 500ml',
  };


  const formats = getLineProducts('bitburger');

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/bitburger-premium-pils', label: 'Bitburger Premium Pils' }))} />

      <ProductStory
        wordmark="BITBURGER"
        hero={{
          eyebrow: 'Bitburger, từ 1817',
          title: 'Premium Pils',
          kicker: 'Bia vàng lên men đáy',
          meta: '4,8% vol. "Bitte ein Bit", theo hãng là Pils được rót nhiều nhất ở quầy bia Đức.',
          photo: { src: '/images/brand/bitburger-official/siegelhopfen-field.jpg', alt: 'Người trồng hoa bia Siegelhopfen cho Bitburger giữa vùng hop Holsthum', position: 'center 30%' },
        }}
        intro={{
          title: 'Đắng rõ, hậu vị khô',
          image: { src: '/images/products/official/bitburger/flasche_longneck_033l_pils_frontal_betaut_V8.webp', alt: 'Chai Bitburger Premium Pils 330ml' },
          body: (
            <>
              <p>Nấu theo Luật Tinh Khiết 1516, Bitburger dùng nước mềm vùng Eifel, lúa mạch chọn lọc, hoa bia và men bia riêng của nhà máy.</p>
              <p>Vàng sáng, bọt mịn, đắng hoa bia rõ và hậu vị khô. Một ngụm sau miếng mực nướng hay heo quay là miệng hết ngấy.</p>
            </>
          ),
          actions: [
            { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
            { href: '/san-pham#bia-duc-khac', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '4,8% vol. Uống lạnh 4 đến 6°C, ly Pokal chân cao.',
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
            { term: 'Khứu giác', text: 'Thảo mộc và hoa cỏ, mùi của hoa bia.' },
            { term: 'Vị giác', text: 'Ngọt nhẹ của mạch nha trước, rồi tới vị đắng rõ của hoa bia.' },
            { term: 'Hậu vị', text: 'Khô, sạch miệng, vị đắng dịu.' },
          ],
        }}
        story={{
          title: 'Hop Siegelhopfen',
          body: (
            <p>Hoa bia Siegelhopfen được trồng riêng cho Bitburger tại vùng Holsthum, gần Bitburg, trong Công viên tự nhiên Nam Eifel (Naturpark Südeifel), cùng hoa bia Siegelhopfen từ vùng Hallertau, Bavaria. Nhà máy có truyền thống nấu bia từ năm 1817.</p>
          ),
        }}
        formats={{ products: formats }}
        pairing={{
          title: 'Món ăn kèm',
          kicker: 'Món chiên nướng, nhiều gia vị',
          intro: 'Đắng và khô nên Pils hợp mâm nhiều món chiên nướng, nhiều dầu mỡ:',
          items: [
            { title: 'Món Việt đậm vị', text: 'Mực nướng muối ớt, tôm rang muối, heo quay và lẩu Thái.' },
            { title: 'Đồ nướng và xúc xích', text: 'Xúc xích Đức nướng, steak bò và sườn cừu sốt BBQ.' },
            { title: 'Hải sản và khai vị', text: 'Cá hồi áp chảo, hàu nướng mỡ hành và khoai tây chiên.' },
          ],
        }}
        cta={{
          title: 'Hợp tác phân phối',
          kicker: 'Đại lý và nhà phân phối',
          text: 'Có chai 330ml, lon 330ml, lon 500ml và bom 5L, nhập khẩu từ Đức. Đăng ký hợp tác để trao đổi về phân phối.',
          action: { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
        }}
      />
    </>
  );
}
