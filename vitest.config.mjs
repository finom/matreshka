import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const pkg = (dir) => resolve(import.meta.dirname, 'packages', dir);

// Each package's specs run on its source in jsdom; `src/...` and `matreshka` resolve to packages/*/src.
const project = (dir) => ({
  test: {
    name: dir,
    root: pkg(dir),
    include: ['test/**/*_spec.js', 'test/**/*.test.js'],
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    globals: true
  },
  resolve: {
    alias: [
      { find: /^src(\/.*)?$/, replacement: `${pkg(dir)}/src$1` },
      { find: /^matreshka$/, replacement: `${pkg('matreshka')}/src/index.js` },
      { find: /^matreshka\/(.*)$/, replacement: `${pkg('matreshka')}/src/$1` }
    ]
  }
});

// The docs site's checks: page front matter, old links, module paths and the name.
const docs = {
  test: {
    name: 'matreshka-docs',
    root: resolve(import.meta.dirname, 'docs'),
    include: ['test/**/*.test.js'],
    environment: 'node'
  }
};

export default defineConfig({
  test: {
    projects: [project('matreshka'), project('router'), project('parse-form'), docs],
    // the bar the project kept since 2016
    coverage: { provider: 'v8', include: ['packages/*/src/**'], thresholds: { lines: 95, statements: 95 } }
  }
});
