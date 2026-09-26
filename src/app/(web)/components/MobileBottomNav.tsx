'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, isProductsPath } from '@/config/navigation';
import styles from './MobileBottomNav.module.css';

// Logo đã về trang chủ nên không dành ô cho Trang chủ (audit C4).
const navItems = [
  {
    ...NAV.products,
    isActive: isProductsPath,
    icon: (
      <path d="M5.5 8.2 12 4.5l6.5 3.7v7.6L12 19.5l-6.5-3.7V8.2Zm.7.1 5.8 3.4 5.8-3.4M12 12v7" />
    ),
  },
  {
    ...NAV.knowledge,
    isActive: (pathname: string) => pathname === NAV.knowledge.href || pathname.startsWith(`${NAV.knowledge.href}/`),
    icon: (
      <path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v12.5H7A2 2 0 0 1 5 17.5v-13Zm12 3h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2M8 8h6M8 12h6M8 16h4" />
    ),
  },
  {
    ...NAV.contact,
    isActive: (pathname: string) => pathname === NAV.contact.href,
    icon: (
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    ),
  },
];

/** Sự kiện mở bảng liên hệ của FloatingZaloCTA; trên mobile nút nổi ẩn đi để không đè lên nội dung. */
export const CONTACT_TOGGLE_EVENT = 'biathaytu:toggle-contact';

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Thanh điều hướng nhanh">
      {navItems.map((item) => {
        const active = item.isActive(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item}${active ? ` ${styles.active}` : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className={styles.icon}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                {item.icon}
              </svg>
            </span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        className={styles.item}
        data-contact-toggle
        onClick={() => window.dispatchEvent(new Event(CONTACT_TOGGLE_EVENT))}
      >
        <span className={styles.icon}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8ZM8 10h.01M12 10h.01M16 10h.01" />
          </svg>
        </span>
        <span className={styles.label}>Liên hệ</span>
      </button>
    </nav>
  );
}
