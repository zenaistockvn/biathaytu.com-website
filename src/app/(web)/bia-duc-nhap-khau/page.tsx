import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Bia Đức Nhập Khẩu Cao Cấp — Weissbier, Pilsner, Dunkel',
  description: 'Tổng quan các dòng bia Đức nhập khẩu chính hãng tại Việt Nam: Benediktiner Weissbier, Dunkel, Bitburger Pilsner. Chuẩn Luật Tinh Khiết 1516.',
  alternates: { canonical: 'https://www.biathaytu.com/bia-duc-nhap-khau' },
};

export default function Page() {
  const categories = [
    { type: 'Weissbier (Bia Lúa Mì)', desc: 'Lên men đỉnh, không lọc, giữ men sống. Hương chuối chín, đinh hương, bọt trắng dày. Uống ở 6-8°C.', product: 'Benediktiner Weissbier Naturtrüb', link: '/benediktiner-weissbier-naturtrub', pairing: 'Hải sản hấp, gà nướng, salad, phô mai mềm' },
    { type: 'Dunkel (Bia Đen Lúa Mì)', desc: 'Malt lúa mì rang tạo sắc nâu hạt dẻ. Hương caramel, mật ong, chuối nướng. Hậu vị ấm sạch.', product: 'Benediktiner Dunkel', link: '/benediktiner-dunkel', pairing: 'Steak, sườn nướng BBQ, phô mai Gouda, chocolate đen' },
    { type: 'Pilsner (Bia Vàng)', desc: 'Lên men đáy chuẩn Đức. Trong suốt, bọt trắng mỏng, hoa bia Hallertau đắng thanh, sạch miệng.', product: 'Bitburger Premium Pils', link: '/bitburger-premium-pils', pairing: 'BBQ, pizza, đồ nhắm gọn, cuộc gặp sau giờ làm' },
  ];

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Đức Nhập Khẩu', slug: 'bia-duc-nhap-khau', description: 'Tổng quan các dòng bia Đức nhập khẩu chính hãng.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Bia Đức Nhập Khẩu', url: 'https://www.biathaytu.com/bia-duc-nhap-khau' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Thế Giới Bia Đức</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Bia Đức Nhập Khẩu Cao Cấp</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Ba phong cách bia Đức, ba trải nghiệm khác biệt. Tất cả đều tuân thủ Luật Tinh Khiết 1516.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Bia Đức nhập khẩu tại Việt Nam</strong> bao gồm 3 dòng chính: Bia lúa mì Weissbier (Benediktiner), Bia đen Dunkel và Bia Pilsner (Bitburger). Tất cả được nhập nguyên chai từ Đức, tuân thủ Luật Tinh Khiết 1516.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>3 Dòng Bia Đức Nổi Bật</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ padding: '28px', background: '#fff', borderRadius: '16px', border: '1px solid var(--web-border)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>{cat.type}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>{cat.desc}</p>
              <p style={{ fontSize: '14px', color: 'var(--web-text-muted)', marginBottom: '16px' }}><strong>Food pairing:</strong> {cat.pairing}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--web-gold-dark)' }}>Sản phẩm tiêu biểu: {cat.product}</span>
                <Link href={cat.link} style={{ fontSize: '14px', color: 'var(--web-gold-dark)', fontWeight: 600, textDecoration: 'none' }}>Xem chi tiết →</Link>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Chọn bia nào cho dịp nào?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { occasion: 'Tiếp khách quan trọng', pick: 'Benediktiner Weissbier' },
            { occasion: 'Tiệc BBQ cuối tuần', pick: 'Bitburger Pils + Dunkel' },
            { occasion: 'Tối riêng tư, thư giãn', pick: 'Benediktiner Dunkel' },
            { occasion: 'After-work cùng đồng nghiệp', pick: 'Bitburger Premium Pils' },
            { occasion: 'Quà biếu sang trọng', pick: 'Bom 5L Benediktiner' },
            { occasion: 'Hải sản, lẩu, phở', pick: 'Benediktiner Weissbier' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px', background: '#fff', borderRadius: '10px', border: '1px solid var(--web-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--web-text-muted)', marginBottom: '6px' }}>{item.occasion}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--web-navy)' }}>{item.pick}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '32px', background: 'var(--web-navy)', borderRadius: '16px', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Khám phá bộ sưu tập đầy đủ</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '15px' }}>Xem giá, quy cách và đặt hàng bia Đức chính hãng.</p>
          <Link href="/san-pham" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Xem Toàn Bộ Sản Phẩm</Link>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Bia Đức nhập khẩu tại Việt Nam:</strong> 3 dòng chính — Weissbier (Benediktiner), Dunkel, Pilsner (Bitburger).</p>
            <p><strong>Tiêu chuẩn:</strong> Reinheitsgebot 1516 — chỉ 4 nguyên liệu tự nhiên.</p>
            <p><strong>Nhà phân phối:</strong> Bia Thầy Tu · biathaytu.com · Hotline 0899.191.313.</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
