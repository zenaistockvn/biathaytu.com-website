import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlugOrId, getRelatedArticles, getPublishedArticles } from '@/lib/data/articles';
import { getFeaturedBeers } from '@/lib/data/products';
import { toAbsoluteSiteUrl } from '@/lib/seo/site';
import ArticleBody from './ArticleBody';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../../components/JsonLd';
import ProductCard, { ProductCardProps } from '../../components/ProductCard';
import { getTastingNotes } from '../../utils/getTastingNotes';

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

  const articleUrl = `https://www.biathaytu.com/kien-thuc/${article.slug || slug}`;
  const ogImage = toAbsoluteSiteUrl(article.thumbnail_url || '/logo.jpg');

  return {
    title: `${article.title} — Kiến Thức Bia Thầy Tu`,
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
          width: 1200,
          height: 630,
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

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlugOrId(slug) as unknown as ArticleData | null;

  if (!article) {
    notFound();
  }

  const readTime = article.word_count ? Math.round(article.word_count / 200) : 3;
  const articleUrl = `https://www.biathaytu.com/kien-thuc/${article.slug || article.id}`;

  // Related articles (3 most recent, excluding current)
  const relatedArticles = getRelatedArticles(article.id, 3) as unknown as Array<{
    id: string; title: string; slug: string | null;
    meta_description: string | null; word_count: number | null; created_at: string;
    thumbnail_url: string | null;
  }>;

  // Suggested products for CTA (featured Benediktiner)
  const suggestedProducts = getFeaturedBeers(3);

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({
        title: article.title,
        slug: article.slug || article.id,
        url: articleUrl,
        description: article.meta_description || article.title,
        datePublished: article.created_at,
        dateModified: article.updated_at || article.created_at,
        imageUrl: article.thumbnail_url || undefined,
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Kiến Thức', url: 'https://www.biathaytu.com/kien-thuc' },
        { name: article.title, url: articleUrl },
      ])} />
      
      {/* Article Hero */}
      <section style={{ 
        padding: '120px 0 80px', 
        background: 'var(--web-navy)',
        color: '#fff',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
          zIndex: 1
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--web-gold)', marginBottom: '30px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link> 
            <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.3)' }}>/</span>
            <Link href="/kien-thuc" style={{ color: 'inherit', textDecoration: 'none' }}> Kiến thức</Link>
          </div>
          
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#fff', marginBottom: '24px', lineHeight: 1.25, fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
            {article.title}
          </h1>
          
          <div style={{ display: 'flex', gap: '20px', fontSize: '15px', color: 'rgba(255,255,255,0.7)', justifyContent: 'center', fontWeight: 500 }}>
            <span>{new Date(article.created_at).toLocaleDateString('vi-VN')}</span>
            <span>•</span>
            <span>{readTime} phút đọc</span>
          </div>
        </div>
      </section>

      {/* Hero Image — between header and body */}
      {article.thumbnail_url && (
        <div className="container" style={{ maxWidth: '900px', marginTop: '-40px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
          <div style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 900px"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="container" style={{ maxWidth: '800px', padding: '60px 20px 100px' }}>
        <ArticleBody content={article.content} />

        {/* CTA Footer */}
        <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--web-border)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px', fontWeight: 700, color: 'var(--web-navy)', fontFamily: 'var(--font-serif)' }}>
            Sẵn sàng để thưởng thức?
          </h3>
          <p style={{ color: 'var(--web-text-muted)', marginBottom: '40px', fontSize: '16px' }}>
            Trải nghiệm hương vị hoàng gia Đức ngay hôm nay với các dòng bia nhập khẩu chính hãng.
          </p>
          
          {suggestedProducts && suggestedProducts.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '20px',
              textAlign: 'left',
              marginBottom: '40px',
              overflowX: 'auto',
              paddingBottom: '16px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none', // Hide scrollbar IE and Edge
              scrollbarWidth: 'none', // Hide scrollbar Firefox
            }}>
              <style dangerouslySetInnerHTML={{__html: `
                .suggestions-row::-webkit-scrollbar { display: none; }
              `}} />
              <div className="suggestions-row" style={{ display: 'flex', gap: '20px', width: '100%' }}>
                {(suggestedProducts as unknown as ProductCardProps[]).map((product) => (
                  <div key={product.id} style={{ flex: '1', minWidth: '240px', scrollSnapAlign: 'start' }}>
                    <ProductCard
                      {...product}
                      description={product.description?.substring(0, 80) || `"${getTastingNotes(product.name)}"`}
                      showCTA={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href="/san-pham" style={{ 
            display: 'inline-flex', padding: '14px 32px', background: 'transparent', color: 'var(--web-gold-dark)', 
            fontWeight: 700, borderRadius: 'var(--web-radius)', textDecoration: 'none', transition: 'all 0.3s ease',
            border: '2px solid var(--web-gold)'
          }}>
            Xem Toàn Bộ Cửa Hàng
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section style={{ background: 'var(--web-bg-section)', padding: '80px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '3px', color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>
                Đọc Thêm
              </p>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--web-navy)', fontFamily: 'var(--font-serif)' }}>
                Bài Viết Liên Quan
              </h2>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '32px'
            }}>
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/kien-thuc/${related.slug || related.id}`}
                  className="article-index-card"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    textDecoration: 'none', backgroundColor: '#fff',
                    borderRadius: 'var(--web-radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid var(--web-border)',
                    boxShadow: '0 10px 40px -20px rgba(0,0,0,0.05)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Related Article Thumbnail */}
                  {related.thumbnail_url && (
                    <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                      <Image
                        src={related.thumbnail_url}
                        alt={related.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>
                  )}
                  <div style={{ padding: '24px 28px 28px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--web-gold-dark)', fontWeight: 600, marginBottom: '12px' }}>
                      {new Date(related.created_at).toLocaleDateString('vi-VN')}
                      <span style={{ margin: '0 8px', color: 'var(--web-text-muted)' }}>•</span>
                      {related.word_count ? Math.round(related.word_count / 200) : 3} phút
                    </div>
                    <h3 style={{
                      fontSize: '19px', fontWeight: 700, color: 'var(--web-navy)',
                      marginBottom: '10px', lineHeight: 1.4,
                      fontFamily: 'var(--font-serif)',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as never, overflow: 'hidden'
                    }}>
                      {related.title}
                    </h3>
                    <p style={{
                      fontSize: '14px', color: 'var(--web-text-secondary)', lineHeight: 1.7,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as never,
                      overflow: 'hidden', flex: 1, marginBottom: '16px'
                    }}>
                      {related.meta_description || ''}
                    </p>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--web-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Đọc tiếp <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
