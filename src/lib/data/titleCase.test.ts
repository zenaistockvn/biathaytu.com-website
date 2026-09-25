import { describe, expect, it } from 'vitest';
import { toSentenceCase } from './titleCase';

describe('toSentenceCase', () => {
  it.each([
    ['Bia Lúa Mì Đức (Weissbier) Là Gì? Sự Thật Về Lớp Bọt Và Mùi Chuối Chín', 'Bia lúa mì Đức (Weissbier) là gì? Sự thật về lớp bọt và mùi chuối chín'],
    ['Nguồn Gốc Bia Thầy Tu: Lịch Sử Bị Lãng Quên Của Tu Viện Ettal', 'Nguồn gốc Bia Thầy Tu: Lịch sử bị lãng quên của tu viện Ettal'],
    ['Giải Thưởng iTQi 3 Sao Là Gì? Vì Sao Benediktiner Weissbier Được Xướng Tên?', 'Giải thưởng iTQi 3 sao là gì? Vì sao Benediktiner Weissbier được xướng tên?'],
    ['Bitburger Premium Pils: Hành Trình 200 Năm Của Bia Draft Số 1 Nước Đức', 'Bitburger Premium Pils: Hành trình 200 năm của bia draft số 1 nước Đức'],
    ['Đạo Luật Tinh Khiết 1516 (Reinheitsgebot): Tôn Giáo Của Sự Nguyên Bản', 'Đạo Luật Tinh Khiết 1516 (Reinheitsgebot): Tôn giáo của sự nguyên bản'],
    ['Cách Nướng Xúc Xích Thüringer Bratwurst Chuẩn Vị Đức Tại Nhà', 'Cách nướng xúc xích Thüringer Bratwurst chuẩn vị Đức tại nhà'],
  ])('%s', (input, expected) => {
    expect(toSentenceCase(input)).toBe(expected);
  });

  it('giữ nguyên tiêu đề đã viết như câu', () => {
    const title = 'So sánh Weissbier vs Pilsner: Đâu là dòng bia Đức cho bàn tiệc của bạn?';
    expect(toSentenceCase(title)).toBe(title);
  });
});
