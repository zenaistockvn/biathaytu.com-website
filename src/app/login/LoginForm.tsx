'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type FormMode = 'login' | 'forgot';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/amc';

  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Email hoặc mật khẩu không đúng'
          : authError.message,
      );
      setLoading(false);
      return;
    }

    // Log activity server-side
    try {
      await fetch('/api/auth/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login' }),
      });
    } catch {
      // Non-blocking — don't fail login if logging fails
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/login`,
      },
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư.');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🍺</div>
          <h1 className="login-logo-title">
            AMC <span className="login-logo-accent">×</span> Bia Thầy Tu
          </h1>
          <p className="login-logo-subtitle">AI Marketing Center</p>
        </div>

        {/* Form card */}
        <div className="login-card">
          <h2 className="login-card-title">
            {mode === 'login' ? 'Đăng nhập' : 'Quên mật khẩu'}
          </h2>
          <p className="login-card-desc">
            {mode === 'login'
              ? 'Chào mừng trở lại! Đăng nhập để quản lý content.'
              : 'Nhập email để nhận link khôi phục mật khẩu.'}
          </p>

          {error && (
            <div className="alert alert-error" role="alert">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              ✅ {success}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleForgotPassword}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {mode === 'login' && (
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">
                  Mật khẩu
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading && <span className="login-spinner" />}
              {mode === 'login'
                ? loading
                  ? 'Đang đăng nhập...'
                  : '🔐 Đăng nhập'
                : loading
                  ? 'Đang gửi...'
                  : '📧 Gửi email khôi phục'}
            </button>
          </form>

          <div className="login-footer">
            {mode === 'login' ? (
              <button
                type="button"
                className="login-link-btn"
                onClick={() => {
                  setMode('forgot');
                  setError(null);
                  setSuccess(null);
                }}
              >
                Quên mật khẩu?
              </button>
            ) : (
              <button
                type="button"
                className="login-link-btn"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccess(null);
                }}
              >
                ← Quay lại đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* Footer text */}
        <p className="login-footer-text">
          Premium German Beer · AI-Powered Marketing
        </p>
      </div>
    </div>
  );
}
