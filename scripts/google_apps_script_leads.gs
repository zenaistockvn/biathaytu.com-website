const LEAD_SHEET_NAME = 'Leads';
const LEAD_HEADERS = [
  'submitted_at',
  'form_kind',
  'name',
  'phone',
  'need',
  'note',
  'page_path',
  'product_slug',
  'product_name',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'referrer',
];

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty('SHEETS_WEBHOOK_SECRET');

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const spreadsheetId = properties.getProperty('LEADS_SPREADSHEET_ID');
    const spreadsheet = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      throw new Error('No spreadsheet is configured for lead storage.');
    }

    let sheet = spreadsheet.getSheetByName(LEAD_SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(LEAD_SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(LEAD_HEADERS);
      sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const row = LEAD_HEADERS.map((key) => payload[key] || '');
    sheet.appendRow(row);

    const notifyEmail = payload.notify_email || properties.getProperty('LEAD_NOTIFY_EMAIL');
    if (notifyEmail) {
      const productLine = payload.product_name
        ? `<p><strong>Sản phẩm:</strong> ${escapeHtml(payload.product_name)}</p>`
        : '';
      const needLine = payload.need
        ? `<p><strong>Nhu cầu:</strong> ${escapeHtml(payload.need)}</p>`
        : '';
      const noteLine = payload.note
        ? `<p><strong>Ghi chú:</strong> ${escapeHtml(payload.note)}</p>`
        : '';
      const plainBody = [
        'Lead mới từ website German Taste',
        `Họ tên: ${payload.name || ''}`,
        `Số điện thoại: ${payload.phone || ''}`,
        payload.need ? `Nhu cầu: ${payload.need}` : '',
        payload.product_name ? `Sản phẩm: ${payload.product_name}` : '',
        payload.note ? `Ghi chú: ${payload.note}` : '',
        `Trang: ${payload.page_path || ''}`,
        `Thời gian: ${payload.submitted_at || ''}`,
        `UTM: ${formatUtm(payload)}`,
      ].filter(Boolean).join('\n');

      MailApp.sendEmail({
        to: notifyEmail,
        subject: `[German Taste] Lead mới - ${payload.name || payload.phone || 'Website'}`,
        body: plainBody,
        htmlBody:
          `<p><strong>Lead mới từ website German Taste</strong></p>` +
          `<p><strong>Họ tên:</strong> ${escapeHtml(payload.name)}</p>` +
          `<p><strong>Số điện thoại:</strong> ${escapeHtml(payload.phone)}</p>` +
          needLine +
          productLine +
          noteLine +
          `<p><strong>Trang:</strong> ${escapeHtml(payload.page_path)}</p>` +
          `<p><strong>Thời gian:</strong> ${escapeHtml(payload.submitted_at)}</p>` +
          `<p><strong>UTM:</strong> ${escapeHtml(formatUtm(payload))}</p>`,
      });
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function formatUtm(payload) {
  return [
    payload.utm_source && `source=${payload.utm_source}`,
    payload.utm_medium && `medium=${payload.utm_medium}`,
    payload.utm_campaign && `campaign=${payload.utm_campaign}`,
    payload.utm_content && `content=${payload.utm_content}`,
    payload.utm_term && `term=${payload.utm_term}`,
  ]
    .filter(Boolean)
    .join(' | ') || 'direct / chưa có UTM';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
