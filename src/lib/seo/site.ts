/** Domain chính của website. biathaytu.com (và www) là domain phụ, chuyển hướng 301 về đây (next.config.js). */
export const DEFAULT_PUBLIC_BASE_URL = 'https://www.biathaytu.com.vn';

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

/** Domain phụ: nếu biến môi trường còn trỏ về đây thì vẫn dùng domain chính cho canonical, sitemap, schema. */
export const SECONDARY_HOSTNAMES = new Set(['biathaytu.com', 'www.biathaytu.com', 'biathaytu.com.vn']);

function isLocalHostname(hostname: string) {
  return LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith('.local');
}

export function getPublicBaseUrl(rawUrl = process.env.NEXT_PUBLIC_APP_URL) {
  if (!rawUrl) return DEFAULT_PUBLIC_BASE_URL;

  try {
    const url = new URL(rawUrl);
    if (isLocalHostname(url.hostname) || SECONDARY_HOSTNAMES.has(url.hostname)) return DEFAULT_PUBLIC_BASE_URL;

    url.pathname = '';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return DEFAULT_PUBLIC_BASE_URL;
  }
}

export function toAbsoluteSiteUrl(pathOrUrl: string | undefined | null, baseUrl = getPublicBaseUrl()) {
  if (!pathOrUrl) return baseUrl;

  try {
    const url = new URL(pathOrUrl);
    return url.toString();
  } catch {
    return new URL(pathOrUrl, `${baseUrl}/`).toString();
  }
}
