import { describe, expect, it } from 'vitest';
import { PREFIXES, pages, prose, routes } from './pages';

describe('docs pages', () => {
  it('finds the pages of all three languages', () => {
    for (const lang of Object.keys(PREFIXES)) {
      expect(pages.filter((page) => page.lang === lang).length, lang).toBeGreaterThan(100);
    }
  });

  // A page without a description gets the site's, the same on every page. Search results cut at about 160.
  it('gives every page a description of its own, at most 160 characters', () => {
    for (const { file, description } of pages) {
      expect(description.length, file).toBeGreaterThan(0);
      expect(description.length, file).toBeLessThanOrEqual(160);
    }
    const seen = new Map();
    for (const { file, description } of pages) {
      expect(seen.get(description), `${file} repeats the description of ${seen.get(description)}`).toBeUndefined();
      seen.set(description, file);
    }
  });

  it('gives every page a title and exactly one h1', () => {
    for (const { file, title, mdx } of pages) {
      expect(title, file).not.toBe('');
      expect(prose(mdx).match(/^# /gm)?.length, file).toBe(1);
    }
  });

  // The language switch and the hreflang alternates point at the same path in every language.
  it('has every page in all three languages', () => {
    for (const { route, lang } of pages) {
      const path = route.slice(PREFIXES[lang].length) || '/';
      for (const prefix of Object.values(PREFIXES)) expect(routes.has(prefix + path), `${prefix}${path}`).toBe(true);
    }
  });

  it('links only to pages that exist', () => {
    for (const { file, mdx } of pages) {
      for (const [, href] of prose(mdx).matchAll(/\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g)) {
        if (/^\/(examples\/|[^/]+\.js$)/.test(href)) continue;
        expect(routes.has(href), `${file} links to ${href}`).toBe(true);
      }
    }
  });
});
