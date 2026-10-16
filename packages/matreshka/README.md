# Matreshka.js [![npm version](https://img.shields.io/npm/v/matreshka.svg)](https://www.npmjs.com/package/matreshka) [![CI](https://github.com/finom/matreshka/actions/workflows/ci.yml/badge.svg)](https://github.com/finom/matreshka/actions/workflows/ci.yml) [![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/finom/matreshka/badge)](https://scorecard.dev/viewer/?uri=github.com/finom/matreshka)

<a href="https://matreshka.js.org">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://matreshka.js.org/logo/matreshka-full-horizontal-dark.svg">
    <img alt="Matreshka.js" src="https://matreshka.js.org/logo/matreshka-full-horizontal.svg" height="100">
  </picture>
</a>

> Matreshka.js is a simple JavaScript framework to create single-page applications (SPAs). The simple and intuitive API is based on JavaScript classes and accessors which are accessible to all application developers of varying skills. The requirement to start your first project with Matreshka.js is basic knowledge of JavaScript!

## Features
- A nice reactive API to solve hard problems
- High robustness of developed apps
- The ability to refactor legacy applications without rewriting them from scratch
- Only couple of hours is needed to master the framework because of the absence of complex concepts

A bonus: the framework is documented in 3 languages: [English](https://matreshka.js.org), [Ukrainian](https://matreshka.js.org/ua/) and [Russian](https://matreshka.js.org/ru/).

## Install

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';

class Application extends Matreshka {
  constructor() {
    super();
    this.bindNode('x', '.my-input');
    this.bindNode('x', '.my-output', Matreshka.binders.html());
  }
}
```

Every function is also a module of its own: `import calc from 'matreshka/calc'`. CommonJS works too: `require('matreshka')`.

Or with a script tag, which defines the globals `Matreshka` and `MK`:

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@2/dist/matreshka.min.js"></script>
```

## Business needs
Due to extreme simplicity of the framework, even novice web developers can quickly start to do small, then medium and then large web applications. This means that web studios are able to save money by hiring younger professionals, who, in turn, could not find a job before.

## Packages

- [matreshka](https://github.com/finom/matreshka/tree/main/packages/matreshka) itself
- [matreshka-router](https://github.com/finom/matreshka/tree/main/packages/router) for routing
- [matreshka-parse-form](https://github.com/finom/matreshka/tree/main/packages/parse-form) to make it easy to work with regular HTML forms

## Resources
- [Website](https://matreshka.js.org)
- [Examples and tutorials](https://matreshka.js.org/examples/)
- [Changelog](https://github.com/finom/matreshka/blob/main/packages/matreshka/CHANGELOG.md)
- [Contributing](https://github.com/finom/matreshka/blob/main/CONTRIBUTING.md)

**License:** [MIT License](https://github.com/finom/matreshka/blob/main/LICENSE)
