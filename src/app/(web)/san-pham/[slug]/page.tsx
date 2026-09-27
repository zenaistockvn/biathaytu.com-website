import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLineProducts, getProductBySlugOrId, getRelatedBeers, getVisibleProducts } from '@/lib/data/products';
import ProductOrderActions from '../../components/ProductOrderActions';
import ProductConsultationForm from '../../components/ProductConsultationForm';
import ProductDetailsAccordion from '../../components/ProductDetailsAccordion';
import ProductGallery from '../../components/ProductGallery';
import JsonLd, { getProductSchema, getBreadcrumbSchema } from '../../components/JsonLd';
import ProductCard, { ProductCardProps } from '../../components/ProductCard';
import TitleBlock from '../../components/ui/TitleBlock';
import { getTastingNotes } from '../../utils/getTastingNotes';
import { formatAbv, packWithoutVolume, splitProductName } from '../../utils/productName';
import { toAbsoluteSiteUrl } from '@/lib/seo/site';
import SkuActionBar from '../../components/SkuActionBar';
import FormatStrip, { formatLabel } from '../../components/ui/FormatStrip';
import { formatPrice } from '@/utils/formatPrice';
import styles from './page.module.css';
import { NAV, breadcrumbTrail, type NavItem } from '@/config/navigation';
import { getLineForName, lineAnchor } from '@/config/productLines';

export function generateStaticParams() {
  return getVisibleProducts()
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
  hidden?: boolean;
}

const CATEGORY_LABEL: Record<string, string> = {
  bia: 'Bia Đức nhập khẩu',
  vang: 'Vang Đức',
  'phu-kien': 'Phụ kiện',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug) as ProductData | null;
  if (!product || product.hidden) return {};
  const productUrl = `https://www.biathaytu.com.vn/san-pham/${product.slug || product.id}`;

  const ogImageUrl = toAbsoluteSiteUrl(product.images?.[0] || '/images/brand/benediktiner-official/beer-garden-closeup.jpg');
  const pageDescription = product.description || `Khám phá hương vị và thông tin chi tiết của ${product.name}. Liên hệ Bia Thầy Tu để được tư vấn sản phẩm.`;

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
      title: `${product.name} | Bia Thầy Tu`,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

/** Trang chi tiết: ảnh trên nền xám bên trái, tên, giá, thông số dạng bảng bên phải (như trang sản phẩm Chimay). */
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlugOrId(slug) as ProductData | null;

  if (!product || product.hidden) {
    notFound();
  }

  const isAlcohol = product.category === 'bia' || product.category === 'vang';
  const { title: productTitle, pack } = splitProductName(product.name);
  // Dung tích đã có dòng riêng nên quy cách chỉ ghi "Két 24 lon".
  const packagingFormat = product.volume ? packWithoutVolume(pack) : pack;
  const abvText = formatAbv(product.abv);
  const tastingNote = getTastingNotes(product.name);

  const isBeer = product.category === 'bia';

  // Ba cấp Sản phẩm → Dòng bia → Quy cách (audit A2). Dòng chưa có trang riêng trỏ về nhóm trong danh mục.
  const line = isBeer ? getLineForName(product.name) : null;
  const lineCrumb = line ? { href: line.hasPage && line.href ? line.href : lineAnchor(line), label: line.label } : null;
  const skuCrumb = { href: `/san-pham/${product.slug || product.id}`, label: line ? formatLabel(product) : product.name };
  const parentCrumb = lineCrumb ?? NAV.products;
  const priceSpecs = [abvText ? `${abvText} vol.` : null, product.ibu ? `IBU ${product.ibu}` : null].filter(Boolean).join(' · ');

  // Bảng thông số chỉ giữ dòng chưa hiện phía trên: ABV/IBU đã ở hàng giá, dung tích và quy cách đã ở dưới tên (audit L2).
  const specs = [
    abvText && !priceSpecs ? ['Nồng độ cồn', abvText] : null,
    product.ibu && !priceSpecs ? ['Độ đắng (IBU)', String(product.ibu)] : null,
    product.volume && !pack ? ['Dung tích', product.volume] : null,
    packagingFormat && !pack ? ['Quy cách', packagingFormat] : null,
    ['Xuất xứ', product.origin || 'Đức'],
  ].filter((row): row is string[] => Boolean(row));

  // Cùng dòng bia: dải quy cách khác thay cho "Có thể bạn sẽ thích"; sản phẩm khác (vang, phụ kiện) giữ gợi ý cũ.
  const siblingFormats = line ? getLineProducts(line.id).filter((item) => item.id !== product.id) : [];
  const relatedProductsData = line ? [] : getRelatedBeers(product.id, 4);

  return (
    <div className="subpage-wrap">
      <JsonLd type="product" data={getProductSchema({
        id: product.id,
        name: product.name,
        slug: product.slug || product.id,
        description: product.description || undefined,
        images: product.images || undefined,
        abv: product.abv || undefined,
        volume: product.volume || undefined,
        category: product.category,
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(...[NAV.products, lineCrumb, skuCrumb].filter((crumb): crumb is NavItem => Boolean(crumb))))} />

      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Đường dẫn">
          <Link href={NAV.products.href}>{NAV.products.label}</Link>
          {lineCrumb ? (
            <>
              <span aria-hidden="true">/</span>
              <Link href={lineCrumb.href}>{lineCrumb.label}</Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{skuCrumb.label}</span>
        </nav>
        {/* Dưới 768px: một link về cấp cha thay cho breadcrumb dài (audit C6, D3). */}
        <Link href={parentCrumb.href} className={styles.backLink}>
          <span aria-hidden="true">‹</span> {parentCrumb.label}
        </Link>

        <div className={styles.top}>
          <div className={styles.gallery}>
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          <div>
            <p className={styles.kicker}>{CATEGORY_LABEL[product.category ?? ''] ?? 'Sản phẩm'}</p>
            <h1 className={styles.name}>
              {productTitle}
              {pack && <span className={styles.pack}>{pack}</span>}
            </h1>
            {product.price !== null || priceSpecs ? (
              <div className={styles.priceRow}>
                {product.price !== null ? (
                  <p className={styles.price}>
                    <span className={styles.priceLabel}>Giá bán lẻ</span>
                    {formatPrice(product.price)}
                  </p>
                ) : null}
                {priceSpecs ? <p className={styles.priceSpecs}>{priceSpecs}</p> : null}
              </div>
            ) : null}
            {isAlcohol && (
              <p className={styles.ageNote}>Sản phẩm chỉ dành cho người từ đủ 18 tuổi.</p>
            )}

            <ProductOrderActions product={product} />

            <dl className={styles.specs}>
              {specs.map(([label, value]) => (
                <div key={label + value}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Một cột: hương vị, mô tả, câu hỏi thường gặp; món nhắm thu thành một dòng link (audit L2). */}
        <div className={styles.details}>
          <p className={styles.tastingInline}>
            <strong>Hương vị nổi bật:</strong> {tastingNote}
          </p>
          <div className={`product-description ${styles.description}`}>
            {product.description || (
              <p>
                Sản phẩm {product.name} được tuyển chọn với thông tin nguồn gốc rõ ràng, phù hợp cho nhu cầu thưởng thức, biếu tặng hoặc phục vụ tại nhà hàng và sự kiện.
              </p>
            )}
          </div>
          <ProductDetailsAccordion productName={product.name} category={product.category} />

          {isBeer ? (
            <p className={styles.pairingLinks}>
              <span className={styles.pairingLabel}>Món ăn kèm</span>
              <Link href="/food-pairing-bia-duc">Gợi ý món ăn hợp với bia Đức</Link>
            </p>
          ) : null}
        </div>

        {line && siblingFormats.length > 0 ? (
          <section className={styles.related} aria-labelledby="formats-title">
            <TitleBlock id="formats-title" align="center" title="Quy cách khác" kicker={line.label} />
            <div className={styles.formats}>
              <FormatStrip products={siblingFormats} />
            </div>
          </section>
        ) : null}

        {relatedProductsData && relatedProductsData.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <TitleBlock id="related-title" align="center" title="Có thể bạn sẽ thích" kicker="Gợi ý thêm" />
            <div className={`grid-featured-products ${styles.relatedGrid}`}>
              {(relatedProductsData as unknown as ProductCardProps[])?.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  {...relatedProduct}
                  description={relatedProduct.description || getTastingNotes(relatedProduct.name)}
                  showCTA={true}
                  showReferencePriceNote={true}
                />
              ))}
            </div>
          </section>
        )}

        <ProductConsultationForm productName={product.name} />
      </div>
      <SkuActionBar productId={product.id} productName={product.name} />
    </div>
  );
}
