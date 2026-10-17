# Governance

## How decisions are made

Matreshka.js has one maintainer, [Andrey Gubanov](https://github.com/finom), who wrote it in 2013. The maintainer decides what goes in: features, fixes, releases, the supported browsers. Anyone can propose a change in an issue or a pull request; the discussion happens there, in public, and the decision is written in the issue or the pull request.

## Roles

- **Maintainer** (Andrey Gubanov). Reviews and merges pull requests, answers issues and security reports ([SECURITY.md](./SECURITY.md)), runs the releases (`npm run patch|minor|major`, see [CONTRIBUTING.md](./CONTRIBUTING.md)), keeps the docs at [matreshka.js.org](https://matreshka.js.org) current with the code, and keeps the dependencies up to date (Dependabot).
- **Contributor** (anyone). Opens issues and pull requests. A pull request passes the gate in [CONTRIBUTING.md](./CONTRIBUTING.md) and follows the [code of conduct](./CODE_OF_CONDUCT.md).

## Continuity

If the maintainer can't go on:

- The code, the issues, the docs, the docs deploy and the release workflow all live in this GitHub repository; nothing is kept on the maintainer's machine. Releases publish to npm from the repository's workflow (trusted publishing), with no npm token to hand over.
- The license is MIT: anyone can fork the project and go on.

The bus factor is 1: there is one maintainer.
