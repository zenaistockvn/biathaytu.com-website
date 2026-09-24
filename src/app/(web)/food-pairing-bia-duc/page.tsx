import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, FaqSection, InfoGrid, Summary } from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Nghệ Thuật Food Pairing: Bia Đức Kết Hợp Cùng Ẩm Thực',
  description: 'Khám phá bí quyết kết hợp (food pairing) các dòng bia Đức như Weissbier, Dunkel, Pilsner với các món ăn Việt Nam, món Âu và đồ nướng BBQ.',
  alternates: { canonical: 'https://www.biathaytu.com/food-pairing-bia-duc' },
  openGraph: {
    title: 'Nghệ Thuật Food Pairing: Bia Đức Kết Hợp Cùng Ẩm Thực',
    description: 'Khám phá bí quyết kết hợp (food pairing) các dòng bia Đức như Weissbier, Dunkel, Pilsner với các món ăn Việt Nam, món Âu và đồ nướng BBQ.',
    type: 'article',
    url: 'https://www.biathaytu.com/food-pairing-bia-duc',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Nghệ Thuật Food Pairing: Bia Đức Kết Hợp Cùng Ẩm Thực',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nghệ Thuật Food Pairing: Bia Đức Kết Hợp Cùng Ẩm Thực',
    description: 'Khám phá bí quyết kết hợp (food pairing) các dòng bia Đức như Weissbier, Dunkel, Pilsner với các món ăn Việt Nam, món Âu và đồ nướng BBQ.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const faqs = [
    { question: 'Bia Đức ăn với món gì ngon?', answer: 'Weissbier hợp hải sản hấp, gà nướng, phô mai mềm; Dunkel hợp steak, sườn BBQ, chocolate đen; Pilsner hợp pizza, đồ nhắm, BBQ. Bia lúa mì Đức cũng rất hợp món Việt như phở và hải sản.' },
    { question: 'Uống bia Đức ở nhiệt độ nào ngon nhất?', answer: 'Weissbier và Dunkel ngon nhất ở 6–8°C; Pilsner ở 4–6°C. Dùng đúng loại ly (ly Weizen cao cho bia lúa mì) để giữ bọt và hương.' },
    { question: 'Bia lúa mì khác bia thường thế nào?', answer: 'Bia lúa mì (Weissbier) dùng nhiều malt lúa mì, lên men đỉnh, thường không lọc (Naturtrüb) nên đục tự nhiên, hương chuối chín và đinh hương đặc trưng, bọt dày.' },
  ];

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Food Pairing với Bia Đức', slug: 'food-pairing-bia-duc', url: 'https://www.biathaytu.com/food-pairing-bia-duc', description: 'Cách kết hợp món ăn và bia Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="faq" data={getFaqSchema(faqs)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Food Pairing Bia Đức', url: 'https://www.biathaytu.com/food-pairing-bia-duc' }])} />

      <EditorialPage
        hero={{
          eyebrow: 'Kiến thức ẩm thực',
          title: 'Food pairing',
          kicker: 'Bia Đức và món ăn',
          lead: 'Kết hợp đúng hương vị bia với món ăn phù hợp.',
        }}
        after={<FaqSection items={faqs} />}
      >
        <Summary>
          <p><strong>Food pairing là gì?</strong> Đó là nghệ thuật &quot;ghép đôi&quot; đồ uống và món ăn sao cho chúng tôn vinh lẫn nhau. Một ly bia Đức phù hợp có thể làm giảm độ ngấy của món ăn, làm bật vị tươi ngọt của hải sản, hoặc hòa quyện cùng vị đậm đà của thịt nướng.</p>
        </Summary>

        <h2>1. Bia lúa mì (Weissbier)</h2>
        <p><strong>Đặc điểm:</strong> vị ngọt dịu, ít đắng, thoang thoảng hương trái cây (chuối chín, cam quýt) và đinh hương. Độ sủi cao giúp làm sạch vòm miệng.</p>
        <InfoGrid
          items={[
            { title: 'Hải sản', text: 'Tôm hấp, mực nướng, sushi. Vị ngọt của bia làm bật độ tươi của hải sản mà không lấn át.' },
            { title: 'Gia cầm và đồ chua', text: 'Gà nướng mật ong, salad chua ngọt, nem chua. Độ sủi cắt ngang vị béo ngậy.' },
            { title: 'Món Việt truyền thống', text: 'Thú vị nhất là cùng phở: sự thanh của Weissbier hợp với nước dùng xương.' },
          ]}
        />

        <h2>2. Bia lúa mì đen (Dunkelweizen)</h2>
        <p><strong>Đặc điểm:</strong> mạch nha rang đậm đà, hương caramel, chocolate đen và thoảng vị nướng. Hậu vị êm, ấm.</p>
        <InfoGrid
          items={[
            { title: 'Đồ nướng BBQ', text: 'Sườn heo nướng, xúc xích Đức nướng than, bít tết bò. Hai “vị khói” cộng hưởng với nhau.' },
            { title: 'Món hầm đậm vị', text: 'Bò kho, thịt lợn hầm. Vị ngọt caramel của bia trung hòa vị mặn của món ăn.' },
            { title: 'Tráng miệng', text: 'Chocolate đen, tiramisu, brownie. Vị mạch nha nướng nâng vị cacao.' },
          ]}
        />

        <h2>3. Pilsner (bia vàng)</h2>
        <p><strong>Đặc điểm:</strong> trong, giải khát. Vị đắng thanh của hoa bia và hậu vị khô, sạch miệng.</p>
        <InfoGrid
          items={[
            { title: 'Đồ chiên rán', text: 'Gà rán, mực chiên xù, khoai tây chiên. Vị đắng và độ lạnh cắt cảm giác ngấy mỡ.' },
            { title: 'Đồ nhắm mặn và cay', text: 'Khô bò, lạc rang muối, pizza cay. Pilsner làm dịu vị cay nồng.' },
            { title: 'Ẩm thực đường phố', text: 'Các món xiên nướng, ốc xào, cho những buổi tụ tập.' },
          ]}
        />

        <CtaBand
          title="Chọn bia cho bữa tiệc"
          text="Chuẩn bị thực đơn cùng bộ sưu tập bia Đức nhập khẩu chính hãng."
          action={{ href: '/san-pham', label: 'Khám phá các dòng bia' }}
        />
      </EditorialPage>
    </>
  );
}
