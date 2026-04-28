import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabase } from '@/lib/supabase/server';
import ZaloCTA from './components/ZaloCTA';
import LandingHero from './components/LandingHero';
import SectionHeader from './components/SectionHeader';
import ProductCard from './components/ProductCard';
import JsonLd, { getLandingFAQSchema, getBreadcrumbSchema } from './components/JsonLd';
import { getTastingNotes } from './utils/getTastingNotes';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Bia Thầy Tu Benediktiner — Bia Đức Nhập Khẩu Chính Hãng Từ Tu Viện Ettal',
  description: 'Bia Thầy Tu Benediktiner Weissbier — bia lúa mì Đức 100% nhập khẩu nguyên chai từ Tu Viện Ettal, Bavaria. Đạt giải iTQi 3 Sao 2022. Chuẩn Luật Tinh Khiết 1516. Giao hàng toàn quốc — Hotline 091.531.2166.',
  alternates: {
    canonical: 'https://www.biathaytu.com',
  },
};

export default async function LandingPage() {
  const supabase = await createServerSupabase();
  
  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .neq('category', 'vang')
    .not('name', 'ilike', '%bitburger%')
    .order('sort_order', { ascending: true })
    .limit(6);

  return (
    <>
      {/* Structured Data — FAQ for AEO / AI Overview */}
      <JsonLd type="faq" data={getLandingFAQSchema()} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([
        { name: 'Trang Chủ', url: 'https://www.biathaytu.com' },
      ])} />

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
            { abbr: 'DE', title: '100% Nhập Khẩu', desc: 'Nguyên chai trực tiếp từ Đức' },
            { abbr: '1516', title: 'Luật Tinh Khiết', desc: 'Chỉ 4 nguyên liệu: Malt, Hoa bia, Men, Nước' },
            { abbr: 'VN', title: 'Giao Hàng Toàn Quốc', desc: 'Ship COD mọi tỉnh thành Việt Nam' },
            { abbr: '★★★', title: 'Giải Thưởng Quốc Tế', desc: 'iTQi 3 Sao — Hương vị vượt trội' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '8px 12px' }}>
              <div className="usp-icon" style={{
                fontSize: item.abbr.length > 3 ? '11px' : '14px',
                letterSpacing: item.abbr === '★★★' ? '2px' : '0.5px',
              }}>{item.abbr}</div>
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
          <SectionHeader label="Tuyển Chọn Đặc Biệt" title="Sản Phẩm Nổi Bật" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 'var(--web-gap-sm)',
          }}>
            {featuredProducts?.map((product: {
              id: string; name: string; slug: string; images: string[] | null;
              abv: string | null; ibu: number | null; volume: string | null;
              short_description: string | null; price: number | null;
              haravan_url: string | null; category: string | null;
            }) => (
              <ProductCard
                key={product.id}
                {...product}
                description={product.short_description || `"${getTastingNotes(product.name)}"`}
                showCTA={true}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/san-pham" className="btn-outline">
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
              style={{ objectFit: 'contain', padding: '30px' }} 
            />
          </div>
          
          <div>
            <span className="section-label">Giải Thưởng Danh Giá</span>
            <h2 className="section-title">Hương Vị Vượt Trội<br/><span style={{ color: 'var(--web-gold)' }}>3 Sao</span></h2>
            <div className="inline-divider" />
            
            <p style={{ fontSize: '17px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
              Năm 2022, <strong style={{ color: 'var(--web-text)' }}>Viện Hương Vị Quốc Tế (iTQi)</strong> đã trao giải cao nhất — <strong style={{ color: 'var(--web-gold)' }}>&quot;Hương Vị Vượt Trội 3 Sao&quot;</strong> — cho Benediktiner Weissbier Naturtrüb.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--web-text-muted)', marginBottom: '28px' }}>
              Danh hiệu &quot;3 Sao&quot; chỉ được trao cho những sản phẩm có chất lượng hương vị vượt trội và nổi bật trên toàn thế giới. Đây là minh chứng mạnh mẽ cho sự xuất sắc trong quy trình ủ bia tu viện truyền thống.
            </p>

            <div className="stat-card" style={{ border: '1px solid var(--web-border)' }}>
              <div>
                <div className="stat-value">3 ⭐</div>
                <div className="stat-label">Superior Taste Award</div>
              </div>
              <div className="stat-separator" />
              <div>
                <div className="stat-value" style={{ color: 'var(--web-text)' }}>1330</div>
                <div className="stat-label">Năm lịch sử Tu Viện Ettal</div>
              </div>
            </div>

            <a 
              href="https://www.taste-institute.com/en/awarded-products/product-details/9022846" 
              target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ marginTop: '28px' }}
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
                  color: 'var(--web-gold-dark)',
                },
                { 
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M8 10c0-2-4-2-4-6"/><path d="M16 10c0-2 4-2 4-6"/><path d="M8 18c0-2-4-2-4-6"/><path d="M16 18c0-2 4-2 4-6"/></svg>, 
                  title: 'Dòng Weissbier (Lúa Mì)', 
                  desc: 'Hương trái cây, chuối, đinh hương — Tuyệt đỉnh khi dùng chung với Bánh Pretzel, Phô mai nướng, hoặc các loại Hải sản hấp.',
                  color: 'var(--web-gold)',
                },
                { 
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>, 
                  title: 'Dòng Dunkel (Bia Đen)', 
                  desc: 'Vị mạch nha rang đậm đà cùng xirô caramel — Lựa chọn hoàn hảo khi sánh vai cùng Xúc xích nướng BBQ, Steak bò non, Thịt cừu.',
                  color: 'var(--web-navy)',
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
                  <span style={{ fontSize: '16px' }}>🇻🇳</span> Bia Đức × Ẩm Thực Việt = Tuyệt Phẩm
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          BRAND STORY — Câu Chuyện Thương Hiệu
      ═══════════════════════════════════════════ */}
      <section className="section reveal-on-scroll delay-100" aria-label="Câu chuyện thương hiệu">
        <div className="container split-section">
          <div>
            <span className="section-label">Brand Story</span>
            <h2 className="section-title">Hơn 400 Năm<br/><span style={{ color: 'var(--web-gold)' }}>Đam Mê Ủ Bia</span></h2>
            <div className="inline-divider" />
            
            <p style={{ fontSize: '17px', lineHeight: 1.8, color: 'var(--web-text-secondary)', marginBottom: '20px' }}>
              Kể từ năm 1330 tại <strong style={{ color: 'var(--web-text)' }}>Tu Viện Ettal, Bavaria</strong>, các tu sĩ đã miệt mài lưu truyền phương pháp ủ bia khắt khe. 
              Quá trình lên men trong hầm tối kết hợp cùng dòng nước suối Bavaria tinh khiết tạo nên hương vị không thể trộn lẫn.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--web-text-muted)', marginBottom: '28px' }}>
              <strong style={{ color: 'var(--web-text)' }}>Bia Thầy Tu</strong> — nhà phân phối độc quyền tại Việt Nam — cam kết bảo tồn 100% hương vị lịch sử, 
              từ nhà máy Đức đến tận tay bạn với công nghệ vận chuyển nhiệt độ chuẩn.
            </p>
            
            <Link href="/thuong-hieu" className="btn-primary">
              Khám Phá Lịch Sử Thương Hiệu
            </Link>
          </div>
          
          <div style={{ position: 'relative', height: '500px', borderRadius: 'var(--web-radius-lg)', overflow: 'hidden' }}>
            <Image src="/images/products/story_monastery_v2.png" alt="Tu Viện Ettal, Bavaria — nơi khởi nguồn bia Benediktiner từ năm 1330" fill style={{ objectFit: 'cover' }} />
            {/* Floating stat card */}
            <div className="stat-card" style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
              <div>
                <div className="stat-value">693+</div>
                <div className="stat-label">Năm Lịch Sử</div>
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
          TESTIMONIALS — Đánh Giá Khách Hàng
      ═══════════════════════════════════════════ */}
      <section className="section-alt reveal-on-scroll delay-100" aria-label="Đánh giá khách hàng">
        <div className="container">
          <SectionHeader label="Khách Hàng Nói Gì" title="Đánh Giá Từ Người Yêu Bia" />

          <div className="testimonial-carousel testimonial-scroll">
            {[
              {
                name: 'Nguyễn Minh Tâm',
                role: 'Giám đốc kinh doanh',
                avatar: '/images/avatars/nguyen_minh_tam.png',
                text: 'Bia Benediktiner luôn là lựa chọn hàng đầu của tôi trong mọi bữa tiệc. Sự kết hợp tuyệt vời giữa truyền thống và chất lượng cao cấp không chỉ làm hài lòng vị giác mà còn tạo nên dấu ấn đặc biệt.',
                rating: 5,
              },
              {
                name: 'Trần Văn Nam',
                role: 'Nhân viên văn phòng',
                avatar: '/images/avatars/tran_van_nam.png',
                text: 'Vị bia Naturtrüb của Benediktiner hương vị đậm đà và tươi mát khiến tôi thấy sảng khoái. Mỗi ngụm bia là sự kết hợp hoàn hảo giữa độ ngọt nhẹ nhàng của lúa mạch và một chút đắng tinh tế.',
                rating: 5,
              },
              {
                name: 'Trần Thu Phương',
                role: 'Sinh viên',
                avatar: '/images/avatars/tran_thu_phuong.png',
                text: 'Vị bia đen Dunkel khiến tôi thích thú ngay từ ngụm đầu tiên. Sự kết hợp hài hòa giữa hương thơm đậm đà của mạch nha rang và chút vị ngọt nhẹ nhàng mang đến trải nghiệm đầy ấn tượng.',
                rating: 5,
              },
              {
                name: 'Lê Hoàng Long',
                role: 'Doanh nhân',
                avatar: '/images/avatars/le_hoang_long.png',
                text: 'Là người sành bia, tôi khá khó tính với chất lượng. Benediktiner Weissbier hoàn toàn chinh phục tôi — vị lúa mì tự nhiên, bọt bia mịn dày, và hậu vị sạch. Đúng chuẩn bia Đức chính hãng.',
                rating: 5,
              },
              {
                name: 'Phạm Thanh Hà',
                role: 'Chủ nhà hàng',
                avatar: '/images/avatars/pham_thanh_ha.png',
                text: 'Từ khi đưa Bia Thầy Tu vào menu, khách hàng phản hồi rất tích cực. Đặc biệt các món hải sản nướng kết hợp với Weissbier tạo nên trải nghiệm ẩm thực hoàn hảo. Doanh thu bia tăng đáng kể.',
                rating: 5,
              },
              {
                name: 'Đỗ Quang Huy',
                role: 'Food Blogger',
                avatar: '/images/avatars/do_quang_huy.png',
                text: 'Mình review nhiều loại bia nhập khẩu nhưng Benediktiner thực sự nổi bật. Bia có màu vàng hổ phách đẹp, mùi thơm trái cây nhẹ nhàng rất dễ uống. Follow mình đi sẽ có nhiều combo pairing hay!',
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="testimonial-card testimonial-item">
                <div className="star-rating">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="testimonial-quote">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    <Image src={t.avatar} alt={t.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════ 
          FAQ — SEO / AEO / AI Overview Section
      ═══════════════════════════════════════════ */}
      <section className="section reveal-on-scroll delay-100" aria-label="Câu hỏi thường gặp" id="faq">
        <div className="container">
          <SectionHeader label="Câu Hỏi Thường Gặp" title="Về Bia Thầy Tu Benediktiner" />

          <div className="faq-list">
            {[
              { q: 'Bia Thầy Tu là bia gì?', a: 'Bia Thầy Tu (Benediktiner Weissbier) là dòng bia lúa mì truyền thống của Đức, được ủ theo phương pháp tu viện từ năm 1609 tại Tu Viện Ettal, Bavaria. Bia được sản xuất theo Luật Tinh Khiết 1516 (Reinheitsgebot), chỉ sử dụng 4 nguyên liệu: nước, malt lúa mì, hoa bia và men bia.' },
              { q: 'Bia Benediktiner Weissbier có vị gì?', a: 'Benediktiner Weissbier Naturtrüb có hương vị đặc trưng gồm trái chuối chín, đinh hương, với lớp bọt trắng mịn dày và hậu vị ngọt dịu. Bia có màu vàng hổ phách tự nhiên, không lọc (Naturtrüb), giữ trọn men sống và hương vị tự nhiên.' },
              { q: 'Mua bia Đức Benediktiner chính hãng ở đâu tại Việt Nam?', a: 'Bia Thầy Tu Benediktiner được nhập khẩu và phân phối độc quyền tại Việt Nam. Đặt mua qua website biathaytu.com, Zalo (091.531.2166), hoặc tại Showroom 218 Đội Cấn, Ba Đình, Hà Nội. Giao hàng toàn quốc.' },
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
        <div className="b2b-bg" style={{ backgroundImage: 'url(/images/hero/lifestyle_garden_v2.png)' }} />
        <div className="b2b-overlay" />

        <div className="container b2b-grid">
          {/* Khách hàng doanh nghiệp */}
          <div className="glass-card-dark">
            <div className="icon-circle icon-circle-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
            </div>
            <h3 className="b2b-card-title">Khách Hàng Doanh Nghiệp</h3>
            <p className="b2b-card-desc">
              Giải pháp bia Đức cao cấp cho nhà hàng, khách sạn và sự kiện. 
              Chính sách chiết khấu sâu, hỗ trợ POSM và nâng tầm thương hiệu.
            </p>
            <ZaloCTA 
              label="Nhận Báo Giá B2B" 
              productName="Khách hàng Doanh nghiệp" 
              className="btn-primary"
            />
          </div>

          {/* Cộng tác viên */}
          <div className="glass-card-light">
            <div className="icon-circle icon-circle-navy">
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
