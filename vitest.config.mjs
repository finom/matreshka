import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const src = resolve(import.meta.dirname, 'src');

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
            { find: /^src(\/.*)?$/, replacement: `${src}$1` },
            { find: /^matreshka$/, replacement: `${src}/index.js` }
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
    // the bar the project kept since 2016
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: { lines: 98, statements: 98, branches: 96, functions: 100 }
    }
  }
});
