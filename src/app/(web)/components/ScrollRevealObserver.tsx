'use client';

import { useEffect } from 'react';

export default function ScrollRevealObserver() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Optionally unobserve after revealing if we only want it to animate once
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Initial check for elements
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // For elements added dynamically later or after route changes (though App router manages DOM well, it's safe to observe on mount)
    // Cleanup
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []); // Run once on mount

  return null; // This component does not render anything
}
