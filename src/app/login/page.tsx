import type { Metadata } from 'next';
import './login.css';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập — AMC × Bia Thầy Tu',
  description: 'Đăng nhập vào hệ thống AI Marketing Center',
};

import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
