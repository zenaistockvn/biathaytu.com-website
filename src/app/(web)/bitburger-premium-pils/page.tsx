import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Bitburger Premium Pils — Bia Pilsner Số 1 Nước Đức',
  description: 'Bia Bitburger Premium Pils chuẩn vị Pilsner Đức. Hương hoa bia Hallertau thanh mát, vị đắng dịu, hậu vị sạch miệng. Nhập khẩu 100% nguyên chai.',
  alternates: { canonical: 'https://www.biathaytu.com/bitburger-premium-pils' },
};

export default function Page() {
  const product = {
    name: 'Bitburger Premium Pils',
    slug: 'bitburger-premium-pils',
    description: 'Bia Pilsner tươi mát chuẩn Đức, lên men đáy với hoa bia hảo hạng.',
    abv: '4.8',
    volume: '330ml, 500ml',
  };

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="product" data={getProductSchema(product)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Bitburger Premium Pils', url: 'https://www.biathaytu.com/bitburger-premium-pils' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Đỉnh Cao Pilsner Đức</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Bitburger Premium Pils</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>"Bitte ein Bit" — Thưởng thức hương vị tươi mát sảng khoái đến từ loại bia tươi được yêu thích nhất nước Đức.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--web-border)', marginBottom: '48px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', background: 'var(--web-bg-section)', borderRadius: '12px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Placeholder for Bitburger image */}
             <span style={{ fontSize: '40px' }}>🍻</span>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Biểu tượng của bia lên men đáy</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '24px' }}>
              Khác với dòng bia lúa mì (Weissbier) lên men đỉnh, Bitburger Premium Pils là đại diện xuất sắc của dòng bia <strong>Pilsner lên men đáy</strong>. Đặc trưng lớn nhất của Bitburger là màu vàng óng ả trong suốt, bọt bia cực kỳ mềm mịn, và đặc biệt là sự hiện diện của hoa bia (hops) hảo hạng mang lại vị đắng thanh khiết và hậu vị "sạch miệng" vô song.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--web-text-muted)', display: 'block', marginBottom: '4px' }}>Độ Cồn (ABV)</span>
                <strong style={{ fontSize: '18px', color: 'var(--web-navy)' }}>4.8%</strong>
              </div>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--web-text-muted)', display: 'block', marginBottom: '4px' }}>Quy Cách</span>
                <strong style={{ fontSize: '18px', color: 'var(--web-navy)' }}>Lon 330ml / 500ml</strong>
              </div>
            </div>
            <Link href="/mua-bia-benediktiner-chinh-hang" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', width: '100%', textAlign: 'center' }}>Xem Giá & Đặt Hàng</Link>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Tasting Notes (Hương Vị)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { title: 'Thị giác (Màu sắc)', desc: 'Màu vàng rơm sáng trong suốt như pha lê. Lớp bọt trắng mỏng, mịn màng.' },
            { title: 'Khứu giác (Hương thơm)', desc: 'Hương hoa tươi mát và thảo mộc đặc trưng từ hoa bia Hallertau vùng Eifel.' },
            { title: 'Vị giác (Hương vị)', desc: 'Bắt đầu bằng vị ngọt nhẹ của mạch nha, sau đó nhường chỗ cho vị đắng thanh tao, tinh tế.' },
            { title: 'Hậu vị', desc: 'Rất khô, sạch miệng (crisp and clean) và vô cùng sảng khoái.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px', background: 'var(--web-bg-section)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--web-navy)', color: '#fff', padding: '40px', borderRadius: '16px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-gold)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Nghệ Thuật Thưởng Thức (Food Pairing)</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
            Nhiệt độ thưởng thức tốt nhất là rất lạnh, từ <strong>5 - 7°C</strong>. Đây là dòng bia "thanh tẩy vị giác" cực tốt.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Món Việt:</strong> Cực kỳ hợp với các món nhiều dầu mỡ như đồ chiên rán, lẩu, đồ nhắm mặn.</li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Món Tây:</strong> Pizza, pasta hải sản, salad chua ngọt, xúc xích Đức truyền thống.</li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Sau giờ làm:</strong> Phù hợp cho những buổi after-work cần giải khát nhanh chóng.</li>
          </ul>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Tên sản phẩm:</strong> Bitburger Premium Pils.</p>
            <p><strong>Đặc điểm:</strong> Bia Pilsner Đức (bia vàng lên men đáy), 4.8% ABV. Hương hoa bia tươi mát, vị đắng thanh khiết và hậu vị "sạch miệng" (crisp).</p>
            <p><strong>Food Pairing:</strong> Lý tưởng với đồ chiên rán, pizza, và các món nhậu truyền thống.</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
