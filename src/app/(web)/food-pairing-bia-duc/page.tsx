import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getFaqSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, FaqSection, InfoGrid, Summary } from '../components/EditorialPage';
import { breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Bia Đức ăn với món gì: Weissbier, Dunkel, Pilsner',
  description: 'Weissbier hợp hải sản hấp, gà nướng; Dunkel hợp sườn nướng, bò kho; Pilsner hợp đồ chiên, món cay. Tóm tắt theo từng dòng, kèm 7 món Việt nên thử.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/food-pairing-bia-duc' },
  openGraph: {
    title: 'Bia Đức ăn với món gì: Weissbier, Dunkel, Pilsner',
    description: 'Weissbier hợp hải sản hấp, gà nướng; Dunkel hợp sườn nướng, bò kho; Pilsner hợp đồ chiên, món cay. Tóm tắt theo từng dòng, kèm 7 món Việt nên thử.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/food-pairing-bia-duc',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Đức ăn với món gì',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Đức ăn với món gì: Weissbier, Dunkel, Pilsner',
    description: 'Weissbier hợp hải sản hấp, gà nướng; Dunkel hợp sườn nướng, bò kho; Pilsner hợp đồ chiên, món cay. Tóm tắt theo từng dòng, kèm 7 món Việt nên thử.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  const faqs = [
    { question: 'Uống bia Đức ở nhiệt độ nào?', answer: 'Weissbier 7 - 9 °C, Dunkel 8 - 10 °C, Pilsner 4 - 6 °C. Dunkel lạnh quá thì mất mùi caramel. Bia lúa mì nên rót ly Weizen cao để giữ bọt và hương.' },
    { question: 'Ăn cay thì chọn bia nào?', answer: 'Pilsner. Bia đắng, khô, uống lạnh nên dịu bớt vị cay và cắt vị dầu của món chiên.' },
    { question: 'Bia lúa mì khác bia thường thế nào?', answer: 'Bia lúa mì (Weissbier) dùng nhiều mạch nha lúa mì, lên men nổi và thường không lọc (Naturtrüb). Bia đục tự nhiên, bọt dày, có mùi chuối chín và đinh hương.' },
  ];

  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Đức ăn với món gì', slug: 'food-pairing-bia-duc', url: 'https://www.biathaytu.com.vn/food-pairing-bia-duc', description: 'Chọn bia Đức theo món: Weissbier, Dunkel, Pilsner.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="faq" data={getFaqSchema(faqs)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: '/food-pairing-bia-duc', label: 'Bia Đức và món ăn' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Món ăn kèm',
          title: 'Bia Đức ăn với gì',
          kicker: 'Ba dòng bia, ba nhóm món',
          lead: 'Món thanh thì bia lúa mì, món nướng đậm thì Dunkel, đồ chiên và món cay thì Pilsner.',
        }}
        after={<FaqSection items={faqs} />}
      >
        <Summary>
          <p><strong>Chọn bia theo món:</strong> Một ly bia hợp món làm bớt ngấy, làm rõ vị ngọt của hải sản hoặc đi cùng vị đậm của thịt nướng. Bảy cặp món Việt cụ thể, kèm mẹo ăn uống, có trong bài <Link href="/kien-thuc/top-7-mon-viet-ket-hop-bia-duc-food-pairing">7 món Việt hợp với bia Đức</Link>.</p>
        </Summary>

        <h2>1. Bia lúa mì (Weissbier)</h2>
        <p><strong>Vị:</strong> Ngọt dịu, ít đắng, mùi chuối chín và đinh hương. Nhiều ga nên miệng nhẹ sau mỗi miếng ăn.</p>
        <InfoGrid
          items={[
            { title: 'Hải sản', text: 'Tôm hấp, nghêu sò hấp sả, mực nướng. Bia nhẹ nên không lấn vị ngọt của hải sản.' },
            { title: 'Gà và món chua', text: 'Gà nướng mật ong, salad chua ngọt, nem chua.' },
            { title: 'Món Việt', text: 'Phở gà: Nước dùng thanh, bia nhẹ, không bên nào lấn bên nào.' },
          ]}
        />

        <h2>2. Bia lúa mì đen (Dunkelweizen)</h2>
        <p><strong>Vị:</strong> Mạch nha rang, caramel, bánh mì nướng. Độ đắng thấp, hậu vị êm.</p>
        <InfoGrid
          items={[
            { title: 'Đồ nướng', text: 'Sườn heo nướng, xúc xích Đức nướng than, bít tết bò. Mùi rang của bia đi cùng mùi khói than.' },
            { title: 'Món hầm', text: 'Bò kho, thịt lợn hầm. Vị caramel của bia làm dịu vị mặn.' },
            { title: 'Tráng miệng', text: 'Chocolate đen, tiramisu, brownie.' },
          ]}
        />

        <h2>3. Pilsner (bia vàng)</h2>
        <p><strong>Vị:</strong> Vàng sáng, trong. Đắng hoa bia rõ, hậu vị khô.</p>
        <InfoGrid
          items={[
            { title: 'Đồ chiên', text: 'Gà rán, mực chiên xù, khoai tây chiên. Vị đắng và độ lạnh cắt bớt ngấy dầu.' },
            { title: 'Đồ nhắm mặn, cay', text: 'Khô bò, lạc rang muối, pizza cay.' },
            { title: 'Món vỉa hè', text: 'Xiên nướng, ốc xào.' },
          ]}
        />

        <CtaBand
          title="Chọn bia cho bữa tiệc"
          text="Đã có thực đơn thì xem chai nào hợp, kèm quy cách và giá bán lẻ."
          action={{ href: '/san-pham', label: 'Xem các dòng bia' }}
        />
      </EditorialPage>
    </>
  );
}
