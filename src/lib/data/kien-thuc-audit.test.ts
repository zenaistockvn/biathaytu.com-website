import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
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
  it('src/data/articles.json là nguồn chính: build không đổ lại từ database, bài public không còn claim dinh dưỡng', () => {
    expect(JSON.parse(read('package.json')).scripts.build).not.toContain('dump_data');
    expect(read('scripts/dump_data.js')).not.toMatch(/path\.join\(__dirname, '\.\.', 'src', 'data'\)/);
    const published = new Set(getPublishedArticles().map((a) => a.id));
    const raw = (articlesData as Array<{ id: string; slug: string; content: string | null }>).filter((a) => published.has(a.id));
    expect(raw.length).toBe(published.size);
    for (const article of raw) {
      // Nội dung trong JSON đã sạch sẵn, kể cả khi tiêu đề con bị Viết Hoa lại.
      const text = stripHtml(sanitizeArticleContent(titleCaseHeadings(article.content ?? ''), article.slug) ?? '');
      expect(text, article.slug).not.toMatch(/vitamin|axit amin|khoáng chất|dinh dưỡng|bánh mì lỏng/i);
    }
  });

  it('chạy lại bộ làm sạch trên nội dung đã có trong JSON không làm đổi chữ', () => {
    const published = new Set(getPublishedArticles().map((a) => a.id));
    for (const article of (articlesData as Array<{ id: string; slug: string; content: string | null }>).filter((a) => published.has(a.id))) {
      expect(sanitizeArticleContent(article.content, article.slug), article.slug).toBe(article.content);
    }
  });

  it('tiêu đề con Viết Hoa Mỗi Chữ được đổi về dạng câu khi render', () => {
    const html = sanitizeArticleContent('<h2>Chiếc Ly Weizenglas Huyền Thoại</h2>\n<p>x</p>\n### Bia Lọc vs. Bia Không Lọc: Khác Nhau Thế Nào?', 'x');
    expect(html).toContain('<h2>Chiếc ly Weizenglas huyền thoại</h2>');
    expect(html).toContain('### Bia lọc vs. bia không lọc: Khác nhau thế nào?');
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

  it('mỗi bài có ảnh bìa riêng, file tồn tại, ảnh CC BY-SA có ghi nguồn', () => {
    const articles = getPublishedArticles();
    const covers = articles.map((a) => a.thumbnail_url);
    expect(articles.filter((a) => !a.thumbnail_url).map((a) => a.slug)).toEqual([]);
    expect(new Set(covers).size).toBe(covers.length);
    for (const src of covers) expect(existsSync(join(process.cwd(), 'public', src!)), src!).toBe(true);
    expect(getPublishedArticles().find((a) => a.slug === 'dao-luat-tinh-khiet-1516-reinheitsgebot')?.image_credit).toMatch(/CC BY-SA/);
  });

  it('thân bài không so sánh với bia Việt Nam và không nói nhà máy bia 700 năm', () => {
    for (const article of getPublishedArticles()) {
      const text = stripHtml(article.content ?? '');
      expect(text, article.slug ?? '').not.toMatch(/bia Việt Nam\?|của bia Việt\)|nhẹ hơn hầu hết bia Việt/);
      expect(text, article.slug ?? '').not.toMatch(/700 năm của nhà máy bia|bia thủ công[^.]*gần 700 năm/);
    }
  });
});
