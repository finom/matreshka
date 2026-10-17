import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LANGS } from '../src/site.mjs';
import { fillSizes } from '../src/sizes.mjs';

const text = '%size-min% / %size-gzip% / %size-brotli% / %core-size-brotli%';
// 2500 bytes that compress well
const bundle = Buffer.from('matreshka '.repeat(250));

describe('the bundle size on the home pages', () => {
  it('fills the three sizes in kB, the way each language writes numbers', () => {
    const en = fillSizes(text, 'en', bundle, bundle);
    expect(en).toMatch(/^2\.5 \/ 0\.\d \/ 0\.\d \/ 0\.\d$/);
    expect(fillSizes(text, 'ru', bundle, bundle)).toBe(en.replaceAll('.', ','));
    expect(fillSizes(text, 'ua', bundle, bundle)).toBe(en.replaceAll('.', ','));
  });

  it('is on every home page', () => {
    for (const { code } of LANGS) {
      const md = readFileSync(path.join(import.meta.dirname, '..', 'content', code, 'index.md'), 'utf8');
      for (const kind of ['size-min', 'size-gzip', 'size-brotli', 'core-size-brotli'])
        expect(md, code).toContain(`%${kind}%`);
    }
  });
});
