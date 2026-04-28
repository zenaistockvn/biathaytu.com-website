'use client';

import { useMemo, useState, useEffect } from 'react';
import type { SocialAccount } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, CartesianGrid,
  RadialBarChart, RadialBar,
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────────

interface ContentItem {
  id: string;
  caption: string;
  platform: string;
  content_format: string | null;
  ai_score: number | null;
  status: string | null;
  product_id: string | null;
  created_at?: string | null;
  products?: { name: string } | null;
}

interface PostItem {
  id: string;
  platform: string;
  status: string | null;
  scheduled_at: string;
  is_approved: boolean | null;
  published_at: string | null;
}

interface ActivityLog {
  id: string;
  action: string | null;
  created_at: string | null;
}

interface Props {
  contents: ContentItem[];
  posts: PostItem[];
  activityLogs: ActivityLog[];
  productCount: number;
  initialAccounts?: SocialAccount[];
}

// ─── Constants ──────────────────────────────────────────────────

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E', '#06B6D4', '#EF4444', '#14B8A6'];

const PILLAR_LABELS: Record<string, string> = {
  product_showcase: 'Giới thiệu SP',
  storytelling: 'Storytelling',
  food_pairing: 'Food Pairing',
  engagement: 'Engagement',
  promotion: 'Flash Sale',
  educational: 'Kiến thức',
  lifestyle: 'Lifestyle',
  review: 'Review',
  viral: 'Viral',
  comparison: 'So sánh',
  behind_scenes: 'Behind Scenes',
  seasonal: 'Seasonal',
};

const STATUS_COLORS: Record<string, string> = {
  draft: '#94A3B8',
  approved: '#22C55E',
  needs_review: '#F59E0B',
  published: '#3B82F6',
};

// ─── Custom Tooltip ─────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface-solid)', border: '1px solid var(--border)',
      padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {label && <div className="font-semibold" style={{ marginBottom: '0.25rem' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: 'var(--text-muted)' }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function AnalyticsDashboard({ contents, posts, activityLogs, productCount, initialAccounts = [] }: Props) {
  // ═══ Live Analytics State ═══
  const [activeAccount, setActiveAccount] = useState<SocialAccount | null>(
    initialAccounts.length > 0 ? initialAccounts[0] : null
  );
  const [liveMetrics, setLiveMetrics] = useState<Record<string, unknown> | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);

  useEffect(() => {
    if (!activeAccount) return;
    const fetchLiveMetrics = async () => {
      setLoadingLive(true);
      try {
        const res = await fetch(`/api/analytics?tenantId=${activeAccount.tenant_id}&platform=${activeAccount.platform}&accountId=${activeAccount.account_id}`);
        const data = await res.json();
        setLiveMetrics(data.metrics || data.fallback);
      } catch (err) {
        console.error('Failed to fetch live metrics', err);
      } finally {
        setLoadingLive(false);
      }
    };
    fetchLiveMetrics();
  }, [activeAccount]);

  // ═══ Section 1: KPI Cards ═══
  const kpiData = useMemo(() => {
    const totalContent = contents.length;
    const avgScore = totalContent > 0
      ? +(contents.reduce((sum, c) => sum + (c.ai_score || 0), 0) / totalContent).toFixed(1)
      : 0;
    const approvedCount = contents.filter(c => c.status === 'approved' || c.status === 'published').length;
    const approvalRate = totalContent > 0 ? +((approvedCount / totalContent) * 100).toFixed(0) : 0;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const scheduledPosts = posts.filter(p => p.status === 'scheduled' || !p.status).length;

    return {
      totalContent,
      avgScore,
      approvalRate,
      publishedPosts,
      scheduledPosts,
      productCount,
    };
  }, [contents, posts, productCount]);

  // ═══ Section 2: Content by Pillar ═══
  const pillarData = useMemo(() => {
    const map: Record<string, number> = {};
    contents.forEach(c => {
      const key = c.content_format || 'other';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([key, value]) => ({
        name: PILLAR_LABELS[key] || key,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [contents]);

  // ═══ Section 3: Content by Platform ═══
  const platformData = useMemo(() => {
    const map: Record<string, number> = {};
    contents.forEach(c => {
      map[c.platform] = (map[c.platform] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [contents]);

  // ═══ Section 4: AI Score Distribution ═══
  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: '1-4', count: 0 },
      { range: '5-6', count: 0 },
      { range: '7-8', count: 0 },
      { range: '9-10', count: 0 },
    ];
    contents.forEach(c => {
      const s = c.ai_score || 0;
      if (s <= 4) buckets[0].count++;
      else if (s <= 6) buckets[1].count++;
      else if (s <= 8) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [contents]);

  // ═══ Section 5: Status Breakdown ═══
  const statusData = useMemo(() => {
    const map: Record<string, number> = {};
    contents.forEach(c => {
      const key = c.status || 'draft';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [contents]);

  // ═══ Section 6: Content Creation Timeline (last 30 days) ═══
  const timelineData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      days[key] = 0;
    }

    contents.forEach(c => {
      if (!c.created_at) return;
      const d = new Date(c.created_at);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      if (days[key] !== undefined) days[key]++;
    });

    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [contents]);

  // ═══ Section 7: Publishing Efficiency ═══
  const publishEfficiency = useMemo(() => {
    const total = posts.length;
    const published = posts.filter(p => p.status === 'published').length;
    const failed = posts.filter(p => p.status === 'failed').length;
    const rate = total > 0 ? +((published / total) * 100).toFixed(0) : 0;
    return { total, published, failed, rate };
  }, [posts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ═══ KPI Cards ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Tổng Content', value: kpiData.totalContent, icon: '📝', color: '#3B82F6' },
          { label: 'AI Score TB', value: kpiData.avgScore + '/10', icon: '⭐', color: '#F59E0B' },
          { label: 'Tỷ lệ duyệt', value: kpiData.approvalRate + '%', icon: '✅', color: '#22C55E' },
          { label: 'Đã publish', value: kpiData.publishedPosts, icon: '📤', color: '#8B5CF6' },
          { label: 'Đang chờ', value: kpiData.scheduledPosts, icon: '⏳', color: '#F97316' },
          { label: 'Sản phẩm', value: kpiData.productCount, icon: '📦', color: '#06B6D4' },
        ].map(kpi => (
          <div key={kpi.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1.25rem',
            borderLeft: `3px solid ${kpi.color}`,
          }}>
            <div className="text-xs text-muted" style={{ marginBottom: '0.25rem' }}>{kpi.icon} {kpi.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ═══ Platform Live Insights ═══ */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="font-semibold" style={{ fontSize: '1.1rem' }}>🌐 Platform Live Insights</div>
          <select 
            value={activeAccount?.id || ''} 
            onChange={e => {
                const acc = initialAccounts.find(a => a.id === e.target.value);
                if (acc) setActiveAccount(acc);
            }}
            style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-solid)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
          >
            {initialAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.platform.toUpperCase()} - {acc.account_name}
              </option>
            ))}
            {initialAccounts.length === 0 && <option value="">Chưa kết nối MXH nào</option>}
          </select>
        </div>
        
        {loadingLive ? (
           <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang đồng bộ dữ liệu từ {activeAccount?.platform.toUpperCase()}...</div>
        ) : !liveMetrics ? (
           <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Không có dữ liệu</div>
        ) : (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                 <div className="text-xs text-muted">👥 Followers</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>{Number(liveMetrics.followers || 0).toLocaleString()}</div>
                 <div style={{ fontSize: '0.75rem', color: Number(liveMetrics.followersGained) > 0 ? '#22C55E' : '#ef4444' }}>
                   {Number(liveMetrics.followersGained) > 0 ? '↑' : '↓'} {Math.abs(Number(liveMetrics.followersGained) || 0)} (30 ngày)
                 </div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                 <div className="text-xs text-muted">👁️ Profile Views</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>{Number(liveMetrics.profileViews || 0).toLocaleString()}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30 ngày qua</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                 <div className="text-xs text-muted">🎯 Tổng Reach</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>{Number(liveMetrics.reach || 0).toLocaleString()}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30 ngày qua</div>
              </div>
              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                 <div className="text-xs text-muted">👀 Tổng Impressions</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>{Number(liveMetrics.impressions || 0).toLocaleString()}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>30 ngày qua</div>
              </div>
           </div>
        )}
      </div>

      {/* ═══ Row 2: Pillar Pie + Platform Bar ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Content by Pillar */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>📊 Content theo Pillar</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pillarData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pillarData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Content by Platform */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>🌐 Content theo Platform</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={platformData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Content" radius={[0, 6, 6, 0]}>
                {platformData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ Row 3: Timeline ═══ */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>📈 Content tạo 30 ngày gần nhất</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={2} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" name="Bài tạo" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ═══ Row 4: Score Distribution + Status ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* AI Score Distribution */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>⭐ Phân bố AI Score</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Số bài" radius={[6, 6, 0, 0]}>
                {scoreDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={
                    entry.range === '9-10' ? '#22C55E' :
                    entry.range === '7-8' ? '#3B82F6' :
                    entry.range === '5-6' ? '#F59E0B' : '#EF4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>📋 Trạng thái Content</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══ Row 5: Publishing Efficiency Radial ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>🚀 Hiệu quả Publishing</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ResponsiveContainer width={160} height={160}>
              <RadialBarChart cx="50%" cy="50%" innerRadius={50} outerRadius={75} barSize={12}
                data={[{ fill: '#22C55E', value: publishEfficiency.rate }]}
                startAngle={90} endAngle={-270}
              >
                <RadialBar background={{ fill: 'var(--glass)' }} dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22C55E' }}>{publishEfficiency.rate}%</div>
              <div className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>Tỷ lệ publish thành công</div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                <span>📤 {publishEfficiency.published} đã đăng</span>
                <span style={{ color: 'var(--error)' }}>❌ {publishEfficiency.failed} lỗi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="font-semibold mb-md" style={{ fontSize: '0.95rem' }}>🔔 Hoạt động gần đây</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
            {activityLogs.slice(0, 10).map(log => (
              <div key={log.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.4rem 0', borderBottom: '1px dashed var(--border)',
                fontSize: '0.8rem',
              }}>
                <span>{log.action || '—'}</span>
                <span className="text-xs text-muted">
                  {log.created_at ? new Date(log.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '—'}
                </span>
              </div>
            ))}
            {activityLogs.length === 0 && (
              <div className="text-sm text-muted" style={{ padding: '1rem', textAlign: 'center' }}>Chưa có hoạt động</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
