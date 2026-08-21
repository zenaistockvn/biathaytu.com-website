'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const categories = [
  { id: 'tat-ca', label: 'Tất cả' },
  { id: 'benediktiner', label: 'Benediktiner' },
  { id: 'bitburger', label: 'Bitburger' },
  { id: 'combo', label: 'Combo' },
  { id: 'ruou-vang', label: 'Rượu vang Đức' },
  { id: 'xuc-xich-duc', label: 'Xúc xích' },
  { id: 'phu-kien', label: 'Phụ kiện' },
];

export default function CatalogStickyNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState('tat-ca');

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
        rootMargin: '-145px 0px -58% 0px',
        threshold: [0, 0.05, 0.2, 0.5],
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== '/san-pham') return null;

  return (
    <>
      <div className="catalog-sticky-spacer" aria-hidden="true" />
      <nav className="catalog-sticky-nav" aria-label="Danh mục sản phẩm">
        <div className="container catalog-sticky-inner">
          {categories.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`catalog-sticky-link${activeId === id ? ' is-active' : ''}`}
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
