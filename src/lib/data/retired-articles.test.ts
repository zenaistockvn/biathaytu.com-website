import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getArticleBySlugOrId, getPublishedArticles } from '@/lib/data/articles';
import sitemap from '@/app/sitemap';
import { GET as getLlmsTxt } from '@/app/llms.txt/route';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require('../../../next.config.js');

const PHASE_B_RETIRED_ARTICLES: Record<string, string> = {
  'phan-biet-bia-thay-tu-trappist-va-bia-tu-vien': '/bia-thay-tu-la-gi',
  'dai-ly-phan-phoi-si-le-xuc-xich-duc-the-wurst-tay-ho': '/bang-gia-si-dai-ly',
  'mua-xuc-xich-duc-chinh-hang-o-dau-ha-noi-ship-hoa-toc': '/san-pham',
};

function getRetiredArticlesConfig(): Record<string, string> {
  const configPath = join(process.cwd(), 'src', 'config', 'retired-articles.json');
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  }
  return PHASE_B_RETIRED_ARTICLES;
}

describe('Phase B & E — Kiểm tra các bài viết đã gỡ/gộp', () => {
  it('các bài đã gỡ/gộp không còn xuất hiện trên mọi bề mặt public và có redirect 301', async () => {
    const retiredArticles = getRetiredArticlesConfig();

    const sitemapEntries = await sitemap();
    const sitemapUrls = sitemapEntries.map((e) => e.url);

    const llmsRes = await getLlmsTxt();
    const llmsText = await llmsRes.text();

    const redirects = await nextConfig.redirects();

    for (const [slug, destination] of Object.entries(retiredArticles)) {
      // 1. getArticleBySlugOrId(slug) trả null
      const article = getArticleBySlugOrId(slug);
      expect(article, `Bài ${slug} vẫn còn trả về từ getArticleBySlugOrId`).toBeNull();

      // 2. Không xuất hiện trong URL sitemap
      const foundInSitemap = sitemapUrls.some((u) => u.includes(`/kien-thuc/${slug}`) || u.includes(`/${slug}`));
      expect(foundInSitemap, `Bài ${slug} vẫn xuất hiện trong sitemap.xml`).toBe(false);

      // 3. Không xuất hiện trong llms.txt
      expect(llmsText, `Bài ${slug} vẫn xuất hiện trong llms.txt`).not.toContain(`/kien-thuc/${slug}`);

      // 4. Có redirect 301 trong next.config.js
      const redirect = redirects.find(
        (r: { source: string; destination: string; statusCode?: number }) =>
          r.source === `/kien-thuc/${slug}` &&
          r.destination === destination &&
          r.statusCode === 301,
      );
      expect(redirect, `Thiếu redirect 301 từ /kien-thuc/${slug} tới ${destination}`).toBeDefined();
    }
  });

  it('số lượng bài viết public giảm đúng bằng số bài đã gỡ/gộp', () => {
    const retiredCount = Object.keys(getRetiredArticlesConfig()).length;
    expect(getPublishedArticles().length).toBe(42 - retiredCount);
  });
});
