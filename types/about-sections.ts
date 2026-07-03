import type { CTAData } from '@/types/cta';

export type SynergyPillarItemData = {
  id?: number;
  Title: string;
  Subtitle: string;
  Description: string;
  LinkText?: string | null;
};

export type IndustryLabelItemData = {
  id?: number;
  Label: string;
};

export type StoryOfFlightSectionData = {
  id?: number;
  __component: 'pages.story-of-flight-section';
  Heading: string;
  Subtitle: string;
  ParagraphOne: string;
  ParagraphTwo: string;
  PrimaryCTA?: CTAData | null;
  SecondaryCTA?: CTAData | null;
  Illustration?: { url?: string } | null;
  IllustrationPath?: string | null;
  BackgroundVector?: { url?: string } | null;
  BackgroundVectorPath?: string | null;
};

export type SynergyPrincipleSectionData = {
  id?: number;
  __component: 'pages.synergy-principle-section';
  Heading: string;
  Subtitle: string;
  FooterLineOne: string;
  FooterLineTwo: string;
  DecorVector?: { url?: string } | null;
  DecorVectorPath?: string | null;
  BackgroundImage?: { url?: string } | null;
  BackgroundImagePath?: string | null;
  Pillars?: SynergyPillarItemData[] | null;
};

export type AscentSectionData = {
  id?: number;
  __component: 'pages.ascent-section';
  Eyebrow: string;
  Heading: string;
  ParagraphOne: string;
  ParagraphTwo: string;
  ParagraphThree?: string | null;
  Diagram?: { url?: string } | null;
  DiagramPath?: string | null;
  BackgroundVector?: { url?: string } | null;
  BackgroundVectorPath?: string | null;
};

export type IndustriesSectionData = {
  id?: number;
  __component: 'pages.industries-section';
  Eyebrow: string;
  Heading: string;
  Description: string;
  CTA?: CTAData | null;
  RowOne?: IndustryLabelItemData[] | null;
  RowTwo?: IndustryLabelItemData[] | null;
};

export type AboutConnectCtaSectionData = {
  id?: number;
  __component: 'pages.about-connect-cta-section';
  Eyebrow: string;
  Heading: string;
  Description: string;
  EmailPlaceholder?: string | null;
  PrimaryCTA?: CTAData | null;
  SecondaryLinkText?: string | null;
  SecondaryLinkUrl?: string | null;
  Vector?: { url?: string } | null;
  VectorPath?: string | null;
  BackgroundImage?: { url?: string } | null;
  BackgroundImagePath?: string | null;
};

export type AboutPageSection =
  | StoryOfFlightSectionData
  | SynergyPrincipleSectionData
  | AscentSectionData
  | IndustriesSectionData
  | AboutConnectCtaSectionData;
