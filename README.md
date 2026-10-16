# Matreshka.js [![npm version](https://img.shields.io/npm/v/matreshka.svg)](https://www.npmjs.com/package/matreshka) [![CI](https://github.com/finom/matreshka/actions/workflows/ci.yml/badge.svg)](https://github.com/finom/matreshka/actions/workflows/ci.yml) [![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fmatreshka.js.org%2Fbadges%2Fcoverage.json)](https://github.com/finom/matreshka/actions/workflows/docs.yml) [![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/finom/matreshka/badge)](https://scorecard.dev/viewer/?uri=github.com/finom/matreshka)

<a href="https://matreshka.js.org">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://matreshka.js.org/logo/matreshka-full-horizontal-dark.svg">
    <img alt="Matreshka.js" src="https://matreshka.js.org/logo/matreshka-full-horizontal.svg" height="100">
  </picture>
</a>

> Matreshka.js is a simple JavaScript framework to create single-page applications (SPAs). The simple and intuitive API is based on JavaScript classes and accessors which are accessible to all application developers of varying skills. The requirement to start your first project with Matreshka.js is basic knowledge of JavaScript!

## Features
- A reactive API to solve hard problems
- High robustness of developed apps
- The ability to refactor legacy applications without rewriting them from scratch
- The only couple of hours is needed to master the framework because of the absence of complex concepts

```html
<input class="in" type="text">
<output class="out"></output>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
const app = new Matreshka();
app.bindNode('x', '.in, .out');
app.x = 'A framework for single-page applications creation';
</script>
```

**[Download](https://matreshka.js.org/matreshka.min.js)**

**Install via NPM**
```
npm install --save matreshka
```

**Install the skill for AI coding agents**
```
npx skills add finom/matreshka
```

-----------------------------------

## Resources
- [The website](https://matreshka.js.org)
- [Examples and tutorials](https://matreshka.js.org/#examples)
- [Release History](https://github.com/finom/matreshka/blob/main/CHANGELOG.md)
- [Contributing](https://github.com/finom/matreshka/blob/main/CONTRIBUTING.md)

**License:** [MIT License](https://github.com/finom/matreshka/blob/main/LICENSE)
