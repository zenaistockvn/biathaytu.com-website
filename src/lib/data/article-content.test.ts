import { describe, expect, it } from 'vitest';
import articlesData from '@/data/articles.json';
import { getPublishedArticles, Article } from '@/lib/data/articles';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ');
}

function removeGeoFooter(rawContent: string): string {
  return rawContent.replace(/<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?(?:ship\s*(?:hoả|hỏa|hoa)\s*tốc)[\s\S]*?<\/p>/gi, '');
}

describe('Phase C — Kiểm tra dọn dẹp nội dung thân bài', () => {
  const publishedArticles = getPublishedArticles();

  it('không chứa ship hoả tốc hoặc giao hàng hoả tốc', () => {
    const violations: Array<{ slug: string; match: string }> = [];
    const pattern = /(?:ship\s*(?:hoả|hỏa|hoa)\s*tốc|giao hàng\s*(?:hoả|hỏa)\s*tốc)/i;

    for (const article of publishedArticles) {
      if (!article.content) continue;
      const text = stripHtml(article.content);
      const match = text.match(pattern);
      if (match) {
        violations.push({ slug: article.slug ?? article.id, match: match[0] });
      }
    }

    if (violations.length > 0) {
      console.error(`=== C1_SHIP_HOA_TOC ===: ${violations.length} bài vi phạm: ${violations.map((v) => v.slug).join(', ')}`);
    }
    expect(violations, `Có ${violations.length} bài chứa ship/giao hàng hoả tốc`).toEqual([]);
  });

  it('không chứa chuỗi hai ký tự \\n (backslash + n)', () => {
    const violations: string[] = [];

    for (const article of publishedArticles) {
      if (!article.content) continue;
      if (article.content.includes('\\n')) {
        violations.push(article.slug ?? article.id);
      }
    }

    if (violations.length > 0) {
      console.error(`=== C1_BACKSLASH_N ===: ${violations.length} bài chứa \\n: ${violations.join(', ')}`);
    }
    expect(violations, `Có ${violations.length} bài chứa literal \\n`).toEqual([]);
  });

  it('không chứa claim sức khỏe / dinh dưỡng', () => {
    const violations: Array<{ slug: string; match: string }> = [];
    const pattern = /vitamin|khoáng chất|axit amin|bổ dưỡng|dinh dưỡng|giải nhiệt|bánh mì lỏng|thức ăn lỏng|flüssiges brot/i;

    for (const article of publishedArticles) {
      if (!article.content) continue;
      const text = stripHtml(article.content);
      const match = text.match(pattern);
      if (match) {
        violations.push({ slug: article.slug ?? article.id, match: match[0] });
      }
    }

    if (violations.length > 0) {
      console.error(`=== C1_HEALTH_CLAIMS ===: ${violations.length} bài chứa claim sức khỏe: ${violations.map((v) => `${v.slug} (${v.match})`).join(', ')}`);
    }
    expect(violations, `Có ${violations.length} bài chứa claim sức khỏe`).toEqual([]);
  });

  it('không chứa giá bán cụ thể', () => {
    const violations: Array<{ slug: string; match: string }> = [];
    const pattern = /\d{1,3}(?:\.\d{3})+\s*(?:đ|₫|vnđ)/i;

    for (const article of publishedArticles) {
      if (!article.content) continue;
      const text = stripHtml(article.content);
      const match = text.match(pattern);
      if (match) {
        violations.push({ slug: article.slug ?? article.id, match: match[0] });
      }
    }

    if (violations.length > 0) {
      console.error(`=== C1_PRICES ===: ${violations.length} bài chứa giá tiền: ${violations.map((v) => `${v.slug} (${v.match})`).join(', ')}`);
    }
    expect(violations, `Có ${violations.length} bài chứa giá tiền`).toEqual([]);
  });

  it('không chứa lời kêu gọi inbox, COD, đặt mua', () => {
    const violations: Array<{ slug: string; match: string }> = [];
    const pattern = /\binbox\b|\bCOD\b|đặt mua/i;

    for (const article of publishedArticles) {
      if (!article.content) continue;
      const text = stripHtml(article.content);
      const match = text.match(pattern);
      if (match) {
        violations.push({ slug: article.slug ?? article.id, match: match[0] });
      }
    }

    if (violations.length > 0) {
      console.error(`=== C1_CALL_TO_ACTIONS ===: ${violations.length} bài chứa inbox/COD/đặt mua: ${violations.map((v) => `${v.slug} (${v.match})`).join(', ')}`);
    }
    expect(violations, `Có ${violations.length} bài chứa inbox/COD/đặt mua`).toEqual([]);
  });

  it('chống xóa lố: độ dài text sau sanitize >= 75% độ dài text gốc sau khi trừ footer', () => {
    const rawArticlesMap = new Map<string, Article>();
    for (const item of (articlesData as unknown as Article[])) {
      if (item.slug) rawArticlesMap.set(item.slug, item);
      if (item.id) rawArticlesMap.set(item.id, item);
    }

    const under75Articles: Array<{ slug: string; ratio: number }> = [];

    for (const article of publishedArticles) {
      const raw = rawArticlesMap.get(article.slug ?? '') ?? rawArticlesMap.get(article.id);
      if (!raw || !raw.content || !article.content) continue;

      const rawWithoutFooter = removeGeoFooter(raw.content);
      const rawText = stripHtml(rawWithoutFooter).replace(/\s+/g, ' ').trim();
      const sanitizedText = stripHtml(article.content).replace(/\s+/g, ' ').trim();

      const ratio = sanitizedText.length / rawText.length;
      if (ratio < 0.75) {
        under75Articles.push({ slug: article.slug ?? article.id, ratio: Number(ratio.toFixed(3)) });
      }
    }

    expect(under75Articles, `Các bài bị cắt dưới 75%`).toEqual([]);
  });
});
