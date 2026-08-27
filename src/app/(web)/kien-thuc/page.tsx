import Link from 'next/link';
import Image from 'next/image';
import { getPublishedArticles } from '@/lib/data/articles';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Kiến Thức Bia Đức',
  description: 'Khám phá thế giới bia Đức: từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
  alternates: {
    canonical: 'https://www.biathaytu.com/kien-thuc',
  },
  openGraph: {
    title: 'Kiến Thức Bia Đức',
    description: 'Khám phá thế giới bia Đức: từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
    type: 'website',
    url: 'https://www.biathaytu.com/kien-thuc',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Kiến Thức Bia Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kiến Thức Bia Đức',
    description: 'Khám phá thế giới bia Đức: từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
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
  const articleList = getPublishedArticles() as unknown as ArticleSummary[];
  const featuredArticle = articleList.length > 0 ? articleList[0] : null;
  const standardArticles = articleList.length > 1 ? articleList.slice(1) : [];

  return (
    <div className="knowledge-page">
      {/* HERO SECTION, Dark Premium Magazine */}
      <section className="knowledge-hero">
        <div className="knowledge-hero-overlay" />
        
        <div className="container knowledge-hero-container">
          <p className="knowledge-hero-badge">
            Tạp Chí Văn Hoá
          </p>
          <h1 className="knowledge-hero-title">
            Thế Giới Bia Đức
          </h1>
          <p className="knowledge-hero-subtitle">
            Từ nghệ thuật rót bia đúng chuẩn, kiến thức ẩm thực ghép rượu đến những giai thoại lịch sử đằng sau các tu viện huy hoàng thời Trung Cổ.
          </p>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {featuredArticle && (
        <section className="container knowledge-featured-section">
          <Link href={`/kien-thuc/${featuredArticle.slug || featuredArticle.id}`} className="knowledge-featured-link">
            <div className="knowledge-featured-card">
              <div className="knowledge-featured-thumb">
                <Image
                  src={featuredArticle.thumbnail_url || '/images/sanh_bia_duc_cover.png'}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </div>
              <div className="knowledge-featured-body">
                <div className="knowledge-featured-meta">
                  <span className="knowledge-featured-badge">Bài Trọng Tâm</span>                  <span>{new Date(featuredArticle.created_at).toLocaleDateString('vi-VN')}</span>                  <span>{featuredArticle.word_count ? Math.round(featuredArticle.word_count / 200) : 3} phút đọc</span>
                </div>
                <h2 className="knowledge-featured-title">
                  {featuredArticle.title}
                </h2>
                <p className="knowledge-featured-desc">
                  {featuredArticle.meta_description || 'Nhấn để đọc chi tiết bài viết này và khám phá những thông tin kiến thức mới nhất về văn hoá uống bia từ Bia Thầy Tu.'}
                </p>
                <div className="knowledge-featured-cta">
                  Khám phá ngay
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ARTICLE GRID */}
      <section className="container knowledge-grid-section">
        {standardArticles.length > 0 ? (
          <div className="knowledge-grid">
            {standardArticles.map((article) => {
              const readTime = article.word_count ? Math.round(article.word_count / 200) : 3;
              return (
                <Link 
                  key={article.id} 
                  href={`/kien-thuc/${article.slug || article.id}`}
                  className="knowledge-card"
                >
                  <div className="knowledge-card-thumb">
                    <Image
                      src={article.thumbnail_url || '/images/sanh_bia_duc_cover.png'}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  
                  <div className="knowledge-card-body">
                    <div className="knowledge-card-meta">
                      <span className="knowledge-card-date">{new Date(article.created_at).toLocaleDateString('vi-VN')}</span>                      <span>{readTime} phút</span>
                    </div>

                    <h3 className="knowledge-card-title">
                      {article.title}
                    </h3>

                    <p className="knowledge-card-desc">
                      {article.meta_description || 'Tìm hiểu trọn vẹn thông tin và ứng dụng trực tiếp từ câu chuyện bài viết đang đề cập.'}
                    </p>

                    <div className="knowledge-card-action">
                      Đọc tiếp
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          !featuredArticle && (
            <div className="knowledge-empty-state">
              <h2 className="knowledge-empty-title">Danh mục đang được cập nhật...</h2>
            </div>
          )
        )}
      </section>
    </div>
  );
}
