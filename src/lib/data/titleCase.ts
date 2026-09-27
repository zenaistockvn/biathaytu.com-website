/**
 * `npm run build` đổ lại articles.json từ database, nơi tiêu đề bài và tiêu đề con còn Viết Hoa Mỗi Chữ,
 * nên phải đổi khi render. Quy tắc (DESIGN.md): viết hoa chữ đầu, chữ đầu sau "?" "!" "." và tên riêng;
 * sau dấu ":" viết thường.
 */
const PROPER_PHRASES: Array<[string, string]> = [
  ['Đạo Luật Tinh Khiết', 'Đạo luật Tinh khiết'],
  ['Luật Tinh Khiết', 'Luật Tinh khiết'],
  ['Tu Viện Ettal', 'Tu viện Ettal'],
  ['Bia Thầy Tu', 'Bia Thầy Tu'],
  ['The Wurst', 'The Wurst'],
  ['La Trappe', 'La Trappe'],
  ['Hà Nội', 'Hà Nội'],
  ['Tây Hồ', 'Tây Hồ'],
  ['Việt Nam', 'Việt Nam'],
  ['Nha Trang', 'Nha Trang'],
  ['Chè Thái', 'Chè Thái'],
];
const PROPER_WORDS = new Set([
  'Benediktiner', 'Bitburger', 'Premium', 'Pils', 'Pilsner', 'Weissbier', 'Weizen', 'Weizenglas', 'Dunkel', 'Naturtrüb',
  'Festbier', 'Đức', 'Bỉ', 'Chimay', 'Trappist', 'Ettal', 'Bavaria', 'Việt', 'Thüringer', 'Bratwurst', 'Wiener',
  'Reinheitsgebot', 'Siegelhopfen', 'Eifel', 'Hallertau', 'Oktoberfest', 'Facebook', 'Kölsch', 'Altbier',
  'Klosterbier', 'Hefe', 'Weisswurst', 'Märzen', 'Alps', 'Ammergau', 'Ludwig',
]);

const WORD = /^\p{Lu}\p{Ll}*$/u;

function isTitleCase(text: string): boolean {
  const words = text
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}]+/u, ''))
    .filter((word) => /^\p{L}/u.test(word));
  if (words.length < 3) return false;
  const capitalised = words.filter((w) => /^\p{Lu}/u.test(w)).length;
  return capitalised / words.length >= 0.7;
}

/** Hết câu khi từ kết thúc bằng ? ! . nhưng không phải "vs." hay dấu ba chấm. */
function endsSentence(token: string): boolean {
  return /[?!.]$/.test(token) && !/\.\.\.$|…$/.test(token) && !/^vs\.$/i.test(token);
}

/** Đổi một đoạn chữ; `state.start` nối qua các đoạn khi tiêu đề có thẻ HTML xen giữa. */
function convert(text: string, state: { start: boolean }): string {
  const placeholders: string[] = [];
  let out = text;
  for (const [from, to] of PROPER_PHRASES) {
    out = out.split(from).join(`\u0000${placeholders.push(to) - 1}\u0000`);
  }

  out = out
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token) || token === '') return token;
      const lead = token.match(/^[^\p{L}\p{N}\u0000]*/u)?.[0] ?? '';
      const core = token.slice(lead.length);
      const bare = core.replace(/[^\p{L}]+$/u, '');
      let result = token;

      if (!state.start && WORD.test(bare) && !PROPER_WORDS.has(bare)) {
        result = lead + core.charAt(0).toLowerCase() + core.slice(1);
      }
      state.start = endsSentence(token);
      return result;
    })
    .join('');

  return out.replace(/\u0000(\d+)\u0000/g, (_, i: string) => placeholders[Number(i)]);
}

export function toSentenceCase(title: string): string {
  if (!isTitleCase(title)) return title;
  return convert(title, { start: true });
}

/** Như `toSentenceCase` cho nội dung thẻ tiêu đề HTML: chỉ đổi phần chữ, giữ nguyên thẻ và thuộc tính. */
export function toSentenceCaseHtml(html: string): string {
  const parts = html.split(/(<[^>]*>)/);
  const text = parts.filter((_, i) => i % 2 === 0).join('');
  if (!isTitleCase(text)) return html;
  const state = { start: true };
  return parts.map((part, i) => (i % 2 ? part : convert(part, state))).join('');
}
