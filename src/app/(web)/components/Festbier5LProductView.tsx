import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/data/products';
import { COMPANY_CONFIG, getCompanyTelHref } from '@/config/company';
import { formatPrice } from '@/utils/formatPrice';
import ProductCard from './ProductCard';
import ProductConsultationForm from './ProductConsultationForm';
import ZaloCTA from './ZaloCTA';
import styles from './Festbier5LProductView.module.css';

interface Festbier5LProductViewProps {
  product: Pick<Product, 'id' | 'name' | 'slug' | 'abv' | 'volume' | 'origin' | 'price'>;
  relatedProducts: Product[];
}

const HERO_IMAGE = '/images/brand/benediktiner-official/festbier-keg-nobg.webp';
const STORY_IMAGE = '/images/brand/benediktiner-official/beer-garden-closeup.jpg';
const HERITAGE_IMAGE = '/images/brand/benediktiner-official/ettal-monastery.jpg';

const tasteProfile = [
  { label: 'Màu sắc', value: 'Vàng óng' },
  { label: 'Hương', value: 'Malt chín · ngũ cốc · hoa bia nhẹ' },
  { label: 'Cảm giác', value: 'Đầy đặn · mượt · cân bằng' },
  { label: 'Nồng độ', value: '5.8% ABV' },
];

const kegSteps = [
  {
    number: '01',
    title: 'Làm lạnh trước khi dùng',
    description: 'Đặt nguyên bom trong ngăn mát đủ lâu để bia đạt nhiệt độ thưởng thức. Không làm đông bia trong ngăn đá.',
  },
  {
    number: '02',
    title: 'Đặt bom ổn định',
    description: 'Giữ bom thẳng đứng trên mặt phẳng chắc chắn trước khi thao tác với van và vòi rót tích hợp.',
  },
  {
    number: '03',
    title: 'Mở và rót từ tốn',
    description: 'Thao tác van theo hướng dẫn trên bao bì, sau đó mở vòi từ từ để kiểm soát dòng bia và lớp bọt.',
  },
  {
    number: '04',
    title: 'Giữ lạnh sau khi mở',
    description: 'Sau khi mở, tiếp tục giữ bom lạnh và ưu tiên sử dụng sớm để hương vị và độ tươi được ổn định.',
  },
];

export default function Festbier5LProductView({ product, relatedProducts }: Festbier5LProductViewProps) {
  const telHref = getCompanyTelHref() || '/lien-he';
  const priceLabel = product.price !== null ? formatPrice(product.price) : 'Liên hệ';

  return (
    <div className={styles.page}>
      <div className={`container ${styles.breadcrumbWrap}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <Link href="/san-pham">Sản phẩm</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Benediktiner Festbier Bom 5L</span>
        </nav>
      </div>

      <section className={`container ${styles.hero}`} aria-labelledby="festbier-title">
        <div className={styles.heroVisual}>
          <div className={styles.heroImageFrame}>
            <Image
              src={HERO_IMAGE}
              alt="Bom bia Benediktiner Festbier 5L"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className={styles.heroImage}
            />
          </div>
          <p className={styles.imageCaption}>Benediktiner Festbier · Bom 5L</p>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Benediktiner · Festbier · Germany</p>
          <h1 id="festbier-title" className={styles.title}>Benediktiner Festbier <span>Bom 5L</span></h1>
          <p className={styles.lead}>
            Bia lễ hội Đức với cấu trúc malt đầy đặn, cảm giác mượt và hậu vị cân bằng — một quy cách 5 lít phù hợp cho bàn tiệc, dịp sum họp và quà tặng.
          </p>

          <dl className={styles.heroFacts}>
            <div>
              <dt>Nồng độ</dt>
              <dd>{product.abv || '5.8'}% ABV</dd>
            </div>
            <div>
              <dt>Dung tích</dt>
              <dd>{product.volume || '5L'}</dd>
            </div>
            <div>
              <dt>Xuất xứ</dt>
              <dd>{product.origin || 'Đức'}</dd>
            </div>
          </dl>

          <div className={styles.priceBlock}>
            <span>Giá bán lẻ</span>
            <strong>{priceLabel}</strong>
            <small>Vui lòng liên hệ để xác nhận tình trạng hàng và thông tin giao nhận.</small>
          </div>

          <div className={styles.actions}>
            <a href={telHref} className={styles.primaryAction}>Gọi {COMPANY_CONFIG.hotline}</a>
            <ZaloCTA productName={product.name} label="Tư vấn qua Zalo" variant="outline" className={styles.zaloAction} />
          </div>

          <p className={styles.ageNotice}>Sản phẩm chỉ dành cho người từ đủ 18 tuổi. Website cung cấp thông tin và tiếp nhận yêu cầu tư vấn, không thực hiện thanh toán trực tuyến.</p>
        </div>
      </section>

      <section className={styles.trustStrip} aria-label="Thông tin tin cậy">
        <div className={`container ${styles.trustGrid}`}>
          <div><strong>Nhập khẩu từ Đức</strong><span>Nguồn gốc sản phẩm được công bố rõ ràng</span></div>
          <div><strong>Tư vấn tại German Taste</strong><span>26 Vạn Phúc, Ba Đình, Hà Nội</span></div>
          <div><strong>Hỗ trợ trực tiếp</strong><span>Hotline và Zalo thống nhất trên website</span></div>
        </div>
      </section>

      <section className={`container ${styles.storySection}`}>
        <div className={styles.storyImageWrap}>
          <Image
            src={STORY_IMAGE}
            alt="Không khí thưởng thức bia Benediktiner"
            fill
            sizes="(max-width: 900px) 100vw, 52vw"
            className={styles.coverImage}
          />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.sectionKicker}>Festbier</p>
          <h2>Một dòng bia được tạo ra cho những dịp sum họp</h2>
          <p>
            Festbier nhấn vào nền malt rõ ràng, thân bia đầy đặn nhưng vẫn giữ sự cân bằng để dễ thưởng thức trong những bữa tiệc dài. Quy cách bom 5L đưa trải nghiệm rót bia tại bàn vào một hình thức gọn gàng, trực quan và phù hợp khi nhiều người cùng dùng chung.
          </p>
          <p>
            Thay vì dùng các mô tả phô trương, trang này tập trung vào những thông tin người mua thực sự cần: phong cách bia, nồng độ, dung tích, cách làm lạnh, cách rót và gợi ý sử dụng.
          </p>
        </div>
      </section>

      <section className={styles.profileSection} aria-labelledby="taste-profile-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Hồ sơ hương vị</p>
            <h2 id="taste-profile-title">Festbier theo cách dễ hiểu</h2>
          </div>
          <dl className={styles.profileGrid}>
            {tasteProfile.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`container ${styles.useSection}`}>
        <div className={styles.useIntro}>
          <p className={styles.sectionKicker}>Bom 5L</p>
          <h2>Phù hợp khi một chai đơn lẻ là chưa đủ</h2>
          <p>Quy cách lớn tạo điểm nhấn cho bàn tiệc mà không cần biến trải nghiệm thành một trang bán hàng quá nhiều khuyến mại hay banner.</p>
        </div>
        <div className={styles.useGrid}>
          <article><span>01</span><h3>Bàn tiệc tại nhà</h3><p>Đặt giữa bàn, làm lạnh trước và rót trực tiếp khi mọi người cùng thưởng thức.</p></article>
          <article><span>02</span><h3>BBQ &amp; sum họp</h3><p>Phù hợp những dịp nhiều người dùng chung và muốn giữ trải nghiệm gọn, dễ phục vụ.</p></article>
          <article><span>03</span><h3>Quà tặng</h3><p>Hình thức bom 5L khác biệt so với chai hoặc lon thông thường, phù hợp các dịp biếu tặng có chủ đích.</p></article>
        </div>
      </section>

      <section className={styles.guideSection} aria-labelledby="keg-guide-title">
        <div className={`container ${styles.guideLayout}`}>
          <div className={styles.guideIntro}>
            <p className={styles.sectionKicker}>Cách dùng</p>
            <h2 id="keg-guide-title">Làm lạnh và rót bom 5L</h2>
            <p>Ưu tiên hướng dẫn in trực tiếp trên bao bì sản phẩm khi thao tác với van và vòi rót của từng lô hàng.</p>
          </div>
          <ol className={styles.guideSteps}>
            {kegSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`container ${styles.pairingSection}`}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionKicker}>Food pairing</p>
          <h2>Ba lựa chọn đủ cho một bàn Festbier</h2>
        </div>
        <div className={styles.pairingGrid}>
          <div><strong>Xúc xích Đức</strong><span>Bratwurst, Wiener hoặc xúc xích nướng</span></div>
          <div><strong>Thịt nướng</strong><span>Gà nướng, thịt heo quay hoặc BBQ</span></div>
          <div><strong>Món ăn kèm</strong><span>Pretzel, khoai tây, salad và mù tạt</span></div>
        </div>
      </section>

      <section className={styles.heritageSection} data-surface="ink">
        <div className={`container ${styles.heritageGrid}`}>
          <div className={styles.heritageImageWrap}>
            <Image
              src={HERITAGE_IMAGE}
              alt="Tu viện Ettal, nguồn gốc di sản Benediktiner"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className={styles.coverImage}
            />
          </div>
          <div className={styles.heritageCopy}>
            <p className={styles.sectionKicker}>Nguồn gốc thương hiệu</p>
            <h2>Từ di sản Ettal đến bàn tiệc hiện đại</h2>
            <p>Benediktiner gắn câu chuyện thương hiệu với truyền thống Benedictine tại Ettal, Bavaria. Trên Bia Thầy Tu, phần di sản được dùng để giải thích nguồn gốc và phong cách thương hiệu, không thay thế cho thông tin kỹ thuật trên nhãn sản phẩm.</p>
            <Link href="/bia-thay-tu-la-gi" className={styles.heritageLink}>Tìm hiểu câu chuyện Bia Thầy Tu</Link>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className={`container ${styles.relatedSection}`}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Benediktiner &amp; bia Đức</p>
            <h2>Khám phá thêm</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedProducts.slice(0, 3).map((item) => (
              <ProductCard
                key={item.id}
                {...item}
                description={item.description}
                showCTA
                showReferencePriceNote
              />
            ))}
          </div>
        </section>
      )}

      <div className={`container ${styles.consultationWrap}`}>
        <ProductConsultationForm productName={product.name} />
      </div>
    </div>
  );
}
