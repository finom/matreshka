import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';
import { DOCS, pages } from './pages';

const SRC = path.join(DOCS, '../src');

// The entry points of the package and the source file of each.
const ENTRIES = {
  matreshka: 'index.ts',
  'matreshka/router': 'router/index.ts',
  'matreshka/parse-form': 'parse-form/index.ts'
};

// The names a source file exports: `export { a, b as c }`, `export function d`, `export const e`.
function exportsOf(file) {
  const source = readFileSync(path.join(SRC, file), 'utf8');
  const names = new Set();
  for (const [, list] of source.matchAll(/^export \{([^}]*)\}/gm)) {
    for (const item of list.split(',')) {
      const name = item
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (name) names.add(name);
    }
  }
  for (const [, name] of source.matchAll(/^export (?:function|const|let|class) (\w+)/gm)) names.add(name);
  return names;
}

// `import { calc } from 'matreshka'` in a section names an entry point the package has and a name it exports.
it('imports only entry points and names that exist', () => {
  const exported = Object.fromEntries(Object.entries(ENTRIES).map(([entry, file]) => [entry, exportsOf(file)]));
  let count = 0;
  for (const { file, md } of pages) {
    for (const [, clause, entry] of md.matchAll(/import ([^;'`]*?) from '(matreshka(?:\/[^']*)?)'/g)) {
      expect(Object.keys(ENTRIES), `${file}: ${entry}`).toContain(entry);
      const named = /\{([^}]*)\}/.exec(clause)?.[1] ?? '';
      for (const name of named
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)) {
        expect(exported[entry].has(name), `${file}: ${name} from '${entry}'`).toBe(true);
      }
      count++;
    }
  }
  expect(count).toBeGreaterThan(50);
});

// 2.x had a module per function (`matreshka/bindnode`); 3.0 has these three entry points only.
it('names no 2.x deep import path in an import', () => {
  for (const { file, md } of pages) {
    expect(md, file).not.toMatch(/from 'matreshka\/(?!router'|parse-form')/);
  }
});
