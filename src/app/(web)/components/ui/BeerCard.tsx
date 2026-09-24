import Image from 'next/image';
import Link from 'next/link';
import styles from './BeerCard.module.css';

interface BeerCardProps {
  href: string;
  image: { src: string; alt: string };
  /** cover: ảnh ngữ cảnh tràn khung. contain: ảnh tách nền đặt trên nền xám, không cắt nhãn. */
  fit?: 'cover' | 'contain';
  name: string;
  /** Loại bia, viết thường như "blonde forte" của Chimay. */
  type: string;
  meta?: string;
}

/** Thẻ bia kiểu danh sách "Nos bières" của Chimay: ảnh, tên in hoa, loại bia, nồng độ. Không viền, không bóng. */
export default function BeerCard({ href, image, fit = 'cover', name, type, meta }: BeerCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <span className={`${styles.media} ${fit === 'contain' ? styles.contain : ''}`}>
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className={styles.image} />
      </span>
      <span className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.type}>{type}</span>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
      </span>
    </Link>
  );
}

export function BeerCardGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
