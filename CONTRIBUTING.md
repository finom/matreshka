# Contributing

## Setup

Node 24 or newer.

```sh
npm ci
```

## Before a pull request

The same gate CI runs:

```sh
npm run lint && npm test && npm run build && npm run check:dist
```

A fix or a feature comes with a test; a fix's test fails on the code before it. Lint warnings fail the gate (`npx biome check --write .` fixes most of them).

## Layout

- `packages/matreshka`, `packages/router`, `packages/parse-form` — the npm packages. `src/` is plain ES modules; `npm run build` writes `dist/esm`, `dist/cjs` and the UMD bundles.
- `docs/` — the site at [matreshka.js.org](https://matreshka.js.org), in English, Ukrainian and Russian.
- `examples/` — the example apps, published on the site.

A new module in `src/` gets its deep import path through the package's `exports` map: `npm run exports` updates the maps, and a test fails when one is stale.

## Releases

`PACKAGE=<dir> npm run patch|minor` releases one package; the version's `CHANGELOG.md` section must exist first. The tag it pushes publishes from GitHub Actions.

## Security

Do not open an issue for a vulnerability. See [SECURITY.md](./SECURITY.md).
