import { getHeader, getServices } from '@/lib/strapi';
import { getMediaUrl } from '@/lib/strapi-media';
import {
  DEFAULT_HEADER_DATA,
  resolveHeaderHref,
  type HeaderMenuItem,
} from '@/types/header';
import type { CTAData } from '@/types/cta';
import type { ServiceData } from '@/types/service';
import NavbarView, { type NavbarLink } from './NavbarClient';

/** Previous hardcoded values — used when the CMS lists are empty/unreachable. */
const FALLBACK_NAV_ITEMS: NavbarLink[] = [
  { label: 'Who We Are', href: '/about' },
  { label: 'What We Offer', href: '/services' },
  { label: 'Our Work', href: '/our-work' },
];

const FALLBACK_BROWSE_MAIN: NavbarLink[] = [
  { label: 'Who we are', href: '/about' },
  { label: 'Our work', href: '/our-work' },
  { label: 'Careers', href: '/careers' },
  { label: 'Our Client', href: '/clients' },
];

const FALLBACK_SERVICES_LEFT: NavbarLink[] = [
  { label: 'Web Development & Web Technologies', href: '/services/web-development-and-web-technologies' },
  { label: 'Social Media Management', href: '/services/social-media-management' },
  { label: 'Search Engine Optimisation', href: '/services/search-engine-optimisation' },
  { label: 'Performance Marketing', href: '/services/performance-marketing' },
  { label: 'Online Media Planning & Buying', href: '/services/online-media-planning-and-buying' },
  { label: 'Influencer Marketing & Management', href: '/services/influencer-marketing-and-management' },
];

const FALLBACK_SERVICES_RIGHT: NavbarLink[] = [
  { label: 'Quick Commerce Marketing & Optimisation', href: '/services/quick-commerce-marketing-and-optimisation' },
  { label: 'AI Strategy & Consultancy', href: '/services/ai-strategy-and-consultancy' },
  { label: 'Branding & Identity', href: '/services/branding-and-identity' },
  { label: 'Offline Print & Media Buying', href: '/services/offline-print-and-media-buying' },
  { label: 'Brand Films & Multimedia Production', href: '/services/brand-films-and-multimedia-production' },
];

/** Menu labels render Title Case no matter how editors type them in Strapi
 * (`WHO WE ARE` → `Who We Are`). CSS `capitalize` can't do this — it never
 * lowercases — so it happens here. Service titles are left untouched. */
function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/(\s+)/)
    .map((part) =>
      part && !/^\s+$/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    )
    .join('');
}

function toLinks(
  items: HeaderMenuItem[] | null | undefined,
  fallback: NavbarLink[],
): NavbarLink[] {
  const list = (items ?? [])
    .filter((item) => item?.DisplayText?.trim())
    .map((item) => ({
      label: toTitleCase(item.DisplayText.trim()),
      href: resolveHeaderHref(item.Link),
      openInNewTab: item.IsOpenNewTab ?? false,
    }));
  return list.length > 0 ? list : fallback;
}

/** Null when the CMS list is empty — the overlay then renders the legacy grouped block. */
function toLinksOrNull(items: HeaderMenuItem[] | null | undefined): NavbarLink[] | null {
  const list = (items ?? [])
    .filter((item) => item?.DisplayText?.trim())
    .map((item) => ({
      label: toTitleCase(item.DisplayText.trim()),
      href: resolveHeaderHref(item.Link),
      openInNewTab: item.IsOpenNewTab ?? false,
    }));
  return list.length > 0 ? list : null;
}

/** Live service entries → WHAT WE OFFER links (editor order). */
function mapServiceLinks(services: ServiceData[]): NavbarLink[] {
  const links: NavbarLink[] = [];
  for (const service of services) {
    const raw = (service.slug ?? service.Slug ?? '').trim();
    if (!raw) continue;
    const part = raw.split('/').filter(Boolean).pop() ?? raw;
    if (!part) continue;
    const label = (service.title ?? service.Title ?? '').trim() || part;
    links.push({ label, href: `/services/${part}` });
  }
  return links;
}

/**
 * Server header — same `<Navbar />` signature as before, now fed by the
 * `api::header.header` single type (MainMenu, MobileMenu,
 * DesktopHamburgerMenu, CTA, ShowSearch, Logo, LogoAnimated) plus the live
 * service list for the WHAT WE OFFER panel. Anything missing falls back to
 * the previous hardcoded values, so the header never renders empty.
 */
export default async function Navbar() {
  let header = DEFAULT_HEADER_DATA;
  try {
    const data = await getHeader();
    if (data) {
      header = data;
    }
  } catch (error) {
    console.error('Failed to load header from Strapi:', error);
  }

  let serviceLinks: NavbarLink[] | null = null;
  try {
    const mapped = mapServiceLinks(await getServices());
    if (mapped.length > 0) {
      serviceLinks = mapped;
    }
  } catch (error) {
    console.error('Failed to load services for header:', error);
  }

  const hamburgerLeft = header.DesktopHamburgerMenu?.Left ?? null;
  const mobileMenu =
    header.MobileMenu && header.MobileMenu.length > 0 ? header.MobileMenu : hamburgerLeft;

  const cta: CTAData = {
    DisplayText: header.CTA?.DisplayText ?? 'GET IN TOUCH',
    HoverText: header.CTA?.HoverText ?? header.CTA?.DisplayText ?? 'GET IN TOUCH',
    Link: header.CTA?.Link ?? '/contact',
    IsOpenNewTab: header.CTA?.IsOpenNewTab ?? false,
    Magnetic: header.CTA?.Magnetic ?? false,
  };

  const mid = serviceLinks ? Math.ceil(serviceLinks.length / 2) : 0;

  return (
    <NavbarView
      content={{
        navItems: toLinks(header.MainMenu, FALLBACK_NAV_ITEMS),
        browseDesktop: toLinks(hamburgerLeft, FALLBACK_BROWSE_MAIN),
        browseMobile: toLinks(mobileMenu, FALLBACK_BROWSE_MAIN),
        secondary: toLinksOrNull(header.DesktopHamburgerMenu?.Right),
        servicesLeft: serviceLinks ? serviceLinks.slice(0, mid) : FALLBACK_SERVICES_LEFT,
        servicesRight: serviceLinks ? serviceLinks.slice(mid) : FALLBACK_SERVICES_RIGHT,
        cta,
        showSearch: header.ShowSearch ?? true,
        logo: getMediaUrl(header.Logo) ?? '/images/logo.png',
        logoAnimated: getMediaUrl(header.LogoAnimated) ?? '/images/logo.gif',
      }}
    />
  );
}
