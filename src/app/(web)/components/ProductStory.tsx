import React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import FlavorWheel, { type FlavorAxis } from './ui/FlavorWheel';
import FormatStrip, { type FormatProduct } from './ui/FormatStrip';
import OutlineWordmark from './ui/OutlineWordmark';
import PhotoHero from './ui/PhotoHero';
import ProfileScale from './ui/ProfileScale';
import SplitBlock from './ui/SplitBlock';
import TitleBlock from './ui/TitleBlock';
import styles from './ProductStory.module.css';

type Img = { src: string; alt: string; position?: string };
type Action = { href: string; label: string; external?: boolean };

export const COLOR_SCALE = ['Vàng nhạt', 'Vàng', 'Hổ phách', 'Nâu', 'Nâu đậm'] as const;
export const CLARITY_SCALE = ['Trong', 'Đục nhẹ', 'Đục'] as const;
export const FOAM_SCALE = ['Mỏng', 'Vừa', 'Dày mịn'] as const;

export interface ProductStoryProps {
  wordmark: string;
  hero: {
    eyebrow: string;
    title: string;
    kicker: string;
    meta: string;
    /** Ảnh lifestyle tràn màn hình. Không có thì dùng `cutout` trên khối xanh đêm. */
    photo?: Img;
    cutout?: Img;
  };
  intro: {
    title: string;
    body: React.ReactNode;
    image: Img;
    actions: Action[];
  };
  profile?: {
    flavors: FlavorAxis[];
    color: number;
    clarity: number;
    foam: number;
    serving: string;
  };
  /** Cột phải cạnh hồ sơ hương vị, như "Un peu d'histoire" của Chimay. */
  notes?: { title: string; items: { term: string; text: string }[] };
  story?: { title: string; body: React.ReactNode };
  ritual?: { title: string; kicker?: string; steps: readonly (readonly [string, string])[] };
  formats?: { title?: string; products: FormatProduct[] };
  /** Không có ảnh món ăn thì hiện khối vàng phẳng chia cột thay cho khối chia đôi. */
  pairing?: { image?: Img; title: string; kicker: string; intro?: string; items: { title: string; text: string }[] };
  cta: { title: string; kicker?: string; text: string; action: Action };
  /** Khối riêng của từng trang, chèn sau phần giới thiệu. */
  children?: React.ReactNode;
}

function ProductActions({ actions }: { actions: Action[] }) {
  return (
    <div className={styles.actions}>
      {actions.map((a, i) => (
        <Button
          key={a.href + a.label}
          href={a.href}
          variant={i === 0 ? 'primary' : 'link'}
          target={a.external ? '_blank' : undefined}
          rel={a.external ? 'noopener noreferrer' : undefined}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
}

/**
 * Trang sản phẩm theo bố cục trang Chimay Bleue: hero, khối giới thiệu kèm ảnh chai,
 * hồ sơ hương vị (bánh xe, thang màu, độ trong, bọt) cạnh ghi chú nếm và câu chuyện,
 * cách rót, các quy cách lấy từ dữ liệu thật, món ăn kèm, dải liên hệ.
 */
export default function ProductStory({ wordmark, hero, intro, profile, notes, story, ritual, formats, pairing, cta, children }: ProductStoryProps) {
  return (
    <div className={styles.page}>
      {hero.photo ? (
        <PhotoHero
          size="medium"
          image={hero.photo}
          eyebrow={hero.eyebrow}
          title={hero.title}
          kicker={hero.kicker}
          wordmark={wordmark}
          titleId="product-hero-title"
        >
          <p>{hero.meta}</p>
        </PhotoHero>
      ) : (
        <section className={styles.cutoutHero} data-surface="ink" aria-labelledby="product-hero-title">
          <div className={styles.cutoutInner}>
            <div className={`container ${styles.cutoutGrid}`}>
              <div>
                <TitleBlock as="h1" size="hero" id="product-hero-title" eyebrow={hero.eyebrow} title={hero.title} kicker={hero.kicker} />
                <p className={styles.heroMeta}>{hero.meta}</p>
              </div>
              {hero.cutout ? (
                <div className={styles.cutoutMedia}>
                  <Image src={hero.cutout.src} alt={hero.cutout.alt} fill priority fetchPriority="high" sizes="(max-width: 767px) 80vw, 40vw" className={styles.cutoutImage} />
                </div>
              ) : null}
            </div>
          </div>
          <OutlineWordmark text={wordmark} className={styles.cutoutWordmark} />
        </section>
      )}

      <section className={styles.section} aria-labelledby="product-intro-title">
        <div className={`container ${styles.introGrid}`}>
          <div className={styles.introMedia}>
            <Image src={intro.image.src} alt={intro.image.alt} fill sizes="(max-width: 899px) 90vw, 40vw" className={styles.introImage} />
          </div>
          <div>
            <TitleBlock id="product-intro-title" title={intro.title} />
            <div className={styles.prose}>{intro.body}</div>
            <ProductActions actions={intro.actions} />
          </div>
        </div>
      </section>

      {children}

      {profile || notes || story ? (
        <section className={styles.profileSection} aria-label="Hồ sơ hương vị">
          <div className={`container ${profile ? styles.profileGrid : styles.profileSingle}`}>
            {profile ? (
              <aside className={styles.profilePanel}>
                <p className={styles.panelMeta}>{profile.serving}</p>
                <FlavorWheel
                  id="flavor-wheel"
                  axes={profile.flavors}
                  note="Thang 0 đến 5, tổng hợp từ mô tả hương vị trên trang, mang tính tham khảo."
                />
                <div className={styles.scales}>
                  <ProfileScale label="Màu sắc" options={COLOR_SCALE} selected={profile.color} />
                  <ProfileScale label="Độ trong" options={CLARITY_SCALE} selected={profile.clarity} />
                  <ProfileScale label="Lớp bọt" options={FOAM_SCALE} selected={profile.foam} />
                </div>
              </aside>
            ) : null}
            <div className={styles.profileText}>
              {notes ? (
                <div>
                  <TitleBlock title={notes.title} />
                  <dl className={styles.notes}>
                    {notes.items.map((n) => (
                      <div key={n.term}>
                        <dt>{n.term}</dt>
                        <dd>{n.text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {story ? (
                <div className={styles.story}>
                  <TitleBlock title={story.title} />
                  <div className={styles.prose}>{story.body}</div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {ritual ? (
        <section className={styles.section} aria-labelledby="product-ritual-title">
          <div className="container">
            <TitleBlock id="product-ritual-title" align="center" title={ritual.title} kicker={ritual.kicker} />
            <ol className={styles.ritual}>
              {ritual.steps.map(([title, text], i) => (
                <li key={title}>
                  <span className={styles.ritualNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {formats && formats.products.length > 0 ? (
        <section className={`${styles.section} ${styles.formatsSection}`} aria-labelledby="product-formats-title">
          <div className="container">
            <TitleBlock id="product-formats-title" title={formats.title ?? 'Các quy cách'} kicker="Giá bán lẻ tham khảo" />
            <div className={styles.afterTitle}>
              <FormatStrip products={formats.products} />
            </div>
          </div>
        </section>
      ) : null}

      {pairing?.image ? (
        <SplitBlock image={pairing.image} tone="gold" reverse title={pairing.title} kicker={pairing.kicker}>
          {pairing.intro ? <p>{pairing.intro}</p> : null}
          <dl className={styles.pairing}>
            {pairing.items.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </SplitBlock>
      ) : pairing ? (
        <section className={styles.pairingBand} aria-labelledby="product-pairing-title">
          <div className="container">
            <TitleBlock id="product-pairing-title" title={pairing.title} kicker={pairing.kicker} />
            {pairing.intro ? <p className={styles.pairingIntro}>{pairing.intro}</p> : null}
            <dl className={styles.pairingColumns}>
              {pairing.items.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className={styles.cta} data-surface="ink" aria-labelledby="product-cta-title">
        <div className={`container ${styles.ctaInner}`}>
          <TitleBlock id="product-cta-title" align="center" title={cta.title} kicker={cta.kicker} />
          <p>{cta.text}</p>
          <Button
            href={cta.action.href}
            variant="light"
            size="lg"
            target={cta.action.external ? '_blank' : undefined}
            rel={cta.action.external ? 'noopener noreferrer' : undefined}
          >
            {cta.action.label}
          </Button>
        </div>
      </section>
    </div>
  );
}
