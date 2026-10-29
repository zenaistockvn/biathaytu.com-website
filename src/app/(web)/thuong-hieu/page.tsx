import type { Metadata } from 'next';
import JsonLd, { getBreadcrumbSchema } from '../components/JsonLd';
import { Button } from '../components/ui/Button';
import PhotoHero from '../components/ui/PhotoHero';
import SplitBlock from '../components/ui/SplitBlock';
import TitleBlock from '../components/ui/TitleBlock';
import { AbbeyIcon } from '../components/ui/LineIcons';
import styles from './page.module.css';
import { NAV, breadcrumbTrail } from '@/config/navigation';
import { noBreakNode } from '@/lib/vn-text';

export const metadata: Metadata = {
  title: 'Câu chuyện Benediktiner, từ Tu viện Ettal đến ngày nay',
  description: 'Tu viện Ettal lập năm 1330, hơn 400 năm truyền thống bia lúa mì. Benediktiner ngày nay ủ tại Lich, bang Hessen, bởi nhà bia tư nhân Ihring-Melchior.',
  alternates: { canonical: 'https://www.biathaytu.com.vn/thuong-hieu' },
  openGraph: {
    title: 'Câu chuyện Benediktiner, từ Tu viện Ettal đến ngày nay',
    description: 'Tu viện Ettal, các nguyên tắc của dòng Biển Đức và nhà bia ở Lich ủ Benediktiner ngày nay.',
    type: 'website',
    url: 'https://www.biathaytu.com.vn/thuong-hieu',
    images: [{
      url: '/images/og/home.jpg',
      width: 1200,
      height: 630,
      alt: 'Benediktiner Weissbier và Tu viện Ettal',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu chuyện Benediktiner, từ Tu viện Ettal đến ngày nay',
    description: 'Tu viện Ettal, các nguyên tắc của dòng Biển Đức và nhà bia ở Lich ủ Benediktiner ngày nay.',
    images:['/images/og/home.jpg'],
  },
};

const principles = [
  ['Tĩnh tại', 'Dành thời gian cho bữa ăn, ngồi xuống và uống chậm.'],
  ['Chăm chút', 'Cẩn thận từ nguyên liệu, công thức đến cách phục vụ.'],
  ['Tôn trọng', 'Tôn trọng con người, thiên nhiên và những gì thế hệ trước để lại.'],
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
        wordmark={false}
        title="Từ 1330"
        kicker="Bia lúa mì dòng Biển Đức"
        credit={{ href: 'https://www.benediktiner-weissbier.de/en/', label: 'Hình ảnh: Benediktiner Weissbräu' }}
      >
        <p>Câu chuyện Benediktiner bắt đầu ở một tu viện dòng Biển Đức dưới chân dãy Alps, với cách sống và làm việc của các tu sĩ ở đó.</p>
      </PhotoHero>

      <SplitBlock
        id="noi-khoi-nguon"
        image={{ src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Toàn cảnh Tu viện Ettal tại Bavaria, Đức' }}
        tone="ink"
        wordmark
        title="Nơi khởi nguồn"
        kicker="Tu viện Ettal, giữa dãy Alps Bavaria"
      >
        <p>Tu viện Ettal được thành lập năm 1330. Hơn 400 năm truyền thống bia lúa mì của Benediktiner bắt đầu từ các tu sĩ dòng Biển Đức ở đây, và men bia ngày nay vẫn lấy từ hầm tu viện.</p>
        <p>Đi cùng công thức là một cách làm: Chậm, cẩn thận, tôn trọng nguyên liệu.</p>
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
          <p className={styles.lead}>Ba nguyên tắc hãng nhắc lại nhiều lần khi kể về Benediktiner và cách nấu bia.</p>
          <ol className={styles.principles}>
            {principles.map(([title, description], index) => (
              <li key={title}>
                <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                <h3>{noBreakNode(title)}</h3>
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
        kicker="Ủ tại Lich, bang Hessen"
        action={{ href: 'https://www.benediktiner-weissbier.de/en/our-history', label: 'Xem nguồn chính thức', external: true }}
      >
        <p>Để bia đến được với nhiều người hơn, công thức được chia sẻ với nhà bia tư nhân Ihring-Melchior ở Lich, bang Hessen. Benediktiner ngày nay ủ tại đó cho Benediktiner Weissbräu GmbH, Ettal. Thông tin này in trên bao bì và website của hãng.</p>
      </SplitBlock>

      <section className={styles.cta} aria-labelledby="story-cta-title">
        <div className="container">
          <TitleBlock id="story-cta-title" title="Các dòng bia" kicker="Benediktiner" />
          <p>Naturtrüb vàng đục, hương chuối chín. Dunkel nâu, mạch nha rang. Festbier là dòng mùa lễ hội, vị mạch nha đậm hơn.</p>
          <div className={styles.actions}>
            <Button href="/san-pham" variant="primary">Xem các dòng bia</Button>
            <Button href="/huong-dan-rot-bia-lua-mi" variant="link">Cách rót bia lúa mì</Button>
          </div>
        </div>
      </section>
    </>
  );
}
