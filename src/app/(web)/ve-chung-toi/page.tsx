import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { COMPANY_CONFIG } from '@/config/company';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi | Bia Thầy Tu',
  description: 'Tìm hiểu về Bia Thầy Tu, điểm kết nối câu chuyện Benediktiner, văn hoá bia Đức và nghệ thuật thưởng thức tại Việt Nam.',
  alternates: { canonical: 'https://www.biathaytu.com/ve-chung-toi' },
  openGraph: {
    title: 'Về Chúng Tôi | Bia Thầy Tu',
    description: 'Tìm hiểu về Bia Thầy Tu, điểm kết nối câu chuyện Benediktiner, văn hoá bia Đức và nghệ thuật thưởng thức tại Việt Nam.',
    type: 'article',
    url: 'https://www.biathaytu.com/ve-chung-toi',
    images: [
      {
        url: '/images/brand/benediktiner-official/ettal-monastery.jpg',
        width: 600,
        height: 400,
        alt: 'Tu viện Ettal, nơi khởi nguồn câu chuyện Benediktiner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Về Bia Thầy Tu',
    description: 'Tìm hiểu về Bia Thầy Tu, điểm kết nối câu chuyện Benediktiner, văn hoá bia Đức và nghệ thuật thưởng thức tại Việt Nam.',
    images: ['/images/brand/benediktiner-official/ettal-monastery.jpg'],
  },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Về Chúng Tôi', slug: 've-chung-toi', url: 'https://www.biathaytu.com/ve-chung-toi', description: 'Thông tin nhà nhập khẩu Bia Thầy Tu.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Về Chúng Tôi', url: 'https://www.biathaytu.com/ve-chung-toi' }])} />

      <section data-surface="ink" style={{ padding: '120px 0 60px', background: 'var(--web-ink)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-accent-on-ink)', textTransform: 'uppercase', marginBottom: '20px' }}>Hành Trình Mang Hương Vị Nguyên Bản</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Về Chúng Tôi | Bia Thầy Tu</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Mang cả nền văn hóa bia Bavaria 400 năm tuổi đến với bàn tiệc của người Việt.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-accent)', color: 'var(--web-ink)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Tầm nhìn của chúng tôi:</strong> Trở thành cầu nối văn hóa ẩm thực Đức – Việt. <strong>Bia Thầy Tu</strong> không chỉ bán bia, chúng tôi mang tới một phong cách sống, một trải nghiệm thưởng thức bia có trách nhiệm và tinh tế theo chuẩn Châu Âu.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Sứ mệnh phân phối</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '32px' }}>
          Bia Thầy Tu giới thiệu <strong>Benediktiner Weissbier</strong> và các lựa chọn bia Đức tới người thưởng thức tại Việt Nam.
          Website tập trung vào câu chuyện thương hiệu, đặc tính từng dòng bia, nghệ thuật rót bia và các giải pháp dành cho nhà hàng, khách sạn.
          Xem <Link href="/chung-nhan-nhap-khau-chinh-hang" style={{ color: 'var(--web-accent-strong)', fontWeight: 600 }}>thông tin nguồn gốc sản phẩm</Link> để tìm hiểu thêm.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>3 Giá trị cốt lõi</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '12px' }}>100% Nguyên Bản</h4>
             <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Từ chối sản xuất tại nước thứ 3. Tất cả được sản xuất và đóng chai tại Đức theo Luật Tinh Khiết 1516.</p>
           </div>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '12px' }}>Tôn Trọng Men Sống</h4>
             <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Hệ thống kho vận lạnh tiêu chuẩn giúp bảo tồn lớp men sống (Naturtrüb) của dòng bia lúa mì.</p>
           </div>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '12px' }}>Dịch Vụ Tận Tâm</h4>
             <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Từ khách hàng cá nhân đến các nhà hàng Horeca cao cấp, chúng tôi đều cung cấp dịch vụ chuyên nghiệp nhất.</p>
           </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Thông tin liên hệ</h2>
        <div style={{ background: 'var(--web-bg-section)', padding: '32px', borderRadius: '16px', marginBottom: '48px', lineHeight: 1.8, fontSize: '16px', color: 'var(--web-text-secondary)' }}>
          <p><strong>Thương hiệu:</strong> Bia Thầy Tu</p>
          <p><strong>Showroom:</strong> {COMPANY_CONFIG.showroomAddress}</p>
          <p><strong>Hotline tư vấn:</strong> {COMPANY_CONFIG.hotline}</p>
          <p><strong>Email:</strong> {COMPANY_CONFIG.email}</p>
        </div>

        <div data-surface="ink" style={{ padding: '40px', background: 'var(--web-ink)', borderRadius: '16px', textAlign: 'center', color: '#fff' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-accent-on-ink)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Kết nối với chúng tôi</h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>Ghé không gian tại Vạn Phúc để tìm hiểu các dòng bia đang được giới thiệu. Nếu bạn là đối tác kinh doanh, tham khảo <Link href="/bia-duc-cho-nha-hang-khach-san" style={{ color: 'var(--web-accent-on-ink)', textDecoration: 'underline' }}>giải pháp dành cho nhà hàng &amp; khách sạn</Link>.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/lien-he" variant="primary">Đến Trang Liên Hệ</Button>
          </div>
        </div>
      </article>

    </div>
  );
}
