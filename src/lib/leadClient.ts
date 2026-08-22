'use client';

import { STORAGE_KEYS } from '@/constants/compliance';

export type ContactEventName =
  | 'contact_zalo_click'
  | 'contact_phone_click'
  | 'lead_form_submit';

export interface TrafficContext {
  page_path: string;
  product_slug: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
}

export interface LeadSubmissionInput {
  formKind: 'product_consultation' | 'footer_price_list';
  name: string;
  phone: string;
  need?: string;
  note?: string;
  productName?: string;
  productSlug?: string;
  website?: string;
}

interface StoredAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

const ATTRIBUTION_STORAGE_KEY = 'gt_traffic_attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function inferProductSlug(pathname: string): string | null {
  const match = pathname.match(/^\/san-pham\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function readCurrentAttribution(): StoredAttribution {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const result: StoredAttribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) result[key] = value;
  }

  if (document.referrer) result.referrer = document.referrer;
  return result;
}

function readStoredAttribution(): StoredAttribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAttribution) : {};
  } catch {
    return {};
  }
}

export function captureTrafficAttribution(): void {
  if (typeof window === 'undefined') return;

  const current = readCurrentAttribution();
  const hasCurrentUtm = UTM_KEYS.some((key) => Boolean(current[key]));
  const stored = readStoredAttribution();

  if (!hasCurrentUtm && Object.keys(stored).length > 0) return;

  const next: StoredAttribution = {
    ...stored,
    ...current,
    referrer: stored.referrer || current.referrer,
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Attribution is best-effort; lead submission must still work without sessionStorage.
  }
}

export function getTrafficContext(explicitProductSlug?: string): TrafficContext {
  if (typeof window === 'undefined') {
    return {
      page_path: '/',
      product_slug: explicitProductSlug || null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      referrer: null,
    };
  }

  captureTrafficAttribution();
  const current = readCurrentAttribution();
  const stored = readStoredAttribution();
  const merged = { ...stored, ...current };

  return {
    page_path: window.location.pathname,
    product_slug: explicitProductSlug || inferProductSlug(window.location.pathname),
    utm_source: merged.utm_source || null,
    utm_medium: merged.utm_medium || null,
    utm_campaign: merged.utm_campaign || null,
    utm_content: merged.utm_content || null,
    utm_term: merged.utm_term || null,
    referrer: merged.referrer || document.referrer || null,
  };
}

function getConsentFlags(): { analytics: boolean; marketing: boolean } {
  if (typeof window === 'undefined') return { analytics: false, marketing: false };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    if (!raw) return { analytics: false, marketing: false };
    const parsed = JSON.parse(raw) as { analytics?: boolean; marketing?: boolean };
    return {
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return { analytics: false, marketing: false };
  }
}

export function trackContactEvent(
  eventName: ContactEventName,
  options: { productSlug?: string; formKind?: string } = {},
): void {
  if (typeof window === 'undefined') return;

  const traffic = getTrafficContext(options.productSlug);
  const params = {
    page_path: traffic.page_path,
    product_slug: traffic.product_slug,
    form_kind: options.formKind || undefined,
    utm_source: traffic.utm_source,
    utm_medium: traffic.utm_medium,
    utm_campaign: traffic.utm_campaign,
  };
  const consent = getConsentFlags();
  const browserWindow = window as typeof window & {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (...args: unknown[]) => void;
  };

  if (consent.analytics && Array.isArray(browserWindow.dataLayer)) {
    browserWindow.dataLayer.push({ event: eventName, ...params });
  }

  if (consent.marketing && browserWindow.fbq) {
    browserWindow.fbq('trackCustom', eventName, params);
  }
}

export async function submitLead(input: LeadSubmissionInput): Promise<void> {
  const traffic = getTrafficContext(input.productSlug);
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      ...traffic,
    }),
  });

  if (!response.ok) {
    let message = 'Không thể gửi thông tin lúc này. Vui lòng thử lại.';
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // Keep the generic message when the response is not JSON.
    }
    throw new Error(message);
  }
}
