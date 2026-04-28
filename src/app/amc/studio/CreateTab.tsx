'use client';

import { useState, useRef, useCallback } from 'react';

interface ContentResult {
  platform: string;
  caption: string;
  hashtags: string[];
  imagePrompt?: string;
  review?: {
    score: number;
    checks: { name: string; passed: boolean; detail: string }[];
    blacklistFound: string[];
    suggestions: string[];
  };
}

interface CreateTabProps {
  products: { id: string; name: string }[];
  onUseAsMultiplySource: (caption: string) => void;
}

const FRAMEWORKS = [
  { key: 'Storytelling', icon: '📖', desc: 'Kể chuyện 4 lớp' },
  { key: 'PAS', icon: '⚡', desc: 'Problem → Agitate → Solve' },
  { key: 'AIDA', icon: '🎯', desc: 'Attention → Interest → Desire → Action' },
  { key: 'Listicle', icon: '📑', desc: 'Danh sách mẹo/lý do' },
  { key: 'Educational', icon: '📚', desc: 'Chia sẻ kiến thức' },
  { key: 'Viral Hook', icon: '🚀', desc: 'Hook gây tò mò' },
];

const PLATFORM_OPTIONS = ['Facebook', 'TikTok', 'Instagram', 'LinkedIn'];

export default function CreateTab({ onUseAsMultiplySource }: CreateTabProps) {
  // Content inputs
  const [productInfo, setProductInfo] = useState('');
  const [idea, setIdea] = useState('');

  // Config
  const [framework, setFramework] = useState('Storytelling');
  const [tone, setTone] = useState('Casual');
  const [length, setLength] = useState('Medium');
  const [platforms, setPlatforms] = useState<string[]>(['facebook']);

  // State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ContentResult[] | null>(null);
  const [thinkingText, setThinkingText] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleGenerate = useCallback(async () => {
    if (!idea.trim() && !productInfo.trim()) {
      return alert('Nhập ý tưởng hoặc thông tin sản phẩm!');
    }
    if (platforms.length === 0) {
      return alert('Chọn ít nhất 1 nền tảng!');
    }

    setLoading(true);
    setResults(null);
    setThinkingText('');
    setShowThinking(false);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          productInfo,
          platforms,
          framework,
          tone,
          length,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'API error');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');

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
              setThinkingText(prev => prev + data.text);
            } else if (data.type === 'result') {
              setResults(data.results);
              setLoading(false);
            } else if (data.type === 'error') {
              alert('Lỗi: ' + data.error);
              setLoading(false);
            }
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
      }
    } finally {
      setLoading(false);
    }
  }, [idea, productInfo, platforms, framework, tone, length]);

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '2rem' }}>
      {/* Config Panel */}
      <div className="card" style={{ alignSelf: 'start' }}>
        <h3 className="font-semibold mb-md" style={{ fontSize: '1.1rem' }}>🚀 Tạo Content</h3>
        <p className="text-sm text-muted mb-lg">
          Nhập thông tin sản phẩm + ý tưởng → AI viết content chuẩn quy trình
        </p>

        {/* Product Info */}
        <div className="form-group">
          <label className="form-label">📦 THÔNG TIN SẢN PHẨM / THƯƠNG HIỆU</label>
          <textarea
            value={productInfo}
            onChange={e => setProductInfo(e.target.value)}
            placeholder={"VD: Cà phê rang xay Đà Lạt, 100% Arabica, giá 250k/500g, hậu vị chocolate đen, dành cho dân sành cà phê..."}
            rows={4}
            className="form-textarea"
            style={{ resize: 'vertical', fontSize: '0.85rem' }}
          />
          <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
            Mô tả càng chi tiết → content càng chuẩn. Gồm: tên, đặc điểm, USP, giá, đối tượng.
          </div>
        </div>

        {/* Idea */}
        <div className="form-group">
          <label className="form-label">💡 Ý TƯỞNG BÀI VIẾT</label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="VD: Buổi sáng mưa, ngồi ban công pha cà phê phin, nghe tiếng mưa rào..."
            rows={3}
            className="form-textarea"
            style={{ resize: 'vertical', fontSize: '0.85rem' }}
          />
        </div>

        {/* Framework */}
        <div className="form-group">
          <label className="form-label">CONTENT FRAMEWORK</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {FRAMEWORKS.map(fw => (
              <button
                key={fw.key}
                onClick={() => setFramework(fw.key)}
                className={`platform-btn ${framework === fw.key ? 'active' : ''}`}
                title={fw.desc}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  justifyContent: 'flex-start',
                  fontSize: '0.8rem',
                  padding: '0.45rem 0.6rem',
                  ...(framework === fw.key ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : {}),
                }}
              >
                {fw.icon} {fw.key}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="form-group">
          <label className="form-label">PLATFORM</label>
          <div className="flex flex-wrap gap-sm">
            {PLATFORM_OPTIONS.map(p => {
              const val = p.toLowerCase();
              const isActive = platforms.includes(val);
              return (
                <button
                  key={val}
                  onClick={() => togglePlatform(val)}
                  className={`platform-btn ${isActive ? 'active' : ''}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone + Length */}
        <div className="form-row mb-lg">
          <div>
            <label className="form-label">TONE</label>
            <select value={tone} onChange={e => setTone(e.target.value)} className="form-select">
              <option value="Casual">Casual</option>
              <option value="Story-driven">Story-driven</option>
              <option value="Viral">Viral</option>
              <option value="Professional">Professional</option>
              <option value="Humorous">Humorous</option>
              <option value="Formal">Formal</option>
            </select>
          </div>
          <div>
            <label className="form-label">LENGTH</label>
            <select value={length} onChange={e => setLength(e.target.value)} className="form-select">
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </select>
          </div>
        </div>

        {/* Button */}
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
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
            onClick={handleGenerate}
            disabled={loading}
          >
            🚀 Generate Content
          </button>
        )}
      </div>

      {/* Results Panel */}
      <div className="card" style={{ alignSelf: 'start', minHeight: '500px' }}>
        <h3 className="font-semibold mb-lg" style={{ fontSize: '1.1rem' }}>Bản Thảo AI (Drafts)</h3>

        {!results && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">✨</div>
            <p>Nhập thông tin sản phẩm + ý tưởng, chọn framework và click &quot;Generate Content&quot;</p>
          </div>
        )}

        {loading && (
          <div>
            {/* Thinking indicator */}
            {thinkingText && (
              <div style={{ marginBottom: '1rem' }}>
                <button
                  className="btn-inline"
                  onClick={() => setShowThinking(v => !v)}
                  style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}
                >
                  🧠 {showThinking ? 'Ẩn' : 'Xem'} quá trình phân tích ({thinkingText.length} ký tự)
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
                    {thinkingText}
                  </div>
                )}
              </div>
            )}

            <div className="text-center" style={{ padding: '3rem 2rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                AI đang viết content...
              </h4>
              <p className="text-sm text-muted">
                Đang tạo content cho {platforms.join(', ')}
              </p>
            </div>
          </div>
        )}

        {results && !loading && (
          <div className="flex flex-col" style={{ gap: '1.5rem' }}>
            {results.map((r, i) => (
              <div key={i} className="content-card">
                <div className="flex justify-between items-center mb-md">
                  <span className={`platform-badge platform-${r.platform}`}>{r.platform}</span>
                  {r.review && (
                    <span className={`badge ${r.review.score >= 8 ? 'badge-success' : r.review.score >= 6 ? 'badge-warning' : 'badge-error'}`}>
                      Score: {r.review.score}/10
                    </span>
                  )}
                </div>

                <div className="preview-box" style={{ maxHeight: 'none', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                  {r.caption}
                  {r.hashtags?.length > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div className="flex flex-wrap gap-xs">
                        {r.hashtags.map((tag, j) => (
                          <span key={j} className="chip" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Humanizer checks */}
                {r.review && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-xs)' }}>
                    <div className="text-xs font-bold mb-sm" style={{ color: 'var(--text-muted)' }}>
                      Humanizer: {r.review.checks.filter(c => c.passed).length}/6
                    </div>
                    <div className="flex flex-wrap gap-xs">
                      {r.review.checks.map((check, j) => (
                        <span key={j} className="chip" style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.4rem',
                          background: check.passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: check.passed ? 'var(--success)' : 'var(--error)',
                        }}>
                          {check.passed ? '✅' : '❌'} {check.name}
                        </span>
                      ))}
                    </div>
                    {r.review.blacklistFound.length > 0 && (
                      <div className="text-xs text-muted" style={{ marginTop: '0.4rem' }}>
                        ⚠️ Blacklist: {r.review.blacklistFound.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-sm" style={{ marginTop: '0.75rem' }}>
                  <button className="btn-inline" onClick={() => onUseAsMultiplySource(r.caption)}>
                    🔄 Nhân bản đa kênh
                  </button>
                  <button
                    className="btn-inline"
                    onClick={() => handleCopy(r.caption + '\n\n' + (r.hashtags?.join(' ') || ''), i)}
                  >
                    {copiedIdx === i ? '✅ Đã copy!' : '📋 Copy'}
                  </button>
                </div>

                {/* Image prompt */}
                {r.imagePrompt && (
                  <div className="account-detail" style={{ marginTop: '0.5rem', padding: '0.5rem' }}>
                    <div className="text-xs" style={{ color: 'var(--primary)', fontWeight: 600 }}>📸 Image Prompt</div>
                    <div className="text-xs text-muted" style={{ fontStyle: 'italic' }}>{r.imagePrompt}</div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking recap */}
            {thinkingText && (
              <div>
                <button
                  className="btn-inline"
                  onClick={() => setShowThinking(v => !v)}
                  style={{ fontSize: '0.75rem' }}
                >
                  🧠 {showThinking ? 'Ẩn' : 'Xem'} quá trình phân tích
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
                    maxHeight: '250px',
                    overflow: 'auto',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {thinkingText}
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
