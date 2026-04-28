'use client';

import { useState, useMemo } from 'react';

interface ImagePrompt {
  id: string;
  style_id: string;
  style_name: string;
  style_icon: string;
  style_description: string;
  title: string;
  prompt: string;
  purpose: string | null;
  ratio: string | null;
}

interface BrandDNA {
  id: string;
  name: string;
  heritage: string | null;
  tagline: string | null;
  colors: string | null;
  mood: string | null;
  visual_code: string | null;
}

interface ImagePromptsTabProps {
  prompts: ImagePrompt[];
  brands: BrandDNA[];
}

export default function ImagePromptsTab({ prompts, brands }: ImagePromptsTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showBrandDNA, setShowBrandDNA] = useState(false);

  // Group prompts by style_id
  const styles = useMemo(() => {
    const styleMap = new Map<string, { id: string; name: string; icon: string; description: string; prompts: ImagePrompt[] }>();
    for (const p of prompts) {
      if (!styleMap.has(p.style_id)) {
        styleMap.set(p.style_id, {
          id: p.style_id,
          name: p.style_name,
          icon: p.style_icon,
          description: p.style_description,
          prompts: [],
        });
      }
      styleMap.get(p.style_id)!.prompts.push(p);
    }
    return Array.from(styleMap.values());
  }, [prompts]);

  const [activeStyle, setActiveStyle] = useState(styles[0]?.id || 'hero');

  const currentStyle = styles.find(s => s.id === activeStyle) || styles[0];

  const copyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!styles.length) {
    return <div className="empty-state">Chưa có image prompts. Thêm dữ liệu từ Supabase.</div>;
  }

  return (
    <div>
      {/* Brand DNA Toggle */}
      {brands.length > 0 && (
        <div className="card mb-lg" style={{ padding: '1rem 1.5rem' }}>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold" style={{ fontSize: '0.85rem' }}>🍺 Brand DNA Reference</span>
              <span className="text-sm text-muted" style={{ marginLeft: '0.75rem' }}>
                {brands.map(b => b.name).join(' & ')} — Luôn tuân thủ khi tạo ảnh
              </span>
            </div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setShowBrandDNA(!showBrandDNA)}
            >
              {showBrandDNA ? '▲ Thu gọn' : '▼ Xem chi tiết'}
            </button>
          </div>

          {showBrandDNA && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              {brands.map((brand) => (
                <div key={brand.id} className="account-detail">
                  <div className="font-bold mb-sm" style={{ color: 'var(--primary)' }}>{brand.name}</div>
                  <div className="text-sm text-muted" style={{ lineHeight: '1.8' }}>
                    {brand.heritage && <div><strong>Heritage:</strong> {brand.heritage}</div>}
                    {brand.tagline && <div><strong>Tagline:</strong> <em>{brand.tagline}</em></div>}
                    {brand.colors && <div><strong>Colors:</strong> {brand.colors}</div>}
                    {brand.mood && <div><strong>Mood:</strong> {brand.mood}</div>}
                    {brand.visual_code && <div><strong>Visual:</strong> {brand.visual_code}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Style Categories */}
      <div className="flex gap-sm mb-lg flex-wrap">
        {styles.map(style => (
          <button
            key={style.id}
            onClick={() => setActiveStyle(style.id)}
            className={`platform-btn ${activeStyle === style.id ? 'active' : ''}`}
            style={activeStyle === style.id ? { background: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
          >
            <span>{style.icon}</span> {style.name}
          </button>
        ))}
      </div>

      {/* Active Style Header */}
      {currentStyle && (
        <>
          <div className="mb-lg">
            <h3 className="font-bold" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              {currentStyle.icon} {currentStyle.name}
            </h3>
            <p className="text-sm text-muted">{currentStyle.description}</p>
          </div>

          {/* Prompt Cards */}
          <div className="grid-auto-fill" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
            {currentStyle.prompts.map((item, idx) => {
              const promptId = `${currentStyle.id}-${idx}`;
              return (
                <div key={item.id} className="card flex flex-col">
                  <div className="flex justify-between items-center mb-md" style={{ alignItems: 'flex-start' }}>
                    <div>
                      <div className="font-semibold" style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.title}</div>
                      {item.purpose && <span className="badge badge-info">{item.purpose}</span>}
                    </div>
                    {item.ratio && (
                      <span className="chip-sm" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                        {item.ratio}
                      </span>
                    )}
                  </div>

                  <div className="prompt-box" style={{ flex: 1, maxHeight: 'none' }}>
                    {item.prompt}
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.75rem',
                      padding: '0.4rem 0.8rem',
                      marginTop: '0.75rem',
                      ...(copiedId === promptId ? { background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success)' } : {}),
                    }}
                    onClick={() => copyPrompt(item.prompt, promptId)}
                  >
                    {copiedId === promptId ? '✓ Đã copy!' : '📋 Copy Prompt'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Tips */}
      <div className="card mt-md" style={{ padding: '1.25rem' }}>
        <div className="font-semibold mb-md" style={{ fontSize: '0.9rem' }}>💡 Quy tắc khi dùng prompt</div>
        <div className="grid-auto-fill grid-cols-auto-250" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary)' }}>1.</span> Luôn thêm context sản phẩm: tên, dung tích, nồng độ cồn
          </div>
          <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary)' }}>2.</span> Localize cho VN: bối cảnh Hà Nội, ẩm thực Việt
          </div>
          <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary)' }}>3.</span> Giữ tone premium: bia nhập Đức = phân khúc cao cấp
          </div>
          <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary)' }}>4.</span> Đa dạng ratio: 1:1 (IG), 9:16 (Stories), 16:9 (FB cover)
          </div>
          <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary)' }}>5.</span> Tránh underage: mọi người phải trên 18 tuổi
          </div>
          <div className="flex gap-sm" style={{ alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--primary)' }}>6.</span> Tránh vi phạm thương hiệu: mô tả style, không copy logo
          </div>
        </div>
      </div>
    </div>
  );
}
