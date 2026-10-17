import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

// %size-min%, %size-gzip% and %size-brotli% in a page's text: the bundle's size in kB, minified, gzipped and with
// brotli, written the way the page's language writes numbers
export function fillSizes(text, lang, bundle) {
  const sizes = {
    min: bundle.length,
    gzip: gzipSync(bundle, { level: 9 }).length,
    brotli: brotliCompressSync(bundle, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length
  };
  const format = (bytes) =>
    (bytes / 1000).toLocaleString(lang === 'en' ? 'en' : 'uk', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return text.replace(/%size-(min|gzip|brotli)%/g, (_, kind) => format(sizes[kind]));
}
