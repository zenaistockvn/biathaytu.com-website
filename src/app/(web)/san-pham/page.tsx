import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBeerProducts } from '@/lib/data/products';
import ProductCard from '../components/ProductCard';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { getTastingNotes } from '../utils/getTastingNotes';
import styles from '../HomeBrand.module.css';

export const metadata: Metadata = {
  title: 'Benediktiner Và Bia Đức Tuyển Chọn',
  description: 'Benediktiner là danh mục chính, bên cạnh Bitburger và các dòng bia Đức được German Taste tuyển chọn. Xem hương vị, quy cách và giá bán lẻ.',
  alternates: { canonical: 'https://www.biathaytu.com/san-pham' },
  openGraph: {
    title: 'Benediktiner Và Bia Đức Tuyển Chọn | Bia Thầy Tu',
    description: 'Khám phá Benediktiner, Bitburger và danh mục bia Đức tuyển chọn tại German Taste.',
    type: 'website',
    url: 'https://www.biathaytu.com/san-pham',
    images: [{
      url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
      width: 1100,
      height: 700,
      alt: 'Benediktiner Weissbier Naturtrüb trong không gian ngoài trời',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Benediktiner Và Bia Đức Tuyển Chọn | Bia Thầy Tu',
    description: 'Khám phá Benediktiner, Bitburger và danh mục bia Đức tuyển chọn tại German Taste.',
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
  const selectedGermanBeers = beers.filter((product) => !isBenediktiner(product));

  return (
    <div className="products-page-container">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang chủ', url: 'https://www.biathaytu.com' },
        { name: 'Benediktiner', url: 'https://www.biathaytu.com/san-pham' },
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
          <p className={styles.eyebrow}>Benediktiner và bia Đức tuyển chọn</p>
          <h1 id="catalog-title">Benediktiner là trung tâm.<br />Bia Đức được tuyển chọn.</h1>
          <p>Khám phá Naturtrüb, Dunkel, Festbier cùng Bitburger và những dòng bia Đức bổ sung được German Taste lựa chọn.</p>
        </div>
      </section>

      <section className={styles.catalogNote} aria-label="Thông tin website">
        <div className="container">
          Website giới thiệu sản phẩm và cung cấp thông tin tư vấn; không thực hiện đặt hàng hoặc thanh toán trực tuyến.
        </div>
      </section>

      <section className={styles.section} id="benediktiner" aria-labelledby="benediktiner-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrowDark}>Bia Thầy Tu</p>
            <h2 id="benediktiner-title">Bộ sưu tập Benediktiner</h2>
            <p>Thông tin quy cách có thể thay đổi theo từng thời điểm. Trang chi tiết tập trung vào hương vị, nguồn gốc và cách thưởng thức.</p>
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

      {selectedGermanBeers.length > 0 ? (
        <section className={`${styles.section} ${styles.storySection}`} id="bia-duc-khac" aria-labelledby="selected-beers-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrowDark}>Bia Đức tuyển chọn</p>
              <h2 id="selected-beers-title">Bitburger và các dòng bia bổ sung</h2>
              <p>Benediktiner vẫn là danh mục chính của Bia Thầy Tu. Các sản phẩm tại đây là lựa chọn bổ sung cho người yêu bia Đức và nhu cầu HORECA.</p>
            </div>
            <div className="grid-featured-products">
              {selectedGermanBeers.map((product) => (
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
            <p className={styles.eyebrow}>HORECA / Đại lý</p>
            <h2 id="catalog-help-title">Danh mục phù hợp cho từng mô hình kinh doanh</h2>
            <p>Tư vấn sản phẩm, quy cách, chính sách và giải pháp phục vụ nhà hàng, khách sạn, pub, beer club hoặc đại lý tỉnh.</p>
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
