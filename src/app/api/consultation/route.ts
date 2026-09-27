import { COMPANY_CONFIG } from '@/config/company';
import { validateConsultationInput } from '@/lib/consultation/validation';
import type { ConsultationLead } from '@/lib/consultation/types';
import {
  appendConsultationToSheet,
  sendConsultationToLeadWebhook,
  sendConsultationToTelegram,
} from '@/lib/integrations/consultation';

function methodNotAllowed(): Response {
  return Response.json(
    { error: 'Phương thức không được hỗ trợ.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}

const SUCCESS_MESSAGE = 'Yêu cầu tư vấn đã được ghi nhận. Đội ngũ Bia Thầy Tu sẽ liên hệ lại sớm.';

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Dữ liệu JSON không hợp lệ.' }, { status: 400 });
  }

  // Honeypot giống gt.vn: bot điền ô "website" ẩn thì trả thành công mà không gửi đi đâu.
  if (body && typeof body === 'object' && (body as { website?: unknown }).website) {
    return Response.json({ ok: true, message: SUCCESS_MESSAGE });
  }

  const validation = validateConsultationInput(body);
  if (!validation.ok) {
    return Response.json(
      { error: validation.error, field: validation.field },
      { status: 400 },
    );
  }

  const lead: ConsultationLead = {
    ...validation.data,
    createdAtISO: new Date().toISOString(),
    source: 'product-consultation',
  };

  // Hai kênh lưu yêu cầu: webhook email chung với gt.vn và Google Sheet riêng của biathaytu.
  // Chỉ báo thành công khi ít nhất một kênh đã cấu hình nhận được yêu cầu.
  const deliveries: Array<[string, boolean, () => Promise<void>]> = [
    ['LEAD_WEBHOOK', Boolean(process.env.LEAD_WEBHOOK_URL), () => sendConsultationToLeadWebhook(lead)],
    ['SHEETS', Boolean(process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET), () => appendConsultationToSheet(lead)],
  ];
  const configured = deliveries.filter(([, enabled]) => enabled);

  if (configured.length === 0) {
    console.error('[CONSULTATION_CONFIG_ERROR] Chưa cấu hình LEAD_WEBHOOK_URL hoặc SHEETS_WEBHOOK_URL');
    return Response.json(
      { error: `Hệ thống tiếp nhận tư vấn chưa được cấu hình. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.` },
      { status: 503 },
    );
  }

  const results = await Promise.allSettled(configured.map(([, , send]) => send()));
  results.forEach((result, index) => {
    if (result.status === 'rejected') console.error(`[CONSULTATION_${configured[index][0]}_ERROR]`, result.reason);
  });

  if (!results.some((result) => result.status === 'fulfilled')) {
    return Response.json(
      { error: `Chưa thể gửi yêu cầu tư vấn. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.` },
      { status: 502 },
    );
  }

  try {
    await sendConsultationToTelegram(lead);
  } catch (error) {
    console.error('[CONSULTATION_TELEGRAM_WARN]', error);
  }

  return Response.json({ ok: true, message: SUCCESS_MESSAGE });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
