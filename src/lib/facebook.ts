/**
 * Facebook Graph API Service
 * Handles publishing, insights, and OAuth token management.
 *
 * ⚠️ DEPRECATED — Legacy exports for backward compatibility.
 * New code should import from '@/lib/providers' or '@/lib/providers/facebook'.
 * This file will be removed in a future refactor.
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

// ─── Types ────────────────────────────────────────────────────────

interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
}

interface FacebookPublishResult {
  id: string;
  post_id?: string;
}

interface FacebookInsights {
  impressions: number;
  reach: number;
  engaged_users: number;
  clicks: number;
  reactions: number;
  comments: number;
  shares: number;
}

// ─── OAuth ────────────────────────────────────────────────────────

/** Build Facebook OAuth dialog URL */
export function getOAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: redirectUri,
    scope: 'pages_manage_posts,pages_read_engagement,pages_read_user_content',
    response_type: 'code',
    state,
  });
  return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
}

/** Exchange authorization code → short-lived user token → long-lived token */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<FacebookTokenResponse> {
  // Step 1: code → short-lived token
  const shortRes = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?` +
      new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: redirectUri,
        code,
      }),
  );
  const shortData = await shortRes.json();

  if (shortData.error) {
    throw new Error(`FB OAuth error: ${shortData.error.message}`);
  }

  // Step 2: short-lived → long-lived token (60 days)
  const longRes = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        fb_exchange_token: shortData.access_token,
      }),
  );
  const longData = await longRes.json();

  if (longData.error) {
    throw new Error(`FB token exchange error: ${longData.error.message}`);
  }

  return longData;
}

/** Get list of Pages the user manages (with Page tokens) */
export async function getUserPages(
  userAccessToken: string,
): Promise<FacebookPage[]> {
  const res = await fetch(
    `${GRAPH_API_BASE}/me/accounts?` +
      new URLSearchParams({
        access_token: userAccessToken,
        fields: 'id,name,access_token,category',
      }),
  );
  const data = await res.json();

  if (data.error) {
    throw new Error(`FB Pages error: ${data.error.message}`);
  }

  return data.data || [];
}

// ─── Publishing ───────────────────────────────────────────────────

/** Publish a photo post to a Facebook Page */
export async function publishPhoto(
  pageId: string,
  pageToken: string,
  caption: string,
  imageUrl: string,
): Promise<FacebookPublishResult> {
  const res = await fetch(`${GRAPH_API_BASE}/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: caption,
      url: imageUrl,
      access_token: pageToken,
    }),
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(`FB publish error: ${data.error.message}`);
  }

  return data;
}

/** Publish a text-only post to a Facebook Page */
export async function publishText(
  pageId: string,
  pageToken: string,
  caption: string,
): Promise<FacebookPublishResult> {
  const res = await fetch(`${GRAPH_API_BASE}/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: caption,
      access_token: pageToken,
    }),
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(`FB publish error: ${data.error.message}`);
  }

  return data;
}

// ─── Insights ─────────────────────────────────────────────────────

/** Fetch insights for a published post */
export async function getPostInsights(
  postId: string,
  pageToken: string,
): Promise<FacebookInsights> {
  // Fetch post metrics
  const res = await fetch(
    `${GRAPH_API_BASE}/${postId}/insights?` +
      new URLSearchParams({
        metric:
          'post_impressions,post_reach,post_engaged_users,post_clicks,post_reactions_like_total',
        access_token: pageToken,
      }),
  );
  const data = await res.json();

  const metrics: FacebookInsights = {
    impressions: 0,
    reach: 0,
    engaged_users: 0,
    clicks: 0,
    reactions: 0,
    comments: 0,
    shares: 0,
  };

  if (data.data) {
    for (const item of data.data) {
      const value = item.values?.[0]?.value || 0;
      switch (item.name) {
        case 'post_impressions':
          metrics.impressions = value;
          break;
        case 'post_reach':
          metrics.reach = value;
          break;
        case 'post_engaged_users':
          metrics.engaged_users = value;
          break;
        case 'post_clicks':
          metrics.clicks = value;
          break;
        case 'post_reactions_like_total':
          metrics.reactions = value;
          break;
      }
    }
  }

  // Also fetch comments and shares count from the post itself
  const postRes = await fetch(
    `${GRAPH_API_BASE}/${postId}?` +
      new URLSearchParams({
        fields: 'comments.summary(true),shares',
        access_token: pageToken,
      }),
  );
  const postData = await postRes.json();

  metrics.comments = postData.comments?.summary?.total_count || 0;
  metrics.shares = postData.shares?.count || 0;

  return metrics;
}
