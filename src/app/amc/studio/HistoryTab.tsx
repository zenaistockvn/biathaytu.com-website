'use client';

import { useState, useEffect, useMemo } from 'react';

// ─── Types ──────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  idea: string;
  pillar: string;
  platform: string;
  productName: string;
  caption: string;
  hashtags: string[];
  imagePrompt?: string;
  score: number;
  createdAt: string;
}

const STORAGE_KEY = 'amc_writer_history';
const MAX_ENTRIES = 20;

// ─── Helpers ────────────────────────────────────────────────────

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    history.unshift(newEntry);
    if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage full or unavailable
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Pillar Labels ──────────────────────────────────────────────

const PILLAR_LABELS: Record<string, { icon: string; label: string }> = {
  lifestyle_moment: { icon: '🏠', label: 'Lifestyle' },
  education: { icon: '📚', label: 'Kiến thức' },
  social_proof: { icon: '⭐', label: 'Social Proof' },
  soft_offer: { icon: '💎', label: 'Soft Offer' },
  food_pairing: { icon: '🍽️', label: 'Food Pairing' },
  storytelling: { icon: '📖', label: 'Storytelling' },
  engagement: { icon: '💬', label: 'Tương tác' },
  behind_scenes: { icon: '🎬', label: 'Hậu trường' },
};

// ─── Component ──────────────────────────────────────────────────

interface HistoryTabProps {
  onReuse: (entry: HistoryEntry) => void;
}

export default function HistoryTab({ onReuse }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filterPillar, setFilterPillar] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const filtered = useMemo(() => {
    return history.filter(e => {
      if (filterPillar !== 'all' && e.pillar !== filterPillar) return false;
      if (filterPlatform !== 'all' && e.platform !== filterPlatform) return false;
      return true;
    });
  }, [history, filterPillar, filterPlatform]);

  const handleDelete = (id: string) => {
    const updated = history.filter(e => e.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (!confirm(`Xóa toàn bộ ${history.length} lịch sử?`)) return;
    clearHistory();
    setHistory([]);
  };

  const handleCopy = (entry: HistoryEntry) => {
    navigator.clipboard.writeText(entry.caption + '\n\n' + entry.hashtags.join(' '));
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get unique pillars that exist in history
  const pillarsInHistory = useMemo(() => {
    const set = new Set(history.map(e => e.pillar));
    return Array.from(set);
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
        <h3 style={{ marginBottom: '0.5rem' }}>Chưa có lịch sử</h3>
        <p className="text-sm text-muted">
          Khi bạn tạo content bằng AI Writer, lịch sử sẽ được lưu tự động tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <span className="card-title">📂 Lịch Sử Tạo Content ({history.length})</span>
        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
          <select
            value={filterPillar}
            onChange={e => setFilterPillar(e.target.value)}
            className="filter-select"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
          >
            <option value="all">Tất cả pillars</option>
            {pillarsInHistory.map(p => (
              <option key={p} value={p}>
                {PILLAR_LABELS[p]?.icon} {PILLAR_LABELS[p]?.label || p}
              </option>
            ))}
          </select>
          <select
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
            className="filter-select"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
          >
            <option value="all">Tất cả platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
          <button
            onClick={handleClearAll}
            className="btn btn-ghost"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--error)' }}
          >
            🗑 Xóa tất cả
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-md" style={{ padding: '1rem' }}>
        {filtered.map((entry) => {
          const isExpanded = expandedId === entry.id;
          const pillarInfo = PILLAR_LABELS[entry.pillar] || { icon: '📄', label: entry.pillar };
          const date = new Date(entry.createdAt);

          return (
            <div
              key={entry.id}
              style={{
                padding: '1rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                borderLeft: `3px solid ${entry.score >= 8 ? '#22C55E' : entry.score >= 6 ? '#F59E0B' : '#EF4444'}`,
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-sm" style={{ gap: '0.5rem' }}>
                <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap', flex: 1 }}>
                  <span className="chip" style={{ fontSize: '0.7rem' }}>
                    {pillarInfo.icon} {pillarInfo.label}
                  </span>
                  <span className={`platform-badge platform-${entry.platform}`} style={{ fontSize: '0.7rem' }}>
                    {entry.platform}
                  </span>
                  {entry.productName && (
                    <span className="text-xs text-muted">🍺 {entry.productName}</span>
                  )}
                  <span
                    className="text-xs font-bold"
                    style={{ color: entry.score >= 8 ? '#22C55E' : entry.score >= 6 ? '#F59E0B' : '#EF4444' }}
                  >
                    ⭐ {entry.score}/10
                  </span>
                </div>
                <span className="text-xs text-muted" style={{ flexShrink: 0 }}>
                  {date.toLocaleDateString('vi-VN')} {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Idea */}
              <div className="text-xs text-muted mb-sm" style={{ fontStyle: 'italic' }}>
                💡 {entry.idea}
              </div>

              {/* Caption preview / expanded */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  cursor: 'pointer',
                  whiteSpace: 'pre-wrap',
                  ...(isExpanded
                    ? { maxHeight: '400px', overflowY: 'auto' }
                    : {
                        maxHeight: '4.8em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const,
                      }),
                }}
              >
                {entry.caption}
              </div>

              {/* Hashtags */}
              {isExpanded && entry.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-xs" style={{ marginTop: '0.5rem' }}>
                  {entry.hashtags.map((tag, i) => (
                    <span key={i} className="chip" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.7rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-sm" style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                <button
                  onClick={() => onReuse(entry)}
                  className="btn-inline"
                  style={{ fontSize: '0.75rem', color: 'var(--primary)' }}
                >
                  🔄 Dùng lại
                </button>
                <button
                  onClick={() => handleCopy(entry)}
                  className="btn-inline"
                  style={{ fontSize: '0.75rem' }}
                >
                  {copiedId === entry.id ? '✓ Đã copy' : '📋 Copy'}
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="btn-link"
                  style={{ fontSize: '0.75rem' }}
                >
                  {isExpanded ? '▲ Thu gọn' : '▼ Xem thêm'}
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="btn-inline ml-auto"
                  style={{ fontSize: '0.75rem', color: 'var(--error)' }}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-state-icon">🔍</div>
            <div>Không có lịch sử phù hợp filter</div>
          </div>
        )}
      </div>
    </div>
  );
}
