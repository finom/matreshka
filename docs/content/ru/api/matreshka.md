---
title: "Matreshka"
asIndexPage: true
description: "Matreshka: Класс Matreshka - ядро фреймворка Matreshka.js, от которого наследуются Matreshka.Array, Matreshka.Object и каждый класс создаваемого приложения…"
importance: 1
---

# Matreshka

**Класс**

**Импорт:**

```js
import Matreshka from 'matreshka';
```

Класс ``Matreshka`` - ядро фреймворка Matreshka.js, от которого наследуются [`Matreshka.Array`](/ru/api/matreshka-array/), [`Matreshka.Object`](/ru/api/matreshka-object/) и каждый класс создаваемого приложения. Он содержит основной функционал фреймворка: [медиаторы](/ru/api/matreshka/mediate/), [зависимости](/ru/api/matreshka/calc/), [привязки к DOM](/ru/api/matreshka/bind-node/), [движок событий](/ru/api/matreshka/on/) и пр.

Как правило, этот класс, (как и [`Matreshka.Array`](/ru/api/matreshka-array/) и [`Matreshka.Object`](/ru/api/matreshka-object/)), не используются напрямую. Вместо этого, от него наследуются классы, создаваемые разработчиком.

## Ссылки

- [`Matreshka.Class`](/ru/api/matreshka-static/class/)

## Примеры

**Создание экземпляра**

```js
const matreshka = new Matreshka();
```

**Наследование**

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

**Наследование при помощи функции [`Matreshka.Class`](/ru/api/matreshka-static/class/)**

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

## Члены класса

- [`bindNode`](/ru/api/matreshka/bind-node/) – Связывает свойство объекта с HTML элементом
- [`bindOptionalNode`](/ru/api/matreshka/bind-optional-node/) – Работает в точности так же, как и [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/) но не бросает исключение, если аргумент ``node`` - пустой массив, ``undefined`` или не существует
- [`bindSandbox`](/ru/api/matreshka/bind-sandbox/) _(Для продвинутых)_ – Привязывает песочницу
- [`calc`](/ru/api/matreshka/calc/) – Создает зависимость значения одного свойства от значений других
- [`instantiate`](/ru/api/matreshka/instantiate/) – Создаёт фиксированный экземпляр класса
- [`isMatreshka`](/ru/api/matreshka/is-matreshka/) _(Для продвинутых)_ – ``isMatreshka`` всегда равен ``true`` для экземпляров [`Matreshka`](/ru/api/matreshka/)
- [`mediate`](/ru/api/matreshka/mediate/) – Трансформирует значение свойства при его изменении
- [`$nodes`](/ru/api/matreshka/dollar-nodes/) _(Для продвинутых)_ – Объект содержит коллекции (jQuery, Zepto, инстанс встроенной микро-библиотеки, унаследованной от ``Array.prototype``) привязанных элементов для быстрого доступа.
- [`nodes`](/ru/api/matreshka/nodes/) _(Для продвинутых)_ – Объект содержит привязанные элементы для быстрого доступа, в виде отдельных DOM узлов.
- [`off`](/ru/api/matreshka/off/) – Удаляет обработчик события
- [`on`](/ru/api/matreshka/on/) – Добавляет обработчик события
- [`onDebounce`](/ru/api/matreshka/on-debounce/) – Добавляет обработчик события, вызываемый лишь однажды за определенный промежуток времени
- [`once`](/ru/api/matreshka/once/) – Добавляет обработчик событий, который может быть вызван однажды
- [`parseBindings`](/ru/api/matreshka/parse-bindings/) – Парсит DOM дерево, объявляя привязки свойств, заключенных в двойные фигурные скобки.
- [`remove`](/ru/api/matreshka/remove/) _(Для продвинутых)_ – Удаляет свойство
- [`select`](/ru/api/matreshka/select/) – Возвращает элемент из песочницы, соответствующий селектору
- [`selectAll`](/ru/api/matreshka/select-all/) – Возвращает элементы из песочницы, соответствующие селектору
- [`set`](/ru/api/matreshka/set/) – Устанавливает значение свойства, позволяя передать объект события в качестве третьего аргумента
- [`trigger`](/ru/api/matreshka/trigger/) – Генерирует событие
- [`unbindNode`](/ru/api/matreshka/unbind-node/) – Разрывает связь между свойством и HTML элементом

## Статичные методы

- [`Class`](/ru/api/matreshka-static/class/) – Реализация классов, основанная на прототипном наследовании
- [`bindNode`](/ru/api/matreshka-static/bind-node/) _(Для продвинутых)_ – Связывает свойство объекта с HTML элементом
- [`bindOptionalNode`](/ru/api/matreshka-static/bind-optional-node/) _(Для продвинутых)_ – Связывает элемент со свойством, но не бросает исключение, если аргумент node - пустой массив, ``undefined`` или не существует
- [`bindSandbox`](/ru/api/matreshka-static/bind-sandbox/) _(Для продвинутых)_ – Связывает свойство ``sandbox`` с элементом и отвязывает предыдущий элемент, если таковой существует
- [`calc`](/ru/api/matreshka-static/calc/) _(Для продвинутых)_ – Создает зависимость значения одного свойства от значений других
- [`chain`](/ru/api/matreshka-static/chain/) – Позволяет вызывать универсальные методы цепочкой
- [`defaultBinders`](/ru/api/matreshka-static/default-binders/) – Массив функций, возвращающих соответствующий байндер или ``undefined``
- [`instantiate`](/ru/api/matreshka-static/instantiate/) _(Для продвинутых)_ – Создаёт фиксированный экземпляр класса
- [`lookForBinder`](/ru/api/matreshka-static/look-for-binder/) _(Для продвинутых)_
- [`mediate`](/ru/api/matreshka-static/mediate/) _(Для продвинутых)_ – Трансформирует значение свойства при его изменении
- [`off`](/ru/api/matreshka-static/off/) _(Для продвинутых)_ – Удаляет обработчик события
- [`on`](/ru/api/matreshka-static/on/) _(Для продвинутых)_ – Добавляет обработчик события
- [`onDebounce`](/ru/api/matreshka-static/on-debounce/) _(Для продвинутых)_ – Добавляет обработчик события, вызываемый лишь однажды за определенный промежуток времени
- [`once`](/ru/api/matreshka-static/once/) _(Для продвинутых)_ – Добавляет обработчик события, который может быть вызван однажды
- [`parseBindings`](/ru/api/matreshka-static/parse-bindings/) _(Для продвинутых)_ – Парсит DOM дерево, объявляя привязки свойств, заключенных в двойные фигурные скобки.
- [`parserBrackets`](/ru/api/matreshka-static/parser-brackets/) _(Для продвинутых)_ – Содержит скобки для [парсера](/ru/api/matreshka/parse-bindings/)
- [`remove`](/ru/api/matreshka-static/remove/) _(Для продвинутых)_ – Удаляет свойство
- [`select`](/ru/api/matreshka-static/select/) _(Для продвинутых)_ – Возвращает элемент из песочницы, соответствующий селектору
- [`selectAll`](/ru/api/matreshka-static/select-all/) _(Для продвинутых)_ – Возвращает элементы из песочницы, соответствующие селектору
- [`set`](/ru/api/matreshka-static/set/) _(Для продвинутых)_ – Устанавливает значение свойства, позволяя передать объект события в качестве третьего аргумента
- [`toMatreshka`](/ru/api/matreshka-static/to-matreshka/) _(Для продвинутых)_ – Функция, конвертирующая произвольную структуру объектов и массивов в экземпляры [`Matreshka.Object`](/ru/api/matreshka-object/) и [`Matreshka.Array`](/ru/api/matreshka-array/)
- [`trigger`](/ru/api/matreshka-static/trigger/) _(Для продвинутых)_ – Генерирует событие
- [`unbindNode`](/ru/api/matreshka-static/unbind-node/) _(Для продвинутых)_ – Разрывает связь между свойством и HTML элементом
