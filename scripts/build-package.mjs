// node scripts/build-package.mjs <dir>: src/ → dist/esm and dist/cjs, one file per module, plus a UMD bundle and its
// minified copy for <script> tags and CDNs.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parseSync, transformSync } from '@babel/core';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { rollup } from 'rollup';

const PACKAGES = {
  matreshka: {
    file: 'matreshka',
    global: 'Matreshka',
    title: 'Matreshka.js',
    // the short global `MK` the old bundles had
    footer: 'if (typeof Matreshka === "function") globalThis.MK = Matreshka;'
  },
  router: {
    file: 'matreshka-router',
    global: 'MatreshkaRouter',
    title: 'matreshka-router'
  },
  'parse-form': {
    file: 'matreshka-parse-form',
    global: 'MatreshkaParseForm',
    title: 'matreshka-parse-form'
  }
};

const dir = process.argv[2];
const config = PACKAGES[dir];
if (!config) throw new Error(`Usage: node scripts/build-package.mjs <${Object.keys(PACKAGES).join('|')}>`);

const root = resolve(import.meta.dirname, '..', 'packages', dir);
const src = join(root, 'src');
const dist = join(root, 'dist');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

// Node's ESM loader needs full paths: `./array` → `./array/index.js`, `./set` → `./set.js`
function fullSpecifiers() {
  const rewrite = (path, state) => {
    const source = path.node.source;
    if (!source?.value.startsWith('.')) return;
    const target = resolve(dirname(state.filename), source.value);
    if (existsSync(`${target}.js`)) source.value = `${source.value}.js`;
    else if (existsSync(join(target, 'index.js'))) source.value = `${source.value.replace(/\/$/, '')}/index.js`;
    else throw new Error(`${relative(root, state.filename)}: cannot resolve ${source.value}`);
  };
  return { visitor: { ImportDeclaration: rewrite, ExportNamedDeclaration: rewrite, ExportAllDeclaration: rewrite } };
}

function modules(base = src) {
  return readdirSync(base).flatMap((name) => {
    const path = join(base, name);
    return statSync(path).isDirectory() ? modules(path) : name.endsWith('.js') ? [path] : [];
  });
}

// A module with only a default export is its value in CommonJS (`require('matreshka/array')` is the class), as in
// 2.4. Where `require` loads ES modules, it gets the same value through the `module.exports` export name of a
// `.sync.js` wrapper; every module has one, since the exports map points there by pattern.
function exportKinds(code, filename) {
  const exports = parseSync(code, { filename, babelrc: false, configFile: false }).program.body.filter((node) =>
    node.type.startsWith('Export')
  );
  const hasDefault = exports.some((node) => node.type === 'ExportDefaultDeclaration');
  return { hasDefault, valueOnly: hasDefault && exports.length === 1 };
}

rmSync(dist, { recursive: true, force: true });

for (const file of modules()) {
  const path = relative(src, file);
  const code = readFileSync(file, 'utf8');
  const { hasDefault, valueOnly } = exportKinds(code, file);
  for (const format of ['esm', 'cjs']) {
    const plugins = [fullSpecifiers];
    if (format === 'cjs') plugins.push('@babel/plugin-transform-modules-commonjs');
    let output = transformSync(code, { filename: file, babelrc: false, configFile: false, plugins }).code;
    if (format === 'cjs' && valueOnly) output += '\nmodule.exports = exports.default;\n';
    const out = join(dist, format, path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${output}\n`);
  }
  const name = `./${path.split('/').pop()}`;
  writeFileSync(
    join(dist, 'esm', path.replace(/\.js$/, '.sync.js')),
    valueOnly
      ? `import value from '${name}';\n\nexport { value as 'module.exports', value as default };\n`
      : `export * from '${name}';\n${hasDefault ? `export { default } from '${name}';\n` : ''}`
  );
}
writeFileSync(join(dist, 'cjs', 'package.json'), '{ "type": "commonjs" }\n');
writeFileSync(join(dist, 'esm', 'package.json'), '{ "type": "module" }\n');

const banner = `/*
  ${config.title} v${version}
  JavaScript framework by Andrey Gubanov https://github.com/finom
  Released under the MIT license
  More info: https://matreshka.js.org
*/`;

const bundle = await rollup({
  input: join(src, 'index.js'),
  external: ['matreshka'],
  plugins: [nodeResolve({ browser: true }), commonjs()],
  onwarn(warning, warn) {
    // the modules import each other in cycles and use the bindings only at call time
    if (warning.code !== 'CIRCULAR_DEPENDENCY') warn(warning);
  }
});
const output = {
  format: 'umd',
  name: config.global,
  exports: 'default',
  globals: { matreshka: 'Matreshka' },
  banner,
  footer: config.footer
};
await bundle.write({ ...output, file: join(dist, `${config.file}.js`) });
await bundle.write({
  ...output,
  file: join(dist, `${config.file}.min.js`),
  sourcemap: true,
  plugins: [terser({ format: { comments: /Matreshka|matreshka/ } })]
});
await bundle.close();
