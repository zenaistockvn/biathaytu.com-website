import styles from './ProfileScale.module.css';

interface ProfileScaleProps {
  label: string;
  options: readonly string[];
  /** Chỉ số ô được chọn trong options. */
  selected: number;
}

/**
 * Thang ô vuông như "Couleur / Aspect bière / Aspect mousse" trên trang sản phẩm của Chimay:
 * ô được chọn tô xanh đêm. Trình đọc màn hình chỉ nghe một câu "Màu sắc: Hổ phách".
 */
export default function ProfileScale({ label, options, selected }: ProfileScaleProps) {
  return (
    <div className={styles.scale}>
      <p className={styles.label}>
        {label}
        <span className={styles.srOnly}>: {options[selected]}</span>
      </p>
      <ol className={styles.row} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option, i) => (
          <li key={option} className={i === selected ? styles.selected : undefined}>
            <span className={styles.box} />
            <span className={styles.caption}>{option}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
