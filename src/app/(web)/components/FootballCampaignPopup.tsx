'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FootballCampaignPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'keg' | 'combo'>('keg');

  useEffect(() => {
    // Check if the popup was already dismissed in the current session
    const isDismissed = sessionStorage.getItem('football_campaign_popup_shown');
    if (!isDismissed) {
      // Delay showing the popup for 1.5s after load for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('football_campaign_popup_shown', 'true');
  };

  if (!isOpen) return null;

  const zaloBaseUrl = 'https://zalo.me/0899191313';
  const msgKeg = 'Chào Bia Thầy Tu, mình muốn đặt mua Thùng 24 lon Bitburger Premium Pils 500ml Football Edition 2026 giá 1.150.000đ. Tư vấn giúp mình nhé.';
  const msgCombo = 'Chào Bia Thầy Tu, mình muốn đặt mua Combo Match Night (2 két Bitburger Football Edition + Tặng xúc xích Đức 500g) giá 2.290.000đ. Tư vấn giúp mình nhé.';

  const linkKeg = `${zaloBaseUrl}?text=${encodeURIComponent(msgKeg)}`;
  const linkCombo = `${zaloBaseUrl}?text=${encodeURIComponent(msgCombo)}`;

  return (
    <div className="football-popup-overlay" aria-modal="true" role="dialog">
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
        </div>
      </div>
    </div>
  );
}
