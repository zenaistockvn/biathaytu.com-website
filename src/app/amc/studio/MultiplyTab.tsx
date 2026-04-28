'use client';

import { useState } from 'react';

interface MultiplyResult {
  platform: string;
  caption: string;
  hashtags?: string;
  status: string;
  review?: {
    score: number;
  };
}

interface MultiplyTabProps {
  products: { id: string; name: string }[];
  initialSource?: string;
}

export default function MultiplyTab({ products, initialSource = '' }: MultiplyTabProps) {
  const [source, setSource] = useState(initialSource);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['instagram', 'tiktok', 'zalo']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MultiplyResult[] | null>(null);

  const togglePlatform = (p: string) => {
    setTargetPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleMultiply = async () => {
    if (!source.trim() || targetPlatforms.length === 0) {
      return alert('Nhập bài gốc và chọn ít nhất 1 nền tảng!');
    }
    setLoading(true);
    try {
      const productName = products.find(p => p.id === selectedProduct)?.name || '';
      const res = await fetch('/api/content/multiply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalCaption: source,
          targetPlatforms,
          productId: selectedProduct || undefined,
          productName,
        }),
      });
      const data = await res.json();
      if (data.variants) {
        setResults(data.variants);
      } else {
        alert('Lỗi: ' + (data.error || 'Unknown'));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem' }}>
      {/* Input Panel */}
      <div className="card" style={{ alignSelf: 'start' }}>
        <h3 className="font-semibold mb-lg" style={{ fontSize: '1.1rem' }}>🔄 Nhân bản đa kênh</h3>
        <p className="text-sm text-muted mb-lg">
          Paste 1 bài gốc → AI rewrite 4-6 phiên bản phù hợp từng nền tảng
        </p>

        <div className="form-group">
          <label className="form-label">Sản phẩm (tuỳ chọn)</label>
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="form-select">
            <option value="">-- Không chọn --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Bài gốc</label>
          <textarea
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="Paste caption gốc vào đây..."
            rows={6}
            className="form-textarea"
          />
          <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>{source.length} ký tự</div>
        </div>

        <div className="form-group">
          <label className="form-label">Nền tảng đích</label>
          <div className="flex flex-wrap gap-sm">
            {['facebook', 'instagram', 'tiktok', 'zalo', 'linkedin'].map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`platform-btn ${targetPlatforms.includes(p) ? 'active' : ''}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary justify-center"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          onClick={handleMultiply}
          disabled={loading}
        >
          {loading ? '⏳ Đang nhân bản...' : `🔄 Nhân bản → ${targetPlatforms.length} nền tảng`}
        </button>
      </div>

      {/* Results Panel */}
      <div className="card" style={{ alignSelf: 'start', minHeight: '500px' }}>
        <h3 className="font-semibold mb-lg" style={{ fontSize: '1.1rem' }}>
          Phiên bản đa kênh {results ? `(${results.length})` : ''}
        </h3>

        {!results && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">🔄</div>
            <p>Paste bài gốc → chọn nền tảng → AI tự rewrite phù hợp tone từng kênh.</p>
          </div>
        )}

        {loading && (
          <div className="text-center" style={{ padding: '4rem 2rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Đang nhân bản...</h4>
            <p className="text-sm text-muted">AI đang viết lại cho {targetPlatforms.join(', ')}</p>
          </div>
        )}

        {results && !loading && (
          <div className="flex flex-col" style={{ gap: '1.5rem' }}>
            {results.map((v, i) => (
              <div key={i} className="content-card">
                <div className="flex justify-between items-center mb-md">
                  <span className={`platform-badge platform-${v.platform}`}>{v.platform}</span>
                  {v.review && (
                    <span className={`badge ${v.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                      Score: {v.review.score}/10
                    </span>
                  )}
                </div>
                <div className="preview-box" style={{ maxHeight: 'none', whiteSpace: 'pre-wrap' }}>
                  {v.caption}
                  {v.hashtags && (
                    <div style={{ marginTop: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{v.hashtags}</div>
                  )}
                </div>
                <button
                  className="btn-inline"
                  onClick={() => navigator.clipboard.writeText(v.caption + (v.hashtags ? '\n' + v.hashtags : ''))}
                >
                  📋 Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
