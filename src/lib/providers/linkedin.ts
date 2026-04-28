import { SocialProvider, SocialProviderConfig } from './base';
import type { PublishContent, PublishResult, OAuthTokens, AccountProfile, AuthType, PostType, MediaType } from './types';
import { ProviderError } from './errors';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

export class LinkedInProvider extends SocialProvider {
  constructor() {
    super({
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    });
  }

  get platformName(): string { return 'LinkedIn'; }
  get authType(): AuthType { return 'oauth2'; }
  get maxCaptionLength(): number { return 3000; }
  get supportedPostTypes(): PostType[] { return ['text', 'image', 'video']; }
  get supportedMediaTypes(): MediaType[] { return ['jpeg', 'png', 'mp4']; }
  get requiredScopes(): string[] { return ['w_member_social', 'r_liteprofile', 'r_emailaddress']; }

  getAuthUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.credentials.clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: this.requiredScopes.join(' '),
    });
    return `${LINKEDIN_AUTH_BASE}?${params.toString()}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
    const data = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
    });

    const body = await this.apiRequest<any>(LINKEDIN_TOKEN_URL, {
      method: 'POST',
      body: data.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      accessToken: body.access_token,
      expiresIn: body.expires_in,
      tokenType: 'bearer',
      rawResponse: body
    };
  }

  async refreshToken(token: string): Promise<OAuthTokens> {
    return {
      accessToken: token, // LinkedIn tokens are long-lived, refresh not strictly supported in standard lite
      expiresIn: 60 * 24 * 60 * 60,
      tokenType: 'bearer',
      rawResponse: {}
    }
  }

  async getProfile(accessToken: string): Promise<AccountProfile> {
    const body = await this.apiRequest<any>(`${LINKEDIN_API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    return {
      platformId: body.id,
      name: `${body.localizedFirstName} ${body.localizedLastName}`.trim(),
      followerCount: 0,
      extra: body
    };
  }

  async publishPost(accessToken: string, content: PublishContent): Promise<PublishResult> {
    const author = `urn:li:person:${content.extra?.pageId}`; 
    
    if (!content.extra?.pageId) {
      throw new ProviderError('Missing LinkedIn User ID (pageId) in content.extra', { platform: this.platformName });
    }

    const payload: any = {
      author: author,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: "NONE",
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    if (content.mediaUrls.length > 0 && content.postType === 'image') {
       payload.specificContent["com.linkedin.ugc.ShareContent"].shareMediaCategory = "ARTICLE";
       payload.specificContent["com.linkedin.ugc.ShareContent"].media = [
         {
           status: "READY",
           originalUrl: content.mediaUrls[0],
         }
       ];
    }

    const response = await this.apiRequest<any>(`${LINKEDIN_API_BASE}/ugcPosts`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
      }
    });

    return {
      platformPostId: response.id,
      url: `https://www.linkedin.com/feed/update/${response.id}`,
      extra: response
    };
  }
}
