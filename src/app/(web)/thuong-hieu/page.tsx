import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import styles from '../HomeBrand.module.css';

export const metadata: Metadata = {
  title: 'Câu Chuyện Benediktiner — Từ Tu Viện Ettal Đến Ngày Nay',
  description: 'Tu viện Ettal thành lập năm 1330, hơn 400 năm truyền thống bia lúa mì Benedictine và hành trình công thức nguyên bản được tiếp nối tại Lich, Đức.',
  alternates: { canonical: 'https://www.biathaytu.com/thuong-hieu' },
  openGraph: {
    title: 'Câu Chuyện Benediktiner — Từ Tu Viện Ettal Đến Ngày Nay',
    description: 'Nguồn gốc Ettal, triết lý Benedictine và hơn 400 năm truyền thống bia lúa mì.',
    type: 'website',
    url: 'https://www.biathaytu.com/thuong-hieu',
    images: [{
      url: '/images/brand/benediktiner-official/home-hero.jpg',
      width: 1920,
      height: 969,
      alt: 'Benediktiner Weissbier và Tu viện Ettal',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu Chuyện Benediktiner — Từ Tu Viện Ettal Đến Ngày Nay',
    description: 'Nguồn gốc Ettal, triết lý Benedictine và hơn 400 năm truyền thống bia lúa mì.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const principles = [
  ['Tĩnh tại', 'Dành thời gian cho những điều tốt đẹp và một khoảnh khắc thưởng thức trọn vẹn.'],
  ['Chăm chút', 'Cẩn trọng trong từng lựa chọn nguyên liệu, công thức và cách phục vụ.'],
  ['Tôn trọng', 'Tôn trọng con người, thiên nhiên và những giá trị đã được truyền lại qua nhiều thế hệ.'],
] as const;

export default function BrandStoryPage() {
  return (
    <div>
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang chủ', url: 'https://www.biathaytu.com' },
        { name: 'Câu chuyện', url: 'https://www.biathaytu.com/thuong-hieu' },
      ])} />

      <section className={styles.catalogHero} aria-labelledby="story-title">
        <Image
          src="/images/brand/benediktiner-official/home-hero.jpg"
          alt="Benediktiner Weissbier trước khung cảnh Tu viện Ettal"
          fill
          priority
          sizes="100vw"
          className={styles.catalogHeroImage}
        />
        <div className={styles.catalogHeroOverlay} />
        <div className={`container ${styles.catalogHeroCopy}`}>
          <p className={styles.eyebrow}>Từ Ettal đến thế giới</p>
          <h1 id="story-title">Hơn 400 năm.<br />Một tinh thần nguyên bản.</h1>
          <p>Câu chuyện Benediktiner không bắt đầu từ một chiến dịch quảng cáo, mà từ những nguyên tắc sống và làm việc của các tu sĩ Benedictine.</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.storySection}`} aria-labelledby="origin-title">
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
            <p className={styles.eyebrowDark}>Nơi khởi nguồn</p>
            <h2 id="origin-title">Tu viện Ettal, giữa dãy Alps Bavaria</h2>
            <p className={styles.lead}>Tu viện Ettal được thành lập năm 1330. Khoảng bốn thế kỷ trước, các tu sĩ Benedictine tại đây đã phát triển truyền thống bia lúa mì mà Benediktiner tiếp tục tôn vinh ngày nay.</p>
            <p>Điều được truyền lại không chỉ là một công thức, mà còn là cách tiếp cận: bình tĩnh, cẩn trọng và tôn trọng nguyên liệu. Đây là phần cốt lõi tạo nên thế giới thương hiệu Benediktiner.</p>
            <div className={styles.timeline}>
              <div><strong>1330</strong><span>Tu viện Ettal thành lập</span></div>
              <div><strong>400+</strong><span>Năm truyền thống bia lúa mì</span></div>
              <div><strong>877 m</strong><span>Độ cao của tu viện theo hãng</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="principles-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrowDark}>Các nguyên tắc Benedictine</p>
            <h2 id="principles-title">Triết lý đứng sau mỗi ly bia</h2>
            <p>Ba nguyên tắc được hãng nhấn mạnh xuyên suốt câu chuyện thương hiệu và nghệ thuật nấu bia.</p>
          </div>
          <div className={styles.principleGrid}>
            {principles.map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.tastingSection} aria-labelledby="today-title">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyCopy}>
            <p className={styles.eyebrow}>Truyền thống được tiếp nối</p>
            <h2 id="today-title" className={styles.lightHeading}>Được nấu tại Lich theo công thức Benedictine nguyên bản</h2>
            <p className={styles.lightBody}>Để gìn giữ và đưa truyền thống ấy tới nhiều người hơn, công thức đã được chia sẻ với Licher Privatbrauerei. Benediktiner ngày nay được nấu tại Lich cho Benediktiner Weissbräu GmbH, Ettal — thông tin được công bố trực tiếp trên website và bao bì của hãng.</p>
            <a href="https://www.benediktiner-weissbier.de/en/our-history" target="_blank" rel="noopener noreferrer" className={styles.lightLink}>Xem nguồn chính thức</a>
          </div>
          <div className={styles.storyImageWrap}>
            <Image
              src="/images/brand/benediktiner-official/beer-garden-closeup.jpg"
              alt="Chai và ly Benediktiner Weissbier Naturtrüb"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.storyImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.b2bSection} aria-labelledby="story-cta-title">
        <div className={`container ${styles.b2bInner}`}>
          <div>
            <p className={styles.eyebrow}>Tiếp tục hành trình</p>
            <h2 id="story-cta-title">Khám phá hương vị Benediktiner</h2>
            <p>Từ Naturtrüb cân bằng đến Dunkel đậm malt và Festbier dành cho những dịp sum họp.</p>
          </div>
          <div className={styles.b2bActions}>
            <Link href="/san-pham" className={styles.primaryLightLink}>Xem các dòng bia</Link>
            <Link href="/huong-dan-rot-bia-lua-mi" className={styles.outlineLightLink}>Nghệ thuật thưởng thức</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
