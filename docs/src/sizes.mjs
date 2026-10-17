import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const brotli = (file) => brotliCompressSync(file, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;

// %size-min%, %size-gzip% and %size-brotli% in a page's text: the bundle's size in kB, minified, gzipped and with
// brotli; %core-size-brotli%: the core file's size with brotli. Written the way the page's language writes numbers.
export function fillSizes(text, lang, bundle, core) {
  const sizes = {
    'size-min': bundle.length,
    'size-gzip': gzipSync(bundle, { level: 9 }).length,
    'size-brotli': brotli(bundle),
    'core-size-brotli': brotli(core)
  };
  const format = (bytes) =>
    (bytes / 1000).toLocaleString(lang === 'en' ? 'en' : 'uk', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return text.replace(/%((?:core-)?size-(?:min|gzip|brotli))%/g, (_, kind) => format(sizes[kind]));
}
