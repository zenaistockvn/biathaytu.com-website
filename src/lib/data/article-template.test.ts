import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPublishedArticles, getArticleBySlugOrId } from '@/lib/data/articles';
import { generateMetadata } from '@/app/(web)/kien-thuc/[slug]/page';

function countWords(content: string | null): number {
  if (!content) return 0;
  const plainText = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>|]/g, ' ')
    .trim();
  if (!plainText) return 0;
  return plainText.split(/\s+/).filter(Boolean).length;
}

describe('Phase D — Template trang bài viết và word count', () => {
  it('D.1 CTA cuối bài đã được thay đổi đúng định hướng brochure', () => {
    const pagePath = join(process.cwd(), 'src', 'app', '(web)', 'kien-thuc', '[slug]', 'page.tsx');
    const source = readFileSync(pagePath, 'utf8');

    expect(source).not.toContain('Cửa Hàng');
    expect(source).not.toContain('ngay hôm nay');
    expect(source).not.toContain('Sẵn sàng để thưởng thức');

    expect(source).toContain('Tìm hiểu thêm về các dòng bia');
    expect(source).toContain('Thông tin chi tiết về các dòng bia Đức nhập khẩu chính hãng do Bia Thầy Tu phân phối.');
    expect(source).toContain('Xem các dòng bia');
  });

  it('D.2 word_count được tính lại từ content đã sanitize', () => {
    const articles = getPublishedArticles();
    expect(articles.length).toBeGreaterThan(0);

    for (const article of articles) {
      const expectedWords = countWords(article.content);
      expect(article.word_count).toBe(expectedWords);
    }

    const testSlug = 'bi-quyet-rot-bia-lua-mi-chuan-chuyen-gia';
    const testArticle = getArticleBySlugOrId(testSlug);
    if (testArticle) {
      expect(testArticle.word_count).toBeLessThan(600);
    }
  });

  it('D.3 OG image không khai báo width/height khi dùng ảnh fallback /logo.jpg', async () => {
    const articles = getPublishedArticles();
    const withoutThumb = articles.find((a) => !a.thumbnail_url);
    expect(withoutThumb).toBeDefined();

    if (withoutThumb?.slug) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: withoutThumb.slug }) });
      const ogImages = meta.openGraph?.images as Array<{ url: string; width?: number; height?: number }> | undefined;
      expect(ogImages).toBeDefined();
      expect(ogImages?.[0]?.width).toBeUndefined();
      expect(ogImages?.[0]?.height).toBeUndefined();
    }

    const withThumb = articles.find((a) => Boolean(a.thumbnail_url));
    if (withThumb?.slug) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: withThumb.slug }) });
      const ogImages = meta.openGraph?.images as Array<{ url: string; width?: number; height?: number }> | undefined;
      expect(ogImages?.[0]?.width).toBe(1200);
      expect(ogImages?.[0]?.height).toBe(630);
    }
  });
});
