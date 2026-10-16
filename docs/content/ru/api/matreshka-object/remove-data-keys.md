---
title: "Matreshka.Object#removeDataKeys"
sidebarTitle: "removeDataKeys"
description: "Matreshka.Object#removeDataKeys: Удаляет заданные имена свойств из списка имен свойств, отвечающих за данные (но не удаляет само свойство)"
importance: 2
---

# Matreshka.Object#removeDataKeys

**Метод**

```js
Matreshka.Object#removeDataKeys(keys) → matreshkaObject
```

Удаляет заданные имена свойств из списка имен свойств, отвечающих за данные (но не удаляет само свойство)

Событие ``remove`` генерируется раньше ``modify``, как и в [`Matreshka#remove`](/ru/api/matreshka/remove/).

**Возвращает:** [`matreshkaObject`](/ru/api/types/matreshka-object/) – self

**Генерирует события:** `remove`, `modify`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `keys` | [`string`](/ru/api/types/string/) \| [`array`](/ru/api/types/array/) | Массив имен свойств либо список аргументов с именами свойств |

## Примеры

```js
this.removeDataKeys(['a', 'b']);
```

```js
this.removeDataKeys('a', 'b');
```
