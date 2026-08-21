'use client';

import { useEffect, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { getCookieConsentPreferences, CookiePreferences } from './CookieConsent';

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: { init: (o: Record<string, unknown>) => void; XFBML?: { parse: () => void } };
  }
}

const BRAND_PAGE_ID = BRAND.socialLinks.messenger.split('/').filter(Boolean).pop() || '';

export default function FacebookMessengerChat() {
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const prefs = getCookieConsentPreferences();
      setHasMarketingConsent(Boolean(prefs?.marketing));
    };

    checkConsent();

    const handleConsentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      setHasMarketingConsent(Boolean(customEvent.detail?.marketing));
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  useEffect(() => {
    if (!hasMarketingConsent || !BRAND_PAGE_ID) {
      document.getElementById('fb-root')?.remove();
      document.getElementById('fb-customer-chat')?.remove();
      document.getElementById('facebook-jssdk')?.remove();
      document.querySelectorAll('iframe[name^="fbc_"]').forEach((el) => el.remove());
      return;
    }

    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }

    let chatbox = document.getElementById('fb-customer-chat');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.id = 'fb-customer-chat';
      chatbox.className = 'fb-customerchat';
      document.body.appendChild(chatbox);
    }

    chatbox.setAttribute('page_id', BRAND_PAGE_ID);
    chatbox.setAttribute('attribution', 'biz_inbox');

    window.fbAsyncInit = function () {
      window.FB?.init({ xfbml: true, version: 'v18.0' });
    };

    const scriptId = 'facebook-jssdk';
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const script = document.createElement('script') as HTMLScriptElement;
      script.id = scriptId;
      script.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
      document.getElementsByTagName('script')[0]?.parentNode?.insertBefore(
        script,
        document.getElementsByTagName('script')[0],
      );
    } else {
      try {
        window.FB?.XFBML?.parse();
      } catch (error) {
        console.error('Failed to parse XFBML for Messenger:', error);
      }
    }
  }, [hasMarketingConsent]);

  return null;
}
