import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface UseScrollAnimationOptions {
  threshold?: number;
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight' | 'rotateIn';
  delay?: number;
  duration?: number;
}

export function useScrollAnimation({
  threshold = 0.3,
  animation = 'fadeInUp',
  delay = 0,
  duration = 800,
}: UseScrollAnimationOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let animationConfig: any = {
              targets: element,
              duration,
              delay,
              easing: 'easeOutExpo',
            };

            switch (animation) {
              case 'fadeInUp':
                animationConfig = {
                  ...animationConfig,
                  translateY: [50, 0],
                  opacity: [0, 1],
                };
                break;
              case 'fadeInScale':
                animationConfig = {
                  ...animationConfig,
                  scale: [0.8, 1],
                  opacity: [0, 1],
                };
                break;
              case 'slideInLeft':
                animationConfig = {
                  ...animationConfig,
                  translateX: [-100, 0],
                  opacity: [0, 1],
                };
                break;
              case 'slideInRight':
                animationConfig = {
                  ...animationConfig,
                  translateX: [100, 0],
                  opacity: [0, 1],
                };
                break;
              case 'rotateIn':
                animationConfig = {
                  ...animationConfig,
                  rotate: [180, 0],
                  opacity: [0, 1],
                };
                break;
            }

            anime(animationConfig);
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, animation, delay, duration]);

  return elementRef;
}
