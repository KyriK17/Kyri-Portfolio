import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type Project = CollectionEntry<'projects'>;

/** All published articles, newest first. Drafts are left out. */
export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('articles', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** All published projects (drafts left out), ordered by the "order" field and then by title. */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  return entries.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/** "Culture & Media" -> "culture-media". Used for category and tag URLs. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 12 September 2026 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Estimated reading time in whole minutes (about 220 words a minute). */
export function readingTime(markdown = ''): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\[\]()!|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

type Term = { name: string; slug: string; count: number };

/** Counts how many articles use each category and each tag. */
export function getTaxonomy(articles: Article[]) {
  const categories = new Map<string, Term>();
  const tags = new Map<string, Term>();

  const add = (map: Map<string, Term>, name: string) => {
    const slug = slugify(name);
    if (!slug) return;
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { name, slug, count: 1 });
  };

  for (const article of articles) {
    add(categories, article.data.category);
    for (const tag of article.data.tags) add(tags, tag);
  }

  const sort = (a: Term, b: Term) => b.count - a.count || a.name.localeCompare(b.name);
  return {
    categories: [...categories.values()].sort(sort),
    tags: [...tags.values()].sort(sort),
  };
}

/** Related articles: shared tags and category score highest, then newest. */
export function getRelated(current: Article, all: Article[], limit = 3): Article[] {
  const currentTags = new Set(current.data.tags.map(slugify));
  const currentCategory = slugify(current.data.category);

  return all
    .filter((a) => a.id !== current.id)
    .map((a) => {
      const sharedTags = a.data.tags.filter((t) => currentTags.has(slugify(t))).length;
      const sameCategory = slugify(a.data.category) === currentCategory ? 1 : 0;
      return { article: a, score: sharedTags * 2 + sameCategory * 3 };
    })
    .sort(
      (a, b) =>
        b.score - a.score || b.article.data.date.valueOf() - a.article.data.date.valueOf(),
    )
    .slice(0, limit)
    .map((x) => x.article);
}
