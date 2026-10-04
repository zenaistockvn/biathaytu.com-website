import { marked } from 'marked';
import styles from './ArticleBody.module.css';
import { noBreakHeadingsHtml } from '@/lib/vn-text';

/**
 * Improved content format detection:
 * - Pure HTML: contains multiple HTML tags (<h2>, <p>, <ul>, etc.) — use as-is
 * - Pure Markdown: starts with #, ##, **, etc. — parse with marked
 * - Mixed: if contains markdown indicators (##, **) alongside HTML → parse as markdown
 */
function shouldParseAsMarkdown(content: string): boolean {
  const trimmed = content.trim();

  // Clearly markdown: starts with # heading or list markers
  if (/^#{1,6}\s/.test(trimmed)) return true;
  if (/^\*{1,2}[^*]/.test(trimmed)) return true;
  if (/^-\s/.test(trimmed)) return true;

  // Count HTML tags vs markdown indicators
  const htmlTagCount = (trimmed.match(/<\/(h[1-6]|p|ul|ol|li|div|section|table|blockquote)>/g) || []).length;
  const mdIndicators = (trimmed.match(/^#{1,6}\s/gm) || []).length;

  // If significant markdown headings found, treat as markdown
  if (mdIndicators >= 2) return true;

  // If it starts with HTML and has many HTML tags, treat as HTML
  if (/^<[a-zA-Z]/.test(trimmed) && htmlTagCount >= 3) return false;

  // Default: if starts with HTML tag, treat as HTML
  if (/^<[a-zA-Z]/.test(trimmed)) return false;

  // Otherwise parse as markdown
  return true;
}

interface ArticleBodyProps {
  content: string | null;
}

/** Chạy trên server: HTML dựng sẵn, không tải `marked` và nội dung bài xuống trình duyệt. */
export default function ArticleBody({ content }: ArticleBodyProps) {
  let htmlContent = '<p><em>Chưa có nội dung chi tiết.</em></p>';
  if (content) {
    htmlContent = shouldParseAsMarkdown(content) ? (marked.parse(content, { async: false }) as string) : content;
  }

  return (
    <div
      className={`markdown-content ${styles.body}`}
      dangerouslySetInnerHTML={{ __html: noBreakHeadingsHtml(htmlContent) }}
    />
  );
}
