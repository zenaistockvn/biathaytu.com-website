import { COMPANY_CONFIG } from '@/config/company';
import { validateConsultationInput } from '@/lib/consultation/validation';
import type { ConsultationLead } from '@/lib/consultation/types';
import {
  appendConsultationToSheet,
  sendConsultationToTelegram,
} from '@/lib/integrations/consultation';

function methodNotAllowed(): Response {
  return Response.json(
    { error: 'Phương thức không được hỗ trợ.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Dữ liệu JSON không hợp lệ.' }, { status: 400 });
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

  try {
    await appendConsultationToSheet(lead);
  } catch (error) {
    console.error('[CONSULTATION_SHEETS_ERROR]', error);
    const missingConfiguration = error instanceof Error && error.message.includes('chưa được cấu hình');
    const message = missingConfiguration
      ? `Hệ thống tiếp nhận tư vấn chưa được cấu hình. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.`
      : `Chưa thể lưu yêu cầu tư vấn. Vui lòng gọi hotline ${COMPANY_CONFIG.hotline}.`;

    return Response.json({ error: message }, { status: 502 });
  }

  try {
    await sendConsultationToTelegram(lead);
  } catch (error) {
    console.error('[CONSULTATION_TELEGRAM_WARN]', error);
  }

  return Response.json({
    ok: true,
    message: 'Yêu cầu tư vấn đã được ghi nhận. Đội ngũ Bia Thầy Tu sẽ liên hệ lại sớm.',
  });
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
