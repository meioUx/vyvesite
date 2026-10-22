import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/import-medals.mjs <extracted-medalhas-folder>');
const medals = JSON.parse(await readFile('src/data/medals.json', 'utf8'));
await mkdir('public/medals', { recursive: true });
let total = 0;
for (const [index, medal] of medals.entries()) {
  const output = await sharp(path.join(source, medal[4]))
    .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`public/medals/official-${index}.webp`);
  total += output.size;
}
console.log(`${medals.length} official medals imported (${(total / 1024 / 1024).toFixed(2)} MB).`);
