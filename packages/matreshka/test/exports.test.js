import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DIRS, expectedExports } from '../../../scripts/exports.mjs';

const root = resolve(import.meta.dirname, '../../..');

describe('package exports', () => {
  it.each(DIRS)('packages/%s/package.json maps every module of src/', (dir) => {
    const cwd = process.cwd();
    process.chdir(root);
    try {
      const manifest = JSON.parse(readFileSync(`packages/${dir}/package.json`, 'utf8'));
      // `node scripts/exports.mjs --write` updates the maps
      expect(manifest.exports).toEqual(expectedExports(dir));
    } finally {
      process.chdir(cwd);
    }
  });
});
