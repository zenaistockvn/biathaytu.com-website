'use client';

import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  meta_description: string | null;
  word_count: number | null;
  micro_content_count: number | null;
  status: string | null;
  created_at: string | null;
  products?: { name: string } | null;
}

interface MicroContent {
  caption: string;
  format: string;
  slide_number?: number;
}

const FORMAT_LABELS: Record<string, { icon: string; label: string }> = {
  carousel_slide: { icon: '🎠', label: 'Carousel Slide' },
  quote_card: { icon: '💬', label: 'Quote Card' },
  tip: { icon: '💡', label: 'Tip' },
  social_snippet: { icon: '📱', label: 'Social Snippet' },
};

const SEO_TOPICS = [
  'Hướng dẫn chọn bia Đức cho người mới bắt đầu',
  'So sánh Weissbier vs Pilsner — Đâu là lựa chọn cho bạn?',
  'Reinheitsgebot — Luật Tinh khiết Bia Đức 500 năm',
  'Top 5 cách kết hợp bia Đức với ẩm thực Việt Nam',
  'Lịch sử Tu viện Ettal và nghệ thuật nấu bia 400 năm',
  'Bia không cồn Đức — Xu hướng mới cho lối sống năng động',
];

export default function BlogClient({
  products,
  initialArticles,
}: {
  products: { id: string; name: string; category: string | null }[];
  initialArticles: Article[];
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [splitting, setSplitting] = useState<string | null>(null);
  const [microResults, setMicroResults] = useState<Record<string, MicroContent[]>>({});
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedProduct || !topic) return alert('Chọn sản phẩm và chủ đề!');
    setLoading(true);
    try {
      const res = await fetch('/api/content/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct,
          topic,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.article) {
        setArticles(prev => [data.article, ...prev]);
        setTopic('');
        setKeywords('');
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

  const handleSplit = async (articleId: string) => {
    setSplitting(articleId);
    try {
      const res = await fetch('/api/content/micro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });
      const data = await res.json();
      if (data.micro_contents) {
        setMicroResults(prev => ({ ...prev, [articleId]: data.micro_contents }));
        setArticles(prev =>
          prev.map(a =>
            a.id === articleId ? { ...a, micro_content_count: data.count } : a,
          ),
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + message);
    } finally {
      setSplitting(null);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '2rem', marginTop: '1.5rem' }}>
      {/* Panel tạo bài */}
      <div style={{ alignSelf: 'start' }}>
        <div className="card mb-lg">
          <h3 className="font-semibold mb-lg" style={{ fontSize: '1.1rem' }}>✍️ Tạo bài SEO mới</h3>

          <div className="form-group">
            <label className="form-label">Sản phẩm</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="form-select">
              <option value="">-- Chọn bia --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Chủ đề bài viết</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ví dụ: Hướng dẫn chọn bia Đức..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gợi ý chủ đề</label>
            <div className="flex flex-wrap gap-xs">
              {SEO_TOPICS.map((t, i) => (
                <button key={i} onClick={() => setTopic(t)} className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                  {t.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Keywords SEO (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="bia đức, weissbier, bia nhập khẩu"
              className="form-input"
            />
          </div>

          <button
            className="btn btn-primary justify-center"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '⏳ Đang viết bài SEO...' : '📝 Tạo bài SEO (1500-2000 từ)'}
          </button>
        </div>

        {/* Stats */}
        <div className="card">
          <h4 className="text-sm text-muted mb-md">📊 Thống kê</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="text-center" style={{ padding: '1rem', background: 'var(--glass)', borderRadius: 'var(--radius-sm)' }}>
              <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{articles.length}</div>
              <div className="text-sm text-muted">Bài SEO</div>
            </div>
            <div className="text-center" style={{ padding: '1rem', background: 'var(--glass)', borderRadius: 'var(--radius-sm)' }}>
              <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>
                {articles.reduce((sum, a) => sum + (a.micro_content_count || 0), 0)}
              </div>
              <div className="text-sm text-muted">Micro-content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách bài */}
      <div>
        {articles.length === 0 && !loading && (
          <div className="empty-state" style={{ padding: '4rem 2rem' }}>
            <div className="empty-state-icon">📝</div>
            <p>Chưa có bài SEO nào. Chọn sản phẩm và chủ đề để bắt đầu!</p>
          </div>
        )}

        {articles.map(article => (
          <div key={article.id} className="card mb-lg">
            <div className="flex justify-between items-center mb-md" style={{ alignItems: 'flex-start' }}>
              <div>
                <h3 className="font-semibold" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{article.title}</h3>
                <div className="flex gap-md text-sm text-muted">
                  <span>📦 {article.products?.name || 'N/A'}</span>
                  <span>📝 {article.word_count} từ</span>
                  <span>📅 {article.created_at ? new Date(article.created_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>
              </div>
              <div className="flex gap-sm">
                {(article.micro_content_count ?? 0) > 0 && (
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    🔀 {article.micro_content_count} micro
                  </span>
                )}
                <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>{article.status}</span>
              </div>
            </div>

            {article.meta_description && (
              <p className="text-sm text-muted mb-md" style={{ fontStyle: 'italic', padding: '0.75rem', background: 'var(--glass)', borderRadius: 'var(--radius-xs)' }}>
                {article.meta_description}
              </p>
            )}

            {/* Expandable content */}
            <div className="mb-md">
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
              >
                {expandedArticle === article.id ? '🔽 Thu gọn' : '▶️ Xem nội dung'}
              </button>
              {expandedArticle === article.id && (
                <div className="preview-box" style={{ marginTop: '0.75rem', maxHeight: '500px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                  {article.content}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-sm flex-wrap">
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                onClick={() => handleSplit(article.id)}
                disabled={splitting === article.id}
              >
                {splitting === article.id ? '⏳ Đang tách...' : '🔀 Tách Micro-content'}
              </button>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                onClick={() => navigator.clipboard.writeText(article.content)}
              >
                📋 Copy nội dung
              </button>
            </div>

            {/* Micro-content results */}
            {microResults[article.id] && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 className="font-semibold mb-md" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                  🔀 Micro-content ({microResults[article.id].length} pieces)
                </h4>
                <div className="grid-auto-fill grid-cols-auto-250">
                  {microResults[article.id].map((mc, i) => {
                    const fmt = FORMAT_LABELS[mc.format] || { icon: '📄', label: mc.format };
                    return (
                      <div key={i} className="content-card">
                        <div className="flex justify-between mb-sm">
                          <span className="text-sm font-semibold">{fmt.icon} {fmt.label}</span>
                          {mc.slide_number && (
                            <span className="text-xs text-muted">#{mc.slide_number}</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{mc.caption}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
