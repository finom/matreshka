// npm run build: src/ → dist/ as ES modules with type declarations (tsc), then the script-tag bundles from that output:
// dist/matreshka.js (UMD, global `Matreshka` with the router and the form parser) and its minified copy.
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
