---
title: "С чего начать"
description: "Как подключить Matreshka.js тегом script, ES-модулем с CDN или из npm, первые привязки на обычном объекте и переход с версии 2.x."
---

# С чего начать

## Установка

### Тег script

Без сборки. Бандл объявляет одну глобальную переменную `Matreshka`, в которую входят роутер и парсер форм. Он рассчитан на современные браузеры.

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
  const { bindNode, calc, binders } = Matreshka;
</script>
```

Этот же файл лежит и на этом сайте: [/matreshka.min.js](/matreshka.min.js).

### ES-модуль с CDN

```html
<script type="module">
  import Matreshka, { bindNode, calc } from 'https://cdn.jsdelivr.net/npm/matreshka@3/+esm';
</script>
```

### npm

```sh
npm install matreshka
```

```js
import Matreshka, { bindNode, calc, on, mediate, binders, MatreshkaObject, MatreshkaArray } from 'matreshka';
```

Каждая статическая функция `Matreshka` доступна как именованный экспорт; так же экспортируются классы и `binders`. На каждой странице справочника API указан нужный импорт. Пакет поставляется только в виде ES-модулей и содержит типы TypeScript.

В Node.js 22.12 и новее его можно загрузить и через `require` — он вернёт объект экспортов:

```js
const { Matreshka, bindNode } = require('matreshka');
```

## Первый пример

```html
<input class="name">
<p>Привет, <span class="greeting"></span>!</p>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
  const { bindNode, calc, binders } = Matreshka;
  const page = {};

  // page.name следит за полем, а поле — за page.name
  bindNode(page, 'name', '.name');

  // page.greeting пересчитывается при каждом изменении page.name
  calc(page, 'greeting', 'name', (name) => name || 'незнакомец');

  // span показывает page.greeting как текст
  bindNode(page, 'greeting', '.greeting', binders.text());
</script>
```

`page` — обычный объект. Введите текст в поле или выполните в консоли `page.name = 'Анна'`: обновятся и поле, и приветствие.

У класса [`Matreshka`](/ru/api/matreshka/) те же функции есть в виде методов. Та же страница, написанная классом:

```js
import Matreshka from 'matreshka';

class Page extends Matreshka {
  constructor() {
    super();
    this.bindNode('name', '.name');
    this.calc('greeting', 'name', (name) => name || 'незнакомец');
    this.bindNode('greeting', '.greeting', Matreshka.binders.text());
  }
}

const page = new Page();
```

## Роутер и парсер форм

```js
import { initRouter, Router } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

В бандле для тега script они доступны как `Matreshka.initRouter`, `Matreshka.Router` и `Matreshka.parseForm`.

`initRouter(object, '/a/b/')` синхронизирует `object.a` и `object.b` с частями `location.hash` после `#!` (`#!/foo/bar/`); в URL значения закодированы, в свойствах — раскодированы. Чтобы работать с путём через History API, передайте третьим аргументом `'history'`. `parseForm(object, form)` привязывает поля формы к свойствам объекта по их именам и возвращает форму или `null`, если форма не найдена.

Посмотрите [демо роутера](/examples/router/#!/foo/bar/baz/) и [демо парсера форм](/examples/parse-form/).

## Переход с 2.x

- **Один пакет.** Роутер и парсер форм теперь входят в него (см. выше). Пакеты `matreshka-router` и `matreshka-parse-form` больше не поддерживаются.
- **Именованные экспорты вместо глубоких импортов.** Глубоких путей из 2.x (`matreshka/bindnode`, `matreshka/array/from`, `matreshka/binders/html`) больше нет. Импортируйте всё из `'matreshka'`: `import { bindNode } from 'matreshka'`. Байндер теперь берётся как `binders.html` из `import { binders } from 'matreshka'` или как `Matreshka.binders.html`.
- **Только ES-модули** с типами TypeScript. `require('matreshka')` работает в Node.js 22.12 и новее и возвращает объект экспортов.
- **Один бандл для тега script**, в который входят роутер и парсер форм. Глобального псевдонима `MK` больше нет — используйте `Matreshka`.
- **Без DOM-библиотеки.** Метод из 2.x, который выбирал DOM-библиотеку, удалён, и Matreshka больше не обращается к глобальным jQuery или Zepto. [`bindNode`](/ru/api/matreshka/bind-node/) по-прежнему принимает объект jQuery или любой другой массивоподобный объект с элементами.
- **Обычные массивы элементов.** [`$nodes`](/ru/api/matreshka/dollar-nodes/), [`selectAll`](/ru/api/matreshka/select-all/) и `$` возвращают массивы.
- **Только `parserBrackets`.** Псевдоним с опечаткой в имени удалён.
- **Без записи обратно в источник.** Изменение, пришедшее из элемента, не записывается обратно в тот же элемент. Подробнее — в описании [`mediate`](/ru/api/matreshka/mediate/).

## Что дальше

Начните с [`bindNode`](/ru/api/matreshka/bind-node/), [`calc`](/ru/api/matreshka/calc/), [`on`](/ru/api/matreshka/on/), [`mediate`](/ru/api/matreshka/mediate/), [байндеров](/ru/api/binders/), [`Matreshka.Object`](/ru/api/matreshka-object/) и [`Matreshka.Array`](/ru/api/matreshka-array/). Редко нужные свойства и методы скрыты, пока в меню не включён режим «Для опытных»; подробнее — в разделе [Как пользоваться сайтом](/ru/website-instructions/).

Дальше: [примеры](/ru/examples/).
