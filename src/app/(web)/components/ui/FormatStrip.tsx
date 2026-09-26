import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';
import { getDisplayProductImage } from '../../utils/productImages';
import { getLineForName } from '@/config/productLines';
import styles from './FormatStrip.module.css';

export interface FormatProduct {
  id: string;
  slug: string;
  name: string;
  images: string[] | null;
  volume: string | null;
  price: number | null;
  category: string | null;
}

/** "Benediktiner Naturtrüb, thùng 12 chai 500ml" -> "Thùng 12 chai 500ml"; "... Bom 5L" -> "Bom 5L". */
export function formatLabel(product: FormatProduct): string {
  const afterComma = product.name.split(',')[1]?.trim();
  const keg = /\bbom\s*5\s*l\b/i.exec(product.name)?.[0];
  const label = afterComma || keg || product.volume || product.name;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Hàng quy cách kiểu "Nos différents formats" của Chimay, lấy từ dữ liệu sản phẩm thật, mỗi ô link tới trang chi tiết.
 * Khi dải gồm SKU của nhiều dòng bia (vd. trang bom 5L), mỗi ô ghi thêm tên dòng để không trùng nhãn (audit L7).
 */
export default function FormatStrip({ products }: { products: FormatProduct[] }) {
  const lineOf = (product: FormatProduct) => getLineForName(product.name);
  const mixedLines = new Set(products.map((product) => lineOf(product)?.id ?? product.id)).size > 1;

  return (
    <ul className={styles.strip}>
      {products.map((product) => {
        const image = getDisplayProductImage({ images: product.images, category: product.category });
        return (
          <li key={product.id}>
            <Link href={`/san-pham/${product.slug}`} className={styles.item}>
              <span className={styles.media}>
                {image ? <Image src={image} alt={product.name} fill sizes="200px" className={`${styles.image} product-image-blend`} /> : null}
              </span>
              {mixedLines ? <span className={styles.line}>{lineOf(product)?.short ?? product.name}</span> : null}
              <span className={styles.label}>{formatLabel(product)}</span>
              {product.price ? <span className={styles.price}>{formatPrice(product.price)}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
