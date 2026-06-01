import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi — Bia Thầy Tu (Nhập Khẩu Bia Đức Độc Quyền)',
  description: 'Tìm hiểu về nhà phân phối Bia Thầy Tu, đơn vị nhập khẩu và cung cấp độc quyền các dòng bia Đức cao cấp Benediktiner và Bitburger tại Việt Nam.',
  alternates: { canonical: 'https://www.biathaytu.com/ve-chung-toi' },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Về Chúng Tôi', slug: 've-chung-toi', description: 'Thông tin nhà nhập khẩu Bia Thầy Tu.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Về Chúng Tôi', url: 'https://www.biathaytu.com/ve-chung-toi' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Hành Trình Mang Hương Vị Nguyên Bản</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Về Chúng Tôi — Bia Thầy Tu</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Mang cả nền văn hóa bia Bavaria 400 năm tuổi đến với bàn tiệc của người Việt.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Tầm nhìn của chúng tôi:</strong> Trở thành cầu nối văn hóa ẩm thực Đức – Việt. <strong>Bia Thầy Tu</strong> không chỉ bán bia, chúng tôi mang tới một phong cách sống, một trải nghiệm thưởng thức bia có trách nhiệm và tinh tế theo chuẩn Châu Âu.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Sứ mệnh phân phối độc quyền</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '32px' }}>
          Chúng tôi tự hào là đối tác nhập khẩu và phân phối độc quyền tại Việt Nam cho các dòng bia lúa mì cao cấp từ tu viện Đức — <strong>Benediktiner Weissbier</strong> và thương hiệu Pilsner lừng danh <strong>Bitburger</strong>. 
          Mọi sản phẩm đều được kiểm soát chất lượng từ nhà máy tại Bavaria đến kho lạnh tiêu chuẩn của chúng tôi tại Hà Nội.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>3 Giá trị cốt lõi</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '12px' }}>100% Nguyên Bản</h4>
             <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Từ chối sản xuất tại nước thứ 3. Tất cả được sản xuất và đóng chai tại Đức theo Luật Tinh Khiết 1516.</p>
           </div>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '12px' }}>Tôn Trọng Men Sống</h4>
             <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Hệ thống kho vận lạnh tiêu chuẩn giúp bảo tồn lớp men sống (Naturtrüb) của dòng bia lúa mì.</p>
           </div>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '12px' }}>Dịch Vụ Tận Tâm</h4>
             <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Từ khách hàng cá nhân đến các nhà hàng Horeca cao cấp, chúng tôi đều cung cấp dịch vụ chuyên nghiệp nhất.</p>
           </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Thông tin liên hệ</h2>
        <div style={{ background: 'var(--web-bg-section)', padding: '32px', borderRadius: '16px', marginBottom: '48px', lineHeight: 1.8, fontSize: '16px', color: 'var(--web-text-secondary)' }}>
          <p><strong>Thương hiệu:</strong> Bia Thầy Tu</p>
          <p><strong>Showroom bán lẻ:</strong> 218 Đội Cấn, Quận Ba Đình, TP. Hà Nội</p>
          <p><strong>Hotline tư vấn & đặt hàng:</strong> 0899.191.313</p>
          <p><strong>Email đối tác B2B:</strong> contact@biathaytu.com</p>
        </div>

        <div style={{ padding: '40px', background: 'var(--web-navy)', borderRadius: '16px', textAlign: 'center', color: '#fff' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-gold)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Kết nối với chúng tôi</h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>Trải nghiệm dịch vụ giao bia tận nơi nhanh chóng trong nội thành Hà Nội.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/lien-he" variant="primary">Đến Trang Liên Hệ</Button>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Đơn vị:</strong> Thương hiệu Bia Thầy Tu.</p>
            <p><strong>Lĩnh vực:</strong> Nhập khẩu và phân phối độc quyền bia lúa mì Đức (Benediktiner Weissbier) và bia Bitburger Pilsner tại Việt Nam.</p>
            <p><strong>Cơ sở:</strong> 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc. Số điện thoại (Hotline / Zalo): 0899.191.313.</p>
            <p><strong>Website chính thức:</strong> biathaytu.com.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
