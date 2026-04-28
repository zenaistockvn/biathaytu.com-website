'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const CONTENT_TYPES = [
  { value: 'lifestyle_moment', label: '🏠 Lifestyle' },
  { value: 'education', label: '📚 Kiến thức' },
  { value: 'social_proof', label: '⭐ Social Proof' },
  { value: 'soft_offer', label: '💎 Soft Offer' },
  { value: 'food_pairing', label: '🍽️ Food Pairing' },
  { value: 'storytelling', label: '📖 Storytelling' },
  { value: 'engagement', label: '💬 Tương tác' },
  { value: 'behind_scenes', label: '🎬 Hậu trường' },
];

const PLATFORMS = ['facebook', 'tiktok', 'instagram', 'zalo'];

interface SatPage {
  id: string;
  page_name: string;
  page_icon: string | null;
  page_role: string;
}

interface ScheduleRule {
  id: string;
  name: string;
  time: string;
  platform: string;
  content_type: string | null;
  is_active: boolean | null;
  days_of_week: unknown;
  rotation: string | null;
  target_page_id: string | null;
}

export default function RulesClientWrapper({ initialRules, satellitePages }: { initialRules: ScheduleRule[]; satellitePages: SatPage[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formTime, setFormTime] = useState('18:00');
  const [formPlatform, setFormPlatform] = useState('facebook');
  const [formContentType, setFormContentType] = useState('lifestyle_moment');
  const [formDays, setFormDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [formRotation, setFormRotation] = useState('round_robin');
  const [formTargetPage, setFormTargetPage] = useState('');

  const toggleActive = async (id: string, current: boolean | null) => {
    setLoading(id);
    await fetch(`/api/rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
    router.refresh();
    setLoading(null);
  };

  const deleteRule = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa rule này không?')) return;
    setLoading(id);
    await fetch(`/api/rules/${id}`, { method: 'DELETE' });
    router.refresh();
    setLoading(null);
  };

  const toggleDay = (d: number) => {
    setFormDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  };

  const resetForm = useCallback(() => {
    setFormName('');
    setFormTime('18:00');
    setFormPlatform('facebook');
    setFormContentType('lifestyle_moment');
    setFormDays([1, 2, 3, 4, 5]);
    setFormRotation('round_robin');
    setFormTargetPage('');
  }, []);

  const handleCreate = async () => {
    if (!formName.trim()) return alert('Nhập tên rule!');
    if (formDays.length === 0) return alert('Chọn ít nhất 1 ngày!');

    setCreating(true);
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          time: formTime,
          platform: formPlatform,
          contentType: formContentType,
          daysOfWeek: formDays,
          rotation: formRotation,
          targetPageId: formTargetPage || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert('Lỗi: ' + data.error);
      } else {
        setShowCreateModal(false);
        resetForm();
        router.refresh();
      }
    } catch {
      alert('Lỗi tạo rule');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Tất cả Rules ({initialRules.length})</span>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Tạo Rule Mới
          </button>
        </div>

        {initialRules.length === 0 && (
          <div className="empty-state" style={{ padding: '3rem 2rem' }}>
            <div className="empty-state-icon">📅</div>
            <p>Chưa có rule nào. Tạo rule để tự động lên lịch đăng bài.</p>
          </div>
        )}

        <div className="rules-list">
          {initialRules.map((rule) => {
            const daysArray = Array.isArray(rule.days_of_week) ? (rule.days_of_week as number[]) : [];
            const isLoading = loading === rule.id;

            return (
              <div key={rule.id} className="rule-row" style={{ opacity: rule.is_active ? 1 : 0.5 }}>
                <span className="rule-time" style={{ fontSize: '1.25rem' }}>{rule.time}</span>
                <div>
                  <div className="rule-name" style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{rule.name}</div>
                  <div className="flex gap-sm items-center">
                    <span className={`platform-badge platform-${rule.platform}`}>{rule.platform}</span>
                    <span className="badge badge-info">{rule.content_type}</span>
                    {rule.target_page_id && (() => {
                      const pg = satellitePages.find(p => p.id === rule.target_page_id);
                      return pg ? (
                        <span className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontSize: '0.7rem' }}>
                          {pg.page_icon} {pg.page_name}
                        </span>
                      ) : null;
                    })()}
                    {rule.rotation && (
                      <span className="text-xs text-muted">🔄 {rule.rotation}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-xs">
                  {[0, 1, 2, 3, 4, 5, 6].map(d => {
                    const isActive = daysArray.includes(d);
                    return (
                      <span key={d} className={`day-badge ${isActive ? 'active' : ''}`}>
                        {DAYS[d]}
                      </span>
                    );
                  })}
                </div>

                <div className="ml-auto flex gap-lg items-center">
                  <div
                    className={`toggle ${rule.is_active ? 'active' : ''}`}
                    onClick={() => toggleActive(rule.id, rule.is_active)}
                    style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
                  />
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="btn-link"
                    style={{ color: 'var(--error)' }}
                    disabled={isLoading}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              animation: 'fadeInUp 0.2s ease-out',
            }}
          >
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-semibold" style={{ fontSize: '1.1rem' }}>📅 Tạo Rule Mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-link"
                style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">TÊN RULE</label>
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="VD: Đăng bài sáng Facebook"
                className="form-input"
                autoFocus
              />
            </div>

            {/* Time */}
            <div className="form-group">
              <label className="form-label">GIỜ ĐĂNG</label>
              <input
                type="time"
                value={formTime}
                onChange={e => setFormTime(e.target.value)}
                className="form-input"
                style={{ maxWidth: '150px' }}
              />
            </div>

            {/* Platform */}
            <div className="form-group">
              <label className="form-label">NỀN TẢNG</label>
              <div className="flex gap-sm flex-wrap">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    onClick={() => setFormPlatform(p)}
                    className={`platform-btn ${formPlatform === p ? 'active' : ''}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div className="form-group">
              <label className="form-label">LOẠI CONTENT</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {CONTENT_TYPES.map(ct => (
                  <button
                    key={ct.value}
                    onClick={() => setFormContentType(ct.value)}
                    className={`platform-btn ${formContentType === ct.value ? 'active' : ''}`}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.6rem',
                      justifyContent: 'flex-start',
                      borderRadius: 'var(--radius-sm)',
                      ...(formContentType === ct.value ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : {}),
                    }}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div className="form-group">
              <label className="form-label">NGÀY TRONG TUẦN</label>
              <div className="flex gap-sm">
                {[0, 1, 2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`day-badge ${formDays.includes(d) ? 'active' : ''}`}
                    style={{ cursor: 'pointer', padding: '0.4rem 0.6rem' }}
                  >
                    {DAYS[d]}
                  </button>
                ))}
              </div>
              <div className="flex gap-sm" style={{ marginTop: '0.5rem' }}>
                <button
                  className="btn-inline"
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => setFormDays([1, 2, 3, 4, 5])}
                >
                  T2-T6
                </button>
                <button
                  className="btn-inline"
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => setFormDays([0, 1, 2, 3, 4, 5, 6])}
                >
                  Mỗi ngày
                </button>
                <button
                  className="btn-inline"
                  style={{ fontSize: '0.7rem' }}
                  onClick={() => setFormDays([0, 6])}
                >
                  Cuối tuần
                </button>
              </div>
            </div>

            {/* Target Page */}
            {satellitePages.length > 0 && (
              <div className="form-group">
                <label className="form-label">ĐĂNG LÊN PAGE</label>
                <select
                  value={formTargetPage}
                  onChange={e => setFormTargetPage(e.target.value)}
                  className="form-select"
                >
                  <option value="">🏠 Page mặc định (Hub)</option>
                  {satellitePages.map(sp => (
                    <option key={sp.id} value={sp.id}>
                      {sp.page_icon} {sp.page_name} ({sp.page_role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rotation */}
            <div className="form-group">
              <label className="form-label">CHIẾN LƯỢC CHỌN CONTENT</label>
              <select
                value={formRotation}
                onChange={e => setFormRotation(e.target.value)}
                className="form-select"
              >
                <option value="round_robin">🔄 Round Robin (luân phiên)</option>
                <option value="random">🎲 Random (ngẫu nhiên)</option>
                <option value="newest_first">🆕 Mới nhất trước</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-sm" style={{ marginTop: '1.5rem' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? '⏳ Đang tạo...' : '✅ Tạo Rule'}
              </button>
              <button
                className="btn btn-ghost"
                style={{ padding: '0.75rem 1.5rem' }}
                onClick={() => { setShowCreateModal(false); resetForm(); }}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
