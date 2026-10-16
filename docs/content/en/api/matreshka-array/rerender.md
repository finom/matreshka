---
title: "Matreshka.Array#rerender"
sidebarTitle: "rerender"
description: "Matreshka.Array#rerender: Rerenders DOM nodes of items which are included into an instance"
importance: 3
---

# Matreshka.Array#rerender

**Method**

```js
Matreshka.Array#rerender([eventOptions]) → matreshkaArray
```

Rerenders DOM nodes of items which are included into an instance

This method renders array items in an array container. If a node which is associated to an array item has already been created, the method reinserts it into container of the array instead of rerendering it all over again.

The method can be useful in case when items have been added to the array before declaring a sandbox or a container.

To force items rerender (e. g. you use custom template engine) pass a property ``forceRerender`` with ``true`` value to an event object.

**Returns:** [`matreshkaArray`](/api/types/matreshka-array/) – self

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | An event options |

## Examples

```js
this.rerender({
	forceRerender: true
});
```
