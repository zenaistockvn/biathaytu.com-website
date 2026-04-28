'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import AddProductModal from '@/components/AddProductModal';
import SchedulePostModal from '@/components/SchedulePostModal';
import Lightbox from '@/components/Lightbox';
import PromptModal from '@/components/PromptModal';
import ContentCard from '@/components/ContentCard';
import PickImageModal from '@/components/PickImageModal';
import EditContentModal from '@/components/EditContentModal';

import { getAutoImageForContent } from '@/lib/images';

interface ContentItem {
  id: string;
  caption: string;
  hashtags: string | null;
  platform: string;
  content_format: string | null;
  ai_score: number | null;
  status: string | null;
  image_urls: unknown;
  image_prompt: string | null;
  video_prompt: string | null;
  video_url: string | null;
  product_id: string | null;
  target_page_id: string | null;
  created_at?: string | null;
  products?: { name: string } | null;
  notes?: string | null;
}

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  images: unknown;
  ai_analysis: unknown;
}

function getContentImages(content: ContentItem, productName: string): string[] {
  const urls = content.image_urls;
  if (Array.isArray(urls) && urls.length > 0) return urls as string[];

  // Auto-assign official product images as fallback
  return getAutoImageForContent(content.id, productName, content.content_format);
}

const STRATEGY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  product_showcase: { label: 'Giới thiệu SP', emoji: '🎯', color: '#3B82F6' },
  storytelling: { label: 'Storytelling', emoji: '📖', color: '#8B5CF6' },
  food_pairing: { label: 'Food Pairing', emoji: '🍽️', color: '#F59E0B' },
  engagement: { label: 'Engagement', emoji: '💬', color: '#22C55E' },
  promotion: { label: 'Flash Sale', emoji: '⚡', color: '#EF4444' },
  educational: { label: 'Kiến thức', emoji: '🎓', color: '#06B6D4' },
  lifestyle: { label: 'Lifestyle', emoji: '✨', color: '#EC4899' },
  review: { label: 'Review', emoji: '📝', color: '#F97316' },
  viral: { label: 'Viral', emoji: '🔥', color: '#FF0050' },
  comparison: { label: 'So sánh', emoji: '⚖️', color: '#14B8A6' },
  behind_scenes: { label: 'Behind Scenes', emoji: '🎬', color: '#A855F7' },
  seasonal: { label: 'Seasonal', emoji: '🎄', color: '#EF4444' },
};

const PLATFORM_STYLES: Record<string, { bg: string; color: string }> = {
  facebook: { bg: 'rgba(24,119,242,0.15)', color: '#1877F2' },
  instagram: { bg: 'rgba(225,48,108,0.15)', color: '#E1306C' },
  tiktok: { bg: 'rgba(255,255,255,0.08)', color: '#fff' },
};

const STATUS_OPTIONS = [
  { value: 'all', label: '📋 Tất cả trạng thái' },
  { value: 'draft', label: '📝 Nháp' },
  { value: 'approved', label: '✅ Đã duyệt' },
  { value: 'needs_review', label: '⚠️ Cần review' },
  { value: 'published', label: '📤 Đã đăng' },
  { value: 'deleted', label: '🗑️ Thùng rác' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: '🕐 Mới nhất' },
  { value: 'oldest', label: '📅 Cũ nhất' },
  { value: 'score_high', label: '⭐ Score cao → thấp' },
  { value: 'score_low', label: '📊 Score thấp → cao' },
];

const ITEMS_PER_PAGE = 30;

interface SatPage {
  id: string;
  page_name: string;
  page_icon: string | null;
  page_role: string;
}

interface Props {
  initialProducts: ProductItem[];
  initialContents: ContentItem[];
  satellitePages: SatPage[];
}

export default function LibraryClientWrapper({ initialProducts, initialContents, satellitePages }: Props) {
  const [localContents, setLocalContents] = useState(initialContents);

  useEffect(() => {
    setLocalContents(initialContents);
  }, [initialContents]);

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'content'>('content');
  const [filterProduct, setFilterProduct] = useState('all');
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterPage, setFilterPage] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [promptModal, setPromptModal] = useState<{ type: 'image' | 'video'; content: string; title: string } | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [scheduleContent, setScheduleContent] = useState<ContentItem | null>(null);
  const [imagePickerContent, setImagePickerContent] = useState<ContentItem | null>(null);
  const [editContent, setEditContent] = useState<ContentItem | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // ═══ Filter + Search + Sort Pipeline ═══
  const processedContents = useMemo(() => {
    let items = localContents;

    // Filter
    items = items.filter((c) => {
      if (filterStatus === 'all' && c.status === 'deleted') return false;
      if (filterProduct !== 'all' && c.product_id !== filterProduct) return false;
      if (filterStrategy !== 'all' && c.content_format !== filterStrategy) return false;
      if (filterPlatform !== 'all' && c.platform !== filterPlatform) return false;
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (filterPage !== 'all') {
        if (filterPage === 'none' && c.target_page_id !== null) return false;
        if (filterPage !== 'none' && c.target_page_id !== filterPage) return false;
      }
      // Category filter (bia/vang)
      if (filterCategory !== 'all') {
        const product = initialProducts.find(p => p.id === c.product_id);
        if (!product || product.category !== filterCategory) return false;
      }
      return true;
    });

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      items = items.filter((c) =>
        c.caption.toLowerCase().includes(term) ||
        (c.hashtags && c.hashtags.toLowerCase().includes(term)) ||
        (c.products?.name && c.products.name.toLowerCase().includes(term))
      );
    }

    // Sort
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (a.created_at || '').localeCompare(b.created_at || '');
        case 'score_high':
          return (b.ai_score ?? 0) - (a.ai_score ?? 0);
        case 'score_low':
          return (a.ai_score ?? 0) - (b.ai_score ?? 0);
        case 'newest':
        default:
          return (b.created_at || '').localeCompare(a.created_at || '');
      }
    });

    return items;
  }, [localContents, filterProduct, filterStrategy, filterPlatform, filterPage, filterStatus, filterCategory, searchTerm, sortBy, initialProducts]);

  // Paginated view
  const visibleContents = useMemo(
    () => processedContents.slice(0, visibleCount),
    [processedContents, visibleCount]
  );
  const hasMore = visibleCount < processedContents.length;

  const strategies = useMemo(() => {
    const map: Record<string, number> = {};
    localContents.forEach((c) => {
      const key = c.content_format || 'other';
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [localContents]);

  // Status counts
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = { draft: 0, approved: 0, needs_review: 0, published: 0 };
    localContents.forEach((c) => {
      const key = c.status || 'draft';
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [localContents]);

  const hasFilters = filterProduct !== 'all' || filterStrategy !== 'all' || filterPlatform !== 'all' || filterPage !== 'all' || filterStatus !== 'all' || filterCategory !== 'all' || searchTerm.trim() !== '';

  // ═══ Bulk Actions ═══
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allVisibleIds = visibleContents.map(c => c.id);
    setSelectedIds(new Set(allVisibleIds));
  }, [visibleContents]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const executeBulkAction = useCallback(async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedIds.size === 0) return;

    if (action === 'delete' && !confirm(`Xóa ${selectedIds.size} content? Không thể hoàn tác.`)) return;

    setBulkLoading(true);
    try {
      const res = await fetch('/api/content/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), action }),
      });

      if (res.ok) {
        const data = await res.json();

        if (action === 'delete') {
          setLocalContents((prev) => prev.filter(c => !selectedIds.has(c.id)));
        } else {
          const newStatus = action === 'approve' ? 'approved' : 'draft';
          setLocalContents((prev) =>
            prev.map(c => selectedIds.has(c.id) ? { ...c, status: newStatus } : c)
          );
        }

        setSelectedIds(new Set());
        alert(`✅ ${data.message}`);
      } else {
        const err = await res.json();
        alert(`❌ Lỗi: ${err.error}`);
      }
    } catch (error) {
      alert(`❌ Lỗi kết nối: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setBulkLoading(false);
    }
  }, [selectedIds]);

  const handleSaveNote = useCallback(async (id: string, note: string) => {
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: note }),
      });
      if (res.ok) {
        setLocalContents(prev => prev.map(c => c.id === id ? { ...c, notes: note } : c));
      } else {
        console.error('Failed to save note');
      }
    } catch (err) {
      console.error('Error saving note', err);
    }
  }, []);

  const handleUpdateTargetPage = useCallback(async (id: string, pageId: string | null) => {
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_page_id: pageId }),
      });
      if (res.ok) {
        setLocalContents(prev => prev.map(c => c.id === id ? { ...c, target_page_id: pageId } : c));
      } else {
        alert('Lỗi cập nhật page!');
      }
    } catch (err) {
      alert('Lỗi kết nối!');
    }
  }, []);

  const handleDeleteContent = useCallback(async (id: string) => {
    if (!confirm('Bạn muốn chuyển bài này vào thùng rác?')) return;
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'deleted' }),
      });
      if (res.ok) {
        setLocalContents(prev => prev.map(c => c.id === id ? { ...c, status: 'deleted' } : c));
      } else {
        alert('Lỗi khi xóa!');
      }
    } catch (err) {
      alert('Lỗi kết nối!');
    }
  }, []);

  return (
    <>
      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
      {lightboxImg && <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />}
      {promptModal && (
        <PromptModal
          type={promptModal.type}
          title={promptModal.title}
          content={promptModal.content}
          onClose={() => setPromptModal(null)}
        />
      )}

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          onClick={() => setActiveTab('content')}
          className={activeTab === 'content' ? 'btn btn-primary' : 'btn btn-ghost'}
        >
          📝 Kho Content ({localContents.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={activeTab === 'products' ? 'btn btn-primary' : 'btn btn-ghost'}
        >
          📦 Sản phẩm ({initialProducts.length})
        </button>
      </div>

      {activeTab === 'content' && (
        <>
          {/* Strategy Stats */}
          <div className="grid-auto-fill grid-cols-auto-130 mb-lg">
            {Object.entries(strategies).sort((a, b) => b[1] - a[1]).map(([key, count]) => {
              const info = STRATEGY_LABELS[key] || { label: key, emoji: '📄', color: '#888' };
              const isActive = filterStrategy === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilterStrategy(isActive ? 'all' : key)}
                  className={`strategy-stat ${isActive ? 'active' : ''}`}
                  style={{ color: isActive ? info.color : undefined, borderColor: isActive ? info.color : undefined, background: isActive ? `${info.color}22` : undefined }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{info.emoji}</div>
                  <div className="text-xs font-semibold mb-sm">{info.label}</div>
                  <div className="font-bold">{count}</div>
                </button>
              );
            })}
          </div>

          {/* ═══ Search + Sort Bar ═══ */}
          <div
            style={{
              display: 'flex', gap: '0.75rem', marginBottom: '1rem',
              alignItems: 'center', flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
                placeholder="🔍 Tìm trong caption, hashtag, sản phẩm..."
                className="search-input"
                style={{
                  width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', color: 'var(--text)',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{
                position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', opacity: 0.5, pointerEvents: 'none',
              }}>🔍</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute', right: '0.5rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem',
                  }}
                >✕</button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
              style={{ minWidth: '170px' }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={() => { setBulkMode(!bulkMode); setSelectedIds(new Set()); }}
              className={`btn ${bulkMode ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              {bulkMode ? '✕ Thoát chọn' : '☑️ Chọn nhiều'}
            </button>
          </div>

          {/* ═══ Filters Row ═══ */}
          <div className="filter-row">
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setFilterProduct('all'); setVisibleCount(ITEMS_PER_PAGE); }} className="filter-select">
              <option value="all">🏷️ Tất cả danh mục</option>
              <option value="bia">🍺 Bia</option>
              <option value="vang">🍷 Vang</option>
            </select>

            <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="filter-select">
              <option value="all">📦 Tất cả sản phẩm</option>
              {initialProducts
                .filter(p => filterCategory === 'all' || p.category === filterCategory)
                .map(p => (
                <option key={p.id} value={p.id}>{p.category === 'vang' ? '🍷' : '🍺'} {p.name}</option>
              ))}
            </select>

            <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="filter-select">
              <option value="all">🌐 Tất cả platforms</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {satellitePages.length > 0 && (
              <select value={filterPage} onChange={e => setFilterPage(e.target.value)} className="filter-select">
                <option value="all">🛰️ Tất cả pages</option>
                <option value="none">📄 Chưa gán page</option>
                {satellitePages.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.page_icon} {sp.page_name}</option>
                ))}
              </select>
            )}

            {hasFilters && (
              <button
                onClick={() => { setFilterProduct('all'); setFilterStrategy('all'); setFilterPlatform('all'); setFilterPage('all'); setFilterStatus('all'); setFilterCategory('all'); setSearchTerm(''); }}
                className="btn btn-ghost"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                ✕ Xóa filter
              </button>
            )}

            <div className="ml-auto text-sm text-muted" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Status indicators */}
              <span style={{ color: '#94A3B8' }}>○ Nháp: {statusCounts.draft}</span>
              <span style={{ color: '#22C55E' }}>✓ Duyệt: {statusCounts.approved}</span>
              <span style={{ color: '#F59E0B' }}>⚠ Review: {statusCounts.needs_review}</span>
              <span style={{ fontWeight: 600 }}>
                Hiển thị {visibleContents.length}/{processedContents.length}
              </span>
            </div>
          </div>

          {/* ═══ Bulk Action Bar ═══ */}
          {bulkMode && (
            <div
              style={{
                display: 'flex', gap: '0.75rem', alignItems: 'center',
                padding: '0.75rem 1rem', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                marginBottom: '1rem', flexWrap: 'wrap',
              }}
            >
              <button
                onClick={selectedIds.size === visibleContents.length ? deselectAll : selectAll}
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                {selectedIds.size === visibleContents.length ? '☐ Bỏ chọn tất cả' : '☑ Chọn tất cả'}
              </button>

              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                {selectedIds.size} đã chọn
              </span>

              <div className="ml-auto flex gap-sm">
                <button
                  onClick={() => executeBulkAction('approve')}
                  disabled={selectedIds.size === 0 || bulkLoading}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', color: '#22C55E', padding: '0.4rem 0.8rem' }}
                >
                  ✓ Duyệt ({selectedIds.size})
                </button>
                <button
                  onClick={() => executeBulkAction('reject')}
                  disabled={selectedIds.size === 0 || bulkLoading}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', color: '#F59E0B', padding: '0.4rem 0.8rem' }}
                >
                  ↩ Về nháp ({selectedIds.size})
                </button>
                <button
                  onClick={() => executeBulkAction('delete')}
                  disabled={selectedIds.size === 0 || bulkLoading}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', color: 'var(--error)', padding: '0.4rem 0.8rem' }}
                >
                  🗑 Xóa ({selectedIds.size})
                </button>
              </div>
            </div>
          )}

          {/* Content List */}
          <div className="flex flex-col gap-md">
            {visibleContents.map((c) => {
              const pName = c.products?.name || initialProducts.find(p => p.id === c.product_id)?.name || '';
              const contentImages = getContentImages(c, pName);
              const info = STRATEGY_LABELS[c.content_format || ''] || { label: c.content_format || 'Khác', emoji: '📄', color: '#888' };
              const platformStyle = PLATFORM_STYLES[c.platform] || { bg: 'var(--glass)', color: 'var(--text-muted)' };

              return (
                <ContentCard
                  key={c.id}
                  content={c}
                  productName={pName}
                  contentImages={contentImages}
                  strategyInfo={info}
                  platformStyle={platformStyle}
                  onImageClick={setLightboxImg}
                  onPromptClick={(type, content, title) => setPromptModal({ type, content, title })}
                  onScheduleClick={() => setScheduleContent(c)}
                  onEditClick={() => setEditContent(c)}
                  onChangeImageClick={() => setImagePickerContent(c)}
                  selectable={bulkMode}
                  selected={selectedIds.has(c.id)}
                  onSelect={toggleSelect}
                  onSaveNote={handleSaveNote}
                  onDeleteClick={() => handleDeleteContent(c.id)}
                  satellitePages={satellitePages}
                  onTargetPageChange={handleUpdateTargetPage}
                />
              );
            })}

            {/* Load More */}
            {hasMore && (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="btn btn-ghost"
                  style={{ padding: '0.6rem 2rem', fontSize: '0.9rem' }}
                >
                  📥 Tải thêm ({processedContents.length - visibleCount} còn lại)
                </button>
              </div>
            )}

            {processedContents.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div>Không tìm thấy content nào với filter hiện tại</div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn btn-ghost"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Tất cả sản phẩm ({initialProducts.length})</span>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Thêm sản phẩm</button>
          </div>

          <div className="products-grid">
            {initialProducts.map((p) => {
              const contentCount = localContents.filter(c => c.product_id === p.id).length;
              const images = Array.isArray(p.images) ? p.images as string[] : [];
              return (
                <div key={p.id} className="product-card">
                  {images.length > 0 ? (
                    <div style={{ height: '140px', background: `url(${images[0]}) center/cover`, borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
                  ) : (
                    <div style={{ fontSize: '2.5rem', textAlign: 'center', padding: '1.5rem 0', background: 'var(--glass)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                      {p.category === 'vang' ? '🍷' : '🍺'}
                    </div>
                  )}
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc" style={{ minHeight: '2.4rem' }}>{p.description}</div>
                  <div className="flex gap-sm mb-md flex-wrap">
                    <span className="badge badge-warning">{p.category}</span>
                    {!!p.ai_analysis && <span className="badge badge-success">✓ AI Data</span>}
                    <span className="badge badge-info">📝 {contentCount} bài</span>
                  </div>
                  <div className="product-meta">
                    <span className="product-price">{p.price?.toLocaleString('vi-VN')}đ</span>
                    <button
                      onClick={() => { setActiveTab('content'); setFilterProduct(p.id); }}
                      className="btn-inline"
                      style={{ color: 'var(--primary)' }}
                    >
                      Xem content →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Post Modal */}
      {scheduleContent && (
        <SchedulePostModal
          content={{
            id: scheduleContent.id,
            caption: scheduleContent.caption,
            hashtags: scheduleContent.hashtags || '',
            platform: scheduleContent.platform,
            image_urls: Array.isArray(scheduleContent.image_urls) ? scheduleContent.image_urls as string[] : [],
            product_id: scheduleContent.product_id || '',
            target_page_id: scheduleContent.target_page_id,
          }}
          onClose={() => setScheduleContent(null)}
        />
      )}

      {/* Pick Image Modal */}
      {imagePickerContent && (
        <PickImageModal
          initialSelected={Array.isArray(imagePickerContent.image_urls) ? imagePickerContent.image_urls as string[] : []}
          onClose={() => setImagePickerContent(null)}
          onSelect={(urls) => {
            setLocalContents((prev) =>
              prev.map((c) =>
                c.id === imagePickerContent.id ? { ...c, image_urls: urls } : c
              )
            );
          }}
        />
      )}

      {/* Edit Content Modal */}
      {editContent && (
        <EditContentModal
          content={editContent}
          onClose={() => setEditContent(null)}
          onSuccess={(updated) => {
            setLocalContents((prev) =>
              prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
            );
            setEditContent(null);
          }}
        />
      )}
    </>
  );
}
