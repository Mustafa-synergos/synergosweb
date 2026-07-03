'use client';

import { useRef } from 'react';
import InteractiveDots from '@/components/home/InteractiveDots';

type DotsSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function DotsSection({ children, className = '' }: DotsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <InteractiveDots variant="dark" containerRef={sectionRef} />
      {children}
    </section>
  );
}
