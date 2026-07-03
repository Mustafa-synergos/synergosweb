'use client';

import PremiumCTA from '@/components/home/PremiumCTA';
import { CTAProps, resolveCTAProps } from '@/types/cta';

export type { CTAData, CTAProps } from '@/types/cta';

export default function CTA({
  data,
  displayText,
  hoverText,
  link,
  isOpenNewTab,
  magnetic,
  onClick,
  className,
}: CTAProps) {
  const resolved = resolveCTAProps({
    data,
    displayText,
    hoverText,
    link,
    isOpenNewTab,
    magnetic,
  });

  return (
    <PremiumCTA
      title={resolved.title}
      hoverTitle={resolved.hoverTitle}
      href={resolved.href}
      openInNewTab={resolved.openInNewTab}
      magnetic={resolved.magnetic}
      onClick={onClick}
      className={className}
    />
  );
}
