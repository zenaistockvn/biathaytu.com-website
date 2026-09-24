import type { Metadata } from 'next';
import LandingHero from './components/LandingHero';
import JsonLd, { getBreadcrumbSchema, getLandingFAQSchema, getStoreSchema } from './components/JsonLd';
import BeerCard, { BeerCardGrid } from './components/ui/BeerCard';
import { Button } from './components/ui/Button';
import CategoryTile, { CategoryTileGrid } from './components/ui/CategoryTile';
import { BottleIcon, WeizenGlassIcon } from './components/ui/LineIcons';
import SplitBlock from './components/ui/SplitBlock';
import TitleBlock from './components/ui/TitleBlock';
import {
  COMPANY_CONFIG,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';
import styles from './Home.module.css';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Benediktiner, hơn 400 năm truyền thống bia Đức',
  description: 'Khám phá Benediktiner Weissbier: nguồn gốc Ettal, các dòng Naturtrüb, Dunkel, Festbier, nghệ thuật thưởng thức và thông tin tư vấn tại Việt Nam.',
  alternates: { canonical: 'https://www.biathaytu.com' },
  openGraph: {
    title: 'Bia Thầy Tu Benediktiner, hơn 400 năm truyền thống bia Đức',
    description: 'Câu chuyện Ettal, hương vị Benediktiner và điểm giới thiệu tại Việt Nam.',
    type: 'website',
    url: 'https://www.biathaytu.com',
    images: [{
      url: '/images/brand/benediktiner-official/home-hero.jpg',
      width: 1920,
      height: 969,
      alt: 'Benediktiner Weissbier trước khung cảnh Tu viện Ettal',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner, hơn 400 năm truyền thống bia Đức',
    description: 'Câu chuyện Ettal, hương vị Benediktiner và điểm giới thiệu tại Việt Nam.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const beers = [
  {
    name: 'Weissbier Naturtrüb',
    type: 'bia lúa mì không lọc',
    image: '/images/products/official/benediktiner/glass_removebg.png',
    href: '/benediktiner-weissbier-naturtrub',
    meta: '5,4% vol. Vàng hổ phách, hương chuối chín và đinh hương',
  },
  {
    name: 'Weissbier Dunkel',
    type: 'bia lúa mì đen',
    image: '/images/brand/benediktiner-official/dunkel-glass-nobg.webp',
    href: '/benediktiner-dunkel',
    meta: '5,4% vol. Nâu hổ phách, hương malt rang và caramel',
  },
  {
    name: 'Festbier',
    type: 'bia lễ hội, bom 5 lít',
    image: '/images/brand/benediktiner-official/festbier-keg-nobg.webp',
    href: '/san-pham/benediktiner-festbier-bom-5l',
    meta: '5,8% vol. Vàng sáng, hương malt chín và hoa bia nhẹ',
  },
] as const;

const tastingSteps = [
  ['Làm lạnh đúng mức', 'Ướp lạnh vừa đủ để bia vẫn giữ được hương lúa mì, malt và men đặc trưng.'],
  ['Dùng đúng loại ly', 'Ly Weissbier cao giúp giữ lớp bọt, gom hương và thể hiện trọn màu sắc của bia.'],
  ['Rót chậm, chừa men', 'Nghiêng ly khi rót; xoay nhẹ phần bia cuối chai nếu muốn thưởng thức trọn lớp men tự nhiên.'],
] as const;

const faqItems = [
  {
    question: 'Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?',
    answer: 'Benediktiner được nấu tại Lich, Đức theo công thức Benedictine nguyên bản cho Benediktiner Weissbräu GmbH, Ettal. Tu viện Ettal là cội nguồn của truyền thống và triết lý thương hiệu.',
  },
  {
    question: 'Bia Thầy Tu hiện giới thiệu những dòng Benediktiner nào?',
    answer: 'Các dòng nổi bật gồm Weissbier Naturtrüb, Weissbier Dunkel và Festbier, với nhiều quy cách chai, lon hoặc bom tùy từng thời điểm.',
  },
  {
    question: 'Có thể đến đâu để tìm hiểu và trải nghiệm sản phẩm?',
    answer: `Anh/chị có thể liên hệ trước hoặc ghé ${COMPANY_CONFIG.showroomAddress} để được giới thiệu sản phẩm và tư vấn phù hợp.`,
  },
] as const;

/**
 * Trang chủ theo trình tự chimay.com: hero ảnh, hai ô danh mục, khối chia đôi về tu viện,
 * danh sách bia, khối thưởng thức, hai khối màu Showroom và HORECA, câu hỏi thường gặp.
 */
export default function LandingPage() {
  const telHref = getCompanyTelHref();
  const zaloUrl = getCompanyZaloUrl();
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_CONFIG.showroomAddress)}`;

  return (
    <>
      <JsonLd type="faq" data={getLandingFAQSchema()} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang chủ', url: 'https://www.biathaytu.com' },
      ])} />
      <JsonLd type="organization" data={getStoreSchema()} />

      <LandingHero />

      <section className={styles.section} aria-labelledby="home-categories-title">
        <div className="container">
          <TitleBlock
            id="home-categories-title"
            align="center"
            icon={<WeizenGlassIcon size={72} />}
            title="Bia của chúng tôi"
            kicker="Nhập khẩu chính hãng từ Đức"
          />
          <div className={styles.afterTitle}>
            <CategoryTileGrid>
              <CategoryTile
                href="/san-pham#benediktiner"
                tone="ink"
                image={{ src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier Naturtrüb trên bàn gỗ ngoài vườn', position: '70% center' }}
                icon={<WeizenGlassIcon />}
                title="Benediktiner"
                kicker="Bia lúa mì tu viện"
              />
              <CategoryTile
                href="/san-pham#bia-duc-khac"
                tone="gold"
                image={{ src: '/images/brand/bitburger-official/siegelhopfen-field.jpg', alt: 'Người trồng hoa bia cho Bitburger giữa cánh đồng hoa bia', position: 'center 35%' }}
                icon={<BottleIcon />}
                title="Bia Đức"
                kicker="Tuyển chọn"
              />
            </CategoryTileGrid>
          </div>
        </div>
      </section>

      <SplitBlock
        image={{ src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Toàn cảnh Tu viện Ettal tại Bavaria, Đức' }}
        tone="ink"
        wordmark
        title="Khám phá"
        kicker="Tu viện Ettal, 1330"
        action={{ href: '/thuong-hieu', label: 'Đọc câu chuyện đầy đủ' }}
      >
        <p>Tu viện Ettal được thành lập năm 1330 giữa thung lũng Bavaria. Truyền thống bia lúa mì của các tu sĩ Benedictine hình thành hơn 400 năm trước và vẫn là nền tảng của Benediktiner ngày nay.</p>
        <p>Bia hiện được nấu tại Lich theo công thức Benedictine nguyên bản cho Benediktiner Weissbräu GmbH, Ettal.</p>
        <dl className={styles.facts}>
          <div><dt>1330</dt><dd>Tu viện Ettal thành lập</dd></div>
          <div><dt>400+</dt><dd>Năm truyền thống ủ bia</dd></div>
          <div><dt>Lich</dt><dd>Nơi nấu theo công thức gốc</dd></div>
        </dl>
      </SplitBlock>

      <section className={styles.section} aria-labelledby="home-beers-title">
        <div className="container">
          <TitleBlock id="home-beers-title" align="center" title="Các dòng bia" kicker="Benediktiner Weissbräu Ettal" />
          <div className={styles.afterTitle}>
            <BeerCardGrid>
              {beers.map((beer) => (
                <BeerCard
                  key={beer.name}
                  href={beer.href}
                  fit="contain"
                  image={{ src: beer.image, alt: `${beer.name}, hình ảnh sản phẩm chính hãng` }}
                  name={beer.name}
                  type={beer.type}
                  meta={beer.meta}
                />
              ))}
            </BeerCardGrid>
          </div>
          <div className={styles.moreLink}>
            <Button href="/san-pham" variant="link">Xem tất cả sản phẩm</Button>
          </div>
        </div>
      </section>

      <SplitBlock
        image={{ src: '/images/brand/benediktiner-official/so-close-to-heaven.jpg', alt: 'Poster chiến dịch Benediktiner So close to heaven: ly bia và lon Weissbier trước Tu viện Ettal', position: 'center 100%' }}
        tone="mist"
        reverse
        title="Thưởng thức"
        kicker="Ly Weizen, rót nghiêng"
        action={{ href: '/huong-dan-rot-bia-lua-mi', label: 'Xem hướng dẫn chi tiết' }}
      >
        <ol className={styles.steps}>
          {tastingSteps.map(([title, description], index) => (
            <li key={title}>
              <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </SplitBlock>

      <section className={styles.visit} aria-label="Showroom và khách hàng doanh nghiệp">
        <div className={`${styles.visitPanel} ${styles.visitAccent}`} data-surface="ink">
          <div className={styles.visitContent}>
            <TitleBlock title="Ghé thăm" kicker="Showroom German Taste" />
            <p>Không gian giới thiệu và tư vấn các dòng Bia Thầy Tu. Vui lòng liên hệ trước để được hỗ trợ đúng nhu cầu.</p>
            <address className={styles.address}>
              <span>{COMPANY_CONFIG.showroomAddress}</span>
              {telHref ? <a href={telHref}>Hotline {COMPANY_CONFIG.hotline}</a> : null}
            </address>
            <Button href={mapUrl} variant="light" target="_blank" rel="noopener noreferrer">Xem chỉ đường</Button>
          </div>
        </div>
        <div className={`${styles.visitPanel} ${styles.visitGold}`}>
          <div className={styles.visitContent}>
            <TitleBlock title="Cho nhà hàng" kicker="HORECA và đại lý" />
            <p>Tư vấn danh mục, quy cách chai, lon, bom và giải pháp giới thiệu sản phẩm phù hợp với mô hình nhà hàng, khách sạn và sự kiện.</p>
            <div className={styles.visitActions}>
              <Button href="/bia-duc-cho-nha-hang-khach-san" variant="dark">Giải pháp HORECA</Button>
              {zaloUrl ? <Button href={zaloUrl} variant="link" target="_blank" rel="noopener noreferrer">Trao đổi qua Zalo</Button> : null}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div>
            <TitleBlock id="faq-title" title="Câu hỏi thường gặp" />
            <p className={styles.faqIntro}>Các câu trả lời ngắn, ưu tiên thông tin có thể kiểm chứng từ hãng và đơn vị tư vấn tại Việt Nam.</p>
          </div>
          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true" /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
