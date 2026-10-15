import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, InfoGrid, StepList, Summary } from '../components/EditorialPage';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Cách rót bia lúa mì Weissbier và chọn ly Weizen',
  description: 'Bốn bước rót Benediktiner Weissbier cho lớp bọt dày khoảng 3 ngón tay và rót được cả lớp men dưới đáy chai, kèm lý do bia lúa mì cần ly Weizen.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/huong-dan-rot-bia-lua-mi' },
  openGraph: {
    title: 'Cách rót bia lúa mì Weissbier và chọn ly Weizen',
    description: 'Bốn bước rót Benediktiner Weissbier cho lớp bọt dày khoảng 3 ngón tay và rót được cả lớp men dưới đáy chai, kèm lý do bia lúa mì cần ly Weizen.',
    type: 'article',
    url: 'https://www.biathaytu.com.vn/huong-dan-rot-bia-lua-mi',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Ly Weizen và chai Benediktiner Weissbier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cách rót bia lúa mì Weissbier và chọn ly Weizen',
    description: 'Bốn bước rót Benediktiner Weissbier cho lớp bọt dày khoảng 3 ngón tay và rót được cả lớp men dưới đáy chai, kèm lý do bia lúa mì cần ly Weizen.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Hướng dẫn rót bia lúa mì', slug: 'huong-dan-rot-bia-lua-mi', url: 'https://www.biathaytu.com.vn/huong-dan-rot-bia-lua-mi', description: 'Bốn bước rót bia lúa mì Weissbier và cách chọn ly Weizen.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail({ href: NAV.enjoy.href, label: 'Hướng dẫn rót bia' }))} />

      <EditorialPage
        hero={{
          eyebrow: 'Rót bia',
          title: 'Cách rót bia lúa mì',
          kicker: 'Bốn bước và một chiếc ly',
          lead: 'Rót Weissbier đúng cách thì bọt dày, bia đục đều và hương chuối chín rõ hơn. Có bốn bước.',
          image: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Ly Weizen và chai Benediktiner Weissbier trên bàn gỗ', position: '70% center' },
        }}
      >
        <Summary>
          <p><strong>Vì sao phải rót đúng cách?</strong> Bia lúa mì không lọc (Naturtrüb) như Benediktiner còn lớp men lắng dưới đáy chai. Rót như bia thường thì phần men ở lại trong chai: Bia kém đục, hương kém rõ và lớp bọt mỏng hơn.</p>
        </Summary>

        <h2>Bốn bước</h2>
        <StepList
          steps={[
            { title: 'Chuẩn bị ly Weizen, tráng nước lạnh', text: <>Dùng ly Weizen (xem mục bên dưới) để có chỗ cho lớp bọt. <strong>Quan trọng:</strong> Tráng ly qua nước lạnh trước khi rót. Lớp nước đọng trên thành ly giảm ma sát, bọt không trào quá nhanh.</> },
            { title: 'Rót 3/4 chai, nghiêng 45 độ', text: 'Nghiêng ly 45 độ, đưa miệng chai sát thành ly. Rót từ từ, đều tay theo thành ly đến khi hết khoảng 3/4 chai (hoặc lon) thì dừng.' },
            { title: 'Hòa lớp men đáy chai', text: <>Với 1/4 lượng bia còn lại, <strong>xoay tròn</strong> đáy chai vài lần cho lớp men bám ở đáy tan vào bia.</> },
            { title: 'Phủ lớp bọt', text: 'Dựng thẳng ly, rót phần bia đã hòa men còn lại vào giữa ly. Lớp bọt trắng dâng lên cao khỏi miệng ly, thơm mùi chuối chín.' },
          ]}
        />

        <h2>Vì sao phải là ly Weizen?</h2>
        <p>Bia lúa mì có nhiều protein nên ra nhiều bọt. Ly Weizen thon ở giữa, phình ở trên, chân dày, và mỗi phần có việc của nó.</p>
        <InfoGrid
          items={[
            { title: 'Phần thon giữa', text: 'Làm bọt dâng chậm lại, nén thành lớp bọt dày và mịn hơn.' },
            { title: 'Phần phình trên', text: 'Giữ mùi chuối chín và đinh hương lại ở miệng ly, ngay chỗ mũi đặt vào khi uống.' },
            { title: 'Chân dày, nặng', text: 'Ly cao khoảng 23 - 25cm nên dễ đổ. Chân nặng hạ trọng tâm, ly đứng vững trên bàn.' },
          ]}
        />
        <p>Ly Weizen chuẩn ghi 500ml nhưng chứa được khoảng 600 - 650ml. Phần dư đó là chỗ cho bọt. Rót Weissbier vào ly Pilsner thẳng thành thì bọt trào nhanh rồi tan nhanh. Cốc thường không giữ được bọt, mùi cũng tản đi.</p>
        <p>Bên mình có <Link href="/san-pham/bo-6-coc-benediktiner-chinh-hang-500ml">bộ 6 cốc Benediktiner 500ml</Link> dáng Weizen, in logo hãng.</p>

        <CtaBand
          title="Chai để tập rót"
          text="Bốn bước trên viết cho bia lúa mì không lọc như Benediktiner Naturtrüb."
          action={{ href: '/benediktiner-weissbier-naturtrub', label: 'Weissbier Naturtrüb' }}
          secondary={{ href: '/san-pham', label: 'Xem tất cả sản phẩm' }}
        />
      </EditorialPage>
    </>
  );
}
