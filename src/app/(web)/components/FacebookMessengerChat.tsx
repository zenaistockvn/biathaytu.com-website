'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getCookieConsentPreferences, CookiePreferences } from './CookieConsent';

// Declare custom properties on window object for Facebook SDK
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: { init: (o: Record<string, unknown>) => void; XFBML?: { parse: () => void } };
  }
}

const PAGE_ID_TIEPKHACH = process.env.NEXT_PUBLIC_FB_PAGE_ID_TIEPKHACH || '1106668052525470';
const PAGE_ID_BITBURGER = process.env.NEXT_PUBLIC_FB_PAGE_ID_BITBURGER || '1042222495647480';

export default function FacebookMessengerChat() {
  const pathname = usePathname();
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

  const isBitburger = pathname.includes('bitburger');
  const currentPageId = isBitburger ? PAGE_ID_BITBURGER : PAGE_ID_TIEPKHACH;

  useEffect(() => {
    if (!hasMarketingConsent || !currentPageId) {
      // Clean up SDK DOM elements if consent is revoked
      const fbRoot = document.getElementById('fb-root');
      if (fbRoot) fbRoot.remove();

      const chatbox = document.getElementById('fb-customer-chat');
      if (chatbox) chatbox.remove();

      const script = document.getElementById('facebook-jssdk');
      if (script) script.remove();

      const iframes = document.querySelectorAll('iframe[name^="fbc_"]');
      iframes.forEach((el) => el.remove());

      return;
    }

    // 2. Inject or update fb-root div
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }

    // 3. Inject or update fb-customer-chat div
    let chatbox = document.getElementById('fb-customer-chat');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.id = 'fb-customer-chat';
      chatbox.className = 'fb-customerchat';
      document.body.appendChild(chatbox);
    }

    // Update Page ID dynamically on the chat container
    chatbox.setAttribute('page_id', currentPageId);
    chatbox.setAttribute('attribution', 'biz_inbox');

    // 4. Initialize Facebook SDK
    window.fbAsyncInit = function () {
      window.FB?.init({
        xfbml: true,
        version: 'v18.0',
      });
    };

    // 5. Load or Re-parse SDK
    const scriptId = 'facebook-jssdk';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script') as HTMLScriptElement;
      script.id = scriptId;
      script.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    } else {
      try {
        if (window.FB && window.FB.XFBML) {
          const iframe = document.querySelector('iframe[name^="fbc_"]') as HTMLIFrameElement;
          if (iframe) iframe.style.opacity = '0';
          
          window.FB.XFBML.parse();
        }
      } catch (e) {
        console.error('Failed to parse XFBML for Messenger:', e);
      }
    }
  }, [currentPageId, hasMarketingConsent]);

  return null;
}
