---
title: "Matreshka.parserBrackets"
sidebarTitle: "parserBrackets"
description: "Matreshka.parserBrackets: Містить дужки для парсера. Matreshka.js довідник API"
importance: 3
---

# Matreshka.parserBrackets

**Властивість** · Починаючи з версії 1.5

**Імпорт:**

```js
import { parserBrackets } from 'matreshka';
```

```js
Matreshka.parserBrackets: object
```

Містить дужки для [парсера](/ua/api/matreshka/parse-bindings/)

Об'єкт ``parserBrackets`` дозволяє змінити стандартний синтаксис парсеру прив'язок. Він містить дві властивості: ``left`` (ліва дужка, за замовчуванням "\{\{") і ``right`` (права дужка, за замовчуванням "\}\}")

Дужками можуть бути будь-які символи. Стара назва ``Matreshka.parserBrackers`` залишена як псевдонім того самого об'єкта.

## Приклади

**Замінює поведінку парсеру, використовуючи синтаксис ``[[=property]]`` замість ``{{property}}``**

```js
Matreshka.parserBrackets.left = '[[=';
Matreshka.parserBrackets.right = ']]';
```
