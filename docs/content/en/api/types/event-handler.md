---
title: "eventHandler"
sidebarTitle: "eventHandler"
description: "eventHandler: Event handler. Takes any arguments passed to Matreshka#trigger"
importance: 2
---

# eventHandler

**Type**

Event handler. Takes any arguments passed to [`Matreshka#trigger`](/api/matreshka/trigger/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `options` | `...*` | Any arguments |

## Examples

```js
const eventHandler = (...args) => {
	console.log(args);
};
this.on('fyeah', eventHandler);
// logs 'foo', 'bar', 'baz'
this.trigger('fyeah', 'foo', 'bar', 'baz');
```
