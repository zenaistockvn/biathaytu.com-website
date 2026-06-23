/**
 * AMC × Bia Thầy Tu — Type Definitions
 * 
 * Application-level types derived from the Database schema.
 * Uses `Tables` helper from database.ts for Row types,
 * with custom types for API contracts and domain logic.
 */

import type { Tables } from './database';

// ─── Database Row Types (auto-derived) ──────────────────────────

export type Product = Tables<'products'>;
export type BrandSettings = Tables<'brand_settings'>;
export type ScheduleRule = Tables<'schedule_rules'>;
export type Post = Tables<'posts'> & {
  products?: { name: string } | null;
};
export type SocialAccount = Tables<'social_accounts'>;
export type PostAnalytics = Tables<'post_analytics'>;
export type SeoArticle = Tables<'seo_articles'> & {
  products?: { name: string } | null;
};
export type GeneratedContent = Tables<'generated_contents'> & {
  products?: { name: string } | null;
};
export type ImagePrompt = Tables<'image_prompts'>;
export type BrandDNA = Tables<'brand_dna'>;
export type AdPlatformSpec = Tables<'ad_platform_specs'>;
export type AdAngle = Tables<'ad_angles'>;
export type ContentTip = Tables<'content_tips'>;
export type Tenant = Tables<'tenants'>;
export type ContentCalendar = Tables<'content_calendar'>;
export type SatellitePage = Tables<'satellite_pages'>;

export type PageRole = 'hub' | 'satellite';

// ─── Domain Types ───────────────────────────────────────────────

export interface ProductAnalysis {
  name: string;
  category: string;
  features: string[];
  colors: string[];
  mood: string;
  usp: string;
  rawDescription: string;
}

export type Platform = 'facebook' | 'facebook_story' | 'instagram' | 'tiktok' | 'zalo' | 'linkedin';

export type PostStatus = 'scheduled' | 'pending' | 'published' | 'failed' | 'needs_review';

export type ContentStatus = 'draft' | 'approved' | 'needs_review' | 'scheduled' | 'published';

// ─── API Contracts ──────────────────────────────────────────────

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T | null;
  message: string;
  error?: {
    code: string;
    details: string;
  };
}

export interface DashboardStats {
  products: number;
  rules: number;
  posts: number;
  contents: number;
}

export interface CreatePostPayload {
  contentId?: string;
  productId?: string;
  platforms: Platform[]; // Changed from platform to platforms array
  caption: string;
  hashtags?: string;
  imageUrls?: string[];
  scheduledAt?: string;
  publishNow: boolean;
  targetPageId?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  usp: string;
  images?: string[];
}

export interface CreateRulePayload {
  name: string;
  time: string;
  platform: Platform;
  contentType: string;
  daysOfWeek?: number[];
  rotation?: string;
  targetPageId?: string;
}

export interface GenerateContentPayload {
  productId: string;
  platforms?: Platform[];
  framework?: string;
  tone?: string;
  length?: string;
}

export interface ContentReview {
  score: number;
  approved: boolean;
  suggestions: string[];
}
