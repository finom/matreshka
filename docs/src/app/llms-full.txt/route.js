import { docsPages } from '@/lib/docs-pages';
import { pageMarkdown } from '@/lib/markdown';
import { SITE } from '@/lib/site';

// The English pages in sidebar order as one Markdown file. The static export writes it to a file.
export const dynamic = 'force-static';

export async function GET() {
  const pages = (await docsPages())
    .filter(({ lang }) => lang === 'en')
    .map(({ route, mdx }) => `Page: ${SITE + route}\n\n${pageMarkdown(mdx)}`);
  const body = pages.join('\n\n---\n\n');
  const header = [
    '---',
    'title: Matreshka.js documentation',
    'description: A reactive JavaScript framework built on classes and accessors.',
    `pages: ${pages.length}`,
    `chars: ${body.length}`,
    '---'
  ].join('\n');
  return new Response(`${header}\n\n${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
