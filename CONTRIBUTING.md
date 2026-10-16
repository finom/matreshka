# Contributing

## Setup

Node 24 or newer.

```sh
npm ci
```

## Before a pull request

The same gate CI runs:

```sh
npm run lint && npm run typecheck && npm run test:coverage && npm run build && npm run check:dist
```

A fix or a feature comes with a test; a fix's test fails on the code before it. Lint warnings fail the gate (`npx biome check --write .` fixes most of them).

## Layout

- `src/` — the package, in TypeScript. `src/index.ts` is the `matreshka` entry, `src/router/` and `src/parse-form/` are `matreshka/router` and `matreshka/parse-form`, `src/bundle.ts` is the script-tag bundle. `npm run build` writes `dist/`: ES modules with type declarations, and `dist/matreshka.js` and `dist/matreshka.min.js`.
- `test/` — the tests (Vitest, jsdom).
- `docs/` — the site at [matreshka.js.org](https://matreshka.js.org), in English, Ukrainian and Russian.
- `examples/` — the example apps, published on the site.

## Changelog and releases

Every change worth a line goes under `## [Unreleased]` in `CHANGELOG.md` ([Keep a Changelog](https://keepachangelog.com/en/1.1.0/)). `npm run patch|minor|major` (or `beta`, `beta-minor`, `beta-major` for a prerelease) runs the gate, turns `[Unreleased]` into the version's section, commits, and pushes the `v<version>` tag. The tag publishes to npm from GitHub Actions, with provenance, and makes the GitHub Release from that section; a prerelease goes to the npm dist-tag its id names (`3.1.0-beta.0` → `beta`). `npm run patch -- --dry-run` runs everything but the commit.

## Security

Do not open an issue for a vulnerability. See [SECURITY.md](./SECURITY.md).
