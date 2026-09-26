import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '../components/ui/Button';
import CategoryTile, { CategoryTileGrid } from '../components/ui/CategoryTile';
import { AbbeyIcon, BottleIcon, KegIcon, WeizenGlassIcon } from '../components/ui/LineIcons';
import PhotoHero from '../components/ui/PhotoHero';
import SplitBlock from '../components/ui/SplitBlock';
import TitleBlock from '../components/ui/TitleBlock';
import { COMPANY_CONFIG } from '@/config/company';
import styles from './page.module.css';

// Trang duyệt component nội bộ. Chỉ có khi chạy dev; bản build production trả 404.
export const metadata: Metadata = {
  title: 'Xem trước giao diện',
  robots: { index: false, follow: false },
};

const IMG = {
  hero: { src: '/images/brand/benediktiner-official/home-hero.jpg', alt: 'Ly và chai Benediktiner Weissbier trước dãy núi Bavaria', position: '70% center' },
  abbey: { src: '/images/brand/benediktiner-official/ettal-monastery.jpg', alt: 'Tu viện Ettal tại Bavaria' },
  garden: { src: '/images/brand/benediktiner-official/beer-garden-closeup.jpg', alt: 'Chai và ly Benediktiner trong vườn bia' },
  poster: { src: '/images/brand/benediktiner-official/so-close-to-heaven.jpg', alt: 'Poster chiến dịch So close to heaven', position: 'center 30%' },
};

export default function DesignPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <>
      <PhotoHero
        image={IMG.hero}
        titleId="preview-hero"
        eyebrow="Tu viện Ettal, Bavaria, từ 1330"
        title="Bia Thầy Tu"
        kicker="Benediktiner Weissbier"
        actions={<><Button href="/san-pham" variant="light">Khám phá các dòng bia</Button><Button href="/thuong-hieu" variant="outline">Câu chuyện Ettal</Button></>}
      >
        <p>Hơn 400 năm truyền thống bia lúa mì của các tu sĩ Benedictine, nấu tại Lich theo công thức nguyên bản.</p>
      </PhotoHero>

      <section className="section">
        <div className="container">
          <TitleBlock align="center" icon={<WeizenGlassIcon size={72} />} title="Bia của chúng tôi" kicker="Truyền thống tu viện" />
          <div className={styles.tiles}>
            <CategoryTileGrid>
              <CategoryTile href="/san-pham#benediktiner" image={IMG.garden} tone="ink" icon={<WeizenGlassIcon />} title="Benediktiner" kicker="Bia lúa mì tu viện" />
              <CategoryTile href="/san-pham#bia-duc-khac" image={IMG.poster} tone="gold" icon={<BottleIcon />} title="Bia Đức" kicker="Tuyển chọn" />
            </CategoryTileGrid>
          </div>
        </div>
      </section>

      <SplitBlock
        image={IMG.abbey}
        tone="ink"
        wordmark
        title="Khám phá"
        kicker="Tu viện Ettal"
        action={{ href: '/thuong-hieu', label: 'Đọc câu chuyện' }}
      >
        <p>Tu viện Ettal được thành lập năm 1330 giữa thung lũng Bavaria. Truyền thống bia lúa mì của các tu sĩ là nền tảng của Benediktiner ngày nay.</p>
      </SplitBlock>

      <SplitBlock
        image={IMG.garden}
        tone="accent"
        reverse
        wordmark
        title="Ghé thăm"
        kicker="Showroom German Taste"
        action={{ href: '/lien-he', label: 'Xem chỉ đường' }}
      >
        <p>{COMPANY_CONFIG.showroomAddress}. Không gian giới thiệu và tư vấn các dòng Bia Thầy Tu.</p>
      </SplitBlock>

      <SplitBlock image={IMG.poster} tone="gold" title="Cho nhà hàng" kicker="HORECA và đại lý" action={{ href: '/bia-duc-cho-nha-hang-khach-san', label: 'Giải pháp HORECA' }}>
        <p>Tư vấn danh mục, quy cách chai, lon và bom cho mô hình vận hành của anh chị.</p>
      </SplitBlock>

      <section className="section">
        <div className="container">
          <TitleBlock title="Nút" kicker="Barlow Condensed in hoa, góc vuông" />
          <div className={styles.buttons}>
            <Button href="#">Primary</Button>
            <Button href="#" variant="dark">Dark</Button>
            <Button href="#" variant="outline">Outline</Button>
            <Button href="#" variant="link">Xem tất cả tin tức</Button>
            <Button href="#" size="sm">Nhỏ</Button>
            <Button href="#" size="lg" variant="dark">Lớn</Button>
          </div>
          <div data-surface="ink" className={styles.inkBand}>
            <Button href="#">Primary trên dải tối</Button>
            <Button href="#" variant="light">Light</Button>
            <Button href="#" variant="link">Link trên dải tối</Button>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className={`container ${styles.scale}`}>
          <TitleBlock as="h2" size="h1" title="Thang chữ H1: Thầy tu Ettal" kicker="Kicker in hoa" />
          <TitleBlock title="H2: Ba dòng bia biểu tượng" eyebrow="Eyebrow phía trên" />
          <TitleBlock as="h3" title="H3: Weissbier Naturtrüb, bia lúa mì không lọc" />
          <TitleBlock icon={<AbbeyIcon size={64} />} title="Từ 1330" kicker="Tu viện Ettal" />
          <TitleBlock icon={<KegIcon size={64} />} title="Bom 5 lít" kicker="Festbier" />
          <h4>H4: Barlow Condensed đậm, in hoa</h4>
          <p className={styles.paragraph}>Đoạn văn Barlow: Ướp lạnh vừa đủ để bia vẫn giữ được hương lúa mì, malt và men đặc trưng. Ly Weissbier cao giúp giữ lớp bọt, gom hương và thể hiện trọn màu sắc của bia.</p>
        </div>
      </section>
    </>
  );
}
