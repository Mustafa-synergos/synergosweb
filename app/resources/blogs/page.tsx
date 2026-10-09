import { permanentRedirect } from 'next/navigation';

// Canonical blogs listing now lives at /blogs — keep the old URL working.
export default function LegacyBlogsRedirect() {
  permanentRedirect('/blogs');
}
