import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Benediktiner Dunkel — Bia Đen Lúa Mì Đức 5.4%',
  description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
  alternates: { canonical: 'https://www.biathaytu.com/benediktiner-dunkel' },
};

export default function Page() {
  const product = {
    name: 'Benediktiner Dunkel',
    slug: 'benediktiner-dunkel',
    description: 'Bia đen lúa mì từ Đức, hương mạch nha rang caramel đậm đà.',
    abv: '5.4',
    volume: '500ml',
    images: ['https://www.biathaytu.com/images/products/official/benediktiner/bottle_removebg.png'] // Fallback
  };

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="product" data={getProductSchema(product)} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Benediktiner Dunkel', url: 'https://www.biathaytu.com/benediktiner-dunkel' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Bia Đen Thượng Hạng</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Benediktiner Dunkel</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Bia đen lúa mì quyến rũ với nốt hương caramel và mạch nha rang đậm đà.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--web-border)', marginBottom: '48px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', background: 'var(--web-bg-section)', borderRadius: '12px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Placeholder for Dunkel specific image */}
             <span style={{ fontSize: '40px' }}>🍺</span>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Tuyệt tác từ lúa mì và mạch nha rang</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '24px' }}>
              Dunkel trong tiếng Đức nghĩa là "Đậm/Đen". Khác với bia đen Stout thông thường, Benediktiner Dunkel là dòng <strong>bia đen lúa mì</strong> (Dunkelweizen). Mạch nha lúa mì được rang ở nhiệt độ cao để tạo ra màu nâu hạt dẻ tuyệt đẹp và mang lại hương vị caramel ấm áp, nhưng vẫn giữ được sự mượt mà sảng khoái đặc trưng của dòng Weissbier.
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
            { title: 'Thị giác (Màu sắc)', desc: 'Màu nâu hạt dẻ đậm, đục mờ quyến rũ. Bọt bia màu caramel nhạt, xốp mịn.' },
            { title: 'Khứu giác (Hương thơm)', desc: 'Hương thơm nồng nàn của mạch nha rang, kẹo bơ cứng (toffee), chocolate đen và thoang thoảng chuối nướng.' },
            { title: 'Vị giác (Hương vị)', desc: 'Vị ngọt của caramel và mật ong lan tỏa, xen lẫn vị bánh mì nướng và một chút đắng nhẹ nhàng của hoa bia.' },
            { title: 'Hậu vị', desc: 'Ấm áp, mượt mà và sạch sẽ. Cảm giác béo ngậy của lúa mì hòa quyện hoàn hảo.' },
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
            Nhiệt độ thưởng thức lý tưởng từ <strong>8 - 10°C</strong> (ấm hơn một chút so với Weissbier để hương vị mạch nha bung tỏa tối đa).
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Món nướng BBQ:</strong> Đặc biệt sinh ra để kết hợp với sườn nướng, xúc xích nướng, thịt bò bít tết.</li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Phô mai:</strong> Tuyệt vời khi dùng chung với phô mai có mùi đậm như Gouda hay phô mai xanh.</li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><span style={{ color: 'var(--web-gold)' }}>✓</span> <strong>Tráng miệng:</strong> Ghép đôi hoàn hảo với bánh chocolate đen hoặc tiramisu.</li>
          </ul>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Tên sản phẩm:</strong> Benediktiner Dunkel.</p>
            <p><strong>Đặc điểm:</strong> Bia đen lúa mì Đức (Dunkelweizen), 5.4% ABV. Màu nâu hạt dẻ, hương vị mạch nha rang, caramel, chocolate đen và chuối nướng.</p>
            <p><strong>Food Pairing:</strong> Rất hợp với các món nướng BBQ, steak, và phô mai đậm vị.</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
