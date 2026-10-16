// Internal ranges are carets on the current version: `^0.3.0` takes every 0.3.x, so a patch needs no dependent release.
// The lockfile's own entries follow by hand; `npm install` would re-resolve the whole tree.
import { readFileSync, writeFileSync } from 'node:fs';

const DIRS = ['matreshka', 'router', 'parse-form'];
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);

const manifests = { '': read('./package.json') };
const ranges = {};
for (const dir of DIRS) {
  const manifest = read(`./packages/${dir}/package.json`);
  manifests[`packages/${dir}`] = manifest;
  ranges[manifest.name] = `^${manifest.version}`;
}

const sync = (deps = {}) => {
  for (const name of Object.keys(deps)) if (name in ranges) deps[name] = ranges[name];
};

const lock = read('./package-lock.json');
for (const [path, manifest] of Object.entries(manifests)) {
  const entry = lock.packages[path];
  for (const target of [manifest, entry]) {
    sync(target.dependencies);
    sync(target.peerDependencies);
  }
  if (path) entry.version = manifest.version;
  write(path ? `./${path}/package.json` : './package.json', manifest);
}
write('./package-lock.json', lock);
