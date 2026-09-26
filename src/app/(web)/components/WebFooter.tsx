'use client';

import Image from 'next/image';
import Link from 'next/link';
import AlcoholWarning from './AlcoholWarning';
import styles from './WebFooter.module.css';
import {
  COMPANY_CONFIG,
  getCompanyMailtoHref,
  getCompanyTelHref,
  getCompanyZaloUrl,
} from '@/config/company';
import { KEG_PAGE, NAV, PRODUCT_LINES } from '@/config/navigation';

// Ba cột điều hướng (audit A7): mỗi cột một loại link, tên lấy từ NAV/PRODUCT_LINES.
const productLinks = [...PRODUCT_LINES, KEG_PAGE];
const learnLinks = [NAV.story, NAV.enjoy, NAV.knowledge, NAV.whatIs, NAV.authentic];
const buyLinks = [NAV.priceList, NAV.gifts, NAV.buyingInfo, NAV.certificate, NAV.contact];

const policyLinks = [
  { href: '/chinh-sach-kiem-soat-do-tuoi', label: 'Kiểm soát độ tuổi' },
  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
  { href: '/chinh-sach-cookie', label: 'Chính sách cookie' },
  { href: '/dieu-khoan-su-dung', label: 'Điều khoản sử dụng' },
  NAV.buyingInfo,
];

const linkColumns = [
  { id: 'footer-products', title: 'Sản phẩm', links: productLinks },
  { id: 'footer-learn', title: 'Tìm hiểu', links: learnLinks },
  { id: 'footer-buy', title: 'Mua hàng', links: buyLinks },
];

/**
 * Footer theo ngữ pháp chimay.com: khối xanh đêm phẳng chia cột và thanh màu cuối trang
 * (Chimay dùng thanh da bò; ở đây là vàng nhãn Benediktiner) chứa link pháp lý.
 * Giữ đủ thông tin doanh nghiệp và cảnh báo đồ uống có cồn theo quy định.
 */
export default function WebFooter() {
  const telHref = getCompanyTelHref();
  const mailtoHref = getCompanyMailtoHref();
  const zaloUrl = getCompanyZaloUrl();
  const registrationValue = COMPANY_CONFIG.businessRegistrationCertificateNumber === COMPANY_CONFIG.taxCode
    ? COMPANY_CONFIG.taxCode
    : `${COMPANY_CONFIG.taxCode} / ${COMPANY_CONFIG.businessRegistrationCertificateNumber}`;

  const companyRows = [
    ['Pháp nhân', COMPANY_CONFIG.legalName],
    ['MST / ĐKKD', registrationValue],
    ['Trụ sở', COMPANY_CONFIG.registeredAddress],
    ['Đại diện pháp luật', COMPANY_CONFIG.legalRepresentative],
  ] as const;

  return (
    <footer className={styles.footer} data-surface="ink">
      <div className={styles.main}>
        <div className={`container ${styles.grid}`}>
          <section className={styles.brand} aria-label="Giới thiệu Bia Thầy Tu">
            <Link href="/" className={styles.brandLink} aria-label="Bia Thầy Tu, về trang chủ">
              <Image src="/logo.png" alt="" width={64} height={64} className={styles.crest} />
              <span className={styles.brandTitle}>Bia Thầy Tu</span>
            </Link>
            <p className={styles.brandDesc}>
              Khám phá Benediktiner tại Việt Nam, câu chuyện Ettal, hương vị bia Đức và nghệ thuật thưởng thức.
            </p>
            <p className={styles.brochureNote}>
              Website giới thiệu sản phẩm, không bán hàng trực tuyến.
            </p>
            <dl className={`${styles.rows} ${styles.contactRows}`}>
              <div>
                <dt>Hotline</dt>
                <dd>{telHref ? <a href={telHref}>{COMPANY_CONFIG.hotline}</a> : COMPANY_CONFIG.hotline}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{mailtoHref ? <a href={mailtoHref}>{COMPANY_CONFIG.email}</a> : COMPANY_CONFIG.email}</dd>
              </div>
              <div>
                <dt>Showroom</dt>
                <dd>{COMPANY_CONFIG.showroomAddress}</dd>
              </div>
            </dl>
            {zaloUrl ? (
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="btn-light btn-sm">
                Mở Zalo
              </a>
            ) : null}
            <a href="https://vangducnhapkhau.com" target="_blank" rel="noopener noreferrer" className={styles.wine}>
              Từ German Taste: khám phá rượu vang Đức
            </a>
          </section>

          {linkColumns.map((column) => (
            <section key={column.id} aria-labelledby={column.id}>
              <h2 id={column.id} className={styles.columnTitle}>{column.title}</h2>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </section>
          ))}

          <section aria-labelledby="footer-company">
            <h2 id="footer-company" className={styles.columnTitle}>Thông tin doanh nghiệp</h2>
            <dl className={`${styles.rows} ${styles.company}`}>
              {companyRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <nav aria-label="Chính sách">
            <ul className={styles.policyList}>
              {policyLinks.map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
          <AlcoholWarning variant="footer" className={styles.warning} />
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Bia Thầy Tu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
