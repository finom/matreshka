---
title: "Matreshka#trigger"
sidebarTitle: "trigger"
description: "Matreshka#trigger: Fires an event. Matreshka.js API reference"
importance: 1
---

# Matreshka#trigger

**Method**

```js
Matreshka#trigger([names], [arg]) → matreshka
```

Fires an event

After adding event handlers using [`Matreshka#on`](/api/matreshka/on/), [`Matreshka#onDebounce`](/api/matreshka/on-debounce/) or [`Matreshka#once`](/api/matreshka/once/), any event can be fired manually using this method.

> Note that the method has [static alternative](/api/matreshka-static/trigger/)

**Returns:** [`matreshka`](/api/types/matreshka/) – self

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `names` (optional) | [`eventNames`](/api/types/event-names/) | An event name or some names which are separated by a space |
| `arg` (optional) | `...*` | Any arguments which will be passed to every handler |

## Links

- [`Matreshka#on`](/api/matreshka/on/)
- [`Matreshka#once`](/api/matreshka/once/)
- [`Matreshka#onDebounce`](/api/matreshka/on-debounce/)
- [`Matreshka#off`](/api/matreshka/off/)

## Examples

```js
this.on('foo bar', (a, b, c) => {
	alert(a + b + c);
});
this.trigger('foo', 1, 2, 3); // alerts 6
```
