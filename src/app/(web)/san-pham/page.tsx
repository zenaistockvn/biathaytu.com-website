import { getBeerProducts, getAccessories, getSausageProducts, getComboProducts, getProductsByCategory } from '@/lib/data/products';
import ProductCard from '../components/ProductCard';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { getTastingNotes } from '../utils/getTastingNotes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner & Bitburger',
  description: 'Thưởng thức bia Benediktiner Weissbier, Dunkel, Bitburger Premium Pils, Bom 5L — 100% nhập khẩu nguyên chai từ Đức. Chuẩn Luật Tinh Khiết 1516. Giá tham khảo, liên hệ để được tư vấn.',
  alternates: {
    canonical: 'https://www.biathaytu.com/san-pham',
  },
  openGraph: {
    title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner & Bitburger',
    description: 'Khám phá Benediktiner, Bitburger, combo, vang Đức, xúc xích và phụ kiện. Giá tham khảo, liên hệ Bia Thầy Tu để được tư vấn.',
    type: 'website',
    url: 'https://www.biathaytu.com/san-pham',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner & Bitburger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bộ Sưu Tập Bia Đức Chính Hãng — Benediktiner & Bitburger',
    description: 'Khám phá các dòng sản phẩm Bia Thầy Tu. Giá tham khảo, liên hệ để được tư vấn.',
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

function isBenediktiner(product: Product) {
  return product.name.toLowerCase().includes('benediktiner');
}

function isBitburgerFamily(product: Product) {
  const name = product.name.toLowerCase();
  return name.includes('bitburger') || name.includes('köstritzer') || name.includes('kostritzer');
}

export default async function ProductsPage() {
  const beerProducts = ((getBeerProducts() as Product[] | null) ?? []);
  const accessories = (getAccessories() as Product[] | null) ?? [];
  const sausageProducts = (getSausageProducts() as Product[] | null) ?? [];
  const comboProducts = (getComboProducts() as Product[] | null) ?? [];
  const wineProducts = (getProductsByCategory('vang') as Product[] | null) ?? [];

  const benediktinerProducts = beerProducts.filter(isBenediktiner);
  const bitburgerProducts = beerProducts.filter(isBitburgerFamily);
  const otherBeerProducts = beerProducts.filter((product) => !isBenediktiner(product) && !isBitburgerFamily(product));

  return (
    <div className="products-page-container" id="tat-ca">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' },
      ])} />

      <section className="container catalog-header">
        <span className="section-label">Bộ Sưu Tập</span>
        <h1 className="page-title">Tuyệt Tác Nguyên Bản</h1>
        <p className="page-subtitle">
          Trải nghiệm tinh hoa bia tu viện Đức chính gốc và các sản phẩm tuyển chọn dành cho bàn tiệc, nhà hàng và quà tặng.
        </p>

        <div
          role="note"
          style={{
            margin: '22px auto 0',
            maxWidth: '900px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'var(--web-bg-warm)',
            border: '1px solid var(--web-border)',
            color: 'var(--web-text-muted)',
            fontSize: '14px',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          Website giới thiệu sản phẩm. Để đặt hàng, vui lòng liên hệ hotline 0899.191.313 hoặc Zalo.
        </div>

        <div className="catalog-pills-nav-wrapper">
          <div className="catalog-pills-nav">
            <a href="#tat-ca" className="catalog-pill-link">Tất cả</a>
            <a href="#benediktiner" className="catalog-pill-link">Benediktiner</a>
            <a href="#bitburger" className="catalog-pill-link">Bitburger</a>
            <a href="#combo" className="catalog-pill-link">Combo</a>
            <a href="#ruou-vang" className="catalog-pill-link">Rượu vang Đức</a>
            <a href="#xuc-xich-duc" className="catalog-pill-link">Xúc xích</a>
            <a href="#phu-kien" className="catalog-pill-link">Phụ kiện</a>
          </div>
        </div>
      </section>

      {benediktinerProducts.length > 0 && (
        <section className="container" id="benediktiner" aria-label="Benediktiner">
          <div className="section-header-center mb-48">
            <span className="section-label">Bia Tu Viện Đức</span>
            <h2 className="section-title">Benediktiner</h2>
          </div>
          <div className="grid-featured-products">
            {benediktinerProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description || getTastingNotes(product.name)}
                showCTA={true}
                showReferencePriceNote={true}
              />
            ))}
          </div>
        </section>
      )}

      {bitburgerProducts.length > 0 && (
        <section className="container mt-100" id="bitburger" aria-label="Bitburger">
          <div className="section-header-center mb-48">
            <span className="section-label">Pilsner Đức</span>
            <h2 className="section-title">Bitburger</h2>
          </div>
          <div className="grid-featured-products">
            {bitburgerProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description || getTastingNotes(product.name)}
                showCTA={true}
                showReferencePriceNote={true}
              />
            ))}
          </div>
        </section>
      )}

      {otherBeerProducts.length > 0 && (
        <section className="container mt-100" id="bia-tuyen-chon" aria-label="Bia tuyển chọn khác">
          <div className="section-header-center mb-48">
            <span className="section-label">Tuyển Chọn Thêm</span>
            <h2 className="section-title">Các Dòng Bia Khác</h2>
          </div>
          <div className="grid-featured-products">
            {otherBeerProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description || getTastingNotes(product.name)}
                showCTA={true}
                showReferencePriceNote={true}
              />
            ))}
          </div>
        </section>
      )}

      {comboProducts.length > 0 && (
        <section className="container mt-100" id="combo" aria-label="Combo">
          <div className="section-header-center mb-48">
            <span className="section-label">Gợi Ý Kết Hợp</span>
            <h2 className="section-title">Combo</h2>
            <p className="page-subtitle">Các set bia Đức và món ăn kèm để tham khảo theo nhu cầu sử dụng.</p>
          </div>
          <div className="grid-featured-products">
            {comboProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description}
                showCTA={true}
                showReferencePriceNote={true}
              />
            ))}
          </div>
        </section>
      )}

      {wineProducts.length > 0 && (
        <section className="container mt-100" id="ruou-vang" aria-label="Rượu vang Đức">
          <div className="section-header-center mb-48">
            <span className="section-label">Tuyển Chọn Thêm</span>
            <h2 className="section-title">Rượu Vang Đức</h2>
            <p className="page-subtitle">Riesling, Spätburgunder từ Rappenhof, Thörle — nhập khẩu nguyên chai.</p>
          </div>
          <div className="grid-featured-products">
            {wineProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description}
                showCTA={true}
                showReferencePriceNote={true}
              />
            ))}
          </div>
        </section>
      )}

      {sausageProducts.length > 0 && (
        <section className="container mt-100" id="xuc-xich-duc" aria-label="Xúc xích Đức">
          <div className="section-header-center mb-48">
            <span className="section-label">Món Ăn Kèm Bia</span>
            <h2 className="section-title">Xúc Xích Đức</h2>
            <p className="page-subtitle">
              Xúc xích và thịt nguội thủ công kiểu Đức, hợp dùng cùng bia, vang, bữa gia đình hoặc bàn tiệc.
            </p>
          </div>

          <div className="grid-featured-products">
            {sausageProducts.map((product) => {
              const isColdCutDeal = product.slug === 'the-wurst-combo-cold-cut-150g';
              let quickTags: string[] | undefined;
              let cardId: string | undefined;

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
                  description={product.description}
                  highlightLabel={isColdCutDeal ? 'Combo 99K' : undefined}
                  quickTags={quickTags}
                  cardId={cardId}
                  showCTA={true}
                  showReferencePriceNote={true}
                />
              );
            })}
          </div>
        </section>
      )}

      {accessories.length > 0 && (
        <section className="container mt-100" id="phu-kien" aria-label="Phụ kiện">
          <div className="section-header-center mb-48">
            <span className="section-label">Phụ Kiện</span>
            <h2 className="section-title">Hoàn Thiện Trải Nghiệm</h2>
          </div>

          <div className="accessories-grid">
            {accessories.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                showCTA={true}
                showReferencePriceNote={true}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
