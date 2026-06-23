import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
  description: 'Hộp quà tặng bia Đức sang trọng, đẳng cấp. Combo bia Benediktiner, Bitburger dành cho doanh nghiệp, đối tác dịp Lễ, Tết. Có xuất hóa đơn VAT.',
  alternates: { canonical: 'https://www.biathaytu.com/qua-tang-bia-duc' },
  openGraph: {
    title: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
    description: 'Hộp quà tặng bia Đức sang trọng, đẳng cấp. Combo bia Benediktiner, Bitburger dành cho doanh nghiệp, đối tác dịp Lễ, Tết. Có xuất hóa đơn VAT.',
    type: 'article',
    url: 'https://www.biathaytu.com/qua-tang-bia-duc',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quà Tặng Bia Đức Cao Cấp Dành Cho Doanh Nghiệp',
    description: 'Hộp quà tặng bia Đức sang trọng, đẳng cấp. Combo bia Benediktiner, Bitburger dành cho doanh nghiệp, đối tác dịp Lễ, Tết. Có xuất hóa đơn VAT.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Quà Tặng Bia Đức', slug: 'qua-tang-bia-duc', url: 'https://www.biathaytu.com/qua-tang-bia-duc', description: 'Giải pháp quà tặng bia Đức cho doanh nghiệp.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Quà Tặng Bia Đức', url: 'https://www.biathaytu.com/qua-tang-bia-duc' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Gói Quà Sang Trọng</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Quà Tặng Bia Đức Cao Cấp</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Khẳng định đẳng cấp doanh nghiệp với món quà chứa đựng 400 năm nghệ thuật ủ bia từ Bavaria.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Thay ngàn lời chúc thành công:</strong> Khác với vang hay các dòng rượu mạnh vốn đã quá phổ biến, Bia Đức nhập khẩu là một làn gió mới trong văn hóa tặng quà doanh nghiệp. Vừa sang trọng, độc đáo, lại dễ tiếp cận trong các bữa tiệc tri ân cuối năm. Xem toàn bộ <Link href="/san-pham" style={{ color: 'var(--web-navy)', fontWeight: 600, textDecoration: 'underline' }}>danh mục sản phẩm bia Đức</Link> của chúng tôi.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Các tùy chọn Quà Tặng Doanh Nghiệp</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { title: 'Hộp Quà Thượng Hạng Mix 2 Vị', desc: 'Thùng 12 chai/lon gồm 6 Weissbier (bia lúa mì) + 6 Dunkel (bia đen). Đóng gói hộp cứng cáp, quai xách sang trọng.', price: 'Từ 804.000đ', link: '/san-pham/benediktiner-mix-2-v-thng-12-chai-500ml' },
            { title: 'Bom Bia 5L Lễ Hội', desc: 'Thiết kế bom nhôm 5 Lít nguyên khối có vòi rót trực tiếp. Món quà hoàn hảo để đối tác sử dụng ngay trong các bữa tiệc tụ họp.', price: '963.000đ', link: '/san-pham/benediktiner-naturtrub-bom-5l' },
            { title: 'Set Quà Kèm Ly Pha Lê', desc: 'Combo 6 chai bia nhập khẩu kèm 1 ly Weizen tiêu chuẩn Đức. Nâng tầm nghệ thuật thưởng thức.', price: 'Liên hệ B2B' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '28px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{item.desc}</p>
              {item.link && <Link href={item.link} style={{ fontSize: '14px', color: 'var(--web-gold-dark)', fontWeight: 600 }}>Xem chi tiết sản phẩm →</Link>}
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--web-gold-dark)', marginTop: '8px' }}>{item.price}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Đặc quyền khách hàng Doanh nghiệp</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', display: 'grid', gap: '16px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Chiết khấu hấp dẫn:</strong> Chính sách giá ưu đãi cực tốt cho đơn hàng số lượng lớn dịp Lễ, Tết.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Hóa đơn VAT:</strong> Cung cấp đầy đủ chứng từ hợp lệ, CO/CQ, hóa đơn VAT theo yêu cầu doanh nghiệp.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Tùy biến quà tặng:</strong> Hỗ trợ in logo doanh nghiệp lên bao bì, thiệp chúc mừng thiết kế riêng theo nhận diện thương hiệu.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Giao hàng đa điểm:</strong> Hỗ trợ vận chuyển tận tay đến các đối tác của bạn trên toàn quốc an toàn, đúng hẹn.</div></li>
        </ul>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Lên đơn hàng Quà Tặng ngay</h3>
          <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', marginBottom: '24px' }}>Để nhận catalog quà tặng mới nhất và báo giá chiết khấu, vui lòng liên hệ:</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://zalo.me/0899191313" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-navy)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Chat Zalo Bộ Phận B2B</a>
            <a href="tel:0899191313" style={{ display: 'inline-block', padding: '14px 32px', border: '2px solid var(--web-navy)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Hotline Tư Vấn Quà Tặng</a>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Quà tặng bia Đức cho doanh nghiệp:</strong> Gói quà sang trọng từ Bia Thầy Tu Benediktiner và Bitburger Pilsner.</p>
            <p><strong>Tùy chọn:</strong> Thùng mix 2 vị (bia đen + bia vàng), Bom bia 5 lít tiệc tùng, Set bia kèm ly pha lê Weizen.</p>
            <p><strong>Dịch vụ:</strong> Xuất hóa đơn VAT, giao hàng đa điểm, chiết khấu thương mại cao, hỗ trợ in logo doanh nghiệp.</p>
            <p><strong>Liên hệ:</strong> biathaytu.com · Hotline B2B 0899.191.313.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
