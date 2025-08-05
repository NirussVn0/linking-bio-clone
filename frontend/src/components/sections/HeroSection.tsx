'use client';

import RotatingLogo from '@/components/three/RotatingLogo';
import AnimatedButton from '@/components/ui/AnimatedButton';
import anime from 'animejs';
import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
    });

    timeline
      .add({
        targets: titleRef.current,
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 1200,
      })
      .add({
        targets: subtitleRef.current,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
      }, '-=600')
      .add({
        targets: buttonRef.current,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
      }, '-=400');
  }, []);

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    anime({
      targets: e.currentTarget,
      scale: 1.05,
      duration: 200,
      easing: 'easeOutQuad',
    });
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    anime({
      targets: e.currentTarget,
      scale: 1,
      duration: 200,
      easing: 'easeOutQuad',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <RotatingLogo />
        </div>

        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 gradient-text opacity-0"
        >
          GUN.LOL
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto opacity-0"
        >
          Experience the future of interactive web design with stunning 3D visuals,
          smooth animations, and cutting-edge technology.
        </p>

        <div ref={buttonRef} className="opacity-0">
          <AnimatedButton size="lg">
            Enter Experience
          </AnimatedButton>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
