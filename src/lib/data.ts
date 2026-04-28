/**
 * Data Access Layer — Server-side data fetching functions.
 * 
 * Uses the anon key (read-only via RLS) for SSR data fetching.
 * Write operations go through API routes (service_role).
 */

import { createClient } from '@supabase/supabase-js';
import { DEFAULT_TENANT_ID } from '@/constants';
import type { Database } from '@/types/database';
import type { DashboardStats } from '@/types';

// Singleton client for server-side data fetching (anon key = read-only)
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const TENANT = DEFAULT_TENANT_ID;

// ─── Products ──────────────────────────────────────────────────

export async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('created_at', { ascending: false });
  return data ?? [];
}

// ─── Schedule Rules ────────────────────────────────────────────

export async function getRules() {
  const { data } = await supabase
    .from('schedule_rules')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('time', { ascending: true });
  return data ?? [];
}

// ─── Brand Settings ────────────────────────────────────────────

export async function getBrand() {
  const { data } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('tenant_id', TENANT)
    .single();
  return data;
}

// ─── Posts ──────────────────────────────────────────────────────

export async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*, products(name)')
    .eq('tenant_id', TENANT)
    .order('scheduled_at', { ascending: true })
    .limit(500);
  return data ?? [];
}

// ─── Social Accounts ───────────────────────────────────────────

export async function getSocialAccounts() {
  const { data } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('created_at', { ascending: false });
  return data ?? [];
}

// ─── Satellite Pages ───────────────────────────────────────────

export async function getSatellitePages() {
  const { data } = await supabase
    .from('satellite_pages')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

// ─── Dashboard Stats ───────────────────────────────────────────

export async function getStats(): Promise<DashboardStats> {
  const [products, rules, posts, contents] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }).eq('tenant_id', TENANT),
    supabase.from('schedule_rules').select('id', { count: 'exact' }).eq('tenant_id', TENANT),
    supabase.from('posts').select('id', { count: 'exact' }).eq('tenant_id', TENANT),
    supabase.from('generated_contents').select('id', { count: 'exact' }).eq('tenant_id', TENANT),
  ]);
  return {
    products: products.count ?? 0,
    rules: rules.count ?? 0,
    posts: posts.count ?? 0,
    contents: contents.count ?? 0,
  };
}

// ─── SEO Articles ──────────────────────────────────────────────

export async function getSeoArticles() {
  const { data } = await supabase
    .from('seo_articles')
    .select('*, products(name)')
    .eq('tenant_id', TENANT)
    .order('created_at', { ascending: false });
  return data ?? [];
}

// ─── Generated Contents ────────────────────────────────────────

export async function getGeneratedContents() {
  const { data, error } = await supabase
    .from('generated_contents')
    .select('*, products(name)')
    .eq('tenant_id', TENANT)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[getGeneratedContents] Error:', error);
    const { data: fallback } = await supabase
      .from('generated_contents')
      .select('*')
      .eq('tenant_id', TENANT)
      .order('created_at', { ascending: false })
      .limit(500);
    return fallback ?? [];
  }
  return data ?? [];
}

// ─── Studio Reference Data ─────────────────────────────────────

export async function getImagePrompts() {
  const { data } = await supabase
    .from('image_prompts')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getBrandDNA() {
  const { data } = await supabase
    .from('brand_dna')
    .select('*')
    .eq('tenant_id', TENANT);
  return data ?? [];
}

export async function getAdPlatformSpecs() {
  const { data } = await supabase
    .from('ad_platform_specs')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getAdAngles() {
  const { data } = await supabase
    .from('ad_angles')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getContentTips() {
  const { data } = await supabase
    .from('content_tips')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

// ─── Content Calendar ──────────────────────────────────────────

export async function getContentCalendar() {
  const { data } = await supabase
    .from('content_calendar')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('scheduled_date', { ascending: true });
  return data ?? [];
}

// ─── Activity Logs ─────────────────────────────────────────────

export async function getActivityLogs() {
  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('tenant_id', TENANT)
    .order('created_at', { ascending: false })
    .limit(20);
  return data ?? [];
}
