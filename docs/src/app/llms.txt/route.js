import { docsPages } from '@/lib/docs-pages';
import { SITE } from '@/lib/site';

// The llms.txt index (llmstxt.org): the English pages with their descriptions. The static export writes it to a file.
export const dynamic = 'force-static';

export async function GET() {
  const [home, ...pages] = (await docsPages()).filter(({ lang }) => lang === 'en');
  const section = (page) => (page.route.startsWith('/api/') ? 'API reference' : 'Docs');
  const sections = new Map();
  for (const page of pages) {
    const name = section(page);
    sections.set(name, [...(sections.get(name) ?? []), `- [${page.title}](${SITE + page.route}): ${page.description}`]);
  }
  const body = [
    '# Matreshka.js',
    `> ${home.description}`,
    `The English docs in one Markdown file: ${SITE}/llms-full.txt. The docs also exist in Ukrainian (${SITE}/ua/) and Russian (${SITE}/ru/).`,
    ...Array.from(sections, ([name, links]) => `## ${name}\n\n${links.join('\n')}`)
  ].join('\n\n');
  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
