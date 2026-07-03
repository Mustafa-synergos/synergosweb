'use client';

import { FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  headerBottom: number;
};

function SearchBannerDecorators() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 h-full w-[45%] max-w-[20%] "
        style={{
          backgroundImage: "url('/images/page-hero/banner-vector-right.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-full w-[45%] max-w-[20%] "
        style={{
          backgroundImage: "url('/images/page-hero/banner-vector-left.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
        }}
      />
    </>
  );
}

function SubmitArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SearchOverlay({ isOpen, onClose, headerBottom }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = inputRef.current?.value.trim();
    if (!query) return;

    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close search"
            className="fixed inset-0 z-40 bg-black/55"
            style={{ top: headerBottom }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed flex items-center left-0 right-0 z-[45] overflow-hidden min-h-[70vh] bg-[#262626]"
            style={{ top: 0 }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          >
            <SearchBannerDecorators />

            <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-8 sm:py-12 lg:px-0 lg:py-14">
              <form onSubmit={handleSubmit}>
                <div className="relative flex items-end gap-4 border-b border-white/80 pb-3 sm:gap-6 sm:pb-4">
                  <input
                    ref={inputRef}
                    type="search"
                    name="q"
                    placeholder="Search..."
                    autoComplete="off"
                    className="min-w-0 flex-1 border-0 bg-transparent text-[clamp(2rem,5vw,4.5rem)] font-bold leading-none text-white placeholder:text-white/35 focus:outline-none focus:ring-0"
                  />

                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#2A2A2A] transition-transform hover:scale-105 sm:mb-1.5 sm:h-10 sm:w-10"
                  >
                    <SubmitArrowIcon />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
