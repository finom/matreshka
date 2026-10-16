// The `exports` map each package publishes: every module of src/ under its old deep path (`matreshka/bindnode`,
// `matreshka/array/from`), with or without `.js`. Where `require` loads ES modules (`module-sync`: Node 20.19+, 22.12+),
// `require` and `import` both get the ESM build, so an app that mixes them still has one copy of the framework;
// elsewhere `import` gets ESM and `require` CommonJS.
// `node scripts/exports.mjs --write` rewrites the maps; a test fails when one is stale.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

export const DIRS = ['matreshka', 'router', 'parse-form'];

// the modules whose CommonJS export is the value itself (`require('matreshka')` is the class), not `{ default }`
export const COMMONJS_DEFAULT = {
  matreshka: ['index.js'],
  router: ['index.js', 'router.js'],
  'parse-form': ['index.js']
};

const target = (path) => ({
  'module-sync': `./dist/esm/${path}`,
  import: `./dist/esm/${path}`,
  require: `./dist/cjs/${path}`
});

// `require` gets their value through the `module.exports` export name of a `.sync.js` wrapper
const valueTarget = (path) => ({ ...target(path), 'module-sync': `./dist/esm/${path.replace(/\.js$/, '.sync.js')}` });

function directoriesWithIndex(root, dir = root, found = []) {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) continue;
    if (readdirSync(path).includes('index.js')) found.push(relative(root, path));
    directoriesWithIndex(root, path, found);
  }
  return found;
}

export function expectedExports(dir) {
  const exports = { '.': valueTarget('index.js') };
  for (const path of COMMONJS_DEFAULT[dir]) {
    if (path === 'index.js') continue;
    exports[`./${path.replace(/\.js$/, '')}`] = valueTarget(path);
    exports[`./${path}`] = valueTarget(path);
  }
  for (const path of directoriesWithIndex(`packages/${dir}/src`)) exports[`./${path}`] = target(`${path}/index.js`);
  exports['./package.json'] = './package.json';
  exports['./dist/*'] = './dist/*';
  exports['./*.js'] = target('*.js');
  exports['./*'] = target('*.js');
  return exports;
}

if (process.argv.includes('--write')) {
  for (const dir of DIRS) {
    const path = `packages/${dir}/package.json`;
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    manifest.exports = expectedExports(dir);
    writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  }
}
