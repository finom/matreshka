// npm run build: src/ → dist/ as ES modules with type declarations (tsc), then the bundles from that output:
// dist/matreshka.js (UMD, global `Matreshka` with the router and the form parser), its minified copy,
// dist/matreshka.core.min.js (the same without the router and the parser), and dist/matreshka.min.mjs, the full
// library as one minified ES module for a CDN. The minified files carry short error messages (scripts/short-errors.mjs).
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import terser from '@rollup/plugin-terser';
import { rollup } from 'rollup';

rmSync('dist', { recursive: true, force: true });
execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json'], { stdio: 'inherit' });

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const banner = `/*! Matreshka.js v${version} | MIT | https://matreshka.js.org */`;

// the minified files get the short error messages
const shortErrors = {
  name: 'short-errors',
  load: (id) =>
    id.endsWith(`${path.sep}dist${path.sep}_helpers${path.sep}matreshkaerror.js`)
      ? readFileSync('scripts/short-errors.mjs', 'utf8')
      : null
};
// one virtual entry module: its id and its code
const virtualEntry = (id, code) => ({
  name: 'virtual-entry',
  resolveId: (source) => (source === id ? id : null),
  load: (source) => (source === id ? code : null)
});
const onwarn = (warning, warn) => {
  // the modules import each other in cycles and use the bindings only at call time
  if (warning.code !== 'CIRCULAR_DEPENDENCY') warn(warning);
};
const minify = (module) =>
  terser({ ecma: 2020, module, compress: { ecma: 2020, passes: 3 }, format: { comments: /^!/ } });
const umd = { format: 'umd', name: 'Matreshka', exports: 'default', banner };

async function build(input, plugins, outputs) {
  const bundle = await rollup({ input, plugins, onwarn });
  for (const output of outputs) await bundle.write(output);
  await bundle.close();
}

await build('dist/bundle.js', [], [{ ...umd, file: 'dist/matreshka.js' }]);
await build(
  'dist/bundle.js',
  [shortErrors],
  [{ ...umd, file: 'dist/matreshka.min.js', sourcemap: true, plugins: [minify(false)] }]
);

// Matreshka without the router and the form parser, for a page that uses neither
const core = 'matreshka-core-entry';
await build(
  core,
  [virtualEntry(core, "export { default } from './dist/index.js';"), shortErrors],
  [{ ...umd, file: 'dist/matreshka.core.min.js', sourcemap: true, plugins: [minify(false)] }]
);

// a CDN serves dist/index.js as 169 unminified files; this is one file with every export
const cdn = 'matreshka-cdn-entry';
await build(
  cdn,
  [
    virtualEntry(
      cdn,
      [
        "export * from './dist/index.js';",
        "export { default } from './dist/bundle.js';",
        "export { initRouter, Router } from './dist/router/index.js';",
        "export { parseForm } from './dist/parse-form/index.js';"
      ].join('\n')
    ),
    shortErrors
  ],
  [{ format: 'es', file: 'dist/matreshka.min.mjs', banner, sourcemap: true, plugins: [minify(true)] }]
);
