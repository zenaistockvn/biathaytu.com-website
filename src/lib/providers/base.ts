/**
 * Abstract interface that all social platform providers must implement.
 *
 * Design: Provider is instantiated with app-level credentials (client_id, etc).
 * Per-user OAuth tokens are passed as method arguments.
 */

import { APIError, RateLimitError } from './errors';
import type {
  AccountMetrics,
  AccountProfile,
  AuthType,
  CommentResult,
  InboxMessage,
  MediaType,
  OAuthTokens,
  PostMetrics,
  PostType,
  PublishContent,
  PublishResult,
  RateLimitConfig,
  ReplyResult,
} from './types';

export interface SocialProviderConfig {
  clientId: string;
  clientSecret: string;
  [key: string]: string;
}

export abstract class SocialProvider {
  protected credentials: SocialProviderConfig;

  constructor(credentials: SocialProviderConfig) {
    this.credentials = credentials;
  }

  // ── Metadata (abstract) ──────────────────────────────────────

  abstract get platformName(): string;
  abstract get authType(): AuthType;
  abstract get maxCaptionLength(): number;
  abstract get supportedPostTypes(): PostType[];
  abstract get supportedMediaTypes(): MediaType[];
  abstract get requiredScopes(): string[];

  get rateLimits(): RateLimitConfig {
    return { requestsPerHour: 200, requestsPerDay: 5000, publishPerDay: 25 };
  }

  // ── OAuth ────────────────────────────────────────────────────

  abstract getAuthUrl(redirectUri: string, state: string): string;
  abstract exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens>;
  abstract refreshToken(token: string): Promise<OAuthTokens>;

  // ── Profile ──────────────────────────────────────────────────

  abstract getProfile(accessToken: string): Promise<AccountProfile>;

  // ── Publishing ───────────────────────────────────────────────

  abstract publishPost(accessToken: string, content: PublishContent): Promise<PublishResult>;

  async publishComment(_accessToken: string, _postId: string, _text: string): Promise<CommentResult> {
    throw new Error(`${this.platformName} does not support comments`);
  }

  // ── Analytics (optional) ─────────────────────────────────────

  async getPostMetrics(_accessToken: string, _postId: string): Promise<PostMetrics> {
    throw new Error(`${this.platformName} does not support post metrics`);
  }

  async getAccountMetrics(
    _accessToken: string,
    _dateRange: { since: Date; until: Date },
  ): Promise<AccountMetrics> {
    throw new Error(`${this.platformName} does not support account metrics`);
  }

  // ── Inbox (optional) ─────────────────────────────────────────

  async getMessages(_accessToken: string, _since?: Date): Promise<InboxMessage[]> {
    throw new Error(`${this.platformName} does not support inbox`);
  }

  async replyToMessage(
    _accessToken: string,
    _messageId: string,
    _text: string,
  ): Promise<ReplyResult> {
    throw new Error(`${this.platformName} does not support message replies`);
  }

  // ── Token management ─────────────────────────────────────────

  async revokeToken(_accessToken: string): Promise<boolean> {
    return false;
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.getProfile(accessToken);
      return true;
    } catch {
      return false;
    }
  }

  // ── HTTP helper ──────────────────────────────────────────────

  protected async apiRequest<T = Record<string, unknown>>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await res.json();

    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      throw new RateLimitError(
        `Rate limit exceeded for ${this.platformName}`,
        {
          platform: this.platformName,
          retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
          rawResponse: data,
        },
      );
    }

    if (!res.ok) {
      throw new APIError(
        `${this.platformName} API error ${res.status}: ${JSON.stringify(data).slice(0, 500)}`,
        {
          platform: this.platformName,
          statusCode: res.status,
          rawResponse: data,
        },
      );
    }

    return data as T;
  }
}
