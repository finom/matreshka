// After `next build`: the search index (Pagefind reads each page's <html lang> and keeps one index per language) and
// the removal of example folders that hold no page.
import { execFileSync } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(import.meta.dirname, '..', 'out');

for (const name of readdirSync(join(OUT, 'examples'), { withFileTypes: true })) {
  const dir = join(OUT, 'examples', name.name);
  if (name.isDirectory() && readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}

execFileSync('npx', ['pagefind', '--site', OUT, '--output-path', join(OUT, '_pagefind')], { stdio: 'inherit' });
