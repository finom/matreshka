import { allPages } from '@/lib/docs-pages';
import { LANGS, pathOf, SITE } from '@/lib/site';

export const dynamic = 'force-static';

// Every page, with the same page in the other languages as alternates.
export default function sitemap() {
  return allPages()
    .sort((a, b) => (a.route < b.route ? -1 : 1))
    .map(({ route }) => ({
      url: SITE + route,
      alternates: {
        languages: {
          ...Object.fromEntries(LANGS.map(({ prefix, hreflang }) => [hreflang, SITE + prefix + pathOf(route)])),
          'x-default': SITE + pathOf(route)
        }
      }
    }));
}
