'use client';
import Image from 'next/image';
import Link from 'next/link';
import ZaloCTA from './ZaloCTA';
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
            <span className="hero-fade-in" style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px', 
              backgroundColor: 'rgba(184, 134, 11, 0.12)', 
              color: 'var(--web-gold-light)', 
              fontSize: '11px',
              fontWeight: 700, 
              letterSpacing: '2.5px', 
              textTransform: 'uppercase', 
              marginBottom: '28px', 
              borderRadius: '6px',
              border: '1px solid rgba(184, 134, 11, 0.2)',
              fontFamily: "'Inter', sans-serif",
            }}>
              {t('hero.badge')}
            </span>

            <h1 className="hero-fade-in" style={{ 
              fontSize: 'clamp(48px, 5.5vw, 72px)', 
              marginBottom: '24px',
              lineHeight: 1.08,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-1.5px',
              fontFamily: "'Playfair Display', serif"
            }}>
              {t('hero.title.line1')}<br/>{t('hero.title.line2')}
              <span style={{ 
                color: 'var(--web-gold-light)', 
                display: 'block', 
                fontSize: 'clamp(32px, 3.5vw, 48px)', 
                marginTop: '12px',
                letterSpacing: '0px',
                fontStyle: 'italic',
                fontWeight: 600,
              }}>{t('hero.title.highlight')}</span>
            </h1>

            <p className="hero-fade-in" style={{ 
              fontSize: 'clamp(16px, 1.8vw, 20px)', 
              marginBottom: '36px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.7,
              maxWidth: '520px',
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif"
            }}>
              {t('hero.description')}
            </p>

            <div className="hero-fade-in" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/san-pham" className="btn-primary" style={{ 
                padding: '16px 36px', 
                fontSize: '15px',
                boxShadow: '0 4px 25px rgba(184, 134, 11, 0.35)',
              }}>
                {t('hero.btn.explore')}
              </Link>
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
