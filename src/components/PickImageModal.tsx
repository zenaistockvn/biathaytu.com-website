'use client';

import { useState } from 'react';
import { IMAGES, CATEGORIES } from '@/app/amc/gallery/galleryData';

interface PickImageModalProps {
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  initialSelected?: string[];
}

export default function PickImageModal({ onClose, onSelect, initialSelected = [] }: PickImageModalProps) {
  const [cat, setCat] = useState('all');
  const [selectedUrls, setSelectedUrls] = useState<string[]>(initialSelected);
  const imgs = cat === 'all' ? IMAGES : IMAGES.filter(i => i.category === cat);

  const toggleSelect = (url: string) => {
    setSelectedUrls(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '1000px', height: '85vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Chọn ảnh từ Gallery</h3>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.5rem 1rem' }}>✕</button>
        </div>
        
        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          {CATEGORIES.map(c => (
            <button 
              key={c.id} 
              className={`chip ${cat === c.id ? '' : 'btn-ghost'}`} 
              style={{ 
                background: cat === c.id ? c.color : 'var(--glass)', 
                color: cat === c.id ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                border: 'none'
              }} 
              onClick={() => setCat(c.id)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        
        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {imgs.map(img => {
            const isSelected = selectedUrls.includes(img.src);
            return (
              <div 
                key={img.id} 
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden', 
                  background: 'var(--glass)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  outline: isSelected ? '3px solid var(--primary)' : '1px solid transparent',
                  outlineOffset: '2px',
                  position: 'relative'
                }} 
                onClick={() => toggleSelect(img.src)}
                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.transform = 'scale(1)')}
              >
                 <img src={img.src} alt={img.name} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block', opacity: isSelected ? 0.9 : 1 }} />
                 <div style={{ padding: '0.75rem', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {img.name}
                 </div>
                 {isSelected && (
                   <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                     ✓
                   </div>
                 )}
              </div>
            );
          })}
          {imgs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Không có ảnh trong danh mục này.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Đã chọn <strong>{selectedUrls.length}</strong> ảnh
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
            <button 
              className="btn btn-primary" 
              disabled={selectedUrls.length === 0}
              onClick={() => {
                onSelect(selectedUrls);
                onClose();
              }}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
