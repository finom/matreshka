---
title: "Matreshka.binders"
asIndexPage: true
description: "Matreshka.binders: Простір імен для байндерів. З коробки містить байндери загального призначення (для зв'язування атрибутів і ін.). Цей об'єкт можна…"
importance: 1
---

# Matreshka.binders

**Простір імен**

**Імпорт:**

```js
import { binders } from 'matreshka';
```

Простір імен для байндерів. З коробки містить байндери загального призначення (для зв'язування атрибутів і ін.). Цей об'єкт можна розширювати власними властивостями, щоб не засмічувати глобальний простір імен.

Візьміть до уваги невелику угоду: кожна властивість з неймспейсу ``Matreshka.binders`` має бути оформлено у вигляді функції (такі функції іноді називають "binder creator"), що повертає байндер-об'єкт.

> У цій документації властивості з ``Matreshka.binders`` використовуються безпосередньо, але для поліпшення читабельності коду, рекомендується виносити їх в окремі змінні.

```js
const html = Matreshka.binders.html;

// ...
this.bindNode('x', node, html());
```
Або імпортувати в якості CJS модуля:
```js
// імпорт відразу декількох байндерів
import { binders } from 'matreshka';

const { html, text, prop } = binders;
```

Біндери входять до пакета ``matreshka``.

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)
- [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/)

## Приклади

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

## Байндери

- [`attr`](/ua/api/binders/attr/) – Повертає байндер, який змінює атрибут DOM елемента на значення властивості об'єкту
- [`className`](/ua/api/binders/class-name/) – Повертає байндер, який перемикає ім'я класу DOM елемента в залежності від значення властивості об'єкта. Якщо значення властивості нестрого дорівнює ``true``, ім'я класу додається, в іншому випадку - забирається. Логіку можна змінити, передавши ``false`` другим аргументом, і, таким чином, ім'я класу буде додаватися, коли значення властивості нестрого дорівнює ``false`` і навпаки.
- [`dataset`](/ua/api/binders/dataset/) – Повертає байндер, який змінює властивість [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) DOM элемента в залежності від значення властивості об'єкта.
- [`display`](/ua/api/binders/display/) – Повертає байндер для одностороннього зв'язування, який змінює видимість DOM елементу (використовуючи ``style.display``), в залежності від значення властивості об'єкта
- [`existence`](/ua/api/binders/existence/) – Повертає байндер для одностороннього зв'язування, що перемикає наявність елемента в DOM дереві, в залежності від значення властивості об'єкта
- [`html`](/ua/api/binders/html/) – Повертає байндер, який змінює ``innerHTML`` DOM елемента в залежності від значення властивості об'єкта
- [`input`](/ua/api/binders/input/) – Повертає байндер, що зв'язує властивість об'єкта з елементом ``input``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).
- [`output`](/ua/api/binders/output/) – Повертає байндер, що зв'язує властивість об'єкта з елементом ``output``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).
- [`progress`](/ua/api/binders/progress/) – Повертає байндер, що зв'язує властивість об'єкта з елементом ``progress``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).
- [`prop`](/ua/api/binders/prop/) – Повертає байндер, який змінює властивість DOM елемента на значення властивості об'єкта
- [`select`](/ua/api/binders/select/) – Повертає байндер, що зв'язує властивість об'єкта з елементом ``select``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).
- [`style`](/ua/api/binders/style/) – Повертає байндер, який змінює задану властивість стилю DOM елемента в залежності від значення властивості об'єкта
- [`text`](/ua/api/binders/text/) – Повертає байндер, який змінює ``textContent`` (текстовий вміст) DOM елемента в залежності від значення властивості об'єкта.
- [`textarea`](/ua/api/binders/textarea/) – Повертає байндер, що зв'язує властивість об'єкта з елементом ``textarea``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).
