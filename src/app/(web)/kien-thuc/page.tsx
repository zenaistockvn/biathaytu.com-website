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
  description: 'Cách rót bia lúa mì, món Việt ăn với bia Đức, chuyện tu viện Ettal và các dòng bia Đức khác nhau ra sao. Bài viết của Bia Thầy Tu.',
  alternates: {
    canonical: 'https://www.biathaytu.com.vn/kien-thuc',
  },
  openGraph: {
    title: 'Kiến thức bia Đức',
    description: 'Cách rót bia lúa mì, món Việt ăn với bia Đức, chuyện tu viện Ettal và các dòng bia Đức khác nhau ra sao. Bài viết của Bia Thầy Tu.',
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
    description: 'Cách rót bia lúa mì, món Việt ăn với bia Đức, chuyện tu viện Ettal và các dòng bia Đức khác nhau ra sao. Bài viết của Bia Thầy Tu.',
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
        title="Kiến thức bia Đức"
        kicker="Rót bia, món ăn, nguồn gốc"
        lead="Rót bia lúa mì sao cho bọt dày, món nào ăn với Dunkel, vì sao bia mang tên thầy tu lại ủ ở Lich."
        image={{ src: '/images/brand/benediktiner-official/home-hero.jpg', alt: 'Benediktiner Weissbier trước khung cảnh Tu viện Ettal', position: '68% center' }}
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
