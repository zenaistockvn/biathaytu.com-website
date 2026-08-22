'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureTrafficAttribution, trackContactEvent } from '@/lib/leadClient';

export default function ContactTracking() {
  const pathname = usePathname();

  useEffect(() => {
    captureTrafficAttribution();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        trackContactEvent('contact_phone_click');
        return;
      }

      if (/https?:\/\/(?:www\.)?zalo\.me\//i.test(href)) {
        trackContactEvent('contact_zalo_click');
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
