/**
 * Chủ đề bài Kiến thức (audit A8, L3). Dữ liệu bài viết không có trường chủ đề nên xếp theo từ khoá
 * trong tiêu đề, xét lần lượt từ trên xuống; không khớp mục nào thì vào "Các dòng bia".
 */
export type ArticleTopicId = 'dong-bia' | 'thuong-thuc' | 'mon-an-kem' | 'lich-su';

export interface ArticleTopic {
  id: ArticleTopicId;
  label: string;
  match: RegExp | null;
}

export const ARTICLE_TOPICS: readonly ArticleTopic[] = [
  { id: 'mon-an-kem', label: 'Món ăn kèm', match: /xúc xích|food pairing|đồ nhắm|món\s/i },
  { id: 'thuong-thuc', label: 'Thưởng thức', match: /\brót\b|\bly\b|nhiệt độ|bảo quản/i },
  { id: 'lich-su', label: 'Lịch sử và câu chuyện', match: /lịch sử|nguồn gốc|\d+\s*năm|1516|giải thưởng|nguyên bản/i },
  { id: 'dong-bia', label: 'Các dòng bia', match: null },
];

export function getArticleTopic(title: string): ArticleTopic {
  return ARTICLE_TOPICS.find((topic) => topic.match?.test(title)) ?? ARTICLE_TOPICS[ARTICLE_TOPICS.length - 1];
}
