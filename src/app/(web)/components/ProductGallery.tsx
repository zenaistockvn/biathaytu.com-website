"use client";

import { useState } from 'react';
import Image from 'next/image';
import { hasWhiteCanvas } from '@/lib/data/productImages';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : '');

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
          className={hasWhiteCanvas(mainImage) ? 'product-image-blend' : undefined}
          style={{ objectFit: 'contain', padding: '20px' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          fetchPriority="high"
        />
      </div>

      {/* Dưới 768px: chấm chỉ báo thay dải ảnh thu nhỏ (audit D3); vẫn là button để dùng bằng bàn phím. */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((img, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setMainImage(img)}
              className={styles.dot}
              aria-pressed={mainImage === img}
              aria-label={`Ảnh ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setMainImage(img)}
              className={styles.thumb}
              aria-pressed={mainImage === img}
              aria-label={`Ảnh ${index + 1}`}
            >
              <Image
                src={img}
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
