import MarkdownIt from 'markdown-it';
import { createHighlighter } from 'shiki';
import { linkTarget, REPO, subId } from './site.mjs';

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['js', 'ts', 'html', 'css', 'json', 'sh']
});

// Shiki writes each token's light and dark color inline. The page holds thousands of tokens, so each color pair gets a
// short class instead, and the plain text color none at all.
const colorClasses = new Map();
const PLAIN = 'color:#24292E;--shiki-dark:#E1E4E8';
const compactColors = (html) =>
  html
    .replace(/<pre class="shiki([^"]*)" style="[^"]*"/, '<pre class="shiki$1"')
    .replace(/<span style="([^"]*)">/g, (_, style) => {
      if (style === PLAIN) return '<span>';
      if (!colorClasses.has(style)) colorClasses.set(style, `c${colorClasses.size}`);
      return `<span class="${colorClasses.get(style)}">`;
    });

// The CSS for the classes the rendered code used.
export const codeColorsCss = () =>
  Array.from(colorClasses, ([style, name]) => {
    const light = /(?:^|;)color:([^;]+)/.exec(style)?.[1];
    const dark = /--shiki-dark:([^;]+)/.exec(style)?.[1];
    const font = /font-style:([^;]+)/.exec(style)?.[1];
    // github-light's orange and github-dark's comment gray are below the 4.5:1 contrast text needs; these are above it
    const lightColor = light === '#E36209' ? '#BC4C00' : light;
    const darkColor = dark === '#6A737D' ? '#959DA5' : dark;
    return `.${name}{color:${lightColor}${font ? `;font-style:${font}` : ''}}.dark .${name}{color:${darkColor}}`;
  }).join('');

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The heading id GitHub (and the old pages) gave a heading: lower case, punctuation dropped, spaces to dashes.
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');

const LABELS = {
  en: { demo: 'Open demo', source: 'Source' },
  ua: { demo: 'Відкрити демо', source: 'Код' },
  ru: { demo: 'Открыть демо', source: 'Код' }
};

// One renderer per section: headings move one level down (the page has one h1), their ids get the section's id in
// front, and links to other sections become anchors on this page.
export function renderSection(section, lang, sections) {
  const md = new MarkdownIt({ html: true });
  const seen = new Map();
  const isHome = section.id === 'home';
  // the level of the last heading; a heading never goes more than one level below it
  let last = isHome ? 1 : 2;

  md.renderer.rules.heading_open = (tokens, i) => {
    const token = tokens[i];
    const inline = tokens[i + 1];
    const level = Number(token.tag.slice(1));
    const explicit = / \[#([\w-]+)\]$/.exec(inline.content);
    if (explicit) {
      inline.content = inline.content.slice(0, explicit.index);
      inline.children.at(-1).content = inline.children.at(-1).content.replace(/ \[#[\w-]+\]$/, '');
    }
    const shifted = level === 1 ? (isHome ? 1 : 2) : Math.min(isHome ? level : level + 1, last + 1, 6);
    last = shifted;
    const tag = `h${shifted}`;
    token.tag = tag;
    tokens.find((item, j) => j > i && item.type === 'heading_close').tag = tag;
    if (level === 1) return `<${tag} class="mk-title"><a href="#${section.id}">`;
    // the heading's text only: inline HTML such as the level circles is not part of the id
    const text = inline.children.filter(({ type }) => type !== 'html_inline').map((child) => child.content);
    let hash = explicit?.[1] ?? slug(text.join('').trim());
    const count = seen.get(hash) ?? 0;
    seen.set(hash, count + 1);
    if (count) hash = `${hash}-${count}`;
    const id = subId(section.id, hash);
    return `<${tag} id="${id}"><a class="mk-anchor" href="#${id}">`;
  };
  md.renderer.rules.heading_close = (tokens, i) => `</a></${tokens[i].tag}>`;

  md.renderer.rules.link_open = (tokens, i, options, _env, self) => {
    const token = tokens[i];
    const href = token.attrGet('href');
    const target = linkTarget(href, lang, sections);
    if (target) token.attrSet('href', target);
    else if (/^https?:/.test(href)) token.attrSet('rel', 'noopener');
    return self.renderToken(tokens, i, options);
  };

  md.renderer.rules.fence = (tokens, i) => {
    const { content, info } = tokens[i];
    const lang = info.trim() || 'text';
    const code = highlighter.codeToHtml(content.replace(/\n$/, ''), {
      lang: lang === 'text' ? 'text' : lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light'
    });
    return `<div class="mk-code">${compactColors(code)}<button type="button" class="mk-copy" aria-label="Copy code"></button></div>\n`;
  };

  md.renderer.rules.table_open = () => '<div class="mk-table"><table>';
  md.renderer.rules.table_close = () => '</table></div>';

  const examples = (body) =>
    body.replace(/^::: examples\n([\s\S]*?)^:::\n(?!:::)/gm, (_, inner) => {
      const cards = inner.replace(
        /^::: example (\S+) (\S+) (.+)\n([\s\S]*?)^:::\n/gm,
        (__, demo, source, title, text) => {
          const labels = LABELS[lang];
          return `<div class="mk-example"><h4 id="${subId(section.id, slug(title))}"><a href="${demo}">${escapeHtml(title)}</a></h4><div class="mk-example-text">${md.render(text)}</div><div class="mk-example-buttons"><a class="mk-button mk-button-primary mk-button-sm" href="${demo}">${labels.demo}</a><a class="mk-button mk-button-outline mk-button-sm" href="${source}" rel="noopener">${labels.source}</a></div></div>`;
        }
      );
      return `<div class="mk-examples">${cards}</div>\n\n`;
    });

  return md.render(examples(section.body));
}

// The link to a section's source file, for the "Edit on GitHub" line.
export const sourceUrl = (lang, file) => `${REPO}/blob/main/docs/content/${lang}/${file}.md`;

export { escapeHtml };
