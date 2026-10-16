---
title: "Как начать"
description: "Установка Matreshka.js из npm или CDN, импорт всего фреймворка или отдельных модулей и три уровня важности в справочнике API."
---

# Как начать

## Установка

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';
// или через CommonJS (Node.js 22.12+)
const { Matreshka } = require('matreshka');
```

Роутер и парсер форм — в том же пакете: `matreshka/router` связывает свойства с частями URL, `matreshka/parse-form` связывает именованные поля формы со свойствами.

`initRouter(object, '/a/b/')` синхронизирует `object.a` и `object.b` с частями `location.hash` после `#!` (`#!/foo/bar/`); в URL значения закодированы, в свойствах — декодированы. Чтобы вместо этого использовать путь через History API, передайте `'history'` третьим аргументом. `parseForm(object, form)` возвращает форму или `null`, если форма не найдена.

```js
import { initRouter } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

### Тег script

Без сборщика подключите браузерный бандл. Он определяет глобальную переменную `Matreshka` с роутером и парсером форм: `Matreshka.initRouter`, `Matreshka.Router` и `Matreshka.parseForm`. Бандл рассчитан на современные браузеры.

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
```

Этот же файл отдаёт и этот сайт: [/matreshka.min.js](/matreshka.min.js).

## Модули

Каждая статичная функция или класс — именованный экспорт главного модуля.

```js
import { MatreshkaArray, bindNode, binders } from 'matreshka';

const { prop } = binders;
```

## Уровни важности

Документация разбита на три уровня "продвинутости".

### Первый уровень — самое важное

Изучив самые важные свойства и методы, вы можете смело приступать к работе. Начните с [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/), [`Matreshka#calc`](/ru/api/matreshka/calc/), [`Matreshka#on`](/ru/api/matreshka/on/), [`Matreshka.Object`](/ru/api/matreshka-object/) и [`Matreshka.Array`](/ru/api/matreshka-array/).

### Второй уровень — рекомендуется изучить

После того, как вы освоили необходимые для быстрого старта возможности, можете ознакомиться с другими, менее важными (но всё еще важными) свойствами и методами Matreshka.js.

### Третий уровень — остальные методы и свойства

Для того, чтоб не пугать новичков вещами, которые используются относительно редко, все неважные методы и свойства по умолчанию скрыты. Если вы хотите знать о фреймворке всё, без исключения, выберите <span class="mk-circles" data-level="3" aria-hidden="true"><i></i><i></i><i></i></span> на переключателе слева, в меню.

**Внимание**, если вы перейдете по ссылке к методу или свойству третьего уровня важности, то третий уровень включится автоматически.

Далее: [Hello World и другие примеры](/ru/examples/).
