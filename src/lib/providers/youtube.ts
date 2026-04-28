import { google } from 'googleapis';
import { SocialProvider } from './base';
import type { SocialProviderConfig } from './base';
import type {
  AccountProfile,
  AuthType,
  MediaType,
  OAuthTokens,
  PostType,
  PublishContent,
  PublishResult,
} from './types';
import { APIError } from './errors';

export class YouTubeProvider extends SocialProvider {
  private getOauth2Client() {
    return new google.auth.OAuth2(
      this.credentials.clientId,
      this.credentials.clientSecret,
      this.credentials.redirectUri || ''
    );
  }

  get platformName(): string {
    return 'youtube';
  }

  get authType(): AuthType {
    return 'oauth2';
  }

  get maxCaptionLength(): number {
    return 5000;
  }

  get supportedPostTypes(): PostType[] {
    return ['video'];
  }

  get supportedMediaTypes(): MediaType[] {
    return ['mp4', 'mov'];
  }

  get requiredScopes(): string[] {
    return [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ];
  }

  getAuthUrl(redirectUri: string, state: string): string {
    this.credentials.redirectUri = redirectUri;
    const oauth2Client = this.getOauth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.requiredScopes,
      state: state,
      prompt: 'consent',
    });
  }

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
    this.credentials.redirectUri = redirectUri;
    const oauth2Client = this.getOauth2Client();
    
    try {
      const { tokens } = await oauth2Client.getToken(code);
      return {
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || undefined,
        expiresIn: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : undefined,
        tokenType: tokens.token_type || 'Bearer',
        scope: tokens.scope || '',
        rawResponse: tokens as unknown as Record<string, unknown>,
      };
    } catch (error: any) {
      throw new APIError(`YouTube OAuth exchange failed: ${error.message}`, { platform: 'youtube', rawResponse: error });
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    const oauth2Client = this.getOauth2Client();
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      return {
        accessToken: credentials.access_token || '',
        refreshToken: credentials.refresh_token || refreshToken,
        expiresIn: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : undefined,
        tokenType: credentials.token_type || 'Bearer',
        scope: credentials.scope || '',
        rawResponse: credentials as unknown as Record<string, unknown>,
      };
    } catch (error: any) {
      throw new APIError(`YouTube token refresh failed: ${error.message}`, { platform: 'youtube', rawResponse: error });
    }
  }

  async getProfile(accessToken: string): Promise<AccountProfile> {
    const oauth2Client = this.getOauth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    try {
      const response = await youtube.channels.list({
        part: ['snippet', 'statistics'],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('No YouTube channel found for this account.');
      }

      const channel = response.data.items[0];
      return {
        platformId: channel.id || 'unknown',
        name: channel.snippet?.title || 'Unknown Channel',
        handle: channel.snippet?.customUrl || '',
        avatarUrl: channel.snippet?.thumbnails?.default?.url || '',
        followerCount: parseInt(channel.statistics?.subscriberCount || '0', 10),
        extra: { rawChannel: channel },
      };
    } catch (error: any) {
      throw new APIError(`YouTube profile fetch failed: ${error.message}`, { platform: 'youtube', rawResponse: error });
    }
  }

  async publishPost(accessToken: string, content: PublishContent): Promise<PublishResult> {
    const oauth2Client = this.getOauth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    if (!content.mediaUrls || content.mediaUrls.length === 0) {
      throw new Error('Video URL is required for YouTube upload.');
    }

    const videoUrl = content.mediaUrls[0];
    
    // In a real implementation, you would download the video from videoUrl 
    // and stream it to YouTube API since YouTube SDK requires a ReadStream.
    // However, since this is a high-level integration, we'll fetch the arrayBuffer.
    
    // NOTE: This approach works for small files but for very large video files
    // downloading and then passing as buffer might consume too much memory.
    
    const fetchResponse = await fetch(videoUrl);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch video from storage: ${fetchResponse.statusText}`);
    }
    
    // We can pass a standard Node.js Readable stream if running inside Node (Next.js server)
    // Next.js fetch doesn't expose node streams directly easily using standard fetch, 
    // we convert to Buffer/Blob or write to temp file. For now we use the Blob/Buffer approach.
    const arrayBuffer = await fetchResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { Readable } = require('stream');
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);

    const title = content.title || 'Untitled Video';
    const description = content.text || '';

    try {
      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: title,
            description: description,
          },
          status: {
            privacyStatus: 'private', // Enforced during testing per the implementation plan!
            selfDeclaredMadeForKids: false,
          },
        },
        media: {
          mimeType: 'video/mp4', // assuming mp4
          body: readable,
        },
      });

      return {
        platformPostId: response.data.id || '',
        url: `https://www.youtube.com/watch?v=${response.data.id}`,
        extra: { rawResponse: response.data },
      };
    } catch (error: any) {
      throw new APIError(`YouTube publish failed: ${error.message}`, { platform: 'youtube', rawResponse: error });
    }
  }
}
