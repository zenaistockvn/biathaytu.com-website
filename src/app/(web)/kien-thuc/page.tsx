import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabase } from '@/lib/supabase/server';
import { DEFAULT_TENANT_ID } from '@/constants';

export const revalidate = 3600;

export const metadata = {
  title: 'Kiến Thức Bia Đức — Bia Thầy Tu',
  description: 'Khám phá thế giới bia Đức: từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
};

interface ArticleSummary {
  id: string;
  title: string;
  slug: string | null;
  meta_description: string | null;
  word_count: number | null;
  created_at: string;
  thumbnail_url: string | null;
}

export default async function KienThucPage() {
  const supabase = await createServerSupabase();
  
  const { data: articles } = await supabase
    .from('seo_articles')
    .select('id, title, slug, meta_description, word_count, created_at, thumbnail_url')
    .eq('tenant_id', DEFAULT_TENANT_ID)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const articleList = (articles ?? []) as ArticleSummary[];
  const featuredArticle = articleList.length > 0 ? articleList[0] : null;
  const standardArticles = articleList.length > 1 ? articleList.slice(1) : [];

  return (
    <div className="web-app" style={{ backgroundColor: 'var(--web-bg)' }}>
      {/* ═══════════════════════════════════════════ 
          HERO SECTION — Dark Premium Magazine
      ═══════════════════════════════════════════ */}
      <section style={{ 
        position: 'relative', 
        padding: '160px 0 120px', 
        background: 'var(--web-navy)',
        color: '#fff',
        overflow: 'hidden'
      }}>
        {/* Subtle grid pattern or gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at bottom, rgba(218, 165, 32, 0.15) 0%, transparent 70%)',
          zIndex: 1
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ 
            fontSize: '14px', fontWeight: 700, letterSpacing: '4px', 
            color: 'var(--web-gold)', textTransform: 'uppercase', marginBottom: '20px' 
          }}>
            Tạp Chí Văn Hoá
          </p>
          <h1 style={{ 
            fontSize: 'clamp(42px, 6vw, 64px)', color: '#fff',
            marginBottom: '24px', fontFamily: 'var(--font-serif)',
            fontWeight: 800, lineHeight: 1.1
          }}>
            Thế Giới Bia Đức
          </h1>
          <p style={{ 
            maxWidth: '650px', margin: '0 auto', color: 'rgba(255,255,255,0.8)', 
            fontSize: '18px', lineHeight: 1.8 
          }}>
            Từ nghệ thuật rót bia đúng chuẩn, kiến thức ẩm thực ghép rượu đến những giai thoại lịch sử đằng sau các tu viện huy hoàng thời Trung Cổ.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ 
          FEATURED ARTICLE
      ═══════════════════════════════════════════ */}
      {featuredArticle && (
        <section className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, marginBottom: '80px' }}>
          <Link href={`/kien-thuc/${featuredArticle.slug || featuredArticle.id}`} style={{ textDecoration: 'none' }}>
            <div className="featured-article-card" style={{
              display: 'flex', flexDirection: 'column',
              background: '#fff', borderRadius: 'var(--web-radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(10, 22, 40, 0.25)',
              overflow: 'hidden', border: '1px solid var(--web-border)',
              transition: 'transform 0.4s ease, box-shadow 0.4s ease'
            }}>
              {/* Featured Thumbnail */}
              {featuredArticle.thumbnail_url && (
                <div style={{ position: 'relative', width: '100%', height: '360px', overflow: 'hidden' }}>
                  <Image
                    src={featuredArticle.thumbnail_url}
                    alt={featuredArticle.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    priority
                  />
                </div>
              )}
              <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: 'var(--web-text-secondary)', marginBottom: '24px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  <span style={{ color: 'var(--web-gold-dark)' }}>Bài Trọng Tâm</span>
                  <span>•</span>
                  <span>{new Date(featuredArticle.created_at).toLocaleDateString('vi-VN')}</span>
                  <span>•</span>
                  <span>{featuredArticle.word_count ? Math.round(featuredArticle.word_count / 200) : 3} phút đọc</span>
                </div>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--web-navy)', marginBottom: '20px', lineHeight: 1.3, fontFamily: 'var(--font-serif)', maxWidth: '900px' }}>
                  {featuredArticle.title}
                </h2>
                <p style={{ fontSize: '17px', color: 'var(--web-text-muted)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '800px' }}>
                  {featuredArticle.meta_description || 'Nhấn để đọc chi tiết bài viết này và khám phá những thông tin kiến thức mới nhất về văn hoá uống bia từ Bia Thầy Tu.'}
                </p>
                <div style={{ fontWeight: 600, color: 'var(--web-navy)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', padding: '14px 32px', border: '2px solid var(--web-navy)', borderRadius: 'var(--web-radius-md)' }}>
                  Khám phá ngay <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ═══════════════════════════════════════════ 
          ARTICLE GRID
      ═══════════════════════════════════════════ */}
      <section className="container" style={{ paddingBottom: '120px' }}>
        {standardArticles.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '40px'
          }}>
            {standardArticles.map((article) => {
              const readTime = article.word_count ? Math.round(article.word_count / 200) : 3;
              return (
                <Link 
                  key={article.id} 
                  href={`/kien-thuc/${article.slug || article.id}`}
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
                  {/* Card Thumbnail */}
                  {article.thumbnail_url && (
                    <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                      <Image
                        src={article.thumbnail_url}
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: '28px 32px 32px' }}>
                    <div style={{ 
                      display: 'flex', gap: '10px', fontSize: '13px', 
                      color: 'var(--web-text-secondary)', marginBottom: '16px',
                      fontWeight: 600, letterSpacing: '0.5px'
                    }}>
                      <span style={{ color: 'var(--web-gold-dark)' }}>{new Date(article.created_at).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>{readTime} phút</span>
                    </div>

                    <h3 style={{ 
                      fontSize: '22px', fontWeight: 700, color: 'var(--web-navy)',
                      marginBottom: '12px', lineHeight: 1.4,
                      fontFamily: 'var(--font-serif)',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden'
                    }}>
                      {article.title}
                    </h3>

                    <p style={{ 
                      fontSize: '15px', color: 'var(--web-text-secondary)', lineHeight: 1.7,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any,
                      overflow: 'hidden', flex: 1, marginBottom: '24px'
                    }}>
                      {article.meta_description || 'Tìm hiểu trọn vẹn thông tin và ứng dụng trực tiếp từ câu chuyện bài viết đang đề cập.'}
                    </p>

                    <div style={{ 
                      fontSize: '15px', fontWeight: 600,
                      color: 'var(--web-gold-dark)', display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      Đọc tiếp <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          !featuredArticle && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--web-text-secondary)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}>Danh mục đang được cập nhật...</h2>
            </div>
          )
        )}
      </section>
    </div>
  );
}
