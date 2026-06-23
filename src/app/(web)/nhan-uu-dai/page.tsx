'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import JsonLd, { getArticleSchema, getBreadcrumbSchema } from '../components/JsonLd';

export default function Page() {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    beerPreference: 'Combo Thử Vị Tất Cả',
    address: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const priceRange = { lowPrice: 1150000, highPrice: 2290000 };

  const zaloBaseUrl = 'https://zalo.me/0899191313';
  const msgZalo = `Chào Bia Thầy Tu, mình muốn nhận Voucher giảm giá 100k và Ly thủy tinh Bavaria để thử vị bia Đức nhập khẩu. Tư vấn giúp mình nhé.`;
  const linkZalo = `${zaloBaseUrl}?text=${encodeURIComponent(msgZalo)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullname || !formData.phone) {
      alert('Vui lòng điền đầy đủ Họ tên và Số điện thoại!');
      return;
    }
    setLoading(true);
    // Giả lập gửi API thu lead
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="uudai-landing">
      {/* Tích hợp SEO JSON-LD dạng Client Component (Truyền thủ công dữ liệu) */}
      <JsonLd type="article" data={getArticleSchema({ title: 'Nhận Ưu Đãi Độc Quyền Thử Vị Bia Đức', slug: 'nhan-uu-dai', url: 'https://www.biathaytu.com/nhan-uu-dai', description: 'Đăng ký nhận Voucher giảm giá 100k và ly thủy tinh Bavaria chính hãng khi trải nghiệm các dòng bia Đức nhập khẩu.', datePublished: '2026-06-19', dateModified: '2026-06-19' })} />
      <JsonLd type="breadcrumb" data={getBreadcrumbSchema([{ name: 'Trang Chủ', url: 'https://www.biathaytu.com' }, { name: 'Nhận Ưu Đãi', url: 'https://www.biathaytu.com/nhan-uu-dai' }])} />

      {/* Hero Section */}
      <section className="uudai-hero">
        <div className="container" style={{ padding: '0 20px' }}>
          <span className="uudai-hero-badge">Ưu Đãi Trải Nghiệm Mùa Hè 2026</span>
          <h1 className="uudai-hero-title">
            Thưởng Vị Bia Đức <span>Nhận Quà Độc Quyền</span>
          </h1>
          <p className="uudai-hero-desc">
            Đăng ký ngay hôm nay để nhận gói voucher trải nghiệm giảm trực tiếp <strong>100.000đ</strong> cho đơn hàng đầu tiên, tặng kèm ly thủy tinh Bavaria thon dài cao cấp trị giá <strong>150.000đ</strong>.
          </p>
          <a 
            href="#register-form" 
            className="football-popup-cta-btn button-gold-pulse"
            style={{ display: 'inline-block', textDecoration: 'none', minWidth: '220px' }}
          >
            ĐĂNG KÝ NHẬN QUÀ NGAY
          </a>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="bento-section">
        <div className="container" style={{ padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)' }}>
              Tại Sao Bạn Không Nên Bỏ Lỡ?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', marginTop: '8px' }}>
              Những đặc quyền trải nghiệm chỉ dành riêng cho khách hàng đăng ký trực tuyến tuần này
            </p>
          </div>

          <div className="bento-grid">
            {/* Box 1: Hộp quà trải nghiệm (2 cột) */}
            <div className="bento-card col-2">
              <div>
                <span className="bitburger-tag" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>Đặc Quyền Khách Hàng</span>
                <h3 className="bento-title">Hộp Quà Trải Nghiệm <span>Voucher 100K + Ly Bavarian</span></h3>
                <p className="bento-desc">
                  Nhận ngay voucher giảm giá trực tiếp 100.000đ áp dụng cho các dòng bia lon hoặc chai. Đặc biệt, tặng thêm 01 ly thủy tinh Bavaria thon dài cao cấp - thiết kế chuyên dụng giúp giữ lớp bọt bia dày mịn và hương thơm lâu hơn gấp 2 lần.
                </p>
              </div>
              <span className="bento-meta">Quà tặng giới hạn cho 200 lượt đăng ký đầu tiên trong tuần</span>
            </div>

            {/* Box 2: Hình ảnh quà tặng ly (1 cột, 2 dòng) */}
            <div className="bento-card col-1 row-2" style={{ background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, rgba(7, 11, 18, 0.8) 100%)' }}>
              <div>
                <span className="bitburger-tag">Quà Tặng Kèm</span>
                <h3 className="bento-title" style={{ fontSize: '20px' }}>Ly Thủy Tinh Cao Cấp</h3>
                <p className="bento-desc" style={{ fontSize: '13px' }}>
                  Ly bia nhập khẩu thon dài thanh lịch, đế dày nặng đầm tay, giúp tôn vinh sắc hổ phách đục mờ của dòng bia lúa mì hoặc sắc vàng rơm lấp lánh của Pilsner.
                </p>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '160px', marginTop: '16px' }}>
                <Image 
                  src="/images/products/official/benediktiner/bottle_removebg.png" 
                  alt="Chai bia và ly thủy tinh" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Box 3: Giao hàng hỏa tốc 2h (1 cột) */}
            <div className="bento-card col-1">
              <div>
                <span className="bitburger-tag">Vận Chuyển Hỏa Tốc</span>
                <h3 className="bento-title" style={{ fontSize: '20px' }}>Giao Lạnh 2h</h3>
                <p className="bento-desc" style={{ fontSize: '13px', marginBottom: 0 }}>
                  Bia được bảo quản mát trong kho nhiệt độ tiêu chuẩn và giao hỏa tốc ướp lạnh sẵn tận nơi trong 2 giờ nội thành. Mở nắp là thưởng thức được ngay chuẩn vị mát lạnh.
                </p>
              </div>
            </div>

            {/* Box 4: Luật tinh khiết 1516 (1 cột) */}
            <div className="bento-card col-1">
              <div>
                <span className="bitburger-tag">Chất Lượng Đức</span>
                <h3 className="bento-title" style={{ fontSize: '20px' }}>Luật Tinh Khiết 1516</h3>
                <p className="bento-desc" style={{ fontSize: '13px', marginBottom: 0 }}>
                  100% các sản phẩm bia Đức phân phối tại hệ thống đều nấu theo Luật Tinh Khiết nghiêm ngặt: chỉ sử dụng nước suối mềm, lúa mạch, hoa bia vùng Hallertau và men bia độc quyền.
                </p>
              </div>
            </div>

            {/* Box 5: 3 Vị bia trứ danh (3 cột) */}
            <div className="bento-card col-3">
              <div>
                <span className="bitburger-tag">Danh Mục Thử Vị</span>
                <h3 className="bento-title">Bộ Ba Vị Bia Đức Khuyên Dùng</h3>
                <p className="bento-desc">
                  Trải nghiệm đầy đủ các sắc thái hương vị: **Benediktiner Weissbier** lúa mì vàng ngọt dịu hương chuối chín; **Benediktiner Dunkel** lúa mì đen đậm đà lôi cuốn vị caramel nướng; và **Bitburger Premium Pils** bia vàng đắng thanh sảng khoái tột độ.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#d4af37', display: 'block', marginBottom: '4px' }}>1. Weissbier Vàng Mượt</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Men sống không lọc, bọt tuyết dày mịn, nồng độ cồn 5.4% ABV.</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#d4af37', display: 'block', marginBottom: '4px' }}>2. Dunkel Đen Caramel</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Mạch nha lúa mì rang sẫm, ngọt dịu ấm áp, nồng độ cồn 5.4% ABV.</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ color: '#d4af37', display: 'block', marginBottom: '4px' }}>3. Bitburger Đắng Thanh</strong>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Dòng pilsner số 1 Đức, giòn trong suốt, nồng độ cồn 4.8% ABV.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="form-section" id="register-form">
        <div className="container" style={{ padding: '0 20px' }}>
          <div className="glass-form-card">
            {!isSubmitted ? (
              <>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-serif)', textAlign: 'center', marginBottom: '12px' }}>
                  Đăng Ký Nhận Ưu Đãi
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
                  Để lại thông tin dưới đây. Nhân viên chăm sóc khách hàng của Bia Thầy Tu sẽ liên hệ tư vấn gửi quà tặng và giao hàng thử vị nhanh chóng.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Họ và Tên Khách Hàng</label>
                    <input 
                      type="text" 
                      name="fullname" 
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Nguyễn Văn A" 
                      className="form-input" 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số Điện Thoại Nhận Quà</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại Zalo của bạn" 
                      className="form-input" 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vị Bia Bạn Muốn Thử Nghiệm</label>
                    <select 
                      name="beerPreference" 
                      value={formData.beerPreference}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Combo Thử Vị Tất Cả">Combo Thử Vị Tất Cả (Weissbier + Dunkel + Bitburger)</option>
                      <option value="Bia Lúa Mì Benediktiner">Bia lúa mì Benediktiner (Ngọt dịu, thơm chuối)</option>
                      <option value="Bia Pilsner Bitburger">Bia Pilsner Bitburger (Đắng thanh, giòn sảng khoái)</option>
                      <option value="Bia Đen Benediktiner">Bia đen Benediktiner Dunkel (Caramel rang)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Khu Vực Nhận Hàng (Tỉnh/Thành phố)</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Tây Hồ, Hà Nội" 
                      className="form-input" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="football-popup-cta-btn button-gold-pulse"
                    style={{ width: '100%', padding: '16px', border: 'none', display: 'block', fontSize: '16px' }}
                    disabled={loading}
                  >
                    {loading ? 'ĐANG GỬI ĐĂNG KÝ...' : 'ĐĂNG KÝ NHẬN VOUCHER & LY QUÀ TẶNG'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)', display: 'block', marginBottom: '8px' }}>HOẶC LIÊN HỆ ĐẶT HÀNG TRỰC TIẾP QUA ZALO</span>
                  <a 
                    href={linkZalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="football-popup-cta-btn button-navy-glow"
                    style={{ display: 'inline-block', minWidth: '240px', textDecoration: 'none', fontSize: '14px' }}
                  >
                    CHAT TRỰC TIẾP VỚI HOTLINE
                  </a>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px' }}>🎉</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--web-gold)', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
                  Đăng Ký Thành Công!
                </h3>
                <p style={{ color: '#ffffff', fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
                  Cảm ơn <strong>{formData.fullname}</strong> đã đăng ký trải nghiệm. Mã Voucher ưu đãi của bạn là:
                </p>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', border: '2px dashed #d4af37', padding: '16px 24px', borderRadius: '12px', display: 'inline-block', marginBottom: '32px' }}>
                  <strong style={{ fontSize: '24px', color: '#d4af37', letterSpacing: '2px' }}>DUC2026</strong>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
                  Nhân viên chăm sóc khách hàng sẽ liên hệ với bạn qua số điện thoại <strong>{formData.phone}</strong> trong vòng 15 phút để xác nhận địa chỉ và gửi tặng ly thủy tinh cùng bia ướp lạnh.
                </p>
                <a 
                  href={`${zaloBaseUrl}?text=${encodeURIComponent(`Chào Bia Thầy Tu, mình vừa đăng ký nhận voucher thành công cho số điện thoại ${formData.phone}. Tư vấn gửi hàng cho mình nhé.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="football-popup-cta-btn button-gold-pulse"
                  style={{ display: 'inline-block', textDecoration: 'none', padding: '14px 28px' }}
                >
                  XÁC NHẬN QUA ZALO NGAY
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Summary / GEO Section */}
      <section className="uudai-ai-section">
        <div className="container" style={{ maxWidth: '780px', padding: '0 20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--web-gold)', marginBottom: '20px', fontFamily: 'var(--font-serif)', textAlign: 'center' }}>
            Thông Tin Nhanh Để Trích Dẫn Tìm Kiếm (AI Summary)
          </h2>
          <div className="uudai-ai-card">
            <p><strong>Chương trình ưu đãi thử vị bia Đức nhập khẩu:</strong> Khách hàng cá nhân khi đăng ký trực tuyến tại biathaytu.com/nhan-uu-dai sẽ nhận gói voucher trị giá 100.000đ áp dụng trực tiếp cho đơn hàng đầu tiên và quà tặng 01 ly thủy tinh Bavaria chính hãng.</p>
            <p style={{ marginTop: '8px' }}><strong>Dòng sản phẩm áp dụng:</strong> Bia lúa mì vàng Benediktiner Weissbier Naturtrüb, bia lúa mì đen Benediktiner Dunkel và bia Pilsner đắng thanh Bitburger Premium Pils. Bia được vận chuyển mát hỏa tốc trong 2 giờ nội thành.</p>
            <p style={{ marginTop: '8px' }}><strong>Đơn vị phân phối chính ngạch:</strong> Hệ thống Bia Thầy Tu (Hotline Zalo tư vấn giao hàng: 0899.191.313 - Cửa hàng giới thiệu sản phẩm: 659A Lạc Long Quân, Tây Hồ, Hà Nội).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
