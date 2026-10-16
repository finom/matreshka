---
title: "Привязка данных к готовому HTML | Matreshka.js"
sidebarTitle: "Главная"
description: "Matreshka.js привязывает объекты JavaScript к HTML, который уже есть на странице: двусторонняя привязка, вычисляемые значения, списки. Тег script или npm."
---

# Matreshka.js

Введите текст в поле: свойство `x` привязано к обоим элементам.

```html
<input class="in" type="text">
<output class="out"></output>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
const { bindNode } = Matreshka;
const app = {};
bindNode(app, 'x', '.in, .out');
app.x = 'Привязка данных к готовому HTML';
</script>
```

## Зачем Matreshka

Для страниц, у которых HTML уже готов: серверный рендеринг, виджеты, старые проекты, страница из одного HTML-файла. Подключите один тег `<script>` и привяжите свойства объекта к элементам прямо в JavaScript — разметку менять не нужно. Проект развивается с 2013 года; версия 3.0 — это один пакет с ES-модулями и типами TypeScript.

Подробнее — во [введении](/ru/introduction/) и в [справочнике API](/ru/api/matreshka/).

## Установка

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
```

```sh
npm install matreshka
```

```js
import { bindNode, calc, binders } from 'matreshka';
```

Для ИИ-агентов, которые пишут код (Claude Code, Cursor, Codex и других), добавьте скилл Matreshka:

```sh
npx skills add finom/matreshka
```

Документация также доступна [на английском](/) и [на украинском](/ua/).
