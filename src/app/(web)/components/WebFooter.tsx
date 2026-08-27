'use client';

import Link from 'next/link';
import AlcoholWarning from './AlcoholWarning';
import styles from './WebFooter.module.css';
import {
  COMPANY_CONFIG,
  getCompanyMailtoHref,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';

const productLinks = [
  { href: '/san-pham/benediktiner-naturtrub-thung-12-chai-500ml', label: 'Benediktiner Weissbier' },
  { href: '/san-pham/benediktiner-dunkel-thung-12-chai-500ml', label: 'Benediktiner Dunkel' },
  { href: '/san-pham/benediktiner-naturtrub-bom-5l', label: 'Bom 5L Benediktiner' },
  { href: '/huong-dan-rot-bia-lua-mi', label: 'Nghệ thuật thưởng thức' },
];

const policyLinks = [
  { href: '/chinh-sach-kiem-soat-do-tuoi', label: 'Kiểm soát độ tuổi' },
  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
  { href: '/chinh-sach-cookie', label: 'Chính sách cookie' },
  { href: '/dieu-khoan-su-dung', label: 'Điều khoản sử dụng' },
];

export default function WebFooter() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
  const zaloUrl = getCompanyZaloUrl();
  const registrationValue = COMPANY_CONFIG.businessRegistrationCertificateNumber === COMPANY_CONFIG.taxCode
    ? COMPANY_CONFIG.taxCode
    : `${COMPANY_CONFIG.taxCode} / ${COMPANY_CONFIG.businessRegistrationCertificateNumber}`;

  const brandBlock = (
    <>
      <h3 className={styles.brandTitle}>BIA THẦY TU</h3>
      <p className={styles.brandDesc}>
        Khám phá Benediktiner tại Việt Nam, câu chuyện Ettal, hương vị bia Đức và nghệ thuật thưởng thức.
      </p>
      <p className={styles.brochureNote}>
        Website giới thiệu sản phẩm, không bán hàng trực tuyến.
      </p>
      <div className={styles.socialRow}>
        {zaloUrl ? (
          <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={`${styles.iconButton} ${styles.primaryAction}`}>
            Zalo
          </a>
        ) : null}
        {telHref ? (
          <a href={telHref} className={styles.iconButton} aria-label={`Gọi ${COMPANY_CONFIG.hotline}`}>
            Gọi điện
          </a>
        ) : null}
        {mailtoHref ? (
          <a href={mailtoHref} className={styles.iconButton} aria-label={`Email ${COMPANY_CONFIG.email}`}>
            Email
          </a>
        ) : null}
      </div>
    </>
  );

  const companyBlock = (
    <div className={styles.companyList}>
      <p className={styles.companyItem}>
        <span className={styles.itemLabel}>Pháp nhân</span>
        {COMPANY_CONFIG.legalName}
      </p>
      <p className={styles.companyItem}>
        <span className={styles.itemLabel}>MST / ĐKKD</span>
        {registrationValue}
      </p>
      <p className={styles.companyItem}>
        <span className={styles.itemLabel}>Trụ sở</span>
        {COMPANY_CONFIG.registeredAddress}
      </p>
      <p className={styles.companyItem}>
        <span className={styles.itemLabel}>Showroom</span>
        {COMPANY_CONFIG.showroomAddress}
      </p>
      <p className={styles.companyItem}>
        <span className={styles.itemLabel}>Đại diện pháp luật</span>
        {COMPANY_CONFIG.legalRepresentative}
      </p>
    </div>
  );

  const quickLinksBlock = (
    <div className={styles.quickGroups}>
      <div>
        <h5 className={styles.quickGroupTitle}>Sản phẩm</h5>
        <div className={styles.linkList}>
          {productLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>
      </div>
      <div>
        <h5 className={styles.quickGroupTitle}>Chính sách</h5>
        <div className={styles.linkList}>
          {policyLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );

  const contactBlock = (
    <>
      <div className={styles.contactList}>
        <p className={styles.contactItem}>
          <span className={styles.itemLabel}>Hotline</span>
          {telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}
        </p>
        <p className={styles.contactItem}>
          <span className={styles.itemLabel}>Email</span>
          {mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}
        </p>
        <p className={styles.contactItem}>
          <span className={styles.itemLabel}>Showroom</span>
          {COMPANY_CONFIG.showroomAddress}
        </p>
      </div>
      <div className={styles.contactActions}>
        {zaloUrl ? (
          <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.primaryAction}`}>
            Chat Zalo
          </a>
        ) : null}
        {telHref ? (
          <a href={telHref} className={styles.actionButton}>
            Gọi ngay
          </a>
        ) : null}
      </div>
    </>
  );

  return (
    <footer className={styles.footer} data-surface="ink">
      <div className="container">
        <div className={styles.desktopFooter}>
          <section aria-label="Giới thiệu Bia Thầy Tu">
            {brandBlock}
          </section>

          <section aria-label="Thông tin doanh nghiệp">
            <h4 className={styles.columnTitle}>Thông tin doanh nghiệp</h4>
            {companyBlock}
          </section>

          <section aria-label="Liên kết nhanh">
            <h4 className={styles.columnTitle}>Liên kết nhanh</h4>
            {quickLinksBlock}
          </section>

          <section aria-label="Liên hệ">
            <h4 className={styles.columnTitle}>Liên hệ</h4>
            {contactBlock}
          </section>
        </div>

        <div className={styles.mobileFooter}>
          <div className={styles.mobileBrand}>{brandBlock}</div>

          <details className={styles.mobileDetails}>
            <summary className={styles.mobileSummary}>Thông tin doanh nghiệp</summary>
            <div className={styles.mobileDetailsContent}>{companyBlock}</div>
          </details>

          <details className={styles.mobileDetails}>
            <summary className={styles.mobileSummary}>Liên kết nhanh</summary>
            <div className={styles.mobileDetailsContent}>{quickLinksBlock}</div>
          </details>

          <details className={styles.mobileDetails}>
            <summary className={styles.mobileSummary}>Liên hệ</summary>
            <div className={styles.mobileDetailsContent}>{contactBlock}</div>
          </details>
        </div>

        <div className={styles.bottomArea}>
          <div className={styles.warningWrap}>
            <AlcoholWarning variant="footer" />
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Bia Thầy Tu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
