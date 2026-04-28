const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
});

const API_KEY = process.env.DEEPSEEK_API_KEY;
const MODELS = ['deepseek-reasoner', 'deepseek-v4-pro'];

const SYSTEM = 'Bạn là chuyên gia marketing bia Đức cao cấp cho thương hiệu Bia Thầy Tu (Benediktiner). Viết content bằng tiếng Việt, phong cách storyselling sang trọng.';

const PROMPT = `Viết 1 bài Facebook post (150-200 từ) quảng bá Benediktiner Weissbier Naturtrüb cho dịp cuối tuần.
Yêu cầu:
- Hook mở đầu gây tò mò
- Kể câu chuyện ngắn (lifestyle moment)  
- Đề cập: hương chuối chín, đinh hương, men sống Naturtrüb
- CTA nhẹ nhàng cuối bài
- Trả về plain text (không JSON)`;

async function testModel(model) {
  const start = Date.now();
  
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: PROMPT },
      ],
      max_tokens: 1024,
    }),
  });

  const elapsed = Date.now() - start;
  const data = await response.json();

  if (!response.ok) {
    return { model, error: JSON.stringify(data), elapsed };
  }

  const content = data.choices[0]?.message?.content || '';
  const usage = data.usage || {};
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    model: data.model,
    elapsed,
    content,
    wordCount,
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    // DeepSeek reasoner returns reasoning_content
    hasReasoning: !!data.choices[0]?.message?.reasoning_content,
    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens || 0,
  };
}

async function main() {
  console.log('═'.repeat(60));
  console.log('  BENCHMARK: deepseek-reasoner vs deepseek-v4-pro');
  console.log('═'.repeat(60));
  console.log(`\nPrompt: "${PROMPT.substring(0, 80)}..."\n`);

  const results = [];

  for (const model of MODELS) {
    console.log(`⏳ Testing ${model}...`);
    const result = await testModel(model);
    results.push(result);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error.substring(0, 200)}\n`);
    } else {
      console.log(`   ✅ Done in ${result.elapsed}ms\n`);
    }
  }

  // Print results
  console.log('\n' + '─'.repeat(60));
  console.log('📊 KẾT QUẢ SO SÁNH');
  console.log('─'.repeat(60));

  const [old, newM] = results;

  if (old.error || newM.error) {
    console.log('\n⚠️  Có model bị lỗi, không so sánh được.');
    results.forEach(r => {
      if (r.error) console.log(`   ${r.model}: ${r.error.substring(0, 300)}`);
    });
    return;
  }

  console.log(`
┌────────────────────────┬─────────────────────┬─────────────────────┐
│ Tiêu chí               │ deepseek-reasoner   │ deepseek-v4-pro     │
├────────────────────────┼─────────────────────┼─────────────────────┤
│ Thời gian phản hồi     │ ${String(old.elapsed + 'ms').padEnd(20)}│ ${String(newM.elapsed + 'ms').padEnd(20)}│
│ Số từ output            │ ${String(old.wordCount + ' từ').padEnd(20)}│ ${String(newM.wordCount + ' từ').padEnd(20)}│
│ Prompt tokens           │ ${String(old.promptTokens).padEnd(20)}│ ${String(newM.promptTokens).padEnd(20)}│
│ Completion tokens       │ ${String(old.completionTokens).padEnd(20)}│ ${String(newM.completionTokens).padEnd(20)}│
│ Reasoning tokens        │ ${String(old.reasoningTokens || 'N/A').padEnd(20)}│ ${String(newM.reasoningTokens || 'N/A').padEnd(20)}│
│ Tổng tokens             │ ${String(old.totalTokens).padEnd(20)}│ ${String(newM.totalTokens).padEnd(20)}│
│ Có reasoning chain?     │ ${String(old.hasReasoning ? 'Có ✓' : 'Không').padEnd(20)}│ ${String(newM.hasReasoning ? 'Có ✓' : 'Không').padEnd(20)}│
└────────────────────────┴─────────────────────┴─────────────────────┘`);

  const speedDiff = ((old.elapsed - newM.elapsed) / old.elapsed * 100).toFixed(0);
  const tokenDiff = ((old.totalTokens - newM.totalTokens) / old.totalTokens * 100).toFixed(0);

  console.log(`\n🏆 Tốc độ: v4-pro ${speedDiff > 0 ? 'NHANH hơn' : 'CHẬM hơn'} ${Math.abs(speedDiff)}%`);
  console.log(`💰 Token: v4-pro ${tokenDiff > 0 ? 'TIẾT KIỆM hơn' : 'tốn hơn'} ${Math.abs(tokenDiff)}%`);

  console.log('\n' + '─'.repeat(60));
  console.log('📝 OUTPUT MODEL CŨ (deepseek-reasoner):');
  console.log('─'.repeat(60));
  console.log(old.content);
  
  console.log('\n' + '─'.repeat(60));
  console.log('📝 OUTPUT MODEL MỚI (deepseek-v4-pro):');
  console.log('─'.repeat(60));
  console.log(newM.content);
}

main().catch(console.error);
