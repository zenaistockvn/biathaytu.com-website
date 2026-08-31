import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';

export const metadata: Metadata = {
  title: 'Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)',
  description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
  alternates: { canonical: 'https://www.biathaytu.com/bia-duc-cho-nha-hang-khach-san' },
  openGraph: {
    title: 'Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)',
    description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
    type: 'article',
    url: 'https://www.biathaytu.com/bia-duc-cho-nha-hang-khach-san',
    images: [
      {
        url: '/images/facebook/cover_tiep_khach_v2_1775560932251.png',
        width: 1200,
        height: 630,
        alt: 'Giải Pháp Cung Cấp Bia Đức Cho Nhà Hàng Khách Sạn (Horeca)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Đức Cho Nhà Hàng, Khách Sạn (Horeca)',
    description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
    images: ['/images/facebook/cover_tiep_khach_v2_1775560932251.png'],
  },
};

export default function Page() {
  const telHref = getCompanyTelHref() ?? '/lien-he';
  const zaloUrl = getCompanyZaloUrl() ?? '/lien-he';

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Giải pháp Bia Đức cho Horeca', slug: 'bia-duc-cho-nha-hang-khach-san', url: 'https://www.biathaytu.com/bia-duc-cho-nha-hang-khach-san', description: 'Cung cấp bia Đức sỉ cho nhà hàng khách sạn.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Bia Đức Cho Nhà Hàng Khách Sạn', url: 'https://www.biathaytu.com/bia-duc-cho-nha-hang-khach-san' }])} />

      <section data-surface="ink" style={{ padding: '120px 0 60px', background: 'var(--web-ink)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-accent-on-ink)', textTransform: 'uppercase', marginBottom: '20px' }}>B2B Doanh Nghiệp & Horeca</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Giải Pháp Bia Đức Toàn Diện Cho Nhà Hàng, Khách Sạn</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Nâng tầm menu đồ uống của bạn với các dòng bia Đức cao cấp từ đơn vị phân phối.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-accent)', color: 'var(--web-ink)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Lợi thế cạnh tranh:</strong> Menu đồ uống (Beverage Menu) chiếm đến 30% lợi nhuận của một nhà hàng cao cấp. Việc đưa các thương hiệu bia Đức lâu đời như Benediktiner hay Bitburger vào menu không chỉ tăng trải nghiệm Food Pairing mà còn định vị sự đẳng cấp cho không gian của bạn.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Tại sao nên chọn chúng tôi?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { title: 'Đối tác phân phối', desc: 'Nguồn hàng 100% nhập khẩu chính ngạch, hóa đơn VAT đầy đủ. Đảm bảo giá gốc không qua trung gian.' },
            { title: 'Chính sách chiết khấu sâu', desc: 'Mức chiết khấu thương mại linh hoạt dựa trên sản lượng cam kết, giúp tối ưu hóa lợi nhuận cho Horeca.' },
            { title: 'Hỗ trợ POSM trọn gói', desc: 'Cung cấp ly bia chuyên dụng (ly Weizen, ly Pilsner), đế lót ly (coaster), tháp bia, ô dù và các ấn phẩm menu.' },
            { title: 'Giao hàng hỏa tốc', desc: 'Đội ngũ xe tải lạnh riêng biệt, cam kết giao hàng trong 2-4 tiếng khu vực nội thành để không làm gián đoạn vận hành.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '28px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Dịch vụ tư vấn Food Pairing chuyên sâu</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '32px' }}>
           Chúng tôi không chỉ bán bia, chúng tôi cung cấp giải pháp. Chuyên gia của Bia Thầy Tu sẽ làm việc trực tiếp với Bếp trưởng/Quản lý nhà hàng của bạn để thiết kế <Link href="/food-pairing-bia-duc" style={{ color: 'var(--web-accent-strong)', fontWeight: 600 }}>gợi ý food pairing cho thực đơn</Link> phù hợp nhất:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', display: 'grid', gap: '16px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-accent)' }}></span> <div><strong>Thiết kế Menu Pairing:</strong> Ghép đôi hoàn hảo giữa món ăn đặc trưng của quán và bia (Vd: BBQ + Dunkel, Hải sản + Weissbier).</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-accent)' }}></span> <div><strong>Đào tạo nhân viên:</strong> Hướng dẫn nhân viên phục vụ cách rót bia lúa mì (quy tắc 7:3), nhiệt độ phục vụ chuẩn xác, cách giới thiệu câu chuyện bia cho thực khách.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-accent)' }}></span> <div><strong>Sự kiện trải nghiệm:</strong> Hỗ trợ tổ chức các buổi "Beer Tasting Night" để thu hút khách hàng mới cho quán.</div></li>
        </ul>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Nhận Báo Giá Sỉ & Chính Sách Horeca</h3>
          <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', marginBottom: '24px' }}>Để lại thông tin, chuyên viên tư vấn B2B của chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc. Xem chi tiết <Link href="/bang-gia-si-dai-ly" style={{ color: 'var(--web-ink)', fontWeight: 600, textDecoration: 'underline' }}>chính sách giá sỉ dành cho đại lý</Link>.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={zaloUrl} target={zaloUrl.startsWith('https://') ? '_blank' : undefined} rel={zaloUrl.startsWith('https://') ? 'noopener noreferrer' : undefined} style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-ink)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Chat Zalo B2B</a>
            <a href={telHref} style={{ display: 'inline-block', padding: '14px 32px', border: '2px solid var(--web-ink)', color: 'var(--web-ink)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Gọi Hotline Phụ Trách Horeca</a>
          </div>
        </div>
      </article>

    </div>
  );
}
