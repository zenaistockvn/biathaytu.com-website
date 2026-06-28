'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRevealObserver() {
  useGSAP(() => {
    const elements = gsap.utils.toArray<HTMLElement>('.reveal-on-scroll');
    if (elements.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      elements.forEach((el) => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const triggers: ScrollTrigger[] = [];

    elements.forEach((element) => {
      const st = ScrollTrigger.create({
        trigger: element,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          element.classList.add('reveal-visible');
        },
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return null;
}


