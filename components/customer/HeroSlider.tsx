'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { HeroSlide } from '@/lib/settings';

const fallbackSlide: HeroSlide = {
  id: 'fallback',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD7mPCb1hYUN9bXHaMlFuL39yVLR-caNZqd8JFmj99fkshd-ba9EgjRUIXAOzRdntLA_RdL8LVZGXyaD7D5SLTlyXfVTp6FImraIFKPrFAymMfSQ-aqNlQ0XTXMgzQtvvmJ0LJMRKr6EzqCVdvWJGt_aLaKZdahYiAfiflL8cwvnNjZrGInFVcAuA_hA_-DOt4cotPTtq_-pQIZ7ihE3Cfvc0oj5nVxXLlosEmA_G9dj2Baxw3QPh-',
  eyebrow: 'Bespoke Events in Nepal',
  heading: 'Elevate Events with',
  highlight: 'Extraordinary Experiences',
  description: 'Crafting turnkey event masterpieces with meticulous attention to luxury, exclusivity, and professional perfection.',
};

export default function HeroSlider({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<HeroSlide[]>([fallbackSlide]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      const response = await fetch('/api/site-settings', { cache: 'no-store' });
      const result = await response.json();
      if (response.ok && result.success && Array.isArray(result.heroSlides) && result.heroSlides.length > 0) {
        setSlides(result.heroSlides);
        setActive(0);
      }
    };
    void loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active] || fallbackSlide;

  return (
    <>
      <div className="absolute inset-0 z-0 transition-[background-image] duration-700" style={{ backgroundImage: `url('${slide.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>
      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center text-center gap-8 mt-20">
        <div className="inline-flex items-center gap-3 bg-surface-container-low/80 backdrop-blur-md px-6 py-2 rounded-full border-[0.5px] border-primary/30 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">{slide.eyebrow}</span>
        </div>
        <h1 className="font-display text-cream-contrast max-w-4xl tracking-tight leading-tight text-5xl md:text-7xl font-bold drop-shadow-2xl">
          {slide.heading} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-champagne-gold to-muted-gold italic pr-4">{slide.highlight}</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-light text-lg">{slide.description}</p>
        {children}
        {slides.length > 1 && (
          <div className="flex items-center gap-4" aria-label="Hero slides">
            <button type="button" aria-label="Previous slide" onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)} className="h-9 w-9 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">←</button>
            <div className="flex items-center gap-2">
            {slides.map((item, index) => (
              <button key={item.id} type="button" aria-label={`Show slide ${index + 1}`} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${index === active ? 'w-8 bg-primary' : 'w-2 bg-on-surface-variant/50'}`} />
            ))}
            </div>
            <button type="button" aria-label="Next slide" onClick={() => setActive((current) => (current + 1) % slides.length)} className="h-9 w-9 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">→</button>
          </div>
        )}
      </div>
    </>
  );
}
