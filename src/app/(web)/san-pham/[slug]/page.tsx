import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductCard from '../../components/ProductCard';
import ProductGallery from '../../components/ProductGallery';
import ProductDetailsAccordion from '../../components/ProductDetailsAccordion';
import ProductOrderActions from '../../components/ProductOrderActions';
import ProductConsultationForm from '../../components/ProductConsultationForm';
import JsonLd, { getBreadcrumbSchema, getProductSchema } from '../../components/JsonLd';
import { getPublicProductBySlug, getPublicProducts, getRelatedBeers, getSausageProducts, getRelatedCombo } from '@/lib/data/products';
import { PRODUCT_PLACEHOLDER } from '@/lib/data/productConstants';
import { BRAND } from '@/lib/brand';
import type { ProductCardProps } from '../../components/ProductCard';

export async function generateStaticParams() {
  return getPublicProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicProductBySlug(slug);

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Bia Thầy Tu',
      description: 'Sản phẩm bạn tìm không còn trong danh mục công khai của Bia Thầy Tu.',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${BRAND.siteUrl}/san-pham/${product.slug || product.id}`;
  const metaDescription = product.metaDescription || product.shortDescription;

  return {
    title: `${product.name} | Bia Thầy Tu`,
    description: metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.name} | Bia Thầy Tu`,
      description: metaDescription,
      type: 'website',
      url: canonicalUrl,
      images: product.images?.[0]
        ? [{ url: product.images[0], alt: product.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Bia Thầy Tu`,
      description: metaDescription,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

function getTastingNote(product: ReturnType<typeof getPublicProductBySlug>) {
  if (!product) return '';
  if (product.tastingNotes?.length) return product.tastingNotes.join(' · ');
  if (product.category === 'bia') {
    if ((product.slug || '').includes('dunkel')) return 'Malt rang dịu, caramel nhẹ, hậu vị mềm và cân bằng.';
    if ((product.slug || '').includes('festbier')) return 'Malt êm, thân bia tròn, vị đắng thanh, hợp bàn tiệc và món nướng.';
    if ((product.slug || '').includes('naturtrub')) return 'Lúa mì, chuối chín, đinh hương và hậu vị êm đặc trưng của Weissbier Đức.';
    return 'Hương malt rõ nét, vị bia cân bằng và hậu vị sạch theo phong cách bia Đức.';
  }
  if (product.category === 'xuc-xich') return 'Đậm vị thịt, thơm gia vị kiểu Đức, phù hợp dùng nóng cùng bia.';
  if (product.category === 'vang') return 'Cấu trúc cân bằng, hương vị đặc trưng theo giống nho và vùng sản xuất.';
  return 'Hương vị được tuyển chọn để kết hợp cùng trải nghiệm ẩm thực Đức.';
}

function getPackagingFormat(product: ReturnType<typeof getPublicProductBySlug>) {
  if (!product) return '';
  const format = product.packagingFormat?.trim();
  if (format) return format;
  const name = product.name.toLowerCase();
  if (name.includes('bom 5l')) return 'Bom 5L';
  if (name.includes('thùng 24 lon')) return 'Thùng 24 lon';
  if (name.includes('thùng 24 chai')) return 'Thùng 24 chai';
  if (name.includes('thùng 12 chai')) return 'Thùng 12 chai';
  if (name.includes('lon')) return 'Lon';
  if (name.includes('chai')) return 'Chai';
  return '';
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getPublicProductBySlug(slug);
  if (!product) notFound();

  const tastingNote = getTastingNote(product);
  const packagingFormat = getPackagingFormat(product);
  const isCombo = product.category === 'combo';
  const isAlcohol = product.category === 'bia' || product.category === 'vang' || isCombo;
  const isSausage = product.category === 'xuc-xich';
  const guaranteeTitle = isSausage ? 'Cam kết sản phẩm' : 'Cam kết chính hãng';
  const guaranteeItems = isSausage
    ? [
        'Sản phẩm được bảo quản lạnh theo hướng dẫn của nhà sản xuất.',
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
  const productUrl = `${BRAND.siteUrl}/san-pham/${product.slug || product.id}`;

  return (
    <div className="subpage-wrap">
      <JsonLd type="product" data={getProductSchema({
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        url: productUrl,
        description: product.shortDescription,
        images: product.images || undefined,
        abv: product.abv || undefined,
        volume: product.volume || undefined,
        category: product.category,
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: BRAND.siteUrl },
        { name: 'Sản Phẩm', url: `${BRAND.siteUrl}/san-pham` },
        { name: product.name, url: productUrl },
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
                {BRAND.legalDisclaimer}
              </p>
            )}

            {isSausage && (
              <div className="product-detail-tags">
                {(() => {
                  const s = product.slug || '';
                  if (s === 'the-wurst-wiener-hun-khoi-500g') return ['500g/gói', 'Hun khói', 'Ăn kèm bia'];
                  if (s === 'the-wurst-thuringer-bratwurst-500g') return ['500g/gói', 'Bratwurst', 'Nướng áp chảo'];
                  if (s === 'the-wurst-combo-cold-cut-150g') return ['Cold cut', '150g', 'Ăn kèm bia Đức'];
                  return [];
                })().map((tag) => (
                  <span key={tag} className="detail-pill-tag">{tag}</span>
                ))}
              </div>
            )}

            {isCombo && (
              <div className="product-detail-tags">
                {['Bia & Xúc xích Đức', 'Quà tặng kèm'].map((tag) => (
                  <span key={tag} className="detail-pill-tag">{tag}</span>
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

            <ProductOrderActions product={product} />

            <div style={{ margin: '20px 0', padding: '16px 18px', borderLeft: '3px solid var(--web-accent)', background: 'var(--web-bg-warm)', borderRadius: '0 10px 10px 0' }}>
              <strong style={{ display: 'block', marginBottom: '5px', color: 'var(--web-ink)' }}>Hương vị nổi bật</strong>
              <span style={{ color: 'var(--web-text-muted)', lineHeight: 1.6 }}>{tastingNote}</span>
            </div>

            <div className="product-description">
              {product.description || (
                <p>Sản phẩm {product.name} được tuyển chọn với thông tin nguồn gốc rõ ràng, phù hợp cho nhu cầu thưởng thức, biếu tặng hoặc phục vụ tại nhà hàng và sự kiện.</p>
              )}
            </div>

            <div className="product-guarantee">
              <h4><span>🛡️</span> {guaranteeTitle}</h4>
              <ul>{guaranteeItems.map((item) => <li key={item}>{item}</li>)}</ul>
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
                  <span>🍢</span> Xúc Xích Đức Ăn Kèm
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sausageProducts.map((sausage) => (
                    <Link key={sausage.id} href={`/san-pham/${sausage.slug}`} className="pairing-sausage-item" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'var(--web-bg-warm)', border: '1px solid var(--web-border)', color: 'inherit', textDecoration: 'none' }}>
                      <div style={{ width: '70px', height: '70px', position: 'relative', flexShrink: 0, background: '#fff', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--web-border)' }}>
                        <img src={sausage.images?.[0] || PRODUCT_PLACEHOLDER} alt={sausage.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--web-ink)' }}>{sausage.name}</h4>
                        <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '12px', color: 'var(--web-accent-strong)', fontWeight: 600, textDecoration: 'underline' }}>Xem chi tiết &rsaquo;</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {relatedCombo && (
                <div style={{ background: 'var(--web-ink)', color: '#fff', border: '1px solid var(--web-ink-soft)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--web-shadow-xl)', position: 'relative', overflow: 'hidden' }}>
                  <div>
                    <h3 style={{ color: 'var(--web-accent)', borderBottom: '2px solid var(--web-accent-strong)', paddingBottom: '12px', marginBottom: '20px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><span>🎁</span> Combo Đề Xuất</h3>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <div style={{ width: '100px', height: '100px', position: 'relative', background: '#fff', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={relatedCombo.images?.[0] || PRODUCT_PLACEHOLDER} alt={relatedCombo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: '1 1 180px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{relatedCombo.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#a0aab8', lineHeight: 1.5 }}>{relatedCombo.shortDescription}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--web-ink-soft)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Link href={`/san-pham/${relatedCombo.slug}`} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none', background: 'var(--web-accent)', color: 'var(--web-ink)', display: 'inline-block', border: 'none', cursor: 'pointer', textAlign: 'center' }}>Xem chi tiết</Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {relatedProductsData.length > 0 && (
          <section className="related-products related-products-section">
            <div className="section-header-center">
              <span className="section-label">Gợi Ý Thêm</span>
              <h2 className="section-title related-products-title">Có Thể Bạn Sẽ Thích</h2>
            </div>
            <div className="grid-featured-products">
              {(relatedProductsData as unknown as ProductCardProps[]).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} showCTA={true} showReferencePriceNote={true} />
              ))}
            </div>
          </section>
        )}

        <ProductConsultationForm productName={product.name} productSlug={product.slug || product.id} />
      </div>
    </div>
  );
}