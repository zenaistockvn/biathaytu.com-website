'use client';

import { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { PLATFORM_LABELS } from '@/constants';
import type { Platform } from '@/types';

/** Render caption text with proper line breaks */
function renderCaption(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}

interface SchedulePostModalProps {
  content: {
    id: string;
    caption: string;
    hashtags?: string;
    platform: string;
    image_urls?: string[];
    product_id?: string;
    target_page_id?: string | null;
  };
  onClose: () => void;
}

export default function SchedulePostModal({ content, onClose }: SchedulePostModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Default schedule: tomorrow 8:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  const defaultDate = tomorrow.toISOString().slice(0, 16);

  const [scheduledAt, setScheduledAt] = useState(defaultDate);
  const [platforms, setPlatforms] = useState<Platform[]>([ (content.platform || 'facebook') as Platform ]);

  const handlePublishNow = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: content.id,
          productId: content.product_id,
          platforms,
          caption: content.caption,
          hashtags: content.hashtags,
          imageUrls: content.image_urls ?? [],
          publishNow: true,
          targetPageId: content.target_page_id ?? null,
        }),
      });
      const data = await res.json();

      if (data.published) {
        setResult({ success: true, message: `✅ Đã đăng thành công lên các nền tảng đã chọn!` });
        setTimeout(() => {
          router.refresh();
          onClose();
        }, 2000);
      } else {
        // Extract first error from results array if available
        const errorDetail = data.error 
          || data.results?.filter((r: { success: boolean; error?: string }) => !r.success).map((r: { platform?: string; error?: string }) => `${r.platform}: ${r.error}`).join(', ')
          || 'Unknown error';
        setResult({ success: false, message: `❌ Lỗi: ${errorDetail}` });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResult({ success: false, message: `❌ ${message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: content.id,
          productId: content.product_id,
          platforms,
          caption: content.caption,
          hashtags: content.hashtags,
          imageUrls: content.image_urls ?? [],
          scheduledAt: new Date(scheduledAt).toISOString(),
          publishNow: false,
          targetPageId: content.target_page_id ?? null,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: `✅ Đã lên lịch đăng lúc ${new Date(scheduledAt).toLocaleString('vi-VN')}` });
        setTimeout(() => {
          router.refresh();
          onClose();
        }, 2000);
      } else {
        setResult({ success: false, message: `❌ ${data.error}` });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResult({ success: false, message: `❌ ${message}` });
    } finally {
      setLoading(false);
    }
  };

  const imageUrls = content.image_urls ?? [];
  const supportedPlatforms: Platform[] = ['facebook', 'facebook_story', 'instagram', 'tiktok'];

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const isPublishableNow = platforms.every(p => p.startsWith('facebook') || p === 'instagram');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">📤 Đăng bài lên Fanpage</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Image Preview */}
        {imageUrls.length > 0 && (
          <div className="preview-images">
            {imageUrls.map((url: string, i: number) => (
              <img key={i} src={url} alt={`Preview ${i + 1}`} />
            ))}
          </div>
        )}

        {/* Caption Preview */}
        <div className="preview-box" style={{ whiteSpace: 'normal' }}>
          {renderCaption(content.caption)}
          {content.hashtags && (
            <div style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem' }}>
              {content.hashtags}
            </div>
          )}
        </div>

        {/* Platform Select */}
        <div className="form-group">
          <label className="form-label">Chọn nền tảng (có thể chọn nhiều)</label>
          <div className="platform-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {supportedPlatforms.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`platform-btn ${platforms.includes(p) ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  border: `1px solid ${platforms.includes(p) ? PLATFORM_LABELS[p].color : 'var(--border)'}`,
                  background: platforms.includes(p) ? `${PLATFORM_LABELS[p].color}1A` : 'transparent',
                  color: platforms.includes(p) ? PLATFORM_LABELS[p].color : 'var(--text-color)',
                  opacity: (!platforms.includes('facebook') && p === 'facebook_story') ? 0.5 : 1,
                  pointerEvents: (!platforms.includes('facebook') && p === 'facebook_story') ? 'none' : 'auto',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{platforms.includes(p) ? '☑' : '☐'}</span>
                <span>{PLATFORM_LABELS[p].icon} {PLATFORM_LABELS[p].label}</span>
              </button>
            ))}
          </div>
          {!isPublishableNow && (
            <div className="alert alert-warning" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              ⚠ Hệ thống đăng trực tiếp (Publish Now) chỉ hỗ trợ Facebook Feed, FB Story, Instagram. Các nền tảng khác tính năng đăng sẽ tự nhảy vào Hàng đợi.
            </div>
          )}
        </div>

        {/* Schedule DateTime */}
        <div className="form-group">
          <label className="form-label">Thời gian đăng (cho lên lịch)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Result Message */}
        {result && (
          <div className={`alert ${result.success ? 'alert-success' : 'alert-error'}`}>
            {result.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="btn-row">
          <button
            onClick={handlePublishNow}
            disabled={loading || platforms.length === 0 || !isPublishableNow}
            className="btn btn-primary"
            style={{ 
              opacity: (loading || platforms.length === 0 || !isPublishableNow) ? 0.5 : 1,
              background: platforms.includes('instagram') ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : '#1877F2',
              borderColor: 'transparent'
            }}
          >
            {loading ? '⏳ Đang đăng...' : `📤 Đăng ngay`}
          </button>

          <button
            onClick={handleSchedule}
            disabled={loading}
            className="btn btn-ghost"
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? '⏳...' : '📅 Lên lịch'}
          </button>
        </div>

        {/* Info */}
        <div className="helper-text">
          💡 <strong>&quot;Đăng ngay&quot;</strong> sẽ gửi bài lên mạng xã hội ngay lập tức (cần kết nối tài khoản tương ứng trước tại trang Accounts).
          <strong>&quot;Lên lịch&quot;</strong> sẽ lưu vào Calendar — hệ thống tự động đăng khi đến giờ.
        </div>
      </div>
    </div>
  );
}
