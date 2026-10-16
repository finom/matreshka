import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';
import { LANGS, langOf, routeOfFile } from '@/lib/site';

const APP = path.join(process.cwd(), 'src/app');

// The front matter fields the pages use: `key: "JSON string"`.
export const frontMatterOf = (mdx) =>
  Object.fromEntries(
    Array.from((/^---\n([\s\S]*?)\n---\n/.exec(mdx)?.[1] ?? '').matchAll(/^(\w+): (.+)$/gm), ([, key, value]) => [
      key,
      JSON.parse(value)
    ])
  );

// Every MDX page under src/app with its route, language and front matter.
export function allPages() {
  return readdirSync(APP, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('page.mdx'))
    .map((file) => {
      const mdx = readFileSync(path.join(APP, file), 'utf8');
      const route = routeOfFile(`src/app/${file}`);
      const { title = route, description = '' } = frontMatterOf(mdx);
      return { file, route, lang: langOf(route).code, title, description, mdx };
    });
}

async function sidebarOrder(lang) {
  const others = LANGS.filter(({ prefix }) => prefix && prefix !== lang.prefix).map(({ prefix }) => prefix.slice(1));
  const list = (await getPageMap(lang.prefix || '/')).filter((item) => !('name' in item && others.includes(item.name)));
  const routes = normalizePages({ list, route: lang.prefix || '/' }).flatDocsDirectories.map(({ route }) => route);
  return routes.map((route) => (route.endsWith('/') ? route : `${route}/`));
}

// Every page in sidebar order, per language: English first.
export async function docsPages() {
  const pages = allPages();
  const sorted = [];
  for (const lang of LANGS) {
    const order = await sidebarOrder(lang);
    const rank = (route) => (order.includes(route) ? order.indexOf(route) : order.length);
    sorted.push(...pages.filter((page) => page.lang === lang.code).sort((a, b) => rank(a.route) - rank(b.route)));
  }
  return sorted;
}
