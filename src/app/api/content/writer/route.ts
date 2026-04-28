import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { generateContentStream, reviewCaption } from '@/lib/ai/deepseek';

/** POST /api/content/writer — DeepSeek AI Writer with streaming */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { tenantId } = auth;
  const body = await request.json();
  const { idea, productId, productName, pillar, platform, saveToDb } = body;

  if (!idea?.trim()) {
    return new Response(JSON.stringify({ error: 'Ý tưởng không được để trống' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const stream = await generateContentStream(
      idea,
      productName || 'Bia Thầy Tu',
      pillar || 'lifestyle_moment',
      platform || 'facebook',
    );

    // Create a ReadableStream that pipes DeepSeek's SSE to the client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = '';
        let reasoningContent = '';

        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            // DeepSeek reasoner sends reasoning_content first, then content
            if (delta && 'reasoning_content' in delta && (delta as Record<string, unknown>).reasoning_content) {
              reasoningContent += (delta as Record<string, unknown>).reasoning_content as string;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'thinking', text: (delta as Record<string, unknown>).reasoning_content })}\n\n`));
            }

            if (delta?.content) {
              fullContent += delta.content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', text: delta.content })}\n\n`));
            }

            // Check for finish
            if (chunk.choices[0]?.finish_reason === 'stop') {
              let parsed = null;
              try {
                const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  parsed = JSON.parse(jsonMatch[0]);
                }
              } catch {
                // JSON parse failed — send raw content
              }

              const caption = parsed?.caption || fullContent;
              const review = reviewCaption(caption);

              let savedId = null;
              if (saveToDb && parsed?.caption) {
                const supabase = createAdminSupabase();
                const { data: saved } = await supabase
                  .from('generated_contents')
                  .insert({
                    product_id: productId || null,
                    platform: platform || 'facebook',
                    caption: parsed.caption,
                    hashtags: JSON.stringify(parsed.hashtags || []),
                    image_prompt: parsed.image_prompt || null,
                    ai_score: review.score,
                    content_format: pillar || 'lifestyle_moment',
                    status: review.score >= 8 ? 'approved' : 'draft',
                    tenant_id: tenantId,
                  })
                  .select('id')
                  .single();
                savedId = saved?.id;
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'done',
                content: parsed,
                review,
                savedId,
                rawContent: fullContent,
              })}\n\n`));
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'DeepSeek API error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`));
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
