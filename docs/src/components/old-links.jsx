import { oldLinks } from '@/lib/old-links';
import { LANGS } from '@/lib/site';

// Sends an old `#!` link (`/#!Matreshka-calc`) to its page before the page renders. An unknown anchor goes to the API
// index. A plain `#anchor` the old site also accepted is followed only when it is a known one.
export function OldLinks({ lang }) {
  const map = JSON.stringify(oldLinks(lang)).replace(/</g, '\\u003c');
  const fallback = JSON.stringify(`${LANGS.find(({ code }) => code === lang).prefix}/api/`);
  const script = `(function(){var m=${map},h=location.hash,b=h.indexOf('#!')===0,id;try{id=decodeURIComponent(h.slice(b?2:1))}catch(e){id=h.slice(b?2:1)}if(!b&&!m[id])return;var r=m[id]||m[id.replace('#','-')]||${fallback};if(r===location.pathname)history.replaceState(null,'',r);else location.replace(r)})()`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: our own script with JSON-escaped data
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
