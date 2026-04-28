import OpenAI from 'openai';
import {
  BRAND_SYSTEM_PROMPT,
  SEO_SYSTEM_PROMPT,
  PILLAR_PROMPTS,
  PLATFORM_TONE,
  MICRO_CONTENT_SYSTEM_PROMPT,
  MULTIPLY_SYSTEM_PROMPT,
  reviewCaption,
  reviewContentAI,
} from './shared-prompts';

// Re-export shared functions so existing imports don't break
export { reviewCaption, reviewContentAI };

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

// ─── DeepSeek Content Generation (Streaming) ────────────────────

export async function generateContentStream(
  idea: string,
  productName: string,
  pillar: string,
  platform: string,
) {
  const pillarPrompt = PILLAR_PROMPTS[pillar] || PILLAR_PROMPTS.lifestyle_moment;

  const userPrompt = `## Ý TƯỞNG CỦA USER:
${idea}

## Sản phẩm: ${productName}

## Content Pillar: ${pillar}
${pillarPrompt}

## Platform: ${platform}

Viết 1 bài content dựa trên ý tưởng trên. Tuân thủ TUYỆT ĐỐI: Khung 4 lớp + 6-point humanizer + blacklist. Trả về JSON.`;

  const stream = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: BRAND_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    stream: true,
    max_tokens: 4096,
  });

  return stream;
}

// ─── Non-streaming fallback ─────────────────────────────────────

export async function generateContentSync(
  idea: string,
  productName: string,
  pillar: string,
  platform: string,
) {
  const pillarPrompt = PILLAR_PROMPTS[pillar] || PILLAR_PROMPTS.lifestyle_moment;

  const userPrompt = `## Ý TƯỞNG CỦA USER:
${idea}

## Sản phẩm: ${productName}

## Content Pillar: ${pillar}
${pillarPrompt}

## Platform: ${platform}

Viết 1 bài content dựa trên ý tưởng trên. Tuân thủ TUYỆT ĐỐI: Khung 4 lớp + 6-point humanizer + blacklist. Trả về JSON.`;

  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: BRAND_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 4096,
  });

  return response.choices[0]?.message?.content || '';
}

// ─── SEO Article Generation ─────────────────────────────────────

export async function generateSEOArticle(
  productInfo: string,
  topic: string,
  keywords: string[],
) {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: SEO_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `## Thông tin sản phẩm/thương hiệu:
${productInfo}

## Chủ đề bài viết: ${topic}
## Keywords SEO: ${keywords.join(', ')}

Viết bài blog SEO 1500-2000 từ. Tuân thủ humanizer rules. Trả về JSON.`,
      },
    ],
    max_tokens: 8192,
  });

  const text = response.choices[0]?.message?.content || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse SEO article response');
  return JSON.parse(jsonMatch[0]);
}

export async function generateSEOArticleStream(
  productInfo: string,
  topic: string,
  keywords: string[],
) {
  return client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: SEO_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `## Thông tin sản phẩm/thương hiệu:
${productInfo}

## Chủ đề bài viết: ${topic}
## Keywords SEO: ${keywords.join(', ')}

Viết bài blog SEO 1500-2000 từ. Tuân thủ humanizer rules. Trả về JSON.`,
      },
    ],
    stream: true,
    max_tokens: 8192,
  });
}

// ─── Micro-content Splitting ────────────────────────────────────

export async function splitToMicroContent(
  articleTitle: string,
  articleContent: string,
) {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: MICRO_CONTENT_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Từ bài blog sau, tách thành 5-8 micro-content:

## Bài gốc: ${articleTitle}
${articleContent.substring(0, 4000)}

Tạo các loại:
1. carousel_slide (3-4): Mỗi slide 1 ý chính, 50-80 ký tự
2. quote_card (1-2): Trích dẫn hay / insight
3. tip (1-2): Mẹo ngắn "Bạn có biết..."
4. social_snippet (1-2): Hook dẫn về bài gốc, 100-150 ký tự

Trả về JSON.`,
      },
    ],
    max_tokens: 4096,
  });

  const text = response.choices[0]?.message?.content || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse micro-content response');
  return JSON.parse(jsonMatch[0]);
}

// ─── Multiply Content (1 → N platforms) ─────────────────────────

export async function multiplyContent(
  originalCaption: string,
  targetPlatforms: string[],
  brandVoice: string,
  productName: string,
) {
  const platformInstructions = targetPlatforms
    .map(p => `- ${p.toUpperCase()}: ${PLATFORM_TONE[p] || PLATFORM_TONE.facebook}`)
    .join('\n');

  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: MULTIPLY_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `## Bài gốc:\n${originalCaption}\n\n## Sản phẩm: ${productName}\n## Brand voice: ${brandVoice}\n\n## Platform yêu cầu:\n${platformInstructions}\n\nGiữ thông điệp cốt lõi, thay đổi tone/format/độ dài phù hợp từng platform.`,
      },
    ],
    max_tokens: 4096,
  });

  const text = response.choices[0]?.message?.content || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse multiply response');
  return JSON.parse(jsonMatch[0]);
}

// ─── Content Generation for Cron (daily-planner) ────────────────

interface ProductData {
  name: string;
  category: string;
  features: string[];
  usp: string;
  rawDescription: string;
}

export async function generateContentForCron(
  productData: ProductData,
  platform: string,
  brandVoice: string,
  contentType: string | null,
  tone: string,
) {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: BRAND_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `## Sản phẩm:
- Tên: ${productData.name}
- Danh mục: ${productData.category}
- Đặc điểm: ${productData.features.join(', ')}
- USP: ${productData.usp}
- Mô tả: ${productData.rawDescription}

## Brand voice: ${brandVoice}
## Platform: ${platform}
## Content type: ${contentType || 'lifestyle_moment'}
## Tone: ${tone}

Viết 1 bài content bằng tiếng Việt. Tuân thủ TUYỆT ĐỐI: Khung 4 lớp + 6-point humanizer + blacklist. Trả về JSON.`,
      },
    ],
    max_tokens: 2048,
  });

  const text = response.choices[0]?.message?.content || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse cron content response');
  return JSON.parse(jsonMatch[0]);
}
