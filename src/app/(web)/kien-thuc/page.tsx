import { getPublishedArticles, toArticleSummary } from '@/lib/data/articles';
import type { Metadata } from 'next';
import { PageHeader } from '../components/EditorialPage'
import { FeaturedArticle } from '../components/ui/ArticleCard'
import { getArticleTopic } from '@/config/articleTopics';
import KnowledgeBrowser from './KnowledgeBrowser';
import styles from './page.module.css';

export const revalidate = 3600;

/** Bài nổi bật cố định (câu chuyện Tu viện Ettal) thay vì bài mới nhất; bài này bị gỡ thì dùng bài mới nhất. */
const FEATURED_ARTICLE_SLUG = 'nguon-goc-bia-thay-tu-tu-vien-ettal';

export const metadata: Metadata = {
  title: 'Kiến thức bia Đức',
  description: 'Khám phá thế giới bia Đức: Từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
  alternates: {
    canonical: 'https://www.biathaytu.com.vn/kien-thuc',
  },
  openGraph: {
    title: 'Kiến thức bia Đức',
    description: 'Khám phá thế giới bia Đức: Từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/kien-thuc',
    images: [
      {
        url: '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Kiến thức bia Đức',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kiến thức bia Đức',
    description: 'Khám phá thế giới bia Đức: Từ cách thưởng thức, food pairing đến lịch sử và văn hoá.',
    images: ['/images/brand/benediktiner-official/beer-garden-closeup.jpg'],
  },
};

/** Danh sách kiến thức: dải tiêu đề, bài nổi bật kiểu "Une actualité pétillante" của Chimay, lưới thẻ bài viết. */
export default async function KienThucPage() {
  const articles = getPublishedArticles();
  const featured = articles.find((article) => article.slug === FEATURED_ARTICLE_SLUG) ?? articles[0] ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Tạp chí văn hóa"
        title="Kiến thức bia Đức"
        lead="Từ nghệ thuật rót bia, kết hợp món ăn đến những câu chuyện lịch sử đằng sau các tu viện Bavaria."
      />

      <div className={styles.body}>
        <div className="container">
          {featured ? <FeaturedArticle article={toArticleSummary(featured)} /> : null}

          {articles.length > 1 ? (
            <KnowledgeBrowser
              featuredId={featured?.id ?? null}
              articles={articles.map((article) => ({ ...toArticleSummary(article), topic: getArticleTopic(article.title).id }))}
            />
          ) : (
            !featured && <p className={styles.empty}>Danh mục đang được cập nhật.</p>
          )}
        </div>
      </div>
    </>
  );
}
