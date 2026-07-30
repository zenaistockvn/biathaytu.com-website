import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/FootballCampaignPopup.tsx'), 'utf8');

describe('FootballCampaignPopup — không được vượt cổng tuổi', () => {
  it('chỉ hẹn giờ sau khi đã xác minh tuổi', () => {
    expect(SRC).toContain('isAgeVerified');
    expect(SRC).toContain('ageVerificationPassed');
  });
  it('có ngày kết thúc chiến dịch để không hiện vĩnh viễn', () => {
    const m = SRC.match(/CAMPAIGN_ENDS_AT\s*=\s*'([^']+)'/);
    expect(m, 'thiếu hằng CAMPAIGN_ENDS_AT').toBeTruthy();
    expect(Number.isNaN(Date.parse(m![1]))).toBe(false);
  });
});
