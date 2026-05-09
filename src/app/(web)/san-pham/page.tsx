import { createServerSupabase } from '@/lib/supabase/server';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { getTastingNotes } from '../utils/getTastingNotes';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner',
  description: 'Thưởng thức bia Benediktiner Weissbier, Dunkel, Bom 5L — 100% nhập khẩu nguyên chai từ Đức. Chuẩn Luật Tinh Khiết 1516. Giá từ đại lý. Giao toàn quốc.',
  alternates: {
    canonical: 'https://biathaytu.com/san-pham',
  },
};

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  abv: string | null;
  ibu: number | null;
  volume: string | null;
  images: string[] | null;
  price: number | null;
  haravan_url: string | null;
  category: string | null;
  sort_order: number;
  is_featured: boolean;
}

export default async function ProductsPage() {
  const supabase = await createServerSupabase();
  
  const { data: beerProducts } = await supabase
    .from('products')
    .select('id, name, slug, description, short_description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('category', 'bia')
    .not('name', 'ilike', '%bitburger%')
    .order('sort_order', { ascending: true });


  const { data: accessories } = await supabase
    .from('products')
    .select('id, name, slug, description, short_description, abv, ibu, volume, images, price, haravan_url, category, sort_order, is_featured')
    .eq('category', 'phu-kien')
    .order('sort_order', { ascending: true });

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '120px', backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://biathaytu.com' },
        { name: 'Sản Phẩm', url: 'https://biathaytu.com/san-pham' },
      ])} />

      {/* HEADER */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="section-label">Bộ Sưu Tập</span>
        <h1 className="page-title">Tuyệt Tác Nguyên Bản</h1>
        <p className="page-subtitle">
          Trải nghiệm tinh hoa bia tu viện Đức chính gốc. Mỗi nhấp ngụm là một hành trình đánh thức mọi giác quan.
        </p>
      </section>

      {/* BEER PRODUCTS */}
      <section className="container" aria-label="Bia Đức">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {(beerProducts as Product[] | null)?.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              description={product.description?.substring(0, 80) || getTastingNotes(product.name)}
              showCTA={true}
            />
          ))}
        </div>

        {(!beerProducts || beerProducts.length === 0) && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--web-text-secondary)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px' }}>Chưa có sản phẩm nào.</h2>
          </div>
        )}
      </section>


      {/* ACCESSORIES */}
      {accessories && accessories.length > 0 && (
        <section className="container" style={{ marginTop: '100px' }} aria-label="Phụ kiện">
          <div className="section-header-center" style={{ marginBottom: '48px' }}>
            <span className="section-label">Phụ Kiện</span>
            <h2 className="section-title">Hoàn Thiện Trải Nghiệm</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            {(accessories as Product[] | null)?.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                showCTA={true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
