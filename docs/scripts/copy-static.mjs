// Puts the files the site serves but does not own into public/: the packages' browser bundles (built by the root
// `npm run build`) and the example apps from examples/. public/ ignores them in git, so nothing is committed twice.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const PUBLIC = join(import.meta.dirname, '..', 'public');

const BUNDLES = {
  matreshka: 'matreshka.min.js',
  router: 'matreshka-router.min.js',
  'parse-form': 'matreshka-parse-form.min.js'
};

// the unminified bundles too: the old finom.github.io/matreshka/ URLs redirect here
for (const [dir, minFile] of Object.entries(BUNDLES)) {
  for (const file of [minFile, minFile.replace('.min.js', '.js')]) {
    const from = join(ROOT, 'packages', dir, 'dist', file);
    if (!existsSync(from)) throw new Error(`${from} is missing: run \`npm run build\` at the repo root first`);
    cpSync(from, join(PUBLIC, file));
    if (existsSync(`${from}.map`)) cpSync(`${from}.map`, join(PUBLIC, `${file}.map`));
  }
}

rmSync(join(PUBLIC, 'examples'), { recursive: true, force: true });
cpSync(join(ROOT, 'examples'), join(PUBLIC, 'examples'), {
  recursive: true,
  filter: (path) => !/(^|\/)(README\.md|\.DS_Store)$/.test(path)
});
console.log('bundles and examples copied to public/');
