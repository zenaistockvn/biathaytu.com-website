import { describe, expect, it } from 'vitest';
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { getPublishedArticles } from '@/lib/data/articles';
import { getVisibleProducts } from '@/lib/data/products';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require('../../../next.config.js');

function getStaticRoutes(): Set<string> {
  const root = process.cwd();
  const searchDirs = [
    join(root, 'src', 'app', '(web)'),
    join(root, 'src', 'app', '(bare)'),
  ];
  const routes = new Set<string>();

  function scan(dir: string, baseDir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath, baseDir);
      } else if (entry.isFile() && entry.name === 'page.tsx') {
        const rel = relative(baseDir, dir).replace(/\\/g, '/');
        const segments = rel.split('/').filter(Boolean);
        // Bỏ route động [...]
        if (segments.some((s) => s.startsWith('[') && s.endsWith(']'))) {
          continue;
        }
        // Bỏ route group (...)
        const routeSegments = segments.filter((s) => !(s.startsWith('(') && s.endsWith(')')));
        const routePath = '/' + routeSegments.join('/');
        routes.add(routePath === '//' ? '/' : routePath);
      }
    }
  }

  for (const dir of searchDirs) {
    scan(dir, dir);
  }

  return routes;
}

function normalizeInternalLink(rawHref: string): string | null {
  let href = rawHref.trim();
  // Bỏ qua tel:, mailto:, link neo thuần túy, javascript:
  if (/^(?:mailto:|tel:|javascript:|#)/i.test(href)) {
    return null;
  }

  // Chuẩn hóa tên miền nội bộ
  const internalDomainPattern = /^https?:\/\/(?:www\.)?biathaytu\.com/i;
  if (internalDomainPattern.test(href)) {
    href = href.replace(internalDomainPattern, '');
  } else if (/^https?:\/\//i.test(href)) {
    // Link ngoài
    return null;
  }

  // Bỏ query và hash
  href = href.split('?')[0].split('#')[0];

  // Đảm bảo bắt đầu bằng /
  if (!href.startsWith('/')) {
    href = '/' + href;
  }

  // Bỏ dấu / cuối trừ trang chủ
  if (href.length > 1 && href.endsWith('/')) {
    href = href.replace(/\/+$/, '');
  }

  return href;
}

function extractInternalLinks(content: string): string[] {
  const links: string[] = [];

  // HTML: href="..." hoặc href='...'
  const htmlRegex = /href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = htmlRegex.exec(content)) !== null) {
    const normalized = normalizeInternalLink(match[1]);
    if (normalized) {
      links.push(normalized);
    }
  }

  // Markdown: [text](url)
  const mdRegex = /\[(?:[^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/gi;
  while ((match = mdRegex.exec(content)) !== null) {
    const normalized = normalizeInternalLink(match[1]);
    if (normalized) {
      links.push(normalized);
    }
  }

  return links;
}

describe('Phase A — Kiểm tra link nội bộ trong bài viết', () => {
  it('không có link nội bộ nào trỏ tới 404 trong toàn bộ bài viết public', () => {
    const staticRoutes = getStaticRoutes();
    const visibleProductSlugs = new Set(getVisibleProducts().map((p) => p.slug));
    const publishedArticles = getPublishedArticles();
    const publishedArticleSlugs = new Set(publishedArticles.map((a) => a.slug));

    const brokenLinks: Array<{ articleSlug: string; link: string }> = [];

    for (const article of publishedArticles) {
      if (!article.content) continue;
      const links = extractInternalLinks(article.content);

      for (const link of links) {
        // (a) Route tĩnh
        if (staticRoutes.has(link)) {
          continue;
        }

        // (b) /san-pham/<slug>
        const productMatch = /^\/san-pham\/([^/]+)$/.exec(link);
        if (productMatch && visibleProductSlugs.has(productMatch[1])) {
          continue;
        }

        // (c) /kien-thuc/<slug> hoặc /blog/<slug>
        const articleMatch = /^\/(?:kien-thuc|blog)\/([^/]+)$/.exec(link);
        if (articleMatch && publishedArticleSlugs.has(articleMatch[1])) {
          continue;
        }

        brokenLinks.push({ articleSlug: article.slug ?? article.id, link });
      }
    }

    if (brokenLinks.length > 0) {
      console.error(`=== KET_QUA_PHASE_A ===: Tìm thấy ${brokenLinks.length} link hỏng trong ${new Set(brokenLinks.map((b) => b.articleSlug)).size} bài.`);
    }

    const articleCount = new Set(brokenLinks.map((b) => b.articleSlug)).size;
    expect(brokenLinks.length, `Số bài bị ảnh hưởng: ${articleCount}`).toBe(0);
    expect(brokenLinks).toEqual([]);
  });

  it('next.config.js có đủ 4 redirect 301 từ slug sản phẩm cũ sang slug mới', async () => {
    const redirects = await nextConfig.redirects();
    const requiredRedirects = [
      {
        source: '/san-pham/benediktiner-weissbier-naturtrub-500ml',
        destination: '/san-pham/benediktiner-naturtrub-thung-12-chai-500ml',
        statusCode: 301,
      },
      {
        source: '/san-pham/bitburger-premium-pils-330ml',
        destination: '/san-pham/bitburger-premium-pils-thung-12-chai-330ml',
        statusCode: 301,
      },
      {
        source: '/san-pham/benediktiner-dunkel-500ml',
        destination: '/san-pham/benediktiner-dunkel-thung-12-chai-500ml',
        statusCode: 301,
      },
      {
        source: '/san-pham/bom-5l-benediktiner-weissbier',
        destination: '/san-pham/benediktiner-naturtrub-bom-5l',
        statusCode: 301,
      },
    ];

    for (const req of requiredRedirects) {
      const found = redirects.find(
        (r: { source: string; destination: string; statusCode?: number }) =>
          r.source === req.source &&
          r.destination === req.destination &&
          r.statusCode === req.statusCode,
      );
      expect(found, `Thiếu redirect từ ${req.source} sang ${req.destination}`).toBeDefined();
    }
  });
});
