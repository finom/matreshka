import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { frontMatterOf } from '../src/site.mjs';

export const DOCS = path.join(import.meta.dirname, '..');
export const CONTENT = path.join(DOCS, 'content');
export const LANG_CODES = ['en', 'ua', 'ru'];

// Every Markdown file: its path under content/<lang>/, language, front matter and text.
export const pages = LANG_CODES.flatMap((lang) =>
  readdirSync(path.join(CONTENT, lang), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const md = readFileSync(path.join(CONTENT, lang, file), 'utf8');
      const { title = '', description = '' } = frontMatterOf(md);
      return { file: `${lang}/${file}`, name: file.replace(/\.md$/, ''), lang, md, title, description };
    })
);

// The text outside code fences.
export const prose = (md) => md.replace(/^(`{3,})[\s\S]*?^\1[ \t]*$/gm, '');
