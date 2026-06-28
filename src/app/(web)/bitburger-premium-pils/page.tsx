import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd, { getArticleSchema, getBreadcrumbSchema, getProductSchema } from '../components/JsonLd';
import { getPriceRange } from '@/lib/seo/productPricing';

export const metadata: Metadata = {
  title: 'Bitburger Premium Pils — Bản Giới Hạn World Cup 2026',
  description: 'Khám phá dòng bia pilsner số 1 nước Đức - Bitburger Premium Pils phiên bản giới hạn Football Edition 2026. Đặt mua thùng 24 lon và Combo Match Night giao nhanh.',
  alternates: { canonical: 'https://www.biathaytu.com/bitburger-premium-pils' },
  openGraph: {
    title: 'Bitburger Premium Pils — Bản Giới Hạn World Cup 2026',
    description: 'Khám phá dòng bia pilsner số 1 nước Đức - Bitburger Premium Pils phiên bản giới hạn Football Edition 2026. Đặt mua thùng 24 lon và Combo Match Night giao nhanh.',
    type: 'website',
    url: 'https://www.biathaytu.com/bitburger-premium-pils',
    images: [
      {
        url: '/images/products/bitburger_combo_match_night.jpg',
        width: 1200,
        height: 630,
        alt: 'Bitburger Premium Pils Football Edition 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitburger Premium Pils — Bản Giới Hạn World Cup 2026',
    description: 'Khám phá dòng bia pilsner số 1 nước Đức - Bitburger Premium Pils phiên bản giới hạn Football Edition 2026.',
    images: ['/images/products/bitburger_combo_match_night.jpg'],
  },
};

export default function Page() {
  const priceRange = getPriceRange((p) => p.name.includes('Bitburger'));
  const product = {
    name: 'Bitburger Premium Pils',
    slug: 'bitburger-premium-pils',
    url: 'https://www.biathaytu.com/bitburger-premium-pils',
    description: 'Bia Pilsner tươi mát chuẩn Đức, lên men đáy với hoa bia hảo hạng. Phiên bản giới hạn Football Edition 2026.',
    abv: '4.8',
    volume: '330ml, 500ml',
  };

  const zaloBaseUrl = 'https://zalo.me/0899191313';
  
  const msgKeg = 'Chào Bia Thầy Tu, mình muốn đặt mua Thùng 24 lon Bitburger Premium Pils 500ml Football Edition 2026 giá 1.150.000đ. Tư vấn giúp mình nhé.';
  const msgCombo = 'Chào Bia Thầy Tu, mình muốn đặt mua Combo Match Night (2 két Bitburger Football Edition + Tặng xúc xích Đức 500g) giá 2.290.000đ. Tư vấn giúp mình nhé.';
  const msgGeneral = 'Chào Bia Thầy Tu, mình muốn tư vấn đặt mua bia đắng thanh Bitburger Premium Pils chính hãng. Giao nhanh giúp mình nhé.';

  const linkKeg = `${zaloBaseUrl}?text=${encodeURIComponent(msgKeg)}`;
  const linkCombo = `${zaloBaseUrl}?text=${encodeURIComponent(msgCombo)}`;
  const linkGeneral = `${zaloBaseUrl}?text=${encodeURIComponent(msgGeneral)}`;

  return (
    <div className="bitburger-landing">
      <JsonLd type="product" data={getProductSchema({ ...product, category: 'bia', priceFrom: priceRange?.lowPrice, priceTo: priceRange?.highPrice, offerCount: priceRange?.offerCount })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Sản Phẩm', url: 'https://www.biathaytu.com/san-pham' }, { name: 'Bitburger Premium Pils', url: 'https://www.biathaytu.com/bitburger-premium-pils' }])} />

      {/* Hero Section */}
      <section className="bitburger-hero">
        <div className="container" style={{ padding: '0 20px' }}>
          <span className="bitburger-hero-badge">Đỉnh Cao Pilsner Nước Đức</span>
          <h1 className="bitburger-hero-title">
            Bitburger <span>Premium Pils</span>
          </h1>
          <p className="bitburger-hero-desc">
            "Bitte ein Bit" — Thưởng thức dòng bia vàng đắng thanh, sảng khoái tột độ được yêu thích hàng đầu nước Đức. Nay có phiên bản giới hạn Football Edition 2026 đồng hành cùng những trận cầu rực lửa.
          </p>
        </div>
      </section>

      {/* World Cup 2026 Campaign Block */}
      <section className="campaign-wc-section">
        <div className="container">
          <div className="campaign-title-wrap">
            <span className="campaign-badge">Bản Giới Hạn Mùa Bóng 2026</span>
            <h2 className="campaign-main-title">
              Cùng Cổ Vũ Với <span>Bitburger Football Edition</span>
            </h2>
            <p className="campaign-subtitle">
              Đưa cả không khí lễ hội bóng đá Đức về nhà bạn. Giao mát lạnh tận nơi chỉ trong 1 chạm.
            </p>
          </div>

          <div className="campaign-wc-grid">
            {/* Offer 1: Single Case */}
            <div className="campaign-wc-card">
              <div className="campaign-wc-img-holder">
                <Image 
                  src="/images/products/bitburger_combo_match_night.jpg"
                  alt="Thùng 24 lon Bitburger WC 2026"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
              </div>
              <div className="campaign-wc-info">
                <div>
                  <h3 className="campaign-wc-name">Thùng 24 Lon Bitburger WC 2026</h3>
                  <p className="campaign-wc-desc">
                    Lon 500ml phiên bản giới hạn bóng đá. Nước bia vàng óng ả tinh khiết, lớp bọt dày mịn lâu tan, vị đắng thanh làm sạch vòm họng lý tưởng trong những buổi xem bóng đá kịch tính.
                  </p>
                </div>
                <div>
                  <div className="campaign-wc-price-block">
                    <span className="campaign-wc-price">1.150.000 đ</span>
                    <span className="campaign-wc-unit">/ Thùng 24 lon 500ml</span>
                  </div>
                  <a 
                    href={linkKeg}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="football-popup-cta-btn button-gold-pulse"
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                  >
                    LIÊN HỆ ĐẶT HÀNG QUA ZALO
                  </a>
                </div>
              </div>
            </div>

            {/* Offer 2: Combo Match Night */}
            <div className="campaign-wc-card">
              <div className="campaign-wc-img-holder">
                <Image 
                  src="/images/products/bitburger_football_edition.jpg"
                  alt="Combo Match Night 2026"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
              </div>
              <div className="campaign-wc-info">
                <div>
                  <h3 className="campaign-wc-name">Combo Match Night 2026</h3>
                  <p className="campaign-wc-desc">
                    Trải nghiệm cổ vũ bóng đá Đức trọn vẹn tại gia. Combo bao gồm 2 két Bitburger Football Edition mát lạnh, tặng kèm 500g xúc xích bê trắng chuẩn vị Đức nướng xèo xèo cực đã.
                  </p>
                </div>
                <div>
                  <div className="campaign-wc-price-block">
                    <span className="campaign-wc-price">2.290.000 đ</span>
                    <span className="campaign-wc-unit">/ Combo đầy đủ</span>
                  </div>
                  <a 
                    href={linkCombo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="football-popup-cta-btn button-navy-glow"
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                  >
                    ĐẶT COMBO GIAO NGAY
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro & Specs Section */}
      <section className="bitburger-intro">
        <div className="container" style={{ padding: '0 20px' }}>
          <div className="bitburger-intro-card">
            <div className="bitburger-intro-img-wrap">
              <img 
                src="/images/products/hero_bitburger_v2.png" 
                alt="Bitburger Premium Pils Classic" 
                className="bitburger-intro-img"
              />
            </div>
            <div className="bitburger-intro-content">
              <span className="bitburger-tag">Di Sản Từ Năm 1817</span>
              <h2 className="bitburger-intro-title">Bitte ein Bit — Vị đắng thanh khiết độc bản</h2>
              <p className="bitburger-intro-desc">
                Nấu theo Luật Tinh Khiết Reinheitsgebot 1516 lâu đời của Đức, Bitburger chỉ sử dụng 4 nguyên liệu tự nhiên tinh khiết nhất: Nước suối siêu mềm vùng Eifel, lúa mạch thượng hạng, hoa bia Certified Hallertau trứ danh và men bia độc quyền. Chất bia vàng trong vắt như pha lê, vị đắng sắc nét dễ chịu giúp làm sạch khoang miệng cực tốt, lý tưởng khi thưởng thức cùng các món nướng đậm vị.
              </p>
              
              <div className="bitburger-specs">
                <div className="bitburger-spec-item">
                  <span className="bitburger-spec-label">Nồng Độ Cồn (ABV)</span>
                  <span className="bitburger-spec-value">4.8%</span>
                </div>
                <div className="bitburger-spec-item">
                  <span className="bitburger-spec-label">Quy Cách Đóng Gói</span>
                  <span className="bitburger-spec-value">Lon 330ml/500ml, Chai</span>
                </div>
              </div>

              <a 
                href={linkGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="football-popup-cta-btn button-gold-pulse"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', maxWidth: '300px' }}
              >
                TƯ VẤN ĐẶT HÀNG NGAY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tasting Notes */}
      <section className="bitburger-tasting">
        <div className="container" style={{ padding: '0 20px' }}>
          <h2 className="bitburger-section-title">Hương Vị Cảm Nhận (Tasting Notes)</h2>
          <p className="bitburger-section-subtitle">Trải nghiệm bốn tầng vị tinh khiết của dòng Pilsner chuẩn mực nước Đức</p>

          <div className="bitburger-tasting-grid">
            <div className="bitburger-tasting-card">
              <div className="bitburger-tasting-header">
                <span className="bitburger-tasting-icon">👁️</span>
                <h3 className="bitburger-tasting-title">Thị Giác (Visual)</h3>
              </div>
              <p className="bitburger-tasting-desc">
                Sắc vàng rơm óng ả, trong suốt lấp lánh như pha lê dưới ánh sáng. Lớp bọt trắng mịn màng, lâu tan giúp bảo tồn hương vị hoa bia.
              </p>
            </div>

            <div className="bitburger-tasting-card">
              <div className="bitburger-tasting-header">
                <span className="bitburger-tasting-icon">👃</span>
                <h3 className="bitburger-tasting-title">Khứu Giác (Aroma)</h3>
              </div>
              <p className="bitburger-tasting-desc">
                Lan tỏa mùi thảo mộc tươi mát nhẹ nhàng của thiên nhiên, hương thơm hoa cỏ tinh tế đặc trưng của hoa bia vùng Hallertau Certified.
              </p>
            </div>

            <div className="bitburger-tasting-card">
              <div className="bitburger-tasting-header">
                <span className="bitburger-tasting-icon">👅</span>
                <h3 className="bitburger-tasting-title">Vị Giác (Taste)</h3>
              </div>
              <p className="bitburger-tasting-desc">
                Khởi đầu mượt mà với vị ngọt nhẹ của mạch nha chất lượng cao, tiếp nối ngay sau đó là vị đắng thanh mát, sắc nét và cực kỳ sảng khoái.
              </p>
            </div>

            <div className="bitburger-tasting-card">
              <div className="bitburger-tasting-header">
                <span className="bitburger-tasting-icon">✨</span>
                <h3 className="bitburger-tasting-title">Hậu Vị (Finish)</h3>
              </div>
              <p className="bitburger-tasting-desc">
                Hậu vị rất khô, sạch miệng (crisp) và đọng lại vị đắng dịu dễ chịu kéo dài, kích thích cảm giác muốn thưởng thức ngụm tiếp theo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Image Gallery */}
      <section className="lifestyle-gallery-section">
        <div className="container" style={{ padding: '0 20px' }}>
          <h2 className="bitburger-section-title">Khoảnh Khắc Di Sản &amp; Đời Sống</h2>
          <p className="bitburger-section-subtitle">
            Cảm hứng thưởng thức Bitburger Premium Pils trong những bữa tiệc bóng đá và sum họp chiến hữu
          </p>

          <div className="lifestyle-gallery-grid">
            <div className="lifestyle-gallery-card">
              <div className="lifestyle-gallery-img-wrap">
                <img 
                  src="/images/products/amc_assets/bitburg_heritage_story_1775753219026.png" 
                  alt="Di sản lịch sử" 
                  className="lifestyle-gallery-img"
                  loading="lazy"
                />
                <div className="lifestyle-gallery-overlay">
                  <h3 className="lifestyle-gallery-card-title">Di Sản Lịch Sử</h3>
                  <p className="lifestyle-gallery-card-desc">Hơn 200 năm chế tác bia Pilsner số 1 nước Đức</p>
                </div>
              </div>
            </div>

            <div className="lifestyle-gallery-card">
              <div className="lifestyle-gallery-img-wrap">
                <img 
                  src="/images/products/amc_assets/bitburg_to_saigon_1775741871482.png" 
                  alt="Bitburger đến Sài Gòn" 
                  className="lifestyle-gallery-img"
                  loading="lazy"
                />
                <div className="lifestyle-gallery-overlay">
                  <h3 className="lifestyle-gallery-card-title">Hành Trình Vượt Thời Gian</h3>
                  <p className="lifestyle-gallery-card-desc">Hương vị đẳng cấp thế giới đồng hành cùng người yêu bia Việt</p>
                </div>
              </div>
            </div>

            <div className="lifestyle-gallery-card">
              <div className="lifestyle-gallery-img-wrap">
                <img 
                  src="/images/products/amc_assets/bitburger_bbq_food_1775741893404.png" 
                  alt="Tiệc nướng BBQ" 
                  className="lifestyle-gallery-img"
                  loading="lazy"
                />
                <div className="lifestyle-gallery-overlay">
                  <h3 className="lifestyle-gallery-card-title">Tiệc Nướng BBQ</h3>
                  <p className="lifestyle-gallery-card-desc">Vị đắng thanh khiết hòa quyện cùng thớ thịt nướng đậm vị</p>
                </div>
              </div>
            </div>

            <div className="lifestyle-gallery-card">
              <div className="lifestyle-gallery-img-wrap">
                <img 
                  src="/images/products/amc_assets/bitburger_driving_lifestyle_1775733642452.png" 
                  alt="Lối sống năng động" 
                  className="lifestyle-gallery-img"
                  loading="lazy"
                />
                <div className="lifestyle-gallery-overlay">
                  <h3 className="lifestyle-gallery-card-title">Lối Sống Năng Động</h3>
                  <p className="lifestyle-gallery-card-desc">Đồng hành trong những khoảnh khắc tụ họp tràn đầy năng lượng</p>
                </div>
              </div>
            </div>

            <div className="lifestyle-gallery-card">
              <div className="lifestyle-gallery-img-wrap">
                <img 
                  src="/images/products/amc_assets/bitburger_fusion_food_1775753401190.png" 
                  alt="Ẩm thực Fusion" 
                  className="lifestyle-gallery-img"
                  loading="lazy"
                />
                <div className="lifestyle-gallery-overlay">
                  <h3 className="lifestyle-gallery-card-title">Ẩm Thực Fusion</h3>
                  <p className="lifestyle-gallery-card-desc">Khơi nguồn cảm hứng ẩm thực tinh tế không biên giới</p>
                </div>
              </div>
            </div>

            <div className="lifestyle-gallery-card">
              <div className="lifestyle-gallery-img-wrap">
                <img 
                  src="/images/products/amc_assets/bitburger_pour_tutorial_1775753451837.png" 
                  alt="Nghệ thuật rót bia" 
                  className="lifestyle-gallery-img"
                  loading="lazy"
                />
                <div className="lifestyle-gallery-overlay">
                  <h3 className="lifestyle-gallery-card-title">Nghệ Thuật Rót Bia</h3>
                  <p className="lifestyle-gallery-card-desc">Đánh thức lớp bọt dày mịn và giải phóng hương hoa bia Hallertau</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Pairing */}
      <section className="bitburger-pairing">
        <div className="container" style={{ padding: '0 20px' }}>
          <div className="bitburger-pairing-wrap">
            <div className="bitburger-pairing-content">
              <h2 className="bitburger-section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Nghệ Thuật Kết Hợp Ẩm Thực</h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Nhờ vị đắng thanh khiết và khả năng làm sạch vòm họng xuất sắc, Bitburger Premium Pils là sự kết hợp ẩm thực hoàn hảo cho các bữa tiệc:
              </p>

              <div className="bitburger-pairing-list">
                <div className="bitburger-pairing-item">
                  <span className="bitburger-pairing-check">✓</span>
                  <div className="bitburger-pairing-text">
                    <strong>Món ăn Việt Nam đậm vị</strong>
                    <p>Phù hợp tuyệt vời với mực nướng muối ớt, tôm rang muối, heo quay giòn bì và lẩu thái chua cay.</p>
                  </div>
                </div>

                <div className="bitburger-pairing-item">
                  <span className="bitburger-pairing-check">✓</span>
                  <div className="bitburger-pairing-text">
                    <strong>Đồ nướng BBQ & Xúc xích</strong>
                    <p>Hài hòa hoàn hảo với xúc xích Đức nướng xèo xèo, steak bò chín vừa và sườn cừu sốt BBQ đậm đà.</p>
                  </div>
                </div>

                <div className="bitburger-pairing-item">
                  <span className="bitburger-pairing-check">✓</span>
                  <div className="bitburger-pairing-text">
                    <strong>Các món hải sản & Khai vị</strong>
                    <p>Hợp vị tuyệt đối khi ăn kèm cá hồi áp chảo, hàu nướng mỡ hành hoặc khoai tây chiên muối kiểu Âu.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bitburger-pairing-img-wrap">
              <Image 
                src="/images/products/lifestyle_friends_v2.png"
                alt="Thưởng thức bia Bitburger cùng bạn bè"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>

          {/* CTA Box */}
          <div className="bitburger-cta-box">
            <h3 className="bitburger-cta-title">Sẵn Sàng Cho Trận Đấu Đêm Nay</h3>
            <p className="bitburger-cta-desc">
              Nhập khẩu chính ngạch nguyên chai/lon từ Đức. Đặt giao hàng ướp lạnh sẵn tận nơi cực nhanh.
            </p>
            <a 
              href={linkGeneral}
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
      <section className="bitburger-ai-section">
        <div className="container" style={{ maxWidth: '780px', padding: '0 20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--web-gold)', marginBottom: '20px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
            Thông Tin Nhanh Để Trích Dẫn Tìm Kiếm (AI Summary)
          </h2>
          <div className="bitburger-ai-card">
            <p><strong>Bia Bitburger Premium Pils:</strong> Là dòng bia vàng Pilsner lên men đáy số 1 nước Đức, nồng độ cồn 4.8% ABV, sản xuất từ năm 1817 theo Luật Tinh Khiết Reinheitsgebot 1516 nghiêm ngặt.</p>
            <p style={{ marginTop: '8px' }}><strong>Chiến dịch World Cup 2026:</strong> Bitburger ra mắt lon phiên bản giới hạn Football Edition "Prost to the World". Phân phối chính hãng qua hệ thống Bia Thầy Tu dưới dạng Thùng lẻ 24 lon 500ml và Combo Match Night kèm xúc xích Đức nướng.</p>
            <p style={{ marginTop: '8px' }}><strong>Nơi mua hàng chính ngạch:</strong> Hệ thống phân phối Bia Thầy Tu (biathaytu.com - Hotline Zalo tư vấn giao hàng: 0899.191.313 - Địa chỉ cửa hàng: 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
