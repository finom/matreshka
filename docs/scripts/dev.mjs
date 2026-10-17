// Builds the site, serves out/ on http://localhost:4807 and builds again when content/, src/ or public/ change.
//   npm run dev -w matreshka-docs
import { execFileSync } from 'node:child_process';
import { createReadStream, existsSync, statSync, watch } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { createGzip } from 'node:zlib';

const DOCS = path.join(import.meta.dirname, '..');
const OUT = path.join(DOCS, 'out');
const PORT = Number(process.env.PORT ?? 4807);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon'
};

const build = () => {
  try {
    execFileSync(process.execPath, [path.join(import.meta.dirname, 'build.mjs')], { stdio: 'inherit' });
  } catch {}
};
build();

let timer;
for (const dir of ['content', 'src', 'public']) {
  watch(path.join(DOCS, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 200);
  });
}

createServer((request, response) => {
  let file = path.join(OUT, decodeURIComponent(new URL(request.url, 'http://x').pathname));
  if (!file.startsWith(OUT)) file = OUT;
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  const found = existsSync(file);
  const type = TYPES[found ? path.extname(file) : '.html'] ?? 'application/octet-stream';
  // gzip text, as GitHub Pages does
  const gzip = /text|json|xml|svg/.test(type) && /gzip/.test(request.headers['accept-encoding'] ?? '');
  response.writeHead(found ? 200 : 404, {
    'cache-control': 'no-store',
    'content-type': type,
    ...(gzip ? { 'content-encoding': 'gzip' } : {})
  });
  const stream = createReadStream(found ? file : path.join(OUT, '404.html'));
  (gzip ? stream.pipe(createGzip()) : stream).pipe(response);
}).listen(PORT, () => console.log(`http://localhost:${PORT}/`));
