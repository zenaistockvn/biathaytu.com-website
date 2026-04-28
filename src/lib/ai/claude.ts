import Anthropic from '@anthropic-ai/sdk';
import {
  PLATFORM_GUIDELINES,
  PLATFORM_TONE,
  MICRO_CONTENT_SYSTEM_PROMPT,
} from './shared-prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key-for-build',
});

interface ProductData {
  name: string;
  category: string;
  features: string[];
  colors: string[];
  mood: string;
  usp: string;
  rawDescription: string;
}

/** Claude Sonnet — Viết content marketing */
export async function generateContent(
  productData: ProductData,
  platform: string,
  brandVoice: string,
  framework: string,
  tone: string,
  length: string,
) {
  const guidelines = PLATFORM_GUIDELINES[platform] || PLATFORM_GUIDELINES.facebook;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Bạn là chuyên gia marketing Việt Nam. Viết caption quảng cáo bằng tiếng Việt.

## Sản phẩm:
- Tên: ${productData.name}
- Danh mục: ${productData.category}
- Đặc điểm: ${productData.features.join(', ')}
- USP: ${productData.usp}
- Mô tả: ${productData.rawDescription}

## Brand voice: ${brandVoice}
## Công thức viết bài (Framework): ${framework} (bắt buộc cấu trúc theo đúng khung này)
## Giọng văn (Tone): ${tone}
## Độ dài: ${length}
## Yêu cầu platform: ${guidelines}

Trả về JSON: {"caption": "...", "hashtags": ["...", "..."]}
CHỈ trả về JSON.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse Claude response');
  return JSON.parse(jsonMatch[0]);
}

/** Claude Haiku — Auto-review content */
export async function reviewContent(caption: string, brandVoice: string) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Chấm điểm caption marketing (0-10):

Caption: ${caption}
Brand voice: ${brandVoice}

Tiêu chí: tự nhiên, đúng brand voice, gợi cảm xúc, chính xác, phù hợp platform.
Trả về JSON: {"score": 8.5, "approved": true, "suggestions": ["..."]}
approved = true nếu score >= 7. CHỈ trả về JSON.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { score: 7, approved: true, suggestions: [] };
  return JSON.parse(jsonMatch[0]);
}

/** Claude Sonnet — Nhân bản 1 bài gốc → nhiều phiên bản đa kênh */
export async function multiplyContent(
  originalCaption: string,
  targetPlatforms: string[],
  brandVoice: string,
  productName: string,
) {
  const platformInstructions = targetPlatforms
    .map(p => `- ${p.toUpperCase()}: ${PLATFORM_TONE[p] || PLATFORM_TONE.facebook}`)
    .join('\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Bạn là chuyên gia content marketing đa kênh. Từ 1 bài gốc, viết lại thành nhiều phiên bản phù hợp từng nền tảng.

## Bài gốc:
${originalCaption}

## Sản phẩm: ${productName}
## Brand voice: ${brandVoice}

## Yêu cầu cho từng platform:
${platformInstructions}

## Quy tắc:
- Giữ nguyên thông điệp cốt lõi, thay đổi tone/format/độ dài
- Mỗi phiên bản phải tự nhiên trên platform đó, KHÔNG copy nguyên bài gốc
- Hashtags phù hợp từng platform
- Viết bằng tiếng Việt

Trả về JSON: {"variants": [{"platform": "facebook", "caption": "...", "hashtags": ["..."]}, ...]}
CHỈ trả về JSON.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse multiply response');
  return JSON.parse(jsonMatch[0]);
}

/** Claude Sonnet — Viết bài SEO dài 1500-2000 từ */
export async function generateSEOArticle(
  productData: ProductData,
  topic: string,
  keywords: string[],
  brandVoice: string,
) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: `Bạn là chuyên gia SEO content cho ngành bia nhập khẩu Việt Nam. Viết bài blog SEO đầy đủ.

## Sản phẩm:
- Tên: ${productData.name}
- Danh mục: ${productData.category}
- Đặc điểm: ${productData.features.join(', ')}
- USP: ${productData.usp}

## Chủ đề bài viết: ${topic}
## Keywords SEO: ${keywords.join(', ')}
## Brand voice: ${brandVoice}

## Yêu cầu:
- 1500-2000 từ tiếng Việt
- Có H1, H2, H3 rõ ràng (dùng markdown ##)
- Meta description 150-160 ký tự
- Tự nhiên, không nhồi keyword
- Có CTA cuối bài
- Tone: chuyên gia nhưng gần gũi
- Thêm thông tin thực tế về bia Đức, Reinheitsgebot, lịch sử thương hiệu

Trả về JSON:
{
  "title": "...",
  "slug": "...",
  "meta_description": "...",
  "content": "... (full markdown article) ...",
  "word_count": 1800
}
CHỈ trả về JSON.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse SEO article response');
  return JSON.parse(jsonMatch[0]);
}

/** Claude Sonnet — Tách bài SEO thành 5-8 micro-content */
export async function splitToMicroContent(
  articleTitle: string,
  articleContent: string,
  brandVoice: string,
) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Từ bài blog SEO sau, tách thành 5-8 micro-content dùng cho social media.

## Bài gốc: ${articleTitle}
${articleContent.substring(0, 3000)}

## Brand voice: ${brandVoice}

## Tạo các loại micro-content sau:
1. **carousel_slide** (3-4 cái): Mỗi slide 1 ý chính, 50-80 ký tự, dùng cho Instagram carousel
2. **quote_card** (1-2 cái): Trích dẫn hay/insight từ bài, dùng làm ảnh quote
3. **tip** (1-2 cái): Mẹo/kiến thức ngắn gọn, dạng "Bạn có biết..."
4. **social_snippet** (1-2 cái): Đoạn ngắn hook dẫn về bài gốc, 100-150 ký tự

Trả về JSON:
{"micro_contents": [{"format": "carousel_slide", "content": "...", "slide_number": 1}, ...]}
CHỈ trả về JSON.`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse micro-content response');
  return JSON.parse(jsonMatch[0]);
}
