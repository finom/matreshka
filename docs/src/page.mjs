import { UI } from './i18n.mjs';
import { codeColorsCss, escapeHtml, renderSection, sourceUrl } from './markdown.mjs';
import { LANGS, oldAnchorsOf, REPO, SITE } from './site.mjs';

const DISCORD = 'https://discord.com/invite/qdT8WEHUuP';
const X = 'https://x.com/andrey_gubanov1';

const icon = (paths, size = 24) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const ICONS = {
  menu: icon('<path d="M4 6h16M4 12h16M4 18h16"/>'),
  sun: icon(
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'
  ),
  moon: icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  search: icon('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', 16),
  github:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/></svg>',
  discord:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.4 18.4 0 0 0-5.5 0L8.6 3a19.7 19.7 0 0 0-4.9 1.5A20.2 20.2 0 0 0 .1 18a19.9 19.9 0 0 0 6 3l1.3-2a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.8 19.8 0 0 0 6-3 20 20 0 0 0-3.6-13.6ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.2 2.3h3.4l-7.4 8.4L23 21.7h-6.8l-5.3-7-6.1 7H1.4l7.9-9L.9 2.3h7l4.8 6.4 5.5-6.4Zm-1.2 17.4h1.9L7.1 4.2h-2l11.9 15.5Z"/></svg>'
};

const iconLink = (href, label, svg, extra = '') =>
  `<a class="mk-icon-button${extra}" href="${href}" rel="noopener" aria-label="${label}" title="${label}">${svg}</a>`;

// the words the old docs put on the first line of a member's article
const KINDS = new Set([
  'Method',
  'Property',
  'Class',
  'Namespace',
  'Type',
  'Метод',
  'Свойство',
  'Класс',
  'Пространство имен',
  'Тип',
  'Властивість',
  'Клас',
  'Простір імен'
]);

// a member's badges: its level (circles and the old level name), its kind and the rest of the kind line
const meta = (level, ui, tags = []) =>
  `<p class="mk-meta"><span class="mk-pill mk-pill-level" data-level="${level}">${circles(level)}${ui.levels[level - 1]}</span>${tags
    .map((tag, i) => `<span class="mk-pill${i ? ' mk-pill-outline' : ''}">${tag}</span>`)
    .join('')}</p>`;

// One, two or three small circles: a member's importance level.
const circles = (level, label) =>
  `<span class="mk-circles" data-level="${level}"${label ? ` title="${label}" aria-label="${label}" role="img"` : ' aria-hidden="true"'}>${'<i></i>'.repeat(level)}</span>`;

function menu(sections, ui, lang) {
  const link = ({ id, menuTitle, title, importance, description }) =>
    `<li data-importance="${importance}"><a href="#${id}" title="${escapeHtml(description ?? title)}"><span>${escapeHtml(
      menuTitle
    )}</span>${importance ? circles(importance, ui.levels[importance - 1]) : ''}</a></li>`;
  const start = sections.filter(({ group }) => group === 'start');
  const info = sections.filter(({ group }) => group === 'info');
  const help = escapeHtml(sections.find(({ id }) => id === 'website-instructions').menuTitle);
  // a class's members under the old menu's headings; a heading takes the lowest level of its members
  const items = (list) =>
    list
      .map((section, i) => {
        if (!section.kind || section.kind === list[i - 1]?.kind) return link(section);
        const level = Math.min(...list.filter(({ kind }) => kind === section.kind).map(({ importance }) => importance));
        return `<li class="mk-nav-sub" data-importance="${level}">${ui.kinds[section.kind]}</li>${link(section)}`;
      })
      .join('');
  const groups = Object.keys(ui.groups)
    .map((dir) => {
      const list = sections.filter(({ group }) => group === dir);
      // a group takes the lowest level of its members, so a level that hides them all hides the group too
      const level = Math.min(...list.map(({ importance }) => importance));
      // a group's own page opens from its header instead of repeating the name as the first item
      const [first, ...rest] = list;
      const own = first.menuTitle === ui.groups[dir];
      const summary = own ? `<a href="#${first.id}"><span>${ui.groups[dir]}</span></a>` : ui.groups[dir];
      return `<details open data-group="${dir}" data-importance="${level}"><summary>${summary}</summary><ul>${items(own ? rest : list)}</ul></details>`;
    })
    .join('');
  const others = LANGS.filter(({ code }) => code !== lang)
    .map(
      ({ prefix, name, hreflang }) =>
        `<li><a href="${prefix}/" hreflang="${hreflang}" lang="${hreflang}">${name}</a></li>`
    )
    .join('');
  return `
<div class="mk-mode" role="group" aria-label="${ui.everything} / ${ui.oneByOne}">
  <button type="button" data-mode="all">${ui.everything}</button><button type="button" data-mode="one">${ui.oneByOne}</button>
</div>
<label class="mk-search">${ICONS.search}<input type="search" id="mk-search" placeholder="${ui.search}" aria-label="${ui.searchHint}" title="${ui.searchHint}" autocomplete="off"><kbd>/</kbd></label>
<p class="mk-nav-heading">${ui.start}</p>
<ul>${start.map(link).join('')}</ul>
<p class="mk-nav-heading">${ui.api}</p>
<div class="mk-levels"><div class="mk-levels-head"><span>${ui.levelsLabel}</span><a href="#website-instructions" title="${help}" aria-label="${help}">?</a></div><div class="mk-segmented" role="group" aria-label="${ui.levelsLabel}">${[
    1, 2, 3
  ]
    .map(
      (level) =>
        `<button type="button" data-level="${level}" title="${ui.levels[level - 1]}" aria-label="${ui.levels[level - 1]}">${circles(level)}</button>`
    )
    .join('')}</div></div>
${groups}
<p class="mk-nav-heading">${ui.info}</p>
<ul>${info.map(link).join('')}</ul>
<div class="mk-nav-langs"><p class="mk-nav-heading">${ui.languages}</p>
<ul>${others}</ul></div>`;
}

function homeExtras(html, ui) {
  const hero = `<div class="mk-hero"><h1><img class="mk-light" src="/logo/matreshka-full-horizontal.svg" alt="Matreshka.js" width="420" height="120"><img class="mk-dark" src="/logo/matreshka-full-horizontal-dark.svg" alt="" width="420" height="120"></h1></div>`;
  const demo = `<div class="mk-demo"><output class="out"></output><input class="in" type="text" aria-label="x" value="${escapeHtml(ui.demo)}"></div>`;
  const buttons = `<div class="mk-buttons"><a class="mk-button mk-button-primary mk-button-lg" href="/matreshka.min.js" download>${ui.download}</a><a class="mk-button mk-button-outline mk-button-lg" href="${REPO}" rel="noopener">Github</a><a class="mk-button mk-button-outline mk-button-lg" href="#examples">${ui.tutorials}</a></div>`;
  return html
    .replace(/<h1 class="mk-title">[\s\S]*?<\/h1>/, hero)
    .replace('<div class="mk-code">', `${demo}<div class="mk-code">`)
    .replace(/(<div class="mk-code">[\s\S]*?<\/div>\n)/, `$1${buttons}`);
}

function article(section, sections, ui, lang) {
  let html = renderSection(section, lang, sections);
  if (section.id === 'home') html = homeExtras(html, ui);
  // the level and the kind line under the title ("**Method** · Defined by you") as badges
  if (section.importance) {
    html = html.replace(
      /<\/h2>\s*(?:<p><strong>([^<]+)<\/strong>((?:(?!<\/p>).)*)<\/p>)?/,
      (match, kind, rest = '') => {
        if (kind && !KINDS.has(kind)) return match.replace(/<\/h2>/, `</h2>${meta(section.importance, ui)}`);
        const tags = kind ? [kind, ...rest.split(' · ').filter(Boolean)] : [];
        return `</h2>${meta(section.importance, ui, tags)}`;
      }
    );
  }
  return `<article id="${section.id}" class="mk-section" data-importance="${section.importance}" data-group="${section.group}">
${html}<p class="mk-edit"><a href="${sourceUrl(lang, section.file)}" rel="noopener">${ui.edit}</a></p>
</article>`;
}

// One language's page: every section, the menu, and what the head needs for search engines and link previews.
export function page({ lang, sections, updated, assets }) {
  const ui = UI[lang];
  const articles = sections.map((section) => article(section, sections, ui, lang)).join('\n');
  const { prefix, hreflang, locale } = LANGS.find(({ code }) => code === lang);
  const url = `${SITE}${prefix}/`;
  const home = sections.find(({ id }) => id === 'home');
  const image = `${SITE}/og/${lang}.png`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: 'Matreshka.js', url: `${SITE}/`, inLanguage: LANGS.map((l) => l.hreflang) },
      {
        '@type': 'SoftwareSourceCode',
        name: 'Matreshka.js',
        description: home.description,
        url,
        codeRepository: REPO,
        programmingLanguage: 'JavaScript',
        runtimePlatform: 'Web browser',
        license: `${REPO}/blob/main/LICENSE`,
        inLanguage: hreflang,
        dateModified: updated,
        author: { '@type': 'Person', name: 'Andrey Gubanov', url: 'https://github.com/finom' }
      }
    ]
  }).replace(/</g, '\\u003c');
  const data = JSON.stringify({
    old: oldAnchorsOf(lang, sections),
    copy: ui.copy,
    copied: ui.copied,
    previous: ui.previous,
    next: ui.next
  }).replace(/</g, '\\u003c');
  const year = updated.slice(0, 4);
  const head = `(function(){var d=document.documentElement,l;d.classList.add('mk-js');try{var s=localStorage,t=s.getItem('mk-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))d.classList.add('dark');l=s.getItem('mk-level');if(s.getItem('mk-mode')==='one')d.classList.add('mk-one')}catch(e){}d.classList.add('mk-level-'+(l==='2'||l==='3'?l:'1'))})()`;

  return `<!doctype html>
<html lang="${hreflang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(home.title)}</title>
<meta name="description" content="${escapeHtml(home.description)}">
<link rel="canonical" href="${url}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${SITE}${l.prefix}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Matreshka.js">
<meta property="og:title" content="${escapeHtml(home.title)}">
<meta property="og:description" content="${escapeHtml(home.description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${locale}">
${LANGS.filter((l) => l.code !== lang)
  .map((l) => `<meta property="og:locale:alternate" content="${l.locale}">`)
  .join('\n')}
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@andrey_gubanov1">
<meta name="twitter:image" content="${image}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/${assets.css}">
<style>${codeColorsCss()}</style>
<script>${head}</script>
<script type="application/ld+json">${jsonLd}</script>
</head>
<body>
<a class="mk-skip" href="#main">${ui.skip}</a>
<header class="mk-header"><div class="mk-header-inner">
  <button type="button" class="mk-icon-button mk-menu-button" id="mk-menu" aria-label="${ui.menu}" aria-controls="mk-nav" aria-expanded="false">${ICONS.menu}</button>
  <a class="mk-brand" href="#home"><img src="/logo/matreshka.svg" alt="" width="17" height="32"><b>Matreshka.js</b></a>
  <span class="mk-version">3.0</span>
  <div class="mk-header-end">
    <nav class="mk-langs" aria-label="${ui.languages}">${LANGS.map(
      (l) =>
        `<a href="${l.prefix}/" hreflang="${l.hreflang}"${l.code === lang ? ' aria-current="page"' : ''}>${l.code.toUpperCase()}</a>`
    ).join('')}</nav>
    ${iconLink(REPO, 'GitHub', ICONS.github)}
    ${iconLink(DISCORD, 'Discord', ICONS.discord, ' mk-wide-only')}
    ${iconLink(X, 'X', ICONS.x, ' mk-wide-only')}
    <button type="button" class="mk-icon-button" id="mk-theme" aria-label="${ui.theme}" title="${ui.theme}"><span class="mk-light">${ICONS.moon}</span><span class="mk-dark">${ICONS.sun}</span></button>
  </div>
  </div>
</header>
<div class="mk-layout">
  <aside class="mk-nav" id="mk-nav" aria-label="${ui.menu}">${menu(sections, ui, lang)}
    <p class="mk-updated">${ui.updated} <time datetime="${updated}">${updated}</time></p>
  </aside>
  <main id="main" class="mk-main">
${articles}
    <nav class="mk-pager" id="mk-pager"></nav>
    <footer class="mk-footer">© 2013–${year} <a href="https://github.com/finom" rel="noopener">Andrey Gubanov</a> · <a href="${REPO}/blob/main/LICENSE" rel="noopener">${ui.license}</a> · <a href="${REPO}" rel="noopener">GitHub</a></footer>
  </main>
</div>
<div class="mk-backdrop" id="mk-backdrop"></div>
<script id="mk-data" type="application/json">${data}</script>
<script src="/matreshka.min.js"></script>
<script src="/${assets.js}"></script>
</body>
</html>
`;
}

// The 404 page GitHub Pages serves for any missing path, in English with links to all three languages.
export function notFound({ assets }) {
  const ui = UI.en;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ui.notFound} | Matreshka.js</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="stylesheet" href="/${assets.css}">
<script>(function(){try{if(localStorage.getItem('mk-theme')==='dark'||(!localStorage.getItem('mk-theme')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()</script>
</head>
<body>
<main class="mk-not-found">
  <img src="/logo/matreshka.svg" alt="" width="64" height="64">
  <h1>${ui.notFound}</h1>
  <p>${ui.notFoundText}</p>
  <p class="mk-buttons">${LANGS.map(
    (l) => `<a class="mk-button mk-button-outline" href="${l.prefix}/" hreflang="${l.hreflang}">${l.name}</a>`
  ).join('')}</p>
</main>
</body>
</html>
`;
}
