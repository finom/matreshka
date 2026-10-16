---
title: "Matreshka.lookForBinder"
sidebarTitle: "lookForBinder"
description: "Matreshka.lookForBinder: Возвращает байндер, соответствующий элементу. Если таковой не найден, возвращает undefined. Функция перебирает…"
importance: 3
---

# Matreshka.lookForBinder

**Метод**

**Импорт:**

```js
import { lookForBinder } from 'matreshka';
```

```js
Matreshka.lookForBinder(node) → binder
```

Возвращает байндер, соответствующий элементу. Если таковой не найден, возвращает ``undefined``. Функция перебирает [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/) для поиска байндера.

**Возвращает:** [`binder`](/ru/api/types/binder/) – binder

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `node` | [`node`](/ru/api/types/node/) |  |

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)
- [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/)

## Примеры

```js
const element = document.createElement('input');
element.type = 'text';

console.log(Matreshka.lookForBinder(element));

// вернет примерно такой объект
{
	on: 'input',
	getValue() {
		return this.value;
	},
	setValue(v) {
		this.value = v;
	}
}
```
