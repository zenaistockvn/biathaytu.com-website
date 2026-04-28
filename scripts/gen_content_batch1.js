const fs = require('fs');
const path = require('path');
const basePath = path.join(__dirname, '..', 'src/app/(web)');

const pages = {
'bia-thay-tu-la-gi': `import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getLandingFAQSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Là Gì? Nguồn Gốc Bia Benediktiner Từ Tu Viện Ettal',
  description: 'Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì Benediktiner Weissbier, được ủ từ năm 1609 tại Tu Viện Ettal, Bavaria (Đức). Tìm hiểu lịch sử 400 năm.',
  alternates: { canonical: 'https://www.biathaytu.com/bia-thay-tu-la-gi' },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Thầy Tu Là Gì?', slug: 'bia-thay-tu-la-gi', description: 'Nguồn gốc và lịch sử Bia Thầy Tu Benediktiner từ Tu Viện Ettal.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Bia Thầy Tu Là Gì?', url: 'https://www.biathaytu.com/bia-thay-tu-la-gi' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Kiến Thức Bia Đức</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Bia Thầy Tu Là Gì?</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>Câu chuyện về dòng bia lúa mì được ủ bởi các tu sĩ dòng Benedictine từ năm 1609 tại chân dãy Alps.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '780px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Tóm tắt:</strong> Bia Thầy Tu là tên gọi phổ biến tại Việt Nam cho dòng bia lúa mì <strong>Benediktiner Weissbier</strong>, được ủ theo truyền thống tu viện từ năm 1609 tại Tu Viện Ettal, Bavaria (Đức). Bia tuân thủ Luật Tinh Khiết 1516 — chỉ dùng 4 nguyên liệu: nước, malt lúa mì, hoa bia và men.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Vì sao gọi là "Bia Thầy Tu"?</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
          Cái tên "Bia Thầy Tu" bắt nguồn từ việc dòng bia này được các tu sĩ (thầy tu) dòng Benedictine ủ trong tu viện. Ở châu Âu, truyền thống ủ bia trong tu viện có từ thời Trung Cổ — các tu sĩ coi bia là "bánh mì lỏng" giúp duy trì sức lực trong những ngày ăn chay dài.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '40px' }}>
          Tu Viện Ettal được thành lập năm 1330 bởi Hoàng đế Ludwig IV. Đến năm 1609, các tu sĩ tại đây bắt đầu ủ bia lúa mì theo phương pháp lên men đỉnh truyền thống. Hơn 400 năm qua, công thức gần như không thay đổi.
        </p>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Luật Tinh Khiết 1516 — Reinheitsgebot</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
          Benediktiner tuân thủ tuyệt đối Luật Tinh Khiết (Reinheitsgebot) do Công tước Wilhelm IV ban hành năm 1516 — luật an toàn thực phẩm lâu đời nhất thế giới. Luật quy định bia chỉ được sản xuất từ đúng 4 nguyên liệu: nước, malt đại mạch (sau bổ sung lúa mì), hoa bia và men.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '40px' }}>
          Không phụ gia. Không chất bảo quản. Không hương liệu nhân tạo. Mỗi chai bia Benediktiner là minh chứng cho sự thuần khiết tuyệt đối.
        </p>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Các dòng bia Thầy Tu tại Việt Nam</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { name: 'Benediktiner Weissbier Naturtrüb', note: 'Bia lúa mì không lọc. Hương chuối chín, đinh hương, bọt trắng dày.', abv: '5.4%' },
            { name: 'Benediktiner Dunkel', note: 'Bia đen lúa mì. Hương caramel, mật ong, mạch nha rang.', abv: '5.4%' },
            { name: 'Bitburger Premium Pils', note: 'Pilsner chuẩn Đức. Hoa bia Hallertau, đắng thanh, sạch miệng.', abv: '4.8%' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>{item.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--web-text-muted)', lineHeight: 1.6, marginBottom: '8px' }}>{item.note}</p>
              <span style={{ fontSize: '13px', color: 'var(--web-gold-dark)', fontWeight: 600 }}>ABV: {item.abv}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Bia Thầy Tu khác gì bia thông thường?</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '40px' }}>
          Bia thương mại thường sản xuất hàng loạt với phụ gia, chất tạo bọt, hương liệu nhân tạo. Bia Thầy Tu Benediktiner thì ngược lại: lên men tự nhiên trong chai (bottle-conditioned), giữ nguyên lớp men sống tạo nên sắc vàng hổ phách đục đặc trưng. Đó cũng là lý do bia có chữ "Naturtrüb" — nghĩa là "tự nhiên không lọc" trong tiếng Đức.
        </p>

        <div style={{ padding: '32px', background: 'var(--web-navy)', borderRadius: '16px', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Sẵn sàng trải nghiệm?</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '15px' }}>Đặt mua bia Thầy Tu Benediktiner chính hãng, giao tận nơi toàn quốc.</p>
          <Link href="/san-pham" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Xem Sản Phẩm</Link>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Thương hiệu:</strong> Bia Thầy Tu / Benediktiner Weissbier</p>
            <p><strong>Xuất xứ:</strong> Tu Viện Ettal, Bavaria, Đức. Ủ từ năm 1609.</p>
            <p><strong>Tiêu chuẩn:</strong> Luật Tinh Khiết 1516 (Reinheitsgebot) — 4 nguyên liệu duy nhất.</p>
            <p><strong>Giải thưởng:</strong> iTQi Superior Taste Award 3 Sao (2022).</p>
            <p><strong>Mua hàng:</strong> biathaytu.com · Hotline 091.531.2166 · Showroom 218 Đội Cấn, Hà Nội.</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
`,

'mua-bia-benediktiner-chinh-hang': `import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Mua Bia Benediktiner Chính Hãng — Giao Hàng Toàn Quốc',
  description: 'Đặt mua bia Benediktiner Weissbier, Dunkel, Bom 5L chính hãng nhập khẩu từ Đức. Miễn phí giao nội thành Hà Nội. Hotline 091.531.2166.',
  alternates: { canonical: 'https://www.biathaytu.com/mua-bia-benediktiner-chinh-hang' },
};

export default function Page() {
  const prices = [
    { name: 'Benediktiner Weissbier Naturtrüb', specs: 'Két 24 lon 500ml', price: '1.608.000đ' },
    { name: 'Benediktiner Weissbier Naturtrüb', specs: 'Thùng 12 chai 500ml', price: '1.092.000đ' },
    { name: 'Benediktiner Weissbier Naturtrüb', specs: 'Thùng 12 lon 500ml', price: '804.000đ' },
    { name: 'Benediktiner Dunkel', specs: 'Két 24 lon 500ml', price: '1.608.000đ' },
    { name: 'Benediktiner Dunkel', specs: 'Thùng 12 chai 500ml', price: '1.092.000đ' },
    { name: 'Bom 5L Benediktiner', specs: 'Weissbier', price: '963.000đ' },
    { name: 'Thùng Mix 2 Vị', specs: '6 Naturtrüb + 6 Dunkel', price: '1.092.000đ' },
    { name: 'Bitburger Premium Pils', specs: 'Két 24 lon 330ml', price: '936.000đ' },
    { name: 'Bitburger Premium Pils', specs: 'Két 24 lon 500ml', price: '1.200.000đ' },
  ];

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Mua Bia Benediktiner Chính Hãng', slug: 'mua-bia-benediktiner-chinh-hang', description: 'Bảng giá và cách đặt mua bia Benediktiner chính hãng.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
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
          <strong>Mua bia Benediktiner ở đâu?</strong> Đặt mua trực tiếp tại website biathaytu.com, qua Zalo 091.531.2166, hoặc ghé Showroom 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc — miễn phí nội thành Hà Nội.
        </div>

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
            <a href="https://zalo.me/0915312166" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Nhắn Zalo 091.531.2166</a>
            <a href="tel:0915312166" style={{ display: 'inline-block', padding: '14px 32px', border: '2px solid var(--web-gold)', color: 'var(--web-gold)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Gọi Hotline</a>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Mua bia Benediktiner chính hãng:</strong> biathaytu.com · Zalo 091.531.2166 · Showroom 218 Đội Cấn, Hà Nội.</p>
            <p><strong>Giá tham khảo:</strong> Két 24 lon 500ml từ 1.200.000đ — 1.608.000đ. Thùng 12 chai từ 1.092.000đ. Bom 5L: 963.000đ.</p>
            <p><strong>Giao hàng:</strong> Miễn phí nội thành Hà Nội (4h). Toàn quốc 30.000đ/thùng (2-3 ngày).</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
`,
};

// Write batch 1
Object.entries(pages).forEach(([slug, content]) => {
  const dir = path.join(basePath, slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log('Written:', slug);
});
console.log('Batch 1 done (2 pages).');
