# Changelog

All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - unreleased

### Changed

- Ships ES modules (`dist/esm`) and CommonJS (`dist/cjs`) with an `exports` map; every module keeps its deep import path (`matreshka-router/<path>`). On Node.js versions where `require` loads ES modules, `require` and `import` share one copy.
- The UMD bundles are in the package: `dist/matreshka-router.js` and `dist/matreshka-router.min.js` (also on jsDelivr and unpkg).
- The code targets current browsers and Node.js; the bundles are no longer compiled to ES5.
- Imports without a DOM (server-side rendering, Node.js, test runners without jsdom).
- Only a global `Matreshka` (the bundle in a page) gets `Router` and `initRouter`.

### Fixed

- The back button updates the properties when it returns to the first page entry or to an entry the router didn't push.
- The history router keeps the query string when it changes the path.
- Values with spaces, non-Latin letters or slashes are encoded in the URL and decoded back.
- A property that is `null` or `''` when it subscribes gets its value from the URL.
- A plain anchor such as `#top` is no longer read as a route.
- Subscribing a shorter route no longer drops the deeper parts of the URL.
- `router.parts` no longer holds `undefined` entries, and three or more slashes in a row are treated like one.

Earlier versions are on [GitHub Releases](https://github.com/finom/matreshka/releases).
