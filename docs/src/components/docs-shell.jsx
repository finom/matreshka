import { Search } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs';
import 'nextra-theme-docs/style.css';
import '../app/globals.css';
import { UI } from '@/lib/i18n';
import { LANGS, REPO } from '@/lib/site';
import { LanguageSwitch } from './language-switch';

// The other languages' folders sit under the English root, so its page map leaves them out.
async function pageMapOf(lang) {
  if (lang.prefix) return getPageMap(lang.prefix);
  const others = LANGS.filter(({ prefix }) => prefix).map(({ prefix }) => prefix.slice(1));
  return (await getPageMap('/')).filter((item) => !('name' in item && others.includes(item.name)));
}

// The navbar and footer are built in render: built at module scope, a hot reload can leave an import undefined in them.
export async function DocsShell({ code, children }) {
  const lang = LANGS.find((item) => item.code === code);
  const t = UI[code];
  return (
    <Layout
      navbar={
        <Navbar
          logo={
            <span className="mk-logo">
              {/* biome-ignore lint/performance/noImgElement: a static export serves the SVG as is */}
              <img className="mk-light" src="/logo/matreshka.svg" alt="" width={17} height={32} />
              {/* biome-ignore lint/performance/noImgElement: a static export serves the SVG as is */}
              <img className="mk-dark" src="/logo/matreshka-dark.svg" alt="" width={17} height={32} />
              <b>Matreshka.js</b>
            </span>
          }
          logoLink={`${lang.prefix}/`}
          projectLink={REPO}
        >
          <LanguageSwitch label={t.language} />
        </Navbar>
      }
      footer={
        <Footer>
          <span>
            <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
              {t.license}
            </a>{' '}
            © {new Date().getFullYear()}{' '}
            <a href="https://github.com/finom" target="_blank" rel="noreferrer">
              Andrey Gubanov
            </a>{' '}
            ·{' '}
            <a href={REPO} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </span>
        </Footer>
      }
      search={
        <Search
          placeholder={t.search}
          emptyResult={t.searchEmpty}
          errorText={t.searchError}
          loading={t.searchLoading}
        />
      }
      editLink={t.editLink}
      feedback={{ content: t.feedback, labels: 'docs' }}
      toc={{ title: t.toc, backToTop: t.backToTop }}
      themeSwitch={{ dark: t.dark, light: t.light, system: t.system }}
      lastUpdated={<LastUpdated locale={lang.hreflang}>{t.lastUpdated}</LastUpdated>}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
      pageMap={await pageMapOf(lang)}
      docsRepositoryBase={`${REPO}/tree/main/docs`}
    >
      {children}
    </Layout>
  );
}
