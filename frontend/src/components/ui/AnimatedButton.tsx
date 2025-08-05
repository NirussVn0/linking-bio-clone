'use client';

import { buttonClick, buttonHover, buttonLeave } from '@/lib/animations';
import { useRef } from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const baseClasses = 'font-semibold rounded-full transition-all duration-300 cursor-pointer';

  const variantClasses = {
    primary: 'glass glow text-white',
    secondary: 'bg-white/10 text-white border border-white/20',
    ghost: 'text-white hover:bg-white/10',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      buttonHover(buttonRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonLeave(buttonRef.current);
    }
  };

  const handleClick = () => {
    if (buttonRef.current) {
      buttonClick(buttonRef.current);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
