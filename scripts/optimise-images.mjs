// Makes small WebP copies of everything in public/uploads, into public/_img.
// The originals are never touched. Runs automatically before `dev` and `build`.
// Copies are only (re)made when missing or older than the original, so repeat runs are instant.
import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const SRC = 'public/uploads';
const OUT = 'public/_img';
const WIDTHS = [640, 1280, 1920];
const EXT = new Set(['.jpg', '.jpeg', '.png']);

const slug = (file) =>
  basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[images] sharp is not installed, so smaller image copies were skipped. Run `npm install` to enable them.');
  process.exit(0);
}

let files = [];
try {
  files = (await readdir(SRC)).filter((f) => EXT.has(extname(f).toLowerCase()));
} catch {
  process.exit(0);
}
await mkdir(OUT, { recursive: true });

let made = 0;
for (const file of files) {
  const from = join(SRC, file);
  const fromTime = (await stat(from)).mtimeMs;
  for (const w of WIDTHS) {
    const to = join(OUT, `${slug(file)}-${w}.webp`);
    try {
      if ((await stat(to)).mtimeMs >= fromTime) continue;
    } catch {}
    try {
      await sharp(from).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(to);
      made++;
    } catch (err) {
      console.warn(`[images] could not process ${file}: ${err.message}`);
      break;
    }
  }
}
console.log(made ? `[images] made ${made} optimised copies in ${OUT}` : '[images] optimised copies are up to date');
