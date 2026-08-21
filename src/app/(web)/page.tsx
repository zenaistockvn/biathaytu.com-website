import Link from 'next/link';
import Image from 'next/image';
import { getVisibleProducts } from '@/lib/data/products';
import ZaloCTA from './components/ZaloCTA';
import LandingHero from './components/LandingHero';
import SectionHeader from './components/SectionHeader';
import ProductTabs from './components/ProductTabs';
import JsonLd, { getLandingFAQSchema, getBreadcrumbSchema, getStoreSchema } from './components/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
  description: 'Bia Thầy Tu Benediktiner Weissbier — bia lúa mì Đức 100% nhập khẩu nguyên chai từ Tu Viện Ettal, Bavaria. Đạt giải iTQi 3 Sao 2022. Chuẩn Luật Tinh Khiết 1516. Giao hàng toàn quốc — Hotline 0899.191.313.',
  alternates: {
    canonical: 'https://www.biathaytu.com',
  },
  openGraph: {
    title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Bia Thầy Tu Benediktiner Weissbier — bia lúa mì Đức 100% nhập khẩu nguyên chai từ Tu Viện Ettal, Bavaria. Đạt giải iTQi 3 Sao 2022. Chuẩn Luật Tinh Khiết 1516. Giao hàng toàn quốc — Hotline 0899.191.313.',
    type: 'website',
    url: 'https://www.biathaytu.com',
    images: [
      {
        url: '/images/sanh_bia_duc_cover.png',
        width: 1200,
        height: 630,
        alt: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng',
    description: 'Bia Thầy Tu Benediktiner Weissbier — bia lúa mì Đức 100% nhập khẩu nguyên chai từ Tu Viện Ettal, Bavaria. Đạt giải iTQi 3 Sao 2022. Chuẩn Luật Tinh Khiết 1516. Giao hàng toàn quốc — Hotline 0899.191.313.',
    images: ['/images/sanh_bia_duc_cover.png'],
  },
};

export default async function LandingPage() {
  const featuredProducts = getVisibleProducts();

  return (
    <>
      {/* Structured Data — FAQ for AEO / AI Overview */}
      <JsonLd type="faq" data={getLandingFAQSchema()} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
      ])} />
      <JsonLd type="organization" data={getStoreSchema()} />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <LandingHero />


      {/* ═══════════════════════════════════════════ 
          USP BAR — 4 Điểm Mạnh
      ═══════════════════════════════════════════ */}
      <section className="usp-bar reveal-on-scroll" aria-label="Điểm nổi bật">
        <div className="container usp-grid">
          {[
            { 
              title: '100% Nhập Khẩu', 
              desc: 'Nguyên chai trực tiếp từ Đức',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            },
            { 
              title: 'Luật Tinh Khiết', 
              desc: 'Chỉ 4 nguyên liệu: Malt, Hoa bia, Men, Nước',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            },
            { 
              title: 'Tư Vấn Tận Tâm', 
              desc: 'Hỗ trợ chọn sản phẩm theo nhu cầu',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>
            },
            { 
              title: 'Giải Thưởng Quốc Tế', 
              desc: 'iTQi 3 Sao — Hương vị vượt trội',
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            },
          ].map((item, i) => (
            <div key={i} className="usp-item-wrap">
              <div className="usp-icon">
                {item.icon}
              </div>
              <h3 className="usp-title">{item.title}</h3>
              <p className="usp-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          FEATURED PRODUCTS
      ═══════════════════════════════════════════ */}
      <section className="section reveal-on-scroll" aria-label="Sản phẩm nổi bật">
        <div className="container">
          <SectionHeader label="Tuyển Chọn Đặc Biệt" title="Danh Mục Sản Phẩm" />

          <ProductTabs products={featuredProducts} />

          <div className="text-center mt-lg">
            <Link href="/san-pham" className="btn-outline shimmer-effect">
              Xem Toàn Bộ Sản Phẩm →
            </Link>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          GIẢI THƯỞNG QUỐC TẾ — iTQi 3 Sao
      ═══════════════════════════════════════════ */}
      <section className="section-alt reveal-on-scroll delay-100" aria-label="Giải thưởng iTQi">
        <div className="container split-section">
          <div className="itqi-img-wrap">
            <Image 
              src="/images/products/official/benediktiner/glass_removebg.png" 
              alt="Benediktiner Weissbier — Ly bia chính hãng đầy bọt, giải thưởng iTQi 3 Sao" 
              fill 
              className="itqi-img-contain"
            />
          </div>
          
          <div>
            <span className="section-label">Giải Thưởng Danh Giá</span>
            <h2 className="section-title">Hương Vị Vượt Trội<br/><span className="text-gold">3 Sao</span></h2>
            <div className="inline-divider" />
            
            <p className="p-lead">
              Năm 2022, <strong style={{ color: 'var(--web-text)' }}>Viện Hương Vị Quốc Tế (iTQi)</strong> đã trao giải cao nhất — <strong className="text-gold">&quot;Hương Vị Vượt Trội 3 Sao&quot;</strong> — cho Benediktiner Weissbier Naturtrüb.
            </p>
            <p className="p-body">
              Danh hiệu &quot;3 Sao&quot; chỉ được trao cho những sản phẩm có chất lượng hương vị vượt trội và nổi bật trên toàn thế giới. Đây là minh chứng mạnh mẽ cho sự xuất sắc trong quy trình ủ bia tu viện truyền thống.
            </p>

            <div className="stat-card stat-card-bordered">
              <div>
                <div className="stat-value">iTQi 3 Sao</div>
                <div className="stat-label">Superior Taste Award</div>
              </div>
              <div className="stat-separator" />
              <div>
                <div className="stat-value stat-value-dark">1330</div>
                <div className="stat-label">Tu Viện Ettal thành lập</div>
              </div>
            </div>

            <a 
              href="https://www.taste-institute.com/en/awarded-products/product-details/9022846" 
              target="_blank" rel="noopener noreferrer"
              className="btn-outline mt-md shimmer-effect"
            >
              Xem Chứng Nhận iTQi →
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          FOOD PAIRING — Nghệ Thuật Thưởng Thức
      ═══════════════════════════════════════════ */}
      <section className="section reveal-on-scroll delay-100" aria-label="Hướng dẫn Food Pairing">
        <div className="container">
          <SectionHeader label="Nghệ Thuật Food Pairing" title="Hương Vị Trọn Vẹn Cho Mọi Bữa Tiệc" />

          <div className="food-grid">
            {/* Left: Pairing Guide */}
            <div className="food-list">
              {[
                { 
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
                  title: 'Dòng Hell / Lager',
                  desc: 'Vị mạch nha thanh khiết, hoa bia cân bằng — Bạn đồng hành hoàn hảo cho Gà nướng, Phô mai, Salad, hay bất kỳ bữa tiệc ngoài trời nào.',
                  color: 'var(--web-accent-strong)',
                },
                { 
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M8 10c0-2-4-2-4-6"/><path d="M16 10c0-2 4-2 4-6"/><path d="M8 18c0-2-4-2-4-6"/><path d="M16 18c0-2 4-2 4-6"/></svg>, 
                  title: 'Dòng Weissbier (Lúa Mì)', 
                  desc: 'Hương trái cây, chuối, đinh hương — Tuyệt đỉnh khi dùng chung với Bánh Pretzel, Phô mai nướng, hoặc các loại Hải sản hấp.',
                  color: 'var(--web-accent)',
                },
                { 
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10l-1 13H8L7 4z"/><path d="M5 8h14"/></svg>, 
                  title: 'Dòng Dunkel (Bia Đen)', 
                  desc: 'Vị mạch nha rang đậm đà cùng xirô caramel — Lựa chọn hoàn hảo khi sánh vai cùng Xúc xích nướng BBQ, Steak bò non, Thịt cừu.',
                  color: 'var(--web-ink)',
                }
              ].map((item, i) => (
                <div key={i} className="food-pairing-card food-card-body">
                  <div className="food-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="food-card-text">
                    <h4 className="food-card-title">{item.title}</h4>
                    <p className="food-card-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Food Images */}
            <div className="food-images">
              <div className="food-img-wrap food-img-tall">
                <Image src="/images/products/food_bbq.png" alt="Xúc xích nướng BBQ kết hợp bia Dunkel Đức" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="food-img-wrap food-img-tall food-img-offset">
                <Image src="/images/products/food_seafood_flatlay.png" alt="Hải sản tươi kết hợp bia Weissbier Đức" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="food-img-wrap food-img-wide">
                <Image src="/images/products/food_pho.png" alt="Phở Việt Nam và bia Đức Benediktiner — Food Pairing đặc biệt" fill style={{ objectFit: 'cover' }} />
                <div className="food-img-badge">
                  Bia Đức × Ẩm Thực Việt = Tuyệt Phẩm
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          BRAND STORY — Câu Chuyện Thương Hiệu
      ═══════════════════════════════════════════ */}
      <section className="section-alt reveal-on-scroll delay-100" aria-label="Câu chuyện thương hiệu">
        <div className="container split-section">
          <div>
            <span className="section-label">Brand Story</span>
            <h2 className="section-title">Hơn 400 Năm<br/><span className="text-gold">Đam Mê Ủ Bia</span></h2>
            <div className="inline-divider" />
            
            <p className="p-lead">
              Kể từ năm 1330 tại <strong style={{ color: 'var(--web-text)' }}>Tu Viện Ettal, Bavaria</strong>, các tu sĩ đã miệt mài lưu truyền phương pháp ủ bia khắt khe. 
              Quá trình lên men trong hầm tối kết hợp cùng dòng nước suối Bavaria tinh khiết tạo nên hương vị không thể trộn lẫn.
            </p>
            <p className="p-body">
              <strong style={{ color: 'var(--web-text)' }}>Bia Thầy Tu</strong> — nhà phân phối độc quyền tại Việt Nam — cam kết bảo tồn 100% hương vị lịch sử, 
              từ nhà máy Đức đến tận tay bạn với công nghệ vận chuyển nhiệt độ chuẩn.
            </p>
            
            <Link href="/thuong-hieu" className="btn-primary shimmer-effect">
              Khám Phá Lịch Sử Thương Hiệu
            </Link>
          </div>
          
          <div className="story-img-container">
            <Image src="/images/products/story_monastery_v2.png" alt="Tu Viện Ettal, Bavaria — nơi khởi nguồn bia Benediktiner từ năm 1330" fill style={{ objectFit: 'cover' }} />
            {/* Floating stat card */}
            <div className="stat-card stat-card-absolute">
              <div>
                <div className="stat-value">1330</div>
                <div className="stat-label">Khởi Nguồn</div>
              </div>
              <div className="stat-separator" />
              <div>
                <div className="stat-value">4</div>
                <div className="stat-label">Nguyên Liệu</div>
              </div>
              <div className="stat-separator" />
              <div>
                <div className="stat-value">100%</div>
                <div className="stat-label">Nhập Khẩu</div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* ═══════════════════════════════════════════ 
          FAQ — SEO / AEO / AI Overview Section
      ═══════════════════════════════════════════ */}
      <section className="section-alt reveal-on-scroll delay-100" aria-label="Câu hỏi thường gặp" id="faq">
        <div className="container">
          <SectionHeader label="Câu Hỏi Thường Gặp" title="Về Bia Thầy Tu Benediktiner" />

          <div className="faq-list">
            {[
              { q: 'Bia Thầy Tu là bia gì?', a: 'Bia Thầy Tu (Benediktiner Weissbier) là dòng bia lúa mì truyền thống của Đức, được ủ theo phương pháp tu viện từ năm 1609 tại Tu Viện Ettal, Bavaria. Bia được sản xuất theo Luật Tinh Khiết 1516 (Reinheitsgebot), chỉ sử dụng 4 nguyên liệu: nước, malt lúa mì, hoa bia và men bia.' },
              { q: 'Bia Benediktiner Weissbier có vị gì?', a: 'Benediktiner Weissbier Naturtrüb có hương vị đặc trưng gồm trái chuối chín, đinh hương, với lớp bọt trắng mịn dày và hậu vị ngọt dịu. Bia có màu vàng hổ phách tự nhiên, không lọc (Naturtrüb), giữ trọn men sống và hương vị tự nhiên.' },
              { q: 'Mua bia Đức Benediktiner chính hãng ở đâu tại Việt Nam?', a: 'Bia Thầy Tu Benediktiner được nhập khẩu và phân phối độc quyền tại Việt Nam. Vui lòng liên hệ qua Zalo 0899.191.313, hotline hoặc ghé Showroom 659A Lạc Long Quân, Phường Tây Hồ, Hà Nội để được tư vấn sản phẩm và báo giá.' },
              { q: 'Bia Benediktiner có giải thưởng gì?', a: 'Năm 2022, Benediktiner Weissbier Naturtrüb đã được Viện Hương Vị Quốc Tế (iTQi) trao giải "Superior Taste Award" — 3 Sao, mức cao nhất dành cho sản phẩm có hương vị vượt trội trên toàn thế giới.' },
              { q: 'Luật Tinh Khiết 1516 (Reinheitsgebot) là gì?', a: 'Reinheitsgebot là luật tinh khiết bia của Đức ban hành năm 1516. Luật quy định bia chỉ được sản xuất từ 4 nguyên liệu: nước, malt đại mạch, hoa bia và men. Đây là luật an toàn thực phẩm lâu đời nhất thế giới.' },
              { q: 'Bia Thầy Tu có bao nhiêu dòng sản phẩm?', a: 'Bia Thầy Tu hiện phân phối: Benediktiner Weissbier Naturtrüb (bia lúa mì), Benediktiner Dunkel (bia đen), Bom 5L Benediktiner, và Combo Mix 2 vị. Tất cả đều được nhập khẩu 100% nguyên chai từ Đức.' },
            ].map((item, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-summary">
                  {item.q}
                  <span className="faq-toggle">+</span>
                </summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          CTV & DOANH NGHIỆP — B2B CTA
      ═══════════════════════════════════════════ */}
      <section className="section b2b-section reveal-on-scroll delay-100" aria-label="Hợp tác kinh doanh">
        {/* Cinematic Background */}
        <div className="b2b-bg" />
        <div className="b2b-overlay" />

        <div className="container b2b-grid">
          {/* Khách hàng doanh nghiệp */}
          <div className="glass-card-dark">
            <div className="icon-circle icon-circle-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
            </div>
            <h3 className="b2b-card-title">Khách Hàng Doanh Nghiệp</h3>
            <p className="b2b-card-desc">
              Giải pháp bia Đức cao cấp cho nhà hàng, khách sạn và sự kiện. 
              Chính sách chiết khấu sâu, hỗ trợ POSM và nâng tầm thương hiệu.
            </p>
            <ZaloCTA 
              label="Nhận Tư Vấn B2B" 
              productName="Khách hàng Doanh nghiệp" 
              className="btn-primary"
            />
          </div>

          {/* Cộng tác viên */}
          <div className="glass-card-light">
            <div className="icon-circle icon-circle-ink">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="b2b-card-title">Trở Thành Cộng Tác Viên</h3>
            <p className="b2b-card-desc">
              Kinh doanh bia Đức chính hãng cùng hệ thống. 
              Chiết khấu hấp dẫn, hỗ trợ vận chuyển và đào tạo sản phẩm.
            </p>
            <ZaloCTA 
              label="Tìm Hiểu Chương Trình CTV" 
              productName="Chương trình Cộng tác viên" 
              variant="outline"
            />
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          18+ DISCLAIMER
      ═══════════════════════════════════════════ */}
      <section className="disclaimer-bar" aria-label="Thông báo 18+">
        <div className="container">
          <p className="disclaimer-text">
            <span className="disclaimer-badge">18</span>
            Người dưới 18 tuổi không được uống rượu bia · Thưởng Thức Có Trách Nhiệm
          </p>
        </div>
      </section>
    </>
  );
}
