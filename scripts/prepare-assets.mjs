import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
const downloads = process.argv[2];
if (!downloads) throw new Error('Usage: node scripts/prepare-assets.mjs <reference-directory>');
for (const folder of ['images', 'medals', 'leagues', 'mockups', 'references'])
  await mkdir(`public/${folder}`, { recursive: true });
const brand = path.join(downloads, 'VYVE Fitness Gamification Brand Board.png');
const league = path.join(downloads, 'VYVE Ligas Competitivas_ Ascensão Cristalina.png');
const medal = path.join(downloads, 'VYVE Futuristic Achievement Medal Board.png');
async function crop(input, rect, output, width) {
  await sharp(input)
    .extract(rect)
    .resize({ width })
    .webp({ quality: 90 })
    .toFile(`public/${output}`);
}
const wordmark = path.join(downloads, 'Glossy Neon VYVE Wordmark.png');
await crop(
  wordmark,
  { left: 150, top: 140, width: 1850, height: 430 },
  'images/wordmark.webp',
  600,
);
await sharp(path.join(downloads, 'Neon Glass V Icon.png'))
  .resize(256)
  .webp({ quality: 90 })
  .toFile('public/images/icon.webp');
await crop(brand, { left: 300, top: 0, width: 304, height: 340 }, 'images/athlete.webp', 1000);
await crop(brand, { left: 780, top: 0, width: 203, height: 340 }, 'images/male-athlete.webp', 650);
await crop(brand, { left: 300, top: 0, width: 304, height: 340 }, 'images/calistenia.webp', 600);
await crop(brand, { left: 604, top: 140, width: 174, height: 200 }, 'images/corrida.webp', 520);
await crop(brand, { left: 816, top: 1124, width: 112, height: 186 }, 'images/mobilidade.webp', 400);
for (const [name, left] of [
  ['home', 18],
  ['challenges', 248],
  ['progress', 695],
])
  await crop(brand, { left, top: 347, width: 219, height: 482 }, `mockups/${name}.webp`, 438);
for (let i = 0; i < 8; i++)
  await crop(
    league,
    { left: 25 + i * 188, top: 160, width: 176, height: 233 },
    `leagues/${i}.webp`,
    260,
  );
for (let i = 0; i < 10; i++)
  await crop(
    medal,
    { left: 30 + (i % 5) * 94 + (i >= 5 ? 514 : 0), top: 135, width: 91, height: 105 },
    `medals/${i}.webp`,
    230,
  );
await sharp(wordmark)
  .resize(1100, 400, { fit: 'contain', background: '#101114' })
  .extend({ top: 115, bottom: 115, left: 50, right: 50, background: '#101114' })
  .jpeg({ quality: 90 })
  .toFile('public/images/og.jpg');
for (const [file, name] of [
  [brand, 'brand-board.png'],
  [league, 'leagues-board.png'],
  [medal, 'medals-board.png'],
])
  await copyFile(file, `public/references/${name}`);
console.log('Official assets extracted and optimized.');
