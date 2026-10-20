---
title: "binder"
sidebarTitle: "binder"
description: "binder: binder (байндер, прів'язчик) містить всю інформацію про те, як синхронізувати значення властивості з прив'язаним до нього DOM елементом. Для всіх…"
importance: 2
---

# binder

**Тип**

``binder`` (байндер, прів'язчик) містить всю інформацію про те, як синхронізувати значення властивості з прив'язаним до нього DOM елементом. Для всіх методів байндера контекст (``this``) - відповідний DOM вузол.

## Властивості

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `on` (необов'язковий) | [`string`](/ua/api/types/string/) \| [`function`](/ua/api/types/function/) | Ім'я DOM події (або список імен подій, розділених пробілами), після спрацювання якогї витягується стан DOM елемента і встановлюється властивість. Крім цього, значенням властивості може бути функція, яка встановлює обробник довільним чином. |
| `getValue` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, яка відповідає за те, як витягти стан DOM елемента |
| `setValue` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, яка відповідає за те, як встановити значення DOM елементу |
| `initialize` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, яка запускається при ініціалізації прив'язки. Наприклад, може бути використана для ініціалізації jQuery плагіна |
| `destroy` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, яка викликається під час роботи ``unbindNode``. Якщо Байндер досить складний, ``destroy`` може містити видалення логіки яка більше не потрібна та звільнення пам'яті |

## Приклади

```js
const binder = {
	on: 'click',
	getValue(bindingOptions) {
		return this.value;
	},
	setValue(v, bindingOptions) {
		this.value = v;
	},
	initialize(bindingOptions) {
		alert('A binding is initialized');
	},
	destroy(bindingOptions) {
		alert('A binding is destroyed');
	}
};

this.bindNode('a', '.my-checkbox', binder);
```

```js
const binder = {
	on(callback, bindingOptions) {
		this.onclick = callback;
	},
	// ...
};
// ...
```
