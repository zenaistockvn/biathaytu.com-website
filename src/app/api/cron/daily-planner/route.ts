import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';
import { verifyCronAuth } from '@/lib/auth';
import type { ScheduleRule } from '@/types';
import { getAutoImageForContent } from '@/lib/images';

/**
 * POST /api/cron/daily-planner
 * Vercel Cron chạy lúc 00:00 Asia/Ho_Chi_Minh
 * Đọc rules → chọn SP → DeepSeek tạo content → schedule posts
 */
export async function POST(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const supabase = createAdminSupabase();
  const today = new Date();
  const dayOfWeek = today.getDay();

  const { data: tenants } = await supabase.from('tenants').select('id, slug');

  const report = [];

  for (const tenant of tenants ?? []) {
    try {
      const { data: rules } = await supabase
        .from('schedule_rules')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true);

      const todayRules = (rules ?? []).filter((rule: ScheduleRule) => {
        const days = Array.isArray(rule.days_of_week) ? rule.days_of_week as number[] : [];
        return days.includes(dayOfWeek);
      });

      if (todayRules.length === 0) {
        report.push({ tenant: tenant.slug, posts: 0, status: 'no_rules' });
        continue;
      }

      let postsCreated = 0;

      for (const rule of todayRules) {
        try {
          // Lấy bài viết từ Kho Content thỏa mãn điều kiện Rule
          // Dùng inner join khi filter theo category, regular join khi không filter
          const productCategory = (rule as ScheduleRule & { product_category?: string }).product_category;
          const productJoin = productCategory
            ? '*, products!inner(name, images, category)'
            : '*, products(name, images, category)';

          let query = supabase
            .from('generated_contents')
            .select(productJoin)
            .eq('tenant_id', tenant.id)
            .eq('platform', rule.platform)
            .eq('content_format', rule.content_type)
            // Bỏ các content đã đăng hoặc đã lên lịch
            .or('status.is.null,status.in.(draft,approved)');

          // Filter theo product_category nếu rule chỉ định (bia, vang, hoặc null = tất cả)
          if (productCategory) {
            query = query.eq('products.category', productCategory);
          }

          // Logic sắp xếp (Rotation)
          if (rule.rotation === 'newest_first') {
            query = query.order('created_at', { ascending: false });
          } else {
            // Round robin or Random -> fetch oldest unused first to clear queue
            query = query.order('created_at', { ascending: true });
          }

          // Fetch a batch to allow randomness
          const { data: availableContents, error } = await query.limit(50);

          if (error) {
            console.error(`[DailyPlanner] Lỗi DB khi fetch nội dung cho rule ${rule.name}:`, error);
            continue;
          }

          if (!availableContents || availableContents.length === 0) {
            console.log(`[DailyPlanner] Bỏ qua Rule "${rule.name}" - Kho đã cạn kiệt bài viết loại ${rule.content_type} / ${rule.platform}`);
            continue;
          }

          // Áp dụng thuật toán Rotation chọn bài
          let selectedContent = availableContents[0];
          if (rule.rotation === 'random') {
            const randomIndex = Math.floor(Math.random() * availableContents.length);
            selectedContent = availableContents[randomIndex];
          }

          // Lấy giờ đăng bài
          const [hours, minutes] = rule.time.split(':').map(Number);
          const scheduledAt = new Date(
            today.getFullYear(), today.getMonth(), today.getDate(),
            hours, minutes,
          );

          // Xác định hình ảnh: Ưu tiên ảnh của Post, nếu không có lấy ảnh Product
          let finalImages: string[] = [];
          
          let productName = 'Unknown';
          if (selectedContent.products && typeof selectedContent.products === 'object') {
            // @ts-ignore
            productName = selectedContent.products.name || 'Unknown';
          }

          if (Array.isArray(selectedContent.image_urls) && selectedContent.image_urls.length > 0) {
            finalImages = selectedContent.image_urls as string[];
          } else {
            finalImages = getAutoImageForContent(selectedContent.id, productName, selectedContent.content_format);
          }

          // 1. Tạo Post (gắn target_page_id từ rule để routing publish đúng page)
          await supabase.from('posts').insert({
            product_id: selectedContent.product_id,
            platform: rule.platform,
            caption: selectedContent.caption,
            image_urls: finalImages,
            scheduled_at: scheduledAt.toISOString(),
            status: 'scheduled',
            tenant_id: tenant.id,
            target_page_id: rule.target_page_id ?? null,
          });

          // 2. Chuyển trạng thái nội dung trong thư viện thành scheduled
          await supabase
            .from('generated_contents')
            .update({ status: 'scheduled' })
            .eq('id', selectedContent.id);

          postsCreated++;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error(`Rule ${rule.name} failed:`, message);
        }
      }

      report.push({ tenant: tenant.slug, posts: postsCreated, status: 'ok' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      report.push({ tenant: tenant.slug, posts: 0, status: message });
    }
  }

  return NextResponse.json({
    message: 'Daily planning complete — publishing delegated to auto-publisher',
    timestamp: today.toISOString(),
    report,
  });
}
