// After `npm run build`: packs the package, installs the tarball into a temporary project and checks that the
// entry points load and work there, the way a user loads them.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const html = '<form><input name="a"></form>';
const fail = (message) => {
  console.error(`check-dist: ${message}`);
  process.exit(1);
};
const check = (condition, message) => condition || fail(message);

const project = mkdtempSync(path.join(tmpdir(), 'matreshka-check-dist-'));
process.on('exit', () => rmSync(project, { recursive: true, force: true }));
const npm = (...args) =>
  execFileSync('npm', args, { cwd: project, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
const tarball = path.join(project, npm('pack', process.cwd(), '--silent', '--ignore-scripts').trim());
writeFileSync(path.join(project, 'package.json'), '{ "private": true, "type": "module" }');
npm('install', tarball, '--offline', '--no-audit', '--no-fund', '--ignore-scripts', '--silent');

const require = createRequire(path.join(project, 'index.js'));
const load = (specifier) => import(pathToFileURL(require.resolve(specifier)).href);
const packaged = (file) => path.join(project, 'node_modules', 'matreshka', file);

// only the three entry points: a deep path is refused
for (const deep of ['matreshka/bindnode', 'matreshka/dist/index.js', 'matreshka/src/index.ts']) {
  let refused = false;
  try {
    require.resolve(deep);
  } catch (error) {
    refused = error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED' || error.code === 'MODULE_NOT_FOUND';
  }
  check(refused, `${deep} resolves`);
}
for (const file of ['LICENSE', 'README.md', 'CHANGELOG.md', 'dist/index.d.ts', 'dist/matreshka.min.js']) {
  try {
    readFileSync(packaged(file));
  } catch {
    fail(`the tarball has no ${file}`);
  }
}

// no DOM yet: an import on a server or in a test runner without jsdom
const entry = await load('matreshka');
const { initRouter, Router } = await load('matreshka/router');
const { parseForm } = await load('matreshka/parse-form');
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
  dom.window.eval(readFileSync(packaged('dist/matreshka.min.js'), 'utf8'));
  const result = dom.window.eval(`
    const object = new Matreshka.Object({ a: 'x' });
    Matreshka.parseForm(object, 'form');
    [typeof Matreshka.Array, typeof Matreshka.Router, typeof Matreshka.initRouter, typeof Matreshka.bindNode,
      typeof MK, document.querySelector('input').value].join(' ');
  `);
  check(result === 'function function function function undefined x', `umd: ${result}`);
}

// the types, as a user's TypeScript file sees them with either module resolution a project uses today
copyFileSync(path.resolve('test/types/consumer.ts'), path.join(project, 'consumer.ts'));
for (const [module, moduleResolution] of [
  ['nodenext', 'nodenext'],
  ['esnext', 'bundler']
]) {
  const compilerOptions = {
    strict: true,
    module,
    moduleResolution,
    target: 'es2022',
    lib: ['es2023', 'dom'],
    noEmit: true
  };
  writeFileSync(path.join(project, 'tsconfig.json'), JSON.stringify({ compilerOptions, files: ['consumer.ts'] }));
  try {
    execFileSync(path.resolve('node_modules/.bin/tsc'), ['-p', project], { encoding: 'utf8' });
  } catch (error) {
    fail(`types with ${moduleResolution} resolution:\n${error.stdout}`);
  }
}

console.log(
  'check-dist: the packed tarball: ESM, require(esm), a DOM-free import, no deep paths, the script-tag bundle and the types work'
);
