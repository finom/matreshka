import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';
import { isStatic } from '@/components/static-link';
import { LANGS, ogImage, pathOf, routeOfFile, SITE } from '@/lib/site';
import { jsonLd } from '@/lib/structured-data';

// Each page's address, its other languages, social card and structured data. React moves the link and meta tags into
// <head>; the root layout sets the rest of Open Graph.
function Wrapper(props) {
  const { wrapper: ThemeWrapper = ({ children }) => children } = getThemeComponents();
  const { filePath, title, description } = props.metadata;
  const route = routeOfFile(filePath);
  const image = SITE + ogImage(route);
  const path = pathOf(route);
  return (
    <>
      <link rel="canonical" href={SITE + route} />
      {LANGS.map(({ code, prefix, hreflang }) => (
        <link key={code} rel="alternate" hrefLang={hreflang} href={SITE + prefix + path} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={SITE + path} />
      <meta property="og:url" content={SITE + route} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: our own JSON, escaped by `jsonLd`
        dangerouslySetInnerHTML={{ __html: jsonLd(route, title, description ?? '') }}
      />
      <ThemeWrapper {...props} />
    </>
  );
}

// Read per call, not copied at module scope: a hot reload can leave a module-scope copy undefined.
export function useMDXComponents(components) {
  const theme = getThemeComponents();
  const ThemeLink = theme.a;
  const a = (props) => (isStatic(props.href) ? <a {...props} /> : <ThemeLink {...props} />);
  return { ...theme, a, wrapper: Wrapper, ...components };
}
