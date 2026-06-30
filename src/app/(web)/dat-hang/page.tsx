"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { useToastStore } from '@/stores/useToastStore';
import { formatPrice } from '@/utils/formatPrice';

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const showToast = useToastStore((state) => state.show);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });

  // [S3 FIX] Promo code state — validated server-side only
  const [discountInput, setDiscountInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [promoLabel, setPromoLabel] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- DISCOUNT LOGIC ---
  const subTotal = getTotalPrice();
  
  // 1. Auto discount 5% for orders >= 2,000,000
  let autoDiscountAmount = 0;
  if (subTotal >= 2000000) {
    autoDiscountAmount = subTotal * 0.05;
  }

  // 2. Promo discount (amount from server validation)
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);

  const totalDiscount = autoDiscountAmount + promoDiscountAmount;
  const finalTotal = Math.max(0, subTotal - totalDiscount);

  // [S3 FIX] Validate promo code via server API — no client-side exposure
  const handleApplyCode = async () => {
    if (!discountInput.trim()) {
      setAppliedCode('');
      setPromoDiscountAmount(0);
      setPromoLabel('');
      return;
    }
    
    setPromoLoading(true);
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput, subTotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCode(data.code);
        setPromoDiscountAmount(data.discountAmount);
        setPromoLabel(data.label);
        showToast(`✓ ${data.label}`);
      } else {
        showToast(data.message || 'Mã giảm giá không hợp lệ');
      }
    } catch {
      showToast('Lỗi khi kiểm tra mã giảm giá');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleClearPromo = () => {
    setAppliedCode('');
    setDiscountInput('');
    setPromoDiscountAmount(0);
    setPromoLabel('');
  };

  const getZaloMessage = (orderId?: string) => {
    const itemsText = items.map(item => `- ${item.quantity}x ${item.name} (${formatPrice(item.price)})`).join('\n');
    const discountText = totalDiscount > 0 ? `\n- Giảm giá: -${formatPrice(totalDiscount)}` : '';
    const promoText = appliedCode ? ` (Mã: ${appliedCode})` : '';
    
    return `Chào Bia Thầy Tu, tôi muốn đặt hàng online${orderId ? ` (Mã đơn: ${orderId})` : ''}:\n---\nSản phẩm:\n${itemsText}\n---\n- Tạm tính: ${formatPrice(subTotal)}${discountText}${promoText}\n- Tổng cộng: ${formatPrice(finalTotal)}\n\nThông tin giao hàng:\n- Họ tên: ${formData.name}\n- SĐT: ${formData.phone}\n- Địa chỉ: ${formData.address}${formData.note ? `\n- Ghi chú: ${formData.note}` : ''}\n\nTư vấn và xác nhận đơn hàng giúp tôi nhé!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Client-side validation
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg('Số điện thoại không hợp lệ. Vui lòng nhập 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.');
      return;
    }
    if (formData.name.trim().length < 2) {
      setErrorMsg('Vui lòng nhập họ tên đầy đủ (ít nhất 2 ký tự).');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');

    // Sao chép trước thông tin đơn hàng vào clipboard
    try {
      const msg = getZaloMessage();
      await navigator.clipboard.writeText(msg);
    } catch (err) {
      // Bỏ qua nếu trình duyệt không hỗ trợ hoặc chặn clipboard
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items,
          appliedCode,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi gửi đơn hàng. Vui lòng thử lại.');
      }

      setOrderNumber(data.orderNumber || '');
      setSuccess(true);
      clearCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // prevent hydration mismatch

  if (success) {
    const zaloMsg = getZaloMessage(orderNumber);
    const zaloLink = `https://zalo.me/0899191313?text=${encodeURIComponent(zaloMsg)}`;

    return (
      <div className="subpage-wrap container" style={{ textAlign: 'center', padding: '80px 20px', minHeight: '60vh' }}>
        <h1 className="page-title" style={{ color: 'var(--web-primary)' }}>✅ Đặt Hàng Thành Công!</h1>
        {orderNumber && (
          <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'inline-block' }}>
            Mã đơn hàng: <span style={{ color: 'var(--web-primary)' }}>{orderNumber}</span>
          </div>
        )}
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', marginBottom: '24px' }}>
          Cảm ơn bạn đã tin tưởng <strong>Bia Thầy Tu</strong>. Nhân viên của chúng tôi sẽ liên hệ lại qua số điện thoại <strong>{formData.phone}</strong> để xác nhận đơn hàng và tiến hành giao hàng.
        </p>

        {/* Thêm nút chuyển tiếp Zalo & Messenger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', margin: '30px 0' }}>
          <a 
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="football-popup-cta-btn button-gold-pulse"
            style={{ 
              display: 'inline-block', 
              padding: '14px 35px', 
              textDecoration: 'none', 
              color: '#070b12', 
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '9999px',
              minWidth: '320px',
              textAlign: 'center'
            }}
            onClick={() => {
              try {
                navigator.clipboard.writeText(zaloMsg);
                showToast('Đã copy thông tin đơn hàng!');
              } catch (e) {}
            }}
          >
            💬 GỬI ĐƠN QUA ZALO XÁC NHẬN NGAY
          </a>

          <a 
            href={items.some(item => item.name?.toLowerCase().includes('bitburger')) ? "https://m.me/1042222495647480" : "https://m.me/1106668052525470"}
            target="_blank"
            rel="noopener noreferrer"
            className="football-popup-cta-btn"
            style={{ 
              display: 'inline-block', 
              padding: '14px 35px', 
              textDecoration: 'none', 
              color: '#ffffff', 
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '9999px',
              background: '#0084FF',
              border: 'none',
              minWidth: '320px',
              textAlign: 'center'
            }}
            onClick={() => {
              try {
                navigator.clipboard.writeText(zaloMsg);
                showToast('Đã copy thông tin đơn hàng!');
              } catch (e) {}
            }}
          >
            📘 GỬI ĐƠN QUA MESSENGER FACEBOOK
          </a>
          
          <span style={{ display: 'block', fontSize: '13px', color: 'gray', marginTop: '4px' }}>
            (Hệ thống tự động sao chép thông tin đơn hàng, bạn chỉ cần Dán (Ctrl+V) vào khung chat và gửi)
          </span>
        </div>

        <p style={{ marginTop: '20px', fontSize: '16px' }}>
          Hotline hỗ trợ: <strong>0899.191.313</strong>
        </p>
        <Link href="/san-pham" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 30px' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="subpage-wrap container" style={{ paddingBottom: '100px' }}>
      <div className="section-header-center">
        <span className="section-label">Thanh Toán</span>
        <h1 className="page-title">Thông Tin Đơn Hàng</h1>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>Giỏ hàng của bạn đang trống.</p>
          <Link href="/san-pham" className="btn-primary" style={{ padding: '12px 30px' }}>
            Xem sản phẩm
          </Link>
        </div>
      ) : (
        <div className="checkout-container">
          {/* Cart Items */}
          <div className="checkout-column-cart">
            <h2 className="checkout-section-title">Giỏ hàng</h2>
            <div className="checkout-card">
              {items.map(item => (
                <div key={item.id} className="checkout-item-row">
                  <div className="checkout-item-image">
                    <Image src={item.image} alt={item.name} fill sizes="80px" />
                  </div>
                  <div className="checkout-item-info">
                    <h3>{item.name}</h3>
                    <div className="price">{formatPrice(item.price)}</div>
                  </div>
                  <div className="checkout-qty-controls">
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                      className="checkout-qty-btn"
                    >
                      -
                    </button>
                    <span className="checkout-qty-val">{item.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="checkout-qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    type="button" 
                    className="checkout-remove-btn" 
                    onClick={() => removeItem(item.id)}
                    aria-label="Xóa sản phẩm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <div className="checkout-summary-block">
                <div className="checkout-summary-line">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subTotal)}</span>
                </div>
                
                {autoDiscountAmount > 0 && (
                  <div className="checkout-summary-line checkout-summary-line--discount">
                    <span>Giảm 5% (Đơn &gt; 2tr):</span>
                    <span>-{formatPrice(autoDiscountAmount)}</span>
                  </div>
                )}

                {promoDiscountAmount > 0 && (
                  <div className="checkout-summary-line checkout-summary-line--discount">
                    <span>{promoLabel || `Mã giảm giá (${appliedCode})`}:</span>
                    <span>-{formatPrice(promoDiscountAmount)}</span>
                  </div>
                )}

                <div className="checkout-summary-line checkout-summary-line--total">
                  <span>Tổng cộng:</span>
                  <span className="price">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="checkout-promo-row">
                <input 
                  type="text" 
                  placeholder="Nhập mã giảm giá..." 
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                />
                <button 
                  onClick={handleApplyCode}
                  type="button"
                  disabled={promoLoading}
                >
                  {promoLoading ? '...' : 'Áp dụng'}
                </button>
              </div>
              {appliedCode && (
                <div className="checkout-promo-active">
                  Đã áp dụng: <strong>{promoLabel || appliedCode}</strong>.
                  <span className="clear" onClick={handleClearPromo}>Hủy mã</span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="checkout-column-form">
            <h2 className="checkout-section-title">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="checkout-field">
                <label className="checkout-label">Họ và Tên *</label>
                <input 
                  required 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="checkout-input-text" 
                  placeholder="Nhập họ và tên..." 
                />
              </div>
              <div className="checkout-field">
                <label className="checkout-label">Số điện thoại *</label>
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="checkout-input-text" 
                  placeholder="Nhập số điện thoại..." 
                />
              </div>
              <div className="checkout-field">
                <label className="checkout-label">Email (Tùy chọn)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="checkout-input-text" 
                  placeholder="Để nhận thông báo đơn hàng..." 
                />
              </div>
              <div className="checkout-field">
                <label className="checkout-label">Địa chỉ nhận hàng *</label>
                <input 
                  required 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="checkout-input-text" 
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..." 
                />
              </div>
              <div className="checkout-field">
                <label className="checkout-label">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea 
                  name="note" 
                  value={formData.note} 
                  onChange={handleChange} 
                  className="checkout-textarea" 
                  placeholder="Ghi chú thêm về giao hàng..."
                ></textarea>
              </div>

              {errorMsg && (
                <div style={{ marginBottom: '20px' }}>
                  <div className="checkout-error-alert">{errorMsg}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    <a 
                      href={`https://zalo.me/0899191313?text=${encodeURIComponent(getZaloMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="football-popup-cta-btn button-navy-glow"
                      style={{ 
                        display: 'block', 
                        textDecoration: 'none', 
                        textAlign: 'center', 
                        padding: '14px', 
                        fontSize: '15px', 
                        color: '#ffffff', 
                        fontWeight: 'bold',
                        borderRadius: '8px'
                      }}
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(getZaloMessage());
                          showToast('Đã copy thông tin đơn hàng!');
                        } catch (e) {}
                      }}
                    >
                      💬 GỬI ĐƠN QUA ZALO CHO HOTLINE
                    </a>

                    <a 
                      href={items.some(item => item.name?.toLowerCase().includes('bitburger')) ? "https://m.me/1042222495647480" : "https://m.me/1106668052525470"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="football-popup-cta-btn"
                      style={{ 
                        display: 'block', 
                        textDecoration: 'none', 
                        textAlign: 'center', 
                        padding: '14px', 
                        fontSize: '15px', 
                        color: '#ffffff', 
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        background: '#0084FF',
                        border: 'none'
                      }}
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(getZaloMessage());
                          showToast('Đã copy thông tin đơn hàng!');
                        } catch (e) {}
                      }}
                    >
                      📘 GỬI ĐƠN QUA MESSENGER FACEBOOK
                    </a>
                  </div>
                  <span style={{ display: 'block', fontSize: '12px', color: 'gray', marginTop: '6px', textAlign: 'center' }}>
                    (Hệ thống tự động sao chép chi tiết đơn hàng, bạn chỉ cần Dán (Ctrl+V) và gửi)
                  </span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary checkout-submit-btn"
              >
                {loading ? 'Đang xử lý...' : 'HOÀN TẤT ĐẶT HÀNG'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
