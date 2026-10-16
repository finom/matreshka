import { readFileSync } from 'node:fs';
import path from 'node:path';
import oldAnchors from './old-anchors.json' with { type: 'json' };

export const SITE = 'https://matreshka.js.org';
export const REPO = 'https://github.com/finom/matreshka';
export const CONTENT = path.join(import.meta.dirname, '..', 'content');

// English at the root, the others under their prefix, as on the old site. `hreflang` is the ISO code: Ukrainian is
// `uk`, while its URL keeps the old `/ua/`.
export const LANGS = [
  { code: 'en', prefix: '', hreflang: 'en', locale: 'en_US', name: 'English' },
  { code: 'ua', prefix: '/ua', hreflang: 'uk', locale: 'uk_UA', name: 'Українська' },
  { code: 'ru', prefix: '/ru', hreflang: 'ru', locale: 'ru_RU', name: 'Русский' }
];

// The page order and the menu. Paths are files under content/<lang>/ without `.md`.
export const START = ['index', 'introduction', 'getting-started', 'website-instructions', 'examples'];
export const INFO = ['faq'];
export const API = [
  {
    dir: 'matreshka',
    index: true,
    members: [
      'bind-node',
      'bind-optional-node',
      'calc',
      'instantiate',
      'mediate',
      'off',
      'on',
      'once',
      'on-debounce',
      'parse-bindings',
      'select',
      'select-all',
      'set',
      'trigger',
      'unbind-node',
      'dollar-nodes',
      'bind-sandbox',
      'is-matreshka',
      'nodes',
      'remove'
    ]
  },
  {
    dir: 'matreshka-static',
    index: false,
    members: [
      'bind-node',
      'calc',
      'chain',
      'class',
      'mediate',
      'on',
      'default-binders',
      'bind-optional-node',
      'bind-sandbox',
      'instantiate',
      'look-for-binder',
      'off',
      'once',
      'on-debounce',
      'parse-bindings',
      'parser-brackets',
      'remove',
      'select',
      'select-all',
      'set',
      'to-matreshka',
      'trigger',
      'unbind-node'
    ]
  },
  {
    dir: 'matreshka-object',
    index: true,
    members: [
      'add-data-keys',
      'each',
      'is-data-key',
      'key-of',
      'keys',
      'remove-data-keys',
      'set-data',
      'to-json',
      'entries',
      'is-matreshka-object',
      'values'
    ]
  },
  {
    dir: 'matreshka-array',
    index: true,
    members: [
      'from',
      'mediate-item',
      'method',
      'method-silent',
      'model',
      'of',
      'on-item-render',
      'order-by',
      'pull',
      'recreate',
      'restore',
      'to-json',
      'item-renderer',
      'track-by',
      'is-matreshka-array',
      'render-if-possible',
      'rerender'
    ]
  },
  {
    dir: 'binders',
    index: true,
    members: [
      'attr',
      'class-name',
      'dataset',
      'display',
      'existence',
      'html',
      'prop',
      'style',
      'text',
      'input',
      'output',
      'progress',
      'select',
      'textarea'
    ]
  },
  {
    dir: 'types',
    index: false,
    members: [
      'any',
      'dollar-nodes',
      'array',
      'binder',
      'boolean',
      'class',
      'event-handler',
      'event-names',
      'event-options',
      'function',
      'matreshka',
      'matreshka-array',
      'matreshka-object',
      'node',
      'null',
      'number',
      'object',
      'string'
    ]
  }
];

// The front matter fields the pages use: `key: "JSON string"` or `key: number`.
export const frontMatterOf = (md) =>
  Object.fromEntries(
    Array.from((/^---\n([\s\S]*?)\n---\n/.exec(md)?.[1] ?? '').matchAll(/^(\w+): (.+)$/gm), ([, key, value]) => [
      key,
      JSON.parse(value)
    ])
  );

// A section's id is its old anchor without `#!`: `Matreshka-bindNode`, `Matreshka.binders.html`. Types and the guide
// pages, which had no member anchor, use their file name.
function idOf(file, title) {
  if (file === 'index') return 'home';
  if (file.startsWith('api/types/')) return `type-${file.slice('api/types/'.length)}`;
  if (file.startsWith('api/')) return title.replace('#', '-');
  return file;
}

// The route each section had as a page of its own, so links written as routes resolve to sections.
const routeOf = (file) => (file === 'index' ? '/' : `/${file}/`);

// Every section of one language in page order, with the menu group it belongs to.
export function sectionsOf(lang) {
  const read = (file, group) => {
    const source = readFileSync(path.join(CONTENT, lang, `${file}.md`), 'utf8');
    const { title, sidebarTitle, description, importance } = frontMatterOf(source);
    return {
      file,
      group,
      route: routeOf(file),
      id: idOf(file, title),
      title,
      menuTitle: sidebarTitle ?? title,
      description,
      importance: importance ?? 0,
      source,
      body: source.replace(/^---\n[\s\S]*?\n---\n/, '')
    };
  };
  return [
    ...START.map((file) => read(file, 'start')),
    ...API.flatMap(({ dir, index, members }) => [
      ...(index ? [read(`api/${dir}`, dir)] : []),
      ...members.map((member) => read(`api/${dir}/${member}`, dir))
    ]),
    ...INFO.map((file) => read(file, 'info'))
  ];
}

// The heading id inside a section: `Matreshka-bindNode--variation-2`.
export const subId = (sectionId, hash) => `${sectionId}--${hash}`;

// Old `#!` anchors (and the `@oldlink` names of renamed members) → the id they now open.
export function oldAnchorsOf(lang, sections) {
  const byRoute = new Map(sections.map((section) => [section.route, section.id]));
  const map = {};
  const { prefix } = LANGS.find(({ code }) => code === lang);
  for (const [anchor, target] of Object.entries(oldAnchors[lang])) {
    const [path, hash] = target.split('#');
    const route = path.slice(prefix.length);
    const id = byRoute.get(route);
    if (id) map[anchor] = hash ? subId(id, hash) : id;
  }
  for (const id of ['home', 'introduction', 'getting-started', 'website-instructions', 'examples', 'faq']) map[id] = id;
  return map;
}

// The URL of a route in this language, as written in a link: `/ru/api/matreshka/calc/#x` → `#Matreshka-calc--x`.
// Returns null for links that point elsewhere (another language, a static file, an example).
export function linkTarget(href, lang, sections) {
  const { prefix } = LANGS.find(({ code }) => code === lang);
  const [pathPart, hash] = href.split('#');
  if (!pathPart.startsWith('/') || pathPart.startsWith('//')) return null;
  const route = prefix && pathPart.startsWith(`${prefix}/`) ? pathPart.slice(prefix.length) : prefix ? null : pathPart;
  if (route === null) return null;
  const section = sections.find((item) => item.route === route);
  if (!section) return null;
  return `#${hash ? subId(section.id, hash) : section.id}`;
}
