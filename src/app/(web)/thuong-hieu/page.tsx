import type { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { Button } from '../components/ui/Button';
import PhotoHero from '../components/ui/PhotoHero';
import SplitBlock from '../components/ui/SplitBlock';
import TitleBlock from '../components/ui/TitleBlock';
import { AbbeyIcon } from '../components/ui/LineIcons';
import styles from './page.module.css';
import { NAV, breadcrumbTrail } from '@/config/navigation';

export const metadata: Metadata = {
  title: 'Câu Chuyện Benediktiner, Từ Tu Viện Ettal Đến Ngày Nay',
  description: 'Tu viện Ettal thành lập năm 1330, hơn 400 năm truyền thống bia lúa mì Benedictine và hành trình công thức nguyên bản được tiếp nối tại Lich, Đức.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/thuong-hieu' },
  openGraph: {
    title: 'Câu Chuyện Benediktiner, Từ Tu Viện Ettal Đến Ngày Nay',
    description: 'Nguồn gốc Ettal, triết lý Benedictine và hơn 400 năm truyền thống bia lúa mì.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/thuong-hieu',
    images: [{
      url: '/images/brand/benediktiner-official/home-hero.jpg',
      width: 1920,
      height: 969,
      alt: 'Benediktiner Weissbier và Tu viện Ettal',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu Chuyện Benediktiner, Từ Tu Viện Ettal Đến Ngày Nay',
    description: 'Nguồn gốc Ettal, triết lý Benedictine và hơn 400 năm truyền thống bia lúa mì.',
    images: ['/images/brand/benediktiner-official/home-hero.jpg'],
  },
};

const principles = [
  ['Tĩnh tại', 'Dành thời gian cho những điều tốt đẹp và một khoảnh khắc thưởng thức trọn vẹn.'],
  ['Chăm chút', 'Cẩn trọng trong từng lựa chọn nguyên liệu, công thức và cách phục vụ.'],
  ['Tôn trọng', 'Tôn trọng con người, thiên nhiên và những giá trị đã được truyền lại qua nhiều thế hệ.'],
] as const;

/** Câu chuyện thương hiệu theo ngữ pháp chimay.com ("Depuis 1850"): hero ảnh, khối chia đôi, ba nguyên tắc, nguồn chính thức. */
export default function BrandStoryPage() {
  return (
    <>
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema(breadcrumbTrail(NAV.story))} />

      <PhotoHero
        size="medium"
        titleId="story-title"
        image={{ src: '/images/brand/benediktiner-official/home-hero.jpg', alt: 'Benediktiner Weissbier trước khung cảnh Tu viện Ettal', position: '68% center' }}
        eyebrow="Từ Ettal đến thế giới"
        title="Từ 1330"
        kicker="Một tinh thần nguyên bản"
        credit={{ href: 'https://www.benediktiner-weissbier.de/en/', label: 'Hình ảnh: Benediktiner Weissbräu' }}
      >
        <p>Câu chuyện Benediktiner không bắt đầu từ một chiến dịch quảng cáo, mà từ những nguyên tắc sống và làm việc của các tu sĩ Benedictine.</p>
      </PhotoHero>

      <SplitBlock
        id="noi-khoi-nguon"
        image={{ src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Toàn cảnh Tu viện Ettal tại Bavaria, Đức' }}
        tone="ink"
        wordmark
        title="Nơi khởi nguồn"
        kicker="Tu viện Ettal, giữa dãy Alps Bavaria"
      >
        <p>Tu viện Ettal được thành lập năm 1330. Khoảng bốn thế kỷ trước, các tu sĩ Benedictine tại đây đã phát triển truyền thống bia lúa mì mà Benediktiner tiếp tục tôn vinh ngày nay.</p>
        <p>Điều được truyền lại không chỉ là một công thức, mà còn là cách tiếp cận: bình tĩnh, cẩn trọng và tôn trọng nguyên liệu.</p>
        <dl className={styles.facts}>
          <div><dt>1330</dt><dd>Tu viện Ettal thành lập</dd></div>
          <div><dt>400+</dt><dd>Năm truyền thống bia lúa mì</dd></div>
          <div><dt>877 m</dt><dd>Độ cao của tu viện theo hãng</dd></div>
        </dl>
      </SplitBlock>

      <section className={styles.section} aria-labelledby="principles-title">
        <div className="container">
          <TitleBlock
            id="principles-title"
            align="center"
            icon={<AbbeyIcon size={72} />}
            title="Triết lý"
            kicker="Các nguyên tắc Benedictine"
          />
          <p className={styles.lead}>Ba nguyên tắc được hãng nhấn mạnh xuyên suốt câu chuyện thương hiệu và nghệ thuật nấu bia.</p>
          <ol className={styles.principles}>
            {principles.map(([title, description], index) => (
              <li key={title}>
                <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SplitBlock
        image={{ src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner Weissbier Naturtrüb', position: '70% center' }}
        tone="mist"
        reverse
        title="Ngày nay"
        kicker="Được nấu tại Lich"
        action={{ href: 'https://www.benediktiner-weissbier.de/en/our-history', label: 'Xem nguồn chính thức', external: true }}
      >
        <p>Để gìn giữ và đưa truyền thống ấy tới nhiều người hơn, công thức đã được chia sẻ với Licher Privatbrauerei. Benediktiner ngày nay được nấu tại Lich cho Benediktiner Weissbräu GmbH, Ettal, thông tin được công bố trực tiếp trên website và bao bì của hãng.</p>
      </SplitBlock>

      <section className={styles.cta} aria-labelledby="story-cta-title">
        <div className="container">
          <TitleBlock id="story-cta-title" title="Tiếp tục hành trình" kicker="Khám phá hương vị Benediktiner" />
          <p>Từ Naturtrüb cân bằng đến Dunkel đậm malt và Festbier dành cho những dịp sum họp.</p>
          <div className={styles.actions}>
            <Button href="/san-pham" variant="primary">Xem các dòng bia</Button>
            <Button href="/huong-dan-rot-bia-lua-mi" variant="link">Nghệ thuật thưởng thức</Button>
          </div>
        </div>
      </section>
    </>
  );
}
