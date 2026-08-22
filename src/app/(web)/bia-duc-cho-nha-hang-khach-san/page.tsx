import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';
import { BRAND, BRAND_TEL_HREF } from '@/lib/brand';

const PAGE_URL = `${BRAND.siteUrl}/bia-duc-cho-nha-hang-khach-san`;

export const metadata: Metadata = {
  title: 'Benediktiner Cho Nhà Hàng, Khách Sạn & HORECA',
  description: 'Giải pháp Benediktiner cho nhà hàng, khách sạn và sự kiện: danh mục, POSM, food pairing, đào tạo phục vụ và hỗ trợ vận hành.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Benediktiner Cho Nhà Hàng, Khách Sạn & HORECA',
    description: 'German Taste hỗ trợ danh mục, POSM, food pairing và vận hành Benediktiner cho HORECA tại Việt Nam.',
    type: 'article',
    url: PAGE_URL,
    images: [{
      url: '/images/facebook/cover_tiep_khach_v2_1775560932251.png',
      width: 1200,
      height: 630,
      alt: 'Giải pháp Benediktiner cho nhà hàng khách sạn',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Cho Nhà Hàng, Khách Sạn & HORECA',
    description: 'Danh mục, POSM, food pairing và hỗ trợ vận hành Benediktiner cho HORECA tại Việt Nam.',
    images: ['/images/facebook/cover_tiep_khach_v2_1775560932251.png'],
  },
};

const services = [
  ['Danh mục phù hợp mô hình', 'Tư vấn quy cách chai, lon hoặc bom theo menu, tệp khách và công suất phục vụ.'],
  ['POSM & trải nghiệm thương hiệu', 'Hỗ trợ vật phẩm trưng bày, ly bia chuyên dụng và tài liệu giới thiệu sản phẩm.'],
  ['Food pairing', 'Phối hợp xây gợi ý kết hợp Benediktiner với món ăn đặc trưng của nhà hàng.'],
  ['Đào tạo phục vụ', 'Hướng dẫn cách bảo quản, làm lạnh, rót bia và giới thiệu câu chuyện thương hiệu cho nhân viên.'],
] as const;

export default function Page() {
  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({
        title: 'Giải pháp Benediktiner cho HORECA',
        slug: 'bia-duc-cho-nha-hang-khach-san',
        url: PAGE_URL,
        description: 'Giải pháp Benediktiner cho nhà hàng, khách sạn và sự kiện.',
        datePublished: '2026-04-24',
        dateModified: '2026-08-22',
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: BRAND.siteUrl },
        { name: 'HORECA', url: PAGE_URL },
      ])} />

      <section style={{ padding: '120px 0 60px', background: 'var(--web-ink)', color: '#fff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-accent-on-ink)', textTransform: 'uppercase', marginBottom: '20px' }}>Nhà hàng · Khách sạn · Sự kiện</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '24px', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
            Giải Pháp Benediktiner Cho HORECA
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.82)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            German Taste hỗ trợ từ lựa chọn danh mục đến trải nghiệm phục vụ, giúp Benediktiner phù hợp với từng mô hình vận hành.
          </p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: '900px', padding: '60px 20px' }}>
        <div style={{ background: 'var(--web-bg-section)', padding: '24px 28px', borderRadius: '12px', marginBottom: '48px', fontSize: '16px', lineHeight: 1.7 }}>
          <strong>Chính sách thương mại:</strong> website không công khai điều kiện dành cho đối tác HORECA. Mỗi phương án được trao đổi riêng theo mô hình, khu vực, danh mục và kế hoạch vận hành thực tế.
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '24px', fontFamily: 'var(--font-serif)' }}>
          Phạm vi hỗ trợ
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {services.map(([title, desc]) => (
            <div key={title} style={{ padding: '28px', background: '#fff', borderRadius: '12px', border: '1px solid var(--web-border)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '12px' }}>{title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
          Tư vấn food pairing và trải nghiệm phục vụ
        </h2>
        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '32px' }}>
          Đội ngũ German Taste có thể phối hợp với Bếp trưởng hoặc Quản lý để xây gợi ý <Link href="/food-pairing-bia-duc" style={{ color: 'var(--web-accent-strong)', fontWeight: 600 }}>food pairing</Link>, quy trình rót bia và cách giới thiệu Benediktiner nhất quán cho khách hàng.
        </p>

        <div style={{ padding: '40px', background: 'var(--web-bg-section)', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--web-ink)', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>
            Trao đổi phương án HORECA
          </h3>
          <p style={{ fontSize: '16px', color: 'var(--web-text-secondary)', marginBottom: '24px' }}>
            Liên hệ trực tiếp German Taste để trao đổi danh mục, khu vực, POSM và phương án triển khai phù hợp với mô hình của anh/chị.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={BRAND.socialLinks.zalo} target="_blank" rel="noopener noreferrer" className="btn-primary">Nhắn Zalo HORECA</a>
            <a href={BRAND_TEL_HREF} className="btn-outline">Gọi {BRAND.hotline}</a>
          </div>
        </div>
      </article>
    </div>
  );
}
