import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminSupabase } from '@/lib/supabase/server';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `BTU-${yyyy}${mm}${dd}-${randomSuffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customer, items, subTotal, totalDiscount, autoDiscountAmount, 
      promoDiscountAmount, appliedCode, totalPrice 
    } = body;

    // 1. Validate Input (Basic)
    if (!customer || !customer.name || !customer.phone || !customer.address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc' }, { status: 400 });
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(customer.phone)) {
      return NextResponse.json({ error: 'Số điện thoại không hợp lệ' }, { status: 400 });
    }

    if (customer.name.trim().length < 2) {
      return NextResponse.json({ error: 'Tên không hợp lệ' }, { status: 400 });
    }

    const supabase = createAdminSupabase();

    // 2. Re-validate prices against DB to prevent tampering
    const productIds = items.map((item: any) => item.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, price')
      .in('id', productIds);

    if (dbError || !dbProducts) {
      console.error('Error fetching products for validation:', dbError);
      return NextResponse.json({ error: 'Lỗi xác thực sản phẩm' }, { status: 500 });
    }

    let calculatedSubTotal = 0;
    const validatedItems = items.map((clientItem: any) => {
      const dbProduct = dbProducts.find(p => p.id === clientItem.id);
      if (!dbProduct || !dbProduct.price) {
        throw new Error(`Sản phẩm ${clientItem.name} không tồn tại hoặc lỗi giá`);
      }
      calculatedSubTotal += dbProduct.price * clientItem.quantity;
      return {
        ...clientItem,
        price: dbProduct.price, // Trust DB price
        subtotal: dbProduct.price * clientItem.quantity
      };
    });

    // Check subtotal logic (discount logic can be kept on server based on calculatedSubTotal)
    let calcAutoDiscount = 0;
    if (calculatedSubTotal >= 2000000) calcAutoDiscount = calculatedSubTotal * 0.05;
    
    // Simplistic promo validation matching client logic for now
    const promoCodes: Record<string, { percent?: number, amount?: number }> = {
      'VIP10': { percent: 10 },
      'FREESHIP': { amount: 30000 }
    };
    let calcPromoDiscount = 0;
    if (appliedCode && promoCodes[appliedCode.toUpperCase()]) {
      const promo = promoCodes[appliedCode.toUpperCase()];
      if (promo.percent) {
        calcPromoDiscount = calculatedSubTotal * (promo.percent / 100);
      } else if (promo.amount) {
        calcPromoDiscount = promo.amount;
      }
    }

    const calcTotalDiscount = calcAutoDiscount + calcPromoDiscount;
    const calcTotalPrice = Math.max(0, calculatedSubTotal - calcTotalDiscount);

    // 3. Generate Order Number
    const orderNumber = generateOrderNumber();

    // 4. INSERT INTO DB FIRST
    const { data: orderData, error: insertOrderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || null,
        customer_address: customer.address,
        customer_note: customer.note || null,
        sub_total: calculatedSubTotal,
        auto_discount: calcAutoDiscount,
        promo_discount: calcPromoDiscount,
        promo_code: appliedCode || null,
        total_price: calcTotalPrice,
        status: 'new',
        email_sent: false
      })
      .select('id')
      .single();

    if (insertOrderError || !orderData) {
      console.error('Insert Order Error:', insertOrderError);
      return NextResponse.json({ error: 'Không thể tạo đơn hàng trong hệ thống' }, { status: 500 });
    }

    const orderId = orderData.id;

    const itemsToInsert = validatedItems.map((item: any) => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const { error: insertItemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (insertItemsError) {
      console.error('Insert Order Items Error:', insertItemsError);
      // Optional: rollback order or mark as error, but we proceed for now
    }

    // 5. Send Email (Best Effort)
    let emailSent = false;
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const itemsHtml = validatedItems.map((item: any) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.subtotal)}</td>
          </tr>
        `).join('');

        let discountHtml = '';
        if (calcTotalDiscount > 0) {
          discountHtml += `
            <tr>
              <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Tạm tính:</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatPrice(calculatedSubTotal)}</td>
            </tr>
          `;
          if (calcAutoDiscount > 0) {
            discountHtml += `
              <tr>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">Giảm 5% (Đơn > 2tr):</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">-${formatPrice(calcAutoDiscount)}</td>
              </tr>
            `;
          }
          if (calcPromoDiscount > 0) {
            discountHtml += `
              <tr>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">Mã giảm giá (${appliedCode}):</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: green;">-${formatPrice(calcPromoDiscount)}</td>
              </tr>
            `;
          }
        }

        const htmlContent = `
          <h2>Đơn Đặt Hàng Mới Từ Bia Thầy Tu</h2>
          <p><strong>Mã Đơn Hàng:</strong> ${orderNumber}</p>
          <p><strong>Khách hàng:</strong> ${customer.name}</p>
          <p><strong>Số điện thoại:</strong> ${customer.phone}</p>
          <p><strong>Email:</strong> ${customer.email || 'Không có'}</p>
          <p><strong>Địa chỉ:</strong> ${customer.address}</p>
          <p><strong>Ghi chú:</strong> ${customer.note || 'Không có'}</p>
          
          <h3>Chi tiết đơn hàng:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Sản phẩm</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Số lượng</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Đơn giá</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              ${discountHtml}
              <tr>
                <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Tổng thanh toán:</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #d32f2f;">${formatPrice(calcTotalPrice)}</td>
              </tr>
            </tfoot>
          </table>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.biathaytu.com'}/amc/orders">Vào trang Quản Lý Đơn Hàng</a></p>
        `;

        await transporter.sendMail({
          from: `"Bia Thầy Tu" <${process.env.SMTP_USER}>`,
          to: 'anhdt.hust@gmail.com',
          subject: `[Đơn Hàng Mới] ${orderNumber} - Từ ${customer.name}`,
          html: htmlContent,
        });

        emailSent = true;
      } else {
        console.warn("SMTP credentials missing. Order saved to DB but email skipped.");
      }
    } catch (emailErr) {
      console.error("Failed to send order email:", emailErr);
      // We don't fail the request, fallback mechanism takes over
    }

    if (emailSent) {
      await supabase.from('orders').update({ email_sent: true }).eq('id', orderId);
    }

    // 6. Return Success with Order Number
    return NextResponse.json({ 
      success: true, 
      orderNumber 
    });

  } catch (error: any) {
    console.error('Order API Generic Error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
