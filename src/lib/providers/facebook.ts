/**
 * Facebook Graph API v21.0 provider.
 * Refactored from src/lib/facebook.ts → Provider pattern.
 * Adds: video publishing, inbox messages, comment posting.
 */

import { SocialProvider, type SocialProviderConfig } from './base';
import { OAuthError, PublishError } from './errors';
import type {
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

const BASE_URL = 'https://graph.facebook.com/v21.0';
const OAUTH_URL = 'https://www.facebook.com/v21.0/dialog/oauth';

export class FacebookProvider extends SocialProvider {
  constructor(credentials?: Partial<SocialProviderConfig>) {
    super({
      clientId: credentials?.clientId || process.env.FACEBOOK_APP_ID || '',
      clientSecret: credentials?.clientSecret || process.env.FACEBOOK_APP_SECRET || '',
      ...credentials,
    } as SocialProviderConfig);
  }

  // ── Metadata ─────────────────────────────────────────────────

  get platformName(): string { return 'Facebook'; }
  get authType(): AuthType { return 'oauth2'; }
  get maxCaptionLength(): number { return 63206; }

  get supportedPostTypes(): PostType[] {
    return ['text', 'image', 'video', 'link'];
  }

  get supportedMediaTypes(): MediaType[] {
    return ['jpeg', 'png', 'gif', 'mp4', 'mov'];
  }

  get requiredScopes(): string[] {
    return [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_read_user_content',
      'pages_manage_metadata',
      'pages_messaging',
    ];
  }

  get rateLimits(): RateLimitConfig {
    return { requestsPerHour: 200, requestsPerDay: 4800, publishPerDay: 4800 };
  }

  // ── OAuth ────────────────────────────────────────────────────

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
    // Step 1: code → short-lived token
    const shortParams = new URLSearchParams({
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      redirect_uri: redirectUri,
      code,
    });
    const shortData = await this.apiRequest<Record<string, unknown>>(
      `${BASE_URL}/oauth/access_token?${shortParams.toString()}`,
    );

    if (!shortData.access_token) {
      throw new OAuthError('Facebook token exchange failed', {
        platform: this.platformName,
        rawResponse: shortData,
      });
    }

    // Step 2: short → long-lived token (60 days)
    return this.refreshToken(shortData.access_token as string);
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

    if (!data.access_token) {
      throw new OAuthError('Facebook long-lived token exchange failed', {
        platform: this.platformName,
        rawResponse: data,
      });
    }

    return {
      accessToken: data.access_token as string,
      expiresIn: data.expires_in as number | undefined,
      tokenType: (data.token_type as string) || 'Bearer',
      rawResponse: data,
    };
  }

  // ── Profile ──────────────────────────────────────────────────

  async getProfile(accessToken: string): Promise<AccountProfile> {
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name,picture',
    });
    const data = await this.apiRequest<Record<string, unknown>>(
      `${BASE_URL}/me?${params.toString()}`,
    );

    const picture = data.picture as { data?: { url?: string } } | undefined;

    return {
      platformId: data.id as string,
      name: (data.name as string) || '',
      avatarUrl: picture?.data?.url || undefined,
      extra: data,
    };
  }

  /** Fetch Pages the user manages (with Page access tokens) */
  async getUserPages(accessToken: string): Promise<Array<{
    id: string;
    name: string;
    accessToken: string;
    category: string;
  }>> {
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name,access_token,category',
    });
    const data = await this.apiRequest<{ data?: Array<Record<string, unknown>> }>(
      `${BASE_URL}/me/accounts?${params.toString()}`,
    );

    return (data.data || []).map((page) => ({
      id: page.id as string,
      name: (page.name as string) || '',
      accessToken: (page.access_token as string) || '',
      category: (page.category as string) || '',
    }));
  }

  // ── Publishing ───────────────────────────────────────────────

  async publishPost(accessToken: string, content: PublishContent): Promise<PublishResult> {
    const pageId = content.extra.pageId as string;
    if (!pageId) {
      throw new PublishError('pageId is required in content.extra for Facebook publishing', {
        platform: this.platformName,
      });
    }

    if (content.extra?.platform === 'facebook_story' && content.mediaUrls.length > 0) {
      return this._publishStory(accessToken, pageId, content);
    }

    if (content.postType === 'video' && content.mediaUrls.length > 0) {
      return this._publishVideo(accessToken, pageId, content);
    }
    if ((content.postType === 'image' || content.mediaUrls.length > 0) && content.mediaUrls.length > 0) {
      return this._publishPhoto(accessToken, pageId, content);
    }
    return this._publishText(accessToken, pageId, content);
  }

  private async _publishText(
    accessToken: string,
    pageId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    const body: Record<string, unknown> = {
      message: content.text,
      access_token: accessToken,
    };
    if (content.linkUrl) body.link = content.linkUrl;

    const data = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${pageId}/feed`,
      { method: 'POST', body: JSON.stringify(body) },
    );
    return { platformPostId: data.id, url: `https://www.facebook.com/${data.id}`, extra: data };
  }

  private async _publishPhoto(
    accessToken: string,
    pageId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    const data = await this.apiRequest<{ id: string; post_id?: string }>(
      `${BASE_URL}/${pageId}/photos`,
      {
        method: 'POST',
        body: JSON.stringify({
          message: content.text,
          url: content.mediaUrls[0],
          access_token: accessToken,
        }),
      },
    );
    return {
      platformPostId: data.id,
      url: `https://www.facebook.com/${data.post_id || data.id}`,
      extra: data,
    };
  }

  private async _publishVideo(
    accessToken: string,
    pageId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    const data = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${pageId}/videos`,
      {
        method: 'POST',
        body: JSON.stringify({
          description: content.text,
          file_url: content.mediaUrls[0],
          title: content.title || undefined,
          access_token: accessToken,
        }),
      },
    );
    return { platformPostId: data.id, url: `https://www.facebook.com/${data.id}`, extra: data };
  }

  private async _publishStory(
    accessToken: string,
    pageId: string,
    content: PublishContent,
  ): Promise<PublishResult> {
    // Step 1: Upload photo as UNPUBLISHED (required by Photo Stories API)
    const uploadData = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${pageId}/photos`,
      {
        method: 'POST',
        body: JSON.stringify({
          url: content.mediaUrls[0],
          published: false,
          access_token: accessToken,
        }),
      },
    );

    if (!uploadData.id) {
      throw new PublishError('Failed to upload photo for Story', {
        platform: this.platformName,
        rawResponse: uploadData,
      });
    }

    // Step 2: Create the Story using the uploaded photo_id
    const storyData = await this.apiRequest<{ post_id: string }>(
      `${BASE_URL}/${pageId}/photo_stories`,
      {
        method: 'POST',
        body: JSON.stringify({
          photo_id: uploadData.id,
          access_token: accessToken,
        }),
      },
    );

    return { 
      platformPostId: storyData.post_id, 
      url: `https://www.facebook.com/${storyData.post_id}`, 
      extra: { ...storyData, uploadedPhotoId: uploadData.id } 
    };
  }

  // ── Comments ─────────────────────────────────────────────────

  async publishComment(accessToken: string, postId: string, text: string): Promise<CommentResult> {
    const data = await this.apiRequest<{ id: string }>(
      `${BASE_URL}/${postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ message: text, access_token: accessToken }),
      },
    );
    return { platformCommentId: data.id, extra: data };
  }

  // ── Analytics ────────────────────────────────────────────────

  async getPostMetrics(accessToken: string, postId: string): Promise<PostMetrics> {
    const metrics = 'post_impressions,post_reach,post_engaged_users,post_clicks,post_reactions_like_total';
    const params = new URLSearchParams({ metric: metrics, access_token: accessToken });
    const data = await this.apiRequest<{
      data?: Array<{ name: string; values?: Array<{ value: unknown }> }>;
    }>(`${BASE_URL}/${postId}/insights?${params.toString()}`);

    const result: PostMetrics = {
      impressions: 0, reach: 0, engagements: 0, likes: 0,
      comments: 0, shares: 0, saves: 0, clicks: 0, videoViews: 0,
      extra: {},
    };

    for (const item of data.data || []) {
      const value = (item.values?.[0]?.value as number) || 0;
      switch (item.name) {
        case 'post_impressions': result.impressions = value; break;
        case 'post_reach': result.reach = value; break;
        case 'post_engaged_users': result.engagements = value; break;
        case 'post_clicks': result.clicks = value; break;
        case 'post_reactions_like_total': result.likes = value; break;
      }
    }

    // Fetch comments + shares count from the post itself
    const postParams = new URLSearchParams({
      fields: 'comments.summary(true),shares',
      access_token: accessToken,
    });
    const postData = await this.apiRequest<Record<string, unknown>>(
      `${BASE_URL}/${postId}?${postParams.toString()}`,
    );
    const commentsData = postData.comments as { summary?: { total_count?: number } } | undefined;
    const sharesData = postData.shares as { count?: number } | undefined;
    result.comments = commentsData?.summary?.total_count || 0;
    result.shares = sharesData?.count || 0;

    return result;
  }

  // ── Inbox ────────────────────────────────────────────────────

  async getMessages(accessToken: string, since?: Date): Promise<InboxMessage[]> {
    const params = new URLSearchParams({ access_token: accessToken });
    if (since) params.set('since', Math.floor(since.getTime() / 1000).toString());

    const convos = await this.apiRequest<{ data?: Array<{ id: string }> }>(
      `${BASE_URL}/me/conversations?${params.toString()}`,
    );

    const messages: InboxMessage[] = [];
    for (const convo of convos.data || []) {
      const msgParams = new URLSearchParams({
        fields: 'id,message,from,created_time',
        access_token: accessToken,
      });
      const msgs = await this.apiRequest<{ data?: Array<Record<string, unknown>> }>(
        `${BASE_URL}/${convo.id}/messages?${msgParams.toString()}`,
      );

      for (const msg of msgs.data || []) {
        const from = msg.from as { id?: string; name?: string } | undefined;
        messages.push({
          platformMessageId: msg.id as string,
          senderId: from?.id || '',
          senderName: from?.name || '',
          text: (msg.message as string) || '',
          timestamp: new Date(
            ((msg.created_time as string) || '').replace('+0000', '+00:00'),
          ),
          messageType: 'dm',
          isRead: false,
          extra: { conversationId: convo.id },
        });
      }
    }
    return messages;
  }

  async replyToMessage(
    accessToken: string,
    conversationId: string,
    text: string,
  ): Promise<ReplyResult> {
    const data = await this.apiRequest<{ id?: string }>(
      `${BASE_URL}/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ message: text, access_token: accessToken }),
      },
    );
    return {
      platformMessageId: data.id || '',
      extra: data as Record<string, unknown>,
    };
  }

  // ── Token management ─────────────────────────────────────────

  async revokeToken(accessToken: string): Promise<boolean> {
    try {
      await this.apiRequest(
        `${BASE_URL}/me/permissions?access_token=${accessToken}`,
        { method: 'DELETE' },
      );
      return true;
    } catch {
      return false;
    }
  }
}
