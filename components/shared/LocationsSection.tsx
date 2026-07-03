import Image from 'next/image';

import { getMediaUrl } from '@/lib/strapi-media';
import {
  DEFAULT_LOCATIONS_SECTION,
  type ContactLocationItem,
  type LocationsSectionData,
} from '@/types/contact-sections';

type LocationsSectionProps = {
  data?: LocationsSectionData | null;
};

function LocationColumn({ location }: { location: ContactLocationItem }) {
  const addressLines = location.Address.split('\n').filter(Boolean);

  return (
    <div>
      <h3 className="mb-5 text-[13px] font-normal uppercase tracking-[0.12em] text-white">
        {location.Title}
      </h3>

      <div className="space-y-5">
        <div className="flex gap-3 items-start">
          <Image
            src="/images/contact/location-1.svg"
            alt=""
            width={18}
            height={18}
            className="mt-1 shrink-0"
          />
          <p className="text-[14px] font-light leading-[1.65] text-white/90 sm:text-[15px]">
            {addressLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < addressLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {location.Email && (
          <div className="flex items-center gap-3">
            <Image
              src="/images/contact/email-1.svg"
              alt=""
              width={18}
              height={18}
              className="shrink-0"
            />
            <a
              href={`mailto:${location.Email}`}
              className="text-[14px] font-light text-white/90 transition-colors hover:text-white sm:text-[15px]"
            >
              {location.Email}
            </a>
          </div>
        )}

        {location.Phone && (
          <div className="flex items-center gap-3">
            <Image
              src="/images/contact/Phone-number-1.svg"
              alt=""
              width={18}
              height={18}
              className="shrink-0"
            />
            <a
              href={`tel:${location.Phone.replace(/\s+/g, '')}`}
              className="text-[14px] font-light text-white/90 transition-colors hover:text-white sm:text-[15px]"
            >
              {location.Phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocationsSection({ data }: LocationsSectionProps) {
  const content = data ?? DEFAULT_LOCATIONS_SECTION;
  const locations = content.Locations ?? [];
  const mapImageUrl = getMediaUrl(content.MapImage);
  const mapEmbedUrl = content.MapEmbedUrl;

  return (
    <section className="bg-[#050505] pb-16 pt-8 text-white sm:pb-20 sm:pt-10 lg:pb-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-0">
        {content.Label && (
          <p className="mb-3 text-[13px] font-normal uppercase tracking-[0.2em] text-[#FF0000]">
            {content.Label}
          </p>
        )}

        <h2 className="type-h2 mb-10 font-normal text-white sm:mb-12">
          {content.Heading}
        </h2>

        <div className="overflow-hidden rounded-[20px] sm:rounded-[24px]">
          <div className="bg-[#FF0000] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              {locations.map((location, index) => (
                <LocationColumn
                  key={location.id ?? `${location.Title}-${index}`}
                  location={location}
                />
              ))}
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full bg-[#1a1a1a] sm:aspect-[21/9]">
            {mapImageUrl ? (
              <Image
                src={mapImageUrl}
                alt="Office location map"
                fill
                className="object-cover"
                unoptimized={mapImageUrl.startsWith('http')}
              />
            ) : mapEmbedUrl ? (
              <iframe
                title="Office location map"
                src={mapEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
