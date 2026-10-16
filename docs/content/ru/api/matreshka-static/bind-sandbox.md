---
title: "Matreshka.bindSandbox"
sidebarTitle: "bindSandbox"
description: "Matreshka.bindSandbox: Связывает свойство sandbox с элементом и отвязывает предыдущий элемент, если таковой существует"
importance: 3
---

# Matreshka.bindSandbox

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { bindSandbox } from 'matreshka';
```

```js
Matreshka.bindSandbox() → object
```

Связывает свойство ``sandbox`` с элементом и отвязывает предыдущий элемент, если таковой существует

Этот статичный метод работает так же, как и [`Matreshka#bindSandbox`](/ru/api/matreshka/bind-sandbox/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#bindSandbox`](/ru/api/matreshka/bind-sandbox/)

## Примеры

```js
const object = {};
Matreshka.bindSandbox(object, '.my-node');
```
