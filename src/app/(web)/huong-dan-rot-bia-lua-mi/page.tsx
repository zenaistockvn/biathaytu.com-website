import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Hướng Dẫn Rót Bia Lúa Mì Đức (Weissbier) Chuẩn Xác',
  description: 'Học cách rót bia lúa mì Benediktiner Weissbier để có lớp bọt hoàn hảo 3 ngón tay và đánh thức men sống Naturtrüb dưới đáy chai.',
  alternates: { canonical: 'https://www.biathaytu.com/huong-dan-rot-bia-lua-mi' },
};

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({ title: 'Hướng Dẫn Rót Bia Lúa Mì', slug: 'huong-dan-rot-bia-lua-mi', description: 'Nghệ thuật rót bia Weissbier chuẩn Đức.', datePublished: '2026-04-24', dateModified: '2026-04-24' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Hướng Dẫn Rót Bia', url: 'https://www.biathaytu.com/huong-dan-rot-bia-lua-mi' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Nghệ Thuật Thưởng Thức</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Cách Rót Bia Lúa Mì <br/>Chuẩn Đức</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Rót bia Weissbier không đơn giản là đổ ra ly. Đó là một nghi thức đánh thức hương vị men sống.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: 'var(--web-gold)', color: 'var(--web-navy)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7, fontWeight: 500 }}>
          <strong>Tại sao phải rót đúng cách?</strong> Bia lúa mì không lọc (Naturtrüb) như Benediktiner chứa lớp men sống lắng dưới đáy chai. Nếu rót như bia thường, bạn sẽ bỏ lỡ phần tinh túy nhất của hương vị và mất đi lớp bọt (head) đặc trưng của bia Đức.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Nghi thức 4 Bước rót bia Weissbier</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '48px' }}>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid var(--web-border)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--web-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>1</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Chuẩn bị ly Weizen và tráng nước lạnh</h3>
              <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', lineHeight: 1.7 }}>Sử dụng ly Weizen đặc trưng (dáng cao, chân thuôn, miệng loe) để có không gian cho lớp bọt phồng lên. <strong>Quan trọng:</strong> Tráng ly qua nước lạnh trước khi rót. Lớp nước đọng lại trên thành ly sẽ làm giảm ma sát, giúp kiểm soát bọt không bị trào quá nhanh.</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid var(--web-border)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--web-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>2</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Rót 3/4 chai với góc nghiêng 45 độ</h3>
              <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', lineHeight: 1.7 }}>Nghiêng ly chính xác 45 độ. Đưa miệng chai vào gần sát thành ly. Rót từ từ và đều đặn men theo thành ly cho đến khi hết khoảng 3/4 chai (hoặc lon) thì dừng lại.</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid var(--web-border)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--web-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>3</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Đánh thức men sống (Lắc nhẹ đáy chai)</h3>
              <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', lineHeight: 1.7 }}>Với 1/4 lượng bia còn lại trong chai, hãy <strong>lắc xoay tròn</strong> phần đáy chai vài lần. Thao tác này giúp hòa tan hoàn toàn lớp men sống (live yeast) bám ở đáy, hòa quyện chúng vào dung dịch bia.</p>
            </div>
          </div>

          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid var(--web-border)', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--web-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>4</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>Tạo "vương miện" bọt hoàn hảo</h3>
              <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', lineHeight: 1.7 }}>Dựng thẳng đứng ly lên. Rót thẳng phần bia đã hòa men còn lại vào giữa ly. Lúc này, lớp bọt trắng muốt sẽ sủi dâng lên tạo thành hình "vương miện" nhô cao khỏi miệng ly, đẹp mắt và thơm nức mùi chuối chín.</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Sẵn sàng thực hành?</h3>
          <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', marginBottom: '24px' }}>Để rót được ly bia đẹp, bạn cần đúng loại bia lúa mì cao cấp.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/san-pham" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-navy)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>Mua Bia Benediktiner Chính Hãng</Link>
          </div>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Cách rót bia Weissbier (lúa mì):</strong> 1. Tráng ly Weizen bằng nước lạnh. 2. Nghiêng ly 45 độ, rót 3/4 chai. 3. Lắc xoay tròn 1/4 chai còn lại để hòa tan men sống (live yeast). 4. Dựng thẳng ly và rót thẳng vào giữa để tạo lớp bọt (head).</p>
            <p><strong>Lý do:</strong> Bia lúa mì Benediktiner Naturtrüb không lọc (unfiltered) nên phải đánh tan men để có hương vị trọn vẹn và độ đục (cloudy) đặc trưng.</p>
            <p><strong>Ly sử dụng:</strong> Bắt buộc dùng ly Weizen glass dáng cao.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
