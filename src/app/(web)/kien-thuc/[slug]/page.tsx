import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlugOrId, getRelatedArticles, getPublishedArticles } from '@/lib/data/articles';
import { getFeaturedBeers } from '@/lib/data/products';
import { toAbsoluteSiteUrl } from '@/lib/seo/site';
import ArticleBody from './ArticleBody';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getStoreSchema } from '../../components/JsonLd';
import GeoLocalCTA from '../../components/GeoLocalCTA';
import ProductCard, { ProductCardProps } from '../../components/ProductCard';
import { getTastingNotes } from '../../utils/getTastingNotes';
import { Button } from '../../components/ui/Button'
import ArticleCard, { ArticleGrid } from '../../components/ui/ArticleCard'
import TitleBlock from '../../components/ui/TitleBlock'
import styles from './page.module.css';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const revalidate = 3600;

interface ArticleData {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  meta_description: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string | null;
  thumbnail_url: string | null;
  tenant_id: string;
  status: string;
}

export async function generateStaticParams() {
  try {
    return getPublishedArticles()
      .filter((a) => a.slug)
      .map((a) => ({ slug: a.slug as string }));
  } catch (error) {
    console.warn("Failed to fetch static params during build. Falling back to empty array.", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug) as unknown as { title: string; meta_description: string | null; slug: string; thumbnail_url: string | null } | null;

  if (!article) return {};

  const articleUrl = `https://www.biathaytu.com.vn/kien-thuc/${article.slug || slug}`;
  const ogImage = toAbsoluteSiteUrl(article.thumbnail_url || '/logo.jpg');

  return {
    title: article.title,
    description: article.meta_description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.meta_description ?? undefined,
      type: 'article',
      url: articleUrl,
      siteName: 'Bia Thầy Tu',
      images: [
        {
          url: ogImage,
          ...(article.thumbnail_url ? { width: 1200, height: 630 } : {}),
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description ?? undefined,
      images: [ogImage],
    },
  };
}

/** Trang bài viết: dải tiêu đề xanh đêm, ảnh bìa, thân bài, gợi ý sản phẩm, bài liên quan. */
export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug) as unknown as ArticleData | null;

  if (!article) {
    notFound();
  }

  const readTime = article.word_count ? Math.round(article.word_count / 200) : 3;
  const articleUrl = `https://www.biathaytu.com.vn/kien-thuc/${article.slug || article.id}`;

  // Related articles (3 most recent, excluding current)
  const relatedArticles = getRelatedArticles(article.id, 3) as unknown as Array<{
    id: string; title: string; slug: string | null;
    meta_description: string | null; word_count: number | null; created_at: string;
    thumbnail_url: string | null;
  }>;

  // Suggested products for CTA (featured Benediktiner)
  const suggestedProducts = getFeaturedBeers(3);

  return (
    <>
      <JsonLd type="store" data={getStoreSchema()} />
      <JsonLd type="article" data={getArticleSchema({
        title: article.title,
        slug: article.slug || article.id,
        url: articleUrl,
        description: article.meta_description || article.title,
        datePublished: article.created_at,
        dateModified: article.updated_at || article.created_at,
        imageUrl: article.thumbnail_url || undefined,
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.knowledge, { href: articleUrl, label: article.title }))} />

      <header className={`${styles.hero} ${article.thumbnail_url ? styles.withCover : ''}`} data-surface="ink">
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Đường dẫn">
            <Link href={NAV.home.href}>{NAV.home.label}</Link>
            <span aria-hidden="true">/</span>
            <Link href={NAV.knowledge.href}>{NAV.knowledge.label}</Link>
          </nav>
          <h1 className={`article-detail-title ${styles.title}`}>{article.title}</h1>
          <p className={styles.meta}>
            {new Date(article.created_at).toLocaleDateString('vi-VN')} · {readTime} phút đọc
          </p>
        </div>
      </header>

      {article.thumbnail_url && (
        <div className={`container ${styles.coverWrap}`}>
          <div className={styles.cover}>
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              sizes="(max-width: 1000px) 100vw, 1000px"
              priority
              fetchPriority="high"
              className={styles.coverImage}
            />
          </div>
        </div>
      )}

      <article className={`container article-detail-body-container ${styles.body}`}>
        <ArticleBody content={article.content} />
        <GeoLocalCTA />
      </article>

      {suggestedProducts && suggestedProducts.length > 0 && (
        <section className={styles.products} aria-labelledby="article-products-title">
          <div className="container">
            <TitleBlock id="article-products-title" align="center" title="Tìm hiểu thêm về các dòng bia" kicker="Nhập khẩu chính hãng" />
            <p className={styles.productsLead}>Thông tin chi tiết về các dòng bia Đức nhập khẩu chính hãng do Bia Thầy Tu phân phối.</p>
            <div className="grid-featured-products">
              {(suggestedProducts as unknown as ProductCardProps[]).map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  description={product.description || getTastingNotes(product.name)}
                  showCTA={true}
                />
              ))}
            </div>
            <div className={styles.more}>
              <Button href="/san-pham" variant="link">Xem các dòng bia</Button>
            </div>
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <div className="container">
            <TitleBlock id="related-title" title="Bài viết liên quan" kicker="Đọc thêm" />
            <div className={styles.relatedGrid}>
              <ArticleGrid>
                {relatedArticles.map((related, index) => (
                  <ArticleCard key={related.id} article={related} position={index} />
                ))}
              </ArticleGrid>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
