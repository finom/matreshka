---
title: "Matreshka.Object#addDataKeys"
sidebarTitle: "addDataKeys"
description: "Matreshka.Object#addDataKeys: Добавляет заданные имена свойств в список имен свойств, отвечающих за данные"
importance: 1
---

# Matreshka.Object#addDataKeys

**Метод**

```js
Matreshka.Object#addDataKeys(keys) → matreshkaObject
```

Добавляет заданные имена свойств в список имен свойств, отвечающих за данные

Этот метод применяется тогда, когда нужно объявить свойства, отвечающие за данные, но значения этих свойств еще не известны.

**Возвращает:** [`matreshkaObject`](/ru/api/types/matreshka-object/) – self

**Генерирует события:** `set`, `modify`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `keys` | [`string`](/ru/api/types/string/) \| [`array`](/ru/api/types/array/) | Массив имен свойств либо список аргументов с именами свойств |

## Примеры

```js
this.addDataKeys(['a', 'b']);
```

```js
this.addDataKeys('a', 'b');
```
