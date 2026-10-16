'use client';
import { usePathname } from 'next/navigation';
import { LANGS, langOf, routeIn } from '@/lib/site';

// The same page in the other languages; every page exists in all three.
export function LanguageSwitch({ label }) {
  const pathname = usePathname() ?? '/';
  const current = langOf(pathname);
  return (
    <nav className="mk-langs" aria-label={label}>
      {LANGS.map(({ code, short, name, hreflang }) =>
        code === current.code ? (
          <b key={code} title={name} aria-current="true">
            {short}
          </b>
        ) : (
          <a key={code} href={routeIn(code, pathname)} hrefLang={hreflang} lang={hreflang} title={name}>
            {short}
          </a>
        )
      )}
    </nav>
  );
}
