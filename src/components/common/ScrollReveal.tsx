'use client';

import { useEffect, useRef, useState, type ReactNode, type HTMLAttributes } from 'react';

export interface ScrollRevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'main';
  className?: string;
  delay?: number; // ms delay
  animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'fade-side';
  threshold?: number;
}

export function ScrollReveal({
  children,
  as: Component = 'div',
  className = '',
  delay = 0,
  animation = 'fade-up',
  threshold = 0.12,
  style: userStyle,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If browser doesn't support IntersectionObserver or reduced-motion is active
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (ref.current) observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const target = ref.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [threshold]);

  const classes = [
    'reveal-item',
    `reveal-${animation}`,
    isVisible ? 'is-revealed' : '',
    className,
  ].filter(Boolean).join(' ');

  const style = {
    ...(userStyle || {}),
    ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
  };

  const Tag = Component as 'div';

  return (
    <Tag
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      className={classes}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
