import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og-card';
import { allPages } from '@/lib/docs-pages';
import { UI } from '@/lib/i18n';
import { ogImage } from '@/lib/site';

// One social card per page. The static export writes each to a file.
export const dynamic = 'force-static';
export const dynamicParams = false;

const read = (...parts) => readFile(path.join(process.cwd(), ...parts));
const font = (file) =>
  read('node_modules/@fontsource/inter/files', file).catch(() => read('../node_modules/@fontsource/inter/files', file));

export function generateStaticParams() {
  return allPages().map(({ route }) => ({ slug: ogImage(route).split('/').slice(2) }));
}

export async function GET(_, { params }) {
  const card = `/og/${(await params).slug.join('/')}`;
  const page = allPages().find(({ route }) => ogImage(route) === card);
  if (!page) return new Response(null, { status: 404 });
  const [logo, ...fonts] = await Promise.all([
    read('public/logo/matreshka-full-horizontal.svg'),
    font('inter-latin-400-normal.woff'),
    font('inter-cyrillic-400-normal.woff'),
    font('inter-latin-700-normal.woff'),
    font('inter-cyrillic-700-normal.woff')
  ]);
  const home = page.route === '/' || page.route === '/ua/' || page.route === '/ru/';
  return new ImageResponse(
    <OgCard
      logo={`data:image/svg+xml;base64,${logo.toString('base64')}`}
      title={home ? UI[page.lang].tagline : page.title}
      subtitle={home ? undefined : page.route.includes('/api/') ? 'API' : undefined}
      footer={`matreshka.js.org${page.route}`}
    />,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fonts[0], weight: 400 },
        { name: 'Inter Cyrillic', data: fonts[1], weight: 400 },
        { name: 'Inter', data: fonts[2], weight: 700 },
        { name: 'Inter Cyrillic', data: fonts[3], weight: 700 }
      ]
    }
  );
}
