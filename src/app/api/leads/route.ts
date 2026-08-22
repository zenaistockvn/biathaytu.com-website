import { NextResponse } from 'next/server';
import { BRAND } from '@/lib/brand';

export const runtime = 'nodejs';

const VALID_FORM_KINDS = new Set(['product_consultation', 'footer_price_list']);
const VALID_NEEDS = new Set(['mua lẻ', 'mua biếu tặng', 'nhà hàng quán bia', 'sự kiện']);

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 12;
}

function safePath(value: unknown): string {
  const path = cleanText(value, 500);
  return path.startsWith('/') ? path : '/';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Honeypot: silently accept bots so they do not learn the validation rule.
    if (cleanText(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const formKind = cleanText(body.formKind, 40);
    const name = cleanText(body.name, 120);
    const phone = cleanText(body.phone, 40);
    const need = cleanText(body.need, 80).toLowerCase();
    const note = cleanText(body.note, 1500);
    const productName = cleanText(body.productName, 200);
    const productSlug = cleanText(body.product_slug || body.productSlug, 200);

    if (!VALID_FORM_KINDS.has(formKind)) {
      return NextResponse.json({ error: 'Biểu mẫu không hợp lệ.' }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: 'Vui lòng nhập họ tên.' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Vui lòng nhập số điện thoại hợp lệ.' }, { status: 400 });
    }

    if (formKind === 'product_consultation' && !VALID_NEEDS.has(need)) {
      return NextResponse.json({ error: 'Vui lòng chọn nhu cầu tư vấn.' }, { status: 400 });
    }

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
    const webhookSecret = process.env.SHEETS_WEBHOOK_SECRET;

    if (!webhookUrl || !webhookSecret) {
      console.error('Lead webhook is not configured.');
      return NextResponse.json(
        { error: 'Hệ thống tiếp nhận thông tin chưa được cấu hình.' },
        { status: 503 },
      );
    }

    const payload = {
      secret: webhookSecret,
      submitted_at: new Date().toISOString(),
      form_kind: formKind,
      name,
      phone,
      need: need || '',
      note,
      page_path: safePath(body.page_path),
      product_slug: productSlug,
      product_name: productName,
      utm_source: cleanText(body.utm_source, 250),
      utm_medium: cleanText(body.utm_medium, 250),
      utm_campaign: cleanText(body.utm_campaign, 250),
      utm_content: cleanText(body.utm_content, 250),
      utm_term: cleanText(body.utm_term, 250),
      referrer: cleanText(body.referrer, 1000),
      notify_email: process.env.LEAD_NOTIFY_EMAIL || BRAND.email,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let webhookResponse: Response;
    try {
      webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        redirect: 'follow',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const webhookText = await webhookResponse.text();
    let webhookResult: { ok?: boolean; error?: string } | null = null;
    try {
      webhookResult = webhookText ? JSON.parse(webhookText) : null;
    } catch {
      webhookResult = null;
    }

    if (!webhookResponse.ok || webhookResult?.ok !== true) {
      console.error('Lead webhook rejected submission:', webhookResponse.status, webhookText.slice(0, 500));
      return NextResponse.json(
        { error: 'Chưa thể lưu thông tin. Vui lòng thử lại hoặc liên hệ trực tiếp qua Zalo.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Lead submission failed:', error);
    return NextResponse.json(
      { error: 'Không thể gửi thông tin lúc này. Vui lòng thử lại.' },
      { status: 500 },
    );
  }
}
