import type { Metadata } from 'next';
import { getBeerProducts } from '@/lib/data/products';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { Button } from '../components/ui/Button';
import PhotoHero from '../components/ui/PhotoHero';
import TitleBlock from '../components/ui/TitleBlock';
import { getTastingNotes } from '../utils/getTastingNotes';
import ProductCatalog, { type CatalogSection } from './ProductCatalog';
import styles from './page.module.css';
import { KEG_PAGE, NAV, breadcrumbTrail } from '@/config/navigation';
import { BEER_LINES, LINE_GROUPS, getLineForName, packFormatOf, type LineGroup } from '@/config/productLines';

export const metadata: Metadata = {
  title: 'Benediktiner Và Bia Đức Tuyển Chọn',
  description: 'Benediktiner là danh mục chính, bên cạnh Bitburger và các dòng bia Đức được German Taste tuyển chọn. Xem hương vị, quy cách và giá bán lẻ.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/san-pham' },
  openGraph: {
    title: 'Benediktiner Và Bia Đức Tuyển Chọn | Bia Thầy Tu',
    description: 'Khám phá Benediktiner, Bitburger và danh mục bia Đức tuyển chọn tại German Taste.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/san-pham',
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

const SECTION_COPY: Record<LineGroup, { kicker: string; lead: string }> = {
  benediktiner: {
    kicker: 'Bia lúa mì tu viện',
    lead: 'Bia lúa mì của tu viện Ettal: vàng đục Naturtrüb, đen Dunkel và Festbier mùa lễ hội, có dạng chai, lon và bom 5 lít.',
  },
  selected: {
    kicker: 'Bitburger và các dòng bổ sung',
    lead: 'Benediktiner vẫn là danh mục chính của Bia Thầy Tu. Các sản phẩm tại đây là lựa chọn bổ sung cho người yêu bia Đức và nhu cầu HORECA.',
  },
};

/**
 * Danh mục kiểu trang "Nos bières" của Chimay: hero ảnh, cụm tiêu đề có icon, lưới thẻ không viền.
 * Ba cấp (audit A2): nhóm → dòng bia (tên dòng link tới trang dòng bia) → thẻ SKU.
 */
export default function ProductsPage() {
  const beers = (getBeerProducts() as CatalogProduct[] | null) ?? [];
  const sections: CatalogSection[] = (Object.keys(LINE_GROUPS) as LineGroup[]).map((group) => ({
    group,
    ...LINE_GROUPS[group],
    ...SECTION_COPY[group],
    lines: BEER_LINES.filter((line) => line.group === group)
      .map((line) => ({
        id: line.id,
        label: line.label,
        href: line.href,
        products: beers
          .filter((product) => getLineForName(product.name)?.id === line.id)
          .map((product) => ({
            ...product,
            description: product.description || getTastingNotes(product.name),
            format: packFormatOf(product.name),
          })),
      }))
      .filter((line) => line.products.length > 0),
  }));

  return (
    <div className="products-page-container">
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.products))} />

      <PhotoHero
        size="medium"
        titleId="catalog-title"
        image={{ src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier Naturtrüb', position: '70% center' }}
        eyebrow="Bia Thầy Tu"
        title="Bia của chúng tôi"
        kicker="Benediktiner và bia Đức tuyển chọn"
      >
        <p>Naturtrüb, Dunkel, Festbier cùng Bitburger và những dòng bia Đức bổ sung được German Taste lựa chọn.</p>
      </PhotoHero>

      <p className={styles.note}>
        <span className="container">
          Website giới thiệu sản phẩm và cung cấp thông tin tư vấn; không thực hiện đặt hàng hoặc thanh toán trực tuyến.
        </span>
      </p>

      <ProductCatalog sections={sections} kegPage={KEG_PAGE} />

      <section className={styles.help} data-surface="ink" aria-labelledby="catalog-help-title">
        <div className={`container ${styles.helpInner}`}>
          <TitleBlock id="catalog-help-title" title="Cho nhà hàng" kicker="HORECA và đại lý" />
          <p>Tư vấn sản phẩm, quy cách, chính sách và giải pháp phục vụ nhà hàng, khách sạn, pub, beer club hoặc đại lý tỉnh.</p>
          <div className={styles.helpActions}>
            <Button href="/lien-he" variant="light">Liên hệ tư vấn</Button>
            <Button href="/bia-duc-cho-nha-hang-khach-san" variant="link">Giải pháp HORECA</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
