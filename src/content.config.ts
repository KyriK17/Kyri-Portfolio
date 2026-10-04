import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const str = () => z.string().nullish().transform((v) => v ?? '');

const list = (item: any) =>
  z.array(item).nullish().transform((v) => v ?? []);

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: 'src/content/articles',
  }),
  schema: z.object({
    title: z.string(),
    subtitle: str(),
    slug: z.string().nullish(),
    author: str(),
    date: z.coerce.date(),
    category: z.string(),
    tags: list(z.string()),
    image: str(),
    imageAlt: str(),
    excerpt: str(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seoTitle: str(),
    seoDescription: str(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: 'src/content/projects',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().nullish(),
    description: str(),
    image: str(),
    imageAlt: str(),
    category: str(),
    tools: list(z.string()),
    projectUrl: str(),
    githubUrl: str(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().nullish().transform((v) => v ?? 100),
    seoTitle: str(),
    seoDescription: str(),
  }),
});

const about = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: 'src/content/about',
  }),
  schema: z.object({
    title: z.string().nullish().transform((v) => v || 'About'),
    headline: str(),
    summary: str(),
    profileImage: str(),
    profileImageAlt: str(),
    education: list(
      z.object({
        institution: z.string(),
        qualification: str(),
        years: str(),
        details: str(),
      })
    ),
    interests: list(z.string()),
    skills: list(
      z.object({
        group: z.string(),
        items: list(z.string()),
      })
    ),
  }),
});

export const collections = {
  articles,
  projects,
  about,
};
