/**
 * Instagram Graph API provider (via Meta/Facebook).
 * Uses the same Meta App credentials as Facebook.
 * Publishing flow: create media container → publish container.
 */

import { SocialProvider, type SocialProviderConfig } from './base';
import { OAuthError, PublishError } from './errors';
import type {
  AccountProfile,
  AuthType,
  MediaType,
  OAuthTokens,
  PostMetrics,
  PostType,
  PublishContent,
  PublishResult,
  RateLimitConfig,
} from './types';

const BASE_URL = 'https://graph.facebook.com/v21.0';
const OAUTH_URL = 'https://www.facebook.com/v21.0/dialog/oauth';

export class InstagramProvider extends SocialProvider {
  constructor(credentials?: Partial<SocialProviderConfig>) {
    super({
      clientId: credentials?.clientId || process.env.FACEBOOK_APP_ID || '',
      clientSecret: credentials?.clientSecret || process.env.FACEBOOK_APP_SECRET || '',
      ...credentials,
    } as SocialProviderConfig);
  }

  // ── Metadata ─────────────────────────────────────────────────

  get platformName(): string { return 'Instagram'; }
  get authType(): AuthType { return 'oauth2'; }
  get maxCaptionLength(): number { return 2200; }

  get supportedPostTypes(): PostType[] {
    return ['image', 'video', 'carousel', 'reel', 'story'];
  }

  get supportedMediaTypes(): MediaType[] {
    return ['jpeg', 'png', 'mp4', 'mov'];
  }

  get requiredScopes(): string[] {
    return [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement',
    ];
  }

  get rateLimits(): RateLimitConfig {
    return { requestsPerHour: 200, requestsPerDay: 4800, publishPerDay: 25 };
  }

  // ── OAuth (shared with Facebook, different scopes) ───────────

  getAuthUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      redirect_uri: redirectUri,
      scope: this.requiredScopes.join(','),
      response_type: 'code',
      state,
    });
    return `${OAUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      redirect_uri: redirectUri,
      code,
    });
    const data = await this.apiRequest<Record<string, unknown>>(
      `${BASE_URL}/oauth/access_token?${params.toString()}`,
    );

    if (!data.access_token) {
      throw new OAuthError('Instagram OAuth failed', {
        platform: this.platformName,
        rawResponse: data,
      });
    }

    // Exchange for long-lived token
    return this.refreshToken(data.access_token as string);
  }

  async refreshToken(shortLivedToken: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      fb_exchange_token: shortLivedToken,
    });
    const data = await this.apiRequest<Record<string, unknown>>(
      `${BASE_URL}/oauth/access_token?${params.toString()}`,
    );

    return {
      accessToken: data.access_token as string,
      expiresIn: data.expires_in as number | undefined,
      tokenType: 'Bearer',
      rawResponse: data,
    };
  }

  // ── Profile ──────────────────────────────────────────────────

  async getProfile(accessToken: string): Promise<AccountProfile> {
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name,username,profile_picture_url,followers_count',
    });
    const data = await this.apiRequest<Record<string, unknown>>(
      `${BASE_URL}/me?${params.toString()}`,
    );

    return {
      platformId: data.id as string,
      name: (data.name as string) || (data.username as string) || '',
      handle: data.username as string | undefined,
      avatarUrl: data.profile_picture_url as string | undefined,
      followerCount: data.followers_count as number | undefined,
      extra: data,
    };
  }

  /** Get Instagram Business Account ID from a Facebook Page */
  async getInstagramAccountId(
    pageAccessToken: string,
    pageId: string,
  ): Promise<string | null> {
    const params = new URLSearchParams({
      access_token: pageAccessToken,
      fields: 'instagram_business_account',
    });
    const data = await this.apiRequest<{
      instagram_business_account?: { id: string };
    }>(`${BASE_URL}/${pageId}?${params.toString()}`);

    return data.instagram_business_account?.id || null;
  }

  // ── Publishing (Container-based flow) ─────────────────────────

  async publishPost(
    accessToken: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    const igAccountId = content.extra.igAccountId as string;
    if (!igAccountId) {
      throw new PublishError(
        'igAccountId is required in content.extra for Instagram publishing',
        { platform: this.platformName },
      );
    }

    if (content.postType === 'carousel' && content.mediaUrls.length > 1) {
      return this._publishCarousel(accessToken, igAccountId, content);
    }

    if (content.postType === 'reel' || content.postType === 'video') {
      return this._publishReel(accessToken, igAccountId, content);
    }

    return this._publishSingleImage(accessToken, igAccountId, content);
  }

  private async _publishSingleImage(
    accessToken: string,
    igAccountId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    // Step 1: Create media container
    const container = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${igAccountId}/media`,
      {
        method: 'POST',
        body: JSON.stringify({
          image_url: content.mediaUrls[0],
          caption: content.text,
          access_token: accessToken,
        }),
      },
    );

    // Step 2: Publish container
    const result = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${igAccountId}/media_publish`,
      {
        method: 'POST',
        body: JSON.stringify({
          creation_id: container.id,
          access_token: accessToken,
        }),
      },
    );

    return {
      platformPostId: result.id,
      url: `https://www.instagram.com/p/${result.id}/`,
      extra: { containerId: container.id, ...result },
    };
  }

  private async _publishCarousel(
    accessToken: string,
    igAccountId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    // Step 1: Create child containers for each image (max 10)
    const childIds: string[] = [];
    for (const url of content.mediaUrls.slice(0, 10)) {
      const child = await this.apiRequest<{ id: string }>(
        `${BASE_URL}/${igAccountId}/media`,
        {
          method: 'POST',
          body: JSON.stringify({
            image_url: url,
            is_carousel_item: true,
            access_token: accessToken,
          }),
        },
      );
      childIds.push(child.id);
    }

    // Step 2: Create carousel container
    const carousel = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${igAccountId}/media`,
      {
        method: 'POST',
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: childIds.join(','),
          caption: content.text,
          access_token: accessToken,
        }),
      },
    );

    // Step 3: Publish carousel
    const result = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${igAccountId}/media_publish`,
      {
        method: 'POST',
        body: JSON.stringify({
          creation_id: carousel.id,
          access_token: accessToken,
        }),
      },
    );

    return {
      platformPostId: result.id,
      url: `https://www.instagram.com/p/${result.id}/`,
      extra: { carouselId: carousel.id, childIds, ...result },
    };
  }

  private async _publishReel(
    accessToken: string,
    igAccountId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    // Step 1: Create video container
    const container = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${igAccountId}/media`,
      {
        method: 'POST',
        body: JSON.stringify({
          media_type: 'REELS',
          video_url: content.mediaUrls[0],
          caption: content.text,
          access_token: accessToken,
        }),
      },
    );

    // Step 2: Wait for processing (poll status)
    await this._waitForMediaReady(accessToken, container.id);

    // Step 3: Publish
    const result = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${igAccountId}/media_publish`,
      {
        method: 'POST',
        body: JSON.stringify({
          creation_id: container.id,
          access_token: accessToken,
        }),
      },
    );

    return {
      platformPostId: result.id,
      url: `https://www.instagram.com/reel/${result.id}/`,
      extra: { containerId: container.id, ...result },
    };
  }

  /** Poll media container status until FINISHED (required for video) */
  private async _waitForMediaReady(
    accessToken: string,
    containerId: string,
    maxRetries = 30,
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      const params = new URLSearchParams({
        fields: 'status_code',
        access_token: accessToken,
      });
      const status = await this.apiRequest<{ status_code: string }>(
        `${BASE_URL}/${containerId}?${params.toString()}`,
      );

      if (status.status_code === 'FINISHED') return;
      if (status.status_code === 'ERROR') {
        throw new PublishError(
          `Instagram media processing failed for container ${containerId}`,
          { platform: this.platformName },
        );
      }

      // Wait 2 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new PublishError(
      `Instagram media processing timed out for container ${containerId}`,
      { platform: this.platformName },
    );
  }

  // ── Analytics ────────────────────────────────────────────────

  async getPostMetrics(accessToken: string, postId: string): Promise<PostMetrics> {
    const params = new URLSearchParams({
      metric: 'impressions,reach,engagement,saved',
      access_token: accessToken,
    });
    const data = await this.apiRequest<{
      data?: Array<{ name: string; values?: Array<{ value: number }> }>;
    }>(`${BASE_URL}/${postId}/insights?${params.toString()}`);

    const result: PostMetrics = {
      impressions: 0, reach: 0, engagements: 0, likes: 0,
      comments: 0, shares: 0, saves: 0, clicks: 0, videoViews: 0,
      extra: {},
    };

    for (const item of data.data || []) {
      const value = item.values?.[0]?.value || 0;
      switch (item.name) {
        case 'impressions': result.impressions = value; break;
        case 'reach': result.reach = value; break;
        case 'engagement': result.engagements = value; break;
        case 'saved': result.saves = value; break;
      }
    }

    return result;
  }
}
