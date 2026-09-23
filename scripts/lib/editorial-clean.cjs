/**
 * Làm sạch nội dung biên tập lấy từ database trước khi ghi ra src/data/*.json.
 *
 * Bia Thầy Tu là thương hiệu bia cao cấp: nội dung không dùng emoji, mũi tên hay
 * gạch ngang dài kiểu văn bản do AI viết, và không dùng ảnh do AI tạo (nhãn chai sai).
 * Chạy trong scripts/dump_data.js nên mọi lần build đều được làm sạch, kể cả khi
 * database còn nội dung cũ.
 */

// Ảnh do AI tạo → ảnh chính hãng tương ứng.
const IMAGE_REPLACEMENTS = {
  '/images/articles/phan-biet-bia-thay-tu.png': '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
  '/images/articles/mua-bia-thay-tu-chimay.png': '/images/brand/benediktiner-official/beer-garden-closeup.jpg',
};

// Ảnh quảng cáo của nhà cung cấp (banner nhiều chữ), không hợp thương hiệu: gỡ khỏi nội dung.
const REMOVED_IMAGE_PREFIXES = ['/images/products/the-wurst/'];
const isRemovedImage = (url) => typeof url === 'string' && REMOVED_IMAGE_PREFIXES.some((p) => url.startsWith(p));

function removeImages(s) {
  const src = '(?:' + REMOVED_IMAGE_PREFIXES.map((p) => p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|') + ')[^"\')\\s]*';
  return s
    // Khối bọc chỉ chứa ảnh bị gỡ
    .replace(new RegExp('<(div|figure|p)\\b[^>]*>\\s*<img\\b[^>]*src=["\']' + src + '["\'][^>]*>\\s*(?:<figcaption>[\\s\\S]*?<\\/figcaption>\\s*)?<\\/\\1>\\s*', 'g'), '')
    .replace(new RegExp('<img\\b[^>]*src=["\']' + src + '["\'][^>]*>', 'g'), '')
    .replace(new RegExp('!\\[[^\\]]*\\]\\(' + src + '\\)', 'g'), '');
}

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE0F}\u{200D}\u{20E3}]/u;
const EMOJI_G = new RegExp(EMOJI.source + '[\\s\\u00A0]?', 'gu');
const STAR = '⭐️?';

function tidy(s) {
  return s
    // Chỉ dọn dấu phẩy có khoảng trắng phía sau (dạng do các bước trên tạo ra), để không đụng rgba(0,0,0,.5).
    .replace(/, +([,.;:!?)])/g, '$1')
    .replace(/([:;(]) *, +/g, '$1 ')
    .replace(/[ \t]+,/g, ',')
    .replace(/(\S)[ \t]{2,}/g, '$1 ');
}

/** Chỉ biến đổi phần chữ, không đụng vào thẻ HTML và thuộc tính của chúng. */
function mapText(s, fn) {
  return s.split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : fn(part))).join('');
}

/** Ký hiệu trong ô bảng mang dữ liệu thật: giữ nghĩa, bỏ ký hiệu. */
function replaceTableMarks(s) {
  const cellEnd = '(?=\\s*(?:<\\/td>|\\||$))';
  return s
    .replace(new RegExp(`((?:${STAR}){1,5})${cellEnd}`, 'gmu'), (m) => `${(m.match(/⭐/g) || []).length}/5`)
    .replace(new RegExp(`❌\\uFE0F?${cellEnd}`, 'gmu'), 'Không')
    .replace(new RegExp(`✅\\uFE0F?${cellEnd}`, 'gmu'), 'Có');
}

function replaceArrows(s) {
  return s
    .replace(/(^|\(|\n)(\s*)→\s*/g, '$1$2')
    .replace(/\?(\s*<\/strong>)?\s*→\s*/g, '?$1 ')
    .replace(/:\s*→\s*/g, ': ')
    .replace(/\s+→\s+/g, ', rồi ')
    .replace(/→/g, '');
}

function replaceDashes(s, mode) {
  let out = s.replace(/(^|\n)([ \t]*)[—–][ \t]+/g, '$1$2');
  out = mode === 'title'
    ? out.replace(/\s+[—–]\s+/g, ': ').replace(/—/g, ': ')
    : out.replace(/\s+[—–]\s+/g, ', ').replace(/—/g, ', ');
  return out;
}

/** mode: 'title' (tiêu đề, dùng dấu hai chấm) | 'prose' (đoạn văn, dùng dấu phẩy). */
function cleanText(input, mode = 'prose') {
  if (typeof input !== 'string' || !input) return input;
  return mapText(replaceTableMarks(input), (text) =>
    tidy(replaceDashes(replaceArrows(text).replace(EMOJI_G, ''), mode)));
}

/** Nội dung HTML/Markdown: tiêu đề con theo kiểu 'title', phần còn lại theo kiểu 'prose'. */
function cleanRichText(input) {
  if (typeof input !== 'string' || !input) return input;
  const headings = [];
  const keep = (text) => `\u0000H${headings.push(cleanText(text, 'title')) - 1}\u0000`;
  let s = input
    .replace(/(<h[1-6][^>]*>)([\s\S]*?)(<\/h[1-6]>)/g, (m, open, body, close) => open + keep(body) + close)
    .replace(/^(#{1,6}[ \t]+)(.*)$/gm, (m, hashes, body) => hashes + keep(body));
  s = cleanText(s, 'prose');
  s = s.replace(/\u0000H(\d+)\u0000/g, (m, i) => headings[Number(i)]);
  for (const [from, to] of Object.entries(IMAGE_REPLACEMENTS)) s = s.split(from).join(to);
  return removeImages(s);
}

function cleanImage(url) {
  if (isRemovedImage(url)) return null;
  return typeof url === 'string' && IMAGE_REPLACEMENTS[url] ? IMAGE_REPLACEMENTS[url] : url;
}

function cleanArticle(article) {
  return {
    ...article,
    title: cleanText(article.title, 'title'),
    meta_description: cleanText(article.meta_description, 'prose'),
    content: cleanRichText(article.content),
    thumbnail_url: cleanImage(article.thumbnail_url),
  };
}

const PRODUCT_TEXT_KEY = /name|title|description|content|summary|excerpt|note|tagline/i;

function cleanProduct(product) {
  const out = { ...product };
  for (const [key, value] of Object.entries(product)) {
    if (typeof value === 'string' && PRODUCT_TEXT_KEY.test(key) && !/slug|url|image/i.test(key)) {
      out[key] = /<\/?[a-z][^>]*>/i.test(value) ? cleanRichText(value) : cleanText(value, /name|title/i.test(key) ? 'title' : 'prose');
    }
  }
  return out;
}

module.exports = { cleanText, cleanRichText, cleanArticle, cleanProduct, cleanImage, EMOJI, IMAGE_REPLACEMENTS, REMOVED_IMAGE_PREFIXES };
