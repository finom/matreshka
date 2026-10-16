// Puts the files the site serves but does not own into public/: the browser bundle (built by the root
// `npm run build`) and the example apps from examples/. public/ ignores them in git, so nothing is committed twice.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const PUBLIC = join(import.meta.dirname, '..', 'public');

// the script-tag bundle; the old finom.github.io/matreshka/ URLs redirect here, so the unminified file is served too
for (const file of ['matreshka.js', 'matreshka.min.js', 'matreshka.min.js.map']) {
  const from = join(ROOT, 'dist', file);
  if (!existsSync(from)) throw new Error(`${from} is missing: run \`npm run build\` at the repo root first`);
  cpSync(from, join(PUBLIC, file));
}

rmSync(join(PUBLIC, 'examples'), { recursive: true, force: true });
cpSync(join(ROOT, 'examples'), join(PUBLIC, 'examples'), {
  recursive: true,
  filter: (path) => !/(^|\/)(README\.md|\.DS_Store)$/.test(path)
});
console.log('bundles and examples copied to public/');
