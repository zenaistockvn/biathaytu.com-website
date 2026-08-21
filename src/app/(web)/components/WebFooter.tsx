'use client';

import Link from 'next/link';
import AlcoholWarning from './AlcoholWarning';
import styles from './WebFooter.module.css';
import { BRAND, BRAND_MAILTO_HREF, BRAND_TEL_HREF } from '@/lib/brand';

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
  const registrationValue = BRAND.businessRegistrationCertificateNumber === BRAND.taxCode
    ? BRAND.taxCode
    : `${BRAND.taxCode} / ${BRAND.businessRegistrationCertificateNumber}`;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <section className={styles.brandColumn} aria-label="Giới thiệu Bia Thầy Tu">
            <h3 className={styles.brandTitle}>BIA THẦY TU</h3>
            <p className={styles.brandDesc}>
              Khám phá Benediktiner tại Việt Nam — câu chuyện Ettal, hương vị bia Đức và nghệ thuật thưởng thức.
            </p>
            <p className={styles.exclusivity}>{BRAND.exclusivity}</p>
            <p className={styles.brochureNote}>Website giới thiệu sản phẩm — không bán hàng trực tuyến.</p>
            <div className={styles.socialRow}>
              <a href={BRAND.socialLinks.zalo} target="_blank" rel="noopener noreferrer" className={`${styles.iconButton} ${styles.primaryAction}`}>
                Zalo
              </a>
              <a href={BRAND.socialLinks.fanpage} target="_blank" rel="noopener noreferrer" className={styles.iconButton}>
                Fanpage
              </a>
              <a href={BRAND.socialLinks.messenger} target="_blank" rel="noopener noreferrer" className={styles.iconButton}>
                Messenger
              </a>
            </div>
          </section>

          <section aria-label="Thông tin doanh nghiệp">
            <h4 className={styles.columnTitle}>Thông tin doanh nghiệp</h4>
            <div className={styles.companyList}>
              <p className={styles.companyItem}><span className={styles.itemLabel}>Pháp nhân</span>{BRAND.legalName}</p>
              <p className={styles.companyItem}><span className={styles.itemLabel}>MST / ĐKKD</span>{registrationValue}</p>
              <p className={styles.companyItem}><span className={styles.itemLabel}>Trụ sở</span>{BRAND.registeredAddress}</p>
              <p className={styles.companyItem}><span className={styles.itemLabel}>Showroom</span>{BRAND.showroomAddress}</p>
              <p className={styles.companyItem}><span className={styles.itemLabel}>Đại diện pháp luật</span>{BRAND.legalRepresentative}</p>
            </div>
          </section>

          <section aria-label="Liên kết nhanh">
            <h4 className={styles.columnTitle}>Liên kết nhanh</h4>
            <div className={styles.quickGroups}>
              <div>
                <h5 className={styles.quickGroupTitle}>Sản phẩm</h5>
                <div className={styles.linkList}>
                  {productLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
                </div>
              </div>
              <div>
                <h5 className={styles.quickGroupTitle}>Chính sách</h5>
                <div className={styles.linkList}>
                  {policyLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Liên hệ">
            <h4 className={styles.columnTitle}>Liên hệ tư vấn</h4>
            <div className={styles.contactList}>
              <p className={styles.contactItem}><span className={styles.itemLabel}>Hotline</span><a href={BRAND_TEL_HREF}>{BRAND.hotline}</a></p>
              <p className={styles.contactItem}><span className={styles.itemLabel}>Email</span><a href={BRAND_MAILTO_HREF}>{BRAND.email}</a></p>
              <p className={styles.contactItem}><span className={styles.itemLabel}>Showroom</span>{BRAND.showroomAddress}</p>
            </div>
            <div className={styles.contactActions}>
              <a href={BRAND.socialLinks.zalo} target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.primaryAction}`}>Chat Zalo</a>
              <a href={BRAND_TEL_HREF} className={styles.actionButton}>Gọi ngay</a>
            </div>
          </section>
        </div>

        <div className={styles.bottomArea}>
          <div className={styles.warningWrap}>
            <AlcoholWarning variant="footer" />
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} Bia Thầy Tu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
