---
title: "Matreshka.binders"
asIndexPage: true
description: "Matreshka.binders: Пространство имен для байндеров. Из коробки содержит байндеры общего назначения (для связывания атрибутов и пр.). Этот объект можно…"
importance: 1
---

# Matreshka.binders

**Пространство имен**

**Импорт:**

```js
import { binders } from 'matreshka';
```

Пространство имен для байндеров. Из коробки содержит байндеры общего назначения (для связывания атрибутов и пр.). Этот объект можно расширять собственными свойствами, чтоб не засорять глобальное пространство имен.

Примите во внимание небольшое соглашение: каждое свойство из коллекции ``Matreshka.binders`` должно быть оформлено в виде функции (такие функции иногда называют "binder creator"), возвращающей байндер.

> В этой документации байндеры записаны полностью, например `Matreshka.binders.html()`. В своём коде удобнее вынести нужные байндеры в переменные:

```js
import { bindNode, binders } from 'matreshka';

const { html, text, prop } = binders;

bindNode(object, 'x', '.my-node', html());
```

`binders` — тот же объект, что и `Matreshka.binders`.

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)
- [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/)

## Примеры

```js
Matreshka.binders.myCoolBinder = (var1, var2) => {
	return {
		on: 'click',
		getValue() { ... },
		setValue() { ... },
		initialize() { ... },
		destroy() { ... }
	};
};

this.bindNode('myKey', '.my-element',
	Matreshka.binders.myCoolBinder('Hello', 'World'));
```

## Свойства и методы

- [`attr`](/ru/api/binders/attr/) – Возвращает байндер, меняющий атрибут DOM элемента на значение свойства объекта
- [`className`](/ru/api/binders/class-name/) – Возвращает байндер, который переключает имя класса DOM элемента в зависимости от значения свойства объекта. Если значение свойства нестрого равно ``true``, имя класса добавляется, в противном случае - убирается. Логику можно изменить, передав ``false`` вторым аргументом, и, таким образом, имя класса будет добавляться, когда значение свойства нестрого равно ``false`` и наоборот.
- [`dataset`](/ru/api/binders/dataset/) – Возвращает байндер, меняющий заданное свойство объекта [dataset](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset) DOM элемента в зависимости от значения свойства объекта.
- [`display`](/ru/api/binders/display/) – Возвращает байндер для одностороннего связывания, меняющий видимость DOM элемента (используя ``style.display``), в зависимости от значения свойства объекта
- [`existence`](/ru/api/binders/existence/) – Возвращает байндер для одностороннего связывания, переключающий наличие элемента в DOM дереве, в зависимости от значения свойства объекта
- [`html`](/ru/api/binders/html/) – Возвращает байндер, меняющий ``innerHTML`` DOM элемента в зависимости от значения свойства объекта
- [`input`](/ru/api/binders/input/) _(для опытных)_ – Возвращает байндер, связывающий свойство объекта с элементом ``input``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).
- [`output`](/ru/api/binders/output/) _(для опытных)_ – Возвращает байндер, связывающий свойство объекта с элементом ``output``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).
- [`progress`](/ru/api/binders/progress/) _(для опытных)_ – Возвращает байндер, связывающий свойство объекта с элементом ``progress``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).
- [`prop`](/ru/api/binders/prop/) – Возвращает байндер, меняющий свойство DOM элемента на значение свойства объекта
- [`select`](/ru/api/binders/select/) _(для опытных)_ – Возвращает байндер, связывающий свойство объекта с элементом ``select``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).
- [`style`](/ru/api/binders/style/) – Возвращает байндер, меняющий заданное свойство стиля DOM элемента в зависимости от значения свойства объекта.
- [`text`](/ru/api/binders/text/) – Возвращает байндер, меняющий ``textContent`` (текстовое содержимое) DOM элемента в зависимости от значения свойства объекта.
- [`textarea`](/ru/api/binders/textarea/) _(для опытных)_ – Возвращает байндер, связывающий свойство объекта с элементом ``textarea``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).
