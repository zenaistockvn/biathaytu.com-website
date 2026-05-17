'use client';
import Image from 'next/image';
import Link from 'next/link';
import ZaloCTA from './ZaloCTA';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

export default function LandingHero() {
  const { t } = useLanguage();

  return (
    <section className="hero-dark">
      {/* Background lifestyle image + dark overlay */}
      <div className="hero-bg-image">
        <Image 
          src="/images/products/lifestyle_garden_v2.png"
          alt="Thưởng thức bia Đức phong cách"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '40px', paddingBottom: '40px' }}>
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
                style={{ objectFit: 'contain' }}
                priority
                sizes="200px"
              />
            </div>
            <div className="hero-product-glass hero-fade-in-up">
              <Image 
                src="/images/products/official/benediktiner/glass_removebg.png"
                alt="Cốc bia Benediktiner Weissbier 0.5L — Cốc chính hãng"
                fill
                style={{ objectFit: 'contain' }}
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
