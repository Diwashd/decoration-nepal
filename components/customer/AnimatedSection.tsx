'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  immediate?: boolean; // Bypass scroll reveal - animate immediately on mount
}

const directionStyles = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  fade: '',
};

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  immediate = false,
}: AnimatedSectionProps) {
  const [immediateVisible, setImmediateVisible] = useState(false);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05, rootMargin: '100px 0px' });

  useEffect(() => {
    if (immediate) {
      // Start with a small delay to ensure the component has mounted
      const timer = setTimeout(() => {
        setImmediateVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [immediate]);

  const isVisibleResult = immediate ? immediateVisible : isVisible;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisibleResult
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${directionStyles[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
