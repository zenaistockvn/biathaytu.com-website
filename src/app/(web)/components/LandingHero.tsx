'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import styles from '../HomeBrand.module.css';

export default function LandingHero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = gsap.utils.selector(heroRef)('[data-hero-reveal]');

    if (reduceMotion) {
      gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline.from(items, {
      autoAlpha: 0,
      y: 24,
      duration: 0.72,
      stagger: 0.09,
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="home-hero-title">
      <Image
        src="/images/brand/benediktiner-official/home-hero.jpg"
        alt="Benediktiner Weissbier Naturtrüb bên ly bia, phía sau là Tu viện Ettal và dãy Alps"
        fill
        priority
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />

      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow} data-hero-reveal>{t('hero.badge')}</p>
          <h1 id="home-hero-title" className={styles.heroTitle} data-hero-reveal>
            {t('hero.title.line1')}
            <span>{t('hero.title.line2')}</span>
          </h1>
          <p className={styles.heroDescription} data-hero-reveal>
            {t('hero.description.1')} {t('hero.description.2')}
          </p>
          <div className={styles.heroActions} data-hero-reveal>
            <Button href="/san-pham" variant="primary" size="lg">
              {t('hero.btn.explore')}
            </Button>
            <Button href="/thuong-hieu" variant="outline" size="lg" className={styles.heroSecondaryButton}>
              {t('hero.btn.story')}
            </Button>
          </div>
          <div className={styles.heroFacts} data-hero-reveal aria-label="Thông tin nổi bật">
            <span><strong>1330</strong> Tu viện Ettal thành lập</span>
            <span><strong>400+</strong> năm truyền thống ủ bia</span>
            <span><strong>Đức</strong> nấu theo công thức Benedictine</span>
          </div>
        </div>
      </div>

      <a className={styles.imageCredit} href="https://www.benediktiner-weissbier.de/en/" target="_blank" rel="noopener noreferrer">
        Hình ảnh: Benediktiner Weissbräu
      </a>
    </section>
  );
}
