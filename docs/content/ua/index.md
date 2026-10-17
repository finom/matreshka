---
title: "JavaScript фреймворк із двостороннім зв’язуванням даних | Matreshka.js"
description: "Matreshka.js — JavaScript фреймворк із двостороннім зв’язуванням даних для готового HTML: один тег script, без збирання і без залежностей."
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

Для сторінок, у яких HTML уже готовий: серверний рендеринг, віджети, старі проєкти, сторінка з одного HTML-файлу. Підключіть один тег `<script>` і прив’яжіть властивості об’єкта до елементів просто в JavaScript — розмітку змінювати не потрібно. Проєкт розвивається з 2013 року; версія 3.0 — це один пакет з ES-модулями та типами TypeScript, без залежностей.

**Розмір:** `matreshka.min.js` важить %size-min% кБ у мініфікованому вигляді, %size-gzip% кБ зі стисненням gzip і %size-brotli% кБ з brotli — так CDN віддає його сучасним браузерам. `matreshka.core.min.js`, те саме без роутера й парсера форм, важить %core-size-brotli% кБ з brotli.

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

Щоб дати мовній моделі всю документацію одним файлом, скопіюйте в чат [llms-full.txt](/ua/llms-full.txt).

Документація також є [англійською](/) і [російською](/ru/).
