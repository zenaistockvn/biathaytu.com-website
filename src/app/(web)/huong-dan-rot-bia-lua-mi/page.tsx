import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import EditorialPage, { CtaBand, StepList, Summary } from '../components/EditorialPage';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Rót Bia Lúa Mì Đức (Weissbier) Chuẩn Xác',
  description: 'Học cách rót bia lúa mì Benediktiner Weissbier để có lớp bọt hoàn hảo 3 ngón tay và đánh thức men sống Naturtrüb dưới đáy chai.',
  alternates: { canonical: 'https://www.biathaytu.com/huong-dan-rot-bia-lua-mi' },
  openGraph: {
    title: 'Hướng Dẫn Rót Bia Lúa Mì Đức (Weissbier) Chuẩn Xác',
    description: 'Học cách rót bia lúa mì Benediktiner Weissbier để có lớp bọt hoàn hảo 3 ngón tay và đánh thức men sống Naturtrüb dưới đáy chai.',
    type: 'article',
    url: 'https://www.biathaytu.com/huong-dan-rot-bia-lua-mi',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Hướng Dẫn Rót Bia Lúa Mì Đức (Weissbier) Chuẩn Xác',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hướng Dẫn Rót Bia Lúa Mì Đức (Weissbier) Chuẩn Xác',
    description: 'Học cách rót bia lúa mì Benediktiner Weissbier để có lớp bọt hoàn hảo 3 ngón tay và đánh thức men sống Naturtrüb dưới đáy chai.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd type="article" data={getArticleSchema({ title: 'Hướng Dẫn Rót Bia Lúa Mì', slug: 'huong-dan-rot-bia-lua-mi', url: 'https://www.biathaytu.com/huong-dan-rot-bia-lua-mi', description: 'Nghệ thuật rót bia Weissbier chuẩn Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Hướng Dẫn Rót Bia', url: 'https://www.biathaytu.com/huong-dan-rot-bia-lua-mi' }])} />

      <EditorialPage
        hero={{
          eyebrow: 'Nghệ thuật thưởng thức',
          title: 'Cách rót bia lúa mì',
          kicker: 'Chuẩn Bavaria, bốn bước',
          lead: 'Rót bia Weissbier không đơn giản là đổ ra ly. Đó là một nghi thức đánh thức hương vị men sống.',
          image: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Ly Weizen và chai Benediktiner Weissbier trên bàn gỗ', position: '70% center' },
        }}
      >
        <Summary>
          <p><strong>Tại sao phải rót đúng cách?</strong> Bia lúa mì không lọc (Naturtrüb) như Benediktiner chứa lớp men sống lắng dưới đáy chai. Nếu rót như bia thường, bạn sẽ bỏ lỡ phần tinh túy nhất của hương vị và mất đi lớp bọt đặc trưng của bia Đức.</p>
        </Summary>

        <h2>Nghi thức bốn bước</h2>
        <StepList
          steps={[
            { title: 'Chuẩn bị ly Weizen, tráng nước lạnh', text: <>Dùng ly Weizen đặc trưng (dáng cao, chân thuôn, miệng loe) để có không gian cho lớp bọt. <strong>Quan trọng:</strong> tráng ly qua nước lạnh trước khi rót; lớp nước đọng trên thành ly giảm ma sát, giúp bọt không trào quá nhanh.</> },
            { title: 'Rót 3/4 chai, nghiêng 45 độ', text: 'Nghiêng ly 45 độ, đưa miệng chai sát thành ly. Rót từ từ, đều đặn theo thành ly đến khi hết khoảng 3/4 chai (hoặc lon) thì dừng.' },
            { title: 'Đánh thức men sống', text: <>Với 1/4 lượng bia còn lại, <strong>lắc xoay tròn</strong> đáy chai vài lần để hòa tan lớp men sống bám ở đáy vào bia.</> },
            { title: 'Tạo lớp bọt vương miện', text: 'Dựng thẳng ly, rót phần bia đã hòa men còn lại vào giữa ly. Lớp bọt trắng sẽ dâng lên nhô cao khỏi miệng ly, thơm mùi chuối chín.' },
          ]}
        />

        <CtaBand
          title="Sẵn sàng thực hành?"
          text="Để rót được ly bia đẹp, bạn cần đúng loại bia lúa mì."
          action={{ href: '/benediktiner-weissbier-naturtrub', label: 'Weissbier Naturtrüb' }}
          secondary={{ href: '/san-pham', label: 'Xem tất cả sản phẩm' }}
        />
      </EditorialPage>
    </>
  );
}
