'use client';

import anime from 'animejs';
import { useEffect, useRef, useState } from 'react';

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    anime({
      targets: navRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo',
      delay: 500,
    });
  }, []);

  const handleLoginClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/discord`;
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 opacity-0 ${
        isScrolled ? 'glass backdrop-blur-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold gradient-text">
            GUN.LOL
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <button
            onClick={handleLoginClick}
            className="glass px-6 py-2 rounded-full text-sm font-semibold glow transition-all duration-300 hover:scale-105"
          >
            Login with Discord
          </button>
        </div>
      </div>
    </nav>
  );
}
