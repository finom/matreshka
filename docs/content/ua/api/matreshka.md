---
title: "Matreshka"
asIndexPage: true
description: "Matreshka: Клас Matreshka - це ядро ​​фреймворка Matreshka.js, від якого успадковуються Matreshka.Array, Matreshka.Object і кожен клас створюваного додатка…"
importance: 1
---

# Matreshka

**Клас**

**Імпорт:**

```js
import Matreshka from 'matreshka/matreshka';
```

Клас `` Matreshka`` - це ядро ​​фреймворка Matreshka.js, від якого успадковуються [`Matreshka.Array`](/ua/api/matreshka-array/), [`Matreshka.Object`](/ua/api/matreshka-object/) і кожен клас створюваного додатка. Він містить основний функціонал фреймворка: [медіатори](/ua/api/matreshka/mediate/), [залежності](/ua/api/matreshka/calc/), [прив'язки до DOM](/ua/api/matreshka/bind-node/), [механізм подій](/ua/api/matreshka/on/) тощо.

Як правило, цей клас, (як і [`Matreshka.Array`](/ua/api/matreshka-array/) і [`Matreshka.Object`](/ua/api/matreshka-object/)), не використовуються безпосередньо. Замість цього, від нього успадковуються класи, створювані розробником.

## Посилання

- [`Matreshka.Class`](/ua/api/matreshka-static/class/)

## Приклади

**Створення екземпляру**

```js
const matreshka = new Matreshka();
```

**Спадкування**

```js
class MyClass extends Matreshka {
	constructor() {
		this.sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}
```

**Спадкування за допомогою функції [`Matreshka.Class`](/ua/api/matreshka-static/class/)**

```js
const MyClass = Matreshka.Class({
	'extends': Matreshka,
	constructor() {
		this.sayHello();
	},
	sayHello() {
		alert("Hello World!");
	}
});
```

## Члени класу

- [`bindNode`](/ua/api/matreshka/bind-node/) – Пов'язує властивість об'єкта з HTML елементом
- [`bindOptionalNode`](/ua/api/matreshka/bind-optional-node/) – Працює в точності так само, як і [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) але не кидає виняток, якщо аргумент ``node`` - порожній масив, ``undefined`` або не існує
- [`bindSandbox`](/ua/api/matreshka/bind-sandbox/) _(Для просунутих)_ – Прив'язує пісочницю
- [`calc`](/ua/api/matreshka/calc/) – Створює залежність значення однієї властивості від значень інших
- [`instantiate`](/ua/api/matreshka/instantiate/) – Створює фіксований екземпляр класу
- [`isMatreshka`](/ua/api/matreshka/is-matreshka/) _(Для просунутих)_ – ``isMatreshka`` завжди дорівнює ``true`` для экземплярів [`Matreshka`](/ua/api/matreshka/)
- [`mediate`](/ua/api/matreshka/mediate/) – Трансформує значення властивості при його зміні
- [`$nodes`](/ua/api/matreshka/dollar-nodes/) _(Для просунутих)_ – Об'єкт містить колекції (jQuery, Zepto, інстанси вбудованої мікро-бібліотеки, успадкованої від ``Array.prototype``) прив'язаних елементів для швидкого доступу.
- [`nodes`](/ua/api/matreshka/nodes/) _(Для просунутих)_ – Об'єкт містить прив'язані елементи для швидкого доступу, у вигляді окремих DOM вузлів.
- [`off`](/ua/api/matreshka/off/) – Видаляє обробник події
- [`on`](/ua/api/matreshka/on/) – Додає обробник події
- [`onDebounce`](/ua/api/matreshka/on-debounce/) – Додає обробник події, що викликається лише одного разу за певний проміжок часу
- [`once`](/ua/api/matreshka/once/) – Додає обробник подій, який може бути викликаний один раз
- [`parseBindings`](/ua/api/matreshka/parse-bindings/) – Парсить DOM дерево, оголошуючи прив'язки властивостей, взятих в подвійні фігурні дужки.
- [`remove`](/ua/api/matreshka/remove/) _(Для просунутих)_ – Видаляє властивість
- [`select`](/ua/api/matreshka/select/) – Повертає елемент з пісочниці, відповідний селектору
- [`selectAll`](/ua/api/matreshka/select-all/) – Повертає єлементі з пісочниці, відповідні селектору
- [`set`](/ua/api/matreshka/set/) – Встановлює значення властивості, дозволяючи передати об'єкт події в якості третьої аргументу
- [`trigger`](/ua/api/matreshka/trigger/) – Генерує подію
- [`unbindNode`](/ua/api/matreshka/unbind-node/) – Розриває зв'язок між властивістю і HTML елементом

## Статичні методи

- [`Class`](/ua/api/matreshka-static/class/) – Реалізація класів, заснована на прототипному спадкуванні
- [`bindNode`](/ua/api/matreshka-static/bind-node/) _(Для просунутих)_ – Пов'язує властивість об'єкта з HTML елементом
- [`bindOptionalNode`](/ua/api/matreshka-static/bind-optional-node/) _(Для просунутих)_ – Пов'язує елемент із властивістю, але не кидає виняток, якщо аргумент node - порожній масив, ``undefined`` або не існує
- [`bindSandbox`](/ua/api/matreshka-static/bind-sandbox/) _(Для просунутих)_ – Пов'язує властивість ``sandbox`` з елементом і одв'язує попередній елемент, якщо такий існує
- [`calc`](/ua/api/matreshka-static/calc/) _(Для просунутих)_ – Створює залежність значення одної властивості від значень інших
- [`chain`](/ua/api/matreshka-static/chain/) – Дозволяє викликати універсальні методи ланцюгом
- [`defaultBinders`](/ua/api/matreshka-static/default-binders/) – Масив функцій, які повертають відповідний Байндер або ``undefined``
- [`instantiate`](/ua/api/matreshka-static/instantiate/) _(Для просунутих)_ – Створює фіксований екземпляр класу
- [`lookForBinder`](/ua/api/matreshka-static/look-for-binder/) _(Для просунутих)_
- [`mediate`](/ua/api/matreshka-static/mediate/) _(Для просунутих)_ – Трансформує значення властивості при його зміні
- [`off`](/ua/api/matreshka-static/off/) _(Для просунутих)_ – Видаляє обробник події
- [`on`](/ua/api/matreshka-static/on/) _(Для просунутих)_ – Додає обробник події
- [`onDebounce`](/ua/api/matreshka-static/on-debounce/) _(Для просунутих)_ – Додатє обробник події, що викликається лише однин раз за певний проміжок часу
- [`once`](/ua/api/matreshka-static/once/) _(Для просунутих)_ – Додає обробник події, який може бути викликаний лише один раз
- [`parseBindings`](/ua/api/matreshka-static/parse-bindings/) _(Для просунутих)_ – Парсить DOM дерево, оголошуючи прив'язки властивостей, взятих в подвійні фігурні дужки
- [`parserBrackets`](/ua/api/matreshka-static/parser-brackets/) _(Для просунутих)_ – Містить дужки для [парсера](/ua/api/matreshka/parse-bindings/)
- [`remove`](/ua/api/matreshka-static/remove/) _(Для просунутих)_ – Видаляє властивість
- [`select`](/ua/api/matreshka-static/select/) _(Для просунутих)_ – Повертає елемент з пісочниці, відповідний селектору
- [`selectAll`](/ua/api/matreshka-static/select-all/) _(Для просунутих)_ – Повертає елементи з пісочниці, відповідні селектору
- [`set`](/ua/api/matreshka-static/set/) _(Для просунутих)_ – Встановлює значення властивості, дозволяючи передати об'єкт події в якості третьої аргументу
- [`toMatreshka`](/ua/api/matreshka-static/to-matreshka/) _(Для просунутих)_ – Функція, яка конвертує довільну структуру об'єктів і масивів в екземпляри [`Matreshka.Object`](/ua/api/matreshka-object/) та [`Matreshka.Array`](/ua/api/matreshka-array/)
- [`trigger`](/ua/api/matreshka-static/trigger/) _(Для просунутих)_ – Генерує подію
- [`unbindNode`](/ua/api/matreshka-static/unbind-node/) _(Для просунутих)_ – Розриває зв'язок між властивістю і HTML елементом
