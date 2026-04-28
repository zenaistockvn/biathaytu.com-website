'use client';

import { useState } from 'react';
import { IMAGES, CATEGORIES } from './galleryData';
import type { ImageItem } from './galleryData';

export default function GalleryClient() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<ImageItem | null>(null);

  const filtered = filter === 'all' ? IMAGES : IMAGES.filter(img => img.category === filter);
  const currentCat = CATEGORIES.find(c => c.id === filter);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div className="mb-lg">
        <h1 className="font-bold" style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
          📸 Image Gallery
        </h1>
        <p className="text-sm text-muted">
          {IMAGES.length} ảnh sản phẩm — Nano Banana v2 × Official Pack Shots
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-sm mb-lg flex-wrap" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`cat-chip ${filter === cat.id ? 'active' : ''}`}
            style={filter === cat.id ? { border: `1px solid ${cat.color}`, background: `${cat.color}18`, color: cat.color } : {}}
          >
            <span>{cat.icon}</span> {cat.label}
            {cat.id !== 'all' && (
              <span
                className="cat-chip-count"
                style={{ background: filter === cat.id ? `${cat.color}30` : 'var(--bg)' }}
              >
                {IMAGES.filter(i => i.category === cat.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex justify-between items-center mb-md text-sm text-muted">
        <span>
          {currentCat?.icon} {currentCat?.label} — <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> ảnh
        </span>
        <span className="text-xs" style={{ opacity: 0.6 }}>Click ảnh để xem lớn</span>
      </div>

      {/* Image Grid */}
      <div className="grid-auto-fill" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(img => {
          const cat = CATEGORIES.find(c => c.id === img.category);
          return (
            <div key={img.id} onClick={() => setLightbox(img)} className="card gallery-card">
              <div className="gallery-card-image">
                <img src={img.src} alt={img.name} />
              </div>
              <div className="gallery-card-info">
                <div className="flex justify-between items-center mb-sm">
                  <span className="font-bold" style={{ fontSize: '0.88rem' }}>{img.name}</span>
                  <span
                    className="chip-sm"
                    style={{ background: `${cat?.color}18`, color: cat?.color }}
                  >
                    {cat?.label}
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-2" style={{ margin: 0 }}>
                  {img.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '900px', width: '100%',
              borderRadius: 'var(--radius)', overflow: 'hidden',
              background: 'var(--card)', cursor: 'default',
              boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
            }}
          >
            <img src={lightbox.src} alt={lightbox.name} style={{ width: '100%', display: 'block' }} />
            <div style={{ padding: '1.25rem' }}>
              <div className="flex justify-between items-center mb-sm">
                <h3 className="font-bold" style={{ fontSize: '1.1rem', margin: 0 }}>{lightbox.name}</h3>
                <div className="flex gap-sm">
                  <span className="badge badge-primary">{lightbox.product}</span>
                  <span className="badge badge-info">{CATEGORIES.find(c => c.id === lightbox.category)?.label}</span>
                </div>
              </div>
              <p className="text-sm text-muted" style={{ margin: '0 0 1rem', lineHeight: 1.6 }}>
                {lightbox.description}
              </p>
              <div className="flex gap-sm">
                <a
                  href={lightbox.src}
                  download={`biathaytu_${lightbox.id}.png`}
                  onClick={(e) => e.stopPropagation()}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                >
                  ⬇️ Download
                </a>
                <button onClick={() => setLightbox(null)} className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
                  ✕ Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
