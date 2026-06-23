import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
  description: 'Minh bạch nguồn gốc xuất xứ Bia Thầy Tu Benediktiner. Đầy đủ giấy tờ hải quan, CO/CQ, Công bố chất lượng sản phẩm nhập khẩu nguyên chai từ Đức.',
  alternates: { canonical: 'https://www.biathaytu.com/chung-nhan-nhap-khau-chinh-hang' },
  openGraph: {
    title: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
    description: 'Minh bạch nguồn gốc xuất xứ Bia Thầy Tu Benediktiner. Đầy đủ giấy tờ hải quan, CO/CQ, Công bố chất lượng sản phẩm nhập khẩu nguyên chai từ Đức.',
    type: 'article',
    url: 'https://www.biathaytu.com/chung-nhan-nhap-khau-chinh-hang',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giấy Tờ Nhập Khẩu & Chứng Nhận Chất Lượng Bia Đức',
    description: 'Minh bạch nguồn gốc xuất xứ Bia Thầy Tu Benediktiner. Đầy đủ giấy tờ hải quan, CO/CQ, Công bố chất lượng sản phẩm nhập khẩu nguyên chai từ Đức.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chứng Nhận Nhập Khẩu Bia Đức', slug: 'chung-nhan-nhap-khau-chinh-hang', url: 'https://www.biathaytu.com/chung-nhan-nhap-khau-chinh-hang', description: 'Tính minh bạch và giấy tờ pháp lý nhập khẩu bia Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Chứng Nhận Nhập Khẩu', url: 'https://www.biathaytu.com/chung-nhan-nhap-khau-chinh-hang' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Minh Bạch & Uy Tín</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Chứng Nhận Chất Lượng <br/>& Nguồn Gốc Nhập Khẩu</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Khẳng định uy tín nhà phân phối qua sự minh bạch về pháp lý và nguồn gốc 100% nguyên bản từ Đức.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Cam kết cao nhất:</strong> "Không bán hàng xách tay trôi nổi, không bán hàng cận date." Toàn bộ sản phẩm Bia Thầy Tu Benediktiner và Bitburger được nhập khẩu chính ngạch (Official Import), hoàn thành nghĩa vụ thuế hải quan.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Tính Pháp Lý & Hồ sơ nhập khẩu</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
          Đối với khách hàng doanh nghiệp (B2B) và Horeca, tính hợp pháp của hàng hóa là ưu tiên số một. Mọi lô hàng bia Đức do chúng tôi phân phối đều đi kèm bộ hồ sơ hoàn chỉnh bao gồm:
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Tờ khai Hải quan</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Minh chứng lô hàng đã thông quan hợp pháp tại cảng Việt Nam.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Chứng nhận CO/CQ</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Giấy chứng nhận xuất xứ (Certificate of Origin) từ Đức và Chứng nhận chất lượng từ nhà máy sản xuất.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Bản Tự Công Bố</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Hồ sơ tự công bố chất lượng an toàn vệ sinh thực phẩm theo quy định Bộ Y tế.</p>
           </div>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Giải Thưởng Quốc Tế iTQi</h2>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center', background: 'var(--web-bg-section)', padding: '32px', borderRadius: '16px', marginBottom: '48px' }}>
          <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '64px' }}>🏆</span>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '12px' }}>Superior Taste Award (3 Sao)</h3>
            <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.7 }}>
              Năm 2022, Benediktiner Weissbier Naturtrüb tự hào nhận giải thưởng <strong>hương vị 3 sao (Mức cao nhất - Exceptional)</strong> từ Viện Hương vị Chất lượng Quốc tế (International Taste Institute - iTQi) tại Brussels, Bỉ. Giải thưởng được đánh giá mù (blind-tasting) bởi hội đồng 200 chuyên gia ẩm thực và sommelier hàng đầu thế giới.
            </p>
          </div>
        </div>

        <div style={{ padding: '40px', background: 'var(--web-navy)', borderRadius: '16px', textAlign: 'center', color: '#fff' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-gold)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Yên tâm nhập sỉ & kinh doanh</h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>Chúng tôi luôn đồng hành cùng nhà phân phối với sự bảo đảm tuyệt đối về mặt pháp lý.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/bang-gia-si-dai-ly" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Xem Chính Sách Đại Lý</Link>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Nguồn gốc bia Benediktiner:</strong> Nhập khẩu 100% nguyên chai chính ngạch từ nhà máy Benediktiner Weißbräu GmbH (Đức).</p>
            <p><strong>Pháp lý minh bạch:</strong> Có đầy đủ Tờ khai hải quan, Chứng nhận CO/CQ, Bản Tự công bố chất lượng VSATTP, và xuất hóa đơn VAT.</p>
            <p><strong>Giải thưởng thế giới:</strong> Benediktiner Weissbier đạt giải iTQi Superior Taste Award 3 Sao (Mức cao nhất) năm 2022 do Viện Hương vị Quốc tế Brussels trao tặng.</p>
            <p><strong>Đại diện cung cấp:</strong> Bia Thầy Tu · biathaytu.com · Hotline 0899.191.313.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
