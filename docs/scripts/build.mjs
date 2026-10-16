// Builds the site into out/: one page per language with every section on it, the redirects from the routes the
// sections had as pages of their own, the sitemap, robots.txt, the llms files, the 404 page, and the files the site
// serves but does not own (the bundles from dist/, the example apps from examples/).
//   npm run build -w matreshka-docs
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { compile, optimize } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { notFound, page } from '../src/page.mjs';
import { CONTENT, LANGS, linkTarget, SITE, sectionsOf } from '../src/site.mjs';

const DOCS = path.join(import.meta.dirname, '..');
const ROOT = path.join(DOCS, '..');
const SRC = path.join(DOCS, 'src');
const OUT = path.join(DOCS, 'out');

const write = (file, text) => {
  mkdirSync(path.dirname(path.join(OUT, file)), { recursive: true });
  writeFileSync(path.join(OUT, file), text);
};
const hashed = (name, text) => `${name}.${createHash('sha256').update(text).digest('hex').slice(0, 10)}`;

// the date of the last commit that touched the content, or today outside git
let updated = new Date().toISOString().slice(0, 10);
try {
  updated = execFileSync('git', ['log', '-1', '--format=%cs', '--', CONTENT], { encoding: 'utf8' }).trim() || updated;
} catch {}

rmSync(OUT, { recursive: true, force: true });
cpSync(path.join(DOCS, 'public'), OUT, { recursive: true });

for (const file of ['matreshka.js', 'matreshka.min.js', 'matreshka.min.js.map']) {
  const from = path.join(ROOT, 'dist', file);
  if (!existsSync(from)) throw new Error(`${from} is missing: run \`npm run build\` at the repo root first`);
  cpSync(from, path.join(OUT, file));
}
cpSync(path.join(ROOT, 'examples'), path.join(OUT, 'examples'), {
  recursive: true,
  filter: (file) => !/(^|\/)(README\.md|\.DS_Store)$/.test(file)
});

// CSS: Tailwind over the sources, minified
const input = readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const compiler = await compile(input, { base: SRC, onDependency: () => {} });
const scanner = new Scanner({
  sources: [
    ...(compiler.root && compiler.root !== 'none' ? [{ ...compiler.root, negated: false }] : []),
    ...compiler.sources
  ]
});
const css = optimize(compiler.build(scanner.scan()), { minify: true }).code;
const client = readFileSync(path.join(SRC, 'client.js'), 'utf8');
const assets = { css: `${hashed('style', css)}.css`, js: `${hashed('site', client)}.js` };
write(assets.css, css);
write(assets.js, client);

// A page that sends an old route to its section; search engines treat the instant refresh as a redirect.
const redirect = (target) => {
  targets.push(target);
  return `<!doctype html>
<html><head><meta charset="utf-8"><link rel="canonical" href="${SITE}${target.split('#')[0]}">
<meta http-equiv="refresh" content="0; url=${target}"><title>Matreshka.js</title></head>
<body><a href="${target}">${SITE}${target}</a></body></html>
`;
};

// Markdown for LLMs: links point at the sections on the site, example cards become a list.
const plain = (section, lang, sections) =>
  section.body
    .replace(/ \[#[\w-]+\]$/gm, '')
    .replace(/^::: examples\n|^:::\n/gm, '')
    .replace(
      /^::: example (\S+) (\S+) (.+)\n/gm,
      (_, demo, source, title) => `**[${title}](${SITE}${demo})** ([source](${source})): `
    )
    .replace(/\]\((\/[^)\s]*)\)/g, (_, href) => {
      const target = linkTarget(href, lang, sections);
      const { prefix } = LANGS.find(({ code }) => code === lang);
      return `](${SITE}${target ? `${prefix}/${target}` : href})`;
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const sitemap = [];
// every `<page>#<id>` the redirects and the llms files point at, checked against the pages at the end
const targets = [];
const idsOf = {};
for (const { code: lang, prefix } of LANGS) {
  const sections = sectionsOf(lang);
  const html = page({ lang, sections, updated, assets });
  idsOf[`${prefix}/`] = new Set(Array.from(html.matchAll(/ id="([^"]+)"/g), ([, id]) => id));
  write(`${prefix.slice(1)}/index.html`.replace(/^\//, ''), html);

  for (const section of sections) {
    if (section.id !== 'home')
      write(`${prefix.slice(1)}${section.route}index.html`.replace(/^\//, ''), redirect(`${prefix}/#${section.id}`));
  }
  write(`${prefix.slice(1)}/api/index.html`.replace(/^\//, ''), redirect(`${prefix}/#Matreshka`));

  const home = sections[0];
  write(
    `${prefix.slice(1)}/llms-full.txt`.replace(/^\//, ''),
    `${sections.map((section) => plain(section, lang, sections)).join('\n\n---\n\n')}\n`
  );
  if (lang === 'en') {
    const list = (items) =>
      items.map(({ title, id, description }) => `- [${title}](${SITE}/#${id}): ${description}`).join('\n');
    write(
      'llms.txt',
      `# Matreshka.js

> ${home.description}

The whole English documentation as one Markdown file: ${SITE}/llms-full.txt. In Ukrainian: ${SITE}/ua/llms-full.txt. In Russian: ${SITE}/ru/llms-full.txt.

## Docs

${list(sections.filter(({ group, id }) => group === 'start' && id !== 'home'))}
${list(sections.filter(({ group }) => group === 'info'))}

## API

${list(sections.filter(({ group, importance }) => !['start', 'info'].includes(group) && importance !== 3))}

## Optional

${list(sections.filter(({ importance }) => importance === 3))}
`
    );
  }
  sitemap.push({ prefix });
}

write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap
  .map(
    ({ prefix }) => `  <url>
    <loc>${SITE}${prefix}/</loc>
    <lastmod>${updated}</lastmod>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${SITE}${l.prefix}/"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`
  )
  .join('\n')}
</urlset>
`
);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
write('404.html', notFound({ assets }));

for (const file of ['llms.txt', 'llms-full.txt', 'ua/llms-full.txt', 'ru/llms-full.txt']) {
  const text = readFileSync(path.join(OUT, file), 'utf8');
  for (const [, target] of text.matchAll(new RegExp(`${SITE}(/(?:ua/|ru/)?#[^)\\s]+)`, 'g'))) targets.push(target);
}
const broken = targets.filter((target) => {
  const [home, id] = target.split('#');
  return !idsOf[home]?.has(id);
});
if (broken.length) throw new Error(`links to no section: ${[...new Set(broken)].join(', ')}`);
console.log(
  `built ${LANGS.length} pages into ${path.relative(ROOT, OUT)}/ (updated ${updated}), ${targets.length} links to sections checked`
);
