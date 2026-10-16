import { LANGS, langOf, REPO, SITE } from '@/lib/site';

// Schema.org data as the text of a JSON-LD script: the project on each language's home page, an article elsewhere.
// "<" is escaped so the text cannot close the script tag.
export function jsonLd(route, title, description) {
  const lang = langOf(route);
  const home = `${SITE}${lang.prefix}/`;
  const website = {
    '@type': 'WebSite',
    name: 'Matreshka.js',
    url: `${SITE}/`,
    inLanguage: LANGS.map((l) => l.hreflang)
  };
  const author = { '@type': 'Person', name: 'Andrey Gubanov', url: 'https://github.com/finom' };
  const data =
    route === `${lang.prefix}/`
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            website,
            {
              '@type': 'SoftwareSourceCode',
              name: 'Matreshka.js',
              description,
              url: home,
              codeRepository: REPO,
              programmingLanguage: 'JavaScript',
              runtimePlatform: 'Web browser',
              license: `${REPO}/blob/main/LICENSE`,
              inLanguage: lang.hreflang,
              author
            }
          ]
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: title,
          description,
          url: SITE + route,
          inLanguage: lang.hreflang,
          author,
          isPartOf: website,
          about: { '@type': 'SoftwareSourceCode', name: 'Matreshka.js', codeRepository: REPO }
        };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
