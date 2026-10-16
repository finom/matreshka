---
title: "Matreshka.bindSandbox"
sidebarTitle: "bindSandbox"
description: "Matreshka.bindSandbox: Пов'язує властивість sandbox з елементом і одв'язує попередній елемент, якщо такий існує"
importance: 3
---

# Matreshka.bindSandbox

**Метод**

**Імпорт:**

```js
import { bindSandbox } from 'matreshka';
```

```js
Matreshka.bindSandbox() → object
```

Пов'язує властивість ``sandbox`` з елементом і одв'язує попередній елемент, якщо такий існує

Цей статичний метод працює так само, як і [`Matreshka#bindSandbox`](/ua/api/matreshka/bind-sandbox/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#bindSandbox`](/ua/api/matreshka/bind-sandbox/)

## Приклади

```js
const object = {};
Matreshka.bindSandbox(object, '.my-node');
```
