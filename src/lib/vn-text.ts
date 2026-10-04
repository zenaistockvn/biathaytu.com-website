/**
 * Xuống dòng đúng tiếng Việt (cùng cách làm với germantaste.vn). Trình duyệt coi mỗi âm tiết là một từ,
 * nên tiêu đề có thể gãy giữa từ ghép ("Lịch / sử", "làm / lạnh"). noBreak() nối các âm tiết của từ ghép
 * và của tên riêng ngắn bằng khoảng trắng không ngắt (\u00a0), rồi nối hai chữ cuối để không rớt chữ mồ côi.
 *
 * Chỉ dùng khi hiển thị tiêu đề, tên thẻ, câu hỏi; dữ liệu gốc (meta, JSON-LD) giữ khoảng trắng thường.
 * Bài mới có từ ghép chưa có trong danh sách thì thêm vào VN_WORDS.
 */

/** Từ ghép, cụm từ cố định, địa danh và số liệu kèm đơn vị. Không phân biệt hoa thường. */
const VN_WORDS = [
  // Địa chỉ, địa danh, tên riêng
  'Hà Nội', 'Ba Đình', 'Tây Hồ', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Việt Nam', 'nước Đức', 'người Đức',
  'Tu viện Ettal', 'Bia Thầy Tu', 'thầy tu', 'German Taste', 'The Wurst', 'So close to heaven',
  // Bia và sản phẩm
  'bia Đức', 'bia Bỉ', 'bia đen', 'bia vàng', 'bia tươi', 'bia lúa mì', 'bia lọc', 'không lọc', 'không cồn',
  'bia tu viện', 'bom bia', 'chai bia', 'lon bia', 'ly bia', 'két bia', 'thùng bia', 'vang Đức', 'vang trắng',
  'vang đỏ', 'lúa mì', 'mạch nha', 'hoa bia', 'men bia', 'nấm men', 'lên men', 'nguyên liệu', 'tu viện',
  'dòng tu', 'nhà bia', 'xưởng bia', 'đinh hương', 'chuối chín', 'trái cây', 'tự nhiên', 'tinh khiết',
  'Đạo luật', 'hương vị', 'hậu vị', 'vị đắng', 'độ đắng', 'độ cồn', 'nồng độ', 'nhiệt độ', 'thông số',
  'phong cách', 'nguồn gốc', 'lịch sử', 'lãng quên', 'truyền thống', 'công thức', 'thương hiệu', 'tên gọi',
  'cao cấp', 'chất lượng', 'thành lập', 'nổi tiếng', 'tiêu biểu', 'đặc trưng', 'đặc điểm', 'giải thưởng',
  'bí quyết', 'bí mật', 'sự thật', 'hành trình', 'thế giới', 'khác biệt', 'nguyên bản', 'chính gốc',
  // Phục vụ, bảo quản
  'làm lạnh', 'mở vòi', 'mở van', 'vòi rót', 'bảo quản', 'phục vụ', 'tủ lạnh', 'ngăn mát', 'lớp bọt',
  'lớp men', 'quy cách', 'dung tích', 'kiểm tra', 'hướng dẫn', 'lưu ý', 'trước khi', 'sau khi', 'cách rót',
  'cách chọn', 'đúng cách', 'tại nhà', 'thưởng thức', 'kinh nghiệm',
  // Món ăn, dịp dùng
  'món Việt', 'món ăn', 'ẩm thực', 'đồ nhắm', 'xúc xích', 'kết hợp', 'bữa tiệc', 'bàn tiệc', 'hải sản',
  'đồ nướng', 'thịt nướng', 'quà Tết', 'quà tặng', 'hộp quà', 'set quà', 'gia đình', 'bạn bè', 'đối tác',
  'doanh nghiệp', 'người mới', 'bắt đầu', 'lựa chọn', 'phù hợp', 'gợi ý', 'lễ hội',
  // Kinh doanh, trang
  'nhập khẩu', 'chính hãng', 'chính ngạch', 'phân phối', 'đại lý', 'bán buôn', 'bảng giá', 'giá sỉ',
  'nhà hàng', 'khách sạn', 'cửa hàng', 'siêu thị', 'điểm bán', 'sản phẩm', 'danh mục', 'báo giá',
  'hợp tác', 'liên hệ', 'địa chỉ', 'mở cửa', 'chính sách', 'bảo mật', 'điều khoản', 'sử dụng', 'thông tin',
  'mua hàng', 'chứng nhận', 'độ tuổi', 'câu hỏi', 'thường gặp', 'kiến thức', 'bài viết', 'liên quan',
  'giới thiệu', 'xuất xứ', 'nhãn phụ', 'hạn dùng', 'giao hàng',
  // Lấy từ tiêu đề bài trong articles.json (10/2026)
  'tĩnh lặng', 'di sản', 'khởi đầu', 'sắc lệnh', 'hoàng gia', 'đầu tiên', 'thời gian', 'thay đổi', 'hỏa hoạn',
  'thế tục hóa', 'tái lập', 'câu chuyện', 'chuyên gia', 'đặc biệt', 'phổ biến', 'sai lầm', 'ánh sáng',
  'ngăn đông', 'đông đá', 'liên tục', 'quá hạn', 'tham khảo', 'chi tiết', 'tổng hợp', 'tóm tắt', 'nguyên tắc',
  'đồ ăn vặt', 'đồ ăn', 'món nhắm', 'thức uống', 'cuộc vui', 'trò chuyện', 'chiều sâu', 'sảng khoái',
  'thanh mát', 'đậm đà', 'dễ uống', 'đắng thanh', 'mát lạnh', 'tinh tế', 'sang trọng', 'đẳng cấp', 'chỉn chu',
  'nhịp sống', 'hiện đại', 'công nghệ', 'trải nghiệm', 'tôn trọng', 'hương thơm', 'màu sắc', 'trái tim',
  'linh hồn', 'nền tảng', 'biểu tượng', 'toàn cầu', 'văn hóa', 'ý nghĩa', 'huyền thoại', 'thung lũng',
  'quốc gia', 'mạch nước ngầm', 'độc quyền', 'cầu nguyện', 'tu sĩ', 'thắc mắc', 'giải đáp', 'bình thường',
  'vẩn đục', 'mờ đục', 'men sống', 'trọn vẹn', 'thuật ngữ', 'hương liệu', 'quy trình', 'đánh giá',
  'khắc nghiệt', 'chinh phục', 'tuyệt đối', 'phù thủy', 'công tước', 'thuần khiết', 'cụ thể', 'thực tế',
  'thực hành', 'kinh điển', 'gia vị', 'lá lốt', 'cân bằng', 'giải nhiệt', 'làm sạch', 'phô mai', 'chiên rán',
  'nóng hổi', 'bất ngờ', 'hài hòa', 'nghi thức', 'công việc', 'quá trình', 'hợp chất', 'bí ẩn', 'song sinh',
  'ngân sách', 'hằng ngày', 'quà biếu', 'mở nắp', 'vận hành', 'tối giản', 'khẩu vị', 'nhà sản xuất',
  'giống nho', 'đá vôi', 'đá phiến', 'khí hậu', 'rượu vang', 'cuối tuần', 'tiện lợi', 'vượt trội',
  'giải pháp', 'tối ưu', 'sành bia', 'sành sỏi', 'lâu đời', 'an toàn', 'thực phẩm', 'kiệt tác', 'bảo chứng',
  'đau đầu', 'tuân thủ', 'thuật toán', 'chiến lược', 'thể hiện', 'vật lý', 'kích thước', 'chân loe',
  'sống còn', 'thí nghiệm', 'đúng điệu', 'đúng gu', 'đúng chuẩn', 'phụ kiện', 'vùng miền', 'đặc sản',
  'nữ hoàng', 'ông hoàng', 'quyến rũ', 'hổ phách', 'thảnh thơi', 'buổi tối', 'đồng hành', 'người bạn',
  // Câu hỏi
  'khác nhau', 'thế nào', 'bao nhiêu', 'bao lâu', 'vì sao', 'tại sao', 'làm sao', 'nghĩa là', 'có phải',
  'không phải', 'phân biệt', 'so sánh',
];

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');

/** Số liệu kèm đơn vị: "5 lít", "12 chai", "500 ml", "5,4% vol", "200 năm". */
const UNITS = '\\d+(?:[.,]\\d+)?\\s*(?:%\\s*vol|lít|ly|lon|chai|bom|ml|L|năm|phút|độ|sao|món|dòng|bước|nguyên liệu)';

const WORDS = new RegExp(
  `(?<![\\p{L}\\d])(?:${UNITS}|${[...VN_WORDS].sort((a, b) => b.length - a.length).map(escape).join('|')})(?![\\p{L}])`,
  'giu',
);

/**
 * Tên riêng ngắn: hai hoặc ba âm tiết viết hoa liền nhau, mỗi âm tiết tối đa 7 ký tự ("Tây Hồ").
 * Tên dài như "Benediktiner Weissbier" vẫn được ngắt để không tràn màn hình hẹp.
 */
const PROPER = /(?<![\p{L}])\p{Lu}\p{Ll}{0,6}(?:[ ]\p{Lu}\p{Ll}{0,6}){1,2}(?![\p{L}])/gu;

const bind = (match: string) => match.replace(/\s+/g, '\u00a0');

/** Nối 2 chữ cuối để không rớt một chữ lẻ xuống dòng cuối. */
export const preventOrphan = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/\s+([^\s]+)$/, '\u00a0$1');
};

export const noBreak = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  return preventOrphan(text.replace(WORDS, bind).replace(PROPER, bind));
};

/** noBreak cho prop có thể là chuỗi hoặc phần tử React: chỉ đổi khi là chuỗi. */
export const noBreakNode = <T,>(value: T): T => (typeof value === 'string' ? (noBreak(value) as T) : value);

/** Như noBreak cho tiêu đề h1–h4 trong HTML thân bài: chỉ đổi chữ, giữ nguyên thẻ và thuộc tính. */
export const noBreakHeadingsHtml = (html: string): string =>
  html.replace(/(<h[1-4]\b[^>]*>)([\s\S]*?)(<\/h[1-4]>)/gi, (_, open: string, body: string, close: string) => {
    const parts = body.split(/(<[^>]*>)/);
    const last = parts.reduce((index, part, i) => (i % 2 === 0 && part.trim() ? i : index), -1);
    const inner = parts
      .map((part, i) => (i % 2 ? part : i === last ? noBreak(part.replace(/\s+$/, '')) + part.slice(part.trimEnd().length) : part.replace(WORDS, bind).replace(PROPER, bind)))
      .join('');
    return open + inner + close;
  });
