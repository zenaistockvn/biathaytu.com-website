const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Đọc file .env.local để lấy cấu hình cục bộ
const envPath = path.join(__dirname, '..', '.env.local');
let envVars = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      envVars[key] = val;
    }
  });
} catch (e) {
  console.log('Không tìm thấy file .env.local hoặc lỗi đọc file. Sẽ dùng env thực tế của hệ thống.');
}

const smtpUser = envVars['SMTP_USER'] || process.env.SMTP_USER;
const smtpPass = envVars['SMTP_PASS'] || process.env.SMTP_PASS;
const smtpHost = envVars['SMTP_HOST'] || process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(envVars['SMTP_PORT'] || process.env.SMTP_PORT || '465');
const notificationEmail = envVars['ORDER_NOTIFICATION_EMAIL'] || process.env.ORDER_NOTIFICATION_EMAIL || 'anhdt.hust@gmail.com';

console.log('--- CẤU HÌNH SMTP HIỆN TẠI ---');
console.log('SMTP Host:', smtpHost);
console.log('SMTP Port:', smtpPort);
console.log('SMTP User (Sender):', smtpUser || '(Chưa cấu hình)');
console.log('SMTP Pass Length:', smtpPass ? smtpPass.length : 0);
console.log('Notification Email (Receiver):', notificationEmail);
console.log('------------------------------');

if (!smtpUser || !smtpPass) {
  console.error('LỖI: Chưa cấu hình SMTP_USER hoặc SMTP_PASS trong file .env.local hoặc môi trường!');
  process.exit(1);
}

async function testEmail() {
  console.log('Đang kết nối SMTP và gửi thử email...');
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Bia Thầy Tu Test" <${smtpUser}>`,
      to: notificationEmail,
      subject: '[Test SMTP] Thử gửi email từ hệ thống Bia Thầy Tu',
      text: 'Nếu bạn nhận được email này, cấu hình SMTP của bạn đã chính xác và hoạt động tốt!',
      html: '<h3>Kết nối SMTP thành công!</h3><p>Hệ thống gửi email thông báo đơn hàng của Bia Thầy Tu đã hoạt động bình thường.</p>',
    });
    console.log('GỬI THÀNH CÔNG! Message ID:', info.messageId);
  } catch (error) {
    console.error('GỬI THẤT BẠI. Chi tiết lỗi:', error);
  }
}

testEmail();
