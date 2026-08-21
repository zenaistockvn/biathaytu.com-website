'use client';

import { useLayoutEffect } from 'react';

export default function MobileUxEnhancer() {
  useLayoutEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    if (!isMobile) return;

    const blurAgeGateAutofocus = () => {
      const active = document.activeElement as HTMLElement | null;
      if (active?.id === 'age-gate-full-name') {
        active.blur();
      }
    };

    blurAgeGateAutofocus();
    const frame = window.requestAnimationFrame(blurAgeGateAutofocus);

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(blurAgeGateAutofocus);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-age-gate'],
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
