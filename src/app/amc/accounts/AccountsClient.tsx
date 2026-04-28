'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_id: string;
  is_active: boolean | null;
  token_expiry: string | null;
}

interface SatPage {
  id: string;
  page_name: string;
  page_slug: string;
  page_role: string;
  page_icon: string | null;
  tagline: string | null;
  social_account_id: string | null;
  is_active: boolean | null;
}

const PLATFORMS = [
  {
    key: 'facebook',
    name: 'Facebook Page',
    icon: 'FB',
    color: '#1877F2',
    oauthUrl: '/api/auth/facebook',
    description: 'Đăng bài tự động lên Facebook Page',
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: 'IG',
    color: '#E1306C',
    oauthUrl: '/api/auth/instagram',
    description: 'Đăng ảnh, carousel, reel lên Instagram Business',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    icon: 'TK',
    color: '#000000',
    oauthUrl: '/api/auth/tiktok',
    description: 'Post videos to TikTok (requires TikTok Business)',
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: 'IN',
    color: '#0A66C2',
    oauthUrl: '/api/auth/linkedin',
    description: 'B2B updates and articles (UGC API)',
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: 'YT',
    color: '#FF0000',
    oauthUrl: '/api/auth/youtube',
    description: 'Tự động đăng Shorts và Videos (hỗ trợ SEO)',
  },
];

export default function AccountsClient({
  initialAccounts,
  satellitePages,
}: {
  initialAccounts: SocialAccount[];
  satellitePages: SatPage[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);
  const [linking, setLinking] = useState<string | null>(null);

  const fbAccounts = initialAccounts.filter((a) => a.platform === 'facebook');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const pages = searchParams.get('pages');

    if (success === 'facebook') {
      setToast(`✅ Đã kết nối thành công ${pages || 1} Facebook Page!`);
      window.history.replaceState({}, '', '/amc/accounts');
    } else if (success === 'instagram') {
      setToast(`✅ Đã kết nối ${pages || 1} Instagram Business Account!`);
      window.history.replaceState({}, '', '/amc/accounts');
    } else if (success === 'tiktok') {
      setToast(`✅ Đã kết nối thành công tài khoản TikTok!`);
      window.history.replaceState({}, '', '/amc/accounts');
    } else if (success === 'linkedin') {
      setToast(`✅ Đã kết nối thành công tài khoản LinkedIn!`);
      window.history.replaceState({}, '', '/amc/accounts');
    } else if (error) {
      setToast(`❌ Lỗi: ${decodeURIComponent(error)}`);
      window.history.replaceState({}, '', '/amc/accounts');
    }
  }, [searchParams]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getConnectedAccount = (platform: string) =>
    initialAccounts.find((a) => a.platform === platform && a.is_active);

  const isTokenExpiring = (expiry: string | null) => {
    if (!expiry) return false;
    const daysLeft = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysLeft < 7;
  };

  const disconnectAccount = async (accountId: string) => {
    if (!confirm('Ngắt kết nối tài khoản này?')) return;
    await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
    router.refresh();
  };

  const linkPageToSatellite = async (satelliteId: string, socialAccountId: string) => {
    setLinking(satelliteId);
    try {
      await fetch(`/api/satellite-pages/${satelliteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialAccountId }),
      });
      router.refresh();
      setToast('✅ Đã liên kết page thành công!');
    } catch {
      setToast('❌ Lỗi liên kết page');
    } finally {
      setLinking(null);
    }
  };

  const getLinkedAccountName = (socialAccountId: string | null) => {
    if (!socialAccountId) return null;
    return initialAccounts.find((a) => a.id === socialAccountId)?.account_name;
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.startsWith('✅') ? 'toast-success' : 'toast-error'}`}>
          {toast}
        </div>
      )}

      {/* Platform Cards — OAuth Connect */}
      <div className="grid-auto-fill grid-cols-auto-340" style={{ gap: '1.5rem' }}>
        {PLATFORMS.map((platform) => {
          const connected = getConnectedAccount(platform.key);
          const expiring = connected ? isTokenExpiring(connected.token_expiry) : false;
          const connectedCount = initialAccounts.filter(
            (a) => a.platform === platform.key && a.is_active,
          ).length;

          return (
            <div key={platform.key} className="card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center gap-lg mb-md">
                <div className="account-card-icon" style={{ background: platform.color }}>
                  {platform.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                    {platform.name}
                    {connectedCount > 1 && (
                      <span
                        className="badge badge-info"
                        style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}
                      >
                        {connectedCount} pages
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted" style={{ margin: 0 }}>
                    {platform.description}
                  </p>
                </div>
              </div>

              {connected ? (
                <div className="account-detail">
                  <div className="flex justify-between items-center mb-sm">
                    <span className="badge badge-success">✓ Đã kết nối</span>
                    {expiring && (
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        ⚠ Token sắp hết hạn
                      </span>
                    )}
                  </div>
                  <p className="font-semibold mb-sm" style={{ fontSize: '0.95rem' }}>
                    {connected.account_name}
                  </p>
                  <p className="text-sm text-muted" style={{ margin: 0 }}>
                    ID: {connected.account_id}
                    {connected.token_expiry &&
                      ` · Token expires: ${new Date(connected.token_expiry).toLocaleDateString('vi-VN')}`}
                  </p>
                  <div className="flex gap-sm mt-md">
                    {(expiring || platform.oauthUrl) && (
                      <a
                        href={platform.oauthUrl || '#'}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      >
                        🔄 Gia hạn
                      </a>
                    )}
                    <button
                      onClick={() => disconnectAccount(connected.id)}
                      className="btn btn-ghost"
                      style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        color: 'var(--error)',
                      }}
                    >
                      Ngắt kết nối
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {platform.oauthUrl ? (
                    <a
                      href={platform.oauthUrl}
                      className="btn btn-primary justify-center"
                      style={{ width: '100%', padding: '0.75rem' }}
                    >
                      🔗 Kết nối {platform.name}
                    </a>
                  ) : (
                    <button
                      className="btn btn-ghost justify-center"
                      disabled
                      style={{ width: '100%', padding: '0.75rem', opacity: 0.5 }}
                    >
                      Sắp ra mắt
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Satellite Pages Section */}
      {satellitePages.length > 0 && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <span className="card-title">🛰️ Hệ thống Page Vệ Tinh ({satellitePages.length})</span>
          </div>
          <div style={{ padding: '0.5rem 1.5rem' }}>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
              Liên kết mỗi page vệ tinh với Facebook Page đã kết nối để cho phép auto-publish.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {satellitePages.map((sp) => {
                const linkedName = getLinkedAccountName(sp.social_account_id);
                const isHub = sp.page_role === 'hub';

                return (
                  <div
                    key={sp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      background: isHub
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.08), transparent)'
                        : 'var(--glass)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: isHub ? '3px solid #F59E0B' : '3px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', width: '2rem', textAlign: 'center' }}>
                      {sp.page_icon || '📄'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        className="font-semibold"
                        style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        {sp.page_name}
                        <span
                          className={`badge ${isHub ? 'badge-warning' : 'badge-info'}`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {isHub ? 'HUB' : 'Satellite'}
                        </span>
                      </div>
                      <div className="text-xs text-muted">{sp.tagline}</div>
                    </div>

                    {/* Link status */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        minWidth: '200px',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {linkedName ? (
                        <span
                          className="badge badge-success"
                          style={{ fontSize: '0.75rem' }}
                        >
                          ✓ {linkedName}
                        </span>
                      ) : fbAccounts.length > 0 ? (
                        <select
                          onChange={(e) => {
                            if (e.target.value) linkPageToSatellite(sp.id, e.target.value);
                          }}
                          disabled={linking === sp.id}
                          className="filter-select"
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', maxWidth: '180px' }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            {linking === sp.id ? '⏳ Đang link...' : '🔗 Chọn page...'}
                          </option>
                          {fbAccounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.account_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-muted">Chưa kết nối FB</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
