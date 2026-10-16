import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');

describe('README', () => {
  it('the npm page shows the repository README', () => {
    // packages/matreshka/README.md is what npm shows; keep it a copy: `cp README.md packages/matreshka/`
    expect(readFileSync(`${root}/packages/matreshka/README.md`, 'utf8')).toBe(
      readFileSync(`${root}/README.md`, 'utf8')
    );
  });
});
