import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import articlesData from '@/data/articles.json';
import { getArticleTopic } from '@/config/articleTopics';
import { getPublishedArticles, getRelatedArticles, sanitizeArticleContent } from './articles';
import { formatArticleDate, readingMinutes } from './articleFormat';
import { toSentenceCaseHtml } from './titleCase';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ');

/** Tiêu đề con như trong database: Viết Hoa Mỗi Chữ (phần chữ, không đụng thẻ). */
function titleCaseHeadings(content: string): string {
  const capitalise = (text: string) =>
    text.split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : part.replace(/(^|\s|["(])(\p{Ll})/gu, (_, pre, ch) => pre + ch.toUpperCase()))).join('');
  return content
    .replace(/(<h[1-6][^>]*>)([\s\S]*?)(<\/h[1-6]>)/g, (_, open, body, close) => open + capitalise(body) + close)
    .replace(/^(#{1,6}[ \t]+)(.*)$/gm, (_, hashes, body) => hashes + capitalise(body));
}

describe('audit /kien-thuc 09/2026', () => {
  it('build đổ lại dữ liệu từ database (tiêu đề con Viết Hoa) vẫn cắt được đoạn "vitamin" và không còn claim dinh dưỡng', () => {
    const raw = (articlesData as Array<{ slug: string; content: string | null }>).find(
      (a) => a.slug === 'su-that-ve-lop-men-van-duc-naturtrub',
    );
    const fromDatabase = titleCaseHeadings(raw!.content!);
    expect(fromDatabase).toContain('Men Sống: "Vitamin Bia"');
    const text = stripHtml(sanitizeArticleContent(fromDatabase, raw!.slug) ?? '');
    expect(text).not.toMatch(/vitamin|axit amin|khoáng chất|dinh dưỡng|bánh mì lỏng/i);
  });

  it('tiêu đề con Viết Hoa Mỗi Chữ được đổi về dạng câu khi render', () => {
    const html = sanitizeArticleContent('<h2>Chiếc Ly Weizenglas Huyền Thoại</h2>\n<p>x</p>\n### Bia Lọc vs. Bia Không Lọc: Khác Nhau Thế Nào?', 'x');
    expect(html).toContain('<h2>Chiếc ly Weizenglas huyền thoại</h2>');
    expect(html).toContain('### Bia lọc vs. bia không lọc: khác nhau thế nào?');
    expect(sanitizeArticleContent('<h2>Weissbier Là Gì?</h2>', 'x')).toBe('<h2>Weissbier là gì?</h2>');
    expect(toSentenceCaseHtml('Ly <a href="/san-pham/a">Benediktiner</a> Chính Hãng Của Tu Viện')).toBe(
      'Ly <a href="/san-pham/a">Benediktiner</a> chính hãng của tu viện',
    );
  });

  it('ngày đăng theo giờ Việt Nam, giống nhau ở server (UTC) và trình duyệt', () => {
    expect(formatArticleDate('2026-04-28T20:25:34.432Z')).toBe('29/4/2026');
    expect(formatArticleDate('2026-04-08T06:26:07.461Z')).toBe('8/4/2026');
    expect(readingMinutes(50)).toBe(1);
    expect(readingMinutes(null)).toBe(3);
    for (const file of ['src/app/(web)/components/ui/ArticleCard.tsx', 'src/app/(web)/kien-thuc/[slug]/page.tsx']) {
      expect(read(file), file).not.toContain('toLocaleDateString');
    }
  });

  it('bài liên quan ưu tiên cùng chủ đề', () => {
    for (const article of getPublishedArticles()) {
      const topic = getArticleTopic(article.title).id;
      const related = getRelatedArticles(article, 3);
      const sameTopic = getPublishedArticles().filter((a) => a.id !== article.id && getArticleTopic(a.title).id === topic).length;
      expect(related.filter((a) => getArticleTopic(a.title).id === topic).length, article.slug ?? '').toBe(Math.min(3, sameTopic));
      expect(related.some((a) => a.id === article.id)).toBe(false);
    }
  });

  it('danh sách /kien-thuc không gửi nội dung bài xuống trình duyệt', () => {
    const page = read('src/app/(web)/kien-thuc/page.tsx');
    expect(page).toContain('toArticleSummary');
    expect(page).not.toMatch(/\.\.\.article\b/);
    expect(read('src/app/(web)/kien-thuc/[slug]/ArticleBody.tsx')).not.toContain("'use client'");
  });

  it('tiêu đề và mô tả không có "số 1", "ngon nhất", câu chê bia khác, claim dinh dưỡng hay giao hàng', () => {
    const banned = /số 1|số một|ngon nhất|tốt nhất|hóa chất|hoá chất|dưỡng chất|dinh dưỡng|giao hỏa tốc|giao hoả tốc|\s-\s/i;
    const violations = getPublishedArticles()
      .flatMap((a) => [a.title, a.meta_description ?? ''].filter((s) => banned.test(s)).map((s) => `${a.slug}: ${s}`));
    expect(violations).toEqual([]);
    const tooLong = getPublishedArticles().filter((a) => (a.meta_description ?? '').length > 160).map((a) => a.slug);
    expect(tooLong).toEqual([]);
  });

  it('thân bài không so sánh với bia Việt Nam và không nói nhà máy bia 700 năm', () => {
    for (const article of getPublishedArticles()) {
      const text = stripHtml(article.content ?? '');
      expect(text, article.slug ?? '').not.toMatch(/bia Việt Nam\?|của bia Việt\)|nhẹ hơn hầu hết bia Việt/);
      expect(text, article.slug ?? '').not.toMatch(/700 năm của nhà máy bia|bia thủ công[^.]*gần 700 năm/);
    }
  });
});
