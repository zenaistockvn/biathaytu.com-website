'use client';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ZaloCTA from './ZaloCTA';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP);

export default function LandingHero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selector = gsap.utils.selector(heroRef);
    const introItems = selector('.hero-badge, .hero-title, .hero-desc, .hero-actions, .hero-trust-bar');
    const productItems = selector('.hero-product-bottle, .hero-product-glass');

    if (reduceMotion) {
      gsap.set([...introItems, ...productItems], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    });

    timeline
      .from(introItems, {
        autoAlpha: 0,
        y: 24,
        duration: 0.72,
        stagger: 0.09,
      })
      .from(
        productItems,
        {
          autoAlpha: 0,
          y: 34,
          scale: 0.96,
          duration: 0.86,
          stagger: 0.12,
        },
        '-=0.42'
      );
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="hero-dark">
      {/* Background lifestyle image + dark overlay */}
      <div className="hero-bg-image">
        <Image 
          src="/images/products/lifestyle_garden_v2.png"
          alt="Thưởng thức bia Đức phong cách"
          fill
          className="object-cover"
          priority
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className="container hero-container">
        <div className="hero-grid">
          {/* Left: Typography */}
          <div>
            <span className="hero-fade-in hero-badge">
              {t('hero.badge')}
            </span>

            <h1 className="hero-fade-in hero-title">
              {t('hero.title.line1')}<br/>{t('hero.title.line2')}
              <span className="hero-title-highlight">{t('hero.title.highlight')}</span>
            </h1>

            <p className="hero-fade-in hero-desc">
              {t('hero.description')}
            </p>

            <div className="hero-fade-in hero-actions">
              <Button href="/san-pham" variant="primary" size="lg" className="hero-btn-shadow">
                {t('hero.btn.explore')}
              </Button>
              <ZaloCTA 
                label={t('hero.btn.quote')} 
                variant="outline" 
                className="hero-outline-btn"
              />
            </div>

            {/* Trust badges */}
            <div className="hero-trust-bar hero-fade-in">
              <div className="hero-trust-item">
                <span className="hero-trust-icon">★★★</span>
                <span className="hero-trust-label">{t('trust.award')}</span>
              </div>
              <div className="hero-trust-item">
                <span className="hero-trust-icon">VN</span>
                <span className="hero-trust-label">{t('trust.shipping')}</span>
              </div>
              <div className="hero-trust-item">
                <span className="hero-trust-icon">DE</span>
                <span className="hero-trust-label">{t('trust.authentic')}</span>
              </div>
            </div>
          </div>

          {/* Right: Official Product Images */}
          <div className="hero-product-zone">
            <div className="hero-product-glow" />
            <div className="hero-product-bottle">
              <Image 
                src="/images/products/official/benediktiner/bottle_removebg.png"
                alt="Benediktiner Weissbier Naturtrüb 0.5L — Chai chính hãng"
                fill
                className="object-contain"
                priority
                sizes="200px"
              />
            </div>
            <div className="hero-product-glass hero-fade-in-up">
              <Image 
                src="/images/products/official/benediktiner/glass_removebg.png"
                alt="Cốc bia Benediktiner Weissbier 0.5L — Cốc chính hãng"
                fill
                className="object-contain"
                priority
                sizes="220px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gold divider */}
      <div className="hero-bottom-divider" />
    </section>
  );
}
