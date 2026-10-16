---
title: "Introduction"
description: "What Matreshka.js does, how it binds objects to DOM nodes with accessors, the cases it is made for and what it leaves to your own code."
---

# Introduction

Matreshka.js binds the properties of JavaScript objects to DOM nodes. The HTML comes from wherever it already comes from: a server template, a CMS, a static file. Matreshka finds the nodes by selector and keeps them in sync with the properties.

## What it does

- **Two-way binding.** [`bindNode`](/api/matreshka/bind-node/) ties a property to one or more nodes. Assigning the property updates the nodes. Typing into a field, checking a box or picking an option updates the property. A [binder](/api/binders/) says what the node shows: text, an attribute, a class, a style. Form fields get their binder by default.
- **Computed values.** [`calc`](/api/matreshka/calc/) makes a property depend on others and recomputes it when they change.
- **Value conversion.** [`mediate`](/api/matreshka/mediate/) passes every new value of a property through a function, for example `Number`.
- **Events.** [`on`](/api/matreshka/on/) listens to property changes (`change:x`), to DOM events of bound nodes (`click::x`) and to your own events.
- **Lists.** [`Matreshka.Array`](/api/matreshka-array/) renders one node per item and keeps the DOM in sync through `push`, `splice`, `sort` and the other array methods. [`Matreshka.Object`](/api/matreshka-object/) is for data with a known set of keys.
- **URL and forms.** `matreshka/router` binds properties to parts of the URL. `matreshka/parse-form` binds named form fields to properties.

## How it works

A binding turns the property into an accessor: a getter and a setter. The setter writes the value into the bound nodes. A DOM listener on each node writes the node's value back into the property. There is no virtual DOM and no template to re-render: a change goes from the property to its nodes directly. The [FAQ](/faq/) shows the idea in a dozen lines.

When the property has no value yet, `bindNode` takes it from the node. So a form rendered by the server, with its values filled in, becomes the object's initial state.

## Two styles

The functions take any object as the first argument:

```js
import { bindNode, calc } from 'matreshka';

const user = {};
bindNode(user, 'name', '.name');
calc(user, 'greeting', 'name', (name) => `Hello, ${name}`);
```

The [`Matreshka`](/api/matreshka/) class has the same functions as methods, with `this` as the object:

```js
import Matreshka from 'matreshka';

class User extends Matreshka {
  constructor() {
    super();
    this.bindNode('name', '.name');
    this.calc('greeting', 'name', (name) => `Hello, ${name}`);
  }
}
```

The two styles mix freely. The functions suit a few bindings on an existing page; the classes suit larger pieces, and `Matreshka.Array` renders lists of them.

## Where it fits

- **HTML rendered on the server** (Rails, Django, Laravel, WordPress). The markup stays as the server wrote it; the script adds behavior.
- **A widget on a page you don't control.** [`bindSandbox`](/api/matreshka/bind-sandbox/) and `:sandbox` selectors keep the widget's selectors inside its own root.
- **An old app** that needs new behavior without a rewrite.
- **One HTML file** with one `<script>` tag and no build.

## What it leaves to you

Matreshka has no component system, no template language and no build step. [`Matreshka.Array#itemRenderer`](/api/matreshka-array/item-renderer/) takes an HTML string, a selector or a function. How the code is split into objects and files is up to you.

Next: [Getting started](/getting-started/).
