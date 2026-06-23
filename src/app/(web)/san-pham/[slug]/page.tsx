import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlugOrId, getRelatedBeers, getAllProducts } from '@/lib/data/products';
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
    title: `${product.name} — Bia Thầy Tu`,
    description: pageDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} — Bia Thầy Tu`,
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

  if (!product) {
    notFound();
  }

  // Related products (Cross-sell)
  const relatedProductsData = getRelatedBeers(product.id, 4);

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
                  <div className="product-spec-label">Dung tích</div>
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
                 <span>🛡️</span> Cam Kết Chất Lượng
               </h4>
               <ul>
                 <li>100% Sản phẩm nhập khẩu nguyên chai từ nhà máy Đức.</li>
                 <li>Bảo quản đạt chuẩn nhiệt độ chuyên dụng.</li>
                 <li>Chính sách giao hàng linh hoạt, hỏa tốc khu vực nội thành.</li>
                 <li>Hỗ trợ xử lý sự cố đỗ vỡ trong quá trình vận chuyển.</li>
               </ul>
            </div>

            {/* Accordion Details */}
            <ProductDetailsAccordion productName={product.name} />
          </div>
        </div>

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
