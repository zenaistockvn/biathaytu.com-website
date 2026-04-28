import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Giải Pháp Cung Cấp Bia Đức Cho Nhà Hàng Khách Sạn (Horeca)',
  description: 'Đối tác phân phối sỉ bia Đức (Benediktiner, Bitburger) chính hãng cho nhà hàng, khách sạn, bar. Hỗ trợ setup, POSM, menu pairing, chiết khấu hấp dẫn.',
  alternates: { canonical: 'https://www.biathaytu.com/bia-duc-cho-nha-hang-khach-san' },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Giải pháp Bia Đức cho Horeca', slug: 'bia-duc-cho-nha-hang-khach-san', description: 'Cung cấp bia Đức sỉ cho nhà hàng khách sạn.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Bia Đức Cho Nhà Hàng Khách Sạn', url: 'https://www.biathaytu.com/bia-duc-cho-nha-hang-khach-san' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>B2B Doanh Nghiệp & Horeca</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Giải Pháp Bia Đức Toàn Diện Cho Nhà Hàng, Khách Sạn</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Nâng tầm menu đồ uống của bạn với các dòng bia Đức cao cấp từ nhà nhập khẩu độc quyền.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Lợi thế cạnh tranh:</strong> Menu đồ uống (Beverage Menu) chiếm đến 30% lợi nhuận của một nhà hàng cao cấp. Việc đưa các thương hiệu bia Đức lâu đời như Benediktiner hay Bitburger vào menu không chỉ tăng trải nghiệm Food Pairing mà còn định vị sự đẳng cấp cho không gian của bạn.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Tại sao nên chọn chúng tôi?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { title: 'Nhà phân phối độc quyền', desc: 'Nguồn hàng 100% nhập khẩu chính ngạch, hóa đơn VAT đầy đủ. Đảm bảo giá gốc không qua trung gian.' },
            { title: 'Chính sách chiết khấu sâu', desc: 'Mức chiết khấu thương mại linh hoạt dựa trên sản lượng cam kết, giúp tối ưu hóa lợi nhuận cho Horeca.' },
            { title: 'Hỗ trợ POSM trọn gói', desc: 'Cung cấp ly bia chuyên dụng (ly Weizen, ly Pilsner), đế lót ly (coaster), tháp bia, ô dù và các ấn phẩm menu.' },
            { title: 'Giao hàng hỏa tốc', desc: 'Đội ngũ xe tải lạnh riêng biệt, cam kết giao hàng trong 2-4 tiếng khu vực nội thành để không làm gián đoạn vận hành.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '28px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Dịch vụ tư vấn Food Pairing chuyên sâu</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '32px' }}>
          Chúng tôi không chỉ bán bia, chúng tôi cung cấp giải pháp. Chuyên gia của Bia Thầy Tu sẽ làm việc trực tiếp với Bếp trưởng/Quản lý nhà hàng của bạn để:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', display: 'grid', gap: '16px' }}>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Thiết kế Menu Pairing:</strong> Ghép đôi hoàn hảo giữa món ăn đặc trưng của quán và bia (Vd: BBQ + Dunkel, Hải sản + Weissbier).</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Đào tạo nhân viên:</strong> Hướng dẫn nhân viên phục vụ cách rót bia lúa mì (quy tắc 7:3), nhiệt độ phục vụ chuẩn xác, cách giới thiệu câu chuyện bia cho thực khách.</div></li>
          <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <div><strong>Sự kiện trải nghiệm:</strong> Hỗ trợ tổ chức các buổi "Beer Tasting Night" để thu hút khách hàng mới cho quán.</div></li>
        </ul>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Nhận Báo Giá Sỉ & Chính Sách Horeca</h3>
          <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', marginBottom: '24px' }}>Để lại thông tin, chuyên viên tư vấn B2B của chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://zalo.me/0915312166" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-navy)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Chat Zalo B2B</a>
            <a href="tel:0915312166" style={{ display: 'inline-block', padding: '14px 32px', border: '2px solid var(--web-navy)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Gọi Hotline Phụ Trách Horeca</a>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Cung cấp bia Đức cho nhà hàng khách sạn:</strong> Kênh Horeca, đại lý sỉ bia Đức nhập khẩu nguyên chai (Benediktiner, Bitburger).</p>
            <p><strong>Dịch vụ hỗ trợ:</strong> Menu food pairing, cung cấp POSM (ly, lót ly), đào tạo nhân viên rót bia chuẩn Đức.</p>
            <p><strong>Chiết khấu:</strong> Có chính sách giá sỉ ưu đãi lớn, xuất hóa đơn VAT đầy đủ, giao hàng hỏa tốc nội thành.</p>
            <p><strong>Liên hệ B2B:</strong> biathaytu.com · Hotline 091.531.2166.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
