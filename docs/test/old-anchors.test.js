import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import anchors from '../src/lib/api-anchors.json';
import { oldLinks } from '../src/lib/old-links';
import { APP, PREFIXES, pages, routes } from './pages';

// The `@oldlink` aliases of the old JSDoc files: the names members had before they were renamed.
const OLDLINKS = [
  'Matreshka-linkProps',
  'Matreshka-linkProps(2)',
  'Matreshka.linkProps',
  'Matreshka.setClassFor',
  'Matreshka.to',
  'Matreshka.parserBrackers'
];

const pageOf = (target) => {
  const [route, hash] = target.split('#');
  const page = pages.find((item) => item.route === route);
  return { page, hash };
};

describe('old #! links', () => {
  for (const lang of Object.keys(PREFIXES)) {
    const map = oldLinks(lang);

    it(`${lang}: sends every old anchor to a page that exists`, () => {
      for (const [anchor, target] of Object.entries(map)) {
        const { page, hash } = pageOf(target);
        expect(page, `#!${anchor} → ${target}`).toBeDefined();
        if (hash) expect(page.mdx, `#!${anchor} → ${target}`).toContain(`[#${hash}]`);
      }
    });

    it(`${lang}: has the old anchor of every member page`, () => {
      const api = pages.filter((page) => page.lang === lang && /\/api\/(?!types\/)[^/]+\//.test(page.route));
      for (const { title, route } of api) {
        expect(map[title.replace('#', '-')], title).toBe(route);
      }
    });

    it(`${lang}: has every @oldlink and the plain pages`, () => {
      for (const anchor of [...OLDLINKS, 'home', 'introduction', 'getting-started', 'examples', 'faq']) {
        expect(routes.has(map[anchor]?.split('#')[0]), anchor).toBe(true);
      }
    });
  }

  it('maps the same anchors in every language', () => {
    expect(Object.keys(anchors.ua).sort()).toEqual(Object.keys(anchors.ru).sort());
    expect(Object.keys(anchors.en).sort()).toEqual(Object.keys(anchors.ru).sort());
  });

  it('puts the redirect script on each home page', () => {
    for (const [lang, dir] of Object.entries({ en: '(en)', ua: 'ua', ru: 'ru' })) {
      expect(readFileSync(path.join(APP, dir, 'page.mdx'), 'utf8')).toContain(`<OldLinks lang="${lang}" />`);
    }
  });
});
