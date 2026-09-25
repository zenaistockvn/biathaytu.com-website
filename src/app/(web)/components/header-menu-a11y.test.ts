import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(
  path.join(process.cwd(), 'src/app/(web)/components/WebHeader.tsx'),
  'utf8',
);

describe('WebHeader — menu mobile là hộp thoại', () => {
  it('khai role="dialog", aria-modal và id được nút menu trỏ tới qua aria-controls', () => {
    expect(SRC).toContain('role="dialog"');
    expect(SRC).toContain('aria-modal="true"');
    expect(SRC).toContain('id={MOBILE_MENU_ID}');
    expect(SRC).toContain('aria-controls={MOBILE_MENU_ID}');
    expect(SRC).toMatch(/const MOBILE_MENU_ID = ['"][\w-]+['"]/);
  });

  it('đóng bằng Escape', () => {
    expect(SRC).toMatch(/\w+\.key === ['"]Escape['"]/);
    expect(SRC).toMatch(/Escape[\s\S]{0,120}setMenuOpenPath\(null\)/);
  });

  it('vòng phím Tab trong menu (bẫy focus)', () => {
    expect(SRC).toMatch(/\w+\.key !?== ['"]Tab['"]/);
    expect(SRC).toContain('shiftKey');
    expect(SRC).toMatch(/last\.focus\(\)/);
    expect(SRC).toMatch(/first\.focus\(\)/);
  });

  it('trả focus về nút menu khi đóng', () => {
    expect(SRC).toContain('ref={menuButtonRef}');
    expect(SRC).toMatch(/return \(\) => \{[\s\S]*?toggle\?\.focus\(\)/);
  });

  it('nav mobile có nhãn riêng, không trùng "Điều hướng chính" của nav desktop', () => {
    expect(SRC).toContain('<nav aria-label="Menu di động">');
    expect(SRC.match(/aria-label="Điều hướng chính"/g)).toHaveLength(1);
  });
});
