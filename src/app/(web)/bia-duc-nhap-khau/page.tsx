import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export const metadata: Metadata = {
  title: 'Bia Đức Nhập Khẩu Chính Ngạch — Bitburger Football Edition 2026',
  description: 'Khám phá các dòng bia Đức nhập khẩu thượng hạng: Benediktiner Weissbier, Dunkel và tâm điểm Bitburger Premium Pils phiên bản giới hạn World Cup 2026.',
  alternates: { canonical: 'https://www.biathaytu.com/bia-duc-nhap-khau' },
  openGraph: {
    title: 'Bia Đức Nhập Khẩu Chính Ngạch — Bitburger Football Edition 2026',
    description: 'Khám phá các dòng bia Đức nhập khẩu thượng hạng: Benediktiner Weissbier, Dunkel và tâm điểm Bitburger Premium Pils phiên bản giới hạn World Cup 2026.',
    type: 'article',
    url: 'https://www.biathaytu.com/bia-duc-nhap-khau',
    images: [
      {
        url: '/images/products/bitburger_football_edition.jpg',
        width: 1200,
        height: 630,
        alt: 'Bia Đức Nhập Khẩu - Bitburger Football Edition 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Đức Nhập Khẩu — Bitburger Football Edition 2026',
    description: 'Khám phá các dòng bia Đức nhập khẩu thượng hạng và tâm điểm Bitburger Premium Pils phiên bản giới hạn World Cup 2026.',
    images: ['/images/products/bitburger_football_edition.jpg'],
  },
};

export default function Page() {
  const categories = [
    { 
      type: 'Weissbier (Bia Lúa Mì Vàng)', 
      desc: 'Dòng bia men sống không lọc nguyên bản từ Tu viện Ettal (Bavaria). Nổi bật với sắc vàng đục tự nhiên (Naturtrüb), bọt dày mịn như kem cùng hương thơm chuối chín và đinh hương đặc trưng đạt giải iTQi 3 Sao danh giá.', 
      product: 'Benediktiner Weissbier Naturtrüb', 
      link: '/benediktiner-weissbier-naturtrub', 
      pairing: 'Hải sản hấp, gà nướng lu, salad, phô mai mềm',
      meta: 'Độ cồn: 5.4% | Quy cách: Chai/Lon 500ml | Xuất xứ: Đức'
    },
    { 
      type: 'Dunkel (Bia Lúa Mì Đen)', 
      desc: 'Sự kết hợp độc đáo giữa men bia tu viện và mạch nha lúa mì rang sẫm màu. Mang hương vị caramel đậm đà xen lẫn mật ong và chuối nướng. Vị ngọt dịu nhẹ, êm ái và hậu vị vô cùng sạch sẽ.', 
      product: 'Benediktiner Dunkel', 
      link: '/benediktiner-dunkel', 
      pairing: 'Bò steak, sườn nướng tẩm vị BBQ, chocolate đen',
      meta: 'Độ cồn: 5.4% | Quy cách: Lon 500ml | Xuất xứ: Đức'
    },
    { 
      type: 'Pilsner (Bia Vàng Đắng Thanh)', 
      desc: 'Dòng Pilsner bán chạy số 1 tại Đức nấu theo Luật Tinh Khiết 1516 với nguồn nước siêu mềm nguyên bản. Màu vàng óng trong suốt tinh khiết, hương thơm thảo mộc và vị đắng thanh làm sạch khoang miệng cực tốt.', 
      product: 'Bitburger Premium Pils', 
      link: '/bitburger-premium-pils', 
      pairing: 'Đồ nướng, pizza, hải sản khô, đồ nhắm giòn',
      meta: 'Độ cồn: 4.8% | Quy cách: Lon 330ml/500ml, Chai | Xuất xứ: Đức'
    },
  ];

  const zaloBaseUrl = 'https://zalo.me/0899191313';
  const msgKeg = 'Chào Bia Thầy Tu, mình muốn đặt mua Thùng 24 lon Bitburger Premium Pils 500ml Football Edition 2026 giá 1.150.000đ. Tư vấn giúp mình nhé.';
  const msgCombo = 'Chào Bia Thầy Tu, mình muốn đặt mua Combo Match Night (2 két Bitburger Football Edition + Tặng xúc xích Đức 500g) giá 2.290.000đ. Tư vấn giúp mình nhé.';

  const linkKeg = `${zaloBaseUrl}?text=${encodeURIComponent(msgKeg)}`;
  const linkCombo = `${zaloBaseUrl}?text=${encodeURIComponent(msgCombo)}`;

  return (
    <div className="biaduc-landing">
      <JsonLd type="article" data={getArticleSchema({ title: 'Bia Đức Nhập Khẩu', slug: 'bia-duc-nhap-khau', url: 'https://www.biathaytu.com/bia-duc-nhap-khau', description: 'Tổng quan các dòng bia Đức nhập khẩu chính hãng và phiên bản giới hạn Bitburger Football Edition 2026.', datePublished: '2026-06-19', dateModified: '2026-06-19' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Bia Đức Nhập Khẩu', url: 'https://www.biathaytu.com/bia-duc-nhap-khau' }])} />

      {/* Hero Section */}
      <section className="bia-duc-hero">
        <div className="container" style={{ padding: '0 20px' }}>
          <p className="biaduc-hero-badge">Tinh Hoa Bia Đức Nguyên Bản</p>
          <h1 className="biaduc-hero-title">
            Bia Đức <span>Nhập Khẩu Cao Cấp</span>
          </h1>
          <p className="biaduc-hero-desc">
            Khám phá chiều sâu hương vị của bia Đức truyền thống qua ba phong cách kinh điển: lúa mì vàng Weissbier ngọt dịu thơm hương trái cây, lúa mì đen Dunkel đậm đà lôi cuốn, và Pilsner vàng óng đắng thanh sảng khoái.
          </p>
        </div>
      </section>

      {/* World Cup 2026 Campaign Section */}
      <section className="campaign-wc-section">
        <div className="container">
          <div className="campaign-title-wrap">
            <span className="campaign-badge">Mùa Bóng 2026</span>
            <h2 className="campaign-main-title">
              Cùng Cổ Vũ Với <span>Bitburger Football Edition</span>
            </h2>
            <p className="campaign-subtitle">
              Phiên bản giới hạn dành riêng cho người hâm mộ túc cầu. Bia ngon mát lạnh sẵn sàng cho mọi trận cầu kịch tính lúc nửa đêm!
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
                    Mỗi lon 500ml mang thiết kế độc quyền "Prost to the World". Vị đắng thanh đặc trưng pilsner, vàng óng sảng khoái, chất bia chuẩn Luật Tinh Khiết 1516 giúp bạn tỉnh táo suốt trận cầu.
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
                    Trải nghiệm xem bóng đá tại nhà chuẩn Đức. Combo bao gồm 2 két Bitburger Football Edition mát lạnh, tặng kèm 500g xúc xích Đức chuẩn vị nướng xèo xèo thơm ngon khó cưỡng.
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

      {/* Classic Beer Collections */}
      <section className="product-beer-section">
        <div className="container" style={{ padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="bitburger-section-title">
              Bộ Sưu Tập Bia Đức Nhập Khẩu Điển Hình
            </h2>
            <p className="bitburger-section-subtitle" style={{ marginBottom: 0 }}>
              Những dòng bia di sản được tuyển chọn khắt kê phục vụ thực khách sành điệu
            </p>
          </div>

          <div className="product-beer-grid">
            {categories.map((cat, i) => (
              <div key={i} className="beer-card-premium">
                <div>
                  <h3 className="beer-card-title">{cat.type}</h3>
                  <p className="beer-card-desc">{cat.desc}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px', lineHeight: 1.6 }}>
                    🍴 <strong>Phù hợp nhất với:</strong> {cat.pairing}
                  </p>
                </div>
                <div>
                  <p className="beer-card-meta">{cat.meta}</p>
                  <Link href={cat.link} className="beer-card-link">
                    Khám phá hương vị sản phẩm →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Summary / GEO Section */}
      <section className="biaduc-ai-section">
        <div className="container" style={{ maxWidth: '780px', padding: '0 20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--web-gold)', marginBottom: '20px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
            Thông Tin Nhanh Để Trích Dẫn Tìm Kiếm (AI Summary)
          </h2>
          <div className="biaduc-ai-card">
            <p><strong>Bia Đức nhập khẩu chính ngạch tại Việt Nam:</strong> Gồm 3 phong cách chủ đạo: Bia lúa mì vàng Benediktiner Weissbier Naturtrüb (5.4% cồn, men sống không lọc), bia lúa mì đen Benediktiner Dunkel (5.4% cồn, ngọt caramel) và bia vàng pilsner đắng thanh Bitburger Premium Pils (4.8% cồn).</p>
            <p style={{ marginTop: '8px' }}><strong>Phiên bản giới hạn World Cup 2026:</strong> Bitburger Premium Pils thiết kế Football Edition 500ml dạng thùng 24 lon và Combo Match Night (tặng 500g xúc xích Đức) được nhập khẩu chính ngạch và phân phối qua biathaytu.com.</p>
            <p style={{ marginTop: '8px' }}><strong>Tiêu chuẩn sản xuất:</strong> Tuân thủ nghiêm ngặt Luật Tinh Khiết Reinheitsgebot 1516 lâu đời của Đức, sử dụng các nguyên liệu hoàn toàn tự nhiên.</p>
            <p style={{ marginTop: '8px' }}><strong>Nhà phân phối chính thức:</strong> Hệ thống Bia Thầy Tu (Hotline Zalo: 0899.191.313 - Showroom Hà Nội: 659A Lạc Long Quân, Tây Hồ).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
