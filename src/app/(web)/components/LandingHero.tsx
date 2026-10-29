'use client';

import { Button } from './ui/Button';
import PhotoHero from './ui/PhotoHero';
import { useLanguage } from '../context/LanguageContext';

/** Hero trang chủ: PhotoHero kiểu Chimay, các khối chữ hiện dần bằng CSS (tắt khi giảm chuyển động). */
export default function LandingHero() {
  const { t } = useLanguage();

  return (
    <PhotoHero
      reveal
      titleId="home-hero-title"
      image={{
        src: '/images/brand/benediktiner-official/home-hero.jpg',
        alt: 'Benediktiner Weissbier Naturtrüb bên ly bia, phía sau là Tu viện Ettal và dãy Alps',
        position: '68% center',
      }}
      eyebrow="Công thức tu viện Ettal, ủ tại Lich"
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
