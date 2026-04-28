/**
 * AMC × Bia Thầy Tu — Constants
 * Single source of truth for app-wide configuration values.
 */

/** Default tenant ID — will be replaced by auth-based tenant in future */
export const DEFAULT_TENANT_ID = 'demo-tenant';

/** Supported social platforms */
export const PLATFORMS = {
  FACEBOOK: 'facebook',
  FACEBOOK_STORY: 'facebook_story',
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  ZALO: 'zalo',
  LINKEDIN: 'linkedin',
} as const;

/** Platform display labels */
export const PLATFORM_LABELS: Record<string, { icon: string; label: string; color: string }> = {
  facebook: { icon: '📘', label: 'Facebook Feed', color: '#1877F2' },
  facebook_story: { icon: '⏱️', label: 'FB Story', color: '#E01765' },
  instagram: { icon: '📸', label: 'Instagram', color: '#E1306C' },
  tiktok: { icon: '🎵', label: 'TikTok', color: '#FFFFFF' },
  zalo: { icon: '💬', label: 'Zalo', color: '#0068FF' },
  linkedin: { icon: '💼', label: 'LinkedIn', color: '#0A66C2' },
};

/** Vietnamese day names (0=CN, 1=T2, ...) */
export const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

/** Post status display */
export const POST_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Đã lên lịch', color: 'var(--info)' },
  pending: { label: 'Chờ duyệt', color: 'var(--warning)' },
  published: { label: 'Đã đăng', color: 'var(--success)' },
  failed: { label: 'Thất bại', color: 'var(--error)' },
  needs_review: { label: 'Cần review', color: 'var(--warning)' },
};

/** Content status display */
export const CONTENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Nháp', color: 'var(--text-muted)' },
  approved: { label: 'Đã duyệt', color: 'var(--success)' },
  needs_review: { label: 'Cần review', color: 'var(--warning)' },
  scheduled: { label: 'Đã lên lịch', color: 'var(--info)' },
  published: { label: 'Đã đăng', color: 'var(--success)' },
};

/** Default brand voice fallback */
export const DEFAULT_BRAND_VOICE = 'Sang trọng nhưng không xa cách, truyền cảm hứng khám phá.';

/** App routes */
export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  LIBRARY: '/library',
  STUDIO: '/studio',
  BLOG: '/blog',
  GALLERY: '/gallery',
  CALENDAR: '/calendar',
  RULES: '/rules',
  ACCOUNTS: '/accounts',
  ANALYTICS: '/analytics',
  ACTIVITY: '/activity',
} as const;
