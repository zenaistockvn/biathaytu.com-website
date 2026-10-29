import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getLineProducts } from '@/lib/data/products';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Benediktiner Festbier, bia mùa lễ hội 5.8%',
  description: 'Benediktiner Festbier 5,8%, dòng mùa lễ hội: Vàng hổ phách, thân và vị mạch nha đậm hơn Naturtrüb, hoa bia đắng nhẹ. Có két 24 lon và bom 5L.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/benediktiner-festbier' },
  openGraph: {
    title: 'Benediktiner Festbier, bia mùa lễ hội 5.8%',
    description: 'Benediktiner Festbier 5,8%, dòng mùa lễ hội: Vàng hổ phách, thân và vị mạch nha đậm hơn Naturtrüb, hoa bia đắng nhẹ. Có két 24 lon và bom 5L.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/benediktiner-festbier',
    images: [
      {
        url: '/images/og/products/benediktiner-festbier-bom-5l.jpg',
        width: 1200,
        height: 630,
        alt: 'Bom 5L Benediktiner Festbier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Festbier, bia mùa lễ hội 5.8%',
    description: 'Benediktiner Festbier 5,8%, dòng mùa lễ hội: Vàng hổ phách, vị mạch nha đậm hơn Naturtrüb, hoa bia đắng nhẹ.',
    images: ['/images/og/products/benediktiner-festbier-bom-5l.jpg'],
  },
};

export default function Page() {
  const product = {
    name: 'Benediktiner Festbier',
    slug: 'benediktiner-festbier',
    url: 'https://www.biathaytu.com.vn/benediktiner-festbier',
    description: 'Dòng bia mùa lễ hội của Benediktiner, vàng hổ phách, thân và vị mạch nha đậm hơn Naturtrüb.',
    abv: '5.8',
    volume: '500ml, 5L',
    images: ['/images/og/products/benediktiner-festbier-bom-5l.jpg'],
  };

  const formats = getLineProducts('festbier');

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/benediktiner-festbier', label: 'Festbier' }))} />

      <ProductStory
        wordmark="BENEDIKTINER"
        hero={{
          eyebrow: 'Benediktiner Weissbräu Ettal',
          title: 'Festbier',
          kicker: 'Bia mùa lễ hội',
          meta: '5,8% vol. Uống ở 6 đến 8°C.',
          cutout: { src: '/images/brand/benediktiner-official/festbier-keg-nobg.webp', alt: 'Bom bia Benediktiner Festbier dung tích 5 lít' },
          backdrop: { src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Tu viện Ettal' },
        }}
        intro={{
          title: 'Dòng mùa lễ hội',
          image: { src: '/images/products/official/benediktiner/86312_Bene_Festbier_Dosenkarton_4x05l_schraeg_links.webp', alt: 'Két 24 lon Benediktiner Festbier 500ml' },
          body: (
            <>
              <p>Festbier đậm mạch nha hơn Naturtrüb và trong chứ không đục. Đây là dòng mùa lễ hội của Benediktiner: Khác hai dòng bia lúa mì, Festbier lên men đáy và ủ lạnh lâu hơn.</p>
              <p>Màu vàng hổ phách. Thân dày hơn, vị mạch nha rõ, hoa bia đắng nhẹ. Cồn 5,8%, cao hơn Naturtrüb và Dunkel một chút.</p>
            </>
          ),
          actions: [
            { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
            { href: '/san-pham#festbier', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '5,8% vol. Nhiệt độ 6 đến 8°C. Rót vại hoặc ly chân thấp.',
          flavors: [
            { label: 'Trái cây', value: 2 },
            { label: 'Gia vị', value: 1 },
            { label: 'Lúa mì', value: 2 },
            { label: 'Mạch nha', value: 5 },
            { label: 'Caramel', value: 3 },
            { label: 'Rang', value: 1 },
            { label: 'Hoa bia', value: 3 },
            { label: 'Đắng', value: 2 },
          ],
          color: 2,
          clarity: 0,
          foam: 1,
        }}
        notes={{
          title: 'Hương vị cảm nhận',
          items: [
            { term: 'Thị giác', text: 'Vàng hổ phách, trong. Bọt trắng mịn, giữ lâu.' },
            { term: 'Khứu giác', text: 'Mạch nha ngọt, thoảng bánh mì nướng và hoa bia.' },
            { term: 'Vị giác', text: 'Thân dày, ngọt nhẹ của mạch nha, cuối ngụm có vị đắng của hoa bia.' },
            { term: 'Hậu vị', text: 'Sạch, hơi ấm vì cồn 5,8%.' },
          ],
        }}
        story={{
          title: 'Một chút lịch sử',
          body: (
            <>
              <p>Benediktiner Festbier ủ tại Lich, bang Hessen, bởi nhà bia tư nhân Ihring-Melchior, theo công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal và Luật Tinh Khiết 1516.</p>
            </>
          ),
        }}
        ritual={{
          title: 'Cách rót',
          kicker: 'Bốn bước',
          steps: [
            ['Ướp lạnh', 'Ướp lạnh bia ở 6 đến 8°C trước khi rót.'],
            ['Nghiêng ly', 'Đặt ly nghiêng 45 độ, rót bia chầm chậm dọc theo thành ly.'],
            ['Dựng thẳng', 'Khi bia đạt hai phần ba ly, dựng thẳng và rót vào giữa để tạo lớp bọt mịn.'],
            ['Để bọt', 'Lớp bọt trắng dày vừa phải giữ mùi mạch nha và hoa bia lâu hơn.'],
          ],
        }}
        formats={{ products: formats }}
        pairing={{
          title: 'Món ăn kèm',
          kicker: 'Món nướng, thịt quay',
          items: [
            { title: 'Thịt nướng', text: 'Đùi heo nướng giòn da, sườn nướng và bò bít tết.' },
            { title: 'Gà quay', text: 'Gà quay thảo mộc với lớp da vàng giòn.' },
            { title: 'Xúc xích Đức', text: 'Xúc xích nướng ăn với bánh pretzel, mù tạt và khoai tây.' },
          ],
        }}
        cta={{
          title: 'Hợp tác phân phối',
          kicker: 'Đại lý và nhà phân phối',
          text: 'Có két 24 lon 500ml và bom 5L, nhập khẩu từ Đức. Đăng ký hợp tác để trao đổi về phân phối.',
          action: { href: '/bang-gia-si-dai-ly#dang-ky-hop-tac', label: 'Đăng ký hợp tác' },
        }}
      />
    </>
  );
}
