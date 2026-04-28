'use client';

import { useState, useMemo } from 'react';
import type { Json } from '@/types/database';

type Section = 'checklist' | 'replacements' | 'psychology' | 'examples' | 'debug';

const SECTIONS: { id: Section; icon: string; name: string }[] = [
  { id: 'checklist', icon: '✅', name: '6-Point Checklist' },
  { id: 'replacements', icon: '🔄', name: 'Bảng thay từ AI' },
  { id: 'psychology', icon: '🧠', name: 'Marketing Psychology' },
  { id: 'examples', icon: '📝', name: 'Before / After' },
  { id: 'debug', icon: '🛠️', name: 'Debug Playbook' },
];

interface ContentTip {
  id: string;
  title: string;
  description: string | null;
  section: string;
  content: Json;
  sort_order: number | null;
}

interface ContentTipsTabProps {
  tips: ContentTip[];
}

// Safe accessors for Json content
interface ChecklistContent {
  bad?: string[];
  good?: string[];
  tips?: string[];
}

interface PsychologyContent {
  icon?: string;
  example?: string;
  tip?: string;
}

interface ExampleContent {
  before?: string;
  after?: string;
  issues?: string[];
}

interface DebugContent {
  icon?: string;
  followUp?: string;
}

interface FnbContent {
  use?: string[];
  avoid?: string[];
}

function asChecklist(c: Json): ChecklistContent {
  return (c && typeof c === 'object' && !Array.isArray(c)) ? c as unknown as ChecklistContent : {};
}

function asPsychology(c: Json): PsychologyContent {
  return (c && typeof c === 'object' && !Array.isArray(c)) ? c as unknown as PsychologyContent : {};
}

function asExample(c: Json): ExampleContent {
  return (c && typeof c === 'object' && !Array.isArray(c)) ? c as unknown as ExampleContent : {};
}

function asDebug(c: Json): DebugContent {
  return (c && typeof c === 'object' && !Array.isArray(c)) ? c as unknown as DebugContent : {};
}

function asFnb(c: Json): FnbContent {
  return (c && typeof c === 'object' && !Array.isArray(c)) ? c as unknown as FnbContent : {};
}

export default function ContentTipsTab({ tips }: ContentTipsTabProps) {
  const [activeSection, setActiveSection] = useState<Section>('checklist');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Group tips by section
  const grouped = useMemo(() => {
    const map: Record<string, ContentTip[]> = {};
    for (const t of tips) {
      if (!map[t.section]) map[t.section] = [];
      map[t.section].push(t);
    }
    return map;
  }, [tips]);

  const checklist = grouped['checklist'] || [];
  const psychology = grouped['psychology'] || [];
  const examples = grouped['examples'] || [];
  const debug = grouped['debug'] || [];
  const fnbWords = grouped['fnb_words']?.[0] ? asFnb(grouped['fnb_words'][0].content) : { use: [], avoid: [] };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!tips.length) {
    return <div className="empty-state">Chưa có content tips. Thêm dữ liệu từ Supabase.</div>;
  }

  return (
    <div>
      {/* Section Navigation */}
      <div className="flex gap-sm mb-lg flex-wrap">
        {SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`platform-btn ${activeSection === sec.id ? 'active' : ''}`}
            style={activeSection === sec.id ? { background: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
          >
            <span>{sec.icon}</span> {sec.name}
          </button>
        ))}
      </div>

      {/* SECTION: Checklist */}
      {activeSection === 'checklist' && (
        <div>
          <div className="mb-md">
            <h3 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>✅ 6-Point Checklist nhận diện &quot;Văn AI&quot;</h3>
            <p className="text-sm text-muted">Sau khi sinh content, BẮT BUỘC chạy qua 6 tiêu chí này. Chỗ nào không đạt → sửa trước khi publish.</p>
          </div>

          <div className="flex flex-col gap-lg">
            {checklist.map((item) => {
              const content = asChecklist(item.content);
              return (
                <div key={item.id} className="card">
                  <div className="font-bold mb-sm" style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>{item.title}</div>
                  <div className="text-sm text-muted mb-md">{item.description}</div>

                  {content.bad && content.good && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                        <div className="form-label" style={{ color: 'var(--error)' }}>❌ AI viết</div>
                        {content.bad.map((b, i) => (
                          <div key={i} className="text-sm text-muted mb-sm">• {b}</div>
                        ))}
                      </div>
                      <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                        <div className="form-label" style={{ color: 'var(--success)' }}>✅ Tự nhiên</div>
                        {content.good.map((g, i) => (
                          <div key={i} className="text-sm text-muted mb-sm">• {g}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {content.tips && (
                    <div className="account-detail" style={{ marginTop: '0.75rem', padding: '0.75rem' }}>
                      {content.tips.map((t, i) => (
                        <div key={i} className="text-sm text-muted mb-sm">• {t}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* F&B Words */}
          {fnbWords.use && fnbWords.use.length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="font-bold mb-md" style={{ fontSize: '0.95rem' }}>🍺 Từ vựng F&B / Bia Đức</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div className="form-label" style={{ color: 'var(--success)' }}>✅ Nên dùng</div>
                  <div className="flex flex-wrap gap-xs">
                    {fnbWords.use.map((w, i) => (
                      <span key={i} className="chip" style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.75rem' }}>{w}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="form-label" style={{ color: 'var(--error)' }}>❌ Tránh</div>
                  <div className="flex flex-wrap gap-xs">
                    {fnbWords.avoid?.map((w, i) => (
                      <span key={i} className="chip" style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--error)', fontSize: '0.75rem' }}>{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION: Replacements */}
      {activeSection === 'replacements' && checklist.length > 0 && (
        <div>
          <h3 className="font-bold mb-md" style={{ fontSize: '1.1rem' }}>🔄 Bảng thay thế từ AI → Tự nhiên</h3>
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--error)', borderBottom: '1px solid var(--border)' }}>❌ Từ nối AI</div>
              <div className="text-center text-muted" style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)' }}>→</div>
              <div style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--success)', borderBottom: '1px solid var(--border)' }}>✅ Từ nối tự nhiên</div>
              {(() => {
                const firstChecklist = asChecklist(checklist[0]?.content);
                if (!firstChecklist?.bad || !firstChecklist?.good) return null;
                return firstChecklist.bad.map((b, i) => (
                  <div key={i} style={{ display: 'contents' }}>
                    <div className="text-muted" style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border)' }}>{b}</div>
                    <div className="text-center" style={{ padding: '0.6rem 0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)' }}>→</div>
                    <div className="font-semibold" style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border)' }}>{firstChecklist.good?.[i] || ''}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Psychology */}
      {activeSection === 'psychology' && (
        <div>
          <h3 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>🧠 10 Nguyên tắc Marketing Psychology</h3>
          <p className="text-sm text-muted mb-md">Áp dụng cho F&B / Bia Đức tại Việt Nam — luôn tuân thủ đạo đức marketing.</p>

          <div className="grid-auto-fill grid-cols-auto-340" style={{ gap: '1rem' }}>
            {psychology.map((p) => {
              const c = asPsychology(p.content);
              return (
                <div key={p.id} className="card flex flex-col">
                  <div className="flex items-center gap-sm mb-sm">
                    <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
                    <span className="font-bold" style={{ fontSize: '0.95rem' }}>{p.title}</span>
                  </div>
                  <div className="text-sm text-muted mb-sm">{p.description}</div>
                  <div className="account-detail mb-sm" style={{ flex: 1, padding: '0.75rem' }}>
                    <div className="text-sm" style={{ fontStyle: 'italic', color: 'var(--primary)', marginBottom: '0.25rem' }}>Ví dụ:</div>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{c.example}</div>
                  </div>
                  <div className="text-sm text-muted">
                    💡 <strong>Tip:</strong> {c.tip}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ marginTop: '1.5rem', borderLeft: '3px solid var(--warning)' }}>
            <div className="font-bold mb-sm" style={{ fontSize: '0.9rem', color: 'var(--warning)' }}>⚠️ Nguyên tắc đạo đức</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }} className="text-muted">
              <div>❌ KHÔNG dùng scarcity giả → mất trust</div>
              <div>❌ KHÔNG thao túng cảm xúc → chỉ truyền cảm hứng</div>
              <div>✅ Luôn deliver đúng lời hứa</div>
              <div>✅ Tôn trọng khán giả = người lớn thông minh</div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: Before/After */}
      {activeSection === 'examples' && (
        <div>
          <h3 className="font-bold mb-md" style={{ fontSize: '1.1rem' }}>📝 Before / After — So sánh AI raw vs Humanized</h3>
          <div className="flex flex-col" style={{ gap: '1.5rem' }}>
            {examples.map((item) => {
              const c = asExample(item.content);
              return (
                <div key={item.id} className="card">
                  <div className="font-bold mb-md" style={{ fontSize: '0.95rem' }}>{item.title}</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                      <div className="form-label" style={{ color: 'var(--error)' }}>❌ Before — AI raw</div>
                      <div className="text-sm text-muted" style={{ fontStyle: 'italic', lineHeight: '1.7' }}>&quot;{c.before}&quot;</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                      <div className="form-label" style={{ color: 'var(--success)' }}>✅ After — Humanized</div>
                      <div style={{ fontSize: '0.85rem', lineHeight: '1.7' }}>&quot;{c.after}&quot;</div>
                    </div>
                  </div>

                  <div className="account-detail" style={{ padding: '0.75rem' }}>
                    <div className="form-label" style={{ color: 'var(--warning)' }}>Vấn đề phát hiện:</div>
                    {c.issues?.map((issue, i) => (
                      <div key={i} className="text-sm text-muted mb-sm">• {issue}</div>
                    ))}
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      padding: '0.4rem 0.8rem',
                      ...(copiedId === `after-${item.id}` ? { background: 'var(--success-bg)', color: 'var(--success)' } : {}),
                    }}
                    onClick={() => copyText(c.after || '', `after-${item.id}`)}
                  >
                    {copiedId === `after-${item.id}` ? '✓ Đã copy bản After!' : '📋 Copy bản After'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: Debug Playbook */}
      {activeSection === 'debug' && (
        <div>
          <h3 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>🛠️ Output Debug Playbook</h3>
          <p className="text-sm text-muted mb-md">
            Khi output AI không như ý, KHÔNG viết lại prompt từ đầu. Dùng follow-up cụ thể:
          </p>

          <div className="flex flex-col gap-lg">
            {debug.map((item) => {
              const c = asDebug(item.content);
              return (
                <div key={item.id} className="card">
                  <div className="flex gap-md" style={{ alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.25rem', minWidth: '32px', textAlign: 'center', lineHeight: '1.5' }}>
                      {c.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="font-bold mb-sm" style={{ fontSize: '0.95rem', color: 'var(--warning)' }}>
                        Tình huống: {item.title}
                      </div>
                      <div className="prompt-box" style={{ maxHeight: 'none', borderLeft: '3px solid var(--primary)' }}>
                        {c.followUp}
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{
                        flexShrink: 0,
                        fontSize: '0.7rem',
                        padding: '0.3rem 0.6rem',
                        ...(copiedId === item.id ? { background: 'var(--success-bg)', color: 'var(--success)' } : {}),
                      }}
                      onClick={() => copyText(c.followUp || '', item.id)}
                    >
                      {copiedId === item.id ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ marginTop: '1.5rem', borderLeft: '3px solid var(--info)', padding: '1.25rem' }}>
            <div className="font-bold mb-sm" style={{ fontSize: '0.9rem', color: 'var(--info)' }}>
              💡 Nguyên tắc chung
            </div>
            <div className="text-sm text-muted" style={{ lineHeight: '1.6' }}>
              &quot;Viết lại cho hay hơn&quot; là câu <strong>VÔ DỤNG</strong>. Phải chỉ rõ: sửa <strong>ĐÂU</strong>, sai <strong>THẾ NÀO</strong>, sửa <strong>THEO HƯỚNG NÀO</strong>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
