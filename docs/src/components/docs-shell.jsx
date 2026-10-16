import { Search } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { DiscordIcon } from 'nextra/icons';
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
          chatLink="https://discord.com/invite/qdT8WEHUuP"
          chatIcon={<DiscordIcon width="24" aria-label="Discord server" />}
        >
          <a href="https://x.com/andrey_gubanov1" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
              <title>Andrey Gubanov on X</title>
              <path d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z" />
            </svg>
          </a>
          <LanguageSwitch label={t.language} />
        </Navbar>
      }
      footer={
        <Footer>
          <span>
            <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
              {t.license}
            </a>{' '}
            © 2013–{new Date().getFullYear()}{' '}
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
