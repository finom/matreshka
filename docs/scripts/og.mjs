// The social cards in public/og/: the logo, the home page's line and the address, per language. The output is
// committed; run again after the line changes.
//   npm run og -w matreshka-docs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { UI } from '../src/i18n.mjs';
import { LANGS } from '../src/site.mjs';

const PUBLIC = join(import.meta.dirname, '..', 'public');
const logo = readFileSync(join(PUBLIC, 'logo', 'matreshka.svg')).toString('base64');
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Words into lines of at most `max` characters.
function wrap(text, max) {
  const lines = [''];
  for (const word of text.split(' ')) {
    const line = lines.at(-1);
    if (line && line.length + word.length + 1 > max) lines.push(word);
    else lines[lines.length - 1] = line ? `${line} ${word}` : word;
  }
  return lines;
}

// Two lines split where the longer one is shortest.
function balance(text) {
  const words = text.split(' ');
  const splits = words.slice(1).map((_, i) => [words.slice(0, i + 1).join(' '), words.slice(i + 1).join(' ')]);
  return splits.reduce((best, lines) =>
    Math.max(...lines.map((line) => line.length)) < Math.max(...best.map((line) => line.length)) ? lines : best
  );
}

// the Ukrainian line takes two lines, set a little smaller to fit
const LAYOUT = { ua: { lines: balance, size: 54 } };

for (const { code, prefix } of LANGS) {
  const layout = LAYOUT[code];
  const lines = layout ? layout.lines(UI[code].demo) : wrap(UI[code].demo, 30);
  const size = layout?.size ?? 58;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbfbe9"/>
      <stop offset="0.5" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#f4eaf6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <image href="data:image/svg+xml;base64,${logo}" x="110" y="95" width="70" height="92"/>
  <text x="190" y="170" font-family="${FONT}" font-size="64" font-weight="500" fill="#2b2b2b">Matreshka.js</text>
  ${lines
    .map(
      (line, i) =>
        `<text x="90" y="${360 + i * 72}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="#2b2b2b">${escapeXml(line)}</text>`
    )
    .join('\n  ')}
  <text x="90" y="550" font-family="${FONT}" font-size="30" fill="#2e7d32">matreshka.js.org${prefix}/</text>
</svg>`;
  writeFileSync(
    join(PUBLIC, 'og', `${code}.png`),
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
  );
}
console.log('social cards written');
