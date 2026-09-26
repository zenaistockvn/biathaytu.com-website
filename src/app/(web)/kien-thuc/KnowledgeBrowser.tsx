'use client';

import { useState } from 'react';
import ArticleCard, { ArticleGrid, type ArticleSummary } from '../components/ui/ArticleCard';
import { ARTICLE_TOPICS, type ArticleTopicId } from '@/config/articleTopics';
import styles from './KnowledgeBrowser.module.css';

const PAGE_SIZE = 9;

/**
 * Lưới bài viết có lọc theo chủ đề và nút "Xem thêm" (audit L3). Mọi bài vẫn có trong HTML
 * (bài chưa hiện dùng thuộc tính `hidden`) để công cụ tìm kiếm đọc được đủ link.
 */
export default function KnowledgeBrowser({ articles }: { articles: (ArticleSummary & { topic: ArticleTopicId })[] }) {
  const [topic, setTopic] = useState<ArticleTopicId | 'all'>('all');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const counts = new Map<ArticleTopicId, number>();
  for (const article of articles) counts.set(article.topic, (counts.get(article.topic) ?? 0) + 1);
  const matching = articles.filter((article) => topic === 'all' || article.topic === topic);
  const visible = new Set(matching.slice(0, limit).map((article) => article.id));
  const remaining = matching.length - Math.min(limit, matching.length);

  const choose = (value: ArticleTopicId | 'all') => {
    setTopic(value);
    setLimit(PAGE_SIZE);
  };

  return (
    <section className={styles.browser} aria-label="Tất cả bài viết">
      <div className={styles.topics} role="group" aria-label="Chủ đề">
        <button type="button" className={styles.topic} aria-pressed={topic === 'all'} onClick={() => choose('all')}>
          Tất cả <span className={styles.count}>{articles.length}</span>
        </button>
        {ARTICLE_TOPICS.filter((item) => counts.get(item.id)).map((item) => (
          <button key={item.id} type="button" className={styles.topic} aria-pressed={topic === item.id} onClick={() => choose(item.id)}>
            {item.label} <span className={styles.count}>{counts.get(item.id)}</span>
          </button>
        ))}
      </div>

      <ArticleGrid>
        {articles.map((article, index) => (
          <div key={article.id} hidden={!visible.has(article.id)} className={styles.cell}>
            <ArticleCard article={article} position={index + 1} />
          </div>
        ))}
      </ArticleGrid>

      {remaining > 0 ? (
        <div className={styles.more}>
          <button type="button" className="btn-outline" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
            Xem thêm bài viết ({remaining})
          </button>
        </div>
      ) : null}
    </section>
  );
}
