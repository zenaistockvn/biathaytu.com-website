import { Metadata } from 'next';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Mua Bia Benediktiner Chính Hãng — Giao Hàng Toàn Quốc',
  description: 'Đặt mua bia Benediktiner Weissbier, Dunkel, Bom 5L chính hãng nhập khẩu từ Đức. Miễn phí giao nội thành Hà Nội. Hotline 0899.191.313.',
  alternates: { canonical: 'https://www.biathaytu.com/mua-bia-benediktiner-chinh-hang' },
  openGraph: {
    title: 'Mua Bia Benediktiner Chính Hãng — Giao Hàng Toàn Quốc',
    description: 'Đặt mua bia Benediktiner Weissbier, Dunkel, Bom 5L chính hãng nhập khẩu từ Đức. Miễn phí giao nội thành Hà Nội. Hotline 0899.191.313.',
    type: 'article',
    url: 'https://www.biathaytu.com/mua-bia-benediktiner-chinh-hang',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Mua Bia Benediktiner Chính Hãng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mua Bia Benediktiner Chính Hãng — Giao Hàng Toàn Quốc',
    description: 'Đặt mua bia Benediktiner Weissbier, Dunkel, Bom 5L chính hãng nhập khẩu từ Đức. Miễn phí giao nội thành Hà Nội. Hotline 0899.191.313.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default function Page() {
  const prices = [
    { name: 'Benediktiner Weissbier Naturtrüb', specs: 'Két 24 lon 500ml', price: '1.550.000đ' },
    { name: 'Benediktiner Weissbier Naturtrüb', specs: 'Thùng 12 chai 500ml', price: '1.090.000đ' },
    { name: 'Benediktiner Weissbier Naturtrüb', specs: 'Thùng 12 lon 500ml', price: '790.000đ' },
    { name: 'Benediktiner Dunkel', specs: 'Két 24 lon 500ml', price: '1.550.000đ' },
    { name: 'Benediktiner Dunkel', specs: 'Thùng 12 chai 500ml', price: '1.090.000đ' },
    { name: 'Bom 5L Benediktiner', specs: 'Weissbier', price: '990.000đ' },
    { name: 'Thùng Mix 2 Vị', specs: '6 Naturtrüb + 6 Dunkel', price: '1.090.000đ' },
    { name: 'Bitburger Premium Pils', specs: 'Két 24 lon 330ml', price: '850.000đ' },
    { name: 'Bitburger Premium Pils', specs: 'Két 24 lon 500ml', price: '1.150.000đ' },
  ];

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Mua Bia Benediktiner Chính Hãng', slug: 'mua-bia-benediktiner-chinh-hang', url: 'https://www.biathaytu.com/mua-bia-benediktiner-chinh-hang', description: 'Bảng giá và cách đặt mua bia Benediktiner chính hãng.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Mua Bia Benediktiner', url: 'https://www.biathaytu.com/mua-bia-benediktiner-chinh-hang' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Đặt Hàng Chính Hãng</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Mua Bia Benediktiner Chính Hãng</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>100% nhập khẩu nguyên chai từ Đức. Miễn phí giao nội thành Hà Nội trong 4 giờ.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Mua bia Benediktiner ở đâu?</strong> Đặt mua trực tiếp tại website biathaytu.com, qua Zalo 0899.191.313, hoặc ghé Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội. Giao hàng toàn quốc — miễn phí nội thành Hà Nội.
        </div>

        <p style={{ marginTop: '12px', marginBottom: '24px' }}>Chưa rõ Benediktiner chính hãng là gì? Đọc <a href="/bia-benediktiner-chinh-hang" style={{ color: 'var(--web-gold-dark)', fontWeight: 600 }}>cách nhận biết bia Benediktiner chính hãng →</a></p>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Bảng Giá Bia Benediktiner 2026</h2>
        <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead>
              <tr style={{ background: 'var(--web-navy)', color: '#fff' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600 }}>Sản phẩm</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600 }}>Quy cách</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600 }}>Giá</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--web-border)', background: i % 2 === 0 ? '#fff' : 'var(--web-bg-section)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--web-navy)' }}>{item.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--web-text-muted)' }}>{item.specs}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--web-gold-dark)' }}>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Chính sách giao hàng</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { icon: '🚚', title: 'Nội thành Hà Nội', desc: 'Miễn phí, giao nhanh trong 4 giờ.' },
            { icon: '📦', title: 'Ngoại thành & tỉnh', desc: '30.000đ/thùng, nhận hàng sau 2-3 ngày.' },
            { icon: '💳', title: 'Thanh toán', desc: 'COD (nhận hàng trả tiền) hoặc chuyển khoản.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--web-text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '32px', background: 'var(--web-navy)', borderRadius: '16px', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Đặt hàng ngay</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '15px' }}>Nhắn Zalo hoặc gọi Hotline để được tư vấn và đặt hàng nhanh nhất.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://zalo.me/0899191313" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Nhắn Zalo 0899.191.313</a>
            <a href="tel:0899191313" style={{ display: 'inline-block', padding: '14px 32px', border: '2px solid var(--web-gold)', color: 'var(--web-gold)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Gọi Hotline</a>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Mua bia Benediktiner chính hãng:</strong> biathaytu.com · Zalo 0899.191.313 · Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội.</p>
            <p><strong>Giá tham khảo:</strong> Két 24 lon 500ml từ 1.150.000đ — 1.550.000đ. Thùng 12 chai từ 1.090.000đ. Bom 5L: 990.000đ.</p>
            <p><strong>Giao hàng:</strong> Miễn phí nội thành Hà Nội (4h). Toàn quốc 30.000đ/thùng (2-3 ngày).</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
