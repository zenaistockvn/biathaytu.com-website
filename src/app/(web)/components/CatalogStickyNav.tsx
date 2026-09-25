'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './CatalogStickyNav.module.css';

const categories = [
  { id: 'benediktiner', label: 'Benediktiner' },
  { id: 'bia-duc-khac', label: 'Bia Đức tuyển chọn' },
];

/** Tổng chiều cao header + thanh danh mục, đọc từ token CSS để khớp với scroll-margin-top. */
function stickyOffset(): number {
  const root = document.querySelector('.web-app') ?? document.documentElement;
  const style = getComputedStyle(root);
  const px = (token: string) => parseFloat(style.getPropertyValue(token)) || 0;
  return px('--web-header-h') + px('--web-catalog-nav-h');
}

export default function CatalogStickyNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState('benediktiner');

  useEffect(() => {
    if (pathname !== '/san-pham') return;

    const targets = categories
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: `-${Math.round(stickyOffset())}px 0px -58% 0px`,
        threshold: [0, 0.05, 0.2, 0.5],
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== '/san-pham') return null;

  return (
    <>
      <div className={styles.spacer} aria-hidden="true" />
      <nav className={styles.nav} aria-label="Danh mục sản phẩm">
        <div className={`container ${styles.inner}`}>
          {categories.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${styles.link}${activeId === id ? ` ${styles.active}` : ''}`}
              aria-current={activeId === id ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
