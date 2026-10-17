import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const src = resolve(import.meta.dirname, 'src');
const dist = resolve(import.meta.dirname, 'dist');
// the suite against src/, and with MATRESHKA_DIST=1 against the ES5 build in dist/ (npm run test:dist)
const target = process.env.MATRESHKA_DIST ? dist : src;

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'matreshka',
          include: ['test/**/*_spec.js', 'test/**/*.test.js'],
          environment: 'jsdom',
          environmentOptions: { jsdom: { url: 'http://localhost/' } },
          globals: true
        },
        resolve: {
          alias: [
            // dist/matreshka.js is the bundle, so the folder is named in full
            { find: /^src\/matreshka$/, replacement: `${target}/matreshka/index.js` },
            { find: /^src(\/.*)?$/, replacement: `${target}$1` },
            { find: /^matreshka$/, replacement: `${target}/index.js` }
          ]
        }
      },
      // the docs site's checks: page front matter, old links, module paths and the name
      {
        test: {
          name: 'matreshka-docs',
          root: resolve(import.meta.dirname, 'docs'),
          include: ['test/**/*.test.js'],
          environment: 'node'
        }
      }
    ],
    // every line and branch of src is covered
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: { lines: 100, statements: 100, branches: 100, functions: 100 }
    }
  }
});
