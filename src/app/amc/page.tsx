import DashboardLayout from '@/components/DashboardLayout';
import { getStats } from '@/lib/data';
import Link from 'next/link';

/* ══════════════════════════════════════════════════════════════════
   Feature Map — mỗi module của dự án
   ══════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: '💬',
    title: 'Unified Inbox',
    href: '/amc/inbox',
    color: '#8B5CF6',
    description: 'Hộp thư hợp nhất — Quản lý tập trung toàn bộ tin nhắn, bình luận từ Facebook, Instagram, LinkedIn tại một nơi.',
    highlights: ['Trả lời tức thời ngay trên hệ thống', 'Tích hợp AI soạn mẫu phản hồi', 'Đồng bộ hai chiều Real-time'],
  },
  {
    icon: '📦',
    title: 'Content Library',
    href: '/amc/library',
    color: '#3B82F6',
    description: 'Kho nội dung marketing tập trung — Quản lý sản phẩm, kho bài viết đã sinh, bộ lọc nâng cao theo chiến lược & trạng thái.',
    highlights: ['Lọc nhanh theo Platform / Chiến lược', 'Quản lý trạng thái (Nháp, Đã duyệt, Thùng rác)', 'Tải xuống hình ảnh & video gốc'],
  },
  {
    icon: '🎨',
    title: 'AI Studio',
    href: '/amc/studio',
    color: '#EC4899',
    description: 'Chuyên viên Copywriter tư duy AI — Viết đa phong cách, đa nền tảng dựa trên phân tích tâm lý khách hàng & brand DNA.',
    highlights: ['Tạo content siêu tốc với Gemini 1.5', 'Nhân bản content chéo nền tảng', 'Tích hợp Marketing Psychology'],
  },
  {
    icon: '📅',
    title: 'Calendar & Rules',
    href: '/amc/calendar',
    color: '#F59E0B',
    description: 'Trạm kiểm soát xuất bản — Xem lịch tổng quan, duyệt bài duyệt hàng loạt và thiết lập các chiến dịch tự động hóa.',
    highlights: ['Quản lý lịch đăng trực quan kéo thả', 'Xuất bản trực tiếp bằng API Provider', 'Thiết lập Rule đăng bài tự động'],
  },
  {
    icon: '📈',
    title: 'Real-time Analytics',
    href: '/amc/analytics',
    color: '#EF4444',
    description: 'Trung tâm chỉ huy dữ liệu — Cung cấp dashboard trực quan theo dõi lượng tương tác biểu đồ luồng thời gian thực.',
    highlights: ['Biểu đồ Reach & Engagement 24/7', 'Bảng xếp hạng Bài viết Top Performance', 'Đánh giá chiến dịch & insight khách hàng'],
  },
  {
    icon: '📝',
    title: 'Blog SEO Pipeline',
    href: '/amc/blog',
    color: '#22C55E',
    description: 'Nhà máy sản xuất bài viết chuyên sâu — Triển khai bài 2000 chữ chuẩn semantic web và tự động ngắt thành micro-content.',
    highlights: ['Cấu trúc Outline chuẩn SEO Semantic', 'Tự động cắt chém micro-content MXH', 'Tối ưu keyword bia nhập khẩu'],
  },
  {
    icon: '🎥',
    title: 'Media Prompts Library',
    href: '/amc/video-prompts',
    color: '#06B6D4',
    description: 'Bộ sưu tập "thần chú" — Hàng trăm Prompt kỹ thuật cho Midjourney, Flux, Sora và Veo 3 xoay quanh lối sống Premium.',
    highlights: ['Quy chuẩn hình mẫu sản phẩm 25-30%', 'Prompts Cinematic kịch bản phân cảnh', 'Chống vi phạm Policy quảng cáo Rượu Bia'],
  },
  {
    icon: '🔗',
    title: 'Social Integrations',
    href: '/amc/accounts',
    color: '#1877F2',
    description: 'Kết nối hệ sinh thái nền tảng — Cổng xác thực an toàn kết nối chặt chẽ qua cơ chế OAuth 2.0 siêu bảo mật.',
    highlights: ['Kết nối chuẩn Meta, LinkedIn, TikTok', 'Tự động làm mới Acces Token', 'Cấu trúc Provider mở rộng cực nhanh'],
  },
];

/* ══════════════════════════════════════════════════════════════════
   Workflow Steps — Hướng dẫn Vận hành Phễu AMC
   ══════════════════════════════════════════════════════════════════ */
const WORKFLOW_STEPS = [
  {
    step: 1,
    icon: '🔗',
    title: 'Kết nối mạng lưới',
    description: 'Vào Social Accounts để uỷ quyền kết nối Fanpage, Instagram, LinkedIn... Hệ thống sẽ đồng bộ token dùng cho xuất bản ảnh & phản hồi khách.',
    href: '/amc/accounts',
    linkText: 'Kết nối ngay →',
  },
  {
    step: 2,
    icon: '🎨',
    title: 'Sáng tạo Content mẻ đầu',
    description: 'Mở AI Studio, khai báo Sản phẩm và "Góc độ truyền thông" (VD: Flash Sale). AI ngay lập tức đánh thức content chuẩn bị, kèm gợi ý đồ họa.',
    href: '/amc/studio',
    linkText: 'Bắt đầu sáng tạo →',
  },
  {
    step: 3,
    icon: '📦',
    title: 'Đắp hình ảnh & Trình duyệt',
    description: 'Sang Content Library, duyệt nội dung và dùng Image Prompts render bằng Midjourney. Cuối cùng gắn kết vào thành sản phẩm Ready-to-publish.',
    href: '/amc/library',
    linkText: 'Kiểm duyệt kho →',
  },
  {
    step: 4,
    icon: '📅',
    title: 'Thả tự do lên Lịch',
    description: 'Đẩy bài viết từ tab Library sang Lịch. Sắp xếp vị trí giờ vàng, sau đó ấn phê duyệt để hệ thống găm hẹn và tự Push ra vệ tinh ảo.',
    href: '/amc/calendar',
    linkText: 'Sắp xếp lịch →',
  },
  {
    step: 5,
    icon: '💬',
    title: 'Trực trạm (Tương tác)',
    description: 'Bài viết viral tạo bão comment? Mở trạm Unified Inbox. Tất cả dồn về 1 màn hình với sự phò tá của AI soạn reply trả lời thay bạn cực nhanh.',
    href: '/amc/inbox',
    linkText: 'Kiểm tra hộp thoại →',
  },
  {
    step: 6,
    icon: '📈',
    title: 'Thu thập Insight (Báo Cáo)',
    description: 'Chạm tay vào dữ liệu Real-time Analytics theo dõi các luồng sóng lan truyền. Dùng insight vòng lặp này để ra feed Sáng tạo mới (Bước 2).',
    href: '/amc/analytics',
    linkText: 'Xem báo cáo →',
  },
];

export default async function Home() {
  const stats = await getStats();

  return (
    <DashboardLayout>
      {/* ─── Page Header ─── */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>AMC × Bia Thầy Tu — AI Marketing Center</p>
      </div>

      {/* ─── Stats ─── */}
      <div className="stats-grid">
        <StatCard icon="📦" label="Sản phẩm" value={stats.products} color="#3B82F6" />
        <StatCard icon="⚙️" label="Auto Rules" value={stats.rules} color="#22C55E" />
        <StatCard icon="📝" label="Bài đã tạo" value={stats.contents} color="#F59E0B" />
        <StatCard icon="🚀" label="Đã đăng" value={stats.posts} color="#EF4444" />
      </div>

      {/* ─── Welcome Banner ─── */}
      <div className="welcome-banner">
        <div className="welcome-banner-content">
          <div className="welcome-banner-text">
            <h3>🍺 Khởi động cỗ máy AI Marketing</h3>
            <p>
              Chuỗi dây chuyền Automation khép kín: Tự động sáng tạo, Quản lý kho nguyên liệu, Xuất bản chéo nền tảng (Auto-publish) 
              và tóm gọn tương tác khách hàng thông qua Unified Inbox. Hệ thống độc quyền của AMC × Bia Thầy Tu.
            </p>
          </div>
          <div className="welcome-banner-badges">
            <span className="welcome-badge">🤖 AI-Powered</span>
            <span className="welcome-badge">📱 Multi-Platform</span>
            <span className="welcome-badge">⚡ Auto-Publish</span>
          </div>
        </div>
      </div>

      {/* ─── Feature Map ─── */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">🗺️ Bản đồ kiến trúc hệ thống</h3>
          <p className="section-subtitle">8 module lõi của cỗ máy vận hành AMC đa quyền lực</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature) => (
            <Link key={feature.href} href={feature.href} className="feature-card">
              <div className="feature-card-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                {feature.icon}
              </div>
              <div className="feature-card-body">
                <h4 className="feature-card-title">{feature.title}</h4>
                <p className="feature-card-desc">{feature.description}</p>
                <ul className="feature-card-highlights">
                  {feature.highlights.map((h, i) => (
                    <li key={i}>
                      <span className="highlight-dot" style={{ background: feature.color }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="feature-card-arrow" style={{ color: feature.color }}>→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Workflow Guide ─── */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">📖 Quy trình thao tác chuẩn (SOP)</h3>
          <p className="section-subtitle">6 bước rèn luyện cỗ máy từ Mầm content đến Báo cáo chuyển đổi</p>
        </div>

        <div className="workflow-timeline">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.step} className="workflow-step">
              <div className="workflow-step-indicator">
                <div className="workflow-step-number">{step.step}</div>
                {index < WORKFLOW_STEPS.length - 1 && <div className="workflow-step-line" />}
              </div>
              <div className="workflow-step-content">
                <div className="workflow-step-icon">{step.icon}</div>
                <div className="workflow-step-body">
                  <h4 className="workflow-step-title">{step.title}</h4>
                  <p className="workflow-step-desc">{step.description}</p>
                  <Link href={step.href} className="workflow-step-link">
                    {step.linkText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Pro Tips ─── */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">💡 Mẹo chuyên gia</h3>
          <p className="section-subtitle">Tận dụng tối đa hệ thống AMC</p>
        </div>

        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-card-icon">🗑️</div>
            <h4>Thùng rác dọn rác</h4>
            <p>Từ Content Library, bấm thẻ [Xóa] giúp bài viết lui về góc khuất nhưng không tan biến vĩnh viễn, khi hối hận vẫn dễ dàng tìm lại ở Status "Thùng rác".</p>
          </div>
          <div className="tip-card">
            <div className="tip-card-icon">💬</div>
            <h4>Phản hồi AI thần tốc</h4>
            <p>Khi chat cùng khách trong hộp Inbox, thay vì nghĩ câu trả lời, hãy nhấn biểu tượng 🤖 để AI phân tích ý định (Intent) và phác thảo câu Reply ngay lập tức dựa trên Product Knowledge DB.</p>
          </div>
          <div className="tip-card">
            <div className="tip-card-icon">⚡</div>
            <h4>Video Prompts đỉnh cao</h4>
            <p>AMC đã tích hợp logic sinh "storyboard", cho ra những khung rập sẵn câu lệnh Text-to-Video chuyên sâu dành cho ngành bia F&B hoàn toàn miễn dịch policy cấm.</p>
          </div>
          <div className="tip-card">
            <div className="tip-card-icon">🔥</div>
            <h4>Tương tác Real-time</h4>
            <p>Hệ thống không lưu cache Dashboard Analytics khi truy xuất data Reach thực tế. Kéo F5 để nhìn thấy biểu đồ lên xuống từ các kết nối Facebook & LinkedIn đang được streaming.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{label}</span>
        <div className="stat-icon" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
}
