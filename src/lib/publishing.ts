/**
 * Publishing Utilities — Shared logic for social media publishing.
 *
 * Extracted from publish/route.ts and auto-publisher/route.ts
 * to eliminate duplication and ensure consistent behavior.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { PublishContent } from '@/lib/providers/types';

// ─── Resolve Target Social Account ─────────────────────────────

interface ResolvedAccount {
  account_id: string;
  access_token: string;
  id?: string;
  platform?: string;
}

/**
 * Resolves the correct social account for publishing.
 * Priority: target_page_id → satellite_pages → fallback tenant+platform.
 */
export async function resolvePublishAccount(
  supabase: SupabaseClient,
  tenantId: string,
  platform: string,
  targetPageId?: string | null,
): Promise<ResolvedAccount | null> {
  // 1. Route via satellite_pages if target_page_id is set
  if (targetPageId) {
    const { data: satPage } = await supabase
      .from('satellite_pages')
      .select('social_account_id')
      .eq('id', targetPageId)
      .single();

    if (satPage?.social_account_id) {
      const { data: sa } = await supabase
        .from('social_accounts')
        .select('id, account_id, access_token, platform')
        .eq('id', satPage.social_account_id)
        .eq('is_active', true)
        .single();
      if (sa) return sa;
    }
  }

  // 2. Fallback: first active account for tenant + platform
  // Normalize sub-platforms to base platform for account lookup
  const basePlatform = normalizeAccountPlatform(platform);

  const { data: sa } = await supabase
    .from('social_accounts')
    .select('id, account_id, access_token, platform')
    .eq('tenant_id', tenantId)
    .eq('platform', basePlatform)
    .eq('is_active', true)
    .limit(1)
    .single();

  return sa;
}

/**
 * Maps sub-platform variants to their base platform for social_accounts lookup.
 * e.g. facebook_story → facebook, instagram_reels → instagram
 */
function normalizeAccountPlatform(platform: string): string {
  if (platform.startsWith('facebook')) return 'facebook';
  if (platform.startsWith('instagram')) return 'instagram';
  return platform;
}

// ─── Convert Relative URLs to Absolute ─────────────────────────

/**
 * Facebook & Instagram Graph API require absolute public URLs.
 * Converts relative paths like /images/... to full https URLs.
 */
export function toAbsoluteImageUrls(urls: string[] | null | undefined): string[] {
  if (!urls || !Array.isArray(urls)) return [];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.biathaytu.com';
  const cleanBase = baseUrl.replace(/\/$/, '');

  return urls.map(url => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${cleanBase}${url.startsWith('/') ? '' : '/'}${url}`;
  });
}

// ─── Detect Post Type ──────────────────────────────────────────

/**
 * Determines post type based on media URLs.
 * - 0 images → text
 * - 1 image → image (or video if .mp4/.mov)
 * - 2+ images → carousel
 */
export function detectPostType(imageUrls: string[]): PublishContent['postType'] {
  if (imageUrls.length === 0) return 'text';
  if (imageUrls.length > 1) return 'carousel';

  const url = imageUrls[0].toLowerCase();
  if (url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm')) {
    return 'video';
  }
  return 'image';
}
