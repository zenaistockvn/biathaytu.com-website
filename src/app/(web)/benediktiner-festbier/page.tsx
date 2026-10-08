import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import ProductStory from '../components/ProductStory';
import { getPriceRange } from '@/lib/seo/productPricing';
import { getLineProducts } from '@/lib/data/products';
import { getLineForName } from '@/config/productLines';
import { getCompanyZaloUrl } from '@/config/company';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Benediktiner Festbier, bia lễ hội Đức 5.8%',
  description: 'Bia mùa lễ hội Benediktiner Festbier nồng độ 5,8%, màu vàng hổ phách, thân bia đậm đà mạch nha và hoa bia đắng nhẹ. Nhập khẩu Đức chính hãng.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/benediktiner-festbier' },
  openGraph: {
    title: 'Benediktiner Festbier, bia lễ hội Đức 5.8%',
    description: 'Bia mùa lễ hội Benediktiner Festbier nồng độ 5,8%, màu vàng hổ phách, thân bia đậm đà mạch nha và hoa bia đắng nhẹ. Nhập khẩu Đức chính hãng.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/benediktiner-festbier',
    images: [
      {
        url: '/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.webp',
        width: 1200,
        height: 630,
        alt: 'Benediktiner Festbier, bia lễ hội Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Festbier, bia lễ hội Đức 5.8%',
    description: 'Bia mùa lễ hội Benediktiner Festbier nồng độ 5,8%, màu vàng hổ phách, thân bia đậm đà mạch nha và hoa bia đắng nhẹ.',
    images: ['/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.webp'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.category === 'bia' && getLineForName(p.name)?.id === 'festbier');
  const product = {
    name: 'Benediktiner Festbier',
    slug: 'benediktiner-festbier',
    url: 'https://www.biathaytu.com.vn/benediktiner-festbier',
    description: 'Bia mùa lễ hội Oktoberfest từ Đức, sắc vàng hổ phách, vị mạch nha đậm đà.',
    abv: '5.8',
    volume: '500ml, 5L',
    images: ['https://www.biathaytu.com.vn/images/products/official/benediktiner/86492_Bene_Festbier_5l_Fass_Abbildung-Export.webp'],
  };

  const zaloBaseUrl = getCompanyZaloUrl();
  const msgOrder = 'Chào Bia Thầy Tu, mình muốn được tư vấn về bia mùa lễ hội Benediktiner Festbier.';
  const linkOrder = zaloBaseUrl ? `${zaloBaseUrl}?text=${encodeURIComponent(msgOrder)}` : '/lien-he';
  const formats = getLineProducts('festbier');

  return (
    <>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products, { href: '/benediktiner-festbier', label: 'Festbier' }))} />

      <ProductStory
        wordmark="BENEDIKTINER"
        hero={{
          eyebrow: 'Benediktiner Weissbräu Ettal',
          title: 'Festbier',
          kicker: 'Bia mùa lễ hội',
          meta: '5,8% vol. Thưởng thức ở 6 đến 8°C.',
          cutout: { src: '/images/brand/benediktiner-official/festbier-keg-nobg.webp', alt: 'Bom bia Benediktiner Festbier dung tích 5 lít' },
          backdrop: { src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Tu viện Ettal' },
        }}
        intro={{
          title: 'Hương vị mùa lễ hội Oktoberfest',
          image: { src: '/images/products/official/benediktiner/86312_Bene_Festbier_Dosenkarton_4x05l_schraeg_links.webp', alt: 'Két 24 lon Benediktiner Festbier 500ml' },
          body: (
            <>
              <p>Festbier là dòng bia biểu tượng gắn liền với các mùa lễ hội rực rỡ tại xứ Bavaria. Khác với dòng bia lúa mì thông thường, Festbier được ủ theo phương pháp lên men đáy với thời gian ủ lạnh dài hơn.</p>
              <p>Bia sở hữu sắc vàng hổ phách óng ả, vị mạch nha đậm đà hòa quyện cùng vị đắng êm dịu của hoa bia, tạo nên cảm giác tròn vị và sảng khoái.</p>
            </>
          ),
          actions: [
            { href: linkOrder, label: 'Mở Zalo', external: Boolean(zaloBaseUrl) },
            { href: '/san-pham#festbier', label: 'Xem các quy cách' },
          ],
        }}
        profile={{
          serving: '5,8% vol. Nhiệt độ 6 đến 8°C. Thích hợp ly vại đá hoặc ly Weizen cao.',
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
            { term: 'Thị giác', text: 'Vàng hổ phách óng ánh, trong vắt. Lớp bọt trắng mịn, giữ bọt tốt.' },
            { term: 'Khứu giác', text: 'Mạch nha ngọt ngào, thoảng hương bánh mì nướng và hoa bia nhẹ nhàng.' },
            { term: 'Vị giác', text: 'Tròn trịa và đậm đà; vị ngọt thanh của malt hòa cùng vị đắng êm của hoa bia.' },
            { term: 'Hậu vị', text: 'Sạch sẽ, tươi mới và sảng khoái. Lưu lại hậu vị ấm nồng của nồng độ 5,8%.' },
          ],
        }}
        story={{
          title: 'Một chút lịch sử',
          body: (
            <>
              <p>Benediktiner Festbier được nấu tại Lich theo công thức gốc dòng Biển Đức, men từ hầm tu viện Ettal và Luật Tinh Khiết 1516.</p>
            </>
          ),
        }}
        ritual={{
          title: 'Rót bia đúng điệu',
          kicker: 'Thưởng thức trọn vẹn',
          steps: [
            ['Ướp lạnh', 'Ướp lạnh bia ở nhiệt độ 6 đến 8°C trước khi thưởng thức.'],
            ['Nghiêng ly', 'Đặt ly nghiêng 45 độ, rót bia chầm chậm dọc theo thành ly.'],
            ['Dựng thẳng', 'Khi bia đạt hai phần ba ly, dựng thẳng và rót vào giữa để tạo lớp bọt mịn.'],
            ['Tận hưởng', 'Lớp bọt trắng dày vừa phải giúp giữ trọn vẹn hương thơm mạch nha và hoa bia.'],
          ],
        }}
        formats={{ products: formats }}
        pairing={{
          title: 'Món ăn kèm',
          kicker: 'Ẩm thực lễ hội',
          items: [
            { title: 'Thịt nướng', text: 'Đùi heo nướng giòn da, sườn nướng và bò bít tết.' },
            { title: 'Gà quay', text: 'Gà quay thảo mộc với lớp da vàng giòn.' },
            { title: 'Xúc xích Đức', text: 'Xúc xích nướng ăn kèm bánh pretzel xoắn và mù tạt.' },
          ],
        }}
        cta={{
          title: 'Liên hệ tư vấn',
          kicker: 'Tư vấn qua Zalo',
          text: 'Nhập khẩu chính hãng từ Đức. Liên hệ để được tư vấn quy cách két 24 lon, bom 5L và nhận thông tin chi tiết.',
          action: { href: linkOrder, label: 'Mở Zalo', external: Boolean(zaloBaseUrl) },
        }}
      />
    </>
  );
}
