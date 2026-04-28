'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { saveToHistory } from './HistoryTab';
import type { HistoryEntry } from './HistoryTab';

interface AIWriterTabProps {
  products: { id: string; name: string }[];
  reuseEntry?: HistoryEntry | null;
  onReuseConsumed?: () => void;
}

const CONTENT_PILLARS = [
  { key: 'lifestyle_moment', icon: '🏠', label: 'Lifestyle' },
  { key: 'education', icon: '📚', label: 'Kiến thức' },
  { key: 'social_proof', icon: '⭐', label: 'Social Proof' },
  { key: 'soft_offer', icon: '💎', label: 'Soft Offer' },
  { key: 'food_pairing', icon: '🍽️', label: 'Food Pairing' },
  { key: 'storytelling', icon: '📖', label: 'Storytelling' },
  { key: 'engagement', icon: '💬', label: 'Tương tác' },
  { key: 'behind_scenes', icon: '🎬', label: 'Hậu trường' },
];

const QUICK_IDEAS = [
  'Tối thứ 6, after-work trên sân thượng',
  'BBQ sân vườn cuối tuần với anh em',
  'Mưa Sài Gòn, ban công, bia đen',
  'Gym xong uống gì thay nước ngọt?',
  'Tặng quà sếp dịp sinh nhật',
  'Xem bóng đá Champions League đêm',
  'Nấu pasta tối nay, cần bia gì?',
  'Lần đầu thử bia lúa mì',
  'Road trip Đà Lạt cuối tuần',
  'Giải thích Reinheitsgebot cho bạn bè',
];

interface ReviewResult {
  score: number;
  checks: { name: string; passed: boolean; detail: string }[];
  blacklistFound: string[];
  suggestions: string[];
}

interface ParsedContent {
  caption: string;
  hashtags: string[];
  image_prompt?: string;
}

export default function AIWriterTab({ products, reuseEntry, onReuseConsumed }: AIWriterTabProps) {
  const [idea, setIdea] = useState('');
  const [pillar, setPillar] = useState('lifestyle_moment');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState('');
  const [streamContent, setStreamContent] = useState('');
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Handle reuse from history
  useEffect(() => {
    if (reuseEntry) {
      setIdea(reuseEntry.idea);
      setPillar(reuseEntry.pillar);
      setPlatform(reuseEntry.platform);
      setParsedContent(null);
      setReview(null);
      setSavedId(null);
      setStreamContent('');
      setThinking('');
      onReuseConsumed?.();
    }
  }, [reuseEntry, onReuseConsumed]);

  const productName = products.find(p => p.id === selectedProduct)?.name || '';

  const handleGenerate = useCallback(async () => {
    if (!idea.trim()) return alert('Nhập ý tưởng trước nhé!');

    setLoading(true);
    setThinking('');
    setStreamContent('');
    setParsedContent(null);
    setReview(null);
    setSavedId(null);
    setIsEditing(false);
    setShowThinking(false);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/content/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          productId: selectedProduct || undefined,
          productName,
          pillar,
          platform,
          saveToDb: false,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'API error');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'thinking') {
              setThinking(prev => prev + data.text);
            } else if (data.type === 'content') {
              setStreamContent(prev => prev + data.text);
            } else if (data.type === 'done') {
              if (data.content) {
                setParsedContent(data.content);
                setEditCaption(data.content.caption);
                // Auto-save to localStorage history
                saveToHistory({
                  idea,
                  pillar,
                  platform,
                  productName,
                  caption: data.content.caption,
                  hashtags: data.content.hashtags || [],
                  imagePrompt: data.content.image_prompt,
                  score: data.review?.score ?? 0,
                });
              }
              if (data.review) setReview(data.review);
              if (data.savedId) setSavedId(data.savedId);
              setLoading(false);
            } else if (data.type === 'error') {
              alert('Lỗi AI: ' + data.error);
              setLoading(false);
            }
          } catch {
            // skip malformed SSE
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
      }
    } finally {
      setLoading(false);
    }
  }, [idea, selectedProduct, productName, pillar, platform]);

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const handleSaveToDb = async () => {
    const caption = isEditing ? editCaption : parsedContent?.caption;
    if (!caption) return;

    try {
      const res = await fetch('/api/content/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: '(saved from AI Writer)',
          productId: selectedProduct || undefined,
          productName,
          pillar,
          platform,
          saveToDb: true,
        }),
      });

      // For save, we don't need streaming — but our API always streams
      // So we just read the stream to completion
      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
      }

      // Find the done event to get savedId
      const doneMatch = buffer.match(/data: (\{.*"type":"done".*\})/);
      if (doneMatch) {
        const data = JSON.parse(doneMatch[1]);
        if (data.savedId) {
          setSavedId(data.savedId);
          alert('Đã lưu thành công!');
        }
      }
    } catch {
      alert('Lỗi khi lưu');
    }
  };

  const handleCopy = () => {
    const caption = isEditing ? editCaption : parsedContent?.caption || streamContent;
    const hashtags = parsedContent?.hashtags?.join(' ') || '';
    navigator.clipboard.writeText(caption + '\n\n' + hashtags);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '2rem' }}>
      {/* ─── Config Panel ─── */}
      <div className="card" style={{ alignSelf: 'start' }}>
        <h3 className="font-semibold mb-lg" style={{ fontSize: '1.1rem' }}>✍️ AI Writer</h3>
        <p className="text-sm text-muted mb-lg">
          Đưa ý tưởng → AI viết content chuẩn brand tự động
        </p>

        {/* Quick Ideas */}
        <div className="form-group">
          <label className="form-label">⚡ Ý TƯỞNG NHANH</label>
          <div className="flex flex-wrap gap-xs">
            {QUICK_IDEAS.map(q => (
              <button
                key={q}
                onClick={() => setIdea(q)}
                className="chip"
                style={{
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  background: idea === q ? 'var(--primary-glow)' : 'var(--surface-2)',
                  color: idea === q ? 'var(--primary)' : 'var(--text-muted)',
                  border: idea === q ? '1px solid var(--primary)' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Idea Textarea */}
        <div className="form-group">
          <label className="form-label">📝 Ý TƯỞNG CỦA BẠN</label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Mô tả ý tưởng bài viết... VD: Tối thứ 6, mở Dunkel uống một mình trên ban công, nghe mưa rào"
            rows={4}
            className="form-textarea"
            style={{ resize: 'vertical' }}
          />
          <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>{idea.length} ký tự</div>
        </div>

        {/* Content Pillar */}
        <div className="form-group">
          <label className="form-label">🎯 CONTENT PILLAR</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {CONTENT_PILLARS.map(p => (
              <button
                key={p.key}
                onClick={() => setPillar(p.key)}
                className={`platform-btn ${pillar === p.key ? 'active' : ''}`}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  justifyContent: 'flex-start',
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.6rem',
                  ...(pillar === p.key ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : {}),
                }}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product */}
        <div className="form-group">
          <label className="form-label">🍺 SẢN PHẨM</label>
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="form-select"
          >
            <option value="">-- Auto detect --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div className="form-group">
          <label className="form-label">📱 PLATFORM</label>
          <div className="flex gap-sm">
            {['facebook', 'tiktok', 'instagram'].map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`platform-btn ${platform === p ? 'active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        {loading ? (
          <button
            className="btn btn-primary justify-center"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', background: 'var(--error)' }}
            onClick={handleStop}
          >
            ⏹️ Dừng
          </button>
        ) : (
          <button
            className="btn btn-primary justify-center"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            onClick={handleGenerate}
          >
            ✍️ Viết Content
          </button>
        )}
      </div>

      {/* ─── Output Panel ─── */}
      <div className="card" style={{ alignSelf: 'start', minHeight: '500px' }}>
        <div className="flex justify-between items-center mb-lg">
          <h3 className="font-semibold" style={{ fontSize: '1.1rem' }}>
            Bản Thảo AI {parsedContent ? '✅' : ''}
          </h3>
          {review && (
            <span
              className={`badge ${review.score >= 8 ? 'badge-success' : review.score >= 6 ? 'badge-warning' : 'badge-error'}`}
              style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}
            >
              Humanizer: {review.score}/10
            </span>
          )}
        </div>

        {/* Empty State */}
        {!loading && !streamContent && !parsedContent && (
          <div className="empty-state">
            <div className="empty-state-icon">✍️</div>
            <p>Nhập ý tưởng → chọn pillar + sản phẩm → click &quot;Viết Content&quot;</p>
            <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
              AI sẽ phân tích ý tưởng + viết content chuẩn brand tự động.
            </p>
          </div>
        )}

        {/* Loading / Streaming */}
        {loading && (
          <div>
            {/* Thinking indicator */}
            {thinking && (
              <div style={{ marginBottom: '1rem' }}>
                <button
                  className="btn-inline"
                  onClick={() => setShowThinking(v => !v)}
                  style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}
                >
                  🧠 {showThinking ? 'Ẩn' : 'Xem'} quá trình phân tích ({thinking.length} ký tự)
                </button>
                {showThinking && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderLeft: '3px solid var(--primary)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    maxHeight: '200px',
                    overflow: 'auto',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {thinking}
                  </div>
                )}
              </div>
            )}

            {/* Content streaming */}
            {streamContent ? (
              <div className="preview-box" style={{ maxHeight: 'none', whiteSpace: 'pre-wrap' }}>
                {streamContent}
                <span className="blinking-cursor" style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: 'var(--primary)',
                  marginLeft: '2px',
                  animation: 'blink 1s infinite',
                }} />
              </div>
            ) : (
              <div className="text-center" style={{ padding: '3rem 2rem' }}>
                <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  AI đang phân tích & viết content...
                </h4>
                <p className="text-sm text-muted">Đang phân tích ý tưởng, kiểm tra brand rules và viết content.</p>
              </div>
            )}
          </div>
        )}

        {/* Final Result */}
        {!loading && parsedContent && (
          <div>
            {/* Caption */}
            <div className="content-card" style={{ marginBottom: '1rem' }}>
              <div className="flex justify-between items-center mb-md">
                <span className={`platform-badge platform-${platform}`}>{platform}</span>
                <div className="flex gap-xs">
                  <button
                    className="btn-inline"
                    onClick={() => { setIsEditing(!isEditing); if (!isEditing) setEditCaption(parsedContent.caption); }}
                  >
                    {isEditing ? '👁️ Xem' : '✏️ Sửa'}
                  </button>
                  <button className="btn-inline" onClick={handleCopy}>📋 Copy</button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="form-textarea"
                  rows={12}
                  style={{ width: '100%', fontSize: '0.9rem', lineHeight: '1.7' }}
                />
              ) : (
                <div className="preview-box" style={{ maxHeight: 'none', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                  {parsedContent.caption}
                </div>
              )}

              {/* Hashtags */}
              {parsedContent.hashtags?.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div className="flex flex-wrap gap-xs">
                    {parsedContent.hashtags.map((tag, i) => (
                      <span key={i} className="chip" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ Enhanced Humanizer Review ═══ */}
            {review && (
              <div className="card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
                {/* Score Header */}
                <div className="flex justify-between items-center mb-md">
                  <div className="font-bold" style={{ fontSize: '0.95rem' }}>
                    🔍 Humanizer Score
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem', fontWeight: 800,
                      color: review.score >= 8 ? '#22C55E' : review.score >= 6 ? '#F59E0B' : '#EF4444',
                    }}
                  >
                    {review.score}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/10</span>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div style={{
                  height: '8px', background: 'var(--glass)', borderRadius: '4px',
                  marginBottom: '1rem', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: '4px',
                    width: `${review.score * 10}%`,
                    background: review.score >= 8
                      ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                      : review.score >= 6
                        ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                        : 'linear-gradient(90deg, #EF4444, #F87171)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>

                {/* Individual Checks with Progress Bars */}
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {review.checks.map((check, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: check.passed ? 'rgba(34, 197, 94, 0.04)' : 'rgba(239, 68, 68, 0.04)',
                        border: `1px solid ${check.passed ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'}`,
                      }}
                    >
                      <div className="flex justify-between items-center" style={{ marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 600, color: check.passed ? '#22C55E' : '#EF4444', fontSize: '0.8rem' }}>
                          {check.passed ? '✅' : '❌'} {check.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: check.passed ? '#22C55E' : '#EF4444' }}>
                          {check.passed ? '100%' : '0%'}
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div style={{ height: '3px', background: 'var(--glass)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.2rem' }}>
                        <div style={{
                          height: '100%', borderRadius: '2px',
                          width: check.passed ? '100%' : '0%',
                          background: check.passed ? '#22C55E' : '#EF4444',
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {check.detail}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blacklist Words */}
                {review.blacklistFound.length > 0 && (
                  <div style={{
                    marginTop: '0.75rem', padding: '0.6rem 0.75rem',
                    background: 'rgba(239, 68, 68, 0.06)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                  }}>
                    <div style={{ fontWeight: 600, color: '#EF4444', fontSize: '0.8rem', marginBottom: '0.3rem' }}>⚠️ Từ Blacklist phát hiện:</div>
                    <div className="flex flex-wrap gap-xs">
                      {review.blacklistFound.map((word, i) => (
                        <span key={i} style={{
                          padding: '0.15rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px',
                          background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444',
                          textDecoration: 'line-through',
                        }}>
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-fix Suggestions */}
                {review.suggestions.length > 0 && (
                  <div style={{
                    marginTop: '0.75rem', padding: '0.6rem 0.75rem',
                    background: 'rgba(59, 130, 246, 0.04)', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(59, 130, 246, 0.12)',
                  }}>
                    <div style={{ fontWeight: 600, color: '#3B82F6', fontSize: '0.8rem', marginBottom: '0.3rem' }}>💡 Gợi ý cải thiện:</div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {review.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Image Prompt */}
            {parsedContent.image_prompt && (
              <div className="account-detail" style={{ marginBottom: '1rem', padding: '0.75rem' }}>
                <div className="form-label" style={{ color: 'var(--primary)' }}>📸 Image Prompt</div>
                <div className="text-sm text-muted" style={{ fontStyle: 'italic' }}>{parsedContent.image_prompt}</div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-sm">
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleSaveToDb}
                disabled={!!savedId}
              >
                {savedId ? '✅ Đã lưu' : '💾 Lưu vào Content Library'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={handleGenerate}
              >
                🔄 Viết lại
              </button>
            </div>

            {/* Thinking recap */}
            {thinking && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  className="btn-inline"
                  onClick={() => setShowThinking(v => !v)}
                  style={{ fontSize: '0.75rem' }}
                >
                  🧠 {showThinking ? 'Ẩn' : 'Xem'} quá trình phân tích ({thinking.length} ký tự)
                </button>
                {showThinking && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.04)',
                    borderLeft: '3px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    maxHeight: '300px',
                    overflow: 'auto',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {thinking}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
