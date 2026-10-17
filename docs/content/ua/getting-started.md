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

`initRouter(object, '/a/b/')` синхронізує `object.a` і `object.b` з частинами `location.hash` після `#!` (`#!/foo/bar/`); в URL значення закодовані, у властивостях — декодовані. Щоб натомість використовувати шлях через History API, передайте `'history'` третім аргументом. `parseForm(object, form)` повертає форму або `null`, якщо форму не знайдено. Докладніше: [`Matreshka.initRouter`](/ua/api/matreshka-static/init-router/), [`Matreshka.parseForm`](/ua/api/matreshka-static/parse-form/).

```js
import { initRouter } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

### Тег script

Без збирача підключіть браузерний бандл. Він визначає глобальну змінну `Matreshka` з роутером і парсером форм: `Matreshka.initRouter`, `Matreshka.Router` і `Matreshka.parseForm`. Він працює в тих самих браузерах, що й jQuery 4, зокрема в Internet Explorer 11.

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
```

Цей самий файл віддає і цей сайт: [/matreshka.min.js](/matreshka.min.js).

### ES-модуль з CDN

Без збирача можна імпортувати `matreshka.min.mjs` — той самий код одним ES-модулем: усі іменовані експорти `matreshka`, а також `initRouter`, `Router` і `parseForm`. Це один запит, і важить він стільки ж, скільки файл для тегу script.

```html
<script type="module">
  import { bindNode, calc, binders, initRouter } from 'https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.mjs';
</script>
```

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

Для того, щоб не лякати новачків речами, які використовуються відносно рідко, інші методи і властивості за замовчуванням приховані. Якщо ви хочете знати про фреймворк все, без винятку, оберіть <span class="mk-circles" data-level="3" aria-hidden="true"><i></i><i></i><i></i></span> на перемикачі зліва, в меню.

**Увага**, якщо ви перейдете по посиланню до методу або властивості третього рівня важливості, то третій рівень увімкнеться автоматично.

Далі: [Hello World та інші приклади](/ua/examples/).
