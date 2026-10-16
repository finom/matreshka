export const SITE = 'https://matreshka.js.org';
export const REPO = 'https://github.com/finom/matreshka';

// English at the root, the others under their prefix, as on the old site. `hreflang` is the ISO code: Ukrainian is
// `uk`, while its URL keeps the old `/ua/`.
export const LANGS = [
  { code: 'en', prefix: '', hreflang: 'en', name: 'English', short: 'EN' },
  { code: 'ua', prefix: '/ua', hreflang: 'uk', name: 'Українська', short: 'UA' },
  { code: 'ru', prefix: '/ru', hreflang: 'ru', name: 'Русский', short: 'RU' }
];

export const langOf = (route) =>
  LANGS.find(({ prefix }) => prefix && (route === prefix || route.startsWith(`${prefix}/`))) ?? LANGS[0];

// A route without its language prefix: `/ru/faq/` → `/faq/`.
export const pathOf = (route) => {
  const { prefix } = langOf(route);
  return route.slice(prefix.length) || '/';
};

// The same page in another language.
export const routeIn = (code, route) => `${LANGS.find((lang) => lang.code === code).prefix}${pathOf(route)}`;

// A page's social card, written by `app/og/[...slug]/route.jsx`.
export const ogImage = (route) => `/og${route === '/' ? '' : route.replace(/\/$/, '')}/card.png`;

// The route of an MDX page from its file path: `src/app/(en)/api/matreshka/calc/page.mdx` → `/api/matreshka/calc/`.
export const routeOfFile = (filePath) => {
  const path = filePath
    .replace(/^.*?src\/app\//, '')
    .replace(/\([^)]*\)\/?/g, '')
    .replace(/\/?page\.mdx$/, '');
  return path ? `/${path}/` : '/';
};
