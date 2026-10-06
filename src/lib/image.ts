import { existsSync } from 'node:fs';
import { join } from 'node:path';

const WIDTHS = [640, 1280, 1920];

const slug = (name: string) =>
  name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * For an image in /uploads/, returns the smaller WebP copies made by scripts/optimise-images.mjs.
 * Returns null (so the original is used) for anything else or if the copies are missing.
 */
export function webImage(src: string): { src: string; srcset: string } | null {
  const match = /^\/uploads\/([^/]+\.(?:jpe?g|png))$/i.exec(src);
  if (!match) return null;
  let file = match[1];
  try {
    file = decodeURIComponent(file);
  } catch {}
  const base = slug(file);
  const have = WIDTHS.filter((w) => existsSync(join(process.cwd(), 'public', '_img', `${base}-${w}.webp`)));
  if (have.length === 0) return null;
  const mid = have.includes(1280) ? 1280 : have[have.length - 1];
  return {
    src: `/_img/${base}-${mid}.webp`,
    srcset: have.map((w) => `/_img/${base}-${w}.webp ${w}w`).join(', '),
  };
}
