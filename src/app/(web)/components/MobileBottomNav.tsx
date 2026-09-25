'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/config/navigation';
import styles from './MobileBottomNav.module.css';

const navItems = [
  {
    ...NAV.home,
    icon: (
      <path d="M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5.2v-6.6H9.2V22H4a1 1 0 0 1-1-1V10.8Z" />
    ),
  },
  {
    ...NAV.products,
    icon: (
      <path d="M5.5 8.2 12 4.5l6.5 3.7v7.6L12 19.5l-6.5-3.7V8.2Zm.7.1 5.8 3.4 5.8-3.4M12 12v7" />
    ),
  },
  {
    ...NAV.knowledge,
    icon: (
      <path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v12.5H7A2 2 0 0 1 5 17.5v-13Zm12 3h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2M8 8h6M8 12h6M8 16h4" />
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
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item}${active ? ` ${styles.active}` : ''}`}
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
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
        aria-label="Liên hệ"
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
