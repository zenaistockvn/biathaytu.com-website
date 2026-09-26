import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getPublishedArticles } from '@/lib/data/articles';
import { ARTICLE_TOPICS, getArticleTopic } from './articleTopics';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

describe('chủ đề bài Kiến thức (audit L3)', () => {
  it('mọi bài đang hiển thị có chủ đề, và chủ đề nào cũng có bài', () => {
    const topics = getPublishedArticles().map((article) => getArticleTopic(article.title).id);
    for (const topic of ARTICLE_TOPICS) expect(topics, topic.id).toContain(topic.id);
  });

  it('xếp đúng vài bài tiêu biểu', () => {
    expect(getArticleTopic('Top 3 loại xúc xích Đức nhập khẩu ăn kèm bia ngon nhất').id).toBe('mon-an-kem');
    expect(getArticleTopic('Tại sao bia lúa mì phải uống bằng ly cổ cao chân loe?').id).toBe('thuong-thuc');
    expect(getArticleTopic('Nguồn gốc Bia Thầy Tu: Lịch sử bị lãng quên của tu viện Ettal').id).toBe('lich-su');
    expect(getArticleTopic('Phân biệt các dòng bia Đức: Weissbier, Dunkel và Festbier').id).toBe('dong-bia');
  });

  it('/kien-thuc hiện 9 bài rồi "Xem thêm", bài chưa hiện vẫn có trong HTML', () => {
    const browser = read('src/app/(web)/kien-thuc/KnowledgeBrowser.tsx');
    expect(browser).toContain('const PAGE_SIZE = 9;');
    expect(browser).toContain('hidden={!visible.has(article.id)}');
    expect(browser).toContain('Xem thêm bài viết');
  });
});

describe('gộp trang và trang chủ (audit L5, L8)', () => {
  it('/ve-chung-toi chuyển 301 về /thuong-hieu, không còn trong sitemap', () => {
    expect(read('next.config.js')).toMatch(/source: '\/ve-chung-toi',\s*destination: '\/thuong-hieu',\s*statusCode: 301/);
    expect(read('src/app/sitemap.ts')).not.toContain('ve-chung-toi');
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/(web)/ve-chung-toi/page.tsx'))).toBe(false);
  });

  it('trang chủ chỉ còn một lối vào sản phẩm ("Các dòng bia")', () => {
    const home = read('src/app/(web)/page.tsx');
    expect(home).not.toContain('home-categories-title');
    expect(home).toContain('title="Các dòng bia"');
  });

  it('giờ hỗ trợ một nguồn: 8:00 - 22:00, không còn 9:00 - 21:00', () => {
    expect(read('src/config/company.ts')).toContain("supportHours: '8:00 - 22:00'");
    expect(read('src/app/(web)/lien-he/page.tsx')).toContain('COMPANY_CONFIG.supportHours');
    expect(read('src/app/(web)/components/GeoLocalCTA.tsx')).toContain('COMPANY_CONFIG.supportHours');
    for (const file of ['src/app/(web)/context/LanguageContext.tsx', 'src/app/(web)/lien-he/page.tsx']) {
      expect(read(file), file).not.toMatch(/0?9:00\s*(-|đến)\s*21:00/);
    }
  });

  it('khối showroom trong bài viết theo hệ thống, không nhúng <style>, không ghi giờ riêng', () => {
    const cta = read('src/app/(web)/components/GeoLocalCTA.tsx');
    expect(cta).not.toContain('dangerouslySetInnerHTML');
    expect(cta).not.toMatch(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/);
    expect(cta).toContain('Mở Zalo');
  });
});
