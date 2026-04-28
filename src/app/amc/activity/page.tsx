import DashboardLayout from '@/components/DashboardLayout';
import { createAdminSupabase } from '@/lib/supabase/server';

const ACTION_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  login: { icon: '🔐', label: 'Đăng nhập', color: 'var(--success)' },
  logout: { icon: '🚪', label: 'Đăng xuất', color: 'var(--text-muted)' },
  login_failed: { icon: '❌', label: 'Đăng nhập thất bại', color: 'var(--error)' },
  create_content: { icon: '✏️', label: 'Tạo content', color: 'var(--info)' },
  edit_content: { icon: '📝', label: 'Chỉnh sửa content', color: 'var(--warning)' },
  delete_content: { icon: '🗑️', label: 'Xoá content', color: 'var(--error)' },
  schedule_post: { icon: '📅', label: 'Lên lịch bài đăng', color: 'var(--info)' },
  approve_post: { icon: '✅', label: 'Duyệt bài đăng', color: 'var(--success)' },
  publish_post: { icon: '🚀', label: 'Đăng bài lên Facebook', color: '#1877F2' },
  connect_account: { icon: '🔗', label: 'Kết nối tài khoản', color: 'var(--success)' },
  disconnect_account: { icon: '⛓️‍💥', label: 'Ngắt kết nối', color: 'var(--error)' },
  update_rule: { icon: '⚙️', label: 'Cập nhật rule', color: 'var(--warning)' },
  create_article: { icon: '📰', label: 'Tạo bài blog SEO', color: 'var(--info)' },
};

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function ActivityPage() {
  const supabase = createAdminSupabase();

  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>📋 Activity Log</h2>
        <p>Lịch sử hoạt động trên hệ thống</p>
      </div>

      {(!logs || logs.length === 0) ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Chưa có hoạt động nào</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Các hoạt động sẽ được ghi nhận tự động khi bạn sử dụng hệ thống.
          </p>
        </div>
      ) : (
        <div className="activity-timeline">
          {logs.map((log) => {
            const config = ACTION_CONFIG[log.action] || {
              icon: '📌',
              label: log.action,
              color: 'var(--text-muted)',
            };
            const meta = (log.metadata && typeof log.metadata === 'object' && !Array.isArray(log.metadata))
              ? log.metadata as Record<string, unknown>
              : {};

            return (
              <div key={log.id} className="activity-item">
                <div
                  className="activity-icon"
                  style={{
                    background: `${config.color}15`,
                    color: config.color,
                  }}
                >
                  {config.icon}
                </div>
                <div className="activity-body">
                  <div className="activity-action">{config.label}</div>
                  <div className="activity-detail">
                    {'email' in meta && meta.email ? <span>{String(meta.email)}</span> : null}
                    {log.entity_type && (
                      <span>
                        {'email' in meta && meta.email ? ' · ' : ''}
                        {log.entity_type}
                        {log.entity_id ? `: ${log.entity_id.slice(0, 8)}...` : ''}
                      </span>
                    )}
                    {log.ip_address && log.ip_address !== 'unknown' && (
                      <span> · IP: {log.ip_address}</span>
                    )}
                  </div>
                </div>
                <div className="activity-time">
                  {log.created_at ? formatTime(log.created_at) : '—'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
