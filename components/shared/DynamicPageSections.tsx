import dynamic from 'next/dynamic';

import BlogsSection from '@/components/blog/BlogsSection';
import ArticlesSection from '@/components/articles/ArticlesSection';
import ArticleListingSection from '@/components/articles/ArticleListingSection';
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';
import AboutConnectCTA from '@/components/about/AboutConnectCTA';
import BlogListingSection from '@/components/blog/BlogListingSection';
import AscentSection from '@/components/about/AscentSection';
import IndustriesSection from '@/components/about/IndustriesSection';
import StoryOfFlightSection from '@/components/about/StoryOfFlightSection';
import SynergyPrincipleSection from '@/components/about/SynergyPrincipleSection';
import CareerApplySection from '@/components/career/CareerApplySection';
import CareersFooterSection from '@/components/career/CareersFooterSection';
import CareersHeroSection from '@/components/career/CareersHeroSection';
import CareersListSection from '@/components/career/CareersListSection';
import OpenRolesSectionServer from '@/components/career/OpenRolesSectionServer';
import ContactFormSection from '@/components/shared/ContactFormSection';
import LocationsSection from '@/components/shared/LocationsSection';
import PageHeroSection from '@/components/shared/PageHeroSection';
import RichTextSection from '@/components/shared/RichTextSection';
import ThankYouSection from '@/components/shared/ThankYouSection';
import type { HomePageSection } from '@/types/home-sections';
import type { PageSection } from '@/types/page';

type DynamicPageSectionsProps = {
  sections?: PageSection[] | null;
};

const HOME_SECTION_COMPONENTS = new Set<HomePageSection['__component']>([
  'pages.hero-section',
  'pages.who-we-are-section',
  'pages.ambition-section',
  'pages.synergy-engine-section',
  'pages.services-section',
  'pages.exponential-impact-section',
  'pages.brands-section',
  'pages.latest-posts-section',
  'pages.testimonials-section',
  'pages.before-footer-cta-section',
]);

const ClientHomeSectionRenderer = dynamic(
  () => import('@/components/home/HomeSectionRenderer'),
  { ssr: false }
);

function isHomeSection(section: PageSection): section is HomePageSection {
  return HOME_SECTION_COMPONENTS.has(
    section.__component as HomePageSection['__component']
  );
}

export default function DynamicPageSections({
  sections,
}: DynamicPageSectionsProps) {
  if (!sections?.length) {
    return null;
  }

  return (
    <>
      {sections.map((section, index) => {
        const key = section.id ?? `section-${index}`;

        if (section.__component === 'pages.thank-you-section') {
          return <ThankYouSection key={key} data={section} />;
        }

        if (section.__component === 'pages.page-hero-section') {
          return <PageHeroSection key={key} data={section} />;
        }

        if (section.__component === 'pages.rich-text-section') {
          return <RichTextSection key={key} data={section} />;
        }

        if (section.__component === 'pages.careers-list-section') {
          return <CareersListSection key={key} data={section} />;
        }

        if (section.__component === 'pages.careers-hero-section') {
          return <CareersHeroSection key={key} content={section} />;
        }

        if (section.__component === 'pages.careers-open-roles-section') {
          return <OpenRolesSectionServer key={key} data={section} />;
        }

        if (section.__component === 'pages.careers-footer-section') {
          return <CareersFooterSection key={key} content={section} />;
        }

        if (section.__component === 'pages.career-apply-section') {
          return (
            <CareerApplySection key={key} data={section} careerTitle="" careerSlug="" />
          );
        }

        if (section.__component === 'pages.contact-form-section') {
          return <ContactFormSection key={key} data={section} />;
        }

        if (section.__component === 'pages.locations-section') {
          return <LocationsSection key={key} data={section} />;
        }

        if (section.__component === 'pages.story-of-flight-section') {
          return <StoryOfFlightSection key={key} data={section} />;
        }

        if (section.__component === 'pages.synergy-principle-section') {
          return <SynergyPrincipleSection key={key} data={section} />;
        }

        if (section.__component === 'pages.ascent-section') {
          return <AscentSection key={key} data={section} />;
        }

        if (section.__component === 'pages.industries-section') {
          return <IndustriesSection key={key} data={section} />;
        }

        if (section.__component === 'pages.about-connect-cta-section') {
          return <AboutConnectCTA key={key} data={section} />;
        }

        if (section.__component === 'pages.blog-listing-section') {
          return <BlogListingSection key={key} data={section} />;
        }

        if (section.__component === 'pages.article-listing-section') {
          return <ArticleListingSection key={key} data={section} />;
        }

        if (section.__component === 'pages.blogs-section') {
          return <BlogsSection key={key} />;
        }

        if (section.__component === 'pages.articles-section') {
          return <ArticlesSection key={key} />;
        }

        if (section.__component === 'pages.case-studies-section') {
          return <CaseStudiesSection key={key} />;
        }

        if (isHomeSection(section)) {
          return <ClientHomeSectionRenderer key={key} section={section} />;
        }

        return null;
      })}
    </>
  );
}
