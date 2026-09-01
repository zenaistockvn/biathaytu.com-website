'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'Trang chủ',
    icon: (
      <path d="M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5.2v-6.6H9.2V22H4a1 1 0 0 1-1-1V10.8Z" />
    ),
  },
  {
    href: '/san-pham',
    label: 'Bia Đức',
    icon: (
      <path d="M5.5 8.2 12 4.5l6.5 3.7v7.6L12 19.5l-6.5-3.7V8.2Zm.7.1 5.8 3.4 5.8-3.4M12 12v7" />
    ),
  },
  {
    href: '/kien-thuc',
    label: 'Kiến thức',
    icon: (
      <path d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v12.5H7A2 2 0 0 1 5 17.5v-13Zm12 3h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2M8 8h6M8 12h6M8 16h4" />
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Thanh điều hướng nhanh"
      style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
    >
      {navItems.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className="mobile-bottom-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                {item.icon}
              </svg>
            </span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
