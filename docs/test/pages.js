import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const DOCS = path.join(import.meta.dirname, '..');
export const APP = path.join(DOCS, 'src/app');
export const PREFIXES = { en: '', ua: '/ua', ru: '/ru' };

// Every MDX page: its file, route, language, front matter and text.
export const pages = readdirSync(APP, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('page.mdx'))
  .map((file) => {
    const mdx = readFileSync(path.join(APP, file), 'utf8');
    const dir = file.replace(/\([^)]*\)\/?/g, '').replace(/\/?page\.mdx$/, '');
    const route = dir ? `/${dir}/` : '/';
    const lang = Object.entries(PREFIXES).find(([, prefix]) => prefix && route.startsWith(`${prefix}/`))?.[0] ?? 'en';
    const frontMatter = /^---\n([\s\S]*?)\n---\n/.exec(mdx)?.[1] ?? '';
    const field = (name) => JSON.parse(new RegExp(`^${name}: (.+)$`, 'm').exec(frontMatter)?.[1] ?? '""');
    return { file, route, lang, mdx, title: field('title'), description: field('description') };
  });

export const routes = new Set(pages.map(({ route }) => route));

// The text outside code fences.
export const prose = (mdx) => mdx.replace(/^(`{3,})[\s\S]*?^\1[ \t]*$/gm, '');
