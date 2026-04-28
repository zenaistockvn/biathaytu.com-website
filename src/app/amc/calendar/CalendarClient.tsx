'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ManualPostModal from '@/components/ManualPostModal';

// ─── Types ──────────────────────────────────────────────────────

interface ScheduledPost {
  id: string;
  caption: string;
  platform: string;
  scheduled_at: string;
  status: string | null;
  is_approved: boolean | null;
  image_urls: unknown;
  error_log: string | null;
  external_id: string | null;
  published_at: string | null;
  products?: { name: string } | null;
}

interface CalendarEntry {
  id: string;
  day_number: number;
  week_number: number;
  scheduled_date: string;
  theme: string;
  storytelling_goal: string;
  hook: string | null;
  visual_brief: string | null;
  cta: string | null;
  status: string | null;
  content_id: string | null;
}

interface Props {
  initialPosts: ScheduledPost[];
  calendarEntries: CalendarEntry[];
}

// ─── Helpers ────────────────────────────────────────────────────

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEKDAY_FULL = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const day = baseDate.getDay(); // 0 = Sunday
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7)); // Adjust to Monday
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#F59E0B',
  published: '#22C55E',
  failed: '#EF4444',
  pending: '#94A3B8',
  in_progress: '#3B82F6',
  completed: '#22C55E',
};

// ─── Component ──────────────────────────────────────────────────

export default function CalendarClientWrapper({ initialPosts, calendarEntries }: Props) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<{ id: string; message: string } | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // Map posts by date
  const postsByDate = useMemo(() => {
    const map: Record<string, ScheduledPost[]> = {};
    initialPosts.forEach(post => {
      const key = formatDateKey(new Date(post.scheduled_at));
      if (!map[key]) map[key] = [];
      map[key].push(post);
    });
    return map;
  }, [initialPosts]);

  // Map calendar entries by date
  const calendarByDate = useMemo(() => {
    const map: Record<string, CalendarEntry[]> = {};
    calendarEntries.forEach(entry => {
      const key = entry.scheduled_date; // Already YYYY-MM-DD
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return map;
  }, [calendarEntries]);

  const navigateWeek = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + dir * 7);
    setCurrentDate(d);
    setExpandedDay(null);
  };

  const goToday = () => {
    setCurrentDate(new Date());
    setExpandedDay(null);
  };

  // ─── Actions ────────────────────────────────────────────────

  const approvePost = async (id: string) => {
    setLoading(id);
    await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved: true }),
    });
    router.refresh();
    setLoading(null);
  };

  const deletePost = async (id: string) => {
    if (!confirm('Hủy bỏ bài đăng này?')) return;
    setLoading(id);
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.refresh();
    setLoading(null);
  };

  const publishPost = async (id: string) => {
    if (!confirm('Đăng bài ngay lên Facebook?')) return;
    setLoading(id);
    setPublishResult(null);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id }),
      });
      const data = await res.json();
      setPublishResult({
        id,
        message: res.ok ? `✅ ${data.message}` : `❌ ${data.error}`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setPublishResult({ id, message: `❌ ${message}` });
    }
    router.refresh();
    setLoading(null);
  };

  const markAsManuallyPublished = async (id: string) => {
    if (!confirm('Xác nhận bạn đã tự copy và đăng bài này lên Fanpage?')) return;
    setLoading(id);
    setPublishResult(null);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'published',
          published_at: new Date().toISOString() 
        }),
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật trạng thái');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setPublishResult({ id, message: `❌ ${message}` });
    }
    router.refresh();
    setLoading(null);
  };

  const getStatusBadge = (post: ScheduledPost) => {
    if (post.status === 'published') return <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>📤 Đã đăng</span>;
    if (post.status === 'failed') return <span className="badge" style={{ background: 'var(--error)', color: '#fff', fontSize: '0.65rem' }}>❌ Lỗi</span>;
    if (post.is_approved) return <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ Đã Duyệt</span>;
    return <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>⚠ Chờ Duyệt</span>;
  };

  // ─── Week Header ──────────────────────────────────────────────

  const weekRange = `${weekDates[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} — ${weekDates[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

  return (
    <>
      {showManualModal && <ManualPostModal onClose={() => setShowManualModal(false)} />}

      {/* ═══ Toolbar ═══ */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <div className="flex gap-sm items-center">
          <button onClick={() => navigateWeek(-1)} className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem' }}>
            ◀ Tuần trước
          </button>
          <button onClick={goToday} className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontWeight: 600 }}>
            📅 Hôm nay
          </button>
          <button onClick={() => navigateWeek(1)} className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem' }}>
            Tuần sau ▶
          </button>
          <span className="font-semibold" style={{ fontSize: '1.1rem', marginLeft: '0.5rem' }}>
            {weekRange}
          </span>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => setViewMode(viewMode === 'week' ? 'list' : 'week')}
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            {viewMode === 'week' ? '📋 List View' : '📅 Week View'}
          </button>
          <button onClick={() => setShowManualModal(true)} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            + Tạo bài thủ công
          </button>
        </div>
      </div>

      {/* ═══ Weekly Grid View ═══ */}
      {viewMode === 'week' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          {weekDates.map((date, idx) => {
            const key = formatDateKey(date);
            const dayPosts = postsByDate[key] || [];
            const dayCalendar = calendarByDate[key] || [];
            const isToday = isSameDay(date, new Date());
            const isExpanded = expandedDay === key;
            const totalItems = dayPosts.length + dayCalendar.length;

            return (
              <div
                key={key}
                onClick={() => setExpandedDay(isExpanded ? null : key)}
                style={{
                  background: isToday ? 'rgba(59, 130, 246, 0.06)' : 'var(--surface)',
                  border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '0.75rem',
                  minHeight: '140px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {/* Day Header */}
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <div style={{
                    fontSize: '0.7rem', textTransform: 'uppercase',
                    color: isToday ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                  }}>
                    {WEEKDAY_LABELS[(idx + 1) % 7]}
                  </div>
                  <div style={{
                    fontSize: '1.4rem', fontWeight: 700,
                    color: isToday ? 'var(--primary)' : 'var(--text)',
                    lineHeight: 1.2,
                  }}>
                    {date.getDate()}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    T{date.getMonth() + 1}
                  </div>
                </div>

                {/* Status Dots */}
                {totalItems > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', marginBottom: '0.4rem' }}>
                    {dayPosts.map(post => (
                      <div key={post.id} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: STATUS_COLORS[post.status || 'scheduled'] || '#94A3B8',
                      }} title={`${post.platform} — ${post.status}`} />
                    ))}
                    {dayCalendar.map(entry => (
                      <div key={entry.id} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        border: `2px solid ${STATUS_COLORS[entry.status || 'pending'] || '#94A3B8'}`,
                        background: 'transparent',
                      }} title={`Editorial: ${entry.theme}`} />
                    ))}
                  </div>
                )}

                {/* Post Summaries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {dayPosts.slice(0, 2).map(post => (
                    <div key={post.id} style={{
                      fontSize: '0.65rem', padding: '0.2rem 0.4rem',
                      background: post.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                      borderRadius: '3px', lineHeight: 1.3,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {post.platform === 'facebook' ? '📘' : '📱'} {post.caption.slice(0, 30)}...
                    </div>
                  ))}
                  {dayCalendar.slice(0, 2).map(entry => (
                    <div key={entry.id} style={{
                      fontSize: '0.65rem', padding: '0.2rem 0.4rem',
                      background: 'rgba(139,92,246,0.1)', borderRadius: '3px',
                      border: '1px dashed rgba(139,92,246,0.3)',
                      lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      📝 {entry.theme}
                    </div>
                  ))}
                  {totalItems > 4 && (
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      +{totalItems - 4} khác
                    </div>
                  )}
                </div>

                {/* Empty day */}
                {totalItems === 0 && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.5, marginTop: '0.5rem' }}>
                    —
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ Expanded Day Detail ═══ */}
      {expandedDay && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <span className="card-title">
              📅 {WEEKDAY_FULL[new Date(expandedDay + 'T00:00:00').getDay()]} — {new Date(expandedDay + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setExpandedDay(null)}
              className="btn btn-ghost"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            >
              ✕ Đóng
            </button>
          </div>

          {/* Editorial Calendar Entries */}
          {(calendarByDate[expandedDay] || []).map(entry => (
            <div key={entry.id} style={{
              padding: '0.75rem', marginBottom: '0.75rem',
              background: 'rgba(139,92,246,0.04)', borderRadius: 'var(--radius)',
              border: '1px dashed rgba(139,92,246,0.2)',
            }}>
              <div className="flex justify-between items-center mb-xs">
                <span className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>📝 Editorial Plan</span>
                <span className="badge" style={{
                  background: STATUS_COLORS[entry.status || 'pending'] + '22',
                  color: STATUS_COLORS[entry.status || 'pending'],
                  fontSize: '0.65rem',
                }}>
                  {entry.status || 'pending'}
                </span>
              </div>
              <div className="font-semibold" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{entry.theme}</div>
              <div className="text-xs text-muted" style={{ marginBottom: '0.25rem' }}>🎯 {entry.storytelling_goal}</div>
              {entry.hook && <div className="text-xs" style={{ color: '#F59E0B' }}>🪝 Hook: {entry.hook}</div>}
              {entry.cta && <div className="text-xs" style={{ color: '#22C55E' }}>📢 CTA: {entry.cta}</div>}
            </div>
          ))}

          {/* Scheduled Posts */}
          {(postsByDate[expandedDay] || []).map(post => {
            const imageUrls = Array.isArray(post.image_urls) ? post.image_urls as string[] : [];
            const isLoading = loading === post.id;

            return (
              <div key={post.id} style={{
                padding: '1rem', marginBottom: '0.75rem',
                background: 'var(--surface-solid)', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}>
                <div className="flex justify-between mb-sm" style={{ alignItems: 'center' }}>
                  <div className="flex gap-sm items-center">
                    <span className={`platform-badge platform-${post.platform}`}>{post.platform}</span>
                    <span className="text-xs font-semibold">
                      {new Date(post.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {post.products?.name && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{post.products.name}</span>}
                  </div>
                  {getStatusBadge(post)}
                </div>

                {/* Image Preview */}
                {imageUrls.length > 0 && (
                  <div className="flex gap-xs mb-sm" style={{ overflowX: 'auto' }}>
                    {imageUrls.slice(0, 3).map((url, i) => (
                      <img key={i} src={url} alt={`Post image ${i + 1}`}
                        style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                      />
                    ))}
                  </div>
                )}

                <p style={{ fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
                  {post.caption.length > 200 ? post.caption.slice(0, 200) + '...' : post.caption}
                </p>

                {/* Error/Success messages */}
                {post.status === 'failed' && post.error_log && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--error)' }}>
                    ⚠ {post.error_log}
                  </div>
                )}
                {post.status === 'published' && post.external_id && (
                  <div style={{ background: 'rgba(34,197,94,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--success)' }}>
                    📤 FB ID: {post.external_id} {post.published_at && `· ${new Date(post.published_at).toLocaleString('vi-VN')}`}
                  </div>
                )}
                {publishResult?.id === post.id && (
                  <div style={{ background: 'var(--glass)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                    {publishResult.message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-sm" style={{ paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                  {post.status !== 'published' && (
                    <button onClick={() => deletePost(post.id)} disabled={isLoading} className="btn btn-ghost" style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', fontSize: '0.75rem' }}>
                      Hủy
                    </button>
                  )}
                  {!post.is_approved && post.status !== 'published' && (
                    <button onClick={() => approvePost(post.id)} disabled={isLoading} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>
                      {isLoading ? '...' : '✓ Duyệt'}
                    </button>
                  )}
                  {post.status !== 'published' && post.platform === 'facebook' && (
                    <button onClick={() => markAsManuallyPublished(post.id)} disabled={isLoading} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', background: '#10B981', color: '#fff' }}>
                      {isLoading ? '⏳...' : '✅ Đã tự đăng'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty day detail */}
          {!(postsByDate[expandedDay]?.length) && !(calendarByDate[expandedDay]?.length) && (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📅</div>
              <div>Không có bài nào trong ngày này</div>
            </div>
          )}
        </div>
      )}

      {/* ═══ List View (existing, enhanced) ═══ */}
      {viewMode === 'list' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Tất cả bài đăng ({initialPosts.length})</span>
          </div>
          <div className="flex flex-col gap-lg" style={{ padding: '1rem' }}>
            {initialPosts.length === 0 && (
              <div className="empty-state" style={{ padding: '3rem', border: '1px dashed var(--border)' }}>
                <div className="empty-state-icon">📅</div>
                <h3>Lịch biểu trống</h3>
                <p className="text-muted">Chưa có bài đăng nào được AI tạo hoặc lên lịch.</p>
              </div>
            )}

            {initialPosts.map((post) => {
              const imageUrls = Array.isArray(post.image_urls) ? post.image_urls as string[] : [];
              const isLoading = loading === post.id;

              return (
                <div key={post.id} style={{
                  background: 'var(--surface-solid)', padding: '1.25rem',
                  borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                  display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                }}>
                  <div className="text-center" style={{ width: '100px' }}>
                    <div className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>
                      {new Date(post.scheduled_at).toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </div>
                    <div className="font-bold" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>
                      {new Date(post.scheduled_at).getDate()}
                    </div>
                    <div className="font-semibold" style={{ fontSize: '0.85rem' }}>
                      {new Date(post.scheduled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem' }}>
                    <div className="flex justify-between mb-sm" style={{ alignItems: 'center' }}>
                      <span className={`platform-badge platform-${post.platform}`}>{post.platform}</span>
                      {getStatusBadge(post)}
                    </div>

                    {imageUrls.length > 0 && (
                      <div className="flex gap-xs mb-sm" style={{ overflowX: 'auto' }}>
                        {imageUrls.slice(0, 4).map((url, i) => (
                          <img key={i} src={url} alt={`Post image ${i + 1}`}
                            style={{ height: '70px', width: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                          />
                        ))}
                      </div>
                    )}

                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
                      {post.caption.length > 300 ? post.caption.slice(0, 300) + '...' : post.caption}
                    </p>

                    {post.status === 'failed' && post.error_log && (
                      <div style={{ background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--error)' }}>
                        ⚠ {post.error_log}
                      </div>
                    )}

                    {publishResult?.id === post.id && (
                      <div style={{ background: 'var(--glass)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                        {publishResult.message}
                      </div>
                    )}

                    <div className="flex items-center gap-sm" style={{ paddingTop: '0.75rem', borderTop: '1px dashed var(--border)' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{post.products?.name}</span>
                      <div className="ml-auto flex gap-sm">
                        {post.status !== 'published' && (
                          <button onClick={() => deletePost(post.id)} disabled={isLoading} className="btn btn-ghost" style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', fontSize: '0.8rem' }}>Hủy</button>
                        )}
                        {!post.is_approved && post.status !== 'published' && (
                          <button onClick={() => approvePost(post.id)} disabled={isLoading} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                            {isLoading ? '...' : '✓ Duyệt bài'}
                          </button>
                        )}
                        {post.status !== 'published' && post.platform === 'facebook' && (
                          <button onClick={() => markAsManuallyPublished(post.id)} disabled={isLoading} className="btn btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: '#10B981', color: '#fff' }}>
                            {isLoading ? '⏳...' : '✅ Đã tự đăng'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Legend ═══ */}
      <div style={{
        display: 'flex', gap: '1.5rem', padding: '0.75rem 1rem',
        background: 'var(--surface)', borderRadius: 'var(--radius)',
        border: '1px solid var(--border)', fontSize: '0.75rem',
        color: 'var(--text-muted)', flexWrap: 'wrap', marginTop: '1rem',
      }}>
        <span>Chú thích:</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} /> Chờ đăng
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} /> Đã đăng
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} /> Lỗi
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #94A3B8', background: 'transparent', display: 'inline-block' }} /> Editorial plan
        </span>
      </div>
    </>
  );
}
