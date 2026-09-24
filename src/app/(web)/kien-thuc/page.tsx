import { getPublishedArticles } from '@/lib/data/articles';
import type { Metadata } from 'next';
import { PageHeader } from '../components/EditorialPage'
import ArticleCard, { ArticleGrid, FeaturedArticle } from '../components/ui/ArticleCard'
import styles from './page.module.css';

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
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
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
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
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

/** Danh sách kiến thức: dải tiêu đề, bài nổi bật kiểu "Une actualité pétillante" của Chimay, lưới thẻ bài viết. */
export default async function KienThucPage() {
  const articleList = getPublishedArticles() as unknown as ArticleSummary[];
  const featuredArticle = articleList.length > 0 ? articleList[0] : null;
  const standardArticles = articleList.length > 1 ? articleList.slice(1) : [];

  return (
    <>
      <PageHeader
        eyebrow="Tạp chí văn hóa"
        title="Kiến thức bia Đức"
        kicker="Thưởng thức, ẩm thực, lịch sử"
        lead="Từ nghệ thuật rót bia, kết hợp món ăn đến những câu chuyện lịch sử đằng sau các tu viện Bavaria."
      />

      <div className={styles.body}>
        <div className="container">
          {featuredArticle ? <FeaturedArticle article={featuredArticle} /> : null}

          {standardArticles.length > 0 ? (
            <section className={styles.list} aria-label="Tất cả bài viết">
              <ArticleGrid>
                {standardArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </ArticleGrid>
            </section>
          ) : (
            !featuredArticle && <p className={styles.empty}>Danh mục đang được cập nhật.</p>
          )}
        </div>
      </div>
    </>
  );
}
