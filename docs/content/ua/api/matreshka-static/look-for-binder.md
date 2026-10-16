---
title: "Matreshka.lookForBinder"
sidebarTitle: "lookForBinder"
description: "Matreshka.lookForBinder: Повертає байндер, відповідний елементу. Якщо байндер не знайдений, повертає undefined. Функція перебирає Matreshka.defaultBinders для…"
importance: 3
---

# Matreshka.lookForBinder

**Метод**

**Імпорт:**

```js
import lookForBinder from 'matreshka/lookforbinder';
```

```js
Matreshka.lookForBinder(node) → binder
```

Повертає байндер, відповідний елементу. Якщо байндер не знайдений, повертає ``undefined``. Функція перебирає [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/) для пошуку байндера.

**Повертає:** [`binder`](/ua/api/types/binder/) – binder

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `node` | [`node`](/ua/api/types/node/) |  |

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)
- [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/)

## Приклади

```js
const element = document.createElement('input');
element.type = 'text';

console.log(Matreshka.lookForBinder(element));

// поверне приблизно такий об'єкт
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
