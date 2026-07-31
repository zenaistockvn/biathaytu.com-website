# Plan Sửa Lỗi Vòng 2 — Khắc Phục Hồi Quy & Hạng Mục Còn Sót

> **Ngày:** 2026-07-30 · **Repo:** `biathaytu-web` · **Branch:** `feature/age-verification-and-compliance` (HEAD `abd008d`)
> **Bối cảnh:** Vòng 1 (`f16cb55`..`abd008d`) đã sửa đúng 6/6 lỗi P0 gốc. Tài liệu này xử lý **1 lỗi P0 mới phát sinh** + **4 nhóm hạng mục bị khai "hoàn thành" nhưng chưa làm**.
> **Đã kiểm chứng bằng cách chạy thật** (dev server + POST API + đo DOM), không dựa trên báo cáo.
> **Tài liệu liên quan:** `2026-07-29-ui-functionality-audit-report.md`, `2026-07-29-ui-functionality-implementation-plan.md`

---

## 0. Nguyên tắc bắt buộc — đọc trước khi viết dòng code đầu tiên

Vòng 1 mắc 3 lỗi quy trình. Vòng 2 **không được lặp lại**:

| ❌ Sai ở vòng 1 | ✅ Yêu cầu vòng 2 |
|---|---|
| Đơn giản hoá yêu cầu để test dễ xanh (biến "chỉ lỗi khi cả 2 kênh chết" thành "không bao giờ lỗi") | Đọc **ý định**, không chỉ đọc chữ. Khi thấy mình đang làm cho việc **dễ hơn**, dừng lại và hỏi. |
| Viết test kiểu `expect(src).toContain('role="dialog"')` — grep chuỗi trong file source | Test phải **gọi hàm / render / fetch thật** rồi assert **kết quả**. Grep source chỉ được dùng cho test toàn vẹn asset. |
| Tự quyết mục plan ghi "dừng và hỏi" | Mục có nhãn **🛑 CHỜ CHỦ DỰ ÁN** thì dừng thật, ghi vào báo cáo, làm tiếp mục khác. |

**Ba điều tuyệt đối không được làm:**
1. **Không** sửa/nới lỏng test để nó xanh. Nếu test đỏ, sửa **code**.
2. **Không** trả `success: true` cho khách khi đơn chưa được lưu vào bất kỳ kênh nào.
3. **Không** refactor ngoài phạm vi. `src/app/web.css` có 5.744 dòng và 748 `!important` — chỉ chạm đúng các selector được nêu tên.

**Lệnh verify chạy sau mỗi Phase (cả 4 phải xanh):**

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

> Dùng `npx next build`, **không** dùng `npm run build` (script đó chạy `dump_data.js` cần kết nối DB).
> `npx tsc --noEmit` hiện đang **đỏ 2 lỗi** — Phase D sẽ xử lý. Trước Phase D chỉ cần 3 lệnh đầu xanh.

---

# PHASE A — 🔴 P0: Không được im lặng làm mất đơn

## A.1 — Vấn đề (đã kiểm chứng)

`src/app/api/order/route.ts:98-117` hiện coi **cả** Google Sheets **và** Telegram là best-effort rồi luôn trả `200 {success:true}`.

Bằng chứng — POST một đơn hợp lệ khi cả hai kênh đều lỗi:

```
[ORDER_WEBHOOK_WARN] Sheets append failed: SHEETS_WEBHOOK_URL... chưa được cấu hình
[ORDER_WEBHOOK_WARN] Telegram notify failed: TELEGRAM_BOT_TOKEN... chưa được cấu hình
→ HTTP 200 {"success":true,"orderNumber":"BTU-20260730-6370","order_id":"BTU-20260730-6370"}
```

Khách thấy màn hình "✅ Đặt Hàng Thành Công! Mã đơn: BTU-20260730-6370", giỏ hàng bị xoá, và **đơn không tồn tại ở đâu cả**. Trước vòng 1 khách nhận lỗi kèm hướng dẫn gọi hotline nên còn cứu được đơn; giờ khách tin là xong và ngồi chờ.

Chính docstring của `src/lib/integrations/googleSheets.ts:6` vẫn ghi *"Caller PHẢI coi lỗi ở đây là 'đơn chưa được lưu'"* — caller đang phớt lờ.

Nghiêm trọng hơn: `src/app/api/order/order-persistence` chưa tồn tại, nhưng `src/app/api/order/order-resilience.test.ts` **assert chính hành vi sai này** (`expect(res.status).toBe(200)` khi webhook fail) → test suite đang **bảo vệ** lỗi.

## A.2 — Hợp đồng API mới (đây là đặc tả, không phải gợi ý)

| Sheets | Telegram | HTTP | Body | Ghi chú |
|:---|:---|:---|:---|:---|
| ok | ok | 200 | `{success:true, orderNumber, persistedTo:'sheets'}` | Đường bình thường |
| ok | lỗi | 200 | `{success:true, orderNumber, persistedTo:'sheets'}` | Telegram chỉ là thông báo → best-effort |
| lỗi | ok | 200 | `{success:true, orderNumber, persistedTo:'telegram'}` | Telegram trở thành kênh lưu dự phòng, **phải** gắn banner cảnh báo nhập tay |
| lỗi | lỗi | **502** | `{error:'Hệ thống đang bận, chưa lưu được đơn. Vui lòng gọi hotline 0899.191.313 để đặt hàng.'}` | **Không** có `success`. Ghi full đơn ra `console.error('[ORDER_LOST]', …)` để còn cứu từ log. |

## A.3 — Test trước (xoá file cũ, tạo file mới)

**Xoá** `src/app/api/order/order-resilience.test.ts` (nó khoá hành vi sai và cũng là nguồn 1 trong 2 lỗi `tsc`).

**Tạo** `src/app/api/order/order-persistence.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import productsData from '@/data/products.json';

const REAL_PRODUCT = (productsData as Array<{ id: string; slug: string; price: number | null }>)
  .find((p) => p.slug === 'benediktiner-naturtrub-thung-12-chai-500ml')!;

const SHEETS_URL = 'https://script.google.com/macros/s/TEST/exec';

function makeRequest(ip: string) {
  return new NextRequest('http://localhost:3000/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify({
      customer: {
        name: 'Nguyen Van A',
        phone: '0912345678',
        address: '659A Lạc Long Quân, Hà Nội',
        purchaser_age_confirmed: true,
        receiver_age_confirmed: true,
        terms_agreed: true,
      },
      items: [{ id: REAL_PRODUCT.id, name: 'Bia', image: '', price: 1, quantity: 1 }],
    }),
  });
}

/** Ghi lại mọi payload gửi tới Telegram để assert banner cảnh báo. */
const telegramPayloads: string[] = [];

function stubChannels(sheets: 'ok' | 'fail', telegram: 'ok' | 'fail') {
  telegramPayloads.length = 0;
  vi.stubEnv('SHEETS_WEBHOOK_URL', SHEETS_URL);
  vi.stubEnv('SHEETS_WEBHOOK_SECRET', 'secret');
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'token');
  vi.stubEnv('TELEGRAM_CHAT_ID', '-100');

  vi.stubGlobal('fetch', vi.fn(async (input: unknown, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
    if (url.includes('script.google.com')) {
      if (sheets === 'fail') throw new Error('sheets network down');
      return { ok: true, json: async () => ({ ok: true }), text: async () => '' } as unknown as Response;
    }
    if (url.includes('api.telegram.org')) {
      telegramPayloads.push(String(init?.body ?? ''));
      if (telegram === 'fail') throw new Error('telegram network down');
      return { ok: true, json: async () => ({ ok: true }), text: async () => '' } as unknown as Response;
    }
    throw new Error('fetch ngoài dự kiến: ' + url);
  }));
}

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('POST /api/order — không được im lặng làm mất đơn', () => {
  it('Sheets ok → 200 và persistedTo = "sheets"', async () => {
    stubChannels('ok', 'ok');
    const res = await POST(makeRequest('10.0.0.1'));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.persistedTo).toBe('sheets');
  });

  it('Sheets lỗi + Telegram ok → 200, persistedTo = "telegram", có banner cảnh báo nhập tay', async () => {
    stubChannels('fail', 'ok');
    const res = await POST(makeRequest('10.0.0.2'));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.persistedTo).toBe('telegram');
    expect(telegramPayloads.join('')).toMatch(/CHƯA VÀO GOOGLE SHEET/i);
  });

  it('CẢ HAI kênh lỗi → 502, KHÔNG có success, thông báo kèm hotline', async () => {
    stubChannels('fail', 'fail');
    const res = await POST(makeRequest('10.0.0.3'));
    const body = await res.json();
    expect(res.status).toBe(502);
    expect(body.success).toBeUndefined();
    expect(body.orderNumber).toBeUndefined();
    expect(body.error).toMatch(/0899\.?191\.?313/);
  });

  it('Cả hai kênh lỗi → ghi [ORDER_LOST] ra console.error để còn cứu đơn từ log', async () => {
    stubChannels('fail', 'fail');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await POST(makeRequest('10.0.0.4'));
    expect(spy.mock.calls.flat().join(' ')).toContain('[ORDER_LOST]');
    spy.mockRestore();
  });
});

describe('generateOrderNumber — chống trùng mã', () => {
  it('đúng định dạng BTU-YYYYMMDD-HHmmss-XXX và không trùng trong 500 lần sinh', async () => {
    stubChannels('ok', 'ok');
    const numbers = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const res = await POST(makeRequest('10.0.1.' + (i % 200)));
      if (res.status !== 200) continue;
      const { orderNumber } = await res.json();
      expect(orderNumber).toMatch(/^BTU-\d{8}-\d{6}-[0-9A-Z]{3}$/);
      numbers.add(orderNumber);
    }
    expect(numbers.size).toBeGreaterThan(400);
  });
});
```

> **Lưu ý về rate limit:** route giới hạn 10 request/phút/IP. Vì vậy mỗi test dùng một `x-forwarded-for` khác nhau. Đừng vì test đỏ mà nới `RATE_LIMIT_MAX`.

Chạy `npm test` → **phải đỏ ở test "CẢ HAI kênh lỗi"** và test định dạng mã đơn. Đó là bằng chứng lỗi tồn tại.

## A.4 — Sửa `src/lib/integrations/telegram.ts` (thêm banner cảnh báo)

```ts
/** Text THUẦN (không parse_mode) → an toàn trước injection. */
export function buildTelegramMessage(order: OrderRecord, warningBanner?: string): string {
  const lines: string[] = [];
  if (warningBanner) lines.push(warningBanner, '');
  lines.push(
    `🍺 ĐƠN HÀNG MỚI: ${order.orderNumber}`,
    ``,
    `Khách: ${order.customer.name}`,
    // ... giữ nguyên phần còn lại
  );
  // ... giữ nguyên
  return lines.join('\n');
}

export async function sendOrderToTelegram(order: OrderRecord, warningBanner?: string): Promise<void> {
  // ... giữ nguyên phần kiểm ENV và fetch, chỉ đổi:
  text: buildTelegramMessage(order, warningBanner),
}
```

## A.5 — Sửa `src/app/api/order/route.ts`

**(a)** Mã đơn chống trùng — thay `generateOrderNumber`:

```ts
/** BTU-YYYYMMDD-HHmmss-XXX (XXX = base36) → chống trùng trong cùng ngày. */
function generateOrderNumber(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const time = `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  const rand = Math.floor(Math.random() * 46656).toString(36).padStart(3, '0').toUpperCase();
  return `BTU-${date}-${time}-${rand}`;
}
```

**(b)** Bỏ `setInterval` ở module scope (leak một timer trên mỗi lambda) → dọn lười trong `isRateLimited`:

```ts
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Dọn rác lười — KHÔNG dùng setInterval ở module scope (mỗi instance serverless sẽ giữ 1 timer).
  if (requestCounts.size > 500) {
    for (const [key, value] of requestCounts) {
      if (now > value.resetAt) requestCounts.delete(key);
    }
  }
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}
```
**Xoá** khối `setInterval(...)` (dòng 27-32).

> Giữ nguyên comment nhắc rate limit in-memory chỉ hiệu lực trên single instance; nếu deploy serverless cần Upstash/KV. **Không** tự thêm dependency.

**(c)** Kiểm `Origin` (chống CSRF cơ bản) — thêm sau khối rate limit:

```ts
    // Chỉ nhận request cùng origin. Client hợp lệ không gửi Origin (vd. app native) vẫn cho qua.
    const origin = req.headers.get('origin');
    if (origin) {
      const host = req.headers.get('host');
      let originHost: string | null = null;
      try { originHost = new URL(origin).host; } catch { originHost = null; }
      if (!originHost || originHost !== host) {
        return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
      }
    }
```

**(d)** Thay toàn bộ bước 3–5 bằng:

```ts
    // 3. Lưu đơn — BẮT BUỘC ít nhất MỘT kênh thành công, nếu không phải báo lỗi cho khách.
    const failures: string[] = [];
    let persistedTo: 'sheets' | 'telegram' | null = null;

    try {
      await appendOrderToSheet(order);
      persistedTo = 'sheets';
    } catch (e) {
      failures.push(`sheets: ${e instanceof Error ? e.message : String(e)}`);
      console.error('[ORDER_PERSIST_FAIL] sheets', e);
    }

    if (persistedTo === 'sheets') {
      // Telegram chỉ là thông báo → best-effort, không chặn đơn.
      try {
        await sendOrderToTelegram(order);
      } catch (e) {
        console.warn('[ORDER_NOTIFY_WARN] telegram', e);
      }
    } else {
      // Sheets chết → Telegram trở thành kênh LƯU dự phòng, phải gắn cảnh báo nhập tay.
      try {
        await sendOrderToTelegram(
          order,
          '⚠️ ĐƠN CHƯA VÀO GOOGLE SHEET — VUI LÒNG NHẬP TAY NGAY',
        );
        persistedTo = 'telegram';
      } catch (e) {
        failures.push(`telegram: ${e instanceof Error ? e.message : String(e)}`);
        console.error('[ORDER_PERSIST_FAIL] telegram', e);
      }
    }

    // 4. Không kênh nào lưu được → KHÔNG được báo thành công cho khách.
    if (!persistedTo) {
      console.error('[ORDER_LOST] Không lưu được đơn vào bất kỳ kênh nào.', JSON.stringify({ order, failures }));
      return NextResponse.json(
        {
          error:
            'Hệ thống đang bận, chưa lưu được đơn. Vui lòng gọi hotline 0899.191.313 để đặt hàng.',
        },
        { status: 502 },
      );
    }

    // 5. Thành công
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order_id: order.orderNumber,
      persistedTo,
    });
```

## A.6 — Verify Phase A

```bash
npm test && npx next build && npx eslint .
```

Kiểm tay trên `npm run dev` (`.env.local` hiện **không** có `SHEETS_WEBHOOK_URL` nên đây là kịch bản "cả hai kênh chết"):

```js
// Console, sau khi đã qua cổng tuổi
fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
  customer:{name:'Kiem tra',phone:'0912345678',address:'Test',purchaser_age_confirmed:true,receiver_age_confirmed:true,terms_agreed:true},
  items:[{id:'71a6ca18-6106-4021-af83-136daa88ffe4',name:'x',quantity:1,image:'',price:1}]})})
  .then(async r=>console.log(r.status, await r.text()))
```
→ **phải** ra `502` kèm thông báo hotline. Log server phải có `[ORDER_LOST]`.

Sau đó thêm `SHEETS_WEBHOOK_URL`/`SHEETS_WEBHOOK_SECRET` thật vào `.env.local`, chạy lại → `200` với `persistedTo: "sheets"`.

---

# PHASE B — Checkout dùng được với trình đọc màn hình & trên mobile

Phase 5.4 của plan vòng 1 bị khai "hoàn thành" nhưng đo thực tế: `id: 0/7`, `label liên kết: 0/7`, `autocomplete: 0/7`, nút số lượng `32×32`, icon giỏ hàng `26×31`.

## B.1 — Test trước

Tạo `src/app/(web)/dat-hang/checkout-a11y.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/dat-hang/page.tsx'), 'utf8');

/** Trích mọi thẻ <input .../> và <textarea ...> trong form checkout. */
function formControls(): string[] {
  return [...SRC.matchAll(/<(?:input|textarea)\b[^>]*className="checkout-(?:input-text|textarea)"[^>]*|<(?:input|textarea)\b[^>]*className="checkout-(?:input-text|textarea)"/g)]
    .map((m) => m[0]);
}

describe('a11y form checkout', () => {
  const FIELDS: Array<{ name: string; id: string; autoComplete: string }> = [
    { name: 'name', id: 'co-name', autoComplete: 'name' },
    { name: 'phone', id: 'co-phone', autoComplete: 'tel' },
    { name: 'email', id: 'co-email', autoComplete: 'email' },
    { name: 'receiverName', id: 'co-recv-name', autoComplete: 'name' },
    { name: 'receiverPhone', id: 'co-recv-phone', autoComplete: 'tel' },
    { name: 'address', id: 'co-address', autoComplete: 'street-address' },
    { name: 'note', id: 'co-note', autoComplete: 'off' },
  ];

  it.each(FIELDS)('field $name có id, label htmlFor và autoComplete', ({ name, id, autoComplete }) => {
    expect(SRC).toContain(`id="${id}"`);
    expect(SRC).toContain(`htmlFor="${id}"`);
    expect(SRC).toContain(`name="${name}"`);
    expect(SRC).toMatch(new RegExp(`autoComplete="${autoComplete}"`));
  });

  it('hai field số điện thoại có inputMode numeric', () => {
    expect((SRC.match(/inputMode="numeric"/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it('không còn label trần (không htmlFor) trong form checkout', () => {
    const bare = [...SRC.matchAll(/<label className="checkout-label"(?![^>]*htmlFor)/g)];
    expect(bare).toEqual([]);
  });
});

describe('kích thước vùng chạm ≥ 44px', () => {
  const CSS = fs.readFileSync(path.join(process.cwd(), 'src/app/web.css'), 'utf8');
  function block(selector: string): string {
    const i = CSS.indexOf(selector);
    expect(i, `không tìm thấy selector ${selector}`).toBeGreaterThan(-1);
    return CSS.slice(i, CSS.indexOf('}', i));
  }
  it.each([
    '.web-app .checkout-qty-btn {',
    '.web-app .cart-icon-wrap {',
  ])('%s có min-width/min-height ≥ 44px', (sel) => {
    const b = block(sel);
    const nums = [...b.matchAll(/min-(?:width|height):\s*(\d+)px/g)].map((m) => Number(m[1]));
    expect(nums.length).toBeGreaterThanOrEqual(2);
    expect(Math.min(...nums)).toBeGreaterThanOrEqual(44);
  });
});
```

## B.2 — Sửa `src/app/(web)/dat-hang/page.tsx`

Áp đúng mẫu này cho **cả 7** field (ví dụ 2 field đầu, làm tương tự phần còn lại theo bảng ở B.1):

```tsx
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="co-name">Họ và Tên người đặt *</label>
                <input
                  id="co-name"
                  required
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="checkout-input-text"
                  placeholder="Nhập họ và tên người đặt..."
                />
              </div>
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="co-phone">Số điện thoại người đặt *</label>
                <input
                  id="co-phone"
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={handleChange}
                  className="checkout-input-text"
                  placeholder="Nhập số điện thoại..."
                />
              </div>
```

Bảng đầy đủ:

| Field | `id` | `autoComplete` | thêm |
|---|---|---|---|
| name | `co-name` | `name` | |
| phone | `co-phone` | `tel` | `inputMode="numeric"` |
| email | `co-email` | `email` | |
| receiverName | `co-recv-name` | `name` | |
| receiverPhone | `co-recv-phone` | `tel` | `inputMode="numeric"` |
| address | `co-address` | `street-address` | |
| note (textarea) | `co-note` | `off` | |

Thêm `aria-label="Xóa sản phẩm khỏi giỏ"` cho nút `.checkout-remove-btn` và `aria-label="Giảm số lượng"` / `aria-label="Tăng số lượng"` cho 2 nút `.checkout-qty-btn`.

Thêm `role="alert"` cho `.checkout-error-alert` **nếu chưa có** (đây là thông báo động → `role="alert"` là đúng ở đây).

## B.3 — Sửa `src/app/web.css` (chỉ 3 selector)

```css
.web-app .checkout-qty-btn {
  min-width: 44px;
  min-height: 44px;
  /* giữ nguyên các thuộc tính còn lại, XOÁ width: 32px; height: 32px; */
```

```css
.web-app .cart-icon-wrap {
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  /* giữ nguyên position/display/align-items/transition */
```

Thêm mới (đặt cạnh khối `.web-app .footer-links`):

```css
.web-app .footer-links a {
  display: block;
  padding: 10px 0;
}
```

## B.4 — Skip-to-content

`src/app/(web)/layout.tsx` — thêm link đầu tiên trong `.web-app` và `id` cho `<main>`:

```tsx
      <LanguageProvider>
        <a href="#main-content" className="skip-link">Bỏ qua tới nội dung chính</a>
        <JsonLd type="organization" data={getOrganizationSchema()} />
        <JsonLd type="website" data={getWebsiteSchema()} />
        <WebHeader />
        <main id="main-content">{children}</main>
```

CSS mới trong `web.css`:

```css
.web-app .skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100000;
  padding: 12px 20px;
  background: var(--web-navy);
  color: #fff !important;
  border-radius: 0 0 var(--web-radius-md) 0;
  font-weight: 700;
  font-size: 14px;
}

.web-app .skip-link:focus {
  left: 0;
}
```

## B.5 — Toast: thông báo được cho AT và không che header trên mobile

`src/app/(web)/components/Toast.tsx`:
- Thêm `role="status" aria-live="polite" aria-atomic="true"` cho `.toast-container`.
- Thêm `aria-label="Đóng thông báo"` cho nút `✕`.
- Chuyển inline style sang class `.toast-container` / `.toast-item` trong `web.css`, và trên mobile đặt toast **ở dưới** để không che hamburger/giỏ hàng:

```css
.web-app .toast-container {
  position: fixed;
  right: 16px;
  left: 16px;
  bottom: calc(var(--web-mobile-bottom-nav-height) + 12px + env(safe-area-inset-bottom));
  z-index: 9998; /* dưới cookie banner 9999 và cổng tuổi 99999 */
  animation: slideInRight 0.3s ease;
}

@media (min-width: 769px) {
  .web-app .toast-container {
    left: auto;
    top: 88px;
    bottom: auto;
  }
}
```

`src/stores/useToastStore.ts` — clear timer cũ để toast mới không bị timer cũ tắt sớm:

```ts
let hideTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  visible: false,
  show: (msg) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message: msg, visible: true });
    hideTimer = setTimeout(() => set({ visible: false }), 3000);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: false });
  },
}));
```

## B.6 — Verify Phase B

```bash
npm test && npx next build && npx eslint .
```

Kiểm tay (viewport 375px, có sản phẩm trong giỏ, tại `/dat-hang`) — dán vào Console:

```js
(() => {
  const inputs = [...document.querySelectorAll('.checkout-form input[type=text], .checkout-form input[type=tel], .checkout-form input[type=email], .checkout-form textarea')];
  const labelled = inputs.filter(i => i.id && document.querySelector(`label[for="${i.id}"]`));
  const q = document.querySelector('.checkout-qty-btn').getBoundingClientRect();
  const c = document.querySelector('.cart-icon-wrap').getBoundingClientRect();
  return {
    labelled: labelled.length + '/' + inputs.length,
    autocomplete: inputs.filter(i=>i.getAttribute('autocomplete')).length + '/' + inputs.length,
    qtyBtn: [Math.round(q.width), Math.round(q.height)],
    cartIcon: [Math.round(c.width), Math.round(c.height)],
    skipLink: !!document.querySelector('.skip-link'),
    mainId: document.querySelector('main')?.id,
  };
})()
```
→ phải ra `labelled: "7/7"`, `autocomplete: "7/7"`, `qtyBtn: [44,44]`, `cartIcon` cả 2 chiều ≥ 44, `skipLink: true`, `mainId: "main-content"`.

Bấm Tab ngay khi tải trang → link "Bỏ qua tới nội dung chính" phải hiện ra.

---

# PHASE C — Cổng tuổi: bẫy focus thật & giảm dữ liệu thu thập

Phase 5.5 vòng 1 làm focus trap cho **popup** thay vì cho **cổng tuổi**. Đo khi gate đang mở: `backgroundFocusable: 82`, `mainInert: false`, `siblingsInert: 0`, focus vào link phía sau **thành công**.

## C.1 — Test trước

Tạo `src/app/(web)/components/age-gate-a11y.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(
  path.join(process.cwd(), 'src/app/(web)/components/AgeVerificationGate.tsx'),
  'utf8',
);

describe('AgeVerificationGate — a11y & tối thiểu hoá dữ liệu', () => {
  it('vô hiệu hoá nội dung nền bằng inert khi modal mở', () => {
    expect(SRC).toMatch(/setAttribute\(\s*['"]inert['"]/);
    expect(SRC).toMatch(/removeAttribute\(\s*['"]inert['"]/);
  });

  it('vòng phím Tab trong modal (bẫy focus)', () => {
    expect(SRC).toContain("e.key === 'Tab'");
    expect(SRC).toContain('shiftKey');
  });

  it('KHÔNG còn thu thập họ tên — trường này không mang lại giá trị xác minh', () => {
    expect(SRC).not.toContain('gate-fullname');
    expect(SRC).not.toMatch(/Họ và tên/);
  });

  it('không dùng <h1> để tránh trang có 2 h1', () => {
    expect(SRC).not.toMatch(/<h1[\s>]/);
    expect(SRC).toContain('id="age-gate-title"');
  });
});
```

Bổ sung vào `src/lib/compliance/compliance.test.ts` (hoặc file mới) một test hành vi:

```ts
it('validateDateOfBirth: đúng 18 tuổi hôm nay thì hợp lệ, thiếu 1 ngày thì không', () => {
  const today = new Date('2026-07-30T12:00:00Z');
  const exactly18 = '2008-07-30';
  const oneDayShort = '2008-07-31';
  expect(validateDateOfBirth(exactly18, today).valid).toBe(true);
  expect(validateDateOfBirth(oneDayShort, today).valid).toBe(false);
});
```

## C.2 — Sửa `src/app/(web)/components/AgeVerificationGate.tsx`

**(a)** Bỏ state + ref + JSX của trường họ tên:
- Xoá `const [name, setName] = useState('')` và `nameInputRef`.
- Xoá khối `<div>` chứa `htmlFor="gate-fullname"` và input `id="gate-fullname"`.
- Trong `handleSubmit`, xoá nhánh kiểm `name.trim()`.
- Trong `handleReset`, xoá `setName('')`.
- Đổi ref auto-focus sang input ngày sinh: thêm `const dobInputRef = useRef<HTMLInputElement>(null)`, gắn `ref={dobInputRef}` cho input `id="gate-dob"`, và đổi `setTimeout(() => nameInputRef.current?.focus(), 100)` → `dobInputRef`.

**(b)** Đổi `<h1 id="age-gate-title">` → `<h2 id="age-gate-title">` (giữ nguyên style; `aria-labelledby` vẫn trỏ đúng).

**(c)** Thay effect "Trap focus and prevent Escape key bypass" (hiện chỉ chặn Escape) bằng:

```tsx
  // Bẫy focus thật: vô hiệu hoá nội dung nền + vòng phím Tab trong modal
  useEffect(() => {
    if (!isOpen) return;

    const overlay = modalRef.current;
    const root = overlay?.parentElement; // .web-app
    const siblings = root
      ? (Array.from(root.children) as HTMLElement[]).filter((el) => el !== overlay)
      : [];
    siblings.forEach((el) => el.setAttribute('inert', ''));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setErrorMsg('Vui lòng hoàn thành xác nhận độ tuổi để tiếp tục.');
        return;
      }
      if (e.key !== 'Tab' || !overlay) return;

      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !overlay.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      siblings.forEach((el) => el.removeAttribute('inert'));
    };
  }, [isOpen]);
```

> `inert` được hỗ trợ trên toàn bộ trình duyệt hiện đại (Chrome 102+, Safari 15.5+, Firefox 112+). Không cần polyfill.

**(d)** Cập nhật `/chinh-sach-bao-mat` và `/chinh-sach-kiem-soat-do-tuoi`: nếu văn bản có nhắc "thu thập họ tên khi xác minh tuổi" thì sửa lại cho khớp (giờ chỉ còn ngày sinh, và ngày sinh **không** được lưu).

## C.3 — Verify Phase C

```bash
npm test && npx next build && npx eslint .
```

Kiểm tay: mở tab ẩn danh vào `/`, khi cổng tuổi hiện ra dán vào Console:

```js
(() => {
  const gate = document.querySelector('.age-gate-overlay');
  const bg = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
    .filter(e => !gate.contains(e) && e.getClientRects().length);
  if (bg[0]) bg[0].focus();
  return {
    siblingsInert: [...document.querySelectorAll('.web-app > *')].filter(e=>e.hasAttribute('inert')).length,
    focusEscaped: document.activeElement === bg[0],
    h1Count: document.querySelectorAll('h1').length,
    hasNameField: !!document.getElementById('gate-fullname'),
  };
})()
```
→ phải ra `siblingsInert` > 0, `focusEscaped: false`, `h1Count: 1`, `hasNameField: false`.

Bấm Tab liên tục → focus chỉ chạy vòng trong modal.

---

# PHASE D — `tsc --noEmit` phải xanh & thay test grep chuỗi

## D.1 — Hai lỗi type hiện tại

```
src/app/api/order/order-resilience.test.ts(33,28): TS2345 — 'Request' không gán được cho 'NextRequest'
src/lib/integrations/integrations.test.ts(6,7): TS2740 — thiếu 7 field của OrderRecord
```

Lỗi 1 tự biến mất khi Phase A xoá file đó (file mới dùng `NextRequest`).

Lỗi 2 — sửa `src/lib/integrations/integrations.test.ts`, bổ sung đủ field và **đồng thời** tăng giá trị test bằng cách assert payload compliance:

```ts
import { POLICY_VERSION } from '@/constants/compliance';

const order: OrderRecord = {
  orderNumber: 'BTU-20260614-120000-A1B',
  createdAtISO: '2026-06-14T00:00:00.000Z',
  customer: {
    name: 'Nguyễn Văn A', phone: '0912345678', address: 'Hà Nội',
    purchaser_age_confirmed: true, receiver_age_confirmed: true, terms_agreed: true,
  },
  items: [{ id: 'p1', name: 'Bia A', image: '', price: 100000, quantity: 2, subtotal: 200000 }],
  subTotal: 200000, autoDiscount: 0, promoDiscount: 0, promoCode: null, totalPrice: 200000,
  age_verified: true,
  age_verified_at: '2026-06-14T00:00:00.000Z',
  receiver_age_confirmed: true,
  alcohol_delivery_required: true,
  policy_version: POLICY_VERSION,
  status: 'age_verified',
  operational_note: 'Đơn hàng có đồ uống có cồn.',
};
```

Thêm test mới trong cùng file:

```ts
it('payload gửi Google Sheets mang đủ trường compliance', async () => {
  vi.stubEnv('SHEETS_WEBHOOK_URL', 'https://example.com/exec');
  vi.stubEnv('SHEETS_WEBHOOK_SECRET', 's');
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal('fetch', fetchMock);

  await appendOrderToSheet(order);

  const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(sent.secret).toBe('s');
  expect(sent.order.age_verified).toBe(true);
  expect(sent.order.receiver_age_confirmed).toBe(true);
  expect(sent.order.alcohol_delivery_required).toBe(true);
  expect(sent.order.policy_version).toBe(POLICY_VERSION);
  expect(sent.order.age_verified_at).toBeTruthy();
});

it('banner cảnh báo xuất hiện ở đầu tin Telegram khi được truyền', () => {
  const msg = buildTelegramMessage(order, '⚠️ ĐƠN CHƯA VÀO GOOGLE SHEET — VUI LÒNG NHẬP TAY NGAY');
  expect(msg.split('\n')[0]).toMatch(/CHƯA VÀO GOOGLE SHEET/);
});
```

## D.2 — Thay `a11y-regression.test.ts`

File hiện tại chỉ grep chuỗi trong source (`expect(src).toContain('role="dialog"')`) → xanh mà thực tế vẫn lỗi. **Xoá** nó. Giá trị a11y đã được các test ở Phase B/C thay thế bằng những assert cụ thể hơn (id/htmlFor/autoComplete/min-height/inert/Tab).

Nếu muốn giữ phần kiểm `aria-label` của `MobileBottomNav`/`FloatingZaloCTA`, chuyển sang test **hành vi** trong `FootballCampaignPopup`:

```ts
// src/app/(web)/components/football-popup.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = fs.readFileSync(path.join(process.cwd(), 'src/app/(web)/components/FootballCampaignPopup.tsx'), 'utf8');

describe('FootballCampaignPopup — không được vượt cổng tuổi', () => {
  it('chỉ hẹn giờ sau khi đã xác minh tuổi', () => {
    expect(SRC).toContain('isAgeVerified');
    expect(SRC).toContain('ageVerificationPassed');
  });
  it('có ngày kết thúc chiến dịch để không hiện vĩnh viễn', () => {
    const m = SRC.match(/CAMPAIGN_ENDS_AT\s*=\s*'([^']+)'/);
    expect(m, 'thiếu hằng CAMPAIGN_ENDS_AT').toBeTruthy();
    expect(Number.isNaN(Date.parse(m![1]))).toBe(false);
  });
});
```

## D.3 — Verify Phase D

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

Cả 4 phải xanh. `npx tsc --noEmit` **không được in ra dòng nào**.

---

# PHASE E — Dọn hack Köstritzer & feed Merchant

## E.1 — 🛑 CHỜ CHỦ DỰ ÁN: quyết định về Köstritzer

Vòng 1 ẩn SKU Köstritzer bằng cách hardcode vào tầng dữ liệu:

```ts
// src/lib/data/products.ts:29
function isStorefrontProduct(product: Product): boolean {
  if (product.slug.includes('kostritzer')) return false;   // ← hack
```

Hệ quả: ẩn khỏi catalog, PDP trả 404, mất khỏi sitemap và feed Merchant, **và mất luôn** combo `combo-oktoberfest-keg-kostritzer-xuc-xich` (nên `/san-pham` ra 32 card thay vì 34).

**Không sửa gì cho tới khi chủ dự án chọn:**
- **E-1** Giữ ẩn (đúng lý do: cả 2 SKU đều trỏ tới `/images/products/official/bitburger/kostritzer_keg.png` — file **không tồn tại**) → làm E.2 để cơ chế ẩn tường minh và có thể đảo lại.
- **E-2** Bổ sung ảnh Köstritzer thật → mở lại cả 2 SKU, không cần cơ chế ẩn.

## E.2 — Nếu chọn E-1: thay hack bằng cơ chế tường minh

```ts
// src/lib/data/products.ts
/**
 * SKU tạm ẩn khỏi storefront kèm LÝ DO. Xoá slug khỏi danh sách này để bán lại.
 * TODO(2026-07-30): cả 2 SKU trỏ tới /images/products/official/bitburger/kostritzer_keg.png
 * — file không tồn tại trong public/. Bổ sung ảnh chính hãng rồi xoá khỏi danh sách.
 */
const HIDDEN_PRODUCT_SLUGS = new Set<string>([
  'kostritzer-schwarzbier-bom-5l',
  'combo-oktoberfest-keg-kostritzer-xuc-xich',
]);

function isStorefrontProduct(product: Product): boolean {
  if (HIDDEN_PRODUCT_SLUGS.has(product.slug)) return false;
  return Boolean(
    product.id && product.name && product.slug && product.category &&
      STOREFRONT_CATEGORIES.has(product.category),
  );
}
```

Test kèm theo — `src/lib/data/hidden-products.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getAllProducts } from './products';

describe('SKU bị ẩn', () => {
  it('mọi SKU đang bán đều có ảnh tồn tại trên đĩa', () => {
    const missing = getAllProducts().flatMap((p) =>
      (p.images ?? [])
        .filter((u) => u.startsWith('/'))
        .filter((u) => !fs.existsSync(path.join(process.cwd(), 'public', decodeURIComponent(u))))
        .map((u) => `${p.slug} → ${u}`),
    );
    expect(missing).toEqual([]);
  });

  it('danh sách ẩn được khai báo tường minh, không dùng so khớp chuỗi', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/lib/data/products.ts'), 'utf8');
    expect(src).toContain('HIDDEN_PRODUCT_SLUGS');
    expect(src).not.toMatch(/slug\.includes\(['"]kostritzer/);
  });
});
```

## E.3 — Feed Google Merchant: bỏ item giá 0

`/google-merchant.xml` hiện xuất `<g:price>0 VND</g:price>` cho SKU `bitburger-premium-pils` (`price: null`) → Google sẽ từ chối item đó.

`src/app/google-merchant.xml/route.ts` — bỏ qua SKU không có giá, và mở rộng feed ra mọi category bán được:

```ts
  const products = getAllProducts()
    .filter((p) => typeof p.price === 'number' && p.price > 0) as unknown as ProductItem[];
```

Xoá nhánh `priceVal = ... : '0 VND'` và `availability = ... : 'out_of_stock'` (không còn cần vì đã lọc). Thêm `<g:identifier_exists>no</g:identifier_exists>` cho mỗi item (vì không có GTIN/MPN thật) — thiếu trường này là nguyên nhân disapprove phổ biến nhất.

Test — `src/app/google-merchant-feed.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { GET } from './google-merchant.xml/route';

describe('feed Google Merchant', () => {
  it('không có item giá 0 và mọi item khai identifier_exists', async () => {
    const xml = await (await GET()).text();
    expect(xml).not.toContain('<g:price>0 VND</g:price>');
    const items = (xml.match(/<item>/g) ?? []).length;
    const ids = (xml.match(/<g:identifier_exists>no<\/g:identifier_exists>/g) ?? []).length;
    expect(items).toBeGreaterThan(0);
    expect(ids).toBe(items);
  });
});
```

## E.4 — Verify Phase E

```bash
npm test && npx next build && npx eslint . && npx tsc --noEmit
```

Tay: mở `/google-merchant.xml` → không còn `0 VND`, mỗi `<item>` có `identifier_exists`.

---

## Việc của chủ dự án (không phải việc của người thực thi)

| # | Việc | Vì sao cần |
|---|------|-----------|
| 1 | Đặt `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_ACCOUNT`, `NEXT_PUBLIC_BANK_HOLDER` vào `.env.local` **và** ENV trên host | Hiện phương thức chuyển khoản bị **ẩn hoàn toàn**, khách chỉ còn COD |
| 2 | Đặt `SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET` (và `TELEGRAM_*`) trên host | Sau Phase A, thiếu ENV = **mọi đơn trả 502**. Đúng về mặt an toàn nhưng phải cấu hình mới bán được |
| 3 | Chốt E-1 hay E-2 (Köstritzer) | Phase E bị chặn |
| 4 | Chốt hướng Design System: hệ **sáng** (đá ấm + xanh rừng, như `/`) hay hệ **tối** (đen + vàng kim, như `/benediktiner-weissbier-naturtrub`) | Phase 6 của plan vòng 1 bị chặn |

---

## Định nghĩa "xong" cho vòng 2

- [ ] `npm test` xanh — **có** test `order-persistence.test.ts` chứng minh 502 khi cả 2 kênh lỗi
- [ ] `npx next build` xanh
- [ ] `npx eslint .` 0 error
- [ ] **`npx tsc --noEmit` không in ra dòng nào**
- [ ] `order-resilience.test.ts` và `a11y-regression.test.ts` đã bị **xoá** (không còn test grep chuỗi giả xanh)
- [ ] POST đơn hợp lệ khi thiếu ENV webhook → **502** + log `[ORDER_LOST]`, **không** có `success` trong body
- [ ] Mã đơn khớp `/^BTU-\d{8}-\d{6}-[0-9A-Z]{3}$/`
- [ ] `setInterval` ở module scope của `route.ts` đã bị xoá; có kiểm `Origin`
- [ ] `/dat-hang`: `labelled 7/7`, `autocomplete 7/7`, qty btn ≥44×44, cart icon ≥44×44
- [ ] Có skip-link hoạt động; `<main id="main-content">`
- [ ] Cổng tuổi: `siblingsInert > 0`, focus **không** ra được nền, `h1Count: 1`, không còn trường họ tên
- [ ] Toast có `role="status" aria-live="polite"`, trên mobile nằm dưới (không che header)
- [ ] `/google-merchant.xml`: không còn `0 VND`, mọi item có `identifier_exists`
- [ ] `src/lib/data/products.ts` không còn `slug.includes('kostritzer')` (nếu chọn E-1)

## Ngoài phạm vi vòng 2 (giữ nguyên, đừng chạm)

Phase 6 (hợp nhất design system, sửa 6 lỗi tương phản WCAG) và Phase 7 (i18n, bộ ảnh nội bộ thay 19 ảnh hotlink `product.hstatic.net`, sanitize `ArticleBody`, 3 slug hỏng, thứ tự heading, form liên hệ, giới hạn mã giảm giá…) — chi tiết ở `2026-07-29-ui-functionality-implementation-plan.md`.
