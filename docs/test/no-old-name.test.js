import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';
import { DOCS } from './pages';

const EXAMPLES = path.join(DOCS, '../examples');
const SKIP = new Set(['node_modules', '.next', 'out']);

// The framework's later name, kept only as a hash so this file doesn't spell it: a seven-letter word that starts with
// "s" and ends with "e".
const OLD_NAME = 'ec45285f32e013d8099fd8d373050504961e07528091265963f65dc6e44900e7';
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const hasWord = (text, hash) => {
  const lower = text.toLowerCase();
  for (let at = lower.indexOf('s'); at !== -1; at = lower.indexOf('s', at + 1)) {
    if (lower[at + 6] === 'e' && sha256(lower.slice(at, at + 7)) === hash) return true;
  }
  return false;
};

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? files(file) : [file];
  });
}

const hasOldName = (text) => hasWord(text, OLD_NAME);

it('finds a hashed word in any case, inside other words', () => {
  const hash = sha256('suppose');
  expect(hasWord('We SUPPOSEd so', hash)).toBe(true);
  expect(hasWord('a sample, a stable', hash)).toBe(false);
});

// The docs read as if the framework always had its name: the later one appears nowhere, in text, code or file names.
it('never uses the old name in docs/ or examples/', () => {
  const found = [];
  for (const file of [...files(DOCS), ...files(EXAMPLES)]) {
    const relative = path.relative(path.join(DOCS, '..'), file);
    if (hasOldName(relative) || hasOldName(readFileSync(file).toString('latin1'))) found.push(relative);
  }
  expect(found).toEqual([]);
});
