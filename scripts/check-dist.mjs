// After `npm run build`: the published entry points load and work.
// `npm run check:dist` runs this twice: as is (ESM, `require(esm)`, one copy for both, the UMD bundles in a page), and
// with `--no-experimental-require-module`, where `require` gets the CommonJS build, as on Node versions without
// `require(esm)`. That run has no DOM (jsdom itself needs `require(esm)`), which also checks a server-side import.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const commonjs = process.execArgv.includes('--no-experimental-require-module');
const html = '<form><input name="a"></form>';
const fail = (message) => {
  console.error(`check-dist: ${message}`);
  process.exit(1);
};
const check = (condition, message) => condition || fail(message);

const doubled = (Matreshka) => {
  const object = new Matreshka();
  object.b = 3;
  object.calc('a', 'b', (b) => b * 2);
  return object;
};

if (commonjs) {
  const Matreshka = require('matreshka');
  check(require.resolve('matreshka').includes('/dist/cjs/'), 'cjs: require does not resolve to dist/cjs');
  const bindNode = require('matreshka/bindnode').default;
  const from = require('matreshka/array/from.js').default;
  const Router = require('matreshka-router/router');
  const initRouter = require('matreshka-router');
  const parseForm = require('matreshka-parse-form');
  check(typeof Matreshka === 'function' && typeof Matreshka.Array === 'function', 'cjs: matreshka');
  check(typeof Matreshka.toMatreshka === 'function', 'cjs: Matreshka.toMatreshka');
  check(typeof bindNode === 'function' && from([1, 2]).length === 2, 'cjs: deep paths');
  check(typeof Router === 'function' && typeof initRouter === 'function', 'cjs: router');
  check(typeof parseForm === 'function', 'cjs: parse-form');
  const object = doubled(Matreshka);
  check(object.a === 6, 'cjs: calc');
  const router = new Router('custom');
  router.subscribe(object, '/a/');
  check(router.path === '/6/', 'cjs: router');
  console.log('check-dist: CommonJS build works without a DOM');
  process.exit(0);
}

const { JSDOM } = await import('jsdom');
// one page for every format, as an app has
const { window } = new JSDOM(html, { url: 'http://localhost/' });
globalThis.window = window;
globalThis.document = window.document;

// ESM, and `require` of the same ESM modules
{
  const { default: Matreshka } = await import('matreshka');
  const { default: toMatreshka } = await import('matreshka/tomatreshka');
  const { default: of } = await import('matreshka/array/of');
  const { default: Router } = await import('matreshka-router/router');
  const { default: parseForm } = await import('matreshka-parse-form');
  check(typeof Matreshka.Object === 'function', 'esm: matreshka');
  check(toMatreshka({ a: [1] }).a.isMatreshkaArray === true, 'esm: toMatreshka');
  check(of(1, 2, 3).length === 3, 'esm: deep paths');
  const object = doubled(Matreshka);
  parseForm(object, 'form');
  check(object.a === 6 && document.querySelector('input').value === '6', 'esm: calc and parseForm');
  const router = new Router('custom');
  router.subscribe(object, '/a/');
  check(router.path === '/6/', 'esm: router');

  check(require('matreshka') === Matreshka, 'require and import give different Matreshka classes');
  check(
    require('matreshka/bindnode').default === (await import('matreshka/bindnode')).default,
    'deep paths: two copies'
  );
  check(require('matreshka-router/router') === Router, 'require and import give different Router classes');
  check(require('matreshka-router') === (await import('matreshka-router')).default, 'initRouter: two copies');
  check(require('matreshka-parse-form') === parseForm, 'parseForm: two copies');
  const plain = {};
  let calls = 0;
  require('matreshka').on(plain, 'change:a', () => {
    calls += 1;
  });
  Matreshka.set(plain, 'a', 1);
  check(calls === 1, 'an event added through require does not fire through import');
}

// UMD bundles in a page, with the `MK` alias
{
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  for (const file of [
    'matreshka/dist/matreshka.min.js',
    'matreshka-router/dist/matreshka-router.min.js',
    'matreshka-parse-form/dist/matreshka-parse-form.min.js'
  ]) {
    dom.window.eval(readFileSync(require.resolve(file), 'utf8'));
  }
  const result = dom.window.eval(`
    const object = new MK.Object({ a: 'x' });
    MK.parseForm(object, 'form');
    [MK === Matreshka, typeof Matreshka.Array, typeof Matreshka.Router, typeof Matreshka.initRouter,
      document.querySelector('input').value].join(' ');
  `);
  check(result === 'true function function function x', `umd: ${result}`);
}

console.log('check-dist: ESM, require(esm) with one copy, deep paths and UMD bundles work');
