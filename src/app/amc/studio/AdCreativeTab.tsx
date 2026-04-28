'use client';

import { useState, useMemo } from 'react';
import type { Json } from '@/types/database';

interface AdSpec {
  id: string;
  platform_name: string;
  platform_icon: string;
  platform_color: string;
  element_name: string;
  char_limit: string;
  note: string | null;
  sort_order: number | null;
}

interface AdAngle {
  id: string;
  name: string;
  icon: string;
  template: string;
  examples: Json;
  sort_order: number | null;
}

const COMMON_MISTAKES = [
  'Vượt character limit → ad bị cắt ngay chỗ quan trọng nhất',
  'Headline chỉ đọc hiểu khi ghép cặp → RSA combine ngẫu nhiên = vô nghĩa',
  'Copy giống mô tả kho hàng, không giống người thật nói',
  'Dùng chung creative cho mọi platform → mỗi platform có "ngôn ngữ" riêng',
  'Thiếu CTA rõ ràng — người đọc xong không biết phải làm gì',
];

interface AdCreativeTabProps {
  specs: AdSpec[];
  angles: AdAngle[];
}

export default function AdCreativeTab({ specs, angles }: AdCreativeTabProps) {
  const [activeAngle, setActiveAngle] = useState(angles[0]?.name || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentAngle = angles.find(a => a.name === activeAngle) || angles[0];

  // Group specs by platform_name
  const platforms = useMemo(() => {
    const platformMap = new Map<string, { name: string; icon: string; color: string; elements: { name: string; limit: string; note: string | null }[] }>();
    for (const s of specs) {
      if (!platformMap.has(s.platform_name)) {
        platformMap.set(s.platform_name, {
          name: s.platform_name,
          icon: s.platform_icon,
          color: s.platform_color,
          elements: [],
        });
      }
      platformMap.get(s.platform_name)!.elements.push({
        name: s.element_name,
        limit: s.char_limit,
        note: s.note,
      });
    }
    return Array.from(platformMap.values());
  }, [specs]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!angles.length && !specs.length) {
    return <div className="empty-state">Chưa có ad creative data. Thêm dữ liệu từ Supabase.</div>;
  }

  // Safe cast: examples is Json in DB but actually string[]
  const getExamples = (angle: AdAngle): string[] => {
    if (Array.isArray(angle.examples)) return angle.examples as string[];
    return [];
  };

  return (
    <div>
      {/* Platform Specs */}
      <div className="mb-lg" style={{ marginBottom: '2rem' }}>
        <h3 className="font-bold mb-md" style={{ fontSize: '1.1rem' }}>📐 Platform Specs — Character Limits</h3>
        <div className="grid-auto-fill" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {platforms.map(platform => (
            <div key={platform.name} className="card">
              <div className="flex items-center gap-sm mb-md">
                <span style={{ fontSize: '1.25rem' }}>{platform.icon}</span>
                <span className="font-bold" style={{ fontSize: '0.95rem' }}>{platform.name}</span>
              </div>
              <div className="flex flex-col" style={{ gap: '0.6rem' }}>
                {platform.elements.map((el, i) => (
                  <div key={i} className="account-detail" style={{ padding: '0.6rem' }}>
                    <div className="flex justify-between items-center mb-sm">
                      <span className="font-semibold text-sm">{el.name}</span>
                      <span className="text-xs" style={{ color: 'var(--warning)', fontWeight: 600 }}>{el.limit}</span>
                    </div>
                    <div className="text-xs text-muted">{el.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Angles */}
      {angles.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="font-bold mb-sm" style={{ fontSize: '1.1rem' }}>🎯 Ad Copy Angles — Mẫu caption quảng cáo</h3>
          <p className="text-sm text-muted mb-md">
            Mỗi sản phẩm nên có ít nhất 3 angles khác nhau → A/B test để tìm winner
          </p>

          <div className="flex gap-sm mb-lg flex-wrap">
            {angles.map((angle) => (
              <button
                key={angle.name}
                onClick={() => setActiveAngle(angle.name)}
                className={`platform-btn ${activeAngle === angle.name ? 'active' : ''}`}
                style={activeAngle === angle.name ? { background: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
              >
                <span>{angle.icon}</span> {angle.name}
              </button>
            ))}
          </div>

          {/* Selected Angle Details */}
          {currentAngle && (
            <div className="card">
              <div className="flex items-center gap-md mb-md">
                <span style={{ fontSize: '1.5rem' }}>{currentAngle.icon}</span>
                <div>
                  <div className="font-bold" style={{ fontSize: '1rem' }}>{currentAngle.name}</div>
                  <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>
                    Template: &quot;{currentAngle.template}&quot;
                  </div>
                </div>
              </div>

              <div className="form-label mb-md">Ví dụ cho F&B / Bia Đức</div>

              <div className="flex flex-col gap-md">
                {getExamples(currentAngle).map((example, i) => {
                  const exId = `${currentAngle.name}-${i}`;
                  return (
                    <div key={i} className="flex gap-lg items-center" style={{ padding: '1rem', background: 'var(--glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', minWidth: '24px' }}>
                        {i + 1}.
                      </span>
                      <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.6' }}>{example}</div>
                      <button
                        className="btn btn-ghost"
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.3rem 0.6rem',
                          flexShrink: 0,
                          ...(copiedId === exId ? { background: 'var(--success-bg)', color: 'var(--success)' } : {}),
                        }}
                        onClick={() => copyText(example, exId)}
                      >
                        {copiedId === exId ? '✓' : '📋'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Common Mistakes */}
      <div className="card" style={{ borderLeft: '3px solid var(--error)' }}>
        <div className="font-bold mb-md" style={{ fontSize: '0.9rem', color: 'var(--error)' }}>
          ⚠️ 5 lỗi thường gặp khi tạo Ad Creative
        </div>
        <div className="flex flex-col gap-sm">
          {COMMON_MISTAKES.map((mistake, i) => (
            <div key={i} className="flex gap-md text-sm text-muted" style={{ alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--error)', fontWeight: 600 }}>✗</span>
              {mistake}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
