'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { categories, clients, additionalClients, type Client } from '@/data/clients';
import InteractiveDots from '@/components/home/InteractiveDots';

function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-[12px] font-light text-white/50 transition hover:border-white/30 hover:text-white/80 sm:px-5 sm:py-2.5 sm:text-[13px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || 'All category'}</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 text-[11px] leading-none">
          {open ? '×' : '+'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-auto top-full z-30 mt-2 max-h-[320px] min-w-[190px] overflow-y-auto rounded-lg border border-white/10 bg-[#1B1B1B] py-1 shadow-2xl sm:left-auto sm:right-0"
            role="listbox"
            aria-label="Filter clients by category"
          >
            {categories.map((category) => (
              <li
                key={category}
                role="option"
                aria-selected={value === category}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange(category);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[13px] text-white transition hover:text-[#ff202a] ${
                    value === category ? 'font-medium text-[#ff202a]' : ''
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <article
      className="group relative mx-auto flex h-[92.42px] w-[171.55px] items-center justify-center overflow-hidden rounded-[20px] bg-[#1B1B1B] p-6 transition-colors duration-300 hover:bg-white sm:h-[96.15px] sm:w-[178.48px] lg:h-[180px] lg:w-full"
      aria-label={client.name}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/[0.04] to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0" />

      <div className="relative z-10 h-full w-full max-w-[180px]">
        <Image
          src={client.defaultImage}
          alt={client.name}
          fill
          className="object-contain opacity-100 transition-opacity duration-300 group-hover:opacity-0"
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 160px, 140px"
        />
        <Image
          src={client.hoverImage}
          alt={`${client.name} hover`}
          fill
          className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 160px, 140px"
        />
      </div>
    </article>
  );
}

export default function ClientListing() {
  const [category, setCategory] = useState('All');
  const [visibleClients, setVisibleClients] = useState<Client[]>(clients);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredClients =
    category === 'All'
      ? visibleClients
      : visibleClients.filter((client) => client.category === category);

  const handleLoadMore = () => {
    if (loaded || additionalClients.length === 0) {
      setLoaded(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setVisibleClients((prev) => [...prev, ...additionalClients]);
      setLoaded(true);
      setIsLoading(false);
    }, 400);
  };

  return (
    <section className="relative overflow-hidden bg-[#050505] py-16 text-white sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <InteractiveDots variant="dark" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-0">
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
          <div className="max-w-2xl">
            <h2 className="mb-6 font-['clother',sans-serif] text-[38px] font-bold uppercase leading-[40px] tracking-normal text-white sm:text-[80px] sm:leading-[82px] lg:text-[100px] lg:leading-[100px]">
              TRUSTED BY
            </h2>
            <p className="max-w-[720px] font-['clother',sans-serif] text-[16px] font-normal leading-[24px] tracking-normal text-[#AEAEAE] sm:text-[18px] sm:leading-[26px]">
              Here are some happy customers that we have worked with and will
              continue to have a relationship with for the years to come. We
              continue to learn from each of these relationships and have paved
              a path in the digital media landscape.
            </p>
          </div>

          <CategoryFilter
            categories={categories}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8"
          role="list"
          aria-label="Clients"
        >
          {filteredClients.map((client) => (
            <div key={client.id} role="listitem">
              <ClientCard client={client} />
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-5 sm:mt-16">
          <div className="h-px flex-1 bg-white/15" />
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading || loaded}
            className="flex shrink-0 items-center gap-2 text-[13px] font-light text-white/50 underline underline-offset-4 transition hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[14px]"
          >
            {isLoading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white/70" />
                Loading...
              </>
            ) : (
              <>
                <svg
                  width="23"
                  height="20"
                  viewBox="0 0 23 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M22.999 14.9799C23.0391 12.3306 21.8427 10.3362 19.5393 9.21604C17.9042 8.39369 15.433 7.69345 11.996 7.08108C8.86914 6.52329 6.25016 5.69261 4.20842 4.61218C2.05086 3.49013 0.672982 1.98973 0 0V16.3554C0 18.3683 1.60859 20 3.59289 20H19.0769C19.967 19.8659 20.7302 19.5578 21.3494 19.074C22.4163 18.2915 22.9771 16.9095 22.9981 14.9799H22.999Z"
                    fill="#FF0000"
                  />
                </svg>
                Load More
              </>
            )}
          </button>
          <div className="h-px flex-1 bg-white/15" />
        </div>
      </div>
    </section>
  );
}
