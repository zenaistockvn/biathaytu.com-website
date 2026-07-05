import { getBeerProducts, getAccessories, getSausageProducts, getComboProducts } from '@/lib/data/products';
import ProductCard from '../components/ProductCard';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { getTastingNotes } from '../utils/getTastingNotes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner',
  description: 'Thưởng thức bia Benediktiner Weissbier, Dunkel, Bom 5L — 100% nhập khẩu nguyên chai từ Đức. Chuẩn Luật Tinh Khiết 1516. Giá từ đại lý. Giao toàn quốc.',
  alternates: {
    canonical: 'https://www.biathaytu.com/san-pham',
  },
  openGraph: {
    title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner',
    description: 'Thưởng thức bia Benediktiner Weissbier, Dunkel, Bom 5L — 100% nhập khẩu nguyên chai từ Đức. Chuẩn Luật Tinh Khiết 1516. Giá từ đại lý. Giao toàn quốc.',
    type: 'website',
    url: 'https://www.biathaytu.com/san-pham',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner',
    description: 'Thưởng thức bia Benediktiner Weissbier, Dunkel, Bom 5L — 100% nhập khẩu nguyên chai từ Đức. Chuẩn Luật Tinh Khiết 1516. Giá từ đại lý. Giao toàn quốc.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

interface Product {
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
  category: string | null;
  sort_order: number;
  is_featured: boolean;
}

export default async function ProductsPage() {
  const beerProducts = getBeerProducts({ excludeBitburger: true });
  const accessories = getAccessories();
  const sausageProducts = getSausageProducts();
  const comboProducts = getComboProducts();

  return (
    <div className="products-page-container" id="tat-ca">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://biathaytu.com' },
        { name: 'Sản Phẩm', url: 'https://biathaytu.com/san-pham' },
      ])} />

      {/* HEADER */}
      <section className="container catalog-header">
        <span className="section-label">Bộ Sưu Tập</span>
        <h1 className="page-title">Tuyệt Tác Nguyên Bản</h1>
        <p className="page-subtitle">
          Trải nghiệm tinh hoa bia tu viện Đức chính gốc. Mỗi nhấp ngụm là một hành trình đánh thức mọi giác quan.
        </p>

        {/* Pill Navigation */}
        <div className="catalog-pills-nav-wrapper">
          <div className="catalog-pills-nav">
            <a href="#tat-ca" className="catalog-pill-link">Tất cả</a>
            <a href="#bia-duc" className="catalog-pill-link">Bia Đức</a>
            <a href="#combo-uu-dai" className="catalog-pill-link highlight-pill">Combo Ưu Đãi</a>
            <a href="#xuc-xich-duc" className="catalog-pill-link">Xúc Xích Đức</a>
            <a href="#phu-kien" className="catalog-pill-link">Phụ Kiện</a>
            <a href="#combo-cold-cut-99k" className="catalog-pill-link">Combo 99K</a>
          </div>
        </div>
      </section>

      {/* BEER PRODUCTS */}
      <section className="container" id="bia-duc" aria-label="Bia Đức">
        <div className="grid-featured-products">
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
          <div className="empty-state-container">
            <h2 className="empty-state-title">Chưa có sản phẩm nào.</h2>
          </div>
        )}
      </section>

      {/* SAUSAGE PRODUCTS */}
      {sausageProducts && sausageProducts.length > 0 && (
        <section className="container mt-100" id="xuc-xich-duc" aria-label="Xúc xích Đức">
          <div className="section-header-center mb-48">
            <span className="section-label">Món Ăn Kèm Bia</span>
            <h2 className="section-title">Xúc Xích Đức</h2>
            <p className="page-subtitle">
              Xúc xích và thịt nguội thủ công kiểu Đức, hợp dùng cùng bia, vang,
              bữa gia đình hoặc bàn tiệc gọn tại nhà.
            </p>
          </div>

          <div className="grid-featured-products">
            {(sausageProducts as Product[] | null)?.map((product) => {
              const isColdCutDeal = product.slug === 'the-wurst-combo-cold-cut-150g';
              let quickTags: string[] | undefined = undefined;
              let cardId: string | undefined = undefined;

              if (product.slug === 'the-wurst-wiener-hun-khoi-500g') {
                quickTags = ['500g/gói', 'Hun khói', 'Ăn kèm bia'];
              } else if (product.slug === 'the-wurst-thuringer-bratwurst-500g') {
                quickTags = ['500g/gói', 'Bratwurst', 'Nướng áp chảo'];
              } else if (isColdCutDeal) {
                quickTags = ['150g/combo', 'Cold cut', 'Combo 99K'];
                cardId = 'combo-cold-cut-99k';
              }

              return (
                <ProductCard
                  key={product.id}
                  {...product}
                  description={product.description?.substring(0, 110)}
                  highlightLabel={isColdCutDeal ? 'Ưu đãi còn 99K' : undefined}
                  quickTags={quickTags}
                  cardId={cardId}
                  showCTA={true}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ACCESSORIES */}
      {accessories && accessories.length > 0 && (
        <section className="container mt-100" id="phu-kien" aria-label="Phụ kiện">
          <div className="section-header-center mb-48">
            <span className="section-label">Phụ Kiện</span>
            <h2 className="section-title">Hoàn Thiện Trải Nghiệm</h2>
          </div>

          <div className="accessories-grid">
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
