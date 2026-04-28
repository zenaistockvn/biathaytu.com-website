import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Benediktiner Weissbier Naturtrüb — Bia Lúa Mì Đức 5.4%',
  description: 'Khám phá bia lúa mì Benediktiner Weissbier Naturtrüb không lọc. Hương vị tự nhiên với nốt hương chuối chín và đinh hương. Đạt giải iTQi 3 Sao 2022.',
  alternates: { canonical: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub' },
};

export default function Page() {
  const product = {
    name: 'Benediktiner Weissbier Naturtrüb',
    slug: 'benediktiner-weissbier-naturtrub',
    description: 'Bia lúa mì Đức nguyên bản, không lọc, giữ trọn vẹn hương vị men sống tự nhiên.',
    abv: '5.4',
    volume: '500ml',
    images: ['https://www.biathaytu.com/images/products/official/benediktiner/bottle_removebg.png']
  };

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="product" data={getProductSchema(product)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Weissbier Naturtrüb', url: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Sản Phẩm Đặc Trưng</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Benediktiner Weissbier Naturtrüb</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Bia lúa mì tự nhiên không lọc — Hương vị nguyên bản từ Tu Viện Ettal.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--web-border)', marginBottom: '48px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <img src="/images/products/official/benediktiner/bottle_removebg.png" alt="Benediktiner Weissbier Naturtrüb" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Naturtrüb — Bí mật của sự vẩn đục</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '24px' }}>
              Từ "Naturtrüb" trong tiếng Đức nghĩa là "đục tự nhiên". Không trải qua quá trình lọc thô như các loại bia thương mại, Benediktiner Weissbier giữ nguyên được lớp men sống (live yeast) bên trong. Chính lớp men này tiếp tục hoạt động, tạo nên sắc vàng hổ phách đục mờ quyến rũ và giải phóng hương vị trọn vẹn nhất khi rót ra ly.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--web-text-muted)', display: 'block', marginBottom: '4px' }}>Độ Cồn (ABV)</span>
                <strong style={{ fontSize: '18px', color: 'var(--web-navy)' }}>5.4%</strong>
              </div>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--web-text-muted)', display: 'block', marginBottom: '4px' }}>Quy Cách</span>
                <strong style={{ fontSize: '18px', color: 'var(--web-navy)' }}>Lon/Chai 500ml</strong>
              </div>
            </div>
            <Link href="/mua-bia-benediktiner-chinh-hang" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', width: '100%', textAlign: 'center' }}>Xem Giá & Đặt Hàng</Link>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Tasting Notes (Hương Vị)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { title: 'Thị giác (Màu sắc)', desc: 'Vàng hổ phách sáng, đục mờ tự nhiên. Lớp bọt trắng muốt, cực kỳ dày và giữ lâu trên miệng ly.' },
            { title: 'Khứu giác (Hương thơm)', desc: 'Bùng nổ hương trái cây đặc trưng của chuối chín và đinh hương, điểm xuyết chút hương cam quýt dịu nhẹ.' },
            { title: 'Vị giác (Hương vị)', desc: 'Cân bằng hoàn hảo giữa độ ngọt của mạch nha lúa mì và vị đắng nhẹ của hoa bia. Cảm giác sủi bọt lăn tăn sống động.' },
            { title: 'Hậu vị', desc: 'Tròn trịa, ngọt dịu và mượt mà. Vị "umami" của men bia còn đọng lại quyến rũ.' },
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
            Nhiệt độ thưởng thức hoàn hảo nhất là từ <strong>6 - 8°C</strong>. Phải dùng ly Weizen (ly dáng cao, eo thon) để tạo và giữ được lớp bọt đặc trưng.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Món Việt:</strong> Hoàn hảo với Phở, hải sản hấp, gà nướng mật ong.</li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Món Âu:</strong> Bánh Pretzel, xúc xích trắng (Weisswurst), phô mai Gouda.</li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Tráng miệng:</strong> Bánh táo (Apple Strudel) hoặc kem vanilla.</li>
          </ul>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Tên sản phẩm:</strong> Benediktiner Weissbier Naturtrüb.</p>
            <p><strong>Đặc điểm:</strong> Bia lúa mì Đức (Weissbier) không lọc, đục tự nhiên, hương chuối chín và đinh hương. Nồng độ cồn (ABV) 5.4%.</p>
            <p><strong>Giải thưởng:</strong> iTQi Superior Taste Award 3 Sao (2022).</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
