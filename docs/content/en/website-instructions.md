---
title: "Website instructions"
description: "How to read the Matreshka.js documentation: the three importance levels, links to the source of each article, and the package's entry points."
---

# Website instructions

## Importance levels
The API is split up into three parts.

### <span class="mk-circles" data-level="1" aria-hidden="true"><i></i></span> The first level - the most important stuff
After you've learned the most important API parts you can hardily start doing fantastic things. Classes, methods and properties marked with <span class="mk-circles" data-level="1" aria-hidden="true"><i></i></span> need to be learned primarily.

### <span class="mk-circles" data-level="2" aria-hidden="true"><i></i><i></i></span> The second level - recommended to learn
If you already know the quick-start basics, you can look at less important (but still important) methods and properties of the framework.

### <span class="mk-circles" data-level="3" aria-hidden="true"><i></i><i></i><i></i></span> The third level - other methods and properties
We've hidden rarely used parts (Matreshka.js API is really rich). If you want to know everything about Matreshka.js, choose <span class="mk-circles" data-level="3" aria-hidden="true"><i></i><i></i><i></i></span> on the switch in the menu.

**Warning**. If you open a link to a method or a property of the third level of importance, the third level is turned on automatically.

## Inaccuracies and typos

In a footer of every article of the documentation you can find a link to a source of that article. You can fix a typo directly at Github editor.

> The documentation is written using GitHub Flavored Markdown.

## Modules

The framework is one package with three entry points.

```js
import Matreshka from 'matreshka';
import { initRouter } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```
