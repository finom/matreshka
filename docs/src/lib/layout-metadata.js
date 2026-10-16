import { UI } from '@/lib/i18n';
import { SITE } from '@/lib/site';

// Each language's root layout metadata. The canonical URL, alternates and the image are each page's own.
export const layoutMetadata = (code) => ({
  metadataBase: new URL(SITE),
  title: { default: 'Matreshka.js', template: '%s | Matreshka.js' },
  description: UI[code].description,
  applicationName: 'Matreshka.js',
  openGraph: { siteName: 'Matreshka.js', type: 'website', locale: { en: 'en_US', ua: 'uk_UA', ru: 'ru_RU' }[code] },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
});
