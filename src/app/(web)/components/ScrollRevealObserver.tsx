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
      gsap.set(elements, {
        autoAlpha: 1,
        y: 0,
        clearProps: 'willChange',
      });
      return;
    }

    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 28,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once: true,
          },
        }
      );
    });
  }, []);

  return null;
}
