'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserInfo {
  email: string;
  name: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({
          email: authUser.email ?? '',
          name:
            authUser.user_metadata?.name ??
            authUser.email?.split('@')[0] ??
            'User',
        });
      }
    });
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Fallback: sign out client-side only
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push('/login');
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === '/amc' && pathname !== '/amc') return false;
    return pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🍺</div>
        <div>
          <h1 style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>AMC <span style={{ color: 'var(--primary)', fontWeight: 400, fontSize: '0.7em' }}>×</span> Bia Thầy Tu</h1>
          <span>AI Marketing Center</span>
        </div>
      </div>

      <nav>
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <Link href="/amc" className={`nav-link ${isActive('/amc') ? 'active' : ''}`}>
            <span className="nav-icon">📊</span> Dashboard
          </Link>
          <Link href="/amc/library" className={`nav-link ${isActive('/amc/library') ? 'active' : ''}`}>
            <span className="nav-icon">📦</span> Content Library
          </Link>
          <Link href="/amc/studio" className={`nav-link ${isActive('/amc/studio') ? 'active' : ''}`}>
            <span className="nav-icon">🎨</span> AI Studio
          </Link>
          <Link href="/amc/blog" className={`nav-link ${isActive('/amc/blog') ? 'active' : ''}`}>
            <span className="nav-icon">📝</span> Blog SEO
          </Link>
          <Link href="/amc/gallery" className={`nav-link ${isActive('/amc/gallery') ? 'active' : ''}`}>
            <span className="nav-icon">📸</span> Image Gallery
          </Link>
          <Link href="/amc/video-prompts" className={`nav-link ${isActive('/amc/video-prompts') ? 'active' : ''}`}>
            <span className="nav-icon">🎬</span> Video Prompts
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Automation</div>
          <Link href="/amc/calendar" className={`nav-link ${isActive('/amc/calendar') ? 'active' : ''}`}>
            <span className="nav-icon">📅</span> Calendar
          </Link>
          <Link href="/amc/rules" className={`nav-link ${isActive('/amc/rules') ? 'active' : ''}`}>
            <span className="nav-icon">⚙️</span> Auto Rules
          </Link>
          <Link href="/amc/accounts" className={`nav-link ${isActive('/amc/accounts') ? 'active' : ''}`}>
            <span className="nav-icon">🔗</span> Social Accounts
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Interactions</div>
          <Link href="/amc/inbox" className={`nav-link ${isActive('/amc/inbox') ? 'active' : ''}`}>
            <span className="nav-icon">💬</span> Central Inbox
          </Link>
          <Link href="/amc/orders" className={`nav-link ${isActive('/amc/orders') ? 'active' : ''}`}>
            <span className="nav-icon">📦</span> Đơn Hàng
            {/* TODO: Add badge component here if needed */}
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Insights</div>
          <Link href="/amc/history" className={`nav-link ${isActive('/amc/history') ? 'active' : ''}`}>
            <span className="nav-icon">⏱️</span> Lịch sử Đăng bài
          </Link>
          <Link href="/amc/analytics" className={`nav-link ${isActive('/amc/analytics') ? 'active' : ''}`}>
            <span className="nav-icon">📈</span> Analytics
          </Link>
          <Link href="/amc/activity" className={`nav-link ${isActive('/amc/activity') ? 'active' : ''}`}>
            <span className="nav-icon">📋</span> Activity Log
          </Link>
        </div>
      </nav>

      {/* User info + Logout */}
      <div className="sidebar-user">
        {user ? (
          <>
            <div className="sidebar-user-info">
              <div className="sidebar-user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Đăng xuất"
            >
              {loggingOut ? '...' : '🚪'}
            </button>
          </>
        ) : (
          <div className="sidebar-user-info">
            <div className="sidebar-user-details">
              <div className="sidebar-user-name">Bia Thầy Tu</div>
              <div className="sidebar-user-email">Plan: Pro • Storyselling</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
