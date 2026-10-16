---
title: "Matreshka#parseBindings"
sidebarTitle: "parseBindings"
description: "Matreshka#parseBindings: Parses DOM tree, declaring property bindings on which are double braced."
importance: 2
---

# Matreshka#parseBindings

**Method**

```js
Matreshka#parseBindings(node, [eventOptions]) → $nodes
```

Parses DOM tree, declaring property bindings on which are double braced.

Matreshka includes a simple DOM parser that handles double braced syntactic constructions. ``parseBindings`` method receives HTML string, DOM node or selector corresponding to DOM node as the first argument.

As the method is DOM template engine (and not HTML-replace parser), all child DOM nodes of the passed element remain in their same state (for example, DOM events aren’t erased).

### The supported syntax
1. HTML binding
```html
<!--
will create text node in place of {{user.name}}
and will bind name property from user object to this node
JS: this.user = {name: 'Joe'}
-->
<span>Hello, {{user.name}}</span>
```

2. Binding form elements.
```html
<!--
will bind "x" instance property to a text field (two-way data binding)
JS: this.x = 'some value';
-->
<input type="text" value="{{x}}">
<!--
For binding textarea and select you should use value attribute
-->
<textarea value="{{x}}"></textarea>
<select value="{{x}}">...</select>
<!--
will bind "x" instance property to a checkbox (two-way data binding)
JS: this.x = true;
-->
<input type="checkbox" checked="{{x}}">
```

3. Attributes binding.
```html
<!--
href attribute value will depend on "category"
and "someObject.page" value (one-way data binding)
JS:
 this.category = 'matreshka';
 this.someObject = { page: 42 };
-->
<a href="http://example.com/{{category}}/{{someObject.page}}">A link</a>
<!--
The result:
<a href="http://example.com/matreshka/42">A link</a>
-->
```

> If you want to use something else instead of braces look at [`Matreshka.parserBrackets`](/api/matreshka-static/parser-brackets/)

#### Why do we need this method?
In case if you develop a large form with standard HTML5 fields, the method will help you save time on declaring numerous bindings. Besides, ``parseBindings`` is useful in case of creating a very simple collection which doesn’t require implementation of a complicated [model](/api/matreshka-array/model/).

**Returns:** [`$nodes`](/api/types/dollar-nodes/) – A collection of DOM nodes, which is passed to the method as an argument.

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `node` | [`string`](/api/types/string/) \| [`node`](/api/types/node/) \| [`$nodes`](/api/types/dollar-nodes/) | HTML string, selector, DOM node or collection of DOM nodes |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | Event options which will be passed to all internal calls of [`Matreshka#bindNode`](/api/matreshka/bind-node/) |

## Examples

**Parsing of given node**

```js
this.parseBindings(node);
```

**Parsing of nodes matching given selector**

```js
this.parseBindings('.my-node');
```

**HTML string parsing**

```js
const $node = this.parseBindings('<h3>Hello, {{name}}</h3>');
this.name = 'Arthur Philip Dent';
```
