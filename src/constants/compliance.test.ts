import { describe, it, expect } from 'vitest';
import { BANK_CONFIG } from './compliance';

describe('BANK_CONFIG', () => {
  it('không bao giờ chứa placeholder pháp chế', () => {
    const all = Object.values(BANK_CONFIG).join(' ');
    expect(all).not.toMatch(/CẦN PHÁP CHẾ/i);
    expect(all).not.toMatch(/\[/);
  });
});
