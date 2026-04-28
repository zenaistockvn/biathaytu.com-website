/**
 * Shared types for the multi-platform social provider system.
 * Ported from BrightBean Studio's providers/types.py → TypeScript.
 */

// ─── Enums ─────────────────────────────────────────────────────

export type PostType = 'text' | 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'link';

export type MediaType = 'jpeg' | 'png' | 'gif' | 'mp4' | 'mov' | 'webp';

export type AuthType = 'oauth2' | 'session';

// ─── OAuth ─────────────────────────────────────────────────────

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
  scope?: string;
  rawResponse: Record<string, unknown>;
}

// ─── Profile ───────────────────────────────────────────────────

export interface AccountProfile {
  platformId: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  followerCount?: number;
  extra: Record<string, unknown>;
}

// ─── Publishing ────────────────────────────────────────────────

export interface PublishContent {
  text: string;
  mediaUrls: string[];
  postType: PostType;
  linkUrl?: string;
  title?: string;
  firstComment?: string;
  extra: Record<string, unknown>;
}

export interface PublishResult {
  platformPostId: string;
  url?: string;
  extra: Record<string, unknown>;
}

export interface CommentResult {
  platformCommentId: string;
  extra: Record<string, unknown>;
}

// ─── Analytics ─────────────────────────────────────────────────

export interface PostMetrics {
  impressions: number;
  reach: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  videoViews: number;
  extra: Record<string, unknown>;
}

export interface AccountMetrics {
  followers: number;
  followersGained: number;
  impressions: number;
  reach: number;
  profileViews: number;
  extra: Record<string, unknown>;
}

// ─── Inbox ─────────────────────────────────────────────────────

export interface InboxMessage {
  platformMessageId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  messageType: 'comment' | 'dm' | 'mention';
  isRead: boolean;
  extra: Record<string, unknown>;
}

export interface ReplyResult {
  platformMessageId: string;
  extra: Record<string, unknown>;
}

// ─── Rate Limiting ─────────────────────────────────────────────

export interface RateLimitConfig {
  requestsPerHour: number;
  requestsPerDay: number;
  publishPerDay: number;
  extra?: Record<string, unknown>;
}
