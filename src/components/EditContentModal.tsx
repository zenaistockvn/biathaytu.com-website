import { useState } from 'react';

interface ContentItem {
  id: string;
  caption: string;
  hashtags: string | null;
  // include other properties as needed or keep generic
}

interface EditContentModalProps {
  content: ContentItem;
  onClose: () => void;
  onSuccess: (updatedContent: ContentItem) => void;
}

export default function EditContentModal({ content, onClose, onSuccess }: EditContentModalProps) {
  const [caption, setCaption] = useState(content.caption || '');
  const [hashtags, setHashtags] = useState(content.hashtags || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption, hashtags }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update content');
      }

      const updatedData = await response.json();
      onSuccess(updatedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">✏️ Chỉnh sửa Nội dung</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">📝 Caption</label>
            <textarea
              className="form-textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Nhập nội dung bài viết..."
              style={{ minHeight: '150px' }}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">#️⃣ Hashtags</label>
            <input
              type="text"
              className="form-input"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#biathaytu #premium"
              disabled={isSubmitting}
            />
            <p className="helper-text">Cách nhau bằng khoảng trắng. VD: #biathaytu #premium</p>
          </div>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
