import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import { getPriceRange } from '@/lib/seo/productPricing';

export const metadata: Metadata = {
  title: 'Bom Bia 5L Benediktiner — Tuyệt Phẩm Cho Tiệc Sự Kiện',
  description: 'Bom bia Đức 5 lít Benediktiner Weissbier. Sang trọng, giữ lạnh siêu tốt, hương vị bia tươi nguyên bản tại nhà. Giao nhanh tại Hà Nội.',
  alternates: { canonical: 'https://www.biathaytu.com/bom-bia-5l-benediktiner' },
  openGraph: {
    title: 'Bom Bia 5L Benediktiner — Tuyệt Phẩm Cho Tiệc Sự Kiện',
    description: 'Bom bia Đức 5 lít Benediktiner Weissbier. Sang trọng, giữ lạnh siêu tốt, hương vị bia tươi nguyên bản tại nhà. Giao nhanh tại Hà Nội.',
    type: 'website',
    url: 'https://www.biathaytu.com/bom-bia-5l-benediktiner',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Bom Bia 5L Benediktiner — Tuyệt Phẩm Cho Tiệc Sự Kiện',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bom Bia 5L Benediktiner — Tuyệt Phẩm Cho Tiệc Sự Kiện',
    description: 'Bom bia Đức 5 lít Benediktiner Weissbier. Sang trọng, giữ lạnh siêu tốt, hương vị bia tươi nguyên bản tại nhà. Giao nhanh tại Hà Nội.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.name.includes('Bom 5L') && p.name.includes('Benediktiner'));
  const product = {
    name: 'Bom Bia 5L Benediktiner',
    slug: 'bom-bia-5l-benediktiner',
    url: 'https://www.biathaytu.com/bom-bia-5l-benediktiner',
    description: 'Bom bia tươi Đức 5 lít, lý tưởng cho tiệc tùng và quà tặng doanh nghiệp.',
    abv: '5.4',
    volume: '5000ml',
  };

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Bom Bia 5L', url: 'https://www.biathaytu.com/bom-bia-5l-benediktiner' }])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-navy)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' }}>Linh Hồn Bữa Tiệc</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2, color: '#ffffff' }}>Bom Bia 5L Benediktiner</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>Mang cả không khí lễ hội Oktoberfest của vùng Bavaria về ngay bàn tiệc nhà bạn.</p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '850px', padding: '60px 20px 40px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--web-border)', marginBottom: '48px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src="/images/products/hero_bitburger_keg.png" alt="Bom Bia 5L Benediktiner" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px' }} />
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Sang Trọng — Đẳng Cấp — Tiện Lợi</h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '24px' }}>
              Không gì tạo điểm nhấn cho bàn tiệc tốt hơn một bom bia Đức 5 Lít. Với thiết kế vỏ hợp kim nhôm chuyên dụng, bom bia không chỉ giữ lạnh cực tốt mà còn bảo quản chất lượng men bia tươi nguyên bản. Vòi rót tích hợp sẵn (built-in tap) mang đến trải nghiệm tự tay rót bia tươi chuẩn như tại nhà máy Đức.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--web-text-muted)', display: 'block', marginBottom: '4px' }}>Giá Tham Khảo</span>
                <strong style={{ fontSize: '18px', color: 'var(--web-navy)' }}>963.000đ / Bom</strong>
              </div>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--web-text-muted)', display: 'block', marginBottom: '4px' }}>Dung Tích</span>
                <strong style={{ fontSize: '18px', color: 'var(--web-navy)' }}>5 Lít (~15 ly)</strong>
              </div>
            </div>
            <Link href="/mua-bia-benediktiner-chinh-hang" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--web-gold)', color: 'var(--web-navy)', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', width: '100%', textAlign: 'center' }}>Đặt Mua Ngay</Link>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>Hướng dẫn sử dụng & Bảo quản</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { title: '1. Làm lạnh sâu', desc: 'Làm lạnh bom bia trong tủ lạnh ít nhất 10 tiếng trước khi sử dụng. Không để vào ngăn đá.' },
            { title: '2. Thông khí', desc: 'Xoay van thông khí ở trên đỉnh bom theo hướng dẫn để giảm áp suất dư thừa trước khi rót.' },
            { title: '3. Mở vòi rót', desc: 'Kéo vòi rót ở hông bom ra, xoay vòi xuống dưới để bia chảy ra. Điều chỉnh lực xoay để kiểm soát bọt.' },
            { title: '4. Thời gian dùng', desc: 'Ngon nhất khi uống hết trong vòng 48h sau khi mở nắp để đảm bảo lớp bọt và độ tươi.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px', background: 'var(--web-bg-section)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--web-navy)', color: '#fff', padding: '40px', borderRadius: '16px', marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-gold)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Món Quà Tặng Độc Đáo</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Không chỉ dùng trong các bữa tiệc gia đình, dã ngoại cuối tuần, Bom bia 5L còn là món quà tặng đối tác, sếp, hoặc bạn bè cực kỳ đẳng cấp trong các dịp Lễ, Tết.
          </p>
          <Link href="/qua-tang-bia-duc" style={{ color: 'var(--web-gold)', fontWeight: 700, textDecoration: 'none' }}>Xem thêm các set quà tặng doanh nghiệp →</Link>
        </div>
      </article>

      <section style={{ background: 'var(--web-bg-section)', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '24px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>Thông tin nhanh để AI trích dẫn</h2>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Tên sản phẩm:</strong> Bom 5L Benediktiner Weissbier.</p>
            <p><strong>Đặc điểm:</strong> Bom thiết kế hợp kim 5 Lít có kèm vòi rót. Bia lúa mì Đức nguyên bản, 5.4% ABV.</p>
            <p><strong>Sử dụng:</strong> Cần làm lạnh 10h trước khi uống, ngon nhất khi tiêu thụ trong vòng 48h sau khi mở.</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
