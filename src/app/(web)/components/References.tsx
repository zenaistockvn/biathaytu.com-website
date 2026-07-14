import React from 'react';

export interface ReferenceSource {
  title: string;
  publisher: string;
  url?: string;
  note?: string;
  accessedAt?: string;
}

interface ReferencesProps {
  sources: ReferenceSource[];
}

export default function References({ sources }: ReferencesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="references-section" style={{
      marginTop: '48px',
      padding: '24px 32px',
      background: 'var(--web-bg-section, #faf7f2)',
      borderRadius: '12px',
      borderLeft: '4px solid var(--web-gold, #b8860b)',
      fontSize: '14px',
      lineHeight: '1.6',
      color: 'var(--web-text-secondary, #4a5568)'
    }}>
      <h4 style={{
        margin: '0 0 12px 0',
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--web-navy, #1a365d)',
        fontFamily: 'var(--font-serif, serif)'
      }}>
        Nguồn Tài Liệu Xác Thực & Tham Khảo (Verified References)
      </h4>
      <p style={{ margin: '0 0 16px 0', opacity: 0.8, fontSize: '13px' }}>
        Thông tin trên trang được đối chiếu và kiểm duyệt dựa trên các nguồn tài liệu chính thống của nhà sản xuất:
      </p>
      <ul style={{ margin: 0, paddingLeft: '20px', display: 'grid', gap: '8px' }}>
        {sources.map((source, index) => (
          <li key={index}>
            <strong>{source.title}</strong> — Xuất bản bởi <em>{source.publisher}</em>.
            {source.note && <span> ({source.note})</span>}
            {source.url && (
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: 'var(--web-gold-dark, #8b6508)', 
                  textDecoration: 'underline',
                  marginLeft: '6px',
                  wordBreak: 'break-all'
                }}
              >
                [Link nguồn gốc]
              </a>
            )}
            {source.accessedAt && <span style={{ opacity: 0.7, fontSize: '12px', marginLeft: '8px' }}>(Truy cập ngày: {source.accessedAt})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
