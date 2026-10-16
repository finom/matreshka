import { describe, expect, it } from 'vitest';
import oldAnchors from '../src/old-anchors.json' with { type: 'json' };
import { UI } from '../src/i18n.mjs';
import { page } from '../src/page.mjs';
import { LANGS, oldAnchorsOf, sectionsOf } from '../src/site.mjs';

// The `@oldlink` aliases of the old JSDoc files: the names members had before they were renamed.
const OLDLINKS = [
  'Matreshka-linkProps',
  'Matreshka-linkProps(2)',
  'Matreshka.linkProps',
  'Matreshka.setClassFor',
  'Matreshka.to',
  'Matreshka.parserBrackers'
];

const assets = { css: 'style.css', js: 'site.js' };
const rendered = LANGS.map(({ code, prefix }) => {
  const sections = sectionsOf(code);
  const html = page({ lang: code, sections, updated: '2026-10-16', assets });
  const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), ([, id]) => id);
  return { code, prefix, sections, html, ids: new Set(ids), idList: ids };
});

describe.each(rendered)('the $code page', ({ code, prefix, sections, html, ids, idList }) => {
  it('has one h1 and ids that repeat nowhere', () => {
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    expect(idList.length).toBe(ids.size);
  });

  it('has a section for every file and a menu link to each', () => {
    for (const { id, importance } of sections) {
      expect(ids.has(id), id).toBe(true);
      expect(html, id).toContain(`<li data-importance="${importance}"><a href="#${id}"`);
    }
  });

  // a heading with inline HTML (the level circles) takes its id from its text only
  it('builds heading ids from text, not from inline HTML', () => {
    expect(idList.filter((id) => /span-class|aria-hidden/.test(id))).toEqual([]);
  });

  it('points every in-page link at an id on the page', () => {
    for (const [, id] of html.matchAll(/href="#([^"]*)"/g)) expect(ids.has(id), `#${id}`).toBe(true);
  });

  // A route the sections had as pages of their own would now be a redirect; links go to the anchor instead.
  it('links to no old page route', () => {
    const internal = Array.from(html.matchAll(/href="(\/[^"]*)"/g), ([, href]) => href).filter(
      (href) =>
        !/^\/((ua|ru)\/)?$/.test(href) && !/^\/(examples\/|logo\/|[^/]+\.(js|css|svg|png|ico|webmanifest)$)/.test(href)
    );
    expect(internal).toEqual([]);
  });

  it('opens every old #! anchor, @oldlink and guide page on a section', () => {
    const map = oldAnchorsOf(code, sections);
    for (const anchor of [
      ...Object.keys(oldAnchors[code]),
      ...OLDLINKS,
      'home',
      'introduction',
      'getting-started',
      'examples',
      'faq'
    ]) {
      expect(ids.has(map[anchor]), `#!${anchor} → ${map[anchor]}`).toBe(true);
    }
  });

  it('names its language, canonical URL and the other languages for search engines', () => {
    const { hreflang } = LANGS.find((lang) => lang.code === code);
    expect(html).toContain(`<html lang="${hreflang}">`);
    expect(html).toContain(`<link rel="canonical" href="https://matreshka.js.org${prefix}/">`);
    for (const lang of LANGS) {
      expect(html).toContain(
        `<link rel="alternate" hreflang="${lang.hreflang}" href="https://matreshka.js.org${lang.prefix}/">`
      );
    }
    expect(html).toContain(`<meta property="og:image" content="https://matreshka.js.org/og/${code}.png">`);
    expect(JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/.exec(html)[1])['@graph']).toHaveLength(2);
  });

  // Levels are hidden only by the script, so a reader or a crawler without it gets every section.
  it('marks each section with its level for the script, not by hiding it in the HTML', () => {
    for (const level of [1, 2, 3]) {
      const ids = sections.filter(({ importance }) => importance === level).map(({ id }) => id);
      expect(ids.length, `level ${level}`).toBeGreaterThan(10);
      for (const id of ids) expect(html).toContain(`<article id="${id}" class="mk-section" data-importance="${level}"`);
    }
    expect(html).not.toMatch(/<article[^>]* hidden/);
    expect(html.match(/<button type="button" data-level="[123]"/g)).toHaveLength(3);
  });

  // a level that hides every member of a menu group hides the group, so no empty group shows
  it('hides a menu group exactly when the level hides all its members', () => {
    const groups = Array.from(
      html.matchAll(/<details open data-group="[^"]+" data-importance="(\d)">([\s\S]*?)<\/details>/g)
    );
    expect(groups.length).toBe(Object.keys(UI[code].groups).length);
    for (const [, groupLevel, body] of groups) {
      const levels = Array.from(body.matchAll(/<li data-importance="(\d)"><a/g), ([, level]) => Number(level));
      for (const level of [1, 2, 3]) expect(Number(groupLevel) <= level).toBe(levels.some((l) => l <= level));
    }
  });

  // As on the old site: a class's members under Methods, Properties, Static Methods and Static Props.
  it("lists a class's members under the old menu's headings", () => {
    const group = /<details open data-group="matreshka"[^>]*>([\s\S]*?)<\/details>/.exec(html)[1];
    const headings = Array.from(group.matchAll(/<li class="mk-nav-sub"[^>]*>([^<]+)<\/li>/g), ([, text]) => text);
    expect(headings).toEqual(Object.values(UI[code].kinds));
    const staticPart = group.slice(group.indexOf(UI[code].kinds.static_methods));
    expect(staticPart).toContain('href="#Matreshka.bindNode"');
    expect(group.slice(0, group.indexOf(UI[code].kinds.static_methods))).toContain('href="#Matreshka-bindNode"');
    expect(html).not.toContain('data-group="matreshka-static"');
  });
});

it('maps the same old anchors in every language', () => {
  expect(Object.keys(oldAnchors.ua).sort()).toEqual(Object.keys(oldAnchors.ru).sort());
  expect(Object.keys(oldAnchors.en).sort()).toEqual(Object.keys(oldAnchors.ru).sort());
});

it('gives each language the same section ids', () => {
  const [en, ...others] = rendered.map(({ sections }) => sections.map(({ id }) => id));
  for (const ids of others) expect(ids).toEqual(en);
});
