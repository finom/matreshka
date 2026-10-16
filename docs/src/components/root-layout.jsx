import { Head } from 'nextra/components';
import { LANGS } from '@/lib/site';
import { DocsShell } from './docs-shell';

// The <html> of one language. suppressHydrationWarning lets next-themes set the class on it.
export function RootLayout({ code, children }) {
  const { hreflang } = LANGS.find((lang) => lang.code === code);
  return (
    <html lang={hreflang} dir="ltr" suppressHydrationWarning>
      <Head
        // The green of the logo
        color={{
          hue: { light: 122, dark: 122 },
          saturation: { light: 45, dark: 45 },
          lightness: { light: 34, dark: 60 }
        }}
        backgroundColor={{ light: '#ffffff', dark: '#111111' }}
      />
      <body>
        <DocsShell code={code}>{children}</DocsShell>
      </body>
    </html>
  );
}
