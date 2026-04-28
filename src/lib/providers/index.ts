/**
 * Provider Registry — factory function to get the correct provider.
 * Usage: const provider = getProvider('facebook');
 */

import type { SocialProvider, SocialProviderConfig } from './base';
import { FacebookProvider } from './facebook';
import { InstagramProvider } from './instagram';
import { TikTokProvider } from './tiktok';
import { LinkedInProvider } from './linkedin';
import { YouTubeProvider } from './youtube';

// Re-export everything for convenient imports
export { SocialProvider } from './base';
export type { SocialProviderConfig } from './base';
export { FacebookProvider } from './facebook';
export { InstagramProvider } from './instagram';
export { TikTokProvider } from './tiktok';
export { LinkedInProvider } from './linkedin';
export { YouTubeProvider } from './youtube';
export * from './types';
export * from './errors';

export type SupportedPlatform = 'facebook' | 'facebook_story' | 'instagram' | 'tiktok' | 'linkedin' | 'youtube';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PROVIDERS: Record<SupportedPlatform, new (...args: any[]) => SocialProvider> = {
  facebook: FacebookProvider,
  facebook_story: FacebookProvider,
  instagram: InstagramProvider,
  tiktok: TikTokProvider,
  linkedin: LinkedInProvider,
  youtube: YouTubeProvider,
};

const DEFAULT_CREDENTIALS: SocialProviderConfig = {
  clientId: process.env.YOUTUBE_CLIENT_ID || '',
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
};

/** Get a provider instance by platform name */
export function getProvider(platform: string): SocialProvider {
  const ProviderClass = PROVIDERS[platform as SupportedPlatform];
  if (!ProviderClass) {
    throw new Error(
      `Unsupported platform: ${platform}. Supported: ${Object.keys(PROVIDERS).join(', ')}`,
    );
  }
  return new ProviderClass(DEFAULT_CREDENTIALS);
}

/** Check if a platform is supported */
export function isPlatformSupported(platform: string): platform is SupportedPlatform {
  return platform in PROVIDERS;
}

/** Get list of all supported platforms */
export function getSupportedPlatforms(): string[] {
  return Object.keys(PROVIDERS);
}
