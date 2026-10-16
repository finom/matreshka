import { LANGS } from '@/lib/site';
import './globals.css';

export const metadata = { title: 'Page not found | Matreshka.js', robots: { index: false } };

const TEXT = {
  en: ['This page could not be found.', 'Go to the home page'],
  ua: ['Сторінку не знайдено.', 'На головну'],
  ru: ['Страница не найдена.', 'На главную']
};

// The 404 page for every language: the site has a root layout per language, so this one brings its own <html>.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="mk-not-found">
        <h1>404</h1>
        {LANGS.map(({ code, prefix, hreflang }) => (
          <p key={code} lang={hreflang}>
            {TEXT[code][0]} <a href={`${prefix}/`}>{TEXT[code][1]}</a>
          </p>
        ))}
      </body>
    </html>
  );
}
