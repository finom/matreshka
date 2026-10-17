// npm run build: src/ → dist/ as ES modules with type declarations (tsc), compiled to ES5 for IE 11 (Babel; import and
// export stay), then the bundles: dist/matreshka.js (UMD, global `Matreshka` with the router and the form parser) and
// its minified copy, from the ES5 code; dist/matreshka.min.mjs, the same as one minified ES module for a CDN (named
// exports, the router and the parser included), from the code before Babel: a browser that runs modules isn't IE 11.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { transformSync } from '@babel/core';
import terser from '@rollup/plugin-terser';
import { rollup } from 'rollup';

rmSync('dist', { recursive: true, force: true });
execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json'], { stdio: 'inherit' });
const modern = mkdtempSync(join(tmpdir(), 'matreshka-modern-'));
process.on('exit', () => rmSync(modern, { recursive: true, force: true }));
cpSync('dist', modern, { recursive: true });

// the browsers jQuery 4 supports; the source avoids what needs a Babel helper, so every file stays small
const babelOptions = {
  babelrc: false,
  configFile: false,
  presets: [['@babel/preset-env', { targets: 'ie 11', modules: false, exclude: ['transform-typeof-symbol'] }]],
  assumptions: {
    iterableIsArray: true,
    noDocumentAll: true,
    pureGetters: true,
    setSpreadProperties: true,
    noNewArrows: true,
    ignoreFunctionLength: true,
    ignoreToPrimitiveHint: true,
    mutableTemplateObject: true,
    constantReexports: true,
    setPublicClassFields: true,
    setClassMethods: true,
    noClassCalls: true
  }
};
const compileDir = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) compileDir(path);
    else if (name.endsWith('.js')) writeFileSync(path, transformSync(readFileSync(path, 'utf8'), babelOptions).code);
  }
};
compileDir('dist');

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
  plugins: [terser({ ecma: 5, compress: { passes: 3 }, format: { comments: /^!/ } })]
});
await bundle.close();

// a CDN serves dist/index.js as 169 unminified files; this is one file with every export
const from = (file) => `./${relative(process.cwd(), join(modern, file)).split('\\').join('/')}`;
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
              `export * from '${from('index.js')}';`,
              `export { default } from '${from('bundle.js')}';`,
              `export { initRouter, Router } from '${from('router/index.js')}';`,
              `export { parseForm } from '${from('parse-form/index.js')}';`
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
  // the sources sit next to the map, as dist/ has them
  sourcemapPathTransform: (source) => source.replace(/^.*matreshka-modern-[^/\\]+[/\\]/, ''),
  plugins: [terser({ ecma: 2020, module: true, compress: { ecma: 2020, passes: 3 }, format: { comments: /^!/ } })]
});
await esm.close();
