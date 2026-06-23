/**
 * Google Apps Script — Web App nhận đơn Bia Thầy Tu, ghi vào sheet "Orders".
 * Cài đặt: dán vào Apps Script của Google Sheet → sửa SECRET → Deploy as Web App
 * (Execute as Me, Access: Anyone) → copy URL làm SHEETS_WEBHOOK_URL.
 */
const SECRET = 'DOI_THANH_CHUOI_NGAU_NHIEN_DAI'; // == SHEETS_WEBHOOK_SECRET trong .env

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!body || body.secret !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }
    const o = body.order || {};
    const cust = o.customer || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Thời gian', 'Mã đơn', 'Khách', 'SĐT', 'Email', 'Địa chỉ', 'Ghi chú',
        'Sản phẩm', 'Tạm tính', 'Giảm tự động', 'Mã giảm', 'Giảm theo mã', 'Tổng',
      ]);
    }
    const items = (o.items || []).map(function (i) { return i.name + ' x' + i.quantity; }).join('; ');
    sheet.appendRow([
      s(o.createdAtISO), s(o.orderNumber), s(cust.name), s("'" + (cust.phone || '')),
      s(cust.email || ''), s(cust.address), s(cust.note || ''),
      s(items), num(o.subTotal), num(o.autoDiscount), s(o.promoCode || ''),
      num(o.promoDiscount), num(o.totalPrice),
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Chống CSV/formula injection: prefix ' nếu ô bắt đầu bằng = + - @
function s(v) {
  v = v == null ? '' : String(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function num(v) {
  return typeof v === 'number' ? v : 0;
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
