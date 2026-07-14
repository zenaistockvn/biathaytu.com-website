import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlugOrId, getRelatedBeers, getAllProducts, getSausageProducts, getRelatedCombo } from '@/lib/data/products';
import ProductOrderActions from '../../components/ProductOrderActions';
import ProductDetailsAccordion from '../../components/ProductDetailsAccordion';
import ProductGallery from '../../components/ProductGallery';
import JsonLd, { getProductSchema, getBreadcrumbSchema } from '../../components/JsonLd';
import ProductCard, { ProductCardProps } from '../../components/ProductCard';
import { getTastingNotes } from '../../utils/getTastingNotes';
import { toAbsoluteSiteUrl } from '@/lib/seo/site';

export function generateStaticParams() {
  return getAllProducts()
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
}

function formatPrice(price: number | null): string {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug) as ProductData | null;
  if (!product) return {};
  const productUrl = `https://www.biathaytu.com/san-pham/${product.slug || product.id}`;

  const ogImageUrl = toAbsoluteSiteUrl(product.images?.[0] || '/images/sanh_bia_duc_cover.png');
  const pageDescription = product.description || `Khám phá hương vị tuyệt hảo của ${product.name}, dòng bia nhập khẩu chính hãng từ Đức.`;

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
      title: product.name,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = getProductBySlugOrId(slug) as ProductData | null;

  if (!product) {
    notFound();
  }

  const isSausage = product.category === 'xuc-xich';
  const isCombo = product.category === 'combo';
  const guaranteeTitle = isSausage || isCombo ? 'Cam Kết Thực Phẩm Lạnh & Tươi' : 'Cam Kết Chất Lượng';
  const guaranteeItems = isSausage || isCombo
    ? [
        'Sản phẩm The Wurst kiểu Đức, bảo quản lạnh từ 0 - 4°C chuyên dụng.',
        'Tư vấn cách làm nóng, áp chảo, nướng hoặc bày lạnh theo từng dòng sản phẩm.',
        'Giao hàng hỏa tốc trong 2 giờ nội thành, nhắc khách cho vào tủ lạnh ngay khi nhận.',
        'Hỗ trợ kiểm tra thông tin lô hàng và hạn sử dụng rõ ràng trên bao bì.',
      ]
    : [
        '100% Sản phẩm nhập khẩu nguyên chai từ nhà máy Đức.',
        'Bảo quản đạt chuẩn nhiệt độ chuyên dụng.',
        'Chính sách giao hàng linh hoạt, hỏa tốc khu vực nội thành.',
        'Hỗ trợ xử lý sự cố đổ vỡ trong quá trình vận chuyển.',
      ];

  // Related products (Cross-sell)
  const relatedProductsData = getRelatedBeers(product.id, 4);

  // Gợi ý Xúc xích & Combo khi xem bia
  const isBeer = product.category === 'bia';
  const sausageProducts = isBeer ? getSausageProducts() : [];
  const relatedCombo = isBeer ? getRelatedCombo(product.slug || product.id) : null;

  return (
    <div className="subpage-wrap">
      {/* Structured Data — Product + Breadcrumb */}
      <JsonLd type="product" data={getProductSchema({
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        description: product.description || undefined,
        price: product.price || undefined,
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
        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link href="/">Trang chủ</Link> &rsaquo; 
          <Link href="/san-pham"> Sản phẩm</Link> &rsaquo; 
          <span className="breadcrumb-active"> {product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* IMAGE */}
          <div className="product-img-sticky">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* PRODUCT INFO */}
          <div>
            <h1 className="product-detail-name">{product.name}</h1>

            {isSausage && (
              <div className="product-detail-tags">
                {(() => {
                  const s = product.slug || '';
                  if (s === 'the-wurst-wiener-hun-khoi-500g') {
                    return ['500g/gói', 'Hun khói', 'Ăn kèm bia'];
                  }
                  if (s === 'the-wurst-thuringer-bratwurst-500g') {
                    return ['500g/gói', 'Bratwurst', 'Nướng áp chảo'];
                  }
                  if (s === 'the-wurst-combo-cold-cut-150g') {
                    return ['Combo 99K', 'Cold cut', '150g', 'Ăn kèm bia Đức'];
                  }
                  return [];
                })().map((tag) => {
                  const isHighlight = tag === 'Combo 99K';
                  return (
                    <span 
                      key={tag} 
                      className={`detail-pill-tag${isHighlight ? ' highlight-tag' : ''}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}

            {isCombo && (
              <div className="product-detail-tags">
                {['Combo Tiết Kiệm', 'Bia & Xúc xích Đức', 'Quà tặng kèm'].map((tag) => {
                  const isHighlight = tag === 'Combo Tiết Kiệm';
                  return (
                    <span 
                      key={tag} 
                      className={`detail-pill-tag${isHighlight ? ' highlight-tag' : ''}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Price */}
            {product.price && (
              <div className="product-detail-price">{formatPrice(product.price)}</div>
            )}

            {/* Specs */}
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
              <div className="product-spec-item">
                <div className="product-spec-label">Xuất xứ</div>
                <div className="product-spec-value">{product.origin || 'Đức'}</div>
              </div>
            </div>

            {/* Description */}
            <div className="product-description">
              {product.description || (
                <p>
                  Sản phẩm {product.name} được nhập khẩu trực tiếp từ Đức, đáp ứng mọi tiêu chuẩn khắt khe nhất của 
                  tu viện Ettal và Luật Tinh Khiết năm 1516 (Reinheitsgebot). Đảm bảo mang đến trải nghiệm 
                  hương vị tuyệt vời nhất cho người thưởng thức.
                </p>
              )}
            </div>

            {/* Buy buttons */}
            <ProductOrderActions product={product} />

            <div className="product-guarantee">
               <h4>
                 <span>🛡️</span> {guaranteeTitle}
               </h4>
               <ul>
                 {guaranteeItems.map((item) => (
                   <li key={item}>{item}</li>
                 ))}
               </ul>
            </div>

            {/* Accordion Details */}
            <ProductDetailsAccordion productName={product.name} category={product.category} />
          </div>
        </div>

        {/* PERFECT PAIRINGS (SAUSAGE & COMBO RECOMMENDATIONS) */}
        {isBeer && sausageProducts.length > 0 && (
          <section className="perfect-pairings-section" style={{ marginTop: '60px', borderTop: '1px solid var(--web-border)', paddingTop: '60px' }}>
            <div className="section-header-center" style={{ marginBottom: '40px' }}>
              <span className="section-label" style={{ color: 'var(--web-gold)', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Combo & Đồ Nhắm Đề Xuất</span>
              <h2 className="section-title" style={{ color: 'var(--web-navy)', fontSize: '28px', fontWeight: 800, margin: 0 }}>Món Nhắm Hoàn Hảo</h2>
              <p style={{ color: 'var(--web-text-secondary)', marginTop: '8px', fontSize: '15px' }}>Xem bia ngon phải có mồi xịn. Hãy thưởng thức cùng xúc xích Đức truyền thống hoặc mua theo Combo để có giá ưu đãi hơn!</p>
            </div>

            <div className="pairings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
              {/* Left Column: Sausage suggestions */}
              <div style={{ background: 'var(--web-card-bg)', border: '1px solid var(--web-border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--web-shadow)' }}>
                <h3 style={{ color: 'var(--web-navy)', borderBottom: '2px solid var(--web-gold)', paddingBottom: '12px', marginBottom: '20px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🍢</span> Xúc Xích Đức Ăn Kèm
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sausageProducts.map((sausage) => (
                    <div key={sausage.id} className="pairing-sausage-item" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'var(--web-bg-warm)', border: '1px solid var(--web-border)' }}>
                      <div style={{ width: '70px', height: '70px', position: 'relative', flexShrink: 0, background: '#fff', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--web-border)' }}>
                        <img src={sausage.images?.[0] || '/images/products/placeholder.png'} alt={sausage.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: 'var(--web-navy)' }}>{sausage.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--web-red)' }}>{formatPrice(sausage.price)}</span>
                          <Link href={`/san-pham/${sausage.slug}`} style={{ fontSize: '12px', color: 'var(--web-gold-dark)', fontWeight: 600, textDecoration: 'underline' }}>
                            Xem chi tiết &rsaquo;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Recommended Combo */}
              {relatedCombo && (
                <div style={{ background: 'var(--web-navy)', color: '#fff', border: '1px solid var(--web-navy-light)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--web-shadow-xl)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '15px', right: '-35px', background: 'var(--web-gold)', color: 'var(--web-navy)', transform: 'rotate(45deg)', padding: '6px 40px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Tiết Kiệm
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--web-gold)', borderBottom: '2px solid var(--web-gold-dark)', paddingBottom: '12px', marginBottom: '20px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🎁</span> Combo Đề Xuất
                    </h3>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <div style={{ width: '100px', height: '100px', position: 'relative', background: '#fff', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={relatedCombo.images?.[0] || '/images/products/placeholder.png'} alt={relatedCombo.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: '1 1 180px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{relatedCombo.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#a0aab8', lineHeight: 1.5 }}>{relatedCombo.description?.substring(0, 150)}...</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--web-navy-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#a0aab8' }}>Giá combo ưu đãi:</span>
                      <strong style={{ fontSize: '22px', color: 'var(--web-gold)', fontWeight: 800 }}>{formatPrice(relatedCombo.price)}</strong>
                    </div>
                    <Link href={`/san-pham/${relatedCombo.slug}`} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none', background: 'var(--web-gold)', color: 'var(--web-navy)', display: 'inline-block', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
                      Xem Combo Ngay
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* RELATED PRODUCTS */}
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
                  description={relatedProduct.description?.substring(0, 80) || getTastingNotes(relatedProduct.name)}
                  showCTA={true}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
