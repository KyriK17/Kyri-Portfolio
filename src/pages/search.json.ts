import type { APIRoute } from 'astro';
import { getArticles } from '../lib/utils';

// A small JSON file used by the search box on the Articles page.
export const GET: APIRoute = async () => {
  const articles = await getArticles();

  const body = articles.map((article) => ({
    title: article.data.title,
    subtitle: article.data.subtitle ?? '',
    excerpt: article.data.excerpt,
    category: article.data.category,
    tags: article.data.tags,
    url: `/articles/${article.id}/`,
    date: article.data.date.toISOString(),
  }));

  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
