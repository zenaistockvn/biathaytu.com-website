'use client';

import { useState } from 'react';
import type { Post } from '@/types';
import { PLATFORM_LABELS, POST_STATUS_CONFIG } from '@/constants';

export default function HistoryClient({ initialPosts }: { initialPosts: Post[] }) {
  const [filter, setFilter] = useState<'all' | 'published' | 'failed'>('all');

  const filteredPosts = initialPosts.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${filter === 'all' ? 'active' : 'btn-ghost'}`}
          onClick={() => setFilter('all')}
          style={{ border: filter === 'all' ? 'none' : '1px solid var(--border)', background: filter === 'all' ? 'var(--primary)' : 'transparent', color: filter === 'all' ? '#fff' : 'inherit' }}
        >
          Tất cả
        </button>
        <button 
          className={`btn ${filter === 'published' ? 'active' : 'btn-ghost'}`}
          onClick={() => setFilter('published')}
          style={{ border: filter === 'published' ? 'none' : '1px solid var(--border)', background: filter === 'published' ? 'var(--success)' : 'transparent', color: filter === 'published' ? '#fff' : 'inherit' }}
        >
          ✅ Thành công
        </button>
        <button 
          className={`btn ${filter === 'failed' ? 'active' : 'btn-ghost'}`}
          onClick={() => setFilter('failed')}
          style={{ border: filter === 'failed' ? 'none' : '1px solid var(--border)', background: filter === 'failed' ? 'var(--error)' : 'transparent', color: filter === 'failed' ? '#fff' : 'inherit' }}
        >
          ❌ Thất bại
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Chưa có dữ liệu lịch sử đăng bài nào khớp với bộ lọc.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Media</th>
                <th style={{ padding: '1rem' }}>Nội dung (Caption)</th>
                <th style={{ padding: '1rem' }}>Nền tảng</th>
                <th style={{ padding: '1rem' }}>Trạng thái</th>
                <th style={{ padding: '1rem' }}>Thời gian</th>
                <th style={{ padding: '1rem' }}>Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => {
                const imgUrl = Array.isArray(post.image_urls) && post.image_urls.length > 0 
                  ? (post.image_urls[0] as string) 
                  : '';
                const platformLabel = PLATFORM_LABELS[post.platform] || { label: post.platform, icon: '📱', color: '#ccc' };
                const statusConfig = POST_STATUS_CONFIG[post.status || ''] || { label: post.status, color: 'var(--border)' };

                return (
                  <tr key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', width: '100px' }}>
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt="Thumbnail" 
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} 
                        />
                      ) : (
                        <div style={{ width: '80px', height: '80px', background: 'var(--glass)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          📝
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '300px' }}>
                      <div style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                        {post.caption || '<Không có nội dung>'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: `${platformLabel.color}22`, color: platformLabel.color, fontSize: '0.85rem', fontWeight: 600 }}>
                        {platformLabel.icon} {platformLabel.label}
                      </span>
                      {post.target_page_id && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                          ID Trang đích: {post.target_page_id}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {post.status === 'failed' ? (
                        <div>
                          <span style={{ color: 'var(--error)', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>❌ Lỗi</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--error)', opacity: 0.8 }}>{post.error_log || 'Unknown'}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ Thành công</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(post.published_at || post.scheduled_at)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {post.status === 'published' && post.external_id ? (
                        <a 
                          href={post.platform.startsWith('facebook') ? `https://facebook.com/${post.external_id}` : '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-ghost"
                          style={{ padding: '0.4rem', borderRadius: '50%', border: '1px solid var(--border)' }}
                          title="Xem trên mạng xã hội"
                        >
                          ↗️
                        </a>
                      ) : (
                        <span style={{ color: 'var(--border)' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
