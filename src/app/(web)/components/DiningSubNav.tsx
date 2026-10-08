'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/config/navigation';
import styles from './DiningSubNav.module.css';

interface DiningSubNavProps {
  current?: 'restaurant' | 'franchise';
}

export default function DiningSubNav({ current }: DiningSubNavProps) {
  const pathname = usePathname();
  const isRestaurant = current ? current === 'restaurant' : pathname === NAV.restaurant.href;
  const isFranchise = current ? current === 'franchise' : pathname === NAV.franchise.href;

  return (
    <nav className={styles.wrapper} aria-label="Phân hệ nhà hàng và nhượng quyền">
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link
            href={NAV.restaurant.href}
            className={`${styles.link} ${isRestaurant ? styles.active : ''}`}
            aria-current={isRestaurant ? 'page' : undefined}
          >
            Không gian và ẩm thực 26 Vạn Phúc
            <span className={styles.badge}>Cơ sở mẫu</span>
          </Link>
        </li>
        <li className={styles.item}>
          <Link
            href={NAV.franchise.href}
            className={`${styles.link} ${isFranchise ? styles.active : ''}`}
            aria-current={isFranchise ? 'page' : undefined}
          >
            Hợp tác nhượng quyền F&B
            <span className={styles.badge}>Toàn quốc</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
