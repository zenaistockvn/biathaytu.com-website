'use client';

interface LightboxProps {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
        <img src={src} alt="Preview" className="lightbox-img" />
        <div className="lightbox-actions">
          <a
            href={src}
            download
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            ⬇️ Tải ảnh về máy
          </a>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ fontSize: '0.85rem' }}
          >
            ✕ Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
