import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE}/sitemap.xml` };
}
