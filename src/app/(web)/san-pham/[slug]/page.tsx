import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import ZaloCTA from '../../components/ZaloCTA';
import ProductOrderActions from '../../components/ProductOrderActions';
import ProductDetailsAccordion from '../../components/ProductDetailsAccordion';
import ProductGallery from '../../components/ProductGallery';
import JsonLd, { getProductSchema, getBreadcrumbSchema } from '../../components/JsonLd';
import ProductCard from '../../components/ProductCard';
import { getTastingNotes } from '../../utils/getTastingNotes';

export const revalidate = 3600;

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
}

function formatPrice(price: number | null): string {
  if (!price) return '';
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('products')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  const product = data as ProductData | null;
  if (!product) return {};

  return {
    title: `${product.name} — Bia Thầy Tu`,
    description: product.description || `Khám phá hương vị tuyệt hảo của ${product.name}, dòng bia nhập khẩu chính hãng từ Đức.`,
    alternates: {
      canonical: `https://www.biathaytu.com/san-pham/${product.slug || product.id}`,
    },
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from('products')
    .select('id, name, slug, description, abv, ibu, volume, images, price, haravan_url, origin, category')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  const product = data as ProductData | null;

  if (!product) {
    notFound();
  }

  // Fetch related products (Cross-sell)
  const { data: relatedProductsData } = await supabase
    .from('products')
    .select('id, name, slug, description, short_description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('category', 'bia')
    .neq('id', product.id)
    .not('name', 'ilike', '%bitburger%')
    .order('sort_order', { ascending: true })
    .limit(4);

  return (
    <div className="subpage-wrap">
      {/* Structured Data — Product + Breadcrumb */}
      <JsonLd type="product" data={getProductSchema({
        name: product.name,
        slug: product.slug || product.id,
        description: product.description || undefined,
        price: product.price || undefined,
        images: product.images || undefined,
        abv: product.abv || undefined,
        volume: product.volume || undefined,
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
          <span style={{ color: 'var(--web-text)' }}> {product.name}</span>
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
          <section className="related-products" style={{ marginTop: '100px', borderTop: '1px solid var(--web-border)', paddingTop: '60px' }}>
            <div className="section-header-center" style={{ marginBottom: '40px' }}>
              <span className="section-label">Gợi Ý Thêm</span>
              <h2 className="section-title" style={{ fontSize: '32px' }}>Có Thể Bạn Sẽ Thích</h2>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px',
            }}>
              {(relatedProductsData as any[])?.map((relatedProduct) => (
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
