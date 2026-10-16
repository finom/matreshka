---
title: "Реактивний JavaScript фреймворк | Matreshka.js"
description: "Matreshka.js — простий JavaScript фреймворк для односторінкових додатків: двостороннє зв’язування даних, залежні властивості та події на звичайних класах."
sidebarTitle: "Головна"
---

# Matreshka.js

```html
<output class="out"></output>
<input class="in" type="text">

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
const app = new Matreshka();
app.bindNode('x', '.in, .out');
app.x = 'Простий фреймворк для створення односторінкових веб додатків';
</script>
```

## Навіщо Matreshka

Для сторінок, у яких HTML уже готовий: серверний рендеринг, віджети, старі проєкти, сторінка з одного HTML-файлу. Підключіть один тег `<script>` і прив’яжіть властивості об’єкта до елементів просто в JavaScript — розмітку змінювати не потрібно. Проєкт розвивається з 2013 року; версія 3.0 — це один пакет з ES-модулями та типами TypeScript.

## Фічі

- Реактивний API, що дозволяє ефективно вирішувати складні й заплутані задачі
- Менше помилок у коді
- Можливість рефакторінга легасі додатків, без переписування з нуля
- Освоїти фреймворк можна за кілька годин завдяки відсутності складних концепцій

Детальніше у [вступі](/ua/introduction/), або одразу до [довідника API](/ua/api/).

## Встановлення

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';
```

Для ШІ-агентів, що пишуть код (Claude Code, Cursor, Codex та інших), додайте скіл Matreshka:

```sh
npx skills add finom/matreshka
```

Документація також є [англійською](/) і [російською](/ru/).
