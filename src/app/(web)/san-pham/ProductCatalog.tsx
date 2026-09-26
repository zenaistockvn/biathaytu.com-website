'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard, { type ProductCardProps } from '../components/ProductCard';
import TitleBlock from '../components/ui/TitleBlock';
import { BottleIcon, WeizenGlassIcon } from '../components/ui/LineIcons';
import { PACK_FORMAT_LABEL, type LineGroup, type PackFormat } from '@/config/productLines';
import type { NavItem } from '@/config/navigation';
import styles from './ProductCatalog.module.css';

export interface CatalogLine {
  id: string;
  label: string;
  href: string | null;
  products: (ProductCardProps & { format: PackFormat | null })[];
}

export interface CatalogSection {
  group: LineGroup;
  id: string;
  title: string;
  kicker: string;
  lead: string;
  lines: CatalogLine[];
}

const FILTERS: (PackFormat | 'all')[] = ['all', 'chai', 'lon', 'bom'];

/**
 * Danh mục ba cấp (audit A2, A8): nhóm Benediktiner / Bia Đức tuyển chọn → dòng bia (tên dòng link tới
 * trang dòng bia) → thẻ SKU. Hàng lọc quy cách ẩn thẻ không khớp và ẩn nhóm trống.
 */
export default function ProductCatalog({ sections, kegPage }: { sections: CatalogSection[]; kegPage: NavItem }) {
  const [filter, setFilter] = useState<PackFormat | 'all'>('all');
  const matches = (format: PackFormat | null) => filter === 'all' || format === filter;

  return (
    <>
      <div className={`container ${styles.filterBar}`} role="group" aria-labelledby="format-filter-label">
        <span id="format-filter-label" className={styles.filterLabel}>Quy cách</span>
        <div className={styles.filters}>
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              className={styles.filter}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value === 'all' ? 'Tất cả' : PACK_FORMAT_LABEL[value]}
            </button>
          ))}
        </div>
        {filter === 'bom' ? (
          <Link href={kegPage.href} className={styles.kegLink}>Xem trang {kegPage.label}</Link>
        ) : null}
      </div>

      {sections.map((section) => {
        const lines = section.lines
          .map((line) => ({ ...line, products: line.products.filter((product) => matches(product.format)) }))
          .filter((line) => line.products.length > 0);
        if (lines.length === 0) return null;

        return (
          <section
            key={section.id}
            className={`${styles.section}${section.group === 'selected' ? ` ${styles.alt}` : ''}`}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
          >
            <div className="container">
              <TitleBlock
                id={`${section.id}-title`}
                align="center"
                icon={section.group === 'benediktiner' ? <WeizenGlassIcon size={72} /> : <BottleIcon size={72} />}
                title={section.title}
                kicker={section.kicker}
              />
              <p className={styles.lead}>{section.lead}</p>

              {lines.map((line) => (
                <div key={line.id} className={styles.line} id={line.id}>
                  <h3 className={styles.lineTitle}>
                    {line.href ? <Link href={line.href}>{line.label}</Link> : line.label}
                  </h3>
                  <div className={styles.cards}>
                    {line.products.map((product) => (
                      <ProductCard key={product.id} {...product} variant="compact" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
