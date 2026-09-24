'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/constants/compliance';
import styles from './CookieConsent.module.css';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function getCookieConsentPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    if (!stored) return null;
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getCookieConsentPreferences();
    if (!existing) {
      setIsVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }

    const handleResetCookie = () => {
      const prefs = getCookieConsentPreferences();
      if (prefs) {
        setAnalytics(prefs.analytics);
        setMarketing(prefs.marketing);
      }
      setShowCustomize(true);
      setIsVisible(true);
    };

    window.addEventListener('resetCookieConsent', handleResetCookie);
    return () => window.removeEventListener('resetCookieConsent', handleResetCookie);
  }, []);

  if (!mounted || !isVisible) return null;

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectOptional = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    savePreferences({ essential: true, analytics, marketing });
  };

  return (
    <div className={styles.banner} role="region" aria-label="Cài đặt Cookie và Quyền riêng tư">
      <p className={styles.title}>Cookie và quyền riêng tư</p>

      <p className={styles.text}>
        Website sử dụng Cookie cần thiết để vận hành và Cookie tùy chọn để phân tích lượt truy cập, hỗ trợ tiếp thị. Bạn có thể tự do lựa chọn và tùy chỉnh quyền riêng tư của mình.{' '}
        <Link href="/chinh-sach-cookie">Chính sách Cookie</Link>
      </p>

      {showCustomize && (
        <div className={styles.options}>
          <label className={styles.option}>
            <span>
              <strong>Cookie bắt buộc</strong>
              <span className={styles.hint}>Duy trì xác minh độ tuổi và các chức năng vận hành cốt lõi</span>
            </span>
            <input type="checkbox" checked disabled />
          </label>
          <label className={styles.option}>
            <span>
              <strong>Cookie phân tích</strong>
              <span className={styles.hint}>Giúp cải thiện hiệu năng và trải nghiệm người dùng</span>
            </span>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
          <label className={styles.option}>
            <span>
              <strong>Cookie tiếp thị</strong>
              <span className={styles.hint}>Hỗ trợ đo lường quảng cáo Facebook / TikTok</span>
            </span>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>
      )}

      <div className={styles.actions}>
        {!showCustomize ? (
          <>
            <button type="button" onClick={handleAcceptAll} className="btn-dark btn-sm">Chấp nhận tất cả</button>
            <button type="button" onClick={handleRejectOptional} className="btn-outline btn-sm">Từ chối tùy chọn</button>
            <button type="button" onClick={() => setShowCustomize(true)} className={`btn-link ${styles.customize}`}>Tùy chỉnh</button>
          </>
        ) : (
          <button type="button" onClick={handleSaveCustom} className="btn-dark btn-sm">Lưu lựa chọn của tôi</button>
        )}
      </div>
    </div>
  );
}
