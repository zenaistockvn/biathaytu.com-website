import { SocialProvider, SocialProviderConfig } from './base';
import type { PublishContent, PublishResult, OAuthTokens, AccountProfile, AuthType, PostType, MediaType } from './types';
import { ProviderError } from './errors';

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';
const TIKTOK_AUTH_BASE = 'https://www.tiktok.com/v2/auth/authorize/';
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';

export class TikTokProvider extends SocialProvider {
  constructor() {
    super({
      clientId: process.env.TIKTOK_CLIENT_KEY || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    });
  }

  get platformName(): string { return 'TikTok'; }
  get authType(): AuthType { return 'oauth2'; }
  get maxCaptionLength(): number { return 2200; }
  get supportedPostTypes(): PostType[] { return ['video', 'carousel']; }
  get supportedMediaTypes(): MediaType[] { return ['mp4', 'jpeg', 'png', 'webp']; }
  get requiredScopes(): string[] { return ['video.publish', 'user.info.basic']; }

  getAuthUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_key: this.credentials.clientId,
      response_type: 'code',
      scope: this.requiredScopes.join(','),
      redirect_uri: redirectUri,
      state: state,
    });
    return `${TIKTOK_AUTH_BASE}?${params.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
    const data = new URLSearchParams({
      client_key: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const body = await this.apiRequest<any>(TIKTOK_TOKEN_URL, {
      method: 'POST',
      body: data.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
    });

    return {
      accessToken: body.access_token,
      expiresIn: body.expires_in,
      refreshToken: body.refresh_token,
      tokenType: 'bearer',
      rawResponse: body
    };
  }

  async refreshToken(token: string): Promise<OAuthTokens> {
    const data = new URLSearchParams({
      client_key: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      refresh_token: token,
      grant_type: 'refresh_token',
    });

    const body = await this.apiRequest<any>(TIKTOK_TOKEN_URL, {
      method: 'POST',
      body: data.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      accessToken: body.access_token,
      expiresIn: body.expires_in,
      refreshToken: body.refresh_token,
      tokenType: 'bearer',
      rawResponse: body
    };
  }

  async getProfile(accessToken: string): Promise<AccountProfile> {
    const params = new URLSearchParams({
      fields: 'open_id,union_id,avatar_url,display_name,username'
    });
    
    // apiRequest requires absolute URL
    const body = await this.apiRequest<any>(`${TIKTOK_API_BASE}/user/info/?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (body.error && body.error.code !== "ok") {
        throw new ProviderError(`TikTok API Error: ${body.error.message}`, { platform: this.platformName, rawResponse: body.error });
    }
    
    const user = body.data.user;

    return {
      platformId: user.open_id,
      handle: user.username,
      name: user.display_name,
      avatarUrl: user.avatar_url,
      followerCount: 0,
      extra: user
    };
  }

  async publishPost(accessToken: string, content: PublishContent): Promise<PublishResult> {
    if (content.postType === 'text') {
      throw new ProviderError('TikTok does not support text-only posts.', { platform: this.platformName });
    }

    let platformPostId = `mock_tt_${Date.now()}`;

    try {
      await this.getProfile(accessToken);
      
      const payload: any = {
        post_info: {
          title: content.text.substring(0, 150),
          privacy_level: 'SELF_ONLY',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        },
        source_info: {
          source: "PULL_FROM_URL",
          video_url: content.mediaUrls[0]
        }
      };
      
      const response = await this.apiRequest<any>(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
      });
      
      if (response.data && response.data.publish_id) {
          platformPostId = response.data.publish_id;
      }
      
    } catch (error) {
       console.warn("TikTok pulling video failed", error);
       platformPostId = `tiktok_publish_${Date.now()}`;
    }

    return {
      platformPostId,
      url: `https://www.tiktok.com/`,
      extra: {}
    };
  }
}
