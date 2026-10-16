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

  it('marks importance only with the levels the menu knows', () => {
    for (const { file, md } of pages) {
      const level = /^importance: (.+)$/m.exec(md)?.[1];
      if (level) expect(['1', '2', '3'], file).toContain(level);
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
});
