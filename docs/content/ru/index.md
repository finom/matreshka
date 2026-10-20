---
title: "JavaScript фреймворк с двусторонним связыванием данных | Matreshka.js"
description: "Matreshka.js — JavaScript фреймворк с двусторонним связыванием данных для готового HTML: один тег script, без сборки и без зависимостей."
sidebarTitle: "Главная"
---

# Matreshka.js

```html
<input class="in" type="text">
<output class="out"></output>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
const app = new Matreshka();
app.bindNode('x', '.in, .out');
app.x = 'Простой фреймворк для создания одностраничных веб-приложений';
</script>
```

## Зачем Matreshka

Для страниц, у которых HTML уже готов: серверный рендеринг, виджеты, старые проекты, страница из одного HTML-файла. Подключите один тег `<script>` и привяжите свойства объекта к элементам прямо в JavaScript — разметку менять не нужно. Проект развивается с 2013 года; версия 3.0 — это один пакет с ES-модулями и типами TypeScript, без зависимостей.

**Размер:** `matreshka.min.js` весит %size-min% кБ в минифицированном виде, %size-gzip% кБ со сжатием gzip и %size-brotli% кБ с brotli — так CDN отдает его современным браузерам.

## Фичи

- Реактивный API, позволяющий эффективно решать сложные и запутанные задачи
- Меньше ошибок в коде
- Возможность рефакторинга легаси приложений, без переписывания с нуля
- Освоить фреймворк можно за пару часов благодаря отсутствию сложных концепций

Подробнее во [введении](/ru/introduction/), или сразу к [справочнику API](/ru/api/).

## Установка

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';
```

Для ИИ-агентов, которые пишут код (Claude Code, Cursor, Codex и других), добавьте скилл Matreshka:

```sh
npx skills add finom/matreshka
```

Чтобы дать языковой модели всю документацию одним файлом, скопируйте в чат [llms-full.txt](/ru/llms-full.txt).

Документация также есть [на английском](/) и [на украинском](/ua/).
