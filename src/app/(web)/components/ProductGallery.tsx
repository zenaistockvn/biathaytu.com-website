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
      <div className="product-img-box product-gallery-main product-gallery-empty">
        <p className="text-muted">Đang cập nhật hình</p>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main Image */}
      <div className="product-img-box product-gallery-main">
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
        <div className="gallery-thumb-list">
          {images.map((img, index) => (
            <div 
              key={index} 
              onClick={() => setMainImage(img)}
              className={`gallery-thumb-item ${mainImage === img ? 'gallery-thumb-active' : 'gallery-thumb-inactive'}`}
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
