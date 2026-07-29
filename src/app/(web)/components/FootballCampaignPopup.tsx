'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AlcoholWarning from './AlcoholWarning';
import { isAgeVerified } from '@/utils/ageVerification';

/** Chiến dịch chỉ hiển thị trong khoảng thời gian này (ISO). Hết hạn → không render. */
const CAMPAIGN_ENDS_AT = '2026-08-31T23:59:59+07:00';

export default function FootballCampaignPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'keg' | 'combo'>('keg');
  const pathname = usePathname();

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('football_campaign_popup_shown', 'true');
  };

  useEffect(() => {
    if (pathname === '/chua-du-tuoi') return;
    if (new Date() > new Date(CAMPAIGN_ENDS_AT)) return;
    if (sessionStorage.getItem('football_campaign_popup_shown')) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      timer = setTimeout(() => setIsOpen(true), 1500);
    };

    if (isAgeVerified()) {
      arm();
      return () => clearTimeout(timer);
    }

    // Chưa xác minh tuổi → chờ tới khi cổng tuổi được vượt qua
    window.addEventListener('ageVerificationPassed', arm, { once: true });
    return () => {
      window.removeEventListener('ageVerificationPassed', arm);
      clearTimeout(timer);
    };
  }, [pathname]);

  // Lock scroll + đóng bằng Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const zaloBaseUrl = 'https://zalo.me/0899191313';
  const msgKeg = 'Chào Bia Thầy Tu, mình muốn đặt mua Thùng 24 lon Bitburger Premium Pils 500ml Football Edition 2026 giá 1.150.000đ. Tư vấn giúp mình nhé.';
  const msgCombo = 'Chào Bia Thầy Tu, mình muốn đặt mua Combo Match Night (2 két Bitburger Football Edition + Tặng xúc xích Đức 500g) giá 2.290.000đ. Tư vấn giúp mình nhé.';

  const linkKeg = `${zaloBaseUrl}?text=${encodeURIComponent(msgKeg)}`;
  const linkCombo = `${zaloBaseUrl}?text=${encodeURIComponent(msgCombo)}`;

  return (
    <div
      className="football-popup-overlay"
      aria-modal="true"
      role="dialog"
      aria-label="Ưu đãi Bitburger Football Edition 2026"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="football-popup-card">
        {/* Close Button */}
        <button 
          className="football-popup-close" 
          onClick={handleClose}
          aria-label="Đóng popup"
        >
          ✕
        </button>

        {/* Campaign Tabs */}
        <div className="football-popup-tabs">
          <button 
            className={`football-popup-tab-btn ${activeTab === 'keg' ? 'active' : ''}`}
            onClick={() => setActiveTab('keg')}
            type="button"
          >
            Thùng 24 Lon (WC 2026)
          </button>
          <button 
            className={`football-popup-tab-btn ${activeTab === 'combo' ? 'active' : ''}`}
            onClick={() => setActiveTab('combo')}
            type="button"
          >
            Combo Match Night
          </button>
        </div>

        {/* Content Body */}
        <div className="football-popup-body">
          {activeTab === 'keg' ? (
            <div className="football-popup-content-wrap">
              <div className="football-popup-image-container">
                <Image 
                  src="/images/products/bitburger_football_edition.jpg"
                  alt="Bitburger Premium Pils 500ml Football Edition 2026 - 1.150.000đ/thùng 24 lon"
                  fill
                  className="football-popup-img"
                  priority
                />
              </div>
              <div className="football-popup-action-wrap">
                <a 
                  href={linkKeg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="football-popup-cta-btn button-gold-pulse"
                >
                  SẴN SÀNG CHO TRẬN TỐI NAY
                </a>
              </div>
            </div>
          ) : (
            <div className="football-popup-content-wrap">
              <div className="football-popup-image-container">
                <Image 
                  src="/images/products/bitburger_combo_match_night.jpg"
                  alt="Combo Match Night - 2 két Bitburger Football Edition + Tặng xúc xích Đức 500g - 2.290.000đ"
                  fill
                  className="football-popup-img"
                  priority
                />
              </div>
              <div className="football-popup-action-wrap">
                <a 
                  href={linkCombo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="football-popup-cta-btn button-navy-glow"
                >
                  HẸN GIỜ GIAO COMBO
                </a>
              </div>
            </div>
          )}

          {/* Compliance Warning occupying >= 10% banner area */}
          <AlcoholWarning variant="banner" style={{ fontSize: '11px', padding: '8px 12px' }} />
        </div>
      </div>
    </div>
  );
}
