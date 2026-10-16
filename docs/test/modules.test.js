import { existsSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';
import { DOCS, pages } from './pages';

const SRC = path.join(DOCS, '../packages/matreshka/src');

// `import calc from 'matreshka/calc'` on a page names a module the package has.
it('imports only modules that exist', () => {
  let count = 0;
  for (const { file, mdx } of pages) {
    for (const [, sub] of mdx.matchAll(/from 'matreshka\/([\w/]+)'/g)) {
      const exists = existsSync(path.join(SRC, `${sub}.js`)) || existsSync(path.join(SRC, sub, 'index.js'));
      expect(exists, `${file}: matreshka/${sub}`).toBe(true);
      count++;
    }
  }
  expect(count).toBeGreaterThan(50);
});
