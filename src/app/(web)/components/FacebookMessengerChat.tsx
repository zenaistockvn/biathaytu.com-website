'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Declare custom properties on window object for Facebook SDK
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

const PAGE_ID_TIEPKHACH = process.env.NEXT_PUBLIC_FB_PAGE_ID_TIEPKHACH || '1106668052525470';
const PAGE_ID_BITBURGER = process.env.NEXT_PUBLIC_FB_PAGE_ID_BITBURGER || '1042222495647480';

export default function FacebookMessengerChat() {
  const pathname = usePathname();
  const [currentPageId, setCurrentPageId] = useState('');

  useEffect(() => {
    // 1. Determine target Page ID based on URL path
    const isBitburger = pathname.includes('bitburger');
    const targetPageId = isBitburger ? PAGE_ID_BITBURGER : PAGE_ID_TIEPKHACH;
    setCurrentPageId(targetPageId);
  }, [pathname]);

  useEffect(() => {
    if (!currentPageId) return;

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
      window.FB.init({
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
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else {
      // Re-parse XFBML to apply the dynamically changed page_id
      try {
        if (window.FB && window.FB.XFBML) {
          // Temporarily hide chat widget during reload to prevent flashing
          const iframe = document.querySelector('iframe[name^="fbc_"]') as HTMLIFrameElement;
          if (iframe) iframe.style.opacity = '0';
          
          window.FB.XFBML.parse();
        }
      } catch (e) {
        console.error('Failed to parse XFBML for Messenger:', e);
      }
    }
  }, [currentPageId]);

  return null;
}
