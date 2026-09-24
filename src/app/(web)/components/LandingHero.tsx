'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Button } from './ui/Button';
import PhotoHero from './ui/PhotoHero';
import { useLanguage } from '../context/LanguageContext';

/** Hero trang chủ: PhotoHero kiểu Chimay, các khối chữ hiện dần bằng GSAP (tắt khi giảm chuyển động). */
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
    <PhotoHero
      ref={heroRef}
      reveal
      titleId="home-hero-title"
      image={{
        src: '/images/brand/benediktiner-official/home-hero.jpg',
        alt: 'Benediktiner Weissbier Naturtrüb bên ly bia, phía sau là Tu viện Ettal và dãy Alps',
        position: '68% center',
      }}
      eyebrow="Tu viện Ettal, Bavaria, từ 1330"
      title={t('hero.title.line1')}
      kicker={t('hero.title.line2')}
      actions={(
        <>
          <Button href="/san-pham" variant="light" size="lg">{t('hero.btn.explore')}</Button>
          <Button href="/thuong-hieu" variant="outline" size="lg">{t('hero.btn.story')}</Button>
        </>
      )}
      credit={{ href: 'https://www.benediktiner-weissbier.de/en/', label: 'Hình ảnh: Benediktiner Weissbräu' }}
    >
      <p>{t('hero.description.1')} {t('hero.description.2')}</p>
    </PhotoHero>
  );
}
