import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'dummy-key-for-build');

/** Gemini 2.5 Flash — Phân tích ảnh sản phẩm */
export async function analyzeProductImage(imageBase64: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-05-20',
  });

  const result = await model.generateContent([
    `Phân tích ảnh sản phẩm, trả về JSON:
{
  "name": "Tên sản phẩm",
  "category": "F&B / Fashion / Beauty / Electronics / Other",
  "features": ["Đặc điểm 1", "Đặc điểm 2"],
  "colors": ["Màu 1", "Màu 2"],
  "mood": "premium / casual / fun / elegant",
  "usp": "Điểm bán hàng độc đáo",
  "rawDescription": "Mô tả chi tiết bằng tiếng Việt"
}
CHỈ trả về JSON.`,
    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
  ]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Cannot parse Gemini response');
  return JSON.parse(jsonMatch[0]);
}

/** Nano Banana — Tạo ảnh marketing sản phẩm */
export async function generateMarketingImage(
  prompt: string,
  imageBase64?: string,
) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'] as any,
    } as any,
  });

  const parts: any[] = [prompt];
  if (imageBase64) {
    parts.push({
      inlineData: { data: imageBase64, mimeType: 'image/jpeg' },
    });
  }

  const result = await model.generateContent(parts);
  const response = result.response;

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if ((part as any).inlineData) {
      const img = (part as any).inlineData;
      return { data: img.data, mimeType: img.mimeType };
    }
  }

  return null;
}

/** Nano Banana — Xóa nền ảnh sản phẩm */
export async function removeBackground(imageBase64: string) {
  return generateMarketingImage(
    'Remove the background from this product image. Keep only the product with a clean white background.',
    imageBase64,
  );
}
