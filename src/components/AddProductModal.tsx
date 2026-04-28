'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  usp: string;
}

export default function AddProductModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'bia',
    usp: '',
  });

  const uploadImage = async (): Promise<string[]> => {
    if (!file) return [];
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);
      
    if (error) {
      console.error('Upload error:', error);
      return [];
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return [data.publicUrl];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const urls = await uploadImage();
      
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, images: urls }),
      });
      
      if (res.ok) {
        router.refresh();
        onClose();
      } else {
        alert('Có lỗi xảy ra khi tạo sản phẩm');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        className="modal-container"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Thêm Sản Phẩm Mới</h3>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Tên sản phẩm</label>
          <input
            required
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mô tả chi tiết</label>
          <textarea
            required
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Giá bán (VNĐ)</label>
            <input
              type="number"
              value={formData.price}
              onChange={e => updateField('price', Number(e.target.value))}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hạng mục</label>
            <select
              value={formData.category}
              onChange={e => updateField('category', e.target.value)}
              className="form-select"
            >
              <option value="bia">🍺 Bia</option>
              <option value="vang">🍷 Vang</option>
              <option value="phu-kien">🎁 Phụ kiện</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Điểm nổi bật (USP)</label>
          <input
            required
            value={formData.usp}
            onChange={e => updateField('usp', e.target.value)}
            className="form-input"
            placeholder="VD: Công thức 400 năm"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="form-file"
          />
        </div>
        
        <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn btn-ghost" disabled={loading}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
