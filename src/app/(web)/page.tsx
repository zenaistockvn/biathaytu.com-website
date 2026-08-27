import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import LandingHero from './components/LandingHero';
import JsonLd, { getBreadcrumbSchema, getLandingFAQSchema, getStoreSchema } from './components/JsonLd';
import {
  COMPANY_CONFIG,
  getCompanyMailtoHref,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';
import styles from './HomeBrand.module.css';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Benediktiner — Hơn 400 năm truyền thống bia Đức',
  description: 'Khám phá Benediktiner Weissbier: nguồn gốc Ettal, các dòng Naturtrüb, Dunkel, Festbier, nghệ thuật thưởng thức và thông tin tư vấn tại Việt Nam.',
  alternates: { canonical: 'https://www.biathaytu.com' },
  openGraph: {
    title: 'Bia Thầy Tu Benediktiner — Hơn 400 năm truyền thống bia Đức',
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
    title: 'Bia Thầy Tu Benediktiner — Hơn 400 năm truyền thống bia Đức',
    description: 'Câu chuyện Ettal, hương vị Benediktiner và điểm giới thiệu tại Việt Nam.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const beers = [
  {
    name: 'Weissbier Naturtrüb',
    type: 'Bia lúa mì không lọc',
    image: '/images/products/official/benediktiner/glass_removebg.png',
    href: '/benediktiner-weissbier-naturtrub',
    color: 'Vàng hổ phách',
    aroma: 'Chuối chín, đinh hương',
    abv: '5,4% ABV',
    description: 'Êm mượt, bọt dày mịn và cân bằng — dòng bia biểu tượng để bắt đầu hành trình Benediktiner.',
  },
  {
    name: 'Weissbier Dunkel',
    type: 'Bia lúa mì đen',
    image: '/images/brand/benediktiner-official/dunkel-glass.webp',
    href: '/benediktiner-dunkel',
    color: 'Nâu hổ phách',
    aroma: 'Malt rang, caramel',
    abv: '5,4% ABV',
    description: 'Đậm hơn nhưng vẫn mềm mại, nổi bật hương malt rang, caramel và trái cây chín.',
  },
  {
    name: 'Festbier',
    type: 'Bia lễ hội',
    image: '/images/brand/benediktiner-official/festbier-keg.webp',
    href: '/san-pham/benediktiner-festbier-bom-5l',
    color: 'Vàng sáng',
    aroma: 'Malt chín, hoa bia nhẹ',
    abv: '5,8% ABV',
    description: 'Thân bia đầy đặn, hậu vị cân bằng, phù hợp cho bàn tiệc và những dịp sum họp.',
  },
] as const;

const tastingSteps = [
  ['01', 'Làm lạnh đúng mức', 'Ướp lạnh vừa đủ để bia vẫn giữ được hương lúa mì, malt và men đặc trưng.'],
  ['02', 'Dùng đúng loại ly', 'Ly Weissbier cao giúp giữ lớp bọt, gom hương và thể hiện trọn màu sắc của bia.'],
  ['03', 'Rót chậm, chừa men', 'Nghiêng ly khi rót; xoay nhẹ phần bia cuối chai nếu muốn thưởng thức trọn lớp men tự nhiên.'],
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

export default function LandingPage() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
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

      <section className={styles.proofStrip} aria-label="Cam kết thông tin">
        <div className={`container ${styles.proofGrid}`}>
          <div><strong>Nguồn gốc rõ ràng</strong><span>Thông tin dựa trên tài liệu hãng</span></div>
          <div><strong>Hương vị nguyên bản</strong><span>Công thức Benedictine từ Ettal</span></div>
          <div><strong>Tư vấn tại Việt Nam</strong><span>Khách lẻ, nhà hàng và HORECA</span></div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="featured-beers-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <h2 id="featured-beers-title">Ba dòng Benediktiner: Naturtrüb, Dunkel, Festbier</h2>
            <p>Mỗi dòng có một cá tính riêng, nhưng cùng chia sẻ sự cân bằng và tinh thần thưởng thức chậm rãi.</p>
          </div>

          <div className={styles.beerGrid}>
            {beers.map((beer) => (
              <article key={beer.name} className={styles.beerCard}>
                <div className={styles.beerImageWrap}>
                  <Image src={beer.image} alt={`${beer.name} — hình ảnh sản phẩm chính hãng`} fill sizes="(max-width: 768px) 80vw, 30vw" className={styles.beerImage} />
                </div>
                <div className={styles.beerContent}>
                  <p className={styles.beerType}>{beer.type}</p>
                  <h3>{beer.name}</h3>
                  <p className={styles.beerDescription}>{beer.description}</p>
                  <dl className={styles.beerFacts}>
                    <div><dt>Màu sắc</dt><dd>{beer.color}</dd></div>
                    <div><dt>Hương</dt><dd>{beer.aroma}</dd></div>
                    <div><dt>Nồng độ</dt><dd>{beer.abv}</dd></div>
                  </dl>
                  <Link href={beer.href} className={styles.textLink}>Khám phá hương vị</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.storySection}`} aria-labelledby="ettal-story-title">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyImageWrap}>
            <Image
              src="/images/brand/benediktiner-official/ettal-monastery.jpg"
              alt="Toàn cảnh Tu viện Ettal tại Bavaria, Đức"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.storyImage}
            />
            <span className={styles.sourceNote}>Ảnh chính thức từ Benediktiner Weissbräu</span>
          </div>
          <div className={styles.storyCopy}>
            <p className={styles.eyebrowDark}>Từ Ettal đến thế giới</p>
            <h2 id="ettal-story-title">Tu viện Ettal, 1330. Công thức tiếp nối tại Lich</h2>
            <p className={styles.lead}>Tu viện Ettal được thành lập năm 1330. Truyền thống bia lúa mì của các tu sĩ Benedictine hình thành hơn 400 năm trước và vẫn là nền tảng triết lý của Benediktiner ngày nay.</p>
            <p>Bia hiện được nấu tại Lich theo công thức Benedictine nguyên bản cho Benediktiner Weissbräu GmbH, Ettal. Sự tĩnh tại, tôn trọng nguyên liệu và chăm chút từng chi tiết là ba giá trị xuyên suốt.</p>
            <div className={styles.timeline} aria-label="Các mốc lịch sử">
              <div><strong>1330</strong><span>Tu viện Ettal thành lập</span></div>
              <div><strong>400+</strong><span>Năm truyền thống ủ bia</span></div>
              <div><strong>Hôm nay</strong><span>Công thức được tiếp nối tại Lich</span></div>
            </div>
            <Link href="/thuong-hieu" className={styles.textLink}>Đọc câu chuyện đầy đủ</Link>
          </div>
        </div>
      </section>

      <section className={styles.tastingSection} aria-labelledby="tasting-title">
        <div className={`container ${styles.tastingGrid}`}>
          <div className={styles.tastingIntro}>
            <p className={styles.eyebrow}>Nghệ thuật thưởng thức</p>
            <h2 id="tasting-title">Ly Weizen, rót nghiêng, chừa lớp men cuối chai</h2>
            <p>Nhiệt độ, loại ly và cách rót đều ảnh hưởng trực tiếp đến lớp bọt, hương thơm và cấu trúc của Weissbier.</p>
            <Link href="/huong-dan-rot-bia-lua-mi" className={styles.lightLink}>Xem hướng dẫn chi tiết</Link>
          </div>
          <ol className={styles.tastingSteps}>
            {tastingSteps.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="experience-title">
        <div className={`container ${styles.experienceGrid}`}>
          <div className={styles.experienceImageWrap}>
            <Image
              src="/images/brand/benediktiner-official/beer-garden-closeup.jpg"
              alt="Chai và ly Benediktiner Weissbier trong không gian ngoài trời"
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
              className={styles.experienceImage}
            />
          </div>
          <div className={styles.experienceCard}>
            <p className={styles.eyebrowDark}>Benediktiner tại Hà Nội</p>
            <h2 id="experience-title">Tìm hiểu sản phẩm tại German Taste</h2>
            <p>Không gian giới thiệu và tư vấn các dòng Bia Thầy Tu tại {COMPANY_CONFIG.showroomAddress}. Vui lòng liên hệ trước để được hỗ trợ đúng nhu cầu.</p>
            <address>
              <span>Địa chỉ</span>
              <strong>{COMPANY_CONFIG.showroomAddress}</strong>
              <span>Hotline</span>
              <strong>{COMPANY_CONFIG.hotline}</strong>
            </address>
            <div className={styles.experienceActions}>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>Xem chỉ đường</a>
              {telHref ? <a href={telHref} className={styles.secondaryLink}>Gọi tư vấn</a> : null}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.b2bSection} aria-labelledby="b2b-title">
        <div className={`container ${styles.b2bInner}`}>
          <div>
            <h2 id="b2b-title">Cung cấp cho nhà hàng, khách sạn và sự kiện</h2>
            <p>Tư vấn danh mục, quy cách chai/lon/bom và giải pháp giới thiệu sản phẩm phù hợp với mô hình vận hành.</p>
          </div>
          <div className={styles.b2bActions}>
            <Link href="/bia-duc-cho-nha-hang-khach-san" className={styles.primaryLightLink}>Giải pháp HORECA</Link>
            {zaloUrl ? <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={styles.outlineLightLink}>Trao đổi qua Zalo</a> : null}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div>
            <h2 id="faq-title">Câu hỏi thường gặp</h2>
            <p className={styles.faqIntro}>Các câu trả lời ngắn, ưu tiên thông tin có thể kiểm chứng từ hãng và đơn vị tư vấn tại Việt Nam.</p>
          </div>
          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contactBar} aria-label="Liên hệ">
        <div className={`container ${styles.contactBarInner}`}>
          <p><strong>Cần tư vấn sản phẩm?</strong><span>Liên hệ trực tiếp với German Taste.</span></p>
          <div>
            {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : null}
            {mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : null}
          </div>
        </div>
      </section>
    </>
  );
}
