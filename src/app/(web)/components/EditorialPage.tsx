import React from 'react';
import { Button } from './ui/Button';
import PhotoHero from './ui/PhotoHero';
import TitleBlock from './ui/TitleBlock';
import styles from './EditorialPage.module.css';

type Img = { src: string; alt: string; position?: string };

interface EditorialPageProps {
  hero: {
    eyebrow?: string;
    title: string;
    kicker?: string;
    lead?: React.ReactNode;
    /** Có ảnh thì dùng PhotoHero; không có thì dải xanh đêm phẳng. */
    image?: Img;
  };
  /** 'light': tiêu đề trên nền trắng cho trang pháp lý, như các trang phụ của Chimay. */
  tone?: 'ink' | 'light';
  /** Cột bài viết hẹp (mặc định) hoặc rộng cho bảng, lưới. */
  width?: 'narrow' | 'wide';
  children: React.ReactNode;
  /** Khối nằm ngoài cột bài viết, tràn ngang (FAQ, dải kêu gọi...). */
  after?: React.ReactNode;
}

/**
 * Trang nội dung (kiến thức, dịch vụ, pháp lý): hero, cột bài viết có sẵn kiểu chữ cho h2/h3/p/ul/table.
 * Các khối con dùng kèm: Summary, InfoGrid, CtaBand, FaqSection.
 */
export default function EditorialPage({ hero, tone = 'ink', width = 'narrow', children, after }: EditorialPageProps) {
  return (
    <div className={styles.page}>
      {hero.image ? (
        <PhotoHero size="medium" image={hero.image} eyebrow={hero.eyebrow} title={hero.title} kicker={hero.kicker} wordmark={false} titleId="page-title">
          {hero.lead ? <p>{hero.lead}</p> : null}
        </PhotoHero>
      ) : (
        <header className={tone === 'light' ? styles.heroLight : styles.heroInk} data-surface={tone === 'ink' ? 'ink' : undefined}>
          <div className="container">
            <TitleBlock as="h1" size="h1" align={tone === 'light' ? 'center' : 'left'} id="page-title" eyebrow={hero.eyebrow} title={hero.title} kicker={hero.kicker} />
            {hero.lead ? <p className={styles.lead}>{hero.lead}</p> : null}
          </div>
        </header>
      )}
      {/* Khoảng đệm dọc ở lớp ngoài: .container toàn cục đặt lại padding. */}
      <div className={styles.body}>
        <div className="container">
          <article className={`${styles.prose} ${width === 'wide' ? styles.wide : ''}`}>{children}</article>
        </div>
      </div>
      {after}
    </div>
  );
}

/** Khung tóm tắt đầu bài. */
export function Summary({ children }: { children: React.ReactNode }) {
  return <aside className={styles.summary}>{children}</aside>;
}

/** Lưới thẻ phẳng có vạch trên, thay cho các thẻ bo góc cũ. */
export function InfoGrid({ items, columns = 3 }: { items: { title: React.ReactNode; text: React.ReactNode; meta?: React.ReactNode }[]; columns?: 2 | 3 | 4 }) {
  return (
    <ul className={`${styles.grid} ${styles[`cols${columns}`]}`}>
      {items.map((item, i) => (
        <li key={i}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          {item.meta ? <p className={styles.meta}>{item.meta}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** Các bước có đánh số lớn (cách rót, cách dùng bom...). */
export function StepList({ steps }: { steps: readonly { title: React.ReactNode; text: React.ReactNode }[] }) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, i) => (
        <li key={i}>
          <span className={styles.stepNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Dải kêu gọi trong cột bài viết. */
export function CtaBand({ title, text, action, secondary }: { title: string; text?: React.ReactNode; action: { href: string; label: string; external?: boolean }; secondary?: { href: string; label: string } }) {
  return (
    <aside className={styles.cta} data-surface="ink">
      <p className={styles.ctaTitle}>{title}</p>
      {text ? <p className={styles.ctaText}>{text}</p> : null}
      <div className={styles.ctaActions}>
        <Button
          href={action.href}
          variant="light"
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
        >
          {action.label}
        </Button>
        {secondary ? <Button href={secondary.href} variant="link">{secondary.label}</Button> : null}
      </div>
    </aside>
  );
}

/** Câu hỏi thường gặp dạng mở/đóng, đặt ngoài cột bài viết qua prop `after`. */
export function FaqSection({ items, title = 'Câu hỏi thường gặp' }: { items: readonly { question: string; answer: React.ReactNode }[]; title?: string }) {
  return (
    <section className={styles.faq} aria-labelledby="faq-title">
      <div className={`container ${styles.faqInner}`}>
        <TitleBlock id="faq-title" title={title} />
        <div className={styles.faqList}>
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true" /></summary>
              <div className={styles.faqAnswer}>{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
