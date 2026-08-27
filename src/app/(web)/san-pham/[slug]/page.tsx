import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlugOrId, getRelatedBeers, getVisibleProducts, getSausageProducts, getRelatedCombo } from '@/lib/data/products';
import ProductOrderActions from '../../components/ProductOrderActions';
import ProductConsultationForm from '../../components/ProductConsultationForm';
import ProductDetailsAccordion from '../../components/ProductDetailsAccordion';
import ProductGallery from '../../components/ProductGallery';
import JsonLd, { getProductSchema, getBreadcrumbSchema } from '../../components/JsonLd';
import ProductCard, { ProductCardProps } from '../../components/ProductCard';
import { getTastingNotes } from '../../utils/getTastingNotes';
import { toAbsoluteSiteUrl } from '@/lib/seo/site';

export function generateStaticParams() {
  return getVisibleProducts()
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  abv: string | null;
  ibu: number | null;
  volume: string | null;
  images: string[] | null;
  price: number | null;
  haravan_url: string | null;
  origin: string | null;
  category: string | null;
  hidden?: boolean;
}

function getPackagingFormat(name: string): string | null {
  const match = name.match(/\b(Thùng|Két|Bom|Bộ|Set|Combo)\b[^—,]*/i);
  return match?.[0]?.trim() || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug) as ProductData | null;
  if (!product || product.hidden) return {};
  const productUrl = `https://www.biathaytu.com/san-pham/${product.slug || product.id}`;

  const ogImageUrl = toAbsoluteSiteUrl(product.images?.[0] || '/images/sanh_bia_duc_cover.png');
  const pageDescription = product.description || `Khám phá hương vị và thông tin chi tiết của ${product.name}. Liên hệ Bia Thầy Tu để được tư vấn sản phẩm.`;

  return {
    title: product.name,
    description: pageDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.name,
      description: pageDescription,
      url: productUrl,
      type: 'website',
      siteName: 'Bia Thầy Tu',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Bia Thầy Tu`,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug) as ProductData | null;

  if (!product || product.hidden) {
    notFound();
  }

  const isSausage = product.category === 'xuc-xich';
  const isCombo = product.category === 'combo';
  const isAlcohol = product.category === 'bia' || product.category === 'vang' || isCombo;
  const packagingFormat = getPackagingFormat(product.name);
  const tastingNote = getTastingNotes(product.name);
  const guaranteeTitle = isSausage || isCombo ? 'Cam Kết Thực Phẩm Lạnh & Tươi' : 'Cam Kết Chất Lượng';
  const guaranteeItems = isSausage || isCombo
    ? [
        'Sản phẩm The Wurst kiểu Đức, bảo quản lạnh từ 0 - 4°C chuyên dụng.',
        'Tư vấn cách làm nóng, áp chảo, nướng hoặc bày lạnh theo từng dòng sản phẩm.',
        'Hỗ trợ thông tin giao nhận và hướng dẫn bảo quản ngay sau khi nhận sản phẩm.',
        'Hỗ trợ kiểm tra thông tin lô hàng và hạn sử dụng rõ ràng trên bao bì.',
      ]
    : [
        'Sản phẩm nhập khẩu chính hãng với thông tin nguồn gốc rõ ràng.',
        'Bảo quản theo điều kiện phù hợp với từng dòng sản phẩm.',
        'Tư vấn lựa chọn quy cách theo nhu cầu sử dụng, biếu tặng hoặc sự kiện.',
        'Hỗ trợ thông tin giao nhận khi khách hàng liên hệ qua hotline hoặc Zalo.',
      ];

  const relatedProductsData = getRelatedBeers(product.id, 4);
  const isBeer = product.category === 'bia';
  const sausageProducts = isBeer ? getSausageProducts() : [];
  const relatedCombo = isBeer ? getRelatedCombo(product.slug || product.id) : null;

  return (
    <div className="subpage-wrap">
      <JsonLd type="product" data={getProductSchema({
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        description: product.description || undefined,
        images: product.images || undefined,
        abv: product.abv || undefined,
        volume: product.volume || undefined,
        category: product.category,
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' },
        { name: product.name, url: `https://www.biathaytu.com/san-pham/${product.slug || product.id}` },
      ])} />

      <div className="container">
        <div className="product-breadcrumb">
          <Link href="/">Trang chủ</Link> &rsaquo;
          <Link href="/san-pham"> Sản phẩm</Link> &rsaquo;
          <span className="breadcrumb-active"> {product.name}</span>
        </div>

        <div className="product-detail-grid">
          <div className="product-img-sticky">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          <div>
            <h1 className="product-detail-name">{product.name}</h1>
            {isAlcohol && (
              <p style={{ margin: '8px 0 18px', color: 'var(--web-text-muted)', fontSize: '13px', fontWeight: 600 }}>
                Sản phẩm chỉ dành cho người từ đủ 18 tuổi.
              </p>
            )}

            <ProductOrderActions product={product} />

            {isSausage && (
              <div className="product-detail-tags">
                {(() => {
                  const s = product.slug || '';
                  if (s === 'the-wurst-wiener-hun-khoi-500g') return ['500g/gói', 'Hun khói', 'Ăn kèm bia'];
                  if (s === 'the-wurst-thuringer-bratwurst-500g') return ['500g/gói', 'Bratwurst', 'Nướng áp chảo'];
                  if (s === 'the-wurst-combo-cold-cut-150g') return ['Combo 99K', 'Cold cut', '150g', 'Ăn kèm bia Đức'];
                  return [];
                })().map((tag) => (
                  <span key={tag} className={`detail-pill-tag${tag === 'Combo 99K' ? ' highlight-tag' : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {isCombo && (
              <div className="product-detail-tags">
                {['Combo Tham Khảo', 'Bia & Xúc xích Đức', 'Quà tặng kèm'].map((tag) => (
                  <span key={tag} className={`detail-pill-tag${tag === 'Combo Tham Khảo' ? ' highlight-tag' : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="product-specs">
              {product.abv && (
                <div className="product-spec-item">
                  <div className="product-spec-label">Nồng độ cồn</div>
                  <div className="product-spec-value">{product.abv}%</div>
                </div>
              )}
              {product.ibu && (
                <div className="product-spec-item">
                  <div className="product-spec-label">Độ đắng (IBU)</div>
                  <div className="product-spec-value">{product.ibu}</div>
                </div>
              )}
              {product.volume && (
                <div className="product-spec-item">
                  <div className="product-spec-label">{isSausage ? 'Quy cách' : 'Dung tích'}</div>
                  <div className="product-spec-value">{product.volume}</div>
                </div>
              )}
              {packagingFormat && !isSausage && (
                <div className="product-spec-item">
                  <div className="product-spec-label">Quy cách</div>
                  <div className="product-spec-value">{packagingFormat}</div>
                </div>
              )}
              <div className="product-spec-item">
                <div className="product-spec-label">Xuất xứ</div>
                <div className="product-spec-value">{product.origin || 'Đức'}</div>
              </div>
            </div>

            <div
              style={{
                margin: '20px 0',
                padding: '16px 18px',
                borderLeft: '3px solid var(--web-accent)',
                background: 'var(--web-bg-warm)',
                borderRadius: '0 10px 10px 0',
              }}
            >
              <strong style={{ display: 'block', marginBottom: '5px', color: 'var(--web-ink)' }}>Hương vị nổi bật</strong>
              <span style={{ color: 'var(--web-text-muted)', lineHeight: 1.6 }}>{tastingNote}</span>
            </div>

            <div className="product-description">
              {product.description || (
                <p>
                  Sản phẩm {product.name} được tuyển chọn với thông tin nguồn gốc rõ ràng, phù hợp cho nhu cầu thưởng thức, biếu tặng hoặc phục vụ tại nhà hàng và sự kiện.
                </p>
              )}
            </div>

            <div className="product-guarantee">
              <h4>
                {guaranteeTitle}
              </h4>
              <ul>
                {guaranteeItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <ProductDetailsAccordion productName={product.name} category={product.category} />
          </div>
        </div>

        {isBeer && sausageProducts.length > 0 && (
          <section className="perfect-pairings-section" style={{ marginTop: '60px', borderTop: '1px solid var(--web-border)', paddingTop: '60px' }}>
            <div className="section-header-center" style={{ marginBottom: '40px' }}>
              <span className="section-label" style={{ color: 'var(--web-accent)', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Gợi Ý Food Pairing</span>
              <h2 className="section-title" style={{ color: 'var(--web-ink)', fontSize: '28px', fontWeight: 800, margin: 0 }}>Món Nhắm Hoàn Hảo</h2>
              <p style={{ color: 'var(--web-text-secondary)', marginTop: '8px', fontSize: '15px' }}>Tham khảo xúc xích Đức truyền thống và các combo phù hợp để hoàn thiện trải nghiệm thưởng thức.</p>
            </div>

            <div className="pairings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
              <div style={{ background: 'var(--web-card-bg)', border: '1px solid var(--web-border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--web-shadow)' }}>
                <h3 style={{ color: 'var(--web-ink)', borderBottom: '2px solid var(--web-accent)', paddingBottom: '12px', marginBottom: '20px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Xúc Xích Đức Ăn Kèm
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sausageProducts.map((sausage) => (
                    <Link
                      key={sausage.id}
                      href={`/san-pham/${sausage.slug}`}
                      className="pairing-sausage-item"
                      style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'var(--web-bg-warm)', border: '1px solid var(--web-border)', color: 'inherit', textDecoration: 'none' }}
                    >
                      <div style={{ width: '70px', height: '70px', position: 'relative', flexShrink: 0, background: '#fff', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--web-border)' }}>
                        <Image
                          src={sausage.images?.[0] || '/images/products/placeholder.png'}
                          alt={sausage.name}
                          fill
                          sizes="70px"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--web-ink)' }}>{sausage.name}</h4>
                        <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '12px', color: 'var(--web-accent-strong)', fontWeight: 600, textDecoration: 'underline' }}>
                          Xem chi tiết &rsaquo;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {relatedCombo && (
                <div data-surface="ink" style={{ background: 'var(--web-ink)', color: '#fff', border: '1px solid var(--web-ink-soft)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--web-shadow-xl)', position: 'relative', overflow: 'hidden' }}>
                  <div>
                    <h3 style={{ color: 'var(--web-accent-on-ink)', borderBottom: '2px solid var(--web-accent-on-ink)', paddingBottom: '12px', marginBottom: '20px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Combo Đề Xuất
                    </h3>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <div style={{ width: '100px', height: '100px', position: 'relative', background: '#fff', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                          src={relatedCombo.images?.[0] || '/images/products/placeholder.png'}
                          alt={relatedCombo.name}
                          fill
                          sizes="100px"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ flex: '1 1 180px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{relatedCombo.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#a0aab8', lineHeight: 1.5 }}>{relatedCombo.description}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--web-ink-soft)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Link href={`/san-pham/${relatedCombo.slug}`} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none', background: 'var(--web-accent)', color: 'var(--web-ink)', display: 'inline-block', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {relatedProductsData && relatedProductsData.length > 0 && (
          <section className="related-products related-products-section">
            <div className="section-header-center">
              <span className="section-label">Gợi Ý Thêm</span>
              <h2 className="section-title related-products-title">Có Thể Bạn Sẽ Thích</h2>
            </div>

            <div className="grid-featured-products">
              {(relatedProductsData as unknown as ProductCardProps[])?.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  {...relatedProduct}
                  description={relatedProduct.description || getTastingNotes(relatedProduct.name)}
                  showCTA={true}
                  showReferencePriceNote={true}
                />
              ))}
            </div>
          </section>
        )}

        <ProductConsultationForm productName={product.name} />
      </div>
    </div>
  );
}
