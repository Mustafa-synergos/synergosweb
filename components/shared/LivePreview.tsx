'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const strapiOrigin =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ??
  'http://localhost:1337';

export default function LivePreview() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (message: MessageEvent) => {
      if (message.origin !== strapiOrigin) {
        return;
      }

      const data = message.data as { type?: string; payload?: { script?: string } };

      if (data?.type === 'strapiUpdate') {
        router.refresh();
        return;
      }

      if (data?.type === 'strapiScript' && data.payload?.script) {
        const script = document.createElement('script');
        script.textContent = data.payload.script;
        document.head.appendChild(script);
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent?.postMessage({ type: 'previewReady' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return null;
}
