import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Bảng Giá Sỉ & Chính Sách Đại Lý Phân Phối Bia Đức',
  description: 'Mở đại lý phân phối bia Đức Benediktiner, Bitburger nhập khẩu. Chính sách chiết khấu sỉ cao, hỗ trợ marketing, giao hàng toàn quốc. Đăng ký ngay!',
  alternates: { canonical: 'https://www.biathaytu.com/bang-gia-si-dai-ly' },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Chính Sách Đại Lý & Giá Sỉ Bia Đức', slug: 'bang-gia-si-dai-ly', description: 'Chính sách phân phối cho đại lý.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Đại Lý Phân Phối', url: 'https://www.biathaytu.com/bang-gia-si-dai-ly' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Hợp Tác Kinh Doanh</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Chính Sách Đại Lý <br/>& Báo Giá Sỉ Bia Đức</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Kinh doanh sản phẩm bia nhập khẩu cao cấp với lợi nhuận hấp dẫn cùng nhà phân phối độc quyền Bia Thầy Tu.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Chào mừng các đối tác:</strong> Chúng tôi tìm kiếm đại lý phân phối, siêu thị mini, cửa hàng đồ uống nhập khẩu, và các CTV bán sỉ trên toàn quốc cho 2 nhãn hiệu bia Đức: Benediktiner Weissbier và Bitburger Premium Pils.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Quyền lợi khi trở thành Đại Lý</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { icon: '💰', title: 'Mức chiết khấu hấp dẫn', desc: 'Lợi nhuận gộp lên đến 20-35% tùy theo mốc sản lượng cam kết hàng tháng (Tier 1, Tier 2, Tier 3).' },
            { icon: '🛡️', title: 'Bảo vệ giá & Khu vực', desc: 'Chính sách quản lý giá bán lẻ nghiêm ngặt (MAP) giúp đại lý không bị phá giá, bảo vệ lợi ích kinh doanh lâu dài.' },
            { icon: '📣', title: 'Hỗ trợ Marketing/POSM', desc: 'Được cấp phát ấn phẩm truyền thông (ảnh/video HD), ly bia chuyên dụng, đế lót ly, standee trưng bày.' },
            { icon: '🚚', title: 'Logistic chuyên nghiệp', desc: 'Kho bãi tiêu chuẩn tại Hà Nội. Hỗ trợ phí vận chuyển cho các đơn hàng sỉ ra các tỉnh thành, giao hàng nhanh chóng.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Danh mục sản phẩm áp dụng giá sỉ</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', display: 'grid', gap: '16px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Benediktiner Weissbier Naturtrüb:</strong> Lon 500ml, Chai 500ml.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Benediktiner Dunkel:</strong> Lon 500ml, Chai 500ml.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Bom 5 Lít Benediktiner:</strong> Phân khúc quà tặng, lễ Tết.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Bitburger Premium Pils:</strong> Lon 330ml, Lon 500ml.</div></li>
        </ul>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Đăng ký nhận Bảng Giá Sỉ</h3>
          <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', marginBottom: '24px' }}>Để nhận file PDF Báo giá sỉ chi tiết và Chính sách chiết khấu, vui lòng liên hệ trực tiếp Giám Đốc Kinh Doanh:</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://zalo.me/0899191313" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-navy)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Nhắn Zalo Nhận Bảng Giá</a>
            <a href="tel:0899191313" style={{ display: 'inline-block', padding: '14px 32px', border: '2px solid var(--web-navy)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Hotline: 0899.191.313</a>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Cung cấp giá sỉ bia Đức:</strong> Phân phối sỉ, đại lý nhượng quyền thương hiệu bia Benediktiner và Bitburger toàn quốc.</p>
            <p><strong>Quyền lợi đại lý:</strong> Mức chiết khấu cao, hỗ trợ POSM, bảo vệ giá (MAP), có hóa đơn VAT hợp pháp, hỗ trợ vận chuyển.</p>
            <p><strong>Liên hệ mở đại lý:</strong> biathaytu.com · Hotline/Zalo 0899.191.313.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
