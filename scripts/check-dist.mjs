// After `npm run build`: the published entry points load and work, the way a user loads them.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const html = '<form><input name="a"></form>';
const fail = (message) => {
  console.error(`check-dist: ${message}`);
  process.exit(1);
};
const check = (condition, message) => condition || fail(message);

// no DOM yet: an import on a server or in a test runner without jsdom
const entry = await import('matreshka');
const { initRouter, Router } = await import('matreshka/router');
const { parseForm } = await import('matreshka/parse-form');
const Matreshka = entry.default;
check(typeof Matreshka === 'function' && entry.Matreshka === Matreshka, 'esm: default and named Matreshka');
check(entry.MatreshkaArray === Matreshka.Array && entry.MatreshkaObject === Matreshka.Object, 'esm: the classes');
check(entry.bindNode === Matreshka.bindNode && typeof entry.binders.html === 'function', 'esm: named functions');
Matreshka.binders.custom = () => ({});
check(
  entry.binders === Matreshka.binders && typeof entry.binders.custom === 'function',
  'esm: binders take a new binder'
);
delete Matreshka.binders.custom;
check(typeof initRouter === 'function' && typeof Router === 'function', 'esm: matreshka/router');
check(typeof parseForm === 'function', 'esm: matreshka/parse-form');
check(!('initRouter' in Matreshka) && !('parseForm' in Matreshka), 'esm: the entry stays without router and parser');

// require(esm) gives the same modules
check(require('matreshka').Matreshka === Matreshka, 'require: another copy of Matreshka');
check(require('matreshka/router').Router === Router, 'require: another copy of Router');

const object = new Matreshka.Object({ b: 3 });
object.calc('a', 'b', (b) => b * 2);
check(object.a === 6, 'calc');
const router = new Router('custom');
router.subscribe(object, '/a/');
check(router.path === '/6/', 'router');

const { JSDOM } = await import('jsdom');
const { window } = new JSDOM(html, { url: 'http://localhost/' });
globalThis.window = window;
globalThis.document = window.document;
parseForm(object, 'form');
check(document.querySelector('input').value === '6', 'parseForm in a page');

// the script-tag bundle in a page
{
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  dom.window.eval(readFileSync('dist/matreshka.min.js', 'utf8'));
  const result = dom.window.eval(`
    const object = new Matreshka.Object({ a: 'x' });
    Matreshka.parseForm(object, 'form');
    [typeof Matreshka.Array, typeof Matreshka.Router, typeof Matreshka.initRouter, typeof Matreshka.bindNode,
      typeof MK, document.querySelector('input').value].join(' ');
  `);
  check(result === 'function function function function undefined x', `umd: ${result}`);
}

console.log('check-dist: ESM, require(esm), a DOM-free import and the script-tag bundle work');
