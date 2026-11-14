import { getCollection } from 'astro:content';

export type Platform = 'instagram' | 'linkedin';

export interface SocialPost {
  id: string;
  platform: Platform;
  title: string;
  cover: string;
  date: Date;
  pinned: boolean;
  /** Address of the official embed frame (only ever instagram.com or linkedin.com). */
  embed: string;
  /** Normal address of the post, used for the "open" link. */
  view: string;
}

const decode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** Instagram reel / post link -> embed address. Anything else returns null. */
function parseInstagram(input: string): { embed: string; view: string } | null {
  const match = decode(input).match(/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (!match) return null;
  const kind = match[1].toLowerCase().startsWith('reel') ? 'reel' : match[1].toLowerCase();
  const id = match[2];
  return {
    embed: `https://www.instagram.com/${kind}/${id}/embed/`,
    view: `https://www.instagram.com/${kind}/${id}/`,
  };
}

/**
 * LinkedIn: accepts the "Embed this post" code (an <iframe> tag), the embed address,
 * or a normal post link. Anything else returns null.
 */
function parseLinkedIn(input: string): { embed: string; view: string } | null {
  const text = decode(input.trim());
  const frame = text.match(/src=["']([^"']+)["']/i);
  const source = frame ? frame[1] : text;

  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !/(^|\.)linkedin\.com$/i.test(url.hostname)) return null;

  const urn = source.match(/urn:li:(share|ugcPost|activity):(\d+)/i);
  let id = urn ? `urn:li:${urn[1]}:${urn[2]}` : '';
  if (!id) {
    const activity = source.match(/activity[-:](\d{10,})/i);
    if (activity) id = `urn:li:activity:${activity[1]}`;
  }
  if (!id) return null;

  const isEmbed = url.pathname.startsWith('/embed/');
  return {
    embed: `https://www.linkedin.com/embed/feed/update/${id}`,
    view: isEmbed ? `https://www.linkedin.com/feed/update/${id}/` : `https://www.linkedin.com${url.pathname}`,
  };
}

/**
 * Published social posts: pinned first, then newest first.
 * A post whose link can't be understood is quietly left out, so nothing broken is ever shown.
 */
export async function getSocialPosts(platform?: Platform, limit?: number): Promise<SocialPost[]> {
  const entries = await getCollection('social', ({ data }) => !data.draft);
  const posts: SocialPost[] = [];
  for (const entry of entries) {
    const { data } = entry;
    if (platform && data.platform !== platform) continue;
    const parsed = data.platform === 'instagram' ? parseInstagram(data.url) : parseLinkedIn(data.url);
    if (!parsed) continue;
    posts.push({
      id: entry.id,
      platform: data.platform,
      title: data.title,
      cover: data.cover,
      date: data.date,
      pinned: data.pinned,
      ...parsed,
    });
  }
  posts.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.valueOf() - a.date.valueOf());
  return typeof limit === 'number' ? posts.slice(0, limit) : posts;
}
