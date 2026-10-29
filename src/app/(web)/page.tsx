import type { Metadata } from 'next';
import LandingHero from './components/LandingHero';
import JsonLd, { getBreadcrumbSchema, getLandingFAQSchema, getStoreSchema } from './components/JsonLd';
import BeerCard, { BeerCardGrid } from './components/ui/BeerCard';
import { Button } from './components/ui/Button';
import { WeizenGlassIcon } from './components/ui/LineIcons';
import SplitBlock from './components/ui/SplitBlock';
import TitleBlock from './components/ui/TitleBlock';
import {
  COMPANY_CONFIG,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';
import styles from './Home.module.css';
import { NAV, breadcrumbTrail } from '@/config/navigation';
import { getLine } from '@/config/productLines';
import { noBreakNode } from '@/lib/vn-text';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Benediktiner, hơn 400 năm truyền thống bia Đức',
  description: 'Bia Thầy Tu là tên gọi ở Việt Nam của Benediktiner, bia lúa mì Đức ủ tại Lich theo công thức dòng Biển Đức. Ba dòng: Naturtrüb, Dunkel, Festbier.',
  alternates: { canonical: 'https://www.biathaytu.com.vn' },
  openGraph: {
    title: 'Bia Thầy Tu Benediktiner, hơn 400 năm truyền thống bia Đức',
    description: 'Câu chuyện Ettal, hương vị Benediktiner và điểm giới thiệu tại Việt Nam.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn',
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
    href: getLine('naturtrub').href as string,
    meta: '5,4% vol. Vàng đục tự nhiên, hương chuối chín và đinh hương',
  },
  {
    name: 'Weissbier Dunkel',
    type: 'bia lúa mì đen',
    image: '/images/brand/benediktiner-official/dunkel-glass-cutout.webp',
    href: getLine('dunkel').href as string,
    meta: '5,4% vol. Nâu đồng, hương malt rang và caramel',
  },
  {
    name: 'Festbier',
    type: 'bia lễ hội, bom 5 lít',
    image: '/images/brand/benediktiner-official/festbier-keg-nobg.webp',
    // Thẻ này giới thiệu Festbier bom 5 lít (ảnh bom, chữ om 5 lít) nên trỏ đúng SKU bom, không trỏ đích chung của dòng.
    href: '/san-pham/benediktiner-festbier-bom-5l',
    meta: '5,8% vol. Dòng mùa lễ hội, vị mạch nha đậm hơn',
  },
] as const;

const tastingSteps = [
  ['Làm lạnh đúng mức', 'Naturtrüb ngon ở 7 - 9 °C, Dunkel 8 - 10 °C. Lạnh quá thì bia bớt thơm.'],
  ['Dùng đúng loại ly', 'Ly Weizen cao, thành cong. Ly này giữ lớp bọt dày và gom mùi chuối chín, đinh hương.'],
  ['Rót chậm, chừa men', 'Nghiêng ly, rót chậm tới khoảng 3/4 chai. Xoay nhẹ phần còn lại cho men dưới đáy tan ra rồi rót nốt.'],
] as const;

const faqItems = [
  {
    question: 'Benediktiner có được nấu trực tiếp tại Tu viện Ettal không?',
    answer: 'Không. Benediktiner ủ tại Lich, bang Hessen, theo công thức gốc của dòng Biển Đức, cho Benediktiner Weissbräu GmbH, Ettal. Men lấy từ hầm tu viện Ettal.',
  },
  {
    question: 'Bia Thầy Tu hiện có những dòng Benediktiner nào?',
    answer: 'Weissbier Naturtrüb, Weissbier Dunkel và Festbier. Quy cách chai, lon hay bom 5L tùy từng dòng và từng lô hàng.',
  },
  {
    question: 'Bia Thầy Tu có nhà hàng không?',
    answer: `Có. Nhà hàng Bia Thầy Tu ở ${COMPANY_CONFIG.showroomAddress}, mở ${COMPANY_CONFIG.restaurantHours} mỗi ngày. Có món Đức như chân giò, xúc xích và có phòng riêng.`,
  },
  {
    question: 'Nhượng quyền nhà hàng Bia Thầy Tu ưu tiên khu vực nào?',
    answer: 'Hà Nội, TP. Hồ Chí Minh và các thành phố lớn. Bia cho nhà hàng nhượng quyền lấy trực tiếp từ công ty nhập khẩu.',
  },
  {
    question: 'Muốn xem sản phẩm tận nơi thì đến đâu?',
    answer: `Đến ${COMPANY_CONFIG.showroomAddress}. Anh chị gọi trước để bên mình chuẩn bị đúng dòng bia cần xem.`,
  },
] as const;

/**
 * Trang chủ theo trình tự chimay.com: hero ảnh, hai ô danh mục, khối chia đôi về tu viện,
 * danh sách bia, khối thưởng thức, hai khối màu Showroom và HORECA, câu hỏi thường gặp.
 */
export default function LandingPage() {
  const telHref = getCompanyTelHref();
  const zaloUrl = getCompanyZaloUrl();
  const mapUrl = COMPANY_CONFIG.showroomMapUrl;

  return (
    <>
      <JsonLd type="faq" data={getLandingFAQSchema()} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail())} />
      <JsonLd type="organization" data={getStoreSchema()} />

      <LandingHero />

      {/* Chỉ một lối vào sản phẩm ngay sau hero; bỏ khối "Bia của chúng tôi" trùng ý (audit L5). */}
      <section className={styles.section} aria-labelledby="home-beers-title">
        <div className="container">
          <TitleBlock id="home-beers-title" align="center" icon={<WeizenGlassIcon size={72} />} title="Các dòng bia" kicker="Benediktiner Weissbräu Ettal" />
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
        image={{ src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Toàn cảnh Tu viện Ettal tại Bavaria, Đức' }}
        tone="ink"
        wordmark
        title="Nguồn gốc"
        kicker="Tu viện Ettal, 1330"
        action={{ href: '/thuong-hieu', label: 'Đọc câu chuyện đầy đủ' }}
      >
        <p>Tu viện Ettal của dòng Biển Đức lập năm 1330, ở Bavaria. Benediktiner mang hơn 400 năm truyền thống bia lúa mì của dòng tu này.</p>
        <p>Bia không ủ trong tu viện. Benediktiner ủ tại Lich, bang Hessen, theo công thức gốc cho Benediktiner Weissbräu GmbH, Ettal, men lấy từ hầm tu viện Ettal.</p>
        <dl className={styles.facts}>
          <div><dt>1330</dt><dd>Tu viện Ettal thành lập</dd></div>
          <div><dt>400+</dt><dd>Năm truyền thống ủ bia</dd></div>
          <div><dt>Lich</dt><dd>Nơi ủ bia, bang Hessen</dd></div>
        </dl>
      </SplitBlock>


      <SplitBlock
        image={{ src: '/images/brand/benediktiner-official/so-close-to-heaven.jpg', alt: 'Poster chiến dịch Benediktiner So close to heaven: Ly bia và lon Weissbier trước Tu viện Ettal', position: 'center 100%' }}
        tone="mist"
        reverse
        title="Cách rót"
        kicker="Ly Weizen, rót nghiêng"
        action={{ href: '/huong-dan-rot-bia-lua-mi', label: 'Xem hướng dẫn chi tiết' }}
      >
        <ol className={styles.steps}>
          {tastingSteps.map(([title, description], index) => (
            <li key={title}>
              <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{noBreakNode(title)}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </SplitBlock>

      <SplitBlock
        image={{
          src: '/images/restaurant/phong-vip-benediktiner.jpg',
          alt: 'Không gian Nhà hàng Bia Thầy Tu tại Ngõ 26 Vạn Phúc, Hà Nội',
          position: 'center center',
        }}
        tone="ink"
        title="Nhà hàng"
        kicker="Ngõ 26 Vạn Phúc, Hà Nội"
        action={{ href: NAV.restaurant.href, label: 'Xem nhà hàng' }}
      >
        <p>Nhà hàng của German Taste ở {COMPANY_CONFIG.showroomAddress}, mở {COMPANY_CONFIG.restaurantHours}. Bia Benediktiner rót ly Weizen, ăn cùng chân giò nướng giòn, xúc xích kiểu Đức hoặc sườn nướng. Nhà hàng có 3 tầng, có phòng riêng cho bàn tiếp khách.</p>
        <p>Nhà hàng này cũng là mẫu để nhượng quyền tại Hà Nội, TP. Hồ Chí Minh và các thành phố lớn.</p>
        <dl className={`${styles.facts} ${styles.factsText}`}>
          <div><dt>Ngõ 26 Vạn Phúc</dt><dd>Nhà hàng mẫu tại Hà Nội</dd></div>
          <div><dt>Món Đức</dt><dd>Chân giò, xúc xích, salami</dd></div>
          <div><dt>Nhượng quyền</dt><dd>Bia lấy thẳng từ nhà nhập khẩu</dd></div>
        </dl>
      </SplitBlock>

      <section className={styles.visit} aria-label="Showroom và khách hàng doanh nghiệp">
        <div className={`${styles.visitPanel} ${styles.visitAccent}`} data-surface="ink">
          <div className={styles.visitContent}>
            <TitleBlock title="Ghé thăm" kicker="Showroom German Taste" />
            <p>Nơi xem tận tay các dòng Bia Thầy Tu và hỏi về quy cách chai, lon, bom 5L. Anh chị gọi trước để bên mình chuẩn bị đúng dòng cần xem.</p>
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
            <p>Nhà hàng, khách sạn hay đơn vị làm sự kiện cần chọn dòng bia và quy cách chai, lon hay bom 5L thì bên mình tư vấn theo thực đơn và số khách.</p>
            <div className={styles.visitActions}>
              <Button href="/bia-duc-cho-nha-hang-khach-san" variant="dark">Giải pháp HORECA</Button>
              {zaloUrl ? <Button href={zaloUrl} variant="link" target="_blank" rel="noopener noreferrer">Mở Zalo</Button> : null}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div>
            <TitleBlock id="faq-title" title="Câu hỏi thường gặp" />
            <p className={styles.faqIntro}>Trả lời ngắn, theo thông tin của hãng Benediktiner và German Taste.</p>
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
