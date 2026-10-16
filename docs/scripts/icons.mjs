// The favicon set from public/icon.svg: PNGs, favicon.ico (PNG frames) and the web manifest. The output is committed.
//   npm run icons -w matreshka-docs
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PUBLIC = join(import.meta.dirname, '..', 'public');
const svg = readFileSync(join(PUBLIC, 'icon.svg'));

const png = (size, background) => {
  const image = sharp(svg, { density: Math.ceil((72 * size) / 200) * 2 }).resize(size, size);
  return (background ? image.flatten({ background }) : image).png({ compressionLevel: 9 }).toBuffer();
};

// The touch icons sit on white with a margin, as iOS and Android draw them on tiles.
const padded = async (size) => {
  const inner = Math.round(size * 0.8);
  return sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: await png(inner) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

// An ICO file whose frames are PNGs, which every current browser reads.
function ico(frames) {
  const header = Buffer.alloc(6 + 16 * frames.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, data }, i) => {
    const at = 6 + 16 * i;
    header.writeUInt8(size % 256, at);
    header.writeUInt8(size % 256, at + 1);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(data.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...frames.map(({ data }) => data)]);
}

const frames = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })));
writeFileSync(join(PUBLIC, 'favicon.ico'), ico(frames));
writeFileSync(join(PUBLIC, 'favicon-32x32.png'), frames[1].data);
writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), await padded(180));
writeFileSync(join(PUBLIC, 'android-chrome-192x192.png'), await padded(192));
writeFileSync(join(PUBLIC, 'android-chrome-512x512.png'), await padded(512));
writeFileSync(
  join(PUBLIC, 'site.webmanifest'),
  `${JSON.stringify(
    {
      name: 'Matreshka.js',
      short_name: 'Matreshka.js',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'browser'
    },
    null,
    2
  )}\n`
);
console.log('icons written');
