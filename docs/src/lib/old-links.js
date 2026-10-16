import anchors from './api-anchors.json';
import { LANGS } from './site';

// The old site was one page per language with `#!` anchors: `/ru/#!Matreshka-calc`. Each anchor's new page.
const PAGES = {
  home: '/',
  introduction: '/introduction/',
  'getting-started': '/getting-started/',
  'website-instructions': '/getting-started/',
  examples: '/examples/',
  faq: '/faq/'
};

export function oldLinks(code) {
  const { prefix } = LANGS.find((lang) => lang.code === code);
  const pages = Object.fromEntries(Object.entries(PAGES).map(([id, path]) => [id, prefix + path]));
  return { ...pages, ...anchors[code] };
}
