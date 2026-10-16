---
title: "Matreshka.parserBrackets"
sidebarTitle: "parserBrackets"
description: "Matreshka.parserBrackets: Содержит скобки для парсера. Matreshka.js справочник API"
importance: 3
---

# Matreshka.parserBrackets

**Свойство** · Начиная с версии 1.5

**Импорт:**

```js
import { parserBrackets } from 'matreshka';
```

```js
Matreshka.parserBrackets: object
```

Содержит скобки для [парсера](/ru/api/matreshka/parse-bindings/)

Объект ``parserBrackets`` позволяет изменить стандартный синтаксис парсера привязок. Он содержит два свойства: ``left`` (левая скобка, по умолчанию "\{\{") и ``right`` (правая скобка, по умолчанию "\}\}")

В качестве скобок можно задать любые символы.

## Примеры

**Заменяет поведение парсера, используя синтаксис ``[[=property]]`` вместо ``{{property}}``**

```js
Matreshka.parserBrackets.left = '[[=';
Matreshka.parserBrackets.right = ']]';
```
