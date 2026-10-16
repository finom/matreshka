---
title: "Як почати"
description: "Встановлення Matreshka.js з npm або CDN, імпорт усього фреймворку чи окремих модулів і три рівні важливості в довіднику API."
---

# Як почати

## Встановлення

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';
// або через CommonJS (Node.js 22.12+)
const { Matreshka } = require('matreshka');
```

Роутер і парсер форм — у тому ж пакеті: `matreshka/router` пов’язує властивості з частинами URL, `matreshka/parse-form` пов’язує іменовані поля форми з властивостями.

`initRouter(object, '/a/b/')` синхронізує `object.a` і `object.b` з частинами `location.hash` після `#!` (`#!/foo/bar/`); в URL значення закодовані, у властивостях — декодовані. Щоб натомість використовувати шлях через History API, передайте `'history'` третім аргументом. `parseForm(object, form)` повертає форму або `null`, якщо форму не знайдено.

```js
import { initRouter } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

### Тег script

Без збирача підключіть браузерний бандл. Він визначає глобальну змінну `Matreshka` з роутером і парсером форм: `Matreshka.initRouter`, `Matreshka.Router` і `Matreshka.parseForm`. Бандл розрахований на сучасні браузери.

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
```

Цей самий файл віддає і цей сайт: [/matreshka.min.js](/matreshka.min.js).

## Модулі

Кожна статична функція або клас — іменований експорт головного модуля.

```js
import { MatreshkaArray, bindNode, binders } from 'matreshka';

const { prop } = binders;
```

## Рівні важливості

Документація розбита на три рівні важливості.

### Перший рівень — найважливіше

Вивчивши найважливіші властивості і методи, ви можете сміливо приступати до роботи. Почніть з [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/), [`Matreshka#calc`](/ua/api/matreshka/calc/), [`Matreshka#on`](/ua/api/matreshka/on/), [`Matreshka.Object`](/ua/api/matreshka-object/) і [`Matreshka.Array`](/ua/api/matreshka-array/).

### Другий рівень — рекомендується вивчити

Після того, як ви освоїли необхідні для швидкого старту можливості, можете ознайомитися з іншими, менш важливими (але все ще важливими) властивостями і методами фреймворку.

### Третій рівень — інші методи і властивості

Методи і властивості, які використовуються відносно рідко, позначені «Для просунутих» і стоять останніми в кожному розділі меню. Читайте їх, коли захочете знати про фреймворк все, без винятку.

Далі: [Hello World та інші приклади](/ua/examples/).
