'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PreviewBanner() {
  const pathname = usePathname();
  const exitHref = `/preview/exit?path=${encodeURIComponent(pathname)}`;

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-amber-500/40 bg-amber-500/15 px-5 py-2 text-center text-sm text-amber-100 backdrop-blur-sm">
      Preview mode — viewing draft content.{' '}
      <Link href={exitHref} prefetch={false} className="underline hover:text-white">
        Exit preview
      </Link>
    </div>
  );
}
