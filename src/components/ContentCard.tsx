'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';

/**
 * Chuyển caption text thành React elements với <br/> thay vì dùng CSS white-space.
 * Lý do: -webkit-line-clamp không tương thích với white-space: pre-wrap/pre-line.
 */
function renderCaption(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}

interface ContentCardProps {
  content: {
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
    target_page_id?: string | null;
    products?: { name: string } | null;
    notes?: string | null;
  };
  productName: string;
  contentImages: string[];
  strategyInfo: { label: string; emoji: string; color: string };
  platformStyle: { bg: string; color: string };
  onImageClick: (url: string) => void;
  onPromptClick: (type: 'image' | 'video', content: string, title: string) => void;
  onScheduleClick: () => void;
  onEditClick: () => void;
  onChangeImageClick?: () => void;
  onDeleteClick?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onSaveNote?: (id: string, note: string) => void;
  satellitePages?: { id: string; page_name: string; page_icon: string | null }[];
  onTargetPageChange?: (id: string, pageId: string | null) => void;
}

const STATUS_BADGES: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'Nháp', bg: 'rgba(148,163,184,0.15)', color: '#94A3B8' },
  approved: { label: 'Đã duyệt', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
  needs_review: { label: 'Cần review', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  published: { label: 'Đã đăng', bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  ready: { label: 'Sẵn sàng', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
  deleted: { label: 'Thùng rác', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
};

export default function ContentCard({
  content: c,
  productName,
  contentImages,
  strategyInfo: info,
  platformStyle,
  onImageClick,
  onPromptClick,
  onScheduleClick,
  onEditClick,
  onChangeImageClick,
  selectable = false,
  selected = false,
  onSelect,
  onSaveNote,
  onDeleteClick,
  satellitePages,
  onTargetPageChange,
}: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState(c.notes || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNote(c.notes || '');
  }, [c.notes]);

  const hasVideo = !!c.video_url;
  const hasMedia = contentImages.length > 0 || hasVideo;

  const copyCaption = async () => {
    await navigator.clipboard.writeText(c.caption + '\n\n' + (c.hashtags || ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`content-card ${selected ? 'content-card-selected' : ''}`}
      style={{
        borderLeft: `3px solid ${info.color}`,
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'stretch',
        padding: '1.25rem',
        outline: selected ? '2px solid var(--primary)' : 'none',
        outlineOffset: '-2px',
      }}
    >
      {/* Checkbox for bulk selection */}
      {selectable && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: '0.25rem',
            flexShrink: 0,
          }}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect?.(c.id)}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
        </div>
      )}
      {/* Media Column */}
      {hasMedia && (
        <div className="media-column" style={{ width: '40%', flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'flex-start' }}>
          {contentImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className="media-thumb"
              onClick={() => onImageClick(imgUrl)}
              style={{
                width: contentImages.length === 1 && !hasVideo ? '100%' : '180px',
                height: contentImages.length === 1 && !hasVideo ? '240px' : '140px',
              }}
            >
              <img 
                src={imgUrl} 
                alt={`Content visual ${idx + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'rgba(0,0,0,0.05)' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('hero_weissbier_v2.png') && !target.src.includes('hero_dunkel_v2.png')) {
                    // Cố gắng lấy ảnh fallback dựa trên tên sản phẩm
                    if (productName.toLowerCase().includes('dunkel')) {
                      target.src = '/images/products/hero_dunkel_v2.png';
                    } else if (productName.toLowerCase().includes('bitburger')) {
                      target.src = '/images/products/hero_bitburger_v2.png';
                    } else {
                      target.src = '/images/products/hero_weissbier_v2.png';
                    }
                  }
                }}
              />
              <div className="media-overlay">
                🔍 {contentImages.length > 1 ? `${idx + 1}/${contentImages.length}` : 'Xem lớn'}
              </div>
            </div>
          ))}
          {hasVideo && (
            <div
              className="media-thumb"
              style={{
                width: '100%',
                height: contentImages.length > 0 ? '140px' : '260px',
                background: '#000',
              }}
            >
              <video
                src={c.video_url!}
                controls
                preload="metadata"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="media-badge" style={{ background: 'rgba(236,72,153,0.9)' }}>
                🎬 Video
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Column */}
      <div className="content-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header chips */}
        <div className="content-card-header" style={{ flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <span className="chip" style={{ background: `${info.color}22`, color: info.color }}>
          {info.emoji} {info.label}
        </span>
        <span
          className="platform-badge"
          style={{ background: platformStyle.bg, color: platformStyle.color }}
        >
          {c.platform}
        </span>
        
        {satellitePages && satellitePages.length > 0 && (
          <select
            value={c.target_page_id || ''}
            onChange={(e) => onTargetPageChange?.(c.id, e.target.value || null)}
            style={{ 
              padding: '0.1rem 0.4rem', 
              background: 'transparent', 
              border: '1px solid var(--border)', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--text-muted)' 
            }}
          >
            <option value="">-- Page mặc định --</option>
            {satellitePages.map(sp => (
              <option key={sp.id} value={sp.id}>{sp.page_icon} {sp.page_name}</option>
            ))}
          </select>
        )}

        <span className="text-sm text-muted">{productName}</span>

        {contentImages.length > 0 && (
          <span className="chip-sm" style={{ background: 'rgba(168,85,247,0.12)', color: '#A855F7' }}>
            🖼️ {contentImages.length} ảnh
          </span>
        )}
        {hasVideo && (
          <span className="chip-sm" style={{ background: 'rgba(236,72,153,0.12)', color: '#EC4899' }}>
            🎬 Video
          </span>
        )}
        {c.ai_score && (
          <span
            className="ml-auto text-sm font-bold"
            style={{
              color: c.ai_score >= 9 ? 'var(--success)' : c.ai_score >= 8 ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            ⭐ {c.ai_score}/10
          </span>
        )}
        {c.status && STATUS_BADGES[c.status] && (
          <span className="chip" style={{ background: STATUS_BADGES[c.status].bg, color: STATUS_BADGES[c.status].color, fontSize: '0.7rem' }}>
            {c.status === 'approved' ? '✓' : c.status === 'published' ? '📤' : '○'} {STATUS_BADGES[c.status].label}
          </span>
        )}
      </div>

        <div
          className={`caption-preview ${!expanded ? 'caption-clamped' : ''}`}
          onClick={() => setExpanded(!expanded)}
          style={{ flex: 1, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', cursor: 'pointer', overflowY: expanded ? 'auto' : 'hidden', maxHeight: expanded ? '400px' : 'none' }}
        >
          {renderCaption(c.caption)}
        </div>

        {/* Note section */}
        <div style={{ marginTop: '1rem', position: 'relative' }}>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSaved(false);
            }}
            onBlur={() => {
              if (note !== (c.notes || '') && onSaveNote) {
                onSaveNote(c.id, note);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }
            }}
            placeholder="📝 Ghi chú đánh giá (ví dụ: cần chỉnh ảnh, sửa content...)"
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '0.75rem',
              paddingBottom: '2.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.05)',
              color: 'var(--text)',
              fontSize: '0.9rem',
              resize: 'vertical',
            }}
          />
          {note !== (c.notes || '') && !saved && (
             <button
               onClick={() => {
                 if (onSaveNote) {
                   onSaveNote(c.id, note);
                   setSaved(true);
                   setTimeout(() => setSaved(false), 2000);
                 }
               }}
               style={{
                 position: 'absolute',
                 bottom: '12px',
                 right: '12px',
                 background: '#F59E0B',
                 color: 'white',
                 border: 'none',
                 padding: '4px 12px',
                 borderRadius: '4px',
                 fontSize: '0.8rem',
                 fontWeight: 600,
                 cursor: 'pointer'
               }}
             >
               Lưu
             </button>
          )}
          {saved && (
             <span
               style={{
                 position: 'absolute',
                 bottom: '16px',
                 right: '16px',
                 color: 'var(--success)',
                 fontSize: '0.85rem',
                 fontWeight: 'bold',
               }}
             >
               ✓ Đã lưu
             </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="content-card-footer" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <button className="btn-link" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲ Thu gọn' : '▼ Xem đầy đủ'}
        </button>

        <button
          className="btn-inline"
          onClick={copyCaption}
          style={copied ? { background: 'var(--success-bg)', borderColor: 'var(--success)', color: 'var(--success)' } : {}}
        >
          {copied ? '✓ Đã copy' : '📋 Copy'}
        </button>

        <button
          className="btn-inline"
          style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)', color: '#F59E0B' }}
          onClick={onEditClick}
        >
          ✏️ Sửa
        </button>

        {c.image_prompt && (
          <button
            className="btn-inline"
            style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)', color: '#A855F7' }}
            onClick={() => onPromptClick('image', c.image_prompt!, 'Prompt tạo ảnh AI')}
          >
            🖼️ Prompt Ảnh
          </button>
        )}

        {c.video_prompt && (
          <button
            className="btn-inline"
            style={{ background: 'rgba(236,72,153,0.1)', borderColor: 'rgba(236,72,153,0.3)', color: '#EC4899' }}
            onClick={() => onPromptClick('video', c.video_prompt!, 'Prompt tạo Video / Storyboard')}
          >
            🎬 Prompt Video
          </button>
        )}

        {onChangeImageClick && (
          <button
            className="btn-inline"
            style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)', color: '#3B82F6' }}
            onClick={onChangeImageClick}
          >
            🔄 Đổi ảnh
          </button>
        )}

        <button
          className="btn-inline"
          style={{ background: 'rgba(24,119,242,0.1)', borderColor: 'rgba(24,119,242,0.3)', color: '#1877F2' }}
          onClick={onScheduleClick}
        >
          📤 Đăng bài
        </button>

        {onDeleteClick && (
          <button
            className="btn-inline"
            style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}
            onClick={onDeleteClick}
          >
            🗑️ Xóa
          </button>
        )}

        {c.hashtags && (
          <div className="text-xs ml-auto truncate" style={{ color: 'var(--info)', maxWidth: '250px' }}>
            {c.hashtags}
          </div>
        )}
      </div>
     </div>
    </div>
  );
}
