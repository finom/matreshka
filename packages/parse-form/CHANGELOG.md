# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - unreleased

### Changed

- Ships ES modules (`dist/esm`) and CommonJS (`dist/cjs`) with an `exports` map; every module keeps its deep import path (`matreshka-parse-form/<path>`), and `require` of a module with only a default export returns that value, as before. On Node.js versions where `require` loads ES modules, `require` and `import` share one copy.
- The UMD bundles are in the package: `dist/matreshka-parse-form.js` and `dist/matreshka-parse-form.min.js` (also on jsDelivr and unpkg).
- The code targets current browsers and Node.js; the bundles are no longer compiled to ES5.
- Imports without a DOM (server-side rendering, Node.js, test runners without jsdom).
- `balajs` is no longer a dependency.
- Only a global `Matreshka` (the bundle in a page) gets `parseForm`.

### Fixed

- When the form isn't found, `parseForm` returns `null` and binds nothing; before, it bound every field of the document.
- A wrong first argument throws `parseForm`'s own `TypeError`.
- `parseForm` binds every field of a form, including `<input type="image">` and fields tied to it with the `form` attribute.

Earlier versions are on [GitHub Releases](https://github.com/finom/matreshka/releases).
