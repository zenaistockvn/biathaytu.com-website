'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PLATFORM_LABELS } from '@/constants';
import type { Platform } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface ManualPostModalProps {
  onClose: () => void;
}

export default function ManualPostModal({ onClose }: ManualPostModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Default schedule: tomorrow 8:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  const defaultDate = tomorrow.toISOString().slice(0, 16);

  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [imageUrlString, setImageUrlString] = useState('');
  const [scheduledAt, setScheduledAt] = useState(defaultDate);
  const [platforms, setPlatforms] = useState<Platform[]>(['facebook']);
  const [uploadingImage, setUploadingImage] = useState(false);

  const getImageUrls = () => {
    return imageUrlString
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('media').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        alert('Lỗi upload ảnh lên Supabase: ' + error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
      
      setImageUrlString(prev => prev ? `${prev}\n${publicUrlData.publicUrl}` : publicUrlData.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown exception';
      alert('Upload thất bại: ' + message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handlePublishNow = async () => {
    if (!caption) return alert('Vui lòng nhập nội dung (caption)!');
    
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms,
          caption,
          hashtags,
          imageUrls: getImageUrls(),
          publishNow: true,
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
        setResult({ success: false, message: `❌ Lỗi: ${data.error || 'Unknown error'}` });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResult({ success: false, message: `❌ ${message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!caption) return alert('Vui lòng nhập nội dung (caption)!');

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms,
          caption,
          hashtags,
          imageUrls: getImageUrls(),
          scheduledAt: new Date(scheduledAt).toISOString(),
          publishNow: false,
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

  const supportedPlatforms: Platform[] = ['facebook', 'facebook_story', 'instagram', 'tiktok'];
  const previewImages = getImageUrls();

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const isPublishableNow = platforms.every(p => p.startsWith('facebook') || p === 'instagram');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">📝 Tạo bài viết thủ công</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
          
          {/* Content Inputs */}
          <div className="form-group">
            <label className="form-label">Nội dung bài viết (Caption) *</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="form-input"
              rows={5}
              placeholder="Nhập nội dung bài quảng cáo, thông báo..."
              style={{ padding: '0.75rem', lineHeight: '1.5' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hashtags (Tùy chọn)</label>
            <input
              type="text"
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
              className="form-input"
              placeholder="#biathaytu #marketing..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Hình ảnh URLs (Liên kết)</span>
              {uploadingImage && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>⏳ Đang tải ảnh lên...</span>}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <label 
                className="btn btn-ghost" 
                style={{ cursor: 'pointer', padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto', border: '1px dashed var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}
              >
                + Chọn ảnh từ máy tính (Upload)
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  disabled={uploadingImage}
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
            <textarea
              value={imageUrlString}
              onChange={e => setImageUrlString(e.target.value)}
              className="form-input"
              rows={3}
              placeholder="Bạn có thể dán link trực tiếp vào đây, hoặc upload từ máy tính."
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Image Preview */}
          {previewImages.length > 0 && (
            <div className="preview-images" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {previewImages.map((url, i) => (
                <img key={i} src={url} alt={`Preview ${i + 1}`} style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
              ))}
            </div>
          )}

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
                  <span>{PLATFORM_LABELS[p]?.icon} {PLATFORM_LABELS[p]?.label}</span>
                </button>
              ))}
            </div>
            {!isPublishableNow && (
              <div className="alert alert-warning" style={{ marginTop: '0.5rem', marginBottom: 0, padding: '0.5rem', fontSize: '0.85rem' }}>
                ⚠ Hệ thống đăng trực tiếp (Publish Now) chỉ hỗ trợ Facebook Feed, FB Story, Instagram. Các nền tảng khác tính năng đăng sẽ tự nhảy vào Hàng đợi.
              </div>
            )}
          </div>

          {/* Schedule DateTime */}
          <div className="form-group">
            <label className="form-label">Thời gian đăng (nếu chọn Lên lịch)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Result Message */}
          {result && (
            <div className={`alert ${result.success ? 'alert-success' : 'alert-error'}`} style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
              {result.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="btn-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={handlePublishNow}
              disabled={loading || platforms.length === 0 || !isPublishableNow || !caption}
              className="btn btn-facebook"
              style={{ flex: 1, opacity: (loading || platforms.length === 0 || !isPublishableNow || !caption) ? 0.5 : 1, padding: '0.75rem', background: '#1877F2', color: '#fff', borderRadius: '8px', fontWeight: 600 }}
            >
              {loading ? '⏳ Đang đăng...' : '📤 Đăng ngay'}
            </button>

            <button
              onClick={handleSchedule}
              disabled={loading || !caption}
              className="btn btn-ghost"
              style={{ flex: 1, opacity: (loading || !caption) ? 0.5 : 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border)' }}
            >
              {loading ? '⏳...' : '📅 Lên lịch'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
