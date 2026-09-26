'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import LanguageSwitcher from './LanguageSwitcher';
import { CONTACT_TOGGLE_EVENT } from './MobileBottomNav';
import { COMPANY_CONFIG, getCompanyTelHref, getCompanyZaloUrl } from '@/config/company';
import { NAV, PRODUCT_LINES, isProductsPath } from '@/config/navigation';
import styles from './WebHeader.module.css';

// Trang có section đầu là dải xanh ngay dưới header. Không thêm /san-pham: thanh menu phụ
// nằm giữa header và hero, header trong suốt sẽ thành dải xanh lơ lửng trên nền sáng.
const DARK_HERO_PATHS = new Set([
  '/',
  '/benediktiner-weissbier-naturtrub',
  '/bitburger-premium-pils',
  '/benediktiner-dunkel',
  '/bang-gia-si-dai-ly',
  '/qua-tang-bia-duc',
  '/thuong-hieu',
  '/food-pairing-bia-duc',
  '/ve-chung-toi',
  '/chung-nhan-nhap-khau-chinh-hang',
  '/bom-bia-5l-benediktiner',
  '/bia-benediktiner-chinh-hang',
  '/bia-thay-tu-la-gi',
  '/huong-dan-rot-bia-lua-mi',
  '/bia-duc-cho-nha-hang-khach-san',
]);

function isDarkHeroPath(pathname: string): boolean {
  return (
    DARK_HERO_PATHS.has(pathname) ||
    pathname === '/kien-thuc' ||
    pathname.startsWith('/kien-thuc/')
  );
}

// Menu chính theo ngữ pháp Chimay (Nos bières, Depuis 1850, Recettes...): "Sản phẩm" mở panel,
// các mục nội dung đi sau. Tên route lấy từ NAV.
const CONTENT_LINKS = [NAV.story, NAV.enjoy, NAV.knowledge, NAV.horeca];
const MOBILE_SMALL_LINKS = [NAV.priceList, NAV.gifts, NAV.buyingInfo];
const BENEDIKTINER_LINES = PRODUCT_LINES.filter((line) => line.group === 'benediktiner');
const SELECTED_LINES = PRODUCT_LINES.filter((line) => line.group === 'selected');

const MOBILE_MENU_ID = 'mobile-menu';
const PRODUCTS_PANEL_ID = 'products-panel';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const openContactPanel = () => window.dispatchEvent(new Event(CONTACT_TOGGLE_EVENT));

/**
 * Header hai tầng kiểu chimay.com: huy hiệu lớn treo xuống dưới thanh header, bên phải là
 * hàng tiện ích nhỏ (hotline, liên hệ, ngôn ngữ) và hàng menu chính in hoa.
 * Dưới 1024px: huy hiệu nhỏ, nút menu mở lớp phủ toàn màn hình.
 */
export default function WebHeader() {
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const [productsOpenPath, setProductsOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const productsLinkRef = useRef<HTMLAnchorElement>(null);
  const skipFocusOpen = useRef(false);
  const pathname = usePathname();
  const menuOpen = menuOpenPath === pathname;
  const productsOpen = productsOpenPath === pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [menuOpen]);

  // Menu mobile là hộp thoại: focus vào mục đầu khi mở, Escape để đóng, Tab chạy vòng trong
  // menu và nút menu (trang nền đã khoá cuộn nên không cho focus lọt ra), đóng thì trả focus về nút menu.
  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const toggle = menuButtonRef.current;
    const focusables = () => [
      ...(toggle ? [toggle] : []),
      ...(menu ? Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE)) : []),
    ];
    focusables()[1]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpenPath(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !items.includes(active!))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !items.includes(active!))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      toggle?.focus();
    };
  }, [menuOpen]);

  const headerOnDark = isDarkHeroPath(pathname) && !scrolled && !menuOpen && !productsOpen;
  const zaloUrl = getCompanyZaloUrl();
  const telHref = getCompanyTelHref();
  const isCurrentPath = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const productsActive = isProductsPath(pathname);
  const closeMenu = () => setMenuOpenPath(null);

  // Panel "Sản phẩm": mở khi rê chuột hoặc focus vào mục, đóng khi rời chuột, focus ra ngoài hoặc Escape.
  const openProducts = () => setProductsOpenPath(pathname);
  const closeProducts = () => setProductsOpenPath(null);
  const handleProductsFocus = () => {
    if (skipFocusOpen.current) {
      skipFocusOpen.current = false;
      return;
    }
    openProducts();
  };
  const handleProductsBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeProducts();
  };
  const handleProductsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || !productsOpen) return;
    event.preventDefault();
    closeProducts();
    skipFocusOpen.current = true;
    productsLinkRef.current?.focus();
  };

  return (
    <header
      className={`web-header ${styles.header} ${headerOnDark ? styles.onDark : styles.solid} ${scrolled ? styles.scrolled : ''}`}
      data-surface={headerOnDark ? 'ink' : undefined}
    >
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Bia Thầy Tu, về trang chủ">
          <span className={styles.crest}>
            <Image src="/logo.png" alt="" width={96} height={96} priority sizes="96px" />
          </span>
          <span className={styles.wordmark}>Bia Thầy Tu</span>
        </Link>

        <div className={styles.desktop}>
          <div className={styles.utility}>
            {telHref ? (
              <a href={telHref} className={styles.utilityLink}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                {COMPANY_CONFIG.hotline}
              </a>
            ) : null}
            {/* Mở cùng bảng kênh với nút liên hệ nổi (Zalo, gọi, Messenger, Showroom). */}
            <button type="button" className={styles.utilityBox} data-contact-toggle onClick={openContactPanel}>
              Liên hệ
            </button>
            <LanguageSwitcher />
          </div>

          <nav className={styles.nav} aria-label="Điều hướng chính">
            <div
              className={styles.navItem}
              onMouseEnter={openProducts}
              onMouseLeave={closeProducts}
              onFocus={handleProductsFocus}
              onBlur={handleProductsBlur}
              onKeyDown={handleProductsKeyDown}
            >
              <Link
                ref={productsLinkRef}
                href={NAV.products.href}
                className={styles.navLink}
                aria-current={productsActive ? 'page' : undefined}
                aria-expanded={productsOpen}
                aria-controls={PRODUCTS_PANEL_ID}
              >
                {NAV.products.label}
                <svg className={styles.chevron} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </Link>

              <div id={PRODUCTS_PANEL_ID} className={styles.panel} hidden={!productsOpen}>
                <div className={styles.panelCol}>
                  <p className={styles.panelLabel}>Benediktiner</p>
                  <ul className={styles.panelList}>
                    {BENEDIKTINER_LINES.map((line) => (
                      <li key={line.href}>
                        <Link href={line.href} className={styles.panelLink} onClick={closeProducts} aria-current={pathname === line.href ? 'page' : undefined}>
                          {line.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.panelCol}>
                  <p className={styles.panelLabel}>Bia Đức tuyển chọn</p>
                  <ul className={styles.panelList}>
                    {SELECTED_LINES.map((line) => (
                      <li key={line.href}>
                        <Link href={line.href} className={styles.panelLink} onClick={closeProducts} aria-current={pathname === line.href ? 'page' : undefined}>
                          {line.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={NAV.products.href} className={styles.panelAll} onClick={closeProducts}>
                    Xem tất cả sản phẩm
                  </Link>
                </div>
                <div className={styles.panelImage}>
                  <Image
                    src="/images/brand/benediktiner-official/beer-garden-closeup.jpg"
                    alt=""
                    fill
                    sizes="280px"
                  />
                </div>
              </div>
            </div>

            {CONTENT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.navLink}
                aria-current={isCurrentPath(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`web-nav-mobile-right ${styles.mobileRight}`}>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.hamburger}
            onClick={() => setMenuOpenPath(menuOpen ? null : pathname)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          id={MOBILE_MENU_ID}
          className={styles.mobileMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <nav aria-label="Menu di động">
            <div className={styles.mobileGroup}>
              <Link
                href={NAV.products.href}
                onClick={closeMenu}
                className={`${styles.mobileLink} ${styles.mobileGroupTitle}`}
                aria-current={productsActive ? 'page' : undefined}
              >
                {NAV.products.label}
              </Link>
              <ul className={styles.chips}>
                {PRODUCT_LINES.map((line) => (
                  <li key={line.href}>
                    <Link href={line.href} onClick={closeMenu} className={styles.chip} aria-current={pathname === line.href ? 'page' : undefined}>
                      {line.short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {CONTENT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={styles.mobileLink}
                aria-current={isCurrentPath(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <section className={styles.mobileContact} aria-labelledby="mobile-contact-title">
            <p id="mobile-contact-title" className={styles.mobileContactLabel}>Liên hệ</p>
            <div className={styles.mobileContactActions}>
              {telHref ? (
                <Button href={telHref} variant="primary" className={styles.mobileContactButton}>
                  Gọi hotline
                </Button>
              ) : null}
              {zaloUrl ? (
                <Button href={zaloUrl} variant="outline" className={styles.mobileContactButton} target="_blank" rel="noopener noreferrer">
                  Mở Zalo
                </Button>
              ) : null}
            </div>
            <p className={styles.mobileShowroom}>
              <Link href={NAV.contact.href} onClick={closeMenu}>{NAV.contact.label}</Link>: {COMPANY_CONFIG.showroomAddress}
            </p>
          </section>

          <div className={styles.mobileSmall}>
            {MOBILE_SMALL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}</Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
