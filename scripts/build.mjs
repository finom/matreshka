// npm run build: src/ → dist/ as ES modules with type declarations (tsc), then the bundles from that output:
// dist/matreshka.js (UMD, global `Matreshka` with the router and the form parser), its minified copy, and
// dist/matreshka.min.mjs, the same as one minified ES module for a CDN (named exports, the router and the parser included).
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import terser from '@rollup/plugin-terser';
import { rollup } from 'rollup';

rmSync('dist', { recursive: true, force: true });
execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json'], { stdio: 'inherit' });

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const banner = `/*! Matreshka.js v${version} | MIT | https://matreshka.js.org */`;

const bundle = await rollup({
  input: 'dist/bundle.js',
  onwarn(warning, warn) {
    // the modules import each other in cycles and use the bindings only at call time
    if (warning.code !== 'CIRCULAR_DEPENDENCY') warn(warning);
  }
});
const output = { format: 'umd', name: 'Matreshka', exports: 'default', banner };
await bundle.write({ ...output, file: 'dist/matreshka.js' });
await bundle.write({
  ...output,
  file: 'dist/matreshka.min.js',
  sourcemap: true,
  plugins: [terser({ ecma: 2020, compress: { ecma: 2020, passes: 3 }, format: { comments: /^!/ } })]
});
await bundle.close();

// a CDN serves dist/index.js as 169 unminified files; this is one file with every export
const entry = 'matreshka-cdn-entry';
const esm = await rollup({
  input: entry,
  plugins: [
    {
      name: 'cdn-entry',
      resolveId: (id) => (id === entry ? id : null),
      load: (id) =>
        id === entry
          ? [
              "export * from './dist/index.js';",
              "export { default } from './dist/bundle.js';",
              "export { initRouter, Router } from './dist/router/index.js';",
              "export { parseForm } from './dist/parse-form/index.js';"
            ].join('\n')
          : null
    }
  ],
  onwarn(warning, warn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') warn(warning);
  }
});
await esm.write({
  format: 'es',
  file: 'dist/matreshka.min.mjs',
  banner,
  sourcemap: true,
  plugins: [terser({ ecma: 2020, module: true, compress: { ecma: 2020, passes: 3 }, format: { comments: /^!/ } })]
});
await esm.close();
