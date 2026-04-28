import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Nghệ Thuật Food Pairing: Bia Đức Kết Hợp Cùng Ẩm Thực',
  description: 'Khám phá bí quyết kết hợp (food pairing) các dòng bia Đức như Weissbier, Dunkel, Pilsner với các món ăn Việt Nam, món Âu và đồ nướng BBQ.',
  alternates: { canonical: 'https://www.biathaytu.com/food-pairing-bia-duc' },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Food Pairing với Bia Đức', slug: 'food-pairing-bia-duc', description: 'Cách kết hợp món ăn và bia Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Food Pairing Bia Đức', url: 'https://www.biathaytu.com/food-pairing-bia-duc' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Kiến Thức Ẩm Thực</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Nghệ Thuật Food Pairing <br/>Cùng Bia Đức</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Đánh thức toàn bộ giác quan khi kết hợp đúng hương vị bia với món ăn phù hợp.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Food Pairing là gì?</strong> Đó là nghệ thuật "ghép đôi" đồ uống và món ăn sao cho chúng tôn vinh lẫn nhau. Một ly bia Đức hoàn hảo có thể làm giảm độ ngấy của món ăn, làm bật lên vị tươi ngọt của hải sản, hoặc hòa quyện cùng vị đậm đà của thịt nướng.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>1. Kết hợp cùng Bia Lúa Mì (Weissbier)</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
          <strong>Đặc điểm bia:</strong> Vị ngọt dịu, ít đắng, thoang thoảng hương trái cây (chuối chín, cam quýt) và đinh hương. Độ sủi bọt cao giúp làm sạch vòm miệng hiệu quả.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Hải sản</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Tôm hấp, mực nướng, sushi. Vị ngọt của bia làm bật lên độ tươi của hải sản mà không lấn át.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Gia cầm & Đồ chua</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Gà nướng mật ong, salad chua ngọt, nem chua. Độ sủi bọt cắt ngang vị béo ngậy cực tốt.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Món truyền thống Việt</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Thú vị nhất là kết hợp cùng Phở! Sự thanh tao của Weissbier hợp tuyệt vời với nước dùng xương.</p>
           </div>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>2. Kết hợp cùng Bia Đen (Dunkelweizen)</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
          <strong>Đặc điểm bia:</strong> Vị mạch nha rang đậm đà, hương caramel, chocolate đen và thoảng vị nướng bùi bùi. Hậu vị êm dịu, ấm áp.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Đồ nướng BBQ</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Sườn heo nướng BBQ, xúc xích Đức nướng than, bít tết bò. Sự cộng hưởng hoàn hảo của hai "vị khói".</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Món hầm tẩm ướp đậm</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Bò kho tộ, thịt lợn hầm. Vị ngọt caramel của bia sẽ trung hòa vị mặn đậm đà của món ăn.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Tráng miệng</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Chocolate đen, bánh Tiramisu, bánh Brownie. Vị mạch nha nướng sẽ nâng tầm vị cacao.</p>
           </div>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>3. Kết hợp cùng Pilsner (Bia Vàng)</h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
          <strong>Đặc điểm bia:</strong> Trong suốt, cực kỳ giải khát. Vị đắng thanh của hoa bia và hậu vị khô, sạch miệng (crisp). Khả năng "thanh tẩy vị giác" xuất sắc.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Đồ chiên rán</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Gà rán, mực chiên xù, khoai tây chiên. Vị đắng và độ lạnh cắt ngay cảm giác ngấy mỡ.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Đồ nhậu mặn & cay</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Khô bò, lạc rang muối, pizza cay. Pilsner làm dịu sức nóng của gia vị cay nồng.</p>
           </div>
           <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
             <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Ẩm thực đường phố</h4>
             <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>Các món xiên nướng, ốc xào. Một ly Pilsner ướp lạnh là đủ cho mọi buổi tụ tập.</p>
           </div>
        </div>

        <div style={{ padding: '32px', background: 'var(--web-navy)', borderRadius: '16px', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>Chọn bia cho bữa tiệc của bạn</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '15px' }}>Chuẩn bị thực đơn hoàn hảo với bộ sưu tập bia Đức nhập khẩu chính hãng.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/san-pham" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Khám Phá Các Dòng Bia</Link>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Bia Weissbier (Lúa mì):</strong> Cực hợp với hải sản, gia cầm, món chua ngọt và phở Việt Nam nhờ hương chuối/đinh hương ngọt dịu.</p>
            <p><strong>Bia Dunkel (Bia đen):</strong> Ghép đôi hoàn hảo cùng đồ nướng BBQ, sườn nướng, thịt hầm đậm vị và chocolate nhờ hương caramel mạch nha rang.</p>
            <p><strong>Bia Pilsner:</strong> Giải khát tốt, cắt độ ngấy dầu mỡ xuất sắc — hợp đồ chiên rán, đồ mặn, cay nóng.</p>
            <p><strong>Nguyên tắc:</strong> Bia có độ cồn, độ nồng càng cao thì nên ăn cùng món ăn có gia vị càng đậm đà.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
