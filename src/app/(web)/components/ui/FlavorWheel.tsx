import styles from './FlavorWheel.module.css';

export interface FlavorAxis {
  label: string;
  /** 0 đến 5 */
  value: number;
}

interface FlavorWheelProps {
  axes: FlavorAxis[];
  title?: string;
  note?: string;
  id: string;
}

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = 128;
const LEVELS = 5;

function point(index: number, count: number, r: number): [number, number] {
  const angle = (-90 + (index * 360) / count) * (Math.PI / 180);
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

const toPath = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + 'Z';

/**
 * Bánh xe hương vị dạng radar như "Roue des saveurs" trên trang sản phẩm của Chimay.
 * SVG tĩnh, render phía server; tên và điểm từng trục có trong <title> và danh sách ẩn cho trình đọc màn hình.
 */
export default function FlavorWheel({ axes, title = 'Bánh xe hương vị', note, id }: FlavorWheelProps) {
  const count = axes.length;
  const summary = axes.map((a) => `${a.label} ${a.value}/5`).join(', ');

  return (
    <figure className={styles.figure}>
      <h3 className={styles.title} id={`${id}-title`}>{title}</h3>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <desc id={`${id}-desc`}>{summary}</desc>
        {Array.from({ length: LEVELS }, (_, level) => (
          <path
            key={level}
            d={toPath(axes.map((_, i) => point(i, count, (RADIUS * (level + 1)) / LEVELS)))}
            className={styles.grid}
          />
        ))}
        {axes.map((_, i) => {
          const [x, y] = point(i, count, RADIUS);
          return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} className={styles.axis} />;
        })}
        <path d={toPath(axes.map((a, i) => point(i, count, (RADIUS * Math.max(0, Math.min(5, a.value))) / 5)))} className={styles.shape} />
        {axes.map((a, i) => {
          const [x, y] = point(i, count, (RADIUS * Math.max(0, Math.min(5, a.value))) / 5);
          return <circle key={i} cx={x} cy={y} r={4} className={styles.dot} />;
        })}
        {axes.map((a, i) => {
          const [x, y] = point(i, count, RADIUS + 26);
          const anchor = Math.abs(x - CENTER) < 8 ? 'middle' : x > CENTER ? 'start' : 'end';
          return (
            <text key={a.label} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" className={styles.label}>
              {a.label}
            </text>
          );
        })}
      </svg>
      {note ? <figcaption className={styles.note}>{note}</figcaption> : null}
    </figure>
  );
}
