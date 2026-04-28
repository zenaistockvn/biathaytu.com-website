"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="product-img-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', height: '500px' }}>
        <p style={{ color: 'var(--web-text-muted)' }}>Đang cập nhật hình</p>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div className="product-img-box" style={{ position: 'relative', width: '100%', height: '500px', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
        <Image
          src={mainImage}
          alt={productName}
          fill
          style={{ objectFit: 'contain', padding: '20px' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
          {images.map((img, index) => (
            <div 
              key={index} 
              onClick={() => setMainImage(img)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                flexShrink: 0,
                borderRadius: '8px',
                border: mainImage === img ? '2px solid var(--web-primary)' : '1px solid var(--web-border)',
                cursor: 'pointer',
                overflow: 'hidden',
                backgroundColor: '#fff'
              }}
            >
              <Image
                src={img}
                alt={`${productName} - ảnh ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
