import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateContentStream, reviewCaption } from '@/lib/ai/deepseek';

/** POST /api/content/generate — DeepSeek AI tạo content đa nền tảng (streaming SSE) */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const {
    idea = '',
    productInfo = '',
    platforms = ['facebook'],
    framework = 'Storytelling',
    tone = 'Casual',
    length = 'Medium',
  } = body;

  if (!idea?.trim() && !productInfo?.trim()) {
    return new Response(JSON.stringify({ error: 'Cần ít nhất ý tưởng hoặc thông tin sản phẩm' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Build combined prompt with product info + idea + framework
  const combinedIdea = [
    productInfo ? `[THÔNG TIN SẢN PHẨM]\n${productInfo}` : '',
    idea ? `[Ý TƯỞNG]\n${idea}` : '',
    `[FRAMEWORK]: ${framework}`,
    `[TONE]: ${tone}`,
    `[LENGTH]: ${length}`,
  ].filter(Boolean).join('\n\n');

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const results: Record<string, unknown>[] = [];

      try {
        // Generate for each platform sequentially
        for (const platform of platforms) {
          const stream = await generateContentStream(
            combinedIdea,
            productInfo || 'Sản phẩm',
            'lifestyle_moment', // default pillar
            platform,
          );

          let fullContent = '';

          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            // Stream thinking tokens
            if (delta && 'reasoning_content' in delta && (delta as Record<string, unknown>).reasoning_content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'thinking',
                text: (delta as Record<string, unknown>).reasoning_content,
              })}\n\n`));
            }

            if (delta?.content) {
              fullContent += delta.content;
            }

            if (chunk.choices[0]?.finish_reason === 'stop') {
              // Parse JSON
              let parsed = null;
              try {
                const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  parsed = JSON.parse(jsonMatch[0]);
                }
              } catch { /* parse fail */ }

              const caption = parsed?.caption || fullContent;
              const review = reviewCaption(caption);

              let finalImagePrompt = parsed?.image_prompt || null;
              if (finalImagePrompt && typeof finalImagePrompt === 'string' && !finalImagePrompt.includes('--ar')) {
                if (platform === 'tiktok' || platform === 'instagram_reels') {
                  finalImagePrompt += ' --ar 9:16';
                } else if (platform === 'instagram') {
                  finalImagePrompt += ' --ar 4:5';
                } else {
                  finalImagePrompt += ' --ar 16:9';
                }
              }

              results.push({
                platform,
                caption,
                hashtags: parsed?.hashtags || [],
                imagePrompt: finalImagePrompt,
                review,
              });
            }
          }
        }

        // Send all results
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'result',
          results,
        })}\n\n`));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'error',
          error: message,
        })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
