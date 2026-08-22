import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBeerProducts } from '@/lib/data/products';
import { BRAND } from '@/lib/brand';
import ProductCard from '../components/ProductCard';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { getTastingNotes } from '../utils/getTastingNotes';
import styles from '../HomeBrand.module.css';

const PAGE_URL = `${BRAND.siteUrl}/san-pham`;

export const metadata: Metadata = {
  title: 'Các Dòng Bia Benediktiner — Naturtrüb, Dunkel & Festbier',
  description: 'Khám phá Naturtrüb, Dunkel, Festbier và các quy cách Benediktiner tại Việt Nam. Xem giá niêm yết và đặt qua Zalo, Fanpage hoặc hotline.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Các Dòng Bia Benediktiner — Bia Thầy Tu',
    description: 'So sánh hương vị, quy cách và giá niêm yết các dòng Benediktiner tại Việt Nam.',
    type: 'website',
    url: PAGE_URL,
    images: [{
      url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
      width: 1100,
      height: 700,
      alt: 'Benediktiner Weissbier Naturtrüb trong không gian ngoài trời',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Các Dòng Bia Benediktiner — Bia Thầy Tu',
    description: 'So sánh hương vị, quy cách và giá niêm yết các dòng Benediktiner tại Việt Nam.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

interface CatalogProduct {
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
}

function isBenediktiner(product: CatalogProduct) {
  return product.name.toLowerCase().includes('benediktiner');
}

export default function ProductsPage() {
  const beers = (getBeerProducts() as CatalogProduct[] | null) ?? [];
  const benediktinerProducts = beers.filter(isBenediktiner);
  const otherGermanBeers = beers.filter((product) => !isBenediktiner(product));

  return (
    <div className="products-page-container">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang chủ', url: BRAND.siteUrl },
        { name: 'Benediktiner', url: PAGE_URL },
      ])} />

      <section className={styles.catalogHero} aria-labelledby="catalog-title">
        <Image
          src="/images/brand/benediktiner-official/beer-garden-closeup.jpg"
          alt="Chai và ly Benediktiner Weissbier Naturtrüb"
          fill
          priority
          sizes="100vw"
          className={styles.catalogHeroImage}
        />
        <div className={styles.catalogHeroOverlay} />
        <div className={`container ${styles.catalogHeroCopy}`}>
          <p className={styles.eyebrow}>Các dòng bia Benediktiner</p>
          <h1 id="catalog-title">Một truyền thống.<br />Nhiều sắc thái hương vị.</h1>
          <p>Tìm hiểu Naturtrüb, Dunkel, Festbier và chọn dòng bia phù hợp với khẩu vị, món ăn hoặc không gian thưởng thức.</p>
        </div>
      </section>

      <section className={styles.catalogNote} aria-label="Thông tin website">
        <div className="container">
          Website hiển thị giá niêm yết. Đơn hàng được xác nhận qua Zalo, Fanpage hoặc hotline; không đặt hàng hay thanh toán trực tuyến trên website.
        </div>
      </section>

      <section className={styles.section} id="benediktiner" aria-labelledby="benediktiner-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrowDark}>Bia Thầy Tu</p>
            <h2 id="benediktiner-title">Bộ sưu tập Benediktiner</h2>
            <p>Giá niêm yết được hiển thị theo từng quy cách. Chọn sản phẩm để xem chi tiết và liên hệ German Taste qua Zalo, Fanpage hoặc hotline.</p>
          </div>
          <div className="grid-featured-products">
            {benediktinerProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.description || getTastingNotes(product.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {otherGermanBeers.length > 0 ? (
        <section className={`${styles.section} ${styles.storySection}`} id="bia-duc-khac" aria-labelledby="other-beers-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrowDark}>Tuyển chọn bổ sung</p>
              <h2 id="other-beers-title">Các thương hiệu bia Đức khác</h2>
              <p>Được đặt ở lớp nội dung thứ hai để Benediktiner luôn giữ vai trò trung tâm của Bia Thầy Tu.</p>
            </div>
            <div className="grid-featured-products">
              {otherGermanBeers.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  description={product.description || getTastingNotes(product.name)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.b2bSection} aria-labelledby="catalog-help-title">
        <div className={`container ${styles.b2bInner}`}>
          <div>
            <p className={styles.eyebrow}>Cần chọn dòng bia phù hợp?</p>
            <h2 id="catalog-help-title">Trao đổi với đội ngũ tư vấn</h2>
            <p>Tư vấn theo khẩu vị, món ăn, quy mô sự kiện hoặc nhu cầu nhà hàng và khách sạn.</p>
          </div>
          <div className={styles.b2bActions}>
            <Link href="/lien-he" className={styles.primaryLightLink}>Liên hệ tư vấn</Link>
            <Link href="/bia-duc-cho-nha-hang-khach-san" className={styles.outlineLightLink}>Giải pháp HORECA</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
