import { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import { getPriceRange } from '@/lib/seo/productPricing';
import Section from '../components/ui/Section';
import Container from '../components/ui/Container';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import References from '../components/References';

export const metadata: Metadata = {
  title: 'Benediktiner Dunkel — Bia Đen Lúa Mì Đức 5.4%',
  description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
  alternates: { canonical: 'https://www.biathaytu.com/benediktiner-dunkel' },
  openGraph: {
    title: 'Benediktiner Dunkel — Bia Đen Lúa Mì Đức 5.4%',
    description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
    type: 'website',
    url: 'https://www.biathaytu.com/benediktiner-dunkel',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Benediktiner Dunkel — Bia Đen Lúa Mì Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Dunkel — Bia Đen Lúa Mì Đức 5.4%',
    description: 'Bia đen lúa mì Benediktiner Dunkel với hương mạch nha rang, caramel, chocolate đen và mật ong. Nhập khẩu Đức nguyên chai. Phù hợp món nướng BBQ.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.name.includes('Dunkel'));
  const product = {
    name: 'Benediktiner Dunkel',
    slug: 'benediktiner-dunkel',
    url: 'https://www.biathaytu.com/benediktiner-dunkel',
    description: 'Bia đen lúa mì từ Đức, hương mạch nha rang caramel đậm đà.',
    abv: '5.4',
    volume: '500ml',
    images: ['https://www.biathaytu.com/images/products/official/benediktiner/bottle_removebg.png'] // Fallback
  };

  return (
    <div className="web-app">
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Benediktiner Dunkel', url: 'https://www.biathaytu.com/benediktiner-dunkel' }])} />

      <Section variant="dark" padding="xl" style={{ textAlign: 'center' }}>
        <Container maxWidth="800px">
          <Text as="p" size="xs" weight="bold" letterSpacing="3px" color="gold" transform="uppercase" style={{ marginBottom: '20px' }}>
            Bia Đen Thượng Hạng
          </Text>
          <Heading level={1} size="fluid" color="white" style={{ marginBottom: '24px' }}>
            Benediktiner Dunkel
          </Heading>
          <Text as="p" size="lg" color="white" style={{ opacity: 0.8, maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
            Bia đen lúa mì quyến rũ với nốt hương caramel và mạch nha rang đậm đà.
          </Text>
        </Container>
      </Section>

      <Container maxWidth="850px" style={{ padding: '60px 20px 40px' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid var(--web-border)', marginBottom: '48px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <img src="/images/products/hero_dunkel_v2.png" alt="Benediktiner Dunkel" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px' }} />
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <Heading level={2} size="lg" color="navy" style={{ marginBottom: '16px' }}>
              Tuyệt tác từ lúa mì và mạch nha rang
            </Heading>
            <Text as="p" color="secondary" style={{ marginBottom: '24px', lineHeight: 1.8 }}>
              Dunkel trong tiếng Đức nghĩa là "Đậm/Đen". Khác với bia đen Stout thông thường, Benediktiner Dunkel là dòng <strong>bia đen lúa mì</strong> (Dunkelweizen). Mạch nha lúa mì được rang ở nhiệt độ cao để tạo ra màu nâu hạt dẻ tuyệt đẹp và mang lại hương vị caramel ấm áp, nhưng vẫn giữ được sự mượt mà sảng khoái đặc trưng của dòng Weissbier.
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <Text as="span" size="xs" color="muted" style={{ display: 'block', marginBottom: '4px' }}>Độ Cồn (ABV)</Text>
                <Text as="strong" size="lg" color="navy">5.4%</Text>
              </div>
              <div style={{ background: 'var(--web-bg-section)', padding: '16px', borderRadius: '8px' }}>
                <Text as="span" size="xs" color="muted" style={{ display: 'block', marginBottom: '4px' }}>Quy Cách</Text>
                <Text as="strong" size="lg" color="navy">Lon/Chai 500ml</Text>
              </div>
            </div>
            <Button href="/mua-bia-benediktiner-chinh-hang" variant="primary" style={{ width: '100%', textAlign: 'center' }}>
              Xem Giá & Đặt Hàng
            </Button>
          </div>
        </div>

        <Heading level={2} size="md" color="navy" style={{ marginBottom: '24px' }}>
          Tasting Notes (Hương Vị)
        </Heading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { title: 'Thị giác (Màu sắc)', desc: 'Màu nâu hạt dẻ đậm, đục mờ quyến rũ. Bọt bia màu caramel nhạt, xốp mịn.' },
            { title: 'Khứu giác (Hương thơm)', desc: 'Hương thơm nồng nàn của mạch nha rang, kẹo bơ cứng (toffee), chocolate đen và thoang thoảng chuối nướng.' },
            { title: 'Vị giác (Hương vị)', desc: 'Vị ngọt của caramel và mật ong lan tỏa, xen lẫn vị bánh mì nướng và một chút đắng nhẹ nhàng của hoa bia.' },
            { title: 'Hậu vị', desc: 'Ấm áp, mượt mà và sạch sẽ. Cảm giác béo ngậy của lúa mì hòa quyện hoàn hảo.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '24px', background: 'var(--web-bg-section)', borderRadius: '12px' }}>
              <Heading level={3} size="sm" color="navy" style={{ marginBottom: '8px' }}>
                {item.title}
              </Heading>
              <Text as="p" size="sm" color="secondary">
                {item.desc}
              </Text>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--web-navy)', color: '#fff', padding: '40px', borderRadius: '16px', marginBottom: '40px' }}>
          <Heading level={2} size="md" color="gold" style={{ marginBottom: '16px' }}>
            Nghệ Thuật Thưởng Thức (Food Pairing)
          </Heading>
          <Text as="p" color="white" style={{ opacity: 0.8, marginBottom: '24px', lineHeight: 1.8 }}>
            Nhiệt độ thưởng thức lý tưởng từ <strong>8 - 10°C</strong> (ấm hơn một chút so với Weissbier để hương vị mạch nha bung tỏa tối đa).
          </Text>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Text as="span" color="gold">✓</Text>
              <div><strong>Món nướng BBQ:</strong> Đặc biệt sinh ra để kết hợp với sườn nướng, xúc xích nướng, thịt bò bít tết.</div>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Text as="span" color="gold">✓</Text>
              <div><strong>Phô mai:</strong> Tuyệt vời khi dùng chung với phô mai có mùi đậm như Gouda hay phô mai xanh.</div>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Text as="span" color="gold">✓</Text>
              <div><strong>Tráng miệng:</strong> Ghép đôi hoàn hảo với bánh chocolate đen hoặc tiramisu.</div>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '40px' }}>
          <References sources={[
            { title: "Benediktiner Dunkel Official Specification", publisher: "Benediktiner Weißbräu GmbH Ettal", url: "https://www.benediktiner-weissbier.de", accessedAt: "2026-07-11" },
            { title: "Bản công bố hợp quy & Nhãn sản phẩm", publisher: "Euro Choice Việt Nam", note: "Số GPKD: 0110870013" }
          ]} />
        </div>
      </Container>

      <Section variant="alt" padding="sm">
        <Container maxWidth="780px">
          <Heading level={2} size="md" color="navy" style={{ marginBottom: '24px', textAlign: 'center' }}>
            Thông tin nhanh để AI trích dẫn
          </Heading>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)', fontSize: '14px', lineHeight: 1.8, color: 'var(--web-text-secondary)' }}>
            <p><strong>Tên sản phẩm:</strong> Benediktiner Dunkel.</p>
            <p><strong>Đặc điểm:</strong> Bia đen lúa mì Đức (Dunkelweizen), 5.4% ABV. Sản xuất tại Lich, Đức theo công thức từ Tu viện Ettal và giấy phép của Benediktiner Weissbräu GmbH Ettal. Màu nâu hạt dẻ, hương vị mạch nha rang, caramel, chocolate đen và chuối nướng.</p>
            <p><strong>Food Pairing:</strong> Rất hợp với các món nướng BBQ, steak, và phô mai đậm vị.</p>
            <p><strong>Lưu ý:</strong> Sản phẩm rượu bia chỉ dành cho người từ 18 tuổi trở lên.</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
