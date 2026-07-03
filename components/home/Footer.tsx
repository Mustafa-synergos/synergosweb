import Link from 'next/link';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from 'react-icons/fa6';

import InteractiveDots from './InteractiveDots';
import DecorativeVectorImage from '@/components/shared/DecorativeVectorImage';
import { getFooter } from '@/lib/strapi';
import { getMediaUrl } from '@/lib/strapi-media';
import type { FooterData, FooterLink, FooterLinkColumn } from '@/types/footer';
import { DEFAULT_FOOTER_DATA } from '@/types/footer';

const SOCIAL_ICONS: Record<string, IconType> = {
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
};

const linkClassName =
  'font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap';

const headingClassName =
  'font-[clother] font-normal not-italic text-[18px] sm:text-[22px] leading-[100%] tracking-normal text-white/90 mb-4 sm:mb-6 uppercase';

function FooterTextLink({ link }: { link: FooterLink }) {
  return (
    <Link
      href={link.Link || '#'}
      target={link.IsOpenNewTab ? '_blank' : undefined}
      rel={link.IsOpenNewTab ? 'noopener noreferrer' : undefined}
      className={linkClassName}
    >
      {link.DisplayText}
    </Link>
  );
}

function FooterSocialLink({ link }: { link: FooterLink }) {
  const Icon =
    SOCIAL_ICONS[link.DisplayText.trim().toLowerCase()] ?? FaLinkedinIn;

  return (
    <Link
      href={link.Link || '#'}
      target={link.IsOpenNewTab ? '_blank' : undefined}
      rel={link.IsOpenNewTab ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center gap-2 overflow-hidden"
    >
      <span className="flex w-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:w-5 group-hover:opacity-100 !mb-0 lg:!mb-2">
        <span className="text-[18px] text-red-500 !mb-0 lg:!mb-2">
          <Icon />
        </span>
      </span>

      <span className="relative w-[max-content] overflow-hidden !mb-0 lg:!mb-2">
        <span className="block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-gray-400 transition-all duration-500 group-hover:-translate-x-full whitespace-nowrap !mb-0 lg:!mb-2">
          {link.DisplayText}
        </span>
        <span className="absolute -left-full top-0 block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-red-500 transition-all duration-500 group-hover:left-0 whitespace-nowrap !mb-0 lg:!mb-2">
          {link.DisplayText}
        </span>
      </span>
    </Link>
  );
}

function FooterLinkColumnSection({
  column,
  social = false,
}: {
  column?: FooterLinkColumn | null;
  social?: boolean;
}) {
  if (!column) return null;

  const leftLinks = column.LeftLinks ?? [];
  const rightLinks = column.RightLinks ?? [];
  const LinkComponent = social ? FooterSocialLink : FooterTextLink;

  return (
    <div>
      <h3 className={headingClassName}>{column.ColumnTitle}</h3>
      <div
        className={
          social
            ? 'grid grid-cols-2 gap-x-4 gap-y-2'
            : 'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3'
        }
      >
        <div className="space-y-3">
          {leftLinks.map((link) => (
            <div key={link.id ?? link.DisplayText}>
              <LinkComponent link={link} />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {rightLinks.map((link) => (
            <div key={link.id ?? link.DisplayText}>
              <LinkComponent link={link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterContent({ footer }: { footer: FooterData }) {
  const logoUrl = getMediaUrl(footer.Logo) ?? '/images/synergos-logo-foder.png';
  const decorativeUrl =
    getMediaUrl(footer.DecorativeImage) ?? '/images/foter-vector.svg';
  const addressLines =
    footer.RegisteredAddress?.Address?.split('\n').filter(Boolean) ?? [];
  const legalLinks = footer.LegalLinks?.Links ?? [];

  return (
    <footer className="relative bg-[#111111] text-white overflow-hidden">
      <InteractiveDots variant="footer" />

      <div className="relative z-10 px-4 sm:px-8 py-14 sm:py-14">
        <div className="text-center mb-8 sm:mb-16">
          <div className="relative w-[188px] h-[24px] sm:w-[254px] sm:h-[33.13px] mx-auto">
            <Image
              src={logoUrl}
              alt="Synergos Logo"
              fill
              style={{ objectFit: 'contain' }}
              unoptimized={logoUrl.startsWith('http')}
            />
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[0.8fr_0.7fr_1.4fr_0.7fr] gap-x-4 sm:gap-x-2 gap-y-6 sm:gap-y-8 mb-12 sm:mb-20 mx-auto"
          style={{ maxWidth: '100%' }}
        >
          {footer.RegisteredAddress && (
            <div>
              <h3 className={headingClassName}>
                {footer.RegisteredAddress.ColumnTitle}
              </h3>
              <p className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400">
                {addressLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          )}

          <FooterLinkColumnSection column={footer.Browse} />
          <FooterLinkColumnSection column={footer.WhatWeOffer} />
          <FooterLinkColumnSection column={footer.Connect} social />
        </div>

        <div>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mx-auto text-left"
            style={{ maxWidth: '100%' }}
          >
            <div className="font-[clother] font-light not-italic text-[14px] sm:text-[18px] leading-[20px] sm:leading-[26px] tracking-normal text-gray-400">
              {footer.CopyrightText}
            </div>

            {legalLinks.length > 0 && (
              <div className="font-[clother] font-light not-italic text-[14px] sm:text-[18px] leading-[20px] sm:leading-[26px] tracking-normal text-gray-400">
                {legalLinks.map((link, index) => (
                  <span key={link.id ?? link.DisplayText}>
                    {index > 0 && ' | '}
                    <Link
                      href={link.Link || '#'}
                      target={link.IsOpenNewTab ? '_blank' : undefined}
                      rel={
                        link.IsOpenNewTab ? 'noopener noreferrer' : undefined
                      }
                      className="text-gray-400 hover:text-[#FF0000] active:text-white transition-colors duration-300"
                    >
                      {link.DisplayText}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DecorativeVectorImage
        src={decorativeUrl}
        className="hidden lg:block absolute bottom-0 right-[15rem] w-[30rem] h-[30rem]"
        delay={0.3}
      />
    </footer>
  );
}

export default async function Footer() {
  let footer: FooterData = DEFAULT_FOOTER_DATA;

  try {
    const data = await getFooter();
    if (data) {
      footer = data;
    }
  } catch (error) {
    console.error('Failed to load footer from Strapi:', error);
  }

  return <FooterContent footer={footer} />;
}
