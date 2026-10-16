---
title: "Matreshka.parserBrackets"
sidebarTitle: "parserBrackets"
description: "Matreshka.parserBrackets: Contains brackets for bindings parser"
importance: 3
---

# Matreshka.parserBrackets

**Property**

**Import:**

```js
import { parserBrackets } from 'matreshka';
```

```js
Matreshka.parserBrackets: object
```

Contains brackets for [bindings parser](/api/matreshka/parse-bindings/)

``parserBrackets`` object allows to change default syntax of the parser. It contains two properties: ``left`` (left bracket, "\{\{" by default) and ``right`` (right bracket, "\}\}" by default)

Any characters can be used as brackets.

## Examples

**Use syntax  ``[[=property]]`` instead of ``{{property}}``**

```js
Matreshka.parserBrackets.left = '[[=';
Matreshka.parserBrackets.right = ']]';
```
