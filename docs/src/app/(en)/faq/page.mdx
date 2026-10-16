---
title: "FAQ"
description: "How Matreshka.js works inside, why bound elements update a moment later, how to test, how to pre-render on a server and how to structure a big app."
---

# FAQ

## How does Matreshka work?

It turns a bound property into an accessor. The setter writes the value into the bound elements, and a DOM event handler writes the element's value back into the property. A simplified [`bindNode`](/api/matreshka/bind-node/) looks like this:

```js
function bindNode(object, key, node, binder) {
    let value = object[key];
    Object.defineProperty(object, key, {
        get() {
            return value;
        },
        set(v) {
            value = v;
            binder.setValue.call(node, v);
        }
    });

    node.addEventListener(binder.on, () => {
        value = binder.getValue.call(node);
    });
}
```

The real function also handles many elements per property, many properties per element, events and the cases above.

## Why does a bound element update a moment later?

Bindings are debounced. When a property changes several times in a row, its elements are updated once, after the current task ends; the same goes for input read from an element. This keeps a burst of changes from touching the DOM many times.

For code that has to see the DOM right away, such as a test, wait a tick (`await new Promise((r) => setTimeout(r))`) or turn the debounce off for that binding:

```js
bindNode(object, 'x', '.x', null, { debounceSetValue: false, debounceGetValue: false });
```

The flags and the delays are described on the [`bindNode`](/api/matreshka/bind-node/#flags-debouncegetvaluetrue-and-debouncesetvaluetrue) page. The pattern itself is explained [in this article](https://davidwalsh.name/javascript-debounce-function).

## How do I pre-render an application on a server?

Any server template works: render the HTML as usual. On the client, [`bindNode`](/api/matreshka/bind-node/) reads the value of an element into a property that has no value yet, and [`Matreshka.Array#restore`](/api/matreshka-array/restore/) rebuilds a collection from the rendered elements. You can also run Matreshka itself on Node.js with [jsdom](https://github.com/jsdom/jsdom) to generate static HTML.

## How is a big application structured?

As one nested object where every branch is a [`Matreshka`](/api/matreshka/) instance. New branches are created with [`Matreshka#instantiate`](/api/matreshka/instantiate/), which keeps every branch an instance of its class and lets you replace a part of the state with a plain assignment.

## How do I render one object in two collections?

First, set `bindRenderedAsSandbox` to `false` in the item class. It turns off the automatic sandbox of a rendered object: one object can't have two sandboxes.

Then, when the object is rendered, check which collection rendered it. The `render` event (and the `onRender` method) gets the collection as `parentArray`.

Example: a `User` class and two collections, `UsersA` and `UsersB`, whose [`itemRenderer`](/api/matreshka-array/item-renderer/) can differ. Both use `User` as their [`Model`](/api/matreshka-array/model/).

```js
class User extends Matreshka.Object {
    constructor() {
        super();

        this.bindRenderedAsSandbox = false;

        setInterval(() => {
            // when "name" changes, the elements in both collections change
            this.name = Math.random();
        }, 5000);
    }
    onRender(evt) {
        const { parentArray, node } = evt;

        if (parentArray instanceof UsersA) {
            this.bindNode({
                // a key for the rendered node, so the selectors below can start from it
                nodeA: node,
                name: ':bound(nodeA) .name',
                email: ':bound(nodeA) .email',
            });
        } else if (parentArray instanceof UsersB) {
            this.bindNode({
                nodeB: node,
                name: ':bound(nodeB) .user-name',
            });
        }
    }
}
```

The bindings can also live in the collection classes instead: a collection listens to the `render` event of the objects it inserts.
