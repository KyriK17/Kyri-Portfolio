import settings from '../data/site.json';
import homeData from '../data/home.json';
import pagesData from '../data/pages.json';
import seoData from '../data/seo.json';
import navigationData from '../data/navigation.json';

/**
 * Everything the CMS can edit is read from the JSON files in src/data.
 * Blank values are cleaned up here, so pages can simply check "if (value)".
 */
const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Name, tagline, email, CV and so on (src/data/site.json). */
export const site = {
  name: text(settings.name),
  tagline: text(settings.tagline),
  email: text(settings.email),
  cv: text(settings.cv),
  /** Buy Me a Coffee page address. Leave blank to hide the Coffee tab. */
  coffee: text((settings as { coffee?: string }).coffee),
  x: text(settings.x),
  /** Default meta description for search engines (src/data/seo.json). */
  description: text(seoData.defaultDescription),
  /** Default social-sharing image (src/data/seo.json). */
  ogImage: text(seoData.ogImage),
};

/** Homepage text and section switches (src/data/home.json). */
export const home = {
  heroIntro: text(homeData.heroIntro),
  aboutSummary: text(homeData.aboutSummary),
  contactText: text(homeData.contactText),
  articlesMode: homeData.homeArticles === 'featured' ? 'featured' : 'latest',
  showAbout: homeData.showAbout !== false,
  showArticles: homeData.showArticles !== false,
  showProjects: homeData.showProjects !== false,
  showContact: homeData.showContact !== false,
};

/** Short intro lines for the Articles, Projects and Contact pages (src/data/pages.json). */
export const pageText = {
  articlesIntro: text(pagesData.articlesIntro),
  projectsIntro: text(pagesData.projectsIntro),
  contactIntro: text(pagesData.contactIntro),
};

/** Per-page SEO text (src/data/seo.json). */
export const seo = {
  homeTitle: text(seoData.homeTitle),
  homeDescription: text(seoData.homeDescription),
  aboutDescription: text(seoData.aboutDescription),
  articlesDescription: text(seoData.articlesDescription),
  projectsDescription: text(seoData.projectsDescription),
  contactDescription: text(seoData.contactDescription),
};

const defaultNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Articles', href: '/articles/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Contact', href: '/contact/' },
];

/** Main navigation (src/data/navigation.json). Falls back to the five standard links if the list is empty. */
const customNav = (navigationData.items ?? [])
  .map((item) => ({ label: text(item.label), href: text(item.href), show: item.show !== false }))
  .filter((item) => item.label && item.href && item.show)
  .filter((item) => item.href !== '/coffee/' || Boolean(site.coffee))
  .map(({ label, href }) => ({ label, href }));

export const nav = (navigationData.items ?? []).length > 0 ? customNav : defaultNav;

/** How many articles appear on each page of the article list. */
export const PAGE_SIZE = 9;

/** Social links. Any link left empty in the settings is hidden automatically. */
export const socials = [
  { key: 'instagram', label: 'Instagram', url: text(settings.instagram) },
  { key: 'linkedin', label: 'LinkedIn', url: text(settings.linkedin) },
  { key: 'x', label: 'X / Twitter', url: text(settings.x) },
  { key: 'github', label: 'GitHub', url: text(settings.github) },
].filter((s) => s.url !== '');
