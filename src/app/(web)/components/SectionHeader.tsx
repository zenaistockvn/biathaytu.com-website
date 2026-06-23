interface SectionHeaderProps {
  label: string;
  title: string;
  /** Optional accent text rendered inside a <span> with gold color */
  titleAccent?: string;
  className?: string;
}

/**
 * Standardized section header: label → title → divider.
 * Replaces 3+ inconsistent header patterns across the site.
 */
export default function SectionHeader({ label, title, titleAccent, className = '' }: SectionHeaderProps) {
  return (
    <div className={`section-header-center ${className}`}>
      <span className="section-label">{label}</span>
      <h2 className="section-title">
        {title}
        {titleAccent && (
          <>
            <br />
            <span style={{ color: 'var(--web-gold)' }}>{titleAccent}</span>
          </>
        )}
      </h2>
      <div className="section-divider" />
    </div>
  );
}
