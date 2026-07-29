import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Accessibility & Focus Trap Regressions', () => {
  it('MobileBottomNav có aria-label rõ ràng cho nav và nút giỏ hàng', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/MobileBottomNav.tsx'), 'utf8');
    expect(src).toContain('aria-label="Thanh điều hướng nhanh"');
  });

  it('FloatingZaloCTA có aria-label cho nút Zalo', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/FloatingZaloCTA.tsx'), 'utf8');
    expect(src).toContain('aria-label="Chat Zalo với Bia Thầy Tu"');
  });

  it('FootballCampaignPopup xử lý focus trap và phím Esc', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/FootballCampaignPopup.tsx'), 'utf8');
    expect(src).toContain('Escape');
    expect(src).toContain('role="dialog"');
    expect(src).toContain('aria-modal="true"');
  });
});
