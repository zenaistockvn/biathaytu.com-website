import Image from 'next/image';
import Link from 'next/link';
import styles from './ArticleCard.module.css';

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string | null;
  meta_description: string | null;
  word_count: number | null;
  created_at: string;
  thumbnail_url: string | null;
}

// Bài chưa có ảnh đại diện: chọn ảnh chính hãng theo chủ đề bài, cố định theo bài.
// Ảnh cánh đồng hoa bia "Bitte ein Bit" chỉ dành cho bài về Bitburger, ảnh tu viện cho bài lịch sử.
const HOPS_IMAGE = '/images/brand/bitburger-official/siegelhopfen-field.jpg';
const ABBEY_IMAGE = '/images/brand/benediktiner-official/ettal-monastery.jpg';
const BENEDIKTINER_IMAGES = [
  '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
  '/images/brand/benediktiner-official/home-hero.jpg',
  '/images/brand/benediktiner-official/so-close-to-heaven.jpg',
];

/** `position`: vị trí trong danh sách, để hai thẻ liền nhau không trùng ảnh; thiếu thì cố định theo slug. */
function imageOf(article: ArticleSummary, position?: number): string {
  if (article.thumbnail_url) return article.thumbnail_url;
  const topic = `${article.title} ${article.slug ?? ''}`.toLowerCase();
  if (/bitburger|pils/.test(topic) && !/benediktiner|weissbier|lúa mì|lua-mi/.test(topic)) return HOPS_IMAGE;
  if (/ettal|nguồn gốc|nguon-goc/.test(topic)) return ABBEY_IMAGE;

  let slot = position;
  if (slot === undefined) {
    const key = article.slug || article.id;
    slot = 0;
    for (let i = 0; i < key.length; i++) slot = (slot * 31 + key.charCodeAt(i)) >>> 0;
  }
  return BENEDIKTINER_IMAGES[slot % BENEDIKTINER_IMAGES.length];
}

function meta(article: ArticleSummary) {
  const minutes = article.word_count ? Math.max(1, Math.round(article.word_count / 200)) : 3;
  return `${new Date(article.created_at).toLocaleDateString('vi-VN')} · ${minutes} phút đọc`;
}

/** Thẻ bài viết kiểu tin tức của Chimay: ảnh, ngày, tiêu đề, trích dẫn, "Đọc tiếp". */
export default function ArticleCard({ article, position }: { article: ArticleSummary; position?: number }) {
  return (
    <Link href={`/kien-thuc/${article.slug || article.id}`} className={styles.card}>
      <span className={styles.media}>
        <Image src={imageOf(article, position)} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className={styles.image} />
      </span>
      <span className={styles.body}>
        <span className={styles.meta}>{meta(article)}</span>
        <h3 className={styles.title}>{article.title}</h3>
        {article.meta_description ? <span className={styles.excerpt}>{article.meta_description}</span> : null}
        <span className={styles.cue} aria-hidden="true">
          Đọc tiếp
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
        </span>
      </span>
    </Link>
  );
}

/** Bài nổi bật như khối "Une actualité pétillante" của Chimay: ảnh lớn trái, khối xám phải. */
export function FeaturedArticle({ article }: { article: ArticleSummary }) {
  return (
    <Link href={`/kien-thuc/${article.slug || article.id}`} className={styles.featured}>
      <span className={styles.featuredMedia}>
        <Image src={imageOf(article, 0)} alt="" fill priority fetchPriority="high" sizes="(max-width: 899px) 100vw, 60vw" className={styles.image} />
      </span>
      <span className={styles.featuredBody}>
        <span className={styles.meta}>Bài nổi bật · {meta(article)}</span>
        <h2 className={styles.featuredTitle}>{article.title}</h2>
        {article.meta_description ? <span className={styles.excerpt}>{article.meta_description}</span> : null}
        <span className={`btn-dark ${styles.featuredButton}`}>Đọc bài viết</span>
      </span>
    </Link>
  );
}

export function ArticleGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
