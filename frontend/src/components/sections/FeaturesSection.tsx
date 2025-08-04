'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

const features = [
  {
    title: '3D Visuals',
    description: 'Immersive Three.js powered 3D graphics that respond to user interaction',
    icon: '🎯',
  },
  {
    title: 'Smooth Animations',
    description: 'Buttery smooth micro-interactions powered by Anime.js',
    icon: '⚡',
  },
  {
    title: 'Modern Design',
    description: 'Clean, bold aesthetic inspired by the latest design trends',
    icon: '🎨',
  },
  {
    title: 'Performance',
    description: 'Optimized for 60fps performance across all modern devices',
    icon: '🚀',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: cardsRef.current,
              translateY: [100, 0],
              opacity: [0, 1],
              delay: anime.stagger(200),
              duration: 800,
              easing: 'easeOutExpo',
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardHover = (index: number) => {
    anime({
      targets: cardsRef.current[index],
      scale: 1.05,
      rotateY: 5,
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleCardLeave = (index: number) => {
    anime({
      targets: cardsRef.current[index],
      scale: 1,
      rotateY: 0,
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 gradient-text">
          Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="glass p-6 rounded-xl opacity-0 cursor-pointer"
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={() => handleCardLeave(index)}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
