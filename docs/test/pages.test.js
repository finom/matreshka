import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { API, INFO, linkTarget, sectionsOf, START } from '../src/site.mjs';
import { LANG_CODES, pages, prose } from './pages';

describe('docs content', () => {
  // A file that is in content/ but not in the menu would never be shown.
  it('puts every file in the menu, and has a file for every menu entry', () => {
    const names = [
      ...START,
      ...INFO,
      ...API.flatMap(({ dir, index, members }) => [
        ...(index ? [`api/${dir}`] : []),
        ...members.map((member) => `api/${dir}/${member}`)
      ])
    ];
    for (const lang of LANG_CODES) {
      expect(
        pages
          .filter((page) => page.lang === lang)
          .map(({ name }) => name)
          .sort(),
        lang
      ).toEqual([...names].sort());
    }
  });

  // The llms.txt list and the menu's tooltips read it; search results cut at about 160.
  it('gives every section a description of its own, at most 160 characters', () => {
    const seen = new Map();
    for (const { file, description } of pages) {
      expect(description.length, file).toBeGreaterThan(0);
      expect(description.length, file).toBeLessThanOrEqual(160);
      expect(seen.get(description), `${file} repeats the description of ${seen.get(description)}`).toBeUndefined();
      seen.set(description, file);
    }
  });

  it('gives every section a title and exactly one h1', () => {
    for (const { file, title, md } of pages) {
      expect(title, file).not.toBe('');
      expect(prose(md).match(/^# /gm)?.length, file).toBe(1);
    }
  });

  // The level switch hides members by level; an API section without one would show at every level.
  it('gives every API section a level the switch knows, and the guide pages none', () => {
    for (const { file, name, md } of pages) {
      const level = /^importance: (.+)$/m.exec(md)?.[1];
      if (name.startsWith('api/')) expect(['1', '2', '3'], file).toContain(level);
      else expect(level, file).toBeUndefined();
    }
  });

  // The same section must be advanced, or not, in every language.
  it('gives a section the same importance in every language', () => {
    const level = ({ md }) => /^importance: (.+)$/m.exec(md)?.[1] ?? '';
    for (const page of pages.filter(({ lang }) => lang === 'en')) {
      for (const lang of ['ua', 'ru']) {
        const other = pages.find((item) => item.lang === lang && item.name === page.name);
        expect(level(other), `${lang}/${page.name}`).toBe(level(page));
      }
    }
  });

  // A link written as a route (`/api/matreshka/calc/`) must name a section of the same language.
  it('links only to sections, language homes, examples and the bundles', () => {
    for (const lang of LANG_CODES) {
      const sections = sectionsOf(lang);
      for (const { file, md } of pages.filter((page) => page.lang === lang)) {
        for (const [, href] of prose(md).matchAll(/\]\((\/[^)\s]*)\)/g)) {
          if (/^\/(ua\/|ru\/)?$/.test(href) || /^\/(examples\/|[^/]+\.js$)/.test(href)) continue;
          expect(linkTarget(href, lang, sections), `${file} links to ${href}`).not.toBeNull();
        }
      }
    }
  });
  // the binder pages once showed the same import twice, which redeclares `binders`
  it('shows no code block that imports the same name twice', () => {
    for (const { file, md } of pages) {
      for (const [, code] of md.matchAll(/^```js\n([\s\S]*?)^```/gm)) {
        const lines = code.split('\n').filter((line) => /^import /.test(line));
        expect(new Set(lines).size, `${file}: ${lines.join(' | ')}`).toBe(lines.length);
      }
    }
  });

  // 3.0 has three entry points and named exports; the 2.x pages imported deep paths (`matreshka/bindnode`).
  it('imports only what the package exports', () => {
    const root = path.join(import.meta.dirname, '..', '..');
    const entries = Object.keys(JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).exports)
      .filter((key) => !key.includes('package.json'))
      .map((key) => key.replace(/^\./, 'matreshka'));
    const namesOf = (file) =>
      new Set(
        [...readFileSync(path.join(root, 'src', file), 'utf8').matchAll(/^export \{([^}]+)\}/gm)].flatMap(([, list]) =>
          list.split(',').map((name) => name.trim())
        )
      );
    const names = {
      matreshka: namesOf('index.ts'),
      'matreshka/router': namesOf('router/index.ts'),
      'matreshka/parse-form': namesOf('parse-form/index.ts')
    };
    for (const { file, md } of pages) {
      for (const [, list, from] of md.matchAll(/import (?:\w+, )?(?:\{([^}]*)\} )?(?:\w+ )?from '(matreshka[^']*)'/g)) {
        expect(entries, `${file} imports ${from}`).toContain(from);
        for (const name of list
          ?.split(',')
          .map((item) => item.trim().split(' ')[0])
          .filter(Boolean) ?? []) {
          expect(names[from].has(name), `${file} imports { ${name} } from ${from}`).toBe(true);
        }
      }
      for (const [, from] of md.matchAll(/require\('(matreshka[^']*)'\)/g)) {
        expect(entries, `${file} requires ${from}`).toContain(from);
      }
    }
  });
});
