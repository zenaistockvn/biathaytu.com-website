const fs = require('fs');
const path = require('path');

// Manual .env.local parsing (no dotenv dependency)
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
});

const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.error('❌ DEEPSEEK_API_KEY not found in .env.local');
  process.exit(1);
}

async function testDeepSeekV4() {
  console.log('🔄 Testing DeepSeek v4-pro API...\n');
  console.log(`API Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
  
  const startTime = Date.now();

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages: [
          {
            role: 'system',
            content: 'Bạn là chuyên gia marketing bia Đức. Trả lời ngắn gọn bằng tiếng Việt.'
          },
          {
            role: 'user',
            content: 'Viết 1 caption ngắn (50 từ) cho Facebook quảng cáo bia Benediktiner Weissbier, phong cách lifestyle sang trọng.'
          }
        ],
        max_tokens: 256,
      }),
    });

    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ API Error ${response.status}:`, JSON.stringify(errorData, null, 2));
      
      // If v4-pro fails, test fallback
      if (response.status === 400 || response.status === 404) {
        console.log('\n⚠️  deepseek-v4-pro chưa available. Thử deepseek-chat (fallback)...\n');
        return testFallback();
      }
      return;
    }

    const data = await response.json();
    
    console.log(`\n✅ SUCCESS! (${elapsed}ms)`);
    console.log(`📦 Model: ${data.model}`);
    console.log(`💬 Response:\n`);
    console.log(data.choices[0]?.message?.content || '(empty)');
    console.log(`\n📊 Usage: ${data.usage?.prompt_tokens} prompt + ${data.usage?.completion_tokens} completion = ${data.usage?.total_tokens} total tokens`);
    
  } catch (err) {
    console.error('❌ Network error:', err.message);
  }
}

async function testFallback() {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Bạn là chuyên gia marketing bia Đức. Trả lời ngắn gọn bằng tiếng Việt.'
          },
          {
            role: 'user',
            content: 'Viết 1 caption ngắn (50 từ) cho Facebook quảng cáo bia Benediktiner Weissbier, phong cách lifestyle sang trọng.'
          }
        ],
        max_tokens: 256,
      }),
    });

    const elapsed = Date.now() - startTime;
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ Fallback cũng lỗi ${response.status}:`, JSON.stringify(data, null, 2));
      return;
    }

    console.log(`✅ Fallback OK! (${elapsed}ms)`);
    console.log(`📦 Model returned: ${data.model}`);
    console.log(`💬 Response:\n`);
    console.log(data.choices[0]?.message?.content || '(empty)');
    console.log(`\n⚠️  Cần đổi lại model name trong code. Model đúng là: ${data.model}`);
    
  } catch (err) {
    console.error('❌ Fallback network error:', err.message);
  }
}

testDeepSeekV4();
