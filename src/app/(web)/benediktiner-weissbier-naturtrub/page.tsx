import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import { getPriceRange } from '@/lib/seo/productPricing';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb — Nhập Khẩu Đức',
  description: 'Bia lúa mì Đức nguyên bản từ tu viện Ettal (Bavaria) nấu theo Luật Tinh Khiết 1516. Đạt giải iTQi 3 Sao danh giá. Đặt mua chính hãng giao nhanh.',
  alternates: { canonical: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub' },
  openGraph: {
    title: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb — Nhập Khẩu Đức',
    description: 'Bia lúa mì Đức nguyên bản từ tu viện Ettal (Bavaria) nấu theo Luật Tinh Khiết 1516. Đạt giải iTQi 3 Sao danh giá. Đặt mua chính hãng giao nhanh.',
    type: 'website',
    url: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub',
    images: [
      {
        url: '/images/products/hero_weissbier_v2.png',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner Weissbier Naturtrüb — Nhập Khẩu Đức',
    description: 'Bia lúa mì Đức nguyên bản từ tu viện Ettal (Bavaria) nấu theo Luật Tinh Khiết 1516. Đạt giải iTQi 3 Sao danh giá.',
    images: ['/images/products/hero_weissbier_v2.png'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.name.includes('Naturtrüb'));
  const product = {
    name: 'Benediktiner Weissbier Naturtrüb',
    slug: 'benediktiner-weissbier-naturtrub',
    url: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub',
    description: 'Bia lúa mì Đức nguyên bản, không lọc, giữ trọn vẹn hương vị men sống tự nhiên từ tu viện Ettal.',
    abv: '5.4',
    volume: '500ml',
  };

  const zaloBaseUrl = 'https://zalo.me/0899191313';
  const msgOrder = 'Chào Bia Thầy Tu, mình muốn đặt mua bia lúa mì Benediktiner Weissbier Naturtrüb chính hãng. Tư vấn chương trình ưu đãi và giao hàng giúp mình nhé.';
  const linkOrder = `${zaloBaseUrl}?text=${encodeURIComponent(msgOrder)}`;

  return (
    <div className="weissbier-landing">
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Weissbier Naturtrüb', url: 'https://www.biathaytu.com/benediktiner-weissbier-naturtrub' }])} />

      {/* Hero Section */}
      <section className="weissbier-hero">
        <div className="container" style={{ padding: '0 20px' }}>
          <span className="weissbier-hero-badge">Di Sản Tu Viện Bavarian 1330</span>
          <h1 className="weissbier-hero-title">
            Benediktiner <span>Weissbier Naturtrüb</span>
          </h1>
          <p className="weissbier-hero-desc">
            Dòng bia lúa mì men sống không lọc thượng hạng, chế tác theo công thức cổ truyền của các tu sĩ vùng Bavaria. Đậm đà, êm dịu và sảng khoái tột độ.
          </p>
        </div>
      </section>

      {/* Intro & Specs Section */}
      <section className="weissbier-intro">
        <div className="container" style={{ padding: '0 20px' }}>
          <div className="weissbier-intro-card">
            <div className="weissbier-intro-img-wrap">
              <img 
                src="/images/products/official/benediktiner/bottle_removebg.png" 
                alt="Chai Bia Thầy Tu Benediktiner Weissbier" 
                className="weissbier-intro-img"
              />
            </div>
            <div className="weissbier-intro-content">
              <span className="weissbier-tag">iTQi 3 Sao Danh Giá</span>
              <h2 className="weissbier-intro-title">Naturtrüb — Tinh túy từ lớp men sống tự nhiên</h2>
              <p className="weissbier-intro-desc">
                Naturtrüb trong tiếng Đức có nghĩa là "vẩn đục tự nhiên". Thay vì lọc sạch men sống như các dòng bia công nghiệp phổ thông, Bia Thầy Tu Benediktiner Weissbier bảo tồn lớp men sống nguyên bản. Lớp men quý giá này tiếp tục lên men thứ cấp ngay trong chai, tạo nên màu sắc hổ phách đục mờ quyến rũ, lớp bọt kem dày mịn như tuyết và giải phóng hương vị trọn vẹn nhất.
              </p>
              
              <div className="weissbier-specs">
                <div className="weissbier-spec-item">
                  <span className="weissbier-spec-label">Nồng Độ Cồn (ABV)</span>
                  <span className="weissbier-spec-value">5.4%</span>
                </div>
                <div className="weissbier-spec-item">
                  <span className="weissbier-spec-label">Quy Cách Đóng Gói</span>
                  <span className="weissbier-spec-value">Lon/Chai 500ml</span>
                </div>
              </div>

              <a 
                href={linkOrder}
                target="_blank"
                rel="noopener noreferrer"
                className="football-popup-cta-btn button-gold-pulse"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', maxWidth: '300px' }}
              >
                LIÊN HỆ ĐẶT HÀNG NGAY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bavarian Pouring Ritual */}
      <section className="weissbier-ritual">
        <div className="container" style={{ padding: '0 20px' }}>
          <h2 className="weissbier-section-title">Nghi Thức Rót Bia Chuẩn Bavaria</h2>
          <p className="weissbier-section-subtitle">
            Hãy làm đúng 4 bước dưới đây để đánh thức lớp men sống tinh túy đọng dưới đáy chai bia
          </p>

          <div className="weissbier-ritual-grid">
            <div className="weissbier-ritual-card">
              <span className="weissbier-ritual-num">01</span>
              <h3 className="weissbier-ritual-title">Ướp Lạnh Sâu</h3>
              <p className="weissbier-ritual-desc">Ủ lạnh chai bia và ly thủy tinh thon dài chuyên dụng ở nhiệt độ lý tưởng từ 6 - 8°C trước khi rót.</p>
            </div>
            <div className="weissbier-ritual-card">
              <span className="weissbier-ritual-num">02</span>
              <h3 className="weissbier-ritual-title">Rót Nghiêng 45°</h3>
              <p className="weissbier-ritual-desc">Rót từ từ bia dọc theo thành ly nghiêng 45° cho đến khi lượng bia trong chai còn khoảng 1/4.</p>
            </div>
            <div className="weissbier-ritual-card">
              <span className="weissbier-ritual-num">03</span>
              <h3 className="weissbier-ritual-title">Xoay Nhẹ Chai</h3>
              <p className="weissbier-ritual-desc">Giữ chai nằm ngang, lắc tròn hoặc lăn nhẹ vài vòng để lớp men sống dưới đáy hòa tan hoàn toàn.</p>
            </div>
            <div className="weissbier-ritual-card">
              <span className="weissbier-ritual-num">04</span>
              <h3 className="weissbier-ritual-title">Phủ Bọt Tuyết</h3>
              <p className="weissbier-ritual-desc">Rót hết phần men sống còn lại thẳng vào giữa ly để tạo nên lớp bọt kem dày mịn như tuyết phủ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tasting Notes */}
      <section className="weissbier-tasting">
        <div className="container" style={{ padding: '0 20px' }}>
          <h2 className="weissbier-section-title">Hương Vị Cảm Nhận (Tasting Notes)</h2>
          <p className="weissbier-section-subtitle">Trải nghiệm bốn tầng vị của dòng bia di sản được nấu theo Luật Tinh Khiết 1516</p>

          <div className="weissbier-tasting-grid">
            <div className="weissbier-tasting-card">
              <div className="weissbier-tasting-header">
                <span className="weissbier-tasting-icon">👁️</span>
                <h3 className="weissbier-tasting-title">Thị Giác (Visual)</h3>
              </div>
              <p className="weissbier-tasting-desc">
                Sắc vàng hổ phách đục mờ quyến rũ đặc trưng. Lớp bọt kem màu trắng tuyết, dày dặn, lâu tan và bám chặt vào thành ly thủy tinh.
              </p>
            </div>

            <div className="weissbier-tasting-card">
              <div className="weissbier-tasting-header">
                <span className="weissbier-tasting-icon">👃</span>
                <h3 className="weissbier-tasting-title">Khứu Giác (Aroma)</h3>
              </div>
              <p className="weissbier-tasting-desc">
                Lan tỏa hương thơm ngọt ngào tự nhiên của quả chuối chín, hương thơm cay nhẹ thanh tao của đinh hương và nốt hương lúa mì nướng ấm áp.
              </p>
            </div>

            <div className="weissbier-tasting-card">
              <div className="weissbier-tasting-header">
                <span className="weissbier-tasting-icon">👅</span>
                <h3 className="weissbier-tasting-title">Vị Giác (Taste)</h3>
              </div>
              <p className="weissbier-tasting-desc">
                Cảm giác ngụm bia vô cùng êm dịu, mượt mà và tròn trịa trong khoang miệng. Vị ngọt nhẹ của hoa quả cân bằng hoàn hảo, không có vị đắng gắt.
              </p>
            </div>

            <div className="weissbier-tasting-card">
              <div className="weissbier-tasting-header">
                <span className="weissbier-tasting-icon">✨</span>
                <h3 className="weissbier-tasting-title">Hậu Vị (Finish)</h3>
              </div>
              <p className="weissbier-tasting-desc">
                Trôi qua cuống họng nhẹ nhàng, để lại hậu vị ngọt thanh nhẹ của mạch nha, hương thơm hoa quả kéo dài tạo cảm giác thư giãn sâu sắc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Pairing */}
      <section className="weissbier-pairing">
        <div className="container" style={{ padding: '0 20px' }}>
          <div className="weissbier-pairing-wrap">
            <div className="weissbier-pairing-content">
              <h2 className="weissbier-section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Nghệ Thuật Kết Hợp Ẩm Thực</h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Nhờ hương vị lúa mì ngọt mát và độ sủi tăm mượt mà, Benediktiner Weissbier là thức uống đồng hành lý tưởng để tôn vinh hương vị của các món ăn chính:
              </p>

              <div className="weissbier-pairing-list">
                <div className="weissbier-pairing-item">
                  <span className="weissbier-pairing-check">✓</span>
                  <div className="weissbier-pairing-text">
                    <strong>Hải sản tươi sống</strong>
                    <p>Cực kỳ hợp với tôm hấp sả, cua huỳnh đế, mực nướng sa tế và lẩu hải sản chua ngọt.</p>
                  </div>
                </div>

                <div className="weissbier-pairing-item">
                  <span className="weissbier-pairing-check">✓</span>
                  <div className="weissbier-pairing-text">
                    <strong>Đồ nướng & Gia cầm</strong>
                    <p>Gà quay mật ong, heo xá xíu, salad bơ ức gà nướng và xúc xích bê trắng truyền thống Đức.</p>
                  </div>
                </div>

                <div className="weissbier-pairing-item">
                  <span className="weissbier-pairing-check">✓</span>
                  <div className="weissbier-pairing-text">
                    <strong>Phô mai mềm & Đồ ngọt</strong>
                    <p>Phô mai dê, Gouda mềm, bánh tart táo nướng và các món panna cotta hoa quả ngọt dịu.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="weissbier-pairing-img-wrap">
              <Image 
                src="/images/products/lifestyle_friends_v2.png"
                alt="Thưởng thức bia lúa mì Benediktiner cùng bạn bè"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>

          {/* CTA Box */}
          <div className="weissbier-cta-box">
            <h3 className="weissbier-cta-title">Thưởng Thức Hương Vị Bavaria Ngay Hôm Nay</h3>
            <p className="weissbier-cta-desc">
              Nhập khẩu nguyên chai chính ngạch từ Đức. Đặt lịch giao nhanh mát lạnh tận nơi chỉ trong 1 chạm.
            </p>
            <a 
              href={linkOrder}
              target="_blank"
              rel="noopener noreferrer"
              className="football-popup-cta-btn button-gold-pulse"
              style={{ display: 'inline-block', minWidth: '240px', textDecoration: 'none' }}
            >
              LIÊN HỆ ĐẶT HÀNG QUA ZALO
            </a>
          </div>
        </div>
      </section>

      {/* AI Summary / GEO Section */}
      <section className="weissbier-ai-section">
        <div className="container" style={{ maxWidth: '780px', padding: '0 20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--web-gold)', marginBottom: '20px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
            Thông Tin Nhanh Để Trích Dẫn Tìm Kiếm (AI Summary)
          </h2>
          <div className="weissbier-ai-card">
            <p><strong>Bia Thầy Tu Benediktiner Weissbier Naturtrüb:</strong> Là dòng bia lúa mì Đức nguyên bản, nồng độ cồn 5.4% ABV, sản xuất tại tu viện Ettal (Bavaria) theo đạo Luật Tinh Khiết Reinheitsgebot 1516 lâu đời.</p>
            <p style={{ marginTop: '8px' }}><strong>Đặc tính hương vị:</strong> Men bia không lọc đục tự nhiên (Naturtrüb), bọt dày mịn, hương trái cây đặc trưng chuối chín và đinh hương. Đạt giải thưởng ẩm thực quốc tế danh giá iTQi 3 Sao.</p>
            <p style={{ marginTop: '8px' }}><strong>Đại lý phân phối chính hãng:</strong> Phân phối chính ngạch bởi hệ thống Bia Thầy Tu (biathaytu.com - Hotline Zalo: 0899.191.313 - Showroom 659A Lạc Long Quân, Tây Hồ, Hà Nội).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
