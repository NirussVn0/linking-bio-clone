'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="opacity-0">
      {children}
    </div>
  );
}
