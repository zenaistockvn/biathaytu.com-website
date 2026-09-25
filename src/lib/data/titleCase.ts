/**
 * Tiêu đề bài trong database lúc Viết Hoa Mỗi Chữ, lúc viết như câu. Site dùng một kiểu:
 * viết hoa chữ đầu câu, chữ đầu sau dấu ":" hoặc "?", và tên riêng.
 */
const PROPER_PHRASES = ['Bia Thầy Tu', 'Luật Tinh Khiết', 'The Wurst', 'Hà Nội', 'Việt Nam'];
const PROPER_WORDS = new Set([
  'Benediktiner', 'Bitburger', 'Premium', 'Pils', 'Pilsner', 'Weissbier', 'Weizen', 'Dunkel', 'Naturtrüb',
  'Festbier', 'Đức', 'Ettal', 'Bavaria', 'Việt', 'Thüringer', 'Bratwurst', 'Wiener', 'Reinheitsgebot',
  'Siegelhopfen', 'Eifel', 'Hallertau', 'Oktoberfest',
]);

const WORD = /^\p{Lu}\p{Ll}*$/u;

function isTitleCase(title: string): boolean {
  const words = title.split(/\s+/).filter((w) => /^\p{L}/u.test(w));
  if (words.length < 4) return false;
  const capitalised = words.filter((w) => /^\p{Lu}/u.test(w)).length;
  return capitalised / words.length >= 0.7;
}

export function toSentenceCase(title: string): string {
  if (!isTitleCase(title)) return title;

  const placeholders: string[] = [];
  let text = title;
  for (const phrase of PROPER_PHRASES) {
    text = text.split(phrase).join(`\u0000${placeholders.push(phrase) - 1}\u0000`);
  }

  let startOfSentence = true;
  text = text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token) || token === '') return token;
      const lead = token.match(/^[^\p{L}\p{N}\u0000]*/u)?.[0] ?? '';
      const core = token.slice(lead.length);
      const bare = core.replace(/[^\p{L}]+$/u, '');
      let out = token;

      if (!startOfSentence && WORD.test(bare) && !PROPER_WORDS.has(bare)) {
        out = lead + core.charAt(0).toLowerCase() + core.slice(1);
      }
      startOfSentence = /[:?!.]$/.test(token);
      return out;
    })
    .join('');

  return text.replace(/\u0000(\d+)\u0000/g, (_, i: string) => placeholders[Number(i)]);
}
