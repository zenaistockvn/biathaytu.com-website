// Dùng được ở cả server và trình duyệt: không import dữ liệu bài viết.

const DATE_FORMAT = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

/**
 * Ngày đăng theo giờ Việt Nam. Server Vercel chạy UTC, trình duyệt chạy giờ máy người đọc;
 * không cố định múi giờ thì bài đăng sau 7h sáng lệch một ngày và React báo lỗi hydration #418.
 */
export function formatArticleDate(isoDate: string): string {
  return DATE_FORMAT.format(new Date(isoDate));
}

/** Số phút đọc, 200 chữ một phút, tối thiểu 1; thiếu số chữ thì coi là 3 phút. */
export function readingMinutes(wordCount: number | null): number {
  return wordCount ? Math.max(1, Math.round(wordCount / 200)) : 3;
}
