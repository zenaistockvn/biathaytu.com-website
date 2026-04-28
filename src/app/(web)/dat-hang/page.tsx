"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
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

  const [discountInput, setDiscountInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  useEffect(() => {
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

  // 2. Promo codes
  const promoCodes: Record<string, { percent?: number, amount?: number }> = {
    'VIP10': { percent: 10 },
    'FREESHIP': { amount: 30000 }
  };

  let promoDiscountAmount = 0;
  if (appliedCode && promoCodes[appliedCode.toUpperCase()]) {
    const promo = promoCodes[appliedCode.toUpperCase()];
    if (promo.percent) {
      promoDiscountAmount = subTotal * (promo.percent / 100);
    } else if (promo.amount) {
      promoDiscountAmount = promo.amount;
    }
  }

  const totalDiscount = autoDiscountAmount + promoDiscountAmount;
  const finalTotal = Math.max(0, subTotal - totalDiscount);

  const handleApplyCode = () => {
    if (!discountInput.trim()) {
      setAppliedCode('');
      return;
    }
    const code = discountInput.trim().toUpperCase();
    if (promoCodes[code]) {
      setAppliedCode(code);
      alert('Áp dụng mã giảm giá thành công!');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
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

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items,
          subTotal,
          totalDiscount,
          autoDiscountAmount,
          promoDiscountAmount,
          appliedCode,
          totalPrice: finalTotal
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi gửi đơn hàng. Vui lòng thử lại.');
      }

      setOrderNumber(data.orderNumber || '');
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // prevent hydration mismatch

  if (success) {
    return (
      <div className="subpage-wrap container" style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h1 className="page-title" style={{ color: 'var(--web-primary)' }}>✅ Đặt Hàng Thành Công!</h1>
        {orderNumber && (
          <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'inline-block' }}>
            Mã đơn hàng: <span style={{ color: 'var(--web-primary)' }}>{orderNumber}</span>
          </div>
        )}
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Cảm ơn bạn đã tin tưởng <strong>Bia Thầy Tu</strong>. Nhân viên của chúng tôi sẽ liên hệ lại qua số điện thoại <strong>{formData.phone}</strong> để xác nhận đơn hàng và tiến hành giao hàng.
        </p>
        <p style={{ marginTop: '20px', fontSize: '16px' }}>
          Hotline hỗ trợ: <strong>091.531.2166</strong>
        </p>
        <Link href="/san-pham" className="btn-primary" style={{ display: 'inline-block', marginTop: '30px', padding: '12px 30px' }}>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '40px' }}>
          {/* Cart Items */}
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Giỏ hàng</h2>
            <div style={{ border: '1px solid var(--web-border)', borderRadius: '12px', padding: '20px', backgroundColor: 'var(--web-card-bg)' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--web-border)' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, backgroundColor: 'white', borderRadius: '8px' }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain', padding: '5px' }} sizes="80px" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 5px 0' }}>{item.name}</h3>
                    <div style={{ color: 'var(--web-primary)', fontWeight: 600 }}>{formatPrice(item.price)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ padding: '5px 10px', border: '1px solid var(--web-border)', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}>-</button>
                    <span style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '5px 10px', border: '1px solid var(--web-border)', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ padding: '5px', color: 'red', border: 'none', background: 'transparent', cursor: 'pointer', marginLeft: '10px' }}>✕</button>
                </div>
              ))}
              
              <div style={{ borderTop: '1px solid var(--web-border)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '10px' }}>
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subTotal)}</span>
                </div>
                
                {autoDiscountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '10px', color: 'green' }}>
                    <span>Giảm 5% (Đơn &gt; 2tr):</span>
                    <span>-{formatPrice(autoDiscountAmount)}</span>
                  </div>
                )}

                {promoDiscountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '10px', color: 'green' }}>
                    <span>Mã giảm giá ({appliedCode}):</span>
                    <span>-{formatPrice(promoDiscountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', paddingTop: '10px', borderTop: '1px dashed var(--web-border)' }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: 'var(--web-primary)' }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Nhập mã giảm giá..." 
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--web-border)', borderRadius: '6px', fontSize: '14px' }}
                />
                <button 
                  onClick={handleApplyCode}
                  type="button"
                  style={{ padding: '10px 20px', backgroundColor: 'var(--web-surface)', border: '1px solid var(--web-border)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Áp dụng
                </button>
              </div>
              {appliedCode && (
                <div style={{ fontSize: '13px', color: 'green', marginTop: '8px' }}>
                  Đã áp dụng mã: <strong>{appliedCode}</strong>.
                  <span onClick={() => {setAppliedCode(''); setDiscountInput('');}} style={{ marginLeft: '10px', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}>Hủy mã</span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Họ và Tên *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--web-border)', borderRadius: '8px', fontSize: '16px' }} placeholder="Nhập họ và tên..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Số điện thoại *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--web-border)', borderRadius: '8px', fontSize: '16px' }} placeholder="Nhập số điện thoại..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email (Tùy chọn)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--web-border)', borderRadius: '8px', fontSize: '16px' }} placeholder="Để nhận thông báo đơn hàng..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Địa chỉ nhận hàng *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--web-border)', borderRadius: '8px', fontSize: '16px' }} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea name="note" value={formData.note} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--web-border)', borderRadius: '8px', minHeight: '100px', fontSize: '16px', fontFamily: 'inherit' }} placeholder="Ghi chú thêm về giao hàng..."></textarea>
              </div>

              {errorMsg && <div style={{ color: 'red', padding: '10px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '8px', lineHeight: '1.5' }}>{errorMsg}</div>}

              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '16px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', borderRadius: '8px' }}>
                {loading ? 'Đang xử lý...' : 'HOÀN TẤT ĐẶT HÀNG'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
