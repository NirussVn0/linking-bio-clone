'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeline = anime.timeline({
              easing: 'easeOutExpo',
            });

            timeline
              .add({
                targets: titleRef.current,
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 800,
              })
              .add({
                targets: buttonRef.current,
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 600,
              }, '-=400');
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleButtonClick = () => {
    anime({
      targets: buttonRef.current,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeOutQuad',
    });
  };

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold mb-8 gradient-text opacity-0"
        >
          Ready to Experience the Future?
        </h2>
        
        <button
          ref={buttonRef}
          className="glass px-12 py-6 rounded-full text-xl font-semibold glow transition-all duration-300 opacity-0"
          onClick={handleButtonClick}
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
}
