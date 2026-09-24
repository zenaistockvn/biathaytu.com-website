/**
 * Icon nét mảnh kiểu minh hoạ khắc của Chimay (ly bia cạnh "Nos bières", bánh phô mai cạnh
 * "Nos fromages"). Vẽ bằng currentColor để tự đổi màu theo khối nền.
 */
type IconProps = { size?: number; className?: string };

export function WeizenGlassIcon({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M22 6h20c1 8-1 14-2 20-1 7 1 13 2 20 1 6-1 10-3 12H25c-2-2-4-6-3-12 1-7 3-13 2-20-1-6-3-12-2-20z" />
      <path d="M22.4 14c3-2 6 1 9.6-1s6.4 1 9.6 0" />
      <path d="M25 58h14" />
      <path d="M28 24c-.6 4-1.4 8-1.2 12M35 30v2M31 42v2M36 38v1" strokeLinecap="round" />
    </svg>
  );
}

export function BottleIcon({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M28 4h8v4h-8zM28.5 8h7v10c0 3 6 6 6 12v28c0 1.6-1.4 3-3 3h-13c-1.6 0-3-1.4-3-3V30c0-6 6-9 6-12z" />
      <path d="M22.5 32h19v16h-19z" />
      <path d="M27 38h10M27 42h7" strokeLinecap="round" />
    </svg>
  );
}

export function KegIcon({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M16 12h32v44H16z" />
      <path d="M16 20h32M16 48h32M28 8h8v4h-8z" />
      <path d="M24 30h16v10H24z" />
    </svg>
  );
}

export function AbbeyIcon({ size = 56, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M32 4v6M29 7h6" strokeLinecap="round" />
      <path d="M24 30c0-8 4-14 8-18 4 4 8 10 8 18" />
      <path d="M22 30h20v28H22zM6 40l8-8 8 8M42 40l8-8 8 8M8 40v18h14M42 58h14V40" />
      <path d="M28 58V46a4 4 0 0 1 8 0v12M30 36h4" />
    </svg>
  );
}
