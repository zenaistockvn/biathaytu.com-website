'use client';

import React, { useEffect } from 'react';

// Declare custom properties on window object for Facebook SDK
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

export const FB_PAGE_ID = process.env.NEXT_PUBLIC_FB_PAGE_ID;

export default function FacebookMessengerChat() {
  useEffect(() => {
    if (!FB_PAGE_ID) {
      console.warn('⚠️ Meta Messenger Chat: Missing NEXT_PUBLIC_FB_PAGE_ID in environment variables.');
      return;
    }

    // 1. Inject fb-root div if not exists
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }

    // 2. Inject fb-customer-chat div if not exists
    let chatbox = document.getElementById('fb-customer-chat');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.id = 'fb-customer-chat';
      chatbox.className = 'fb-customerchat';
      document.body.appendChild(chatbox);
    }

    // Set page ID and attribution attributes required by FB Customer Chat
    chatbox.setAttribute('page_id', FB_PAGE_ID);
    chatbox.setAttribute('attribution', 'biz_inbox');

    // 3. Initialize FB SDK once async loaded
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: 'v18.0',
      });
    };

    // 4. Inject Facebook SDK script tag if not exists
    const scriptId = 'facebook-jssdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script') as HTMLScriptElement;
      script.id = scriptId;
      script.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else {
      // If script is already loaded (on route changes), re-parse XFBML to show the widget
      try {
        if (window.FB && window.FB.XFBML) {
          window.FB.XFBML.parse();
        }
      } catch (e) {
        console.error('Failed to parse XFBML:', e);
      }
    }
  }, []);

  if (!FB_PAGE_ID) return null;

  return null; // The SDK will render inside the injected div at the end of the body
}
