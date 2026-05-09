import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabase } from '@/lib/supabase/server';
import { DEFAULT_TENANT_ID } from '@/constants';
import ArticleBody from './ArticleBody';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../../components/JsonLd';
import ProductCard from '../../components/ProductCard';
import { getTastingNotes } from '../../utils/getTastingNotes';

export const revalidate = 3600;

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function buildArticleQuery(supabase: Awaited<ReturnType<typeof createServerSupabase>>, slug: string, fields: string) {
  const isId = UUID_REGEX.test(slug);
  let query = supabase
    .from('seo_articles')
    .select(fields)
    .eq('tenant_id', DEFAULT_TENANT_ID)
    .eq('status', 'published');
  return isId ? query.eq('id', slug) : query.eq('slug', slug);
}

export async function generateStaticParams() {
  // Use non-cookie client for build-time generation (cookies() unavailable)
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key'
  );
  try {
    const { data } = await supabase
      .from('seo_articles')
      .select('slug')
      .eq('tenant_id', DEFAULT_TENANT_ID)
      .eq('status', 'published');
    return (data ?? []).filter(a => a.slug).map(a => ({ slug: a.slug! }));
  } catch (error) {
    console.warn("Failed to fetch static params during build. Falling back to empty array.", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data } = await buildArticleQuery(supabase, slug, 'title, meta_description, slug, thumbnail_url').single();

  const article = data as unknown as { title: string; meta_description: string | null; slug: string; thumbnail_url: string | null } | null;

  if (!article) return {};

  const ogImage = article.thumbnail_url 
    ? `https://www.biathaytu.com${article.thumbnail_url}`
    : 'https://www.biathaytu.com/logo.jpg';

  return {
    title: `${article.title} — Kiến Thức Bia Thầy Tu`,
    description: article.meta_description,
    alternates: {
      canonical: `https://www.biathaytu.com/kien-thuc/${article.slug || slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.meta_description ?? undefined,
      type: 'article',
      url: `https://www.biathaytu.com/kien-thuc/${article.slug}`,
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
  const supabase = await createServerSupabase();
  const { data } = await buildArticleQuery(supabase, slug, '*').single();
  const article = data as any;

  if (!article) {
    notFound();
  }

  const readTime = article.word_count ? Math.round(article.word_count / 200) : 3;

  // Fetch related articles (3 most recent, excluding current)
  const { data: relatedRaw } = await supabase
    .from('seo_articles')
    .select('id, title, slug, meta_description, word_count, created_at, thumbnail_url')
    .eq('tenant_id', DEFAULT_TENANT_ID)
    .eq('status', 'published')
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3);
  const relatedArticles = (relatedRaw ?? []) as Array<{
    id: string; title: string; slug: string | null;
    meta_description: string | null; word_count: number | null; created_at: string;
    thumbnail_url: string | null;
  }>;

  // Fetch suggested products for CTA
  const { data: suggestedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .neq('category', 'vang')
    .not('name', 'ilike', '%bitburger%') // Suggest Benediktiner primarily
    .order('sort_order', { ascending: true })
    .limit(3);

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      <JsonLd type="article" data={getArticleSchema({
        title: article.title,
        slug: article.slug || article.id,
        description: article.meta_description || article.title,
        datePublished: article.created_at,
        dateModified: article.updated_at || article.created_at,
      })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
        { name: 'Kiến Thức', url: 'https://www.biathaytu.com/kien-thuc' },
        { name: article.title, url: `https://www.biathaytu.com/kien-thuc/${article.slug || article.id}` },
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
                {suggestedProducts.map((product: any) => (
                  <div key={product.id} style={{ flex: '1', minWidth: '240px', scrollSnapAlign: 'start' }}>
                    <ProductCard
                      {...product}
                      description={product.short_description || `"${getTastingNotes(product.name)}"`}
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
